import { useEffect, useState } from 'react';
import { Button, Card, Col, Divider, Empty, Form, Input, InputNumber, Popconfirm, Row, Select, Space, Table, Tag } from 'antd';
import { PackMethodEnum, PackMethodEnumDisplayValues, RawOrderInfoModel, RawOrderLinesProdTypeSkuMapRequest, RawOrderNoRequest, RawOrderProdTypeSkuMapRequest, ManufacturingOrderItemRequest } from '@xpparel/shared-models';
import { ColumnsType } from 'antd/es/table';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useAppSelector } from 'packages/ui/src/common';
import { OrderManipulationServices, PackingListService, ProductTypeServices } from '@xpparel/shared-services';
import { AlertMessages } from '../../../common';
import FabricCodeQuantities from './fabric-code-quantites';

interface IitemSkuMappingProps {
    orderIdPk: number;
    updateStep: () => void;
}
interface ISkuMapping {
    orderNo: string;
    orderLineNo: string;
    itemNo: string;
    productType?: string;
    productCode: string;
    skus: string[];
}
interface IPackHeaderSkuMap {
    productCode: string;
    productType: string;
    isError: boolean;
    skus: string[];
}
interface IRowSpanIndex {
    start: number;
    end: number;
}

const ItemSkuMapping = (props: IitemSkuMappingProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [rawOrderInfo, setRawOrderInfo] = useState<RawOrderInfoModel>(undefined);
    useEffect(() => {
        if (rawOrderInfo) {
            getMoItemQty();
        }
    }, [rawOrderInfo]);
    useEffect(() => {
        if (props.orderIdPk) {
            getRawOrderInfo(props.orderIdPk);
            getAllProductTypes();
        }
    }, []);

    const { Option } = Select;
    const [skuMappingColumns, setSkuMappingColumns] = useState<ColumnsType<ISkuMapping>>([]);
    const [skuMappingTblData, setSkuMappingTblData] = useState<ISkuMapping[]>([]);
    const [productTypes, setProductTypes] = useState<string[]>([]);
    const [packMethod, setPackMethod] = useState<string>();
    const [packCount, setPackCount] = useState<number>();
    const [stateKey, setStateKey] = useState<number>(0);
    const [packHeaderTblData, setPackHeaderTblData] = useState<IPackHeaderSkuMap[]>([]);
    const [packHeaderTblColumns, setPackHeaderTblColumns] = useState<ColumnsType<IPackHeaderSkuMap>>([]);
    const omsManipulationService = new OrderManipulationServices();
    const productTypeService = new ProductTypeServices();
    const packlistService = new PackingListService()
    const [fabricCodeData, setFabricCodedata] = useState([])
    const getAllProductTypes = () => {
        const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, undefined, undefined, undefined, undefined, true, true, false, false, false);
        productTypeService.getAllProductTypes(req).then((res => {
            if (res.status) {
                const productTypesArray = res.data.map(e => e.productType);
                setProductTypes(productTypesArray);
            } else {
                // AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getRawOrderInfo = (orderIdPk: number) => {
        const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, orderIdPk, undefined, undefined, undefined, true, true, false, false, false);
        // omsManipulationService.getRawOrderInfo(req).then((res => {
        //     if (res.status) {
        //         const data = res.data[0];
        //         setPackCount(data.packMethods.length)
        //         setPackMethod(data.packMethod)
        //         setRawOrderInfo(data);
        //         constructTableData(data);
        //         constructPackHeaderTblColumns(data);
        //         constructPackHeaderTblData(data);
        //         setStateKey(preState => preState + 1);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // })).catch(error => {
        //     AlertMessages.getErrorMessage(error.message)
        // });
    }
    const constructTableData = (rawOrderInfoPar: RawOrderInfoModel) => {
        const tblData: ISkuMapping[] = [];
        const itemCountObj = new Object();
        rawOrderInfoPar.orderLines.forEach(oLine => {
            if (!oLine.isOriginal) {
                if (!itemCountObj[oLine.orderLineNo]) {
                    itemCountObj[oLine.orderLineNo] = 0;
                }
                itemCountObj[oLine.orderLineNo] = itemCountObj[oLine.orderLineNo] + 1;
                const tblRecord: ISkuMapping = {
                    orderLineNo: oLine.orderLineNo,
                    itemNo: `item ${itemCountObj[oLine.orderLineNo]}`,
                    orderNo: rawOrderInfoPar.orderNo,
                    productCode: oLine.productCode,
                    skus: [],
                    productType: oLine.prodType
                }
                oLine.rmInfo.forEach(rmInfo => {
                    tblRecord.skus.push(rmInfo.iCode);
                });
                tblData.push(tblRecord);
            }
        });
        // this sort function doing on backend services that's why commented here
        // tblData.sort((a, b) => a.orderLineNo.localeCompare(b.orderLineNo));
        constructTblColumns(rawOrderInfoPar, tblData)
        setSkuMappingTblData(tblData);

    }
    const changeProductType = (productType: string, orderLineRecord: ISkuMapping) => {
        orderLineRecord.productType = productType;
    }
    const changeRmskus = (rmSkus: string[], orderLineRecord: ISkuMapping) => {
        orderLineRecord.skus = rmSkus;
    }
    const changeHeaderProductType = (productType: string, orderLineRecord: IPackHeaderSkuMap) => {
        orderLineRecord.productType = productType;
    }
    const changeHeaderRmskus = (rmSkus: string[], orderLineRecord: IPackHeaderSkuMap) => {
        orderLineRecord.skus = rmSkus;
    }
    const changeProductCode = (productCode: string, orderLineRecord: IPackHeaderSkuMap) => {
        orderLineRecord.productCode = productCode;
    }
    const constructTblColumns = (rawOrderInfoPar: RawOrderInfoModel, tblData: ISkuMapping[]) => {
        const rmSkuMap = new Map<string, string[]>();
        const colspanTypeMap = new Map<string, IRowSpanIndex>();
        rawOrderInfoPar?.orderLines?.forEach(oLine => {
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
                title: 'MO Line',
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
                width: 200,
            },
            {
                title: 'Product Type',
                dataIndex: 'productType',
                align: 'center',
                width: 200,
                render: (productType, record, index) => {
                    return <Select
                        disabled
                        style={{ width: '100%' }}
                        size='small'
                        placeholder="Select Product Type"
                        onChange={(value) => changeProductType(value, record)}
                        defaultValue={productType}
                    >
                        {productTypes.map((prodType) => (
                            <Option key={index + prodType} value={prodType}>
                                {prodType}
                            </Option>
                        ))}
                    </Select>
                }
            },
            {
                title: 'Item Codes',
                dataIndex: 'skus',
                align: 'center',
                render: (skus, record, index) => {
                    return <Select
                        disabled
                        size='small'
                        mode="multiple"
                        placeholder="Select Sizes"
                        style={{ width: '100%' }}
                        defaultValue={skus}
                        onChange={(selectedValues) => changeRmskus(selectedValues, record)}
                    >
                        {rmSkuMap.get(record.orderLineNo).map((rmSku) => (
                            <Option key={index + rmSku} value={rmSku}>
                                {rmSku}
                            </Option>
                        ))}
                    </Select>
                }
            },
        ];
        setSkuMappingColumns(columns);
        return columns;
    }
    const changePackMethod = (packMethodVal: string) => {
        setPackMethod(packMethodVal);
        setPackCount(0);
        setPackHeaderTblData([]);
        setStateKey(preState => preState + 1);
        if (packMethodVal != PackMethodEnum.PACK) {
            constructPackTblDataForPackCount(packMethodVal);
        }
        // constructPackHeaderTblColumns(rawOrderInfo, packMethodVal);
    }
    const changePackCount = (packCountVal) => {
        setPackCount(packCountVal);
        setStateKey(preState => preState + 1);
        constructPackTblDataForPackCount(packMethod, packCountVal);
    }
    const constructPackHeaderTblData = (rawOrderInfoPar: RawOrderInfoModel) => {
        const packTbl = rawOrderInfoPar.packMethods.map(e => {
            const packObj: IPackHeaderSkuMap = {
                productCode: e.productName,
                productType: e.productType,
                isError: false,
                skus: e.iCodes
            }
            return packObj;
        });
        setPackHeaderTblData(packTbl);
    }
    const constructPackTblDataForPackCount = (packMethodVal: string, packCount: number = 1) => {
        const packTbl = Array.from({ length: packCount }, (_, i) => {
            const packObj: IPackHeaderSkuMap = {
                productCode: '',
                productType: undefined,
                isError: false,
                skus: []
            }
            return packObj;
        });
        setPackHeaderTblData(packTbl);
    }
    const deleteRecord = (i: number, packHeaderTblParm: IPackHeaderSkuMap[]) => {
        const removeReferenceData = JSON.parse(JSON.stringify(packHeaderTblParm))
        removeReferenceData.splice(i, 1);
        setStateKey(preState => preState + 1)
        setPackHeaderTblData(removeReferenceData);
    }
    const addRow = () => {
        setPackHeaderTblData(preState => [...preState, {
            productCode: '',
            productType: undefined,
            isError: false,
            skus: []
        }])
    }

    const constructPackHeaderTblColumns = (rawOrder: RawOrderInfoModel, packMethodParam?: string) => {
        const rmSkuSet = new Set<string>();
        rawOrder?.orderLines?.forEach(oLine => {
            if (oLine.isOriginal) {
                oLine.rmInfo.forEach(rmInfo => {
                    rmSkuSet.add(rmInfo.iCode);
                });
            }
        });

        const packMethodConfirmed = rawOrderInfo?.packMethodConfirmed ?? false;
        const columns: ColumnsType<IPackHeaderSkuMap> = [
            {
                title: <><span className='c-red'>*</span>Product Name</>,
                dataIndex: 'productCode',
                width: 200,
                render: (productCode, record, index) => {
                    return <Input size='small' disabled={packMethodConfirmed} placeholder='Product Name' defaultValue={productCode} onChange={e => changeProductCode(e.target.value, record)}/>
                }
            },
            {
                title: <><span className='c-red'>*</span>Product Type</>,
                dataIndex: 'productType',
                width: 200,
                render: (productType, record, index) => {
                    return <Select
                        disabled={packMethodConfirmed}
                        style={{ width: '100%' }}
                        size='small'
                        placeholder="Select Product Type"
                        onChange={(value) => changeHeaderProductType(value, record)}
                        defaultValue={productType}
                    >
                        {productTypes.map((prodType) => (
                            <Option key={index + prodType} value={prodType}>
                                {prodType}
                            </Option>
                        ))}
                    </Select>
                }
            },
            {
                title: <><span className='c-red'>*</span>Item Codes</>,
                dataIndex: 'skus',
                render: (skus, record, index) => {
                    return <Select
                        disabled={packMethodConfirmed}
                        size='small'
                        mode="multiple"
                        placeholder="Select Item Codes"
                        style={{ width: '100%' }}
                        defaultValue={skus}
                        onChange={(selectedValues) => changeHeaderRmskus(selectedValues, record)}
                    >
                        {[...rmSkuSet].map((rmSku) => (
                            <Option key={index + rmSku} value={rmSku}>
                                {rmSku}
                            </Option>
                        ))}
                    </Select>
                }
            },
        ];

        const actionsColumns:ColumnsType<IPackHeaderSkuMap> = [
            {
                title: <><Space>Action <Button type='primary' onClick={addRow} icon={<PlusOutlined />} /></Space></>,
                width: 50,
                align:'center',
                render: (skus, record, index) => {
                    return <Button danger type='primary' size='small' onClick={e => deleteRecord(index, packHeaderTblData)}> Delete</Button>
                }
            },
        ]
        let displayColumns = columns;
        if (packMethodParam == PackMethodEnum.SET) {
            displayColumns = [...columns, ...actionsColumns];
        }
        // setPackHeaderTblColumns(displayColumns);
        return displayColumns;
    }


    const saveProductTypeRmSkuMapping = () => {
        const subProductCount = packHeaderTblData.length;
        if (subProductCount < 1) {
            AlertMessages.getErrorMessage(packMethod == PackMethodEnum.PACK ? 'Please Enter Pack Count' : 'Select Pack Method ');
            return
        }
        let isError = false;
        const productCodeSet = new Set<string>();
        const rawOrderProductTypeSkuMap = packHeaderTblData.map(productObj => {
            if (productObj.productCode == '' || productObj.productType == '' || productObj.skus.length < 1) {
                productObj.isError = true;
                isError = true;
            } else {
                productObj.isError = false;
            }
            productCodeSet.add(productObj.productCode.replace(/\s/g, "").toLowerCase());
            return new RawOrderProdTypeSkuMapRequest(undefined, undefined, undefined, undefined, productObj.productCode, productObj.productType, subProductCount, productObj.skus)
        });
        if (isError) {
            setPackHeaderTblData(packHeaderTblData);
            setStateKey(preState => preState + 1);
            AlertMessages.getErrorMessage('All fields are Mandatory ');
            return
        }
        if (productCodeSet.size != subProductCount) {
            setPackHeaderTblData(packHeaderTblData);
            setStateKey(preState => preState + 1);
            AlertMessages.getErrorMessage('Product Name should be Unique');
            return
        }

        const saveSizeOrderInfo = new RawOrderLinesProdTypeSkuMapRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rawOrderProductTypeSkuMap, props.orderIdPk, PackMethodEnum[packMethod]);

        omsManipulationService.saveMoProductTypeRmSkuMapping(saveSizeOrderInfo).then((res => {
            if (res.status) {
                getRawOrderInfo(props.orderIdPk);
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const confirmPack = () => {
        const saveSizeOrderInfo = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, props.orderIdPk, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        omsManipulationService.confirmMoProductTypeRmSkuMapping(saveSizeOrderInfo).then((res => {
            if (res.status) {
                getRawOrderInfo(props.orderIdPk);
                props.updateStep();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const deleteProductTypeRmSkuMapping = () => {
        const saveSizeOrderInfo = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, props.orderIdPk, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        omsManipulationService.deleteMOProductTypeRmSkuMapping(saveSizeOrderInfo).then((res => {
            if (res.status) {
                getRawOrderInfo(props.orderIdPk);
                props.updateStep();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const getMoItemQty = () => {
        try {
            if (rawOrderInfo && rawOrderInfo.packMethods) {
                const allICodes = rawOrderInfo.packMethods.map((packMethod) => packMethod.iCodes);
                const distinctICodes = Array.from(new Set(allICodes.flat()));
                const request = new ManufacturingOrderItemRequest(user?.useName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rawOrderInfo.orderNo, distinctICodes);
                packlistService.getMoItemQty(request).then(res => {
                    if (res.status) {
                        setFabricCodedata(res.data);
                    }
                });
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const calculateFabricData = (fabricCodeData) => {
        return fabricCodeData.map((fabricItem) => {
            const { itemCode, itemPoQty, itemPackQty, itemGrnQty, itemAllocQty, itemIssueQty } = fabricItem;
            const totalGRNQuantity = parseFloat(itemGrnQty);
            const allocatedNotIssued = parseFloat(itemAllocQty) - parseFloat(itemIssueQty);
            const inWarehouse = parseFloat(itemGrnQty) - parseFloat(itemIssueQty);
            const pendingArrival = parseFloat(itemPoQty) - parseFloat(itemPackQty);
            return {
                itemCode,
                totalGRNQuantity: totalGRNQuantity.toFixed(2),
                allocatedNotIssued: allocatedNotIssued.toFixed(2),
                inWarehouse: inWarehouse.toFixed(2),
                pendingArrival: pendingArrival.toFixed(2),
            };
        });
    };
    const fabricDataResults = calculateFabricData(fabricCodeData);

    return (<Card size='small'>
        <Row gutter={24}>

            <Form
                name="packMethodForm"
                initialValues={{ packCount: packCount, packMethod: packMethod }}
                layout="inline"
                key={packCount + packMethod}
                disabled={rawOrderInfo ? rawOrderInfo.packMethod ? true : false : false}
                style={{ width: '6700px' }}
            >
                <Col span={8}>
                    <Form.Item
                        label="Pack Method"
                        // labelCol={{ span: 4 }}
                        // wrapperCol={{ span: 20 }}
                        name="packMethod"
                        rules={[
                            {
                                required: true,
                                message: 'Please select Pack Method',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select Pack Method"
                            onChange={changePackMethod}
                            style={{ width: '100%' }}
                        >
                            {
                                Object.entries(PackMethodEnumDisplayValues).map(([key, packMethodDisp]) => {
                                    return <Option value={key}>{packMethodDisp}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                {packMethod == PackMethodEnum.PACK &&
                    <Col span={8}>
                        <Form.Item
                            label="Pack Count"
                            name="packCount"
                            rules={[
                                {
                                    type: 'number',
                                    message: 'Please enter a valid number',
                                },
                                {
                                    required: true,
                                    message: 'Please enter your number',
                                },
                            ]}
                        >
                            <InputNumber onChange={changePackCount} min={1} max={15} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/[^0-9]/g, "")} />
                        </Form.Item>
                    </Col>
                }
            </Form>
            <Divider />
            <Col span={24}>
                <Table size='small' rowClassName={record => record.isError ? 'sku-row-error' : 'sku-row-green'} pagination={false} key={stateKey} bordered dataSource={packHeaderTblData} columns={constructPackHeaderTblColumns(rawOrderInfo, packMethod)} />
            </Col>
            <Divider />
            {rawOrderInfo?.packMethods.length > 0 &&
                <FabricCodeQuantities fabricDataResults={fabricDataResults} />}
            <Col span={24}>
                <Table size='small' pagination={false} bordered dataSource={skuMappingTblData} 
                    locale={{
                        emptyText:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={ <Tag color="processing">To see the information, please confirm</Tag>}/>,
                    }} columns={skuMappingColumns} 
                />
            </Col>
        </Row>
        <Row justify="end">
            <Col span={4}>
                <Space>
                    <Button type="primary" onClick={saveProductTypeRmSkuMapping} disabled={rawOrderInfo?.packMethodConfirmed} size={'small'}>Save</Button>
                    {rawOrderInfo?.packMethods.length > 0 && <Popconfirm
                        title="Confirm Product type Sku Mapping"
                        description="Are you sure to do this ?"
                        onConfirm={confirmPack}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        icon={<QuestionCircleOutlined style={{ color: 'green' }} />}
                    >
                        <Button type="primary" disabled={rawOrderInfo?.packMethodConfirmed} size={'small'}>Confirm</Button>
                    </Popconfirm>
                    }
                    {rawOrderInfo?.packMethod && <Popconfirm
                        title="Delete Product type Sku Mapping"
                        description="Are you sure to delete this ?"
                        onConfirm={deleteProductTypeRmSkuMapping}
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

export default ItemSkuMapping;
