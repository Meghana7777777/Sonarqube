import { QuestionCircleOutlined } from '@ant-design/icons';
import { RawOSLBreakdownnRequest, RawOSLRequest, RawOrderInfoModel, RawOrderLineBreakdownRequest, RawOrderNoRequest } from '@xpparel/shared-models';
import { OrderManipulationServices } from '@xpparel/shared-services';
import { Button, Card, Col, Input, InputNumber, Popconfirm, Row, Space, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import './order-manipulation.css';

interface IColorSize {
    index: number;
    orderNo: string;
    orderLineNo: string;
    orderLineId: number;
    itemNo: string;
    productType?: string;
    productCode: string;
    skus: string[];
    color: string;
    isHavingQty: boolean;
    originalQty: number;
    utilizedQty: number
    isError: boolean;
    [key: string]: any;
}
interface IRowSpanIndex {
    start: number;
    end: number;
}

interface IProps {
    orderIdPk: number;
    updateStep: () => void;
}
// Functional component responsible for color and quantity updating
const ColorQtyUpdating = (props: IProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    // Initialize component state and set up data retrieval
    useEffect(() => {
        if (props.orderIdPk) {
            getRawOrderInfo(props.orderIdPk)
        }
    }, [])
    // Component state variables
    const [rawOrderInfo, setRawOrderInfo] = useState<RawOrderInfoModel>();
    const [colorQtyColumns, setColorQtyColumns] = useState<ColumnsType<IColorSize>>([]);
    const [colorQtyUpdateTblData, setColorQtyUpdateTblData] = useState<IColorSize[]>([]);
    const [allSizes, setAllSizes] = useState<string[]>();
    const [stateKey, setStateKey] = useState<number>(0);
    const [dummyStateKey, setDummyStateKey] = useState<number>(0);
    const omsManipulationService = new OrderManipulationServices();
    const getRawOrderInfo = (orderIdPk: number) => {
        const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, orderIdPk, undefined, undefined, undefined, true, false, false, true, false);
        // omsManipulationService.getRawOrderInfo(req).then((res => {
        //     if (res.status) {
        //         const data = res.data[0];
        //         setRawOrderInfo(data);
        //         constructTableData(data);
        //         setStateKey(preState => preState + 1);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // })).catch(error => {
        //     AlertMessages.getErrorMessage(error.message)
        // });
    }
    // Function to construct table data based on raw order information
    const constructTableData = (rawOrderInfo: RawOrderInfoModel) => {
        setRawOrderInfo(rawOrderInfo);
        const tblData: IColorSize[] = [];
        const sizes = rawOrderInfo.sizes;
        const itemCountObj = new Object();
        rawOrderInfo.orderLines.forEach((oLine, i) => {
            if (!oLine.isOriginal) {
                let utilizedQty = 0;
                // Count items for each order line
                if (!itemCountObj[oLine.orderLineNo]) {
                    itemCountObj[oLine.orderLineNo] = 0;
                }
                itemCountObj[oLine.orderLineNo] = itemCountObj[oLine.orderLineNo] + 1;
                // Construct table record for each order line
                const tblRecord: IColorSize = {
                    index: i,
                    isError: false,
                    isHavingQty: false,
                    orderLineId: oLine.orderLineId,
                    orderLineNo: oLine.orderLineNo,
                    productCode: oLine.productCode,
                    itemNo: `item ${itemCountObj[oLine.orderLineNo]}`,
                    orderNo: rawOrderInfo.orderNo,
                    skus: [],
                    originalQty: Number(oLine.quantity),
                    utilizedQty: 0,
                    color: oLine.fgColor,
                    productType: oLine.prodType
                }
                // Initialize size columns to 0
                sizes.forEach(size => {
                    tblRecord[size] = 0;
                });
                // Populate table record with quantity and SKU information
                oLine.orderSubLines.forEach(oSubLine => {
                    utilizedQty += oSubLine.quantity;
                    tblRecord[oSubLine.size] = oSubLine.quantity;
                })
                oLine.rmInfo.forEach(rmInfo => {
                    tblRecord.skus.push(rmInfo.iCode);
                });
                tblRecord.utilizedQty = utilizedQty;
                // Update utilized quantity and error flag
                tblRecord.isError = utilizedQty > Number(rawOrderInfo.quantity);
                tblData.push(tblRecord);
            }
        });
        // Sort table data by order line number
        tblData.sort((a, b) => a.orderLineNo.localeCompare(b.orderLineNo));
        // Construct and set table columns
        constructTblColumns(rawOrderInfo, tblData)
        setColorQtyUpdateTblData(tblData);

    }
    // Function to change color for a given order line
    const changeColor = (color: string, orderLineRecord: IColorSize) => {
        orderLineRecord.color = color;
    }
    // Function to calculate utilized quantity for a given order line
    const calculateUtilizesQty = (orderLineRecord: IColorSize, uniqueSizes: string[]) => {
        const sumOfSizesQty = uniqueSizes.reduce((sum, size) => sum + Number(orderLineRecord[size]), 0);
        orderLineRecord.utilizedQty = sumOfSizesQty;
        orderLineRecord.isError = sumOfSizesQty > orderLineRecord.originalQty;
        setDummyStateKey(preState => preState + 1);
    }
    // Function to change size-wise quantity for a given order line
    const changeSizeWiseQty = (qty: number, size: string, orderLineRecord: IColorSize, uniqueSizes: string[]) => {
        orderLineRecord[size] = qty;
        orderLineRecord.isHavingQty = true;
        calculateUtilizesQty(orderLineRecord, uniqueSizes);
    }
    // Function to construct table columns based on raw order information and table data
    const constructTblColumns = (rawOrderInfo: RawOrderInfoModel, tblData: IColorSize[]) => {
        const rmSkuMap = new Map<string, string[]>();
        const sizes = rawOrderInfo.sizes ? rawOrderInfo.sizes : [];
        setAllSizes(sizes);
        const qty = rawOrderInfo.quantity;
        const colspanTypeMap = new Map<string, IRowSpanIndex>();
        // Extract SKU information for original order lines
        rawOrderInfo?.orderLines?.forEach(oLine => {
            if (oLine.isOriginal) {
                if (!rmSkuMap.has(oLine.orderLineNo)) {
                    rmSkuMap.set(oLine.orderLineNo, []);
                }
                oLine.rmInfo.forEach(rmInfo => {
                    rmSkuMap.get(oLine.orderLineNo).push(rmInfo.iCode);
                });

            }
        })
        // Calculate row spans for table columns
        tblData.forEach((eachRecord, index) => {
            const { orderLineNo, productCode } = eachRecord;
            colspanTypeMap.set(orderLineNo, colspanTypeMap.has(orderLineNo) ? { start: colspanTypeMap.get(orderLineNo).start, end: colspanTypeMap.get(orderLineNo).end + 1 } : { start: index, end: 1 });
            colspanTypeMap.set(productCode, colspanTypeMap.has(productCode) ? { start: colspanTypeMap.get(productCode).start, end: colspanTypeMap.get(productCode).end + 1 } : { start: index, end: 1 });
        });
        let packMethodConfirmed = rawOrderInfo?.moConfirmed;
        // Define columns for the table
        const columns: ColumnsType<IColorSize> = [
            {
                title: 'MO Line',
                dataIndex: 'orderLineNo',
                align: 'left',
                width: 10,
                fixed: 'left',
                // render:(_,record,index)=> {
                //     return record.orderLineNo
                // },
                // onCell: (orderLineNo, index,) => {
                //     if (index === colspanTypeMap.get(orderLineNo.orderLineNo).start) {
                //         orderLineNo.isHavingQty = true;
                //         return { rowSpan: colspanTypeMap.get(orderLineNo.orderLineNo).end };
                //     } else {
                //         return { rowSpan: 0 };
                //     }
                // }
            },
            {
                title: 'Product Name',
                dataIndex: 'productCode',
                align: 'left',
                width: 10,
                fixed: 'left',
                render: (val,rec,index)=> {
                   return  <Tooltip title={val}><span style={{wordBreak:'break-word'}}>{val}</span></Tooltip>
                }
            },
            {
                title: 'Product Type',
                dataIndex: 'productType',
                align: 'left',
                width: 10,
                fixed: 'left',
                render: (val,rec,index)=> {
                    return  <Tooltip title={val}><span style={{wordBreak:'break-word'}}>{val}</span></Tooltip>
                 }
            },
            {
                title: 'Order Qty',
                dataIndex: 'originalQty',
                width: 10,
                align: 'right',
                fixed: 'left',
                render: (originalQty, record,) => {
                    const qty = originalQty;
                    return <Tag color={'#87d068'}>{qty}</Tag>
                },
                // onCell: (orderLineNo, index,) => {
                //     if (index === colspanTypeMap.get(orderLineNo.orderLineNo).start) {
                //         return { rowSpan: colspanTypeMap.get(orderLineNo.orderLineNo).end };
                //     } else {
                //         return { rowSpan: 0 };
                //     }
                // }
            },
            {
                title: 'Balance Qty',
                dataIndex: 'originalQty',
                width: 10,
                align: 'right',
                fixed: 'left',
                render: (originalQty, record,) => {
                    const qty = originalQty - record.utilizedQty;
                    return <Tag color={qty < 0 ? '#ff0000' : qty == 0 ? '#87d068' : '#108ee9'}>{qty}</Tag>
                },
                // onCell: (orderLineNo, index,) => {
                //     if (index === colspanTypeMap.get(orderLineNo.orderLineNo).start) {
                //         return { rowSpan: colspanTypeMap.get(orderLineNo.orderLineNo).end };
                //     } else {
                //         return { rowSpan: 0 };
                //     }
                // }
            },
            {
                title: 'Color',
                dataIndex: 'color',
                align: 'left',
                width: 20,
                render: (color, record, index) => {
                    // Each Product code should have only one color that is why enabling first product code record and disabling rest
                    return <Input defaultValue={color} disabled={packMethodConfirmed || index !== colspanTypeMap.get(record.productCode).start} style={{ width: '150px' }} size='small' onChange={e => changeColor(e.target.value, record)} placeholder="Color" />
                }
            },
        ];
        // Iterate through sizes and add corresponding columns
        sizes.forEach(size => {
            columns.push(
                {
                    title: size,
                    dataIndex: size,
                    width: 10,
                    align: 'right',
                    render: (sizeVal, record, index) => {
                        return <InputNumber disabled={packMethodConfirmed} max={qty} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/[^0-9]/g, "")} min={0} style={{ width: '70px' }} size='small' defaultValue={sizeVal} onChange={e => changeSizeWiseQty(e, size, record, sizes)} placeholder="Size" />
                    },
                    // onCell: (orderLineNo, index,) => {
                    //     if (index === colspanTypeMap.get(orderLineNo.orderLineNo).start) {
                    //         return { rowSpan: colspanTypeMap.get(orderLineNo.orderLineNo).end };
                    //     } else {
                    //         return { rowSpan: 0 };
                    //     }
                    // }
                },
            )
        });
        // Set the constructed columns to the state
        setColorQtyColumns(columns);
        return columns;
    }
    const validations = () => {
        let isError = false;
        let errorMsg = '';

        for (const colorQtyObj of colorQtyUpdateTblData) {
            if (!colorQtyObj.color) {
                isError = true;
                errorMsg = `Color Should not be Empty for Line No ${colorQtyObj.orderLineNo}`;
                break;
            }
            if (colorQtyObj.isHavingQty) {
                const pendingQty = colorQtyObj.originalQty - colorQtyObj.utilizedQty;
                if (pendingQty != 0) {
                    isError = true;
                    errorMsg = pendingQty > 0 ? `There is pending quantity for Line No ${colorQtyObj.orderLineNo}` : `Pending quantity should be 0 for Line No ${colorQtyObj.orderLineNo}`;
                    break;
                }
            }
        }
        if (isError) {
            AlertMessages.getErrorMessage(errorMsg);
        }
        return isError;
    }
    // Function to save product type and SKU mapping
    const saveMOSizeQtysBreakdown = () => {
        
        const productCodeObj = new Object();
        const colorSizeQtyReq = colorQtyUpdateTblData.map(colorQtyObj => {
            // Each Product code should have only one color
            if (productCodeObj.hasOwnProperty(colorQtyObj.productCode)) {
                colorQtyObj.color = productCodeObj[colorQtyObj.productCode];
            } else {
                productCodeObj[colorQtyObj.productCode] = colorQtyObj.color;
            }
            let qtyObj = colorQtyObj;
            if (!colorQtyObj.isHavingQty) {
                qtyObj = colorQtyUpdateTblData.find(e => (e.orderLineNo == colorQtyObj.orderLineNo && e.isHavingQty == true));
            }

            const sizeQty = allSizes.map(s => {
                return new RawOSLRequest(qtyObj?.color, s, qtyObj?.[s], undefined, undefined, undefined);
            });
            return new RawOSLBreakdownnRequest(undefined, colorQtyObj.orderLineNo, colorQtyObj.orderLineId, colorQtyObj.productType, colorQtyObj.color, sizeQty)
        });
        const isError = validations();
        if (isError) {
            return;
        }
        const saveSizeOrderInfo = new RawOrderLineBreakdownRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, colorSizeQtyReq, props.orderIdPk);

        omsManipulationService.saveMoSizeQtysBreakdown(saveSizeOrderInfo).then((res => {
            if (res.status) {
                getRawOrderInfo(props.orderIdPk);
                props.updateStep();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    }

    const deleteMOSizeQty = () => {
        const delReq = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, props.orderIdPk, undefined, undefined, undefined, true, false, false, true, false);
        omsManipulationService.deleteMoSizeQtysBreakdown(delReq).then((res => {
            if (res.status) {
                setRawOrderInfo(undefined)
                getRawOrderInfo(props.orderIdPk);
                props.updateStep();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    }

    return (<Card size='small'>
        <Row gutter={24}>
            <Col span={24}>
                <Table scroll={{ x: 500 }} key={stateKey + 1 + 't'} rowKey={(record: IColorSize) => record.index + 'k'} pagination={false} bordered dataSource={colorQtyUpdateTblData} columns={colorQtyColumns} rowClassName={(record) => { return record.isError ? 'order-update-validation' : '' }} />
            </Col>
        </Row>
        <Row justify="end">
            <Col span={4} style={{ marginTop: '10px' }}>
                <Space>
                    <Button type="primary" onClick={saveMOSizeQtysBreakdown} size={'small'} disabled={rawOrderInfo?.moConfirmed}>Save</Button>
                    {rawOrderInfo?.sizeBreakDownDone &&
                        <Popconfirm
                            title="Delete Size Qty"
                            description="Are you sure to delete this ?"
                            onConfirm={deleteMOSizeQty}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                            <Button type="primary" size={'small'} danger disabled={rawOrderInfo?.moConfirmed}>Delete</Button>
                        </Popconfirm>
                    }
                </Space>
            </Col>
        </Row>
    </Card>)
};

export default ColorQtyUpdating;
