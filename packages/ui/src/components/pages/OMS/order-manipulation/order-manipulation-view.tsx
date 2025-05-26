import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Descriptions, Divider, Popconfirm, Row, Space, Table, Tag } from 'antd';
import type { DescriptionsProps } from 'antd';
import { ProcessTypeEnum, PackMethodEnum, RawOrderInfoModel, RawOrderNoRequest, MoProductStatusEnum, PhItemCategoryEnum } from '@xpparel/shared-models';
import { ColumnsType } from 'antd/es/table';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useAppSelector } from 'packages/ui/src/common';
import { OrderManipulationServices } from '@xpparel/shared-services';
import { AlertMessages } from '../../../common';

interface ISkuMapping {
    orderNo: string;
    orderLineNo: string;
    itemNo: string;
    productCode: string;
    productType?: string;
    skus: string[];
}
interface IColorSize {
    index: number;
    orderNo: string;
    orderLineNo: string;
    itemNo: string;
    productCode: string;
    productType?: string;
    skus: string[];
    color: string;
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
const OrderManipulationView = (props: IProps) => {
    const [rawOrderInfo, setRawOrderInfo] = useState<RawOrderInfoModel>();
    const [skuMappingColumns, setSkuMappingColumns] = useState<ColumnsType<ISkuMapping>>([]);
    const [skuMappingTblData, setSkuMappingTblData] = useState<ISkuMapping[]>([]);
    const [colorQtyColumns, setColorQtyColumns] = useState<ColumnsType<IColorSize>>([]);
    const [colorQtyUpdateTblData, setColorQtyUpdateTblData] = useState<IColorSize[]>([]);
    const [moConfirmed, setMoConfirmed] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.user.user);
    const omsManipulationService = new OrderManipulationServices();
    // Initialize component state and set up data retrieval
    useEffect(() => {
        if (props.orderIdPk) {
            getRawOrderInfo(props.orderIdPk)
        }
    }, [])
    const getRawOrderInfo = (orderIdPk: number) => {
        const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, orderIdPk, undefined, undefined, undefined, true, true, false, true, false);
        // omsManipulationService.getRawOrderInfo(req).then((res => {
        //     if (res.status) {
        //         const data = res.data[0];
        //         setRawOrderInfo(data);
        //         setMoConfirmed(data.moConfirmed);
        //         constructSkuMappingTableData(data);
        //         constructColorQtyTableData(data);

        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // })).catch(error => {
        //     AlertMessages.getErrorMessage(error.message)
        // });
    }

    const constructSkuMappingTableData = (rawOrderInfo: RawOrderInfoModel) => {
        setRawOrderInfo(rawOrderInfo);
        const tblData: ISkuMapping[] = [];
        const itemCountObj = new Object();
        rawOrderInfo.orderLines.forEach(oLine => {
            if (!oLine.isOriginal) {
                if (!itemCountObj[oLine.orderLineNo]) {
                    itemCountObj[oLine.orderLineNo] = 0;
                }
                itemCountObj[oLine.orderLineNo] = itemCountObj[oLine.orderLineNo] + 1;
                const tblRecord: ISkuMapping = {
                    orderLineNo: oLine.orderLineNo,
                    itemNo: `item ${itemCountObj[oLine.orderLineNo]}`,
                    orderNo: rawOrderInfo.orderNo,
                    skus: [],
                    productCode: oLine.productCode,
                    productType: oLine.prodType
                }
                oLine.rmInfo.forEach(rmInfo => {
                    tblRecord.skus.push(rmInfo.iCode);
                });
                tblData.push(tblRecord);
            }
        });
        tblData.sort((a, b) => a.orderLineNo.localeCompare(b.orderLineNo));
        constructSkuTblColumns(rawOrderInfo, tblData)
        setSkuMappingTblData(tblData);

    }
    const constructSkuTblColumns = (rawOrderInfo: RawOrderInfoModel, tblData: ISkuMapping[]) => {
        const rmSkuMap = new Map<string, string[]>();
        const colspanTypeMap = new Map<string, IRowSpanIndex>();
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
        tblData.forEach((eachRecord, index) => {
            const { orderLineNo } = eachRecord;
            colspanTypeMap.set(orderLineNo, colspanTypeMap.has(orderLineNo) ? { start: colspanTypeMap.get(orderLineNo).start, end: colspanTypeMap.get(orderLineNo).end + 1 } : { start: index, end: 1 });
        })
        const columns: ColumnsType<ISkuMapping> = [
            {
                title: 'Mo Line',
                dataIndex: 'orderLineNo',
                align: 'center',
                width: 90,
                onCell: (_orderLineNo, index) => {
                    if (index === colspanTypeMap.get(_orderLineNo.orderLineNo).start) {
                        return { rowSpan: colspanTypeMap.get(_orderLineNo.orderLineNo).end };
                    } else {
                        return { rowSpan: 0 };
                    }
                }
            },
            {
                title: 'Product Name',
                dataIndex: 'productCode',
                align: 'center',
                width: 120,
                fixed: 'left',
            },
            {
                title: 'Product Type',
                dataIndex: 'productType',
                align: 'center',
                width: 300,
            },
            {
                title: 'Item Codes',
                dataIndex: 'skus',
                align: 'center',
                render: (skus, record, index) => {
                    return skus.join();
                }
            },
        ];
        setSkuMappingColumns(columns);
        return columns;
    }

    // Function to construct table data based on raw order information
    const constructColorQtyTableData = (rawOrderInfo: RawOrderInfoModel) => {
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
                    orderLineNo: oLine.orderLineNo,
                    itemNo: `item ${itemCountObj[oLine.orderLineNo]}`,
                    orderNo: rawOrderInfo.orderNo,
                    skus: [],
                    originalQty: Number(rawOrderInfo.quantity),
                    utilizedQty: 0,
                    color: oLine.fgColor,
                    productType: oLine.prodType,
                    productCode: oLine.productCode
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
        constructColorQtyUpdateTblColumns(rawOrderInfo, tblData)
        setColorQtyUpdateTblData(tblData);
    }
    // Function to construct table columns based on raw order information and table data
    const constructColorQtyUpdateTblColumns = (rawOrderInfo: RawOrderInfoModel, tblData: IColorSize[]) => {
        const rmSkuMap = new Map<string, string[]>();
        const sizes = rawOrderInfo.sizes ? rawOrderInfo.sizes : [];
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
        // const columnRowSpanMap = new Map<string, Map<String, {start: number, end: number}>>(); // The map of column name => col value => how many rows it spans 
        // Calculate row spans for table columns
        tblData.forEach((eachRecord, index) => {
            const { orderLineNo } = eachRecord;
            colspanTypeMap.set(orderLineNo, colspanTypeMap.has(orderLineNo) ? { start: colspanTypeMap.get(orderLineNo).start, end: colspanTypeMap.get(orderLineNo).end + 1 } : { start: index, end: 1 });

            // Object.keys(eachRecord).forEach(key => {
            //     if(!columnRowSpanMap.has(key)) {
            //         columnRowSpanMap.set(key, new Map<string, {start: number, end: number}>);
            //     }
            //     if(!columnRowSpanMap.get(key).has(eachRecord[key])) {
            //         columnRowSpanMap.get(key).set(eachRecord[key], {start: index, end: 0});
            //     }
            //     columnRowSpanMap.get(key).get(eachRecord[key]).end++;
            // });
        });
        // Define columns for the table
        const columns: ColumnsType<IColorSize> = [
            {
                title: 'Mo Line',
                dataIndex: 'orderLineNo',
                align: 'center',
                width: 90,
                fixed: 'left',
                // render:(_,record,index)=> {
                //     return record.orderLineNo
                // },
                onCell: (orderLineNo, index) => {
                    if (index === colspanTypeMap.get(orderLineNo.orderLineNo).start) {
                        return { rowSpan: colspanTypeMap.get(orderLineNo.orderLineNo).end };
                    } else {
                        return { rowSpan: 0 };
                    }
                }
            },            
            {
                title: 'Product Name',
                dataIndex: 'productCode',
                align: 'center',
                width: 90,
                fixed: 'left',
            },
            {
                title: 'Product Type',
                dataIndex: 'productType',
                align: 'center',
                width: 300,
                fixed: 'left',
            },
            // {
            //     title: 'Pending Qty',
            //     dataIndex: 'originalQty',
            //     // width: 120,
            //     align: 'right',
            //     fixed: 'left',
            //     render: (originalQty, record,) => {
            //         const qty = originalQty - record.utilizedQty;
            //         return <Tag color={qty < 0 ? '#ff0000' : qty == 0 ? '#87d068' : '#108ee9'}>{qty}</Tag>
            //     }
            // },
            {
                title: 'Color',
                dataIndex: 'color',
                // width: 155,
                align: 'center',
            },
        ];
        // Iterate through sizes and add corresponding columns
        sizes.forEach(size => {
            columns.push(
                {
                    title: size,
                    dataIndex: size,
                    width: 80,
                    align: 'center',
                    render: (val) => <div style={{ minWidth: '50px' }}>{val}</div>
                },
            )
        });
        // Set the constructed columns to the state
        setColorQtyColumns(columns);
        return columns;
    }
    // Function to save product type and SKU mapping
    const confirmMo = () => {
        const delReq = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, props.orderIdPk, undefined, undefined, undefined, true, false, false, true, false);
        omsManipulationService.confirmMo(delReq).then((res => {
            if (res.status) {
                setMoConfirmed(true);
                props.updateStep();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    }
    const unConfirmMo = () => {
        const delReq = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, props.orderIdPk, undefined, undefined, undefined, true, false, false, true, false);
        omsManipulationService.unConfirmMo(delReq).then((res => {
            if (res.status) {
                setMoConfirmed(false);
                props.updateStep();
                // setRawOrderInfo(undefined)
                // getRawOrderInfo(props.orderIdPk);
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    }
    return <Card><Descriptions title="">
        <Descriptions.Item label="Pack Method">{rawOrderInfo?.packMethod}</Descriptions.Item>
        <Descriptions.Item span={4} label="Sizes"><Col span={24}>{rawOrderInfo?.sizes.map((size, i) => <Tag style={{ minWidth: '55px', fontWeight: 'bold' }} color={i % 2 ? 'cyan' : 'green'}>{size}</Tag>)}</Col></Descriptions.Item>

    </Descriptions>
        <Divider>Item Code Information </Divider>
        <Row gutter={24}>
            <Col span={24}>
                <Table size='small' pagination={false} bordered dataSource={skuMappingTblData} columns={skuMappingColumns} />
            </Col>
        </Row>
        <Divider>Color & Size Wise Quantities </Divider>
        <Row gutter={24}>
            <Col span={24}>
                <Table size='small' scroll={{ x: true }} rowKey={(record: IColorSize) => record.index + 'k'} pagination={false} bordered dataSource={colorQtyUpdateTblData} columns={colorQtyColumns} rowClassName={(record) => { return record.isError ? 'order-update-validation' : '' }} />
            </Col>
        </Row>

        <Row justify="end">
            <Col span={4} style={{ marginTop: '10px' }}>
                <Space>
                {!moConfirmed ? 
                    <Popconfirm
                        title="Confirm Order"
                        description="Are you sure to Confirm this order ?"
                        onConfirm={confirmMo}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    // icon={<QuestionCircleOutlined  />}
                    >
                        <Button type="primary" size={'small'} disabled={ MoProductStatusEnum.CONFIRMED == rawOrderInfo?.productConfirmed}>Confirm</Button>
                    </Popconfirm>
                   :
                        <Popconfirm
                            title="Un Confirm Product type Sku Mapping"
                            description="Are you sure to Un Confirm this ?"
                            onConfirm={unConfirmMo}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                            <Button type="primary" size={'small'} danger disabled={ MoProductStatusEnum.CONFIRMED == rawOrderInfo?.productConfirmed}>Un Confirm</Button>
                        </Popconfirm>
                    }
                </Space>
            </Col>
        </Row>
    </Card>
}

export default OrderManipulationView;