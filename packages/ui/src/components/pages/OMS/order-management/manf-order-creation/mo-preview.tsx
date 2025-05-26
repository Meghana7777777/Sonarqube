import { PrinterOutlined } from '@ant-design/icons';
import { ManufacturingOrderPreviewData, MoPreviewSizeWiseQuantities, MoPreviewBomInfo, SI_MoNumberRequest, CommonRequestAttrs } from '@xpparel/shared-models';
import { OrderCreationService, SizesService } from '@xpparel/shared-services';
import { Space, Button } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface IProps {
  moNumber: string,
  confirmationStatus: (status: boolean) => void;
}

const MOPreview = (props: IProps) => {
  const [jobData, setJobData] = useState<ManufacturingOrderPreviewData>({
    moNumber: "",
    uploadDate: "",
    styleName: "",
    buyer: "",
    poNo: "",
    styleCode: "",
    packMethod: "",
    isMoConfirmed: null,
    moLines: []
  });

  const [sizeOrder, setSizeOrder] = useState<Record<string, number>>({});
  const user = useAppSelector((state) => state.user.user.user);
  const service = new OrderCreationService();
  const sizeService = new SizesService();

  // Fetch size order once when component mounts
  useEffect(() => {
    const fetchSizeOrder = async () => {
      if (!user?.userName || !user?.orgData?.unitCode || !user?.orgData?.companyCode) {
        AlertMessages.getErrorMessage("User or organization data is missing");
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
        if (res.status) {
          const sortedData = [...res.data].sort((a, b) => a.sizeIndex - b.sizeIndex);
          const order = Object.fromEntries(sortedData.map((size, index) => [size.sizeCode, index + 1]));
          setSizeOrder(order);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage || "Failed to fetch sizes");
        }
      } catch (err) {
        AlertMessages.getErrorMessage(err.message || "An error occurred while fetching sizes");
      }
    };

    fetchSizeOrder();
  }, [user]);

  // Fetch MO data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const req = new SI_MoNumberRequest(
          user?.userName,
          user?.orgData?.unitCode,
          user?.orgData?.companyCode,
          user?.userId,
          props.moNumber,
          null,
          false, false, false, false, false, false, false, false, false, false, false
        );

        const res = await service.getMoPreviewData(req);
        if (res.status && res.data?.length > 0) {
          setJobData(res.data[0]);
          props.confirmationStatus(res?.data[0]?.isMoConfirmed);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      } catch (err) {
        AlertMessages.getErrorMessage(err.message);
      }
    };

    fetchData();
  }, [props.moNumber, user]);

  // Format date string to DD-MM-YYYY
  const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return '';

    return dateString
      .split(',')
      .map(str => {
        const trimmed = str.trim();
        const date = new Date(trimmed);
        if (isNaN(date.getTime())) return trimmed;

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      })
      .join(', ');
  };

  const groupColorSizesByProduct = (
    colorSizes: typeof jobData.moLines[0]["colorSizes"]
  ): Record<string, Record<string, MoPreviewSizeWiseQuantities[]>> => {
    const result: Record<string, Record<string, MoPreviewSizeWiseQuantities[]>> = {};

    colorSizes.forEach(colorSize => {
      colorSize.sizeWiseQuantities.forEach(sizeQty => {
        const product = sizeQty.productCode || 'Unknown';
        if (!result[product]) result[product] = {};
        if (!result[product][colorSize.color]) result[product][colorSize.color] = [];

        result[product][colorSize.color].push(sizeQty);
      });
    });

    return result;
  };

  // Memoize the size calculation
  const getAllSizes = useCallback((): string[] => {
    const allSizesSet = new Set<string>();

    jobData.moLines.forEach(moLine => {
      moLine.colorSizes.forEach(colorSize => {
        colorSize.sizeWiseQuantities.forEach(sizeQty => {
          allSizesSet.add(sizeQty.size);
        });
      });
    });

    return Array.from(allSizesSet)
      .sort((a, b) => (sizeOrder[a] || 99) - (sizeOrder[b] || 99));
  }, [jobData.moLines, sizeOrder]);

  // Memoize the generated sizes
  const sizes = useMemo(() => getAllSizes(), [getAllSizes]);

  // Function to generate color-size table head with all unique sizes
  const generateSizeTableHead = (sizes: string[]): string => {
    const sizeHeaders = sizes.map(size => `<td>${size}</td>`).join('');
    return `
      <tr class="header-row">
        <td>Color/Size</td>
        ${sizeHeaders}
        <td>Total</td>
      </tr>
    `;
  };

  // Function to generate a color-size row for a specific color and its sizes
  const generateColorSizeRow = (color: string, sizeWiseQuantities: MoPreviewSizeWiseQuantities[], allSizes: string[]): string => {
    // Create a map to store quantities by size
    const sizeQuantities = new Map<string, number>();

    // Initialize all sizes with 0 quantity
    allSizes.forEach(size => {
      sizeQuantities.set(size, 0);
    });

    // Sum quantities for each size across all product codes
    sizeWiseQuantities.forEach(sizeQty => {
      const currentQty = sizeQuantities.get(sizeQty.size) || 0;
      sizeQuantities.set(sizeQty.size, currentQty + (parseInt(sizeQty.qty?.toString() || "0", 10)));
    });

    const sizeCells = allSizes.map(size => {
      const qty = sizeQuantities.get(size) || 0;
      return `<td>${qty}</td>`;
    }).join('');

    // Calculate total quantity
    const totalQty = Array.from(sizeQuantities.values()).reduce((sum, qty) => sum + qty, 0);

    return `
      <tr>
        <td>${color}</td>
        ${sizeCells}
        <td>${totalQty}</td>
      </tr>
    `;
  };

  // Function to generate BOM rows
  const generateBomRows = (bomInfo: MoPreviewBomInfo[]): string => {
    if (!bomInfo || bomInfo.length === 0) {
      return '<tr><td colspan="7">No BOM information available</td></tr>';
    }

    return bomInfo.map(item => `
      <tr>
        <td>${item.routeProcess || ''}</td>
        <td>${item.itemCode || ''}</td>
        <td>${item.itemName || ''}</td>
        <td>${item.itemDesc || ''}</td>
        <td>${item.avgCons || ''}</td>
        <td>${item.wastage || ''}</td>
        <td>${item.requireQty || ''}</td>
      </tr>
    `).join('');
  };

  // Function to generate MO line detail sections
  const handlePrint = () => {
    const content = document.getElementById('printable-area')?.innerHTML;
    if (!content) return;

    const win = window.open('', '', 'width=800,height=600');
    if (!win) return;

    win.document.write(`
      <html>
      <head>
        <title> Manufacturing Order</title>
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            table-layout: fixed;
          }
          td, th {
            border: 1px solid #e8e8e8;
            padding: 6px;
            font-size: 12px;
            word-wrap: break-word;
          }
          th {
            background-color: #f2f2f2;
          }
          .header-row {
            background-color: #e6f7ff;
            font-weight: bold;
          }
          .sub-header-row {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr td:first-child {
            font-weight: 500;
          }
          img {
            max-width: 100px;
            height: auto;
            border: 1px solid #e8e8e8;
          }
          .center {
            text-align: center;
          }
          .order-header td {
            background-color: rgb(192, 192, 192);
            color: black;
            font-weight: bold;
          }
          .upload-date {
            background-color: rgb(193, 193, 193);
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  // Only render if we have MO lines
  if (!jobData.moLines || jobData.moLines.length === 0) {
    return <div>Loading manufacturing order data...</div>;
  }

  const firstMoLine = jobData.moLines[0];
  const colorSizeGroupedByProduct = groupColorSizesByProduct(firstMoLine.colorSizes);

  const colorSizeTables = Object.entries(colorSizeGroupedByProduct).map(
    ([productCode, colorMap]) => {
      const rows = Object.entries(colorMap).map(
        ([color, sizeWiseQuantities]) =>
          generateColorSizeRow(color, sizeWiseQuantities, sizes)
      ).join('');

      return `
        <td colspan="${sizes.length + 2}" style="margin-top:20px"><strong>Product:</strong>${productCode}</td>
      ${generateSizeTableHead(sizes)}
      ${rows}
    `;
    }
  ).join('');

  const bomRows = generateBomRows(firstMoLine.bomInfo);

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
          #printable-area th {
            background-color: #f2f2f2;
          }
          #printable-area .header-row {
            background-color:#e9e9e9;
            font-weight: bold;
          }
          #printable-area .sub-header-row {
            background-color:#e9e9e9;
            font-weight: bold;
          }
          #printable-area tr td:first-child {
            font-weight: 500;
          }
          #printable-area img {
            max-width: 100px;
            height: auto;
            border: 1px solid #e8e8e8;
          }
          #printable-area .center {
            text-align: center;
          }
          #printable-area .order-header td {
            background-color:#e9e9e9;
            color: black;
            font-weight: bold;
          }
          #printable-area .upload-date {
            background-color:#e9e9e9;
            font-weight: bold;
          }
        `}
      </style>

      <Space
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          top: 60,
          marginBottom: '10px',
          marginTop: '-10px',
          height: 30
        }}
      >
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          size="middle"
          onClick={handlePrint}
        >
          Print
        </Button>
      </Space>

      <div id="printable-area">
        <div dangerouslySetInnerHTML={{
          __html: `
            <table>
              <tr class="order-header">
                <td colspan="8" style="text-align: center;"><strong>Order Details of MO - ${jobData.moNumber}</strong></td>
                <td class="upload-date">Upload Date</td>
                <td colspan="2">${formatDateToDDMMYYYY(jobData.uploadDate)}</td>
              </tr>
                        <tr>
                <td style = "font-weight:bold;">MO No</td>
                <td colspan="6">${jobData.moNumber}</td>
                <td rowspan="2" style = "font-weight:bold;">Buyer</td>
                <td colspan="3" rowspan="2">${jobData.buyer}</td>
              </tr>
              <tr>
                <td style = "font-weight:bold;">Style</td>
                <td colspan="6">${jobData.styleName}</td>
              </tr>
              <tr>
                <td  style = "font-weight:bold;">PO No</td>
                <td colspan="2">${jobData.poNo}</td>
                <td  style = "font-weight:bold;">Destination</td>
                <td colspan="3">${firstMoLine.destination || ""}</td>
                <td  style = "font-weight:bold;">Delivery Date</td>
                <td colspan="3">${formatDateToDDMMYYYY(firstMoLine.deliveryDate) || ""}</td>
              </tr>
              <tr>
                <td style = "font-weight:bold;">MO Line</td>
                <td colspan="2">${firstMoLine.moLineNumber}</td>
                <td style = "font-weight:bold;">Z feature</td>
                <td colspan="3">${firstMoLine.zFeature || ""}</td>
                <td  style = "font-weight:bold;">Product Code</td>
                <td colspan="3">${firstMoLine.productCode || ""}</td>
              </tr>
              <tr>
                <td  style = "font-weight:bold;">Pack Method</td>
                <td colspan="2">${jobData.packMethod}</td>
                <td style = "font-weight:bold;">Style Code</td>
                <td colspan="3">${jobData.styleCode}</td>
                <td  style = "font-weight:bold;" >Product Type</td>
                <td colspan="3">${firstMoLine.productType || ""}</td>
              </tr>
             
            </table>
            <table>             
              ${colorSizeTables}
            </table>

            <table>
              <tr class="header-row">
                <td colspan="7">BOM</td>
              </tr>
              <tr class="sub-header-row">
                <td>Route Process</td>
                <td>Item Code</td>
                <td>Item Name</td>
                <td>Item Desc</td>
                <td>Avg Cons</td>
                <td>Wastage</td>
                <td>Require Qty</td>
              </tr>
              ${bomRows}
            </table>
          `
        }} />
      </div>
    </div>
  );
};

export default MOPreview;