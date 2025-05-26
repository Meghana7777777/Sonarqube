import React, { useEffect, useState } from "react";
import { Table, Input, Button, TableProps, Tooltip, Card } from "antd";
import { MOConfigService } from "@xpparel/shared-services";
import { MOC_MoLineOrderRevisionModel, MOC_MoLineProductOrderRevisionModel, MOC_MoOrderRevisionModel, MOC_MoOrderRevisionRequest, MOC_MoProdCodeRequest, MOC_MoSubLineQtyModel, OrderTypeDisplayValues } from "@xpparel/shared-models";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { ColumnsType } from "antd/es/table";

interface SOC_SoOrderRevisionRequest {
    moPk: number;
    moNumber: string;
    moLineRevisions: SOC_SoLineOrderRevisionModel[];
}

interface SOC_SoLineOrderRevisionModel {
    moLineNumber: string;
    moLinePk: number;
    moNumber: string;
    productLevelRevisions: SOC_SoLineProductOrderRevisionModel[];
}

interface SOC_SoLineProductOrderRevisionModel {
    styleCode: string;
    productCode: string;
    fgColor: string;
    oqTypeQtys: SOC_SoSubLineQtyModel[];
}

interface SOC_SoSubLineQtyModel {
    oqType: OrderTypeEnum;
    sizeQtys: {
        subLineId?: number;
        size: string;
        qty: number;
    }[];
}

enum OrderTypeEnum {
    ORIGINAL = 'OR',
    SAMPLE = 'SA',
    EXTRA_SHIPMENT = 'ES',
}

interface soLineTableObj {
    soLine: string;
    product: string;
    fgColor: string;
    oqType: OrderTypeEnum;
    percentage: number;
    rowSpan: number;
    style: string;
    [key: string]: any;
}


interface SoLineTableProps {
    moNumber: string;
}
const originalKey = 'ORG';
const MoQuantityUpdate: React.FC<SoLineTableProps> = ({ moNumber }) => {

    const [tableData, setTableData] = useState<soLineTableObj[]>([]);
    const [savedData, setSavedData] = useState<any[]>([]);
    const [orderQtyData, setOrderQtyData] = useState<MOC_MoOrderRevisionModel>(undefined);
    const user = useAppSelector((state) => state.user.user.user);
    const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
    const [columns, setColumns] = useState<ColumnsType<soLineTableObj>>([]);
    const moConfigService = new MOConfigService();
    useEffect(() => {
        getOrderDetails(moNumber)
    }, [moNumber]);


    const getOrderDetails = (moNumberLoc: string) => {
        const request = new MOC_MoProdCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, moNumberLoc, undefined, undefined, undefined);
        moConfigService.getOrderRevisionForMo(request).then(res => {
            if (res.status) {
                setOrderQtyData(res.data);
                constructTblData(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })
    }
    const handleInputChange = (value: string, column: keyof soLineTableObj, index: number) => {
        setTableData(prevData =>
            prevData.map((row, arrayIndex) =>
                arrayIndex === index
                    ? { ...row, [column]: Number(value) || 0 }
                    : row
            )
        );
    };

    const handlePercentageSave = (sizes: string[], index) => {
        setTableData(prevData =>
            prevData.map((row, arrayIndex) => {
                if (arrayIndex === index) {
                    const percentage = row.percentage / 100;
                    const updateSizeValues = Object();

                    sizes.forEach((size) => {
                        if (size in row) {
                            updateSizeValues[size] = Math.round(row[`${originalKey}-${size}`] * percentage)
                        }
                    })
                    return {
                        ...row,
                        ...updateSizeValues
                    };
                }
                return row;
            })
        );
    };
    console.log(tableData)
    const constructTblData = (orderQtyDataP: MOC_MoOrderRevisionModel) => {
        const uniqueSizesSet = new Set<string>();
        const formattedData = orderQtyDataP.moLineRevisions.flatMap(soLine =>
            soLine.productLevelRevisions.flatMap(product => {
                const originalOQTypeQty = product.oqTypeQtys.find(qty => qty.oqType === OrderTypeEnum.ORIGINAL);
                const lineWiseSizes: string[] = [];
                const originalSizeQtys = originalOQTypeQty?.sizeQtys.reduce((acc, sizeQty) => {
                    uniqueSizesSet.add(sizeQty.size);
                    lineWiseSizes.push(sizeQty.size);
                    acc[`${originalKey}-${sizeQty.size}`] = sizeQty.qty;
                    return acc;
                }, {});


                return Object.values(OrderTypeEnum).map((oqType, index) => {
                    const oqTypeQty = product.oqTypeQtys.find(qty => qty.oqType === oqType);

                    const sizeQtys = oqTypeQty ? oqTypeQty.sizeQtys.reduce((acc, sizeQty) => {
                        acc[sizeQty.size] = sizeQty.qty;
                        return acc;
                    }, {}) : {};
                    const existingSizeQtys = lineWiseSizes.reduce((acc, size) => {
                        acc[size] = sizeQtys[size] ? sizeQtys[size] : 0;
                        return acc;
                    }, {});

                    return {
                        soLine: soLine.moLineNumber,
                        product: product.productCode,
                        fgColor: product.fgColor,
                        oqType,
                        percentage: 0,
                        style: product.styleCode,
                        rowSpan: index === 0 ? Object.values(OrderTypeEnum).length : 0,
                        ...originalSizeQtys,
                        ...existingSizeQtys

                    };
                });
            })
        )
        const sizes = Array.from(uniqueSizesSet.values());
        setUniqueSizes(sizes);
        setTableData(formattedData);
        constructColumns(sizes);
    }
    const constructColumns = (sizes: string[]) => {
        const basicColumns = [
            {
                title: "SO Line",
                dataIndex: "soLine",
                key: "soLine",
                render: (text, record) => ({
                    children: text,
                    props: { rowSpan: record.rowSpan },
                }),
            },
            {
                title: "Product",
                dataIndex: "product",
                key: "product",
                render: (text, record) => ({
                    children: text,
                    props: { rowSpan: record.rowSpan },
                }),
            },
            {
                title: "FG Color",
                dataIndex: "fgColor",
                key: "fgColor",
                render: (text, record) => ({
                    children: text,
                    props: { rowSpan: record.rowSpan },
                }),
            },
            { title: "OQ Type", dataIndex: "oqType", render: (v) => OrderTypeDisplayValues[v] },
            {
                title: "Percentage",
                dataIndex: "percentage",
                key: "percentage",
                width: "200px",
                // render: (text, record) => (
                //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                //         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                //             <Input
                //                 style={{ width: "100px" }}
                //                 value={record.percentage}
                //                 onChange={(e) => handleInputChange(e.target.value, record.soLine, record.product, record.fgColor, record.oqType, "percentage")}
                //             />
                //             <Button type="primary" onClick={() => handlePercentageSave(record.soLine, record.product, record.fgColor, record.oqType)}>
                //                 Save
                //             </Button>
                //         </div>
                //     </div>
                // )
                render: (text, record, index) =>
                    record.oqType !== OrderTypeEnum.ORIGINAL ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Input
                                    style={{ width: "100px" }}
                                    value={record.percentage}
                                    onChange={(e) => handleInputChange(e.target.value, "percentage", index)}
                                    onPressEnter={(e) => handlePercentageSave(sizes, index)}
                                />
                                <Button type="primary" size="small" onClick={() => handlePercentageSave(sizes, index)}>
                                    calculate
                                </Button>
                            </div>
                        </div>
                    ) : null,
            },


        ];
        const sizeColumns = sizes.map(size => {
            return {
                title: size,
                dataIndex: size,
                width: "140px",
                render: (text, record: soLineTableObj, index) => {
                    const shouldRenderInput = record.oqType !== OrderTypeEnum.ORIGINAL && size in record;
                    return shouldRenderInput ?
                        <Input
                            style={{ width: "100px" }}
                            value={text}
                            onChange={(e) => handleInputChange(e.target.value, size, index)}
                        /> : text ? text : '_'
                },
            }
        });
        const allColumns: ColumnsType<soLineTableObj> = [...basicColumns, ...sizeColumns];
        setColumns(allColumns);
    }

    const handleSave = () => {
        console.log(tableData)
        const moLineMap = new Map<string, MOC_MoLineOrderRevisionModel>();
        tableData.forEach(row => {
            if (!moLineMap.has(row.soLine)) {
                moLineMap.set(row.soLine, new MOC_MoLineOrderRevisionModel(row.soLine, undefined, moNumber, []))
            }
            const getLineData = moLineMap.get(row.soLine);

            const styleProdColorData = getLineData.productLevelRevisions.find(e => e.productCode == row.product && e.styleCode == row.style && e.fgColor == row.fgColor)
            if (!styleProdColorData) {
                const orderQtyObj = new MOC_MoLineProductOrderRevisionModel(row.style, row.product, row.fgColor, []);
                const orderTypeSizeQtyObj = getSizeWise(uniqueSizes, row);
                orderQtyObj.oqTypeQtys.push(orderTypeSizeQtyObj);
                getLineData.productLevelRevisions.push(orderQtyObj);
            } else {
                const orderTypeSizeQtyObj = getSizeWise(uniqueSizes, row);
                styleProdColorData.oqTypeQtys.push(orderTypeSizeQtyObj);
            }
        })



        const request = new MOC_MoOrderRevisionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, moNumber, Array.from(moLineMap.values()));
        moConfigService.saveOrderRevisionForMo(request).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })
    };
    const getSizeWise = (sizes: string[], row: soLineTableObj) => {
        const orderTypeSizeQtyObj = new MOC_MoSubLineQtyModel(row.oqType, []);
        uniqueSizes.forEach(size => {
            if (size in row) {
                orderTypeSizeQtyObj.sizeQtys.push({ size, qty: row[size] });
            }
        });
        return orderTypeSizeQtyObj;
    }


    return (
        <Card title='Order Qty Update' size="small" bordered={true} style={{ marginTop: 16 }} bodyStyle={{ padding: 16 }}>
            <div>
                <Table columns={columns} dataSource={tableData} bordered pagination={false} size="small" scroll={{x: 'max-content'}} style={{minWidth: '100%', marginTop: '10px'}} />
            </div>
            <div style={{ display: 'flex', justifyContent: "flex-end", marginBottom: "8px" }} >
                <Tooltip title={orderQtyData?.isMoProceeded ? "This MO  has already been Proceeded" : "Click to Save Quantity Update"}>
                    <Button type="primary" style={{ marginTop: 16 }} disabled={orderQtyData?.isMoProceeded} onClick={handleSave} >Save</Button>
                </Tooltip>
            </div>
            {/* {savedData.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                    <h3>Saved Data</h3>
                    <Table
                        columns={columns}
                        dataSource={savedData}
                        bordered
                        pagination={false}
                        size="small"
                    />
                </div>
            )} */}
        </Card>
    );
};

export default MoQuantityUpdate;