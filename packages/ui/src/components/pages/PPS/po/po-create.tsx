import { CommonRequestAttrs, PoCreateRequest, RawOrderInfoModel, RawOrderNoRequest, SoListModel, SoListRequest, SoStatusEnum, SoLineIdsModel } from '@xpparel/shared-models';
import { OrderManipulationServices, POService } from '@xpparel/shared-services';
import { Button, Card, Col, Form, Input, Row, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import { IPoCreateLineSizeQtyColumns, POCreateColumns } from './po-summery-columns';
import { POHeaderInfo } from './po-header-info';
import { ColumnsType } from 'antd/es/table';

interface ISoLineChildComponentProps {
}
const { Option } = Select;
interface SOLineOptions {
    orderLineNo: string;
}
export const CreatePo = (props: ISoLineChildComponentProps) => {
    const [saleOrders, setSaleOrders] = useState<SoListModel[]>([]);
    const [SOLines, setSOLines] = useState<SOLineOptions[]>([]);
    const [selectedSOLine, setSelectedSOLine] = useState();
    const [selectedSalOrdId, setSelectedSalOrdId] = useState<number>();
    const [rawOrderInfo, setRawOrderInfo] = useState<RawOrderInfoModel>();
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [soLineSizeQtySummery, setSoLineSizeQtySummery] = useState<IPoCreateLineSizeQtyColumns[]>([]);
    const [selectedRowsData, setSelectedRowsData] = useState<IPoCreateLineSizeQtyColumns[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [formRef] = Form.useForm();
      const user = useAppSelector((state) => state.user.user.user);



    const omsManipulationService = new OrderManipulationServices();
    const poService = new POService();


    useEffect(() => {
        getSoList(new SoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, SoStatusEnum.IN_PROGRESS));
    }, []);

    const getSoList = (req: SoListRequest) => {
        omsManipulationService.getListOfSo(req)
            .then((res) => {
                if (res.status) {
                    setSaleOrders(res.data);
                } else {
                    setSaleOrders([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }

    const getOrderSummery = (req: RawOrderNoRequest) => {
        // omsManipulationService.getRawOrderInfo(req)
        //     .then((res) => {
        //         if (res.status) {
        //             const rawOrderInfoLocal = res.data?.[0];
        //             setRawOrderInfo(rawOrderInfoLocal);
        //             constructSoLineSizeTableData(res.data?.[0]);
        //         } else {
        //             constructSoLineSizeTableData(null);
        //             AlertMessages.getErrorMessage(res.internalMessage);
        //         }
        //     })
        //     .catch((err) => {
        //         constructSoLineSizeTableData(null);
        //         AlertMessages.getErrorMessage(err.message);
        //     });
    }


    const constructSoLineSizeTableData = (rawOrderInfo: RawOrderInfoModel, orderLineNo?: string) => {
        const soLineSizeQtySummeryLocal = [];
        const sizesDefaultObj = {};
        const sizes = rawOrderInfo?.sizes ? rawOrderInfo.sizes : [];
        setSelectedSizes(sizes);
        sizes.forEach(rec => sizesDefaultObj[rec] = 0);
        const soLinesLocal = new Set<string>();
        rawOrderInfo?.orderLines?.forEach((orderLineInfo) => {
            if (!orderLineInfo.isOriginal) {
                soLinesLocal.add(orderLineInfo.orderLineNo);
                const soLineSizeQtySummeryLocalRecord: IPoCreateLineSizeQtyColumns = {
                    orderIdPk: rawOrderInfo.orderIdPk,
                    orderNo: rawOrderInfo.orderNo,
                    poLineId: orderLineInfo.orderLineId,
                    productType: orderLineInfo.prodType,
                    style: rawOrderInfo.style,
                    color: orderLineInfo.fgColor,
                    salOrdLineNo: orderLineInfo.orderLineNo,
                    poSerial: orderLineInfo.poSerial,
                    poName: orderLineInfo.productName,
                    buyerPo: orderLineInfo.buyerPo,
                    garmentPo: orderLineInfo.buyerPo,
                    garmentPoLine: orderLineInfo.buyerPo,
                    buyerPoLine: orderLineInfo.buyerPo,
                    ...sizesDefaultObj
                }
                orderLineInfo.orderSubLines.forEach(subLineInfo => {
                    soLineSizeQtySummeryLocalRecord[subLineInfo.size] = subLineInfo.quantity;
                });
                if (!orderLineNo) {
                    soLineSizeQtySummeryLocal.push(soLineSizeQtySummeryLocalRecord);
                } else if (orderLineNo && orderLineNo === orderLineInfo.orderLineNo) {
                    soLineSizeQtySummeryLocal.push(soLineSizeQtySummeryLocalRecord);
                }
            }
        });
        setSOLines(Array.from(soLinesLocal).map(rec => {
            return {
                orderLineNo: rec,
            }
        }));
        setSoLineSizeQtySummery(soLineSizeQtySummeryLocal);
    }


    const rowSelection = {
        onChange: (selectedRowKeys: string[], selectedRows ) => {
            setSelectedRowsData(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
        getCheckboxProps: (record:IPoCreateLineSizeQtyColumns ) => ({            
            disabled: record.poSerial !=0
        }),
        selectedRowKeys: selectedRowKeys
    };

    const onCreateHandler = () => {
        formRef.validateFields().then(formData => {
            const req: PoCreateRequest = new PoCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, formData.description, selectedRowsData[0].orderNo, selectedRowsData[0].orderIdPk, selectedRowKeys.map(rec => new SoLineIdsModel(Number(rec), [])));
            poService.createPo(req)
                .then((res) => {
                    if (res.status) {
                        AlertMessages.getSuccessMessage(res.internalMessage);
                        getOrderSummery(new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, selectedSalOrdId, undefined, undefined, undefined, true, undefined, undefined, true, undefined));
                        setSelectedRowsData([]);
                        setSelectedRowKeys([]);
                        formRef.resetFields();
                    } else {
                        constructSoLineSizeTableData(null);
                        AlertMessages.getErrorMessage(res.internalMessage);
                    }
                })
                .catch((err) => {
                    constructSoLineSizeTableData(null);
                    AlertMessages.getErrorMessage(err.message);
                });
        }).catch(err => {
            console.log(err)
        });
    }



    const getSizeWiseColumns = () => {
        return [...POCreateColumns, ...selectedSizes.map(rec => {
            return {
                title: rec?.toLocaleUpperCase(), dataIndex: rec, key: rec, align:'center', isDefaultSelect: true,
            } as any;
        })]
    }
    const soChangeHandler = (orderId: number) => {
        setSelectedSalOrdId(orderId);
        getOrderSummery(new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, orderId, undefined, undefined, undefined, true, undefined, undefined, true, undefined));
    }

    const handleSaleOrderLineChange = (value) => {
        setSelectedSOLine(value);
        constructSoLineSizeTableData(rawOrderInfo, value);
    };
    return (
        <>
         {/* <Card> */}
            <Row style={{ fontWeight: '400' }}>
                <Col>
                SO/Plant Style Ref : <Select showSearch={true} style={{ width: '200px' }} placeholder='Select Sale Order' optionFilterProp="label" onChange={soChangeHandler} 
                allowClear={true}
                    filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                    >
                        {saleOrders.map(soList => {
                            return <Option value={soList.orderId} key={`${soList.orderId}`}>{soList.plantStyle ? soList.orderNo+' - '+soList.plantStyle : soList.orderNo}</Option>
                        })}
                    </Select>
                </Col>
                {selectedSalOrdId && <Col offset = {1}>
                    Select SO Line : <Select style={{ width: '200px' }} showSearch placeholder='Select SO Line' optionFilterProp="label" onChange={handleSaleOrderLineChange} allowClear>
                        {SOLines.map(soList => {
                            return <Option value={soList.orderLineNo} label={soList.orderLineNo} key={`${soList.orderLineNo}`}>{soList.orderLineNo}</Option>
                        })}
                    </Select>
                </Col>}
            </Row>
            <POHeaderInfo rawOrderInfoModel={rawOrderInfo} />
            <Table
                size='small'
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                rowKey={record => record.poLineId}
                dataSource={soLineSizeQtySummery}
                columns={getSizeWiseColumns() as ColumnsType<IPoCreateLineSizeQtyColumns>}
                pagination={false}
                bordered />
            <br />
            <Form form={formRef} autoComplete="off" layout='inline' size='middle'>
                <Row>
                    <Col>
                        <Form.Item name={'description'} label="Cut Order Description"
                            rules={[{ required: true, message: 'Please Enter Cut Order Description' }]}
                        >
                            <Input  placeholder="only 30 characters are accepted" maxLength={30}/>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Button type='primary'  onClick={onCreateHandler} disabled={selectedRowKeys.length === 0}>Create Cut Order</Button>
                    </Col>
                </Row>
            </Form>
         {/* </Card> */}
        </>
    )
}

export default CreatePo;