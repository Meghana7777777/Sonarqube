import { useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { CommonRequestAttrs, SaleOrderPreviewData, SI_SoNumberRequest } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { SaleOrderCreationService, SizesService } from '@xpparel/shared-services';
import { AlertMessages } from 'packages/ui/src/components/common';

interface IProps {
    soNumber: string;
    confirmationStatus: (status: boolean) => void;
}

const SoPreview = (props: IProps) => {
    // Sample data that would be replaced with actual data from API
  

    const [orderData, setOrderData] = useState<SaleOrderPreviewData>();
    const [reportHtml, setReportHtml] = useState<string>('');
    const [sortedSizes, setSortedSizes] = useState<string[]>([]);
    const user = useAppSelector((state) => state?.user?.user?.user);
    const service = new SaleOrderCreationService();
    const sizeService = new SizesService();

    // Format date to dd-mm-yyyy
    const formatDate = (dateString: string) => {
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

    // Fetch sizes data only once when component mounts
    useEffect(() => {
        if (!user?.userName || !user?.orgData?.unitCode || !user?.orgData?.companyCode) {
            AlertMessages.getErrorMessage("User or organization data is missing");
            return;
        }

        const obj = new CommonRequestAttrs(
            user.userName,
            user.orgData.unitCode,
            user.orgData.companyCode,
            user.userId
        );

        sizeService.getAllSizes(obj)
            .then(res => {
                if (res.status) {
                    // Sort sizes from the service by sizeIndex and store for later use
                    const sortedData = [...res.data].sort((a, b) => a.sizeIndex - b.sizeIndex);
                    // Create a mapping of size codes to their index for future sorting
                    const sizeOrder = Object.fromEntries(sortedData.map((s, index) => [s.sizeCode, index + 1]));
                    // Store the size ordering in component state
                    setSortedSizes(sortedData.map(s => s.sizeCode) || []);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage || "Failed to fetch sizes");
                }
            })
            .catch(err => {
                AlertMessages.getErrorMessage(err.message || "An error occurred while fetching sizes");
            });
    }, []);

    useEffect(() => {
        const req = new SI_SoNumberRequest(
            user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId,
            props.soNumber,
            null, false, false, false, false, false, false, false
        );

        service.getSoPreviewData(req)
            .then((res) => {
                if (res.status) {
                    // Format any dates in the received data
                    const formattedData = { ...res.data?.[0] };

                    // Format the uploadDate if it exists
                    if (formattedData.uploadDate) {
                        formattedData.uploadDate = formatDate(formattedData.uploadDate);
                    }

                    // Format delivery dates in soLines if they exist
                    if (formattedData.soLines) {
                        formattedData.soLines = formattedData.soLines.map(line => ({
                            ...line,
                            deliveryDate: Array.isArray(line.deliveryDate) ?
                                line.deliveryDate.map(date => formatDate(date)) :
                                [formatDate(line.deliveryDate)] // Ensure it's always an array
                        }));
                    }

                    setOrderData(formattedData);
                    props.confirmationStatus(formattedData.isSoConfirmed == 1);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }, []);

    useEffect(() => {
        if (!orderData) return;

        // Extract all unique sizes across all SO lines and colors, ignoring product codes
        const allSizes = new Set<string>();
        orderData.soLines?.forEach(soLine => {
            soLine.colorSizes?.forEach(colorSize => {
                colorSize.sizeWiseQuantities?.forEach(sizeQty => {
                    if (sizeQty.size) {
                        allSizes.add(sizeQty.size);
                    }
                });
            });
        });

        // Sort the sizes based on the previously fetched size order
        const sizeArray = Array.from(allSizes);

        // Sort sizes using the order established from the API
        const orderedSizes = sortedSizes.length > 0
            ? sizeArray.sort((a, b) => {
                const indexA = sortedSizes.indexOf(a);
                const indexB = sortedSizes.indexOf(b);
                // If either size is not found in sortedSizes, push it to the end
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            })
            : sizeArray.sort(); // Fallback to alphabetical sorting if sortedSizes is empty

        // Generate HTML content for the report
        let reportContent = `
            <table class="report-table">
                <tr><td colspan="10" class="report-header-row" style="text-align:center">Order Details of SO - ${orderData.soNumber || '-'}</td></tr>
                <tr>
                    <td class="report-sub-header">SO Number</td>
                    <td colspan="6">${orderData.soNumber || '-'}</td>
                    <td class="report-sub-header">Upload Date</td>
                    <td colspan="2">${orderData.uploadDate || '-'}</td>
                </tr>
                <tr>
                    <td class="report-sub-header">Style</td>
                    <td colspan="6">${orderData.styleName || '-'}</td>
                    <td class="report-sub-header">Buyer</td>
                    <td colspan="2">${orderData.buyerName || '-'}</td>
                </tr>
                <tr>
                    <td class="report-sub-header">CO</td>
                    <td colspan="9">${orderData.coNumber || '-'}</td>
                </tr>
            </table>
        `;

        // Generate content for each SO line
        orderData.soLines?.forEach((soLine, index) => {
            reportContent += `
                ${index > 0 ? '<div class="section-space"></div>' : ''}
                <table class="report-table">
                    <tr>
                        <td class="report-sub-header">PO No</td>
                        <td colspan="2">${orderData.poNo || '-'}</td>
                        <td class="report-sub-header">Destination</td>
                        <td colspan="2">${Array.isArray(soLine.destination) ? soLine.destination.join(', ') : soLine.destination || '-'}</td>
                        <td class="report-sub-header">Delivery Date</td>
                        <td colspan="2">${Array.isArray(soLine.deliveryDate) ? soLine.deliveryDate.join(', ') : soLine.deliveryDate || '-'}</td>
                    </tr>
                    <tr>
                        <td class="report-sub-header">SO Line</td>
                        <td colspan="2">${soLine.soLineNumber || '-'}</td>
                        <td class="report-sub-header">Z feature</td>
                        <td colspan="2">${soLine.zFeature || '-'}</td>
                        <td class="report-sub-header">Product Code</td>
                        <td colspan="2">${Array.isArray(soLine.productCode) ? soLine.productCode.join(', ') : soLine.productCode || '-'}</td>
                    </tr>
                    <tr>
                        <td class="report-sub-header">Pack Method</td>
                        <td colspan="2">${orderData.packMethod || '-'}</td>
                        <td class="report-sub-header">Style Code</td>
                        <td colspan="2">${orderData.styleCode || '-'}</td>
                        <td class="report-sub-header">Product Type</td>
                        <td colspan="2">${Array.isArray(soLine.productType) ? soLine.productType.join(', ') : soLine.productType || '-'}</td>
                    </tr>
                </table>
            `;

            // Generate combined color and size table with one header for each SO line
            // reportContent += `<table class="report-table">
            //     <tr>
            //         <td class="report-sub-header">Color/Size</td>`;

            // orderedSizes.forEach(size => {
            //     reportContent += `<td class="report-cell">${size}</td>`;
            // });

            // reportContent += `<td class="report-sub-header">Total</td></tr>`;

            // Add rows for each color
            // Prepare size totals and row totals
            const sizeTotals: { [size: string]: number } = {};
            orderedSizes.forEach(size => sizeTotals[size] = 0);

            // Add rows for each color
            const productCodeMap: { [productCode: string]: typeof soLine.colorSizes } = {};
            
            soLine.colorSizes?.forEach(colorSize => {
                colorSize.sizeWiseQuantities?.forEach(sizeQty => {
                    
                    const code = sizeQty.productCode || 'Unknown';
                    if (!productCodeMap[code]) {
                        productCodeMap[code] = [];
                    }
                    let existingColor = productCodeMap[code].find(c => c.color === colorSize.color);
                    if (!existingColor) {
                        existingColor = { color: colorSize.color, sizeWiseQuantities: [] };
                        productCodeMap[code].push(existingColor);
                    }

                    // Add size-wise quantity
                    existingColor.sizeWiseQuantities.push(sizeQty);
                });
            });

            // Step 2: Generate a separate table for each productCode
            Object.entries(productCodeMap).forEach(([productCode, groupedColorSizes]) => {
                 if (!groupedColorSizes.length) return; 

                reportContent += `
        <div class="section-space"></div>
        <div><strong>Product :</strong> ${productCode}</div>
        <table class="report-table">
            <tr>
                <td class="report-sub-header">Color/Size</td>`;

                orderedSizes.forEach(size => {
                    reportContent += `<td class="report-sub-header">${size}</td>`;
                });

                reportContent += `<td class="report-sub-header">Total</td></tr>`;

                const sizeTotals: { [size: string]: number } = {};
                orderedSizes.forEach(size => sizeTotals[size] = 0);
                let overallTotal = 0;

                groupedColorSizes.forEach(colorSize => {
                    let colorTotal = 0;
                    reportContent += `<tr><td><strong>${colorSize.color}</strong></td>`;

                    orderedSizes.forEach(size => {
                        let totalQty = 0;

                        colorSize.sizeWiseQuantities?.forEach(sizeQty => {
                            if (sizeQty.size === size) {
                                totalQty += parseInt(sizeQty.qty) || 0;
                            }
                        });

                        colorTotal += totalQty;
                        sizeTotals[size] += totalQty;
                        overallTotal += totalQty;

                        reportContent += `<td class="report-cell">${totalQty || '-'}</td>`;
                    });

                    reportContent += `<td class="report-cell">${colorTotal || '-'}</td></tr>`;
                });

                // Total row
                reportContent += `<tr><td><strong>Total</strong></td>`;
                orderedSizes.forEach(size => {
                    reportContent += `<td class="report-cell">${sizeTotals[size] || '-'}</td>`;
                });
                reportContent += `<td class="report-cell"><strong>${overallTotal || '-'}</strong></td></tr>`;
                reportContent += `</table>`;
            });

        });

        setReportHtml(reportContent);
    }, [orderData, sortedSizes]);

    const handlePrint = () => {
        const printContents = document.getElementById('printable-area')?.innerHTML;
        const styles = document.getElementById('report-styles')?.innerHTML;

        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow && printContents && styles) {
            printWindow.document.write('<html><head><title>Sale Order Report</title>');
            printWindow.document.write(`<style>${styles}</style>`);
            printWindow.document.write('</head><body>');
            printWindow.document.write(`<div id="printable-area">${printContents}</div>`);
            printWindow.document.write('</body></html>');

            printWindow.document.close();

            // Wait for the new window to load before printing
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            };
        }
    };

    return (
        <div className="container">
            <Space
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: 10,
                    top: 60,
                    float: 'right'
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

            <style id="report-styles">
                {`
                .container {
                    font-family: Arial, sans-serif;
                }
                .report-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                    table-layout: fixed;
                }
                .report-table th, .report-table td {
                    border: 1px solid #e8e8e8;
                    padding: 8px;
                    font-size: 13px;
                    text-align: left;
                }
                .report-header-row {
                    background: #f1f1f1;
                    font-weight: bold;
                    text-align: center;
                    font-size: 14px;
                    padding: 10px;
                }
                .report-sub-header {
                    background: #e9e9e9;
                    font-weight: bold;
                }
                .report-cell {
                    text-align: center;
                }
                .report-number {
                    text-align: right;
                }
                .page-title {
                    text-align: center;
                    font-size: 20px;
                    margin-bottom: 20px;
                    font-weight: bold;
                }
                .section-space {
                    height: 20px;
                }
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-area, #printable-area * {
                        visibility: visible;
                    }
                    #printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    .print-button {
                        display: none;
                    }
                }
                `}
            </style>

            <div id="printable-area" dangerouslySetInnerHTML={{ __html: reportHtml }} />
        </div>
    );
};

export default SoPreview;