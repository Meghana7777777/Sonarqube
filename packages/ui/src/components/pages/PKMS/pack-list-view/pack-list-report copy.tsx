import { FileExcelFilled } from "@ant-design/icons";
import { PKMSPackListViewResponseDto, PackIdRequest, PackListIdRequest } from "@xpparel/shared-models";
import { PackListService } from "@xpparel/shared-services";
import { Button, Card } from "antd";
import ExcelJS from 'exceljs';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import './list.css';
interface IPackListReport {
    selectedPackListId: number[];
};

class PackListHtmlTableInterface {
    block: string;
    country: string;
    ctn: number;
    plId: number;
    color: {
        color: string
        colorsRatio: { color: string, ratio: number[] }[];
        colorsQty: { color: string, qty: number[] }[];
    }[];
    constructor(
        block: string,
        country: string,
        ctn: number,
        plId: number,
        color: {
            color: string
            colorsRatio: { color: string, ratio: number[] }[],
            colorsQty: { color: string, qty: number[] }[],
        }[]
    ) {
        this.block = block;
        this.country = country;
        this.ctn = ctn;
        this.plId = plId;
        this.color = color;
    }
}


const PackListReportPDF = (props: IPackListReport) => {
    const { selectedPackListId } = props;
    const service = new PackListService();
    const [data, setData] = useState<PKMSPackListViewResponseDto[]>([]);
    const [details, setDetails] = useState<any>({});
    const [columns, setColumns] = useState<any[]>([]);
    const [column, setColumn] = useState<any[]>([]);
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;
    const [packListData, setPackListData] = useState<PackListHtmlTableInterface[]>([]);
    const [sizeColumns, setSizeColumns] = useState<{ size: string }[]>([]);


    useEffect(() => {
        if(selectedPackListId.length > 0)
        handlePackListChange(selectedPackListId);
    }, [selectedPackListId]);



    const exportExcel = async () => {

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        const tableData = prepareTableData();
        const qtyData = qtyTableData();
        worksheet.getCell('A1').value = 'SQ BIRICHINA LTD';
        worksheet.getCell('A2').value = 'PLOT 221,222,223, JAMIRDIA, VALUKA, MYMENSHINGH, BANGLADESH';
        worksheet.mergeCells('A1:K1');
        worksheet.mergeCells('A2:K2');
        worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.getCell('A1').font = {
            color: { argb: 'FF000000' },
            bold: true,
            size: 14,
        };

        worksheet.getCell('A2').font = {
            color: { argb: 'FF000000' },
            size: 12,
        }
        const headers = [
            "BUYER", "ORDER NO", "ITEM", "ORDER QTY", "TODAY INSP", "SHORT/EXCESS",
            "PERCENTAGE(%)"
        ];
        worksheet.getCell('B5').value = details.buyer;
        worksheet.getCell('B6').value = details.PONo;
        worksheet.getCell('B7').value = details.item;
        worksheet.getCell('B8').value = ' '
        worksheet.getCell('B9').value = ''
        worksheet.getCell('B10').value = ' '
        worksheet.getCell('B11').value = ''

        worksheet.mergeCells('A14:B14');

        for (let i = 0; i < headers.length; i++) {
            const headerCell = worksheet.getCell(`A${i + 5}`);
            headerCell.value = headers[i];

            headerCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFFFF' },
            };

            headerCell.font = {
                color: { argb: 'FF000000' },
                bold: true
            };

            headerCell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } }
            };
        }


        function getExcelColumnName(index) {
            let columnName = '';
            while (index >= 0) {
                columnName = String.fromCharCode(index % 26 + 65) + columnName;
                index = Math.floor(index / 26) - 1;
            }
            return columnName;
        }

        columns.forEach((column, index) => {
            const colLetter = getExcelColumnName(index);
            const headerCell = worksheet.getCell(`${colLetter}18`);
            headerCell.value = column.title;
            worksheet.getColumn(colLetter).width = column.width || 20;

            headerCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFFFF' }
            };

            headerCell.font = {
                color: { argb: 'FF000000' },
                bold: true
            };

            headerCell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } }
            };
        });

        tableData.forEach((rowData, rowIndex) => {
            columns.forEach((column, colIndex) => {
                const colLetter = getExcelColumnName(colIndex);
                const rowLetter = rowIndex + 19;
                const columnKey = column.dataIndex;
                const value = rowData[columnKey] !== undefined ? rowData[columnKey] : '';
                const cell = worksheet.getCell(`${colLetter}${rowLetter}`);
                cell.value = value;

                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } }
                };
            });
        });

        const qtyStartRowIndex = tableData.length + 19 + 5;

        const qtyStartColumnIndex = tableData.length;
        column.forEach((column, index) => {
            const colLetter = String.fromCharCode(65 + qtyStartColumnIndex + index);
            const headerCell = worksheet.getCell(`${colLetter}${qtyStartRowIndex}`);
            headerCell.value = column.title;

            worksheet.getColumn(colLetter).width = column.width || 20;

            headerCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFFFF' }
            };

            headerCell.font = {
                color: { argb: 'FF000000' },
                bold: true
            };
            headerCell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } }
            };
        });

        const empty = [];
        let previousColor = '';
        let startRow = null;

        qtyData.forEach((parent) => {
            const childColumns = Object.keys(parent);
            childColumns.splice(0, 7);
            [{ titleName: 'ORD QTY', dataIndex: "orderQty" }, { titleName: 'PACKED QTY', dataIndex: "pkdQty" }, { titleName: 'DIFF', dataIndex: "diff" }, { titleName: '%', dataIndex: "percentage" }]
                .forEach((child) => {
                    const obj = {
                        color: parent.color,
                        qtysName: child.titleName,
                    };

                    childColumns.forEach((siz) => {
                        let calculations;
                        if (child.dataIndex === "orderQty") {
                            calculations = parent.orderQty;
                        } else if (child.dataIndex === "pkdQty") {
                            calculations = parent[siz];
                        } else if (child.dataIndex === "diff") {
                            calculations = parent.orderQty - parent[siz];
                        } else if (child.dataIndex === "percentage") {
                            calculations = ((parent[siz] / parent.orderQty) * 100).toFixed(2);
                        }

                        Object.assign(obj, { [siz]: calculations });
                    });

                    empty.push(obj);
                });
        });

        empty.forEach((rowData, rowIndex) => {
            const rowLetter = rowIndex + qtyStartRowIndex + 1;
            if (rowData.color !== previousColor && startRow !== null) {
                const colLetter = String.fromCharCode(65 + qtyStartColumnIndex);
                worksheet.mergeCells(`${colLetter}${startRow}:${colLetter}${rowLetter - 1}`);
            }

            if (rowData.color !== previousColor) {
                startRow = rowLetter;
            }

            previousColor = rowData.color;

            column.forEach((column, colIndex) => {
                const colLetter = String.fromCharCode(65 + qtyStartColumnIndex + colIndex);
                const cell = worksheet.getCell(`${colLetter}${rowLetter}`);
                cell.value = rowData[column.dataIndex] || '';

                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } }
                };
            });
        });

        if (startRow !== null) {
            const colLetter = String.fromCharCode(65 + qtyStartColumnIndex);
            worksheet.mergeCells(`${colLetter}${startRow}:${colLetter}${empty.length + qtyStartRowIndex}`);
            const mergedCell = worksheet.getCell(`${colLetter}${startRow}`);
            mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
        }

        const startRowIndex = qtyData.length + 19 + 5;
        const descriptionRows = [
            "TOTAL QTY",
            "TOTAL CARTON",
            "TOTAL NET WEIGHT",
            "TOTAL GROSS WEIGHT",
            "TOTAL CBM",
            "CARTON MEASUREMENT"
        ];

        const descriptionStartRowIndex = startRowIndex + empty.length + 5;

        descriptionRows.forEach((desc, index) => {
            const rowIndex = descriptionStartRowIndex + index;
            const headerCell = worksheet.getCell(`A${rowIndex}`);
            headerCell.value = desc;

            headerCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFFFF' },
            };

            headerCell.font = {
                color: { argb: 'FF000000' },
                bold: true,
            };

            headerCell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
            };

            const valueCell = worksheet.getCell(`B${rowIndex}`);
            valueCell.value = details[desc.toLowerCase().replace(/\s+/g, '')] || '';
            valueCell.border = headerCell.border;
        });
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'packList.xlsx';
        link.click();
    };


    //pdf print
    const printToPdf = () => {
        const input = document.getElementById('pId');
        if (input) {
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgWidth = 190;
                const pageHeight = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 10;
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('PackList.pdf');
            });
        }
    };

    const getPackListDetails = (packListId: number) => {
        const req = new PackListIdRequest(userName, orgData.unitCode, orgData.companyCode, userId, packListId);
        service.getPackListDetails(req).then((res) => {
            if (res.status) {
                setDetails(res.data);
            } else {
                setDetails({});
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    const getPackListData = (packListId: number[]) => {
        const req = new PackIdRequest(userName, orgData.unitCode, orgData.companyCode, userId, packListId);
        service.getPackListData(req).then((res) => {
            if (res.status) {
                const data: PKMSPackListViewResponseDto[] = res.data.data;
                const packListParentMap = new Map<string, PackListHtmlTableInterface>();
                const colorsQtyMap = new Map<string, { color: string; qty: number[]; }[]>();
                const colorsRatioMap = new Map<string, { color: string; ratio: number[]; }[]>();
                const colorsMap = new Map<string, { color: string }[]>();
                for (const packList of data) {
                    const dataForBlocks = new PackListHtmlTableInterface(packList.block, packList.country, packList.noOfCartons, packList.plId, []);
                    if (!colorsMap.has(packList.block)) {
                        colorsMap.set(packList.block, [{ color: packList.color }])
                    } else {
                        colorsMap.get(packList.block).push({ color: packList.color })
                    }
                    if (!colorsQtyMap.has(packList.block + packList.color)) {
                        colorsQtyMap.set(packList.block + packList.color, [{ color: packList.color, qty: [packList.qty] }]);
                    } else {
                        const setColors = colorsQtyMap.get(packList.block + packList.color)
                        setColors.forEach(col => col.qty.push(packList.qty))
                    }
                    if (!colorsRatioMap.has(packList.block + packList.color)) {
                        colorsRatioMap.set(packList.block + packList.color, [{ color: packList.color, ratio: [packList.ratio] }]);
                    } else {
                        const setColors = colorsRatioMap.get(packList.block + packList.color)
                        setColors.forEach(col => col.ratio.push(packList.ratio))
                    }
                    packListParentMap.set(packList.block, dataForBlocks)
                };

                packListParentMap.forEach((packList, key) => {
                    const colors = new Set(colorsMap.get(key).map(colors => colors.color));

                    [...colors].map((color) => {
                        const qty = colorsQtyMap.get(key + color)
                        const ratios = colorsRatioMap.get(key + color)
                        packList.color.push({
                            color: color,
                            colorsRatio: ratios,
                            colorsQty: qty
                        })
                    })
                })

                const result = Array.from(packListParentMap.values()).flatMap(rec => rec);
                console.log(result,'result')
                setPackListData(result)
                setData(res.data.data);
                setSizeColumns(res.data.columns);
                getColumns(res.data.columns);
                getChildTableColumns(res.data.columns);
            } else {
                setData([]);
            };
        }).catch((err) => {
            console.log(err);
        });
    };



    const getColumns = (sizes: { size: string }[]) => {
        const sizeColumn: any[] = sizes.map((s) => ({
            title: s.size,
            dataIndex: '',
            render: (v) => (v ? v : 0)
        }));

        const tableColumns = [];
        tableColumns.push(
            {
                title: 'Block',
                dataIndex: 'block',
                key: 'block'
            },
            {
                title: 'Country',
                dataIndex: '',
                key: ''
            },
            {
                title: 'CTN',
                dataIndex: 'Ctn',
                key: 'Ctn'
            },

            {
                title: 'COLOR CODE',
                dataIndex: 'color',
                key: 'color'
            },
            ...sizeColumn,

            {
                title: 'TTL CTNS',
                dataIndex: 'Ctn',
            },
            {
                title: 'PACKCS',
                dataIndex: 'packcs',
            },
        );


        setColumns(tableColumns);
    };

    const childcol = [
        {
            title: 'Color',
            dataIndex: 'color'
        },
        {
            title: 'Order Qty',
            dataIndex: 'orderQty'
        },
        {
            title: 'Ship Qty',
            dataIndex: 'shipQty'
        },
        {
            title: 'SHORT/EXCESS',
            dataIndex: 'shortExcess'
        },
        {
            title: '%',
            dataIndex: 'per'
        },
    ]



    const getChildTableColumns = (sizesData: any[]) => {


        const childColumns: any = [
            {
                title: 'Color Code',
                dataIndex: 'color',
            },
            {
                title: 'Size',
                dataIndex: 'qtysName',
            },
        ];
        sizesData.flatMap((rec) =>
            rec.size.map((s) => (
                childColumns.push(
                    {
                        title: s.size,
                        dataIndex: s.size
                    }
                )
            ))
        );
        setColumn(childColumns)

    }


    const handlePackListChange = (value: number[]) => {
        getPackListData(value);
        //0 for all packList deatils are same 
        getPackListDetails(value[0]);
    };


    const prepareTableData = () => {
        const formattedData = [];

        data.forEach((item, index) => {
            const existingColor = formattedData.find((row) => row.color === item.color);

            if (existingColor) {
                existingColor[item.size] = (item.ratio || 0)
                existingColor.pcs += (item.ratio)
            } else {
                const newRow = {
                    sno: index + 1,
                    color: item.color,
                    ratio: item.ratio,
                    Ctn: item.noOfCartons,
                    packcs: item.packcs,
                    block: item.block,
                    [item.size]: item.ratio,
                    orderQty: item.orderQty
                };
                formattedData.push(newRow);
            }
        });

        return formattedData;
    };


    const qtyTableData = () => {
        const formattedData = [];
        data.forEach((item) => {
            const existingColor = formattedData.find((row) => row.color === item.color);
            if (existingColor) {
                // existingColor[item.size] = (item.ratio * item.ttlCtn);
            } else {
                const newRow = {
                    block: item.block,
                    color: item.color,
                    country: '',
                    orderQty: item.orderQty,
                    shipQty: 0,
                    orderQtyKey: 'Ord Qty(Pks)',
                    shipQtyKey: 'Ship Qty(Pks)',
                    // shortExcess: item.shipQty - item.orderQty || 0,
                    // per: Number((item.shipQty - item.orderQty) / item.orderQty).toFixed(2) || 0
                };
                formattedData.push(newRow);
            }
        });
        return formattedData;
    };

    const renderTable = (tableData: any[], tableColumns: any[]) => {
        return (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        {tableColumns.map((col: any) => (
                            <th key={col.title} style={{ border: '1px solid black', padding: '8px' }}>
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((rowData: any, rowIndex: number) => (
                        <tr key={rowIndex}>
                            {tableColumns.map((col: any) => {
                                return (
                                    <td key={col.title} style={{ border: '1px solid black', padding: '8px' }}>
                                        {rowData[col.dataIndex] || 0}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderSubTable = (tableData: any[], childcol: any[]) => {
        return (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        {childcol.map((col: any) => (
                            <th key={col.title} style={{ border: '1px solid black', padding: '8px' }}>{col.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((rowData: any, rowIndex: number) => (
                        <tr key={rowIndex}>
                            {childcol.map((col: any) => {
                                return <td key={col.title} style={{ border: '1px solid black', padding: '8px' }}>
                                    {rowData[col.dataIndex] || 0}
                                </td>
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderChildTable = (tableData: any[], tableColumns: any[]) => {
        const childColumns = Object.keys(tableData?.[0] ? tableData?.[0] : {})
        childColumns.splice(0, 7);
        const sizes = [];
        return (
            <table style={{ borderCollapse: 'collapse', width: '70%' }}>
                <thead>
                    <tr>
                        <th key={"block"} style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>{"Block"}</th>
                        <th key={"Country"} style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>{"Country"}</th>
                        <th key={"Color"} style={{ border: '1px solid black', padding: '8px' }}>{"Color"}</th>
                        <th key={"Ord Qty(Pks)"} style={{ border: '1px solid black', padding: '8px' }}>{"Ord Qty(Pks)"}</th>
                        <th key={"Ship Qty(Pks)"} style={{ border: '1px solid black', padding: '8px' }}>{"Ship Qty(Pks)"}</th>
                        <th key={"SHORT/Excess"} style={{ border: '1px solid black', padding: '8px' }}>{"SHORT/Excess"}</th>

                    </tr>
                </thead>
                <tbody>
                    {tableData.map((rowData: any, rowIndex: number) => {
                        return <>
                            <tr style={{ border: '1px solid black', padding: '8px' }} key={rowIndex}>
                                <td rowSpan={rowIndex} style={{ border: '1px solid black', padding: '8px' }}>{rowData?.block}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{ }</td>
                            </tr>
                            <tr style={{ border: '1px solid black', padding: '8px' }} key={rowIndex}>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{ }</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{rowData?.color}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{rowData?.orderQty}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{0}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{rowData?.shortExcess || 0}</td>
                            </tr>

                        </>
                    })}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            <Card
                title="Pack List Data"
                extra={
                    <>
                        <Button
                            type="default"
                            style={{ color: '#047595', backgroundColor: '#e8dbdb' }}
                            icon={<FileExcelFilled />}
                            onClick={exportExcel}
                        >
                            Export Excel
                        </Button>
                        <Button type="default"
                            style={{ marginLeft: 3, color: 'red', backgroundColor: '#e8dbdb' }}
                            icon={<FileExcelFilled />}
                            onClick={printToPdf}>Pdf</Button>
                    </>

                }
            >
                <div id="pId">
                    <table>
                        <tr>
                            <td style={{ textAlign: 'center', marginLeft: 0 }}>
                                <h1>SQ BIRICHINA LTD</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center', marginLeft: 0 }}>
                                <h3>PLOT 221,222,223, JAMIRDIA, VALUKA, MYMENSHINGH, BANGLADESH</h3>
                            </td>
                        </tr>
                        <td></td>
                        <br></br>
                        <tr>
                            <td style={{ paddingLeft: 650 }} ><strong>Date :-</strong>
                                {details.exfactory}
                            </td>
                        </tr>
                        <tr>
                            <tr >
                                <td><strong>Buyer</strong></td>
                                <td>{details.buyer}</td>
                            </tr>
                            <tr>
                                <td><strong>ORDER NO</strong></td>
                                <td>{details.PONo}</td>
                            </tr>
                            <tr>
                                <td><strong>ITEM</strong></td>
                                <td>{details.item}</td>
                            </tr>
                            <tr>
                                <td><strong>ORDER QTY</strong></td>
                                <td>{details.quantity}</td>
                            </tr>
                            <tr>
                                <td><strong>TODAY INSP</strong></td>
                                <td>{''}</td>
                            </tr>
                            <tr>
                                <td><strong>SHORT/EXCESS</strong></td>
                                <td>{''}</td>
                            </tr>
                            <tr>
                                <td><strong>PERCENTAGE(%)</strong></td>
                                <td>{''}</td>
                            </tr>
                            <td ></td>
                            <td></td>
                        </tr>
                        <br></br>
                        <br></br>
                        {/* {renderTable(prepareTableData(), columns)} */}
                        <tr>
                            {packListData.map((packList) => {
                                return <table style={{ borderCollapse: 'collapse', width: '80%' }}>
                                    <tr style={{ border: '1px solid black', padding: '8px' }}>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} rowSpan={packList.color.length}>Block</th>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>Country</th>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>CTN</th>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>Color</th>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} colSpan={sizeColumns?.length}>SIZE / RATIO</th>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >Total</th>
                                    </tr>
                                    <tr style={{ border: '1px solid black', padding: '8px' }}>
                                        <td style={{ border: '1px solid black', padding: '8px' }}></td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}></td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}></td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}></td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}></td>
                                        {sizeColumns.map((size) => {
                                            return <td style={{ border: '1px solid black', padding: '8px' }}>{size.size}</td>
                                        })}
                                        <td style={{ border: '1px solid black', padding: '8px' }}></td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid black', padding: '8px' }}>
                                        <td style={{ border: '1px solid black', padding: '8px' }} rowSpan={packList?.color.length}>{packList?.block}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }} rowSpan={packList?.color.length}>{packList?.country}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }} rowSpan={packList?.color.length}>{packList?.ctn}</td>
                                        {packList?.color.map((rec) => {
                                            return <>
                                                <td style={{ border: '1px solid black', padding: '8px' }}>{rec.color + "Ratio"}</td>
                                                {rec.colorsQty.map((qty) => {
                                                    return <>
                                                        <td style={{ border: '1px solid black', padding: '8px' }}>{qty.qty}</td>
                                                    </>
                                                })}
                                                {rec.colorsRatio.map((ratio) => {
                                                    return <>
                                                        <td style={{ border: '1px solid black', padding: '8px' }}>{ratio.ratio}</td>
                                                    </>
                                                })}
                                                <td style={{ border: '1px solid black', padding: '8px' }}>{rec.color + "Quantity"}</td>

                                            </>
                                        })}
                                    </tr >

                                </table>
                            })}
                        </tr>
                        <br></br>
                        <br></br>
                        {renderChildTable(qtyTableData(), column)}
                        <br></br>
                        {renderSubTable(qtyTableData(), childcol)}
                        <br></br>
                        <br></br>
                        <table>
                            <tr  >
                                <td style={{ paddingLeft: 400 }}></td>
                                <tr >
                                    <td><strong>TOTAL QTY:</strong></td>
                                    <td>{ }</td>
                                </tr>
                                <tr>
                                    <td><strong>TOTAL CARTON:</strong></td>
                                    <td>{ }</td>
                                </tr>
                                <tr>
                                    <td><strong>TOTAL NET WEIGHT:</strong></td>
                                    <td>{ }</td>
                                </tr>
                                <tr>
                                    <td><strong>TOTAL GROSS WEIGHT:</strong></td>
                                    <td>{ }</td>
                                </tr>
                                <tr>
                                    <td><strong>TOTAL CBM:</strong></td>
                                    <td>{''}</td>
                                </tr>
                                <tr>
                                    <td><strong>CARTON MEASUREMENT :</strong></td>
                                    <td>{details.ctnDmn}</td>
                                </tr>
                                <tr>
                                    <td><strong>MERCHANDISE ARE FROM BANGLADESH ORIGIN</strong></td>
                                </tr>
                                <td ></td>
                                <td></td>
                            </tr>
                        </table>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default PackListReportPDF;
