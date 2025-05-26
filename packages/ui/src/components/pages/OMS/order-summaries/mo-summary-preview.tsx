import { PrinterOutlined } from '@ant-design/icons';
import { MoSummaryPreviewData, SI_MoNumberRequest, CommonRequestAttrs } from '@xpparel/shared-models';
import { configVariables, OrderCreationService, SizesService } from '@xpparel/shared-services';
import { Space, Button } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import React, { useEffect, useState, useCallback } from 'react';
import { AlertMessages } from '../../../common';

interface CompProps {
  moNumber: string;
  proceedingStatus: (status: boolean) => void;
}

const OrderReviewWithBOM = (props: CompProps) => {
  const service = new OrderCreationService();
  const sizeService = new SizesService();
  const user = useAppSelector((state) => state?.user?.user?.user);
  const baseUrl = configVariables?.APP_OMS_SERVICE_URL;

  const [jobData, setJobData] = useState<MoSummaryPreviewData>();
  const [sizes, setSizes] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);


  const fetchData = async () => {
    try {
      const req = new SI_MoNumberRequest(
        user?.userName,
        user?.orgData?.unitCode,
        user?.orgData?.companyCode,
        user?.userId,
        props?.moNumber,
        null,
        false, false, false, false, false, false, false, false, false, false, false
      );

      const res = await service?.getMoSummaryPreviewData(req);
      if (res?.status && res?.data?.length > 0) {
        const data = res.data[0];
        setJobData(data);
        props?.proceedingStatus(data?.isMoProceeded == 1);

        // Handle product image
        if (data?.productImage) {
          const images = data.productImage
            .split(',')
            .map(img => img.trim())
            .filter(img => !!img); // remove empty strings

          if (images.length > 0) {
            setProductImages(images.map(img => `${baseUrl}/oms-products-files/${img}`));
            // Or store the full list: setProductImages(images.map(img => `${baseUrl}/oms-products-files/${img}`));
          }
        }

      } else {
        AlertMessages?.getErrorMessage(res?.internalMessage || 'Failed to fetch data');
      }
    } catch (err) {
      AlertMessages?.getErrorMessage(err?.message || 'An error occurred');
    }
  };

 const fetchSizes = useCallback(async () => {
    if (!user?.userName || !user?.orgData?.unitCode || !user?.orgData?.companyCode) {
      AlertMessages?.getErrorMessage("User or organization data is missing");
      return;
    }

    try {
      const obj = new CommonRequestAttrs(
        user.userName,
        user.orgData.unitCode,
        user.orgData.companyCode,
        user.userId
      );

      const res = await sizeService.getAllSizes(obj);
      if (res?.status) {
        const standardSizes = res.data.sort((a, b) => a.sizeIndex - b.sizeIndex).map(s => s.sizeCode);

        const sizeSet = new Set<string>();
        jobData?.colorSizes?.forEach(colorSize => {
          colorSize?.sizeWiseQuantities?.forEach(sq => {
            if (sq?.size) sizeSet.add(sq.size);
          });
        });

        const knownSizes: string[] = [];
        const unknownSizes: string[] = [];

        Array.from(sizeSet).forEach(size => {
          if (standardSizes.includes(size)) {
            knownSizes.push(size);
          } else {
            unknownSizes.push(size); // Not found in standard list
          }
        });

        // Keep standard order first, then append unknown sizes at the end
        console.log('knownSizes', knownSizes);
        const orderedSizes = standardSizes.filter(size => knownSizes.includes(size)).concat(unknownSizes);
        setSizes(orderedSizes);
      } else {
        AlertMessages?.getErrorMessage(res?.internalMessage || "Failed to fetch sizes");
      }
    } catch (err) {
      AlertMessages?.getErrorMessage(err?.message || "An error occurred while fetching sizes");
    }
  }, [user, jobData?.colorSizes]);
 
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (jobData) {
      fetchSizes();
    }
  }, [jobData]);
  
// const groupedByProductCode = {};
// jobData?.colorSizes.forEach(cs => {
//   cs.sizeWiseQuantities.forEach(sq => {
//     const code = sq.productCode || 'Unknown';
//     if (!groupedByProductCode[code]) {
//       groupedByProductCode[code] = [];
//     }
//     groupedByProductCode[code].push(sq);
//   });
// });

  const generateSizeHeaders = () => {
    return sizes?.map(size => `<td class="center">${size}</td>`).join('') +
      '<td class="center">Total</td>';
  };


const generateColorSizeRows = () => {
  const grouped: Record<string, Record<string, any[]>> = {}; // productCode -> color -> array of sq

  jobData?.colorSizes?.forEach(cs => {
    cs?.sizeWiseQuantities?.forEach(sq => {
      const productCode = sq?.productCode || 'Unknown';
      const color = cs?.color || 'Unknown';

      if (!grouped[productCode]) grouped[productCode] = {};
      if (!grouped[productCode][color]) grouped[productCode][color] = [];

      grouped[productCode][color].push(sq);
    });
  });

  return Object.entries(grouped).map(([productCode, colorMap]) => {
    const rows = Object.entries(colorMap).map(([color, sqList]) => {
      const sizeQtyMap: Record<string, number> = {};
      sqList.forEach(sq => {
        const size = sq?.size;
        const qty = parseInt(sq?.qty) || 0;
        if (size) {
          sizeQtyMap[size] = (sizeQtyMap[size] || 0) + qty;
        }
      });

      const sizeCells = sizes.map(size => {
        const qty = sizeQtyMap[size] !== undefined ? sizeQtyMap[size] : '-';
        return `<td class="center">${qty}</td>`;
      }).join('');

      const totalQty = Object.values(sizeQtyMap).reduce((sum, qty) => sum + qty, 0);

      return `
        <tr>
          <td>${color}</td>
          ${sizeCells}
          <td class="center">${totalQty}</td>
        </tr>
      `;
    }).join('');

    return `
      <table>
        <tr>
          <td colspan="${sizes.length + 2}" style="margin-top:20px">
           <strong> Product: </strong>${productCode}
          </td>
        </tr>
        <tr class="header-row">
          <td>Color/Size</td>
          ${generateSizeHeaders()}
        </tr>
        ${rows}
      </table>
    `;
  }).join('');
};


  const generateBomRows = () => {
    return jobData?.colorSizes?.flatMap(cs => {
      return cs?.bom?.map(item => `
        <tr>
          <td>${item?.routeProcess || '-'}</td>
          <td>${item?.itemCode || '-'}</td>
          <td>${item?.itemName || '-'}</td>
          <td>${item?.itemDesc || '-'}</td>
          <td>${item?.avgCons || '-'}</td>
          <td>${item?.wastage || '-'}</td>
          <td>${item?.requireQty || '-'}</td>
          <td>${item?.fgColor || '-'}</td>
        </tr>
      `) || [];
    }).join('') || '';
  };

  const handlePrint = () => {
    const content = document.getElementById('printable-area')?.innerHTML;
    if (!content) return;
  
    const win = window.open('', '', 'width=800,height=600');
    if (!win) return;
  
    win.document.write(`
      <html>
      <head>
        <title> Mo Summary Report</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: fixed; }
          td, th { border: 1px solid #000; padding: 6px; font-size: 13px; word-wrap: break-word; }
          .header-row { font-weight: bold; text-align: center; background-color: #f2f2f2; }
          .center { text-align: center; }
          .product-image { max-height: 150px; max-width: 150px; border: 1px solid #e8e8e8; margin: 5px; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);
  
    win.document.close();
    setTimeout(() => {
      win.focus();
      win.print();
      setTimeout(() => win.close(), 500);
    }, 500);
  };

  const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const imageHtml = productImages
    .map(img => `<img src="${img}" alt="Product" class="product-image" />`)
    .join('');
  return (
    <div className="container" style={{ padding: '10px', width: '100%' }}>
      <style>
        {`
          #printable-area table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            table-layout: fixed;
          }
          #printable-area td, #printable-area th {
            border: 1px solid #e8e8e8;
            padding: 6px;
            font-size: 13px;
            word-wrap: break-word;
          }
          #printable-area .header-row {
            font-weight: bold;
            text-align: center;
            background-color:#e9e9e9;
          }
          #printable-area .center {
            text-align: center;
          }
          #printable-area .product-image {
            max-height: 150px;
            max-width: 150px;
            border: 1px solid #e8e8e8;
          }
          .order-header td {
            background-color:#e9e9e9;
            color: black;
            font-weight: bold;
          }
        `}
      </style>

      <Space style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginTop: -10 }}>
        <Button type="primary" icon={<PrinterOutlined />} size="middle" onClick={handlePrint}>
          Print
        </Button>
      </Space>

      <div id="printable-area">
        <div dangerouslySetInnerHTML={{
          __html: `
            <table>
              <tr class="order-header">
                <td colSpan="8" style="text-align: center;"><strong>Order Details of MO - ${jobData?.moNumber || '-'}</strong></td>
                <td><strong>Upload Date</strong></td>
                <td colSpan="2"><strong>${formatDateToDDMMYYYY(jobData?.uploadDate)}</strong></td>
              </tr>
              <tr>
                <td><strong>MO No</strong></td>
                <td colSpan="7">${jobData?.moNumber || '-'}</td>
                <td colSpan="3" rowSpan="22" style="vertical-align: top;">
                  <table style="border: none; width: 100%; height: 100%;">
                    <tr>
                      <td style="border: none; text-align: center;">Product Image</td>
                    </tr>
                    <tr>
                <td style="border: none; text-align: center;">
                     ${imageHtml}
                </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td><strong>Style</strong></td>
                <td colSpan="7">${jobData?.styleName || '-'}</td>
              </tr>
              <tr>
                <td><strong>PO No</strong></td>
                <td colSpan="7">${jobData?.poNo || '-'}</td>
              </tr>
              <tr>
                <td><strong>Yarn Type</strong></td>
                <td colSpan="7">${jobData?.yarnType || '-'}</td>
              </tr>
              <tr>
                <td><strong>Product Category</strong></td>
                <td colSpan="7">${jobData?.productType || '-'}</td>
              </tr>
              <tr>
                <td><strong>Buyer</strong></td>
                <td colSpan="7">${jobData?.buyerName || '-'}</td>
              </tr>
              <tr>
                <td><strong>Season</strong></td>
                <td colSpan="4">${jobData?.season || '-'}</td>
                <td><strong>Delivery Date</strong></td>
                <td colSpan="2">${formatDateToDDMMYYYY(jobData?.deliveryDate)}</td>
              </tr>
              <tr>
                <td><strong>CPO</strong></td>
                <td colSpan="4">${jobData?.cpo || '-'}</td>
                <td><strong>Garment Unit</strong></td>
                <td colSpan="2">${jobData?.garmentUnit || '-'}</td>
              </tr>
              <tr>
                <td colSpan="8"><strong>Special Remarks :</strong> ${jobData?.specialRemarks || '-'}</td>
              </tr>
            </table>

            <table>
              ${generateColorSizeRows()}
            </table>

            <table>
              <tr class="header-row">
                <td colSpan="8">BOM</td>
              </tr>
              <tr class="header-row">
                <td>Route Process</td>
                <td>Item code</td>
                <td>Item Name</td>
                <td>Item Desc</td>
                <td>Avg Cons</td>
                <td>Wastage</td>
                <td>Require Qty</td>
                <td>FG Color</td>
              </tr>
              ${generateBomRows()}
            </table>
          `
        }} />
      </div>
    </div>
  );
};

export default OrderReviewWithBOM;