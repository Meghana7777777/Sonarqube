import { ActualDocketBasicInfoModel, CutDispatchCreateRequest, ICutToBagMapModel, CutDispatchIdStatusRequest, CutStatusEnum, LayIdsRequest, LayingStatusEnum, LayingStatusEnumDisplayValues, PoCutModel, PoSerialWithCutPrefRequest, PoSummaryModel, RawOrderNoRequest, MoListModel, MoListRequest, MoStatusEnum, cutStatusEnumDisplayValues, PoProdTypeAndFabModel, PoSerialRequest } from "@xpparel/shared-models";
import { CutDispatchService, CutGenerationServices, LayReportingService, OrderManipulationServices, POService, PoMaterialService } from "@xpparel/shared-services";
import { Button, Card, Checkbox, CheckboxProps, Col, Collapse, CollapseProps, Divider, Form, Modal, Row, Select, Space, Table, Tag, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";


import React from "react";
import { ColumnsType } from "antd/es/table";
import { InfoOutlined, QuestionOutlined } from "@ant-design/icons";
interface ITblData {
    isCutRow: boolean;
    cutNo: string;
    totalActualBundles: number;
    totalDocketBundles: number;
    totalPlannedQty: number;
    docketNumber: string;
    isMainDoc: boolean;
    itemCode: string;
    itemDesc: string;
    docketPlies: number;
    actualDocketPlies: number;
    actualBundles: number;
    uniqueId: string;
    cutStatus: CutStatusEnum,
    layStatus: LayingStatusEnum,
    disabled: boolean;
    reason: string;
    dispatchReqNo: string;
    docketGroup: string;
    cutSubNumber: string;
}
const PkCreateDispatchPage = () => {
    useEffect(() => {
        getListOfMo()
    }, [])
    const user = useAppSelector((state) => state.user.user.user);
    const [manufacturingOrders, setManufacturingOrders] = useState<MoListModel[]>([]);
    const [poS, setPos] = useState<PoSummaryModel[]>([]);
    const [docketsInfo, setDocketsInfo] = useState<PoCutModel[]>([]);
    const [cutTblData, setCutTblData] = useState<ITblData[]>([]);
    const [stateKey, setStateKey] = useState<number>(0);
    const [poSerial, setPoSerial] = useState<number>(undefined);
    const [selectedCutNos, setSelectedCutNos] = useState<string[]>([]);
    const orderManipulationServices = new OrderManipulationServices();
    const pOService = new POService();
    const cutGenerationServices = new CutGenerationServices();
    const cutDispatchService = new CutDispatchService();
    const poMaterialService = new PoMaterialService();
    const [form] = Form.useForm();
    const [dispatchForm] = Form.useForm();
    const { Option } = Select;
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [productTypesAndFabrics, setProductTypesAndFabrics] = useState<PoProdTypeAndFabModel[]>([]);
    const [selectedProductName, setSelectedProductName] = useState<string>(undefined);
    const [selectedPo, setSelectedPo] = useState<PoSummaryModel>();
    /**
     * Get Manufacturing Orders
     */
    const getListOfMo = () => {
        const req = new MoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, MoStatusEnum.IN_PROGRESS);
        orderManipulationServices.getListOfMo(req).then((res => {
            if (res.status) {
                setManufacturingOrders(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const changeManufacturingOrder = (manufacturingOrderId: number) => {
        form.resetFields(['productionOrder','productName']);
        setSelectedProductName(undefined);
        setPos([]);
        setProductTypesAndFabrics([]);
        const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, null, manufacturingOrderId, undefined, undefined, undefined, false, false, false, false, false);
        pOService.getPosForMo(req).then((res => {
            if (res.status) {
                setPos(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    /**
     * Call this function when click on Submit Button
     */
    const getCutsInfo = (fromValues) => {
        const { productionOrder, productName } = fromValues;
        setPoSerial(productionOrder);
        getCutInfoForPoSerial(productionOrder, productName);
    }
    const getCutInfoForPoSerial = (poSerialNo: number, productName: string) => {
        const req = new PoSerialWithCutPrefRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerialNo, true, true, false, false, false, false, productName);
        cutGenerationServices.getCutInfoForPo(req).then((res => {
            if (res.status) {
                setSelectedCutNos([])
                setDocketsInfo(res.data);
                constructTblData(res.data);
                setStateKey(preState => preState + 1);
                dispatchForm.resetFields();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const poOnChange = (poId: number) => {
        setDocketsInfo([]);
        setSelectedProductName(undefined);
        form.setFieldValue('productName', undefined);
        const po = poS.find(rec => rec.poSerial === poId);
        const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, po.poSerial, po.poId, false, false)
        poMaterialService.getPoProdTypeAndFabrics(req)
            .then((res) => {
                if (res.status) {
                    setProductTypesAndFabrics(res.data);
                } else {
                    setProductTypesAndFabrics([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                setProductTypesAndFabrics([]);
                AlertMessages.getErrorMessage(err.message);
            });
        setSelectedPo(po);
    }
    const productNameOnChange = (productTypeVal: string) => {
        setSelectedProductName(productTypeVal);
    }
    const constructTblData = (cutInfo: PoCutModel[]) => {
        const tblData: ITblData[] = [];
        cutInfo.forEach((c, cI) => {
            const childRows: ITblData[] = [];
            // Header Row ro cut
            const hRow: ITblData = {
                actualBundles: 0,
                actualDocketPlies: 0,
                cutNo: c.cutNumber,
                docketNumber: '',
                docketPlies: 0,
                isCutRow: true,
                isMainDoc: false,
                itemCode: '',
                itemDesc: '',
                totalActualBundles: 0,
                totalPlannedQty: c.planQuantity,
                totalDocketBundles: c.plannedBundles,
                uniqueId: c.cutNumber,
                cutStatus: null,
                layStatus: null,
                disabled: c.dispatchCreated,
                reason: c.dispatchCreated ? 'Dispatch Created' : '',
                dispatchReqNo: c.dispatchReqNo,
                docketGroup: '',
                cutSubNumber: c.cutSubNumber
            }

            c.dockets.forEach(d => {
                const acd = c.actualDockets.filter(a => a.docketNumber === d.docketNumber);
                if (acd.length < 1) {
                    hRow.disabled = true;
                    hRow.reason = 'Cut not reported yet';
                    // No Actual docket
                    const cRow: ITblData = {
                        actualBundles: 0,
                        actualDocketPlies: 0,
                        cutNo: c.cutNumber,
                        docketNumber: d.docketNumber,
                        docketPlies: d.plies,
                        isCutRow: false,
                        isMainDoc: d.isMainDoc,
                        itemCode: d.itemCode,
                        itemDesc: d.itemDesc,
                        totalActualBundles: 0,
                        totalDocketBundles: 0,
                        totalPlannedQty: 0,
                        uniqueId: c.cutNumber + '-' + d.docketNumber,
                        cutStatus: null,
                        layStatus: null,
                        disabled: true,
                        reason: '',
                        dispatchReqNo: c.dispatchReqNo,
                        docketGroup: d.docketGroup,
                        cutSubNumber: c.cutSubNumber
                    }
                    childRows.push(cRow);
                }
                acd.forEach(acdObj => {
                    if (acdObj.isMainDoc) {
                        hRow.totalActualBundles += acdObj.totalAdbs;
                    }
                    // if Cut no done then user should not create dispatch for Cut
                    if (acdObj.cutStatus !== CutStatusEnum.COMPLETED) {
                        hRow.disabled = true;
                        hRow.reason = 'Cut not reported yet';
                    }
                    // Actual docket row
                    const cRow: ITblData = {
                        actualBundles: acdObj.totalAdbs,
                        actualDocketPlies: 0,
                        cutNo: c.cutNumber,
                        docketNumber: d.docketNumber,
                        docketPlies: d.plies,
                        isCutRow: false,
                        isMainDoc: d.isMainDoc,
                        itemCode: d.itemCode,
                        itemDesc: d.itemDesc,
                        totalActualBundles: 0,
                        totalDocketBundles: 0,
                        totalPlannedQty: 0,
                        uniqueId: c.cutNumber + '-' + d.docketNumber + '-' + acdObj.layId,
                        cutStatus: acdObj.cutStatus,
                        layStatus: acdObj.layStatus,
                        disabled: true,
                        reason: '',
                        dispatchReqNo: c.dispatchReqNo,
                        docketGroup: d.docketGroup,
                        cutSubNumber: c.cutSubNumber
                    }
                    childRows.push(cRow);
                })
            });
            tblData.push(hRow);
            childRows.forEach(r => tblData.push(r));
        });
        setCutTblData(tblData);
    }
    const columns: ColumnsType<ITblData> = [
        {
            title: 'Docket Group',
            dataIndex: 'docketGroup',
            align: 'center',
            render: (v, record) => {
                return record.isCutRow ?
                    <>
                        Cut No : <Tag color="#2db7f5">{record.cutSubNumber}</Tag>
                    </>
                    : <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Docket No'>{v}</Tooltip>
            },
            onCell: (record) => ({
                colSpan: record.isCutRow ? 1 : 1,
            }),
        },
        {
            title: 'Main Docket',
            dataIndex: 'isMainDoc',
            align: 'center',
            render: (text, record) => {
                return record.isCutRow ?
                    <>
                        {record.dispatchReqNo ? <Tag color="#f50"><Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Dispatch Req No'>{record.dispatchReqNo}</Tooltip></Tag> : 'Dispatch Pending'}
                    </>
                    :
                    <Tooltip title={'Main Docket'} mouseEnterDelay={0} mouseLeaveDelay={0} >
                        {text ? 'Yes' : 'No'}
                    </Tooltip>
            },
            onCell: (record) => ({
                colSpan: record.isCutRow ? 1 : 1,
            }),
        },
        {
            title: 'Item',
            dataIndex: 'itemCode',
            align: 'center',
            render: (v, record) => {
                return record.isCutRow ? <>Planned Qty : <Tag color="#2db7f5">{record.totalPlannedQty}</Tag></> : <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Item'>{v}</Tooltip>
            },
            onCell: (record) => ({
                colSpan: record.isCutRow ? 2 : 1,
            }),
        },
        // {
        //     title: 'Item Description',
        //     dataIndex: 'itemDesc',
        //     align: 'center'
        // },
        {
            title: 'Plies',
            dataIndex: 'docketPlies',
            align: 'center',
            render: (text) => (
                <Tooltip title={'Plies'} mouseEnterDelay={0} mouseLeaveDelay={0} >{text}</Tooltip>
            ),
            onCell: (record) => ({
                colSpan: record.isCutRow ? 0 : 1,
            }),
        },
        {
            title: 'Layed Plies',
            dataIndex: 'actualDocketPlies',
            align: 'center',
            render: (v, record) => {
                return record.isCutRow ? <>Total Planned Bundles : <Tag color="#2db7f5">{record.totalDocketBundles}</Tag></> : <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Layed Plies'>{v}</Tooltip>
            },
            onCell: (record) => ({
                colSpan: record.isCutRow ? 2 : 1,
            }),
        },
        {
            title: 'Lay Number',
            dataIndex: 'layNumber',
            align: 'center',
            render: (text) => (
                <Tooltip title={'Lay Number'} mouseEnterDelay={0} mouseLeaveDelay={0} >{text}</Tooltip>
            ),
            onCell: (record) => ({
                colSpan: record.isCutRow ? 0 : 1,
            }),
        },

        {
            title: 'Actual Bundles',
            dataIndex: 'actualBundles',
            align: 'center',
            render: (v, record) => {
                return record.isCutRow ? <>Total  Actual Bundles : <Tag color="#2db7f5">{record.totalActualBundles}</Tag></> : <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Actual Bundles'>{v}</Tooltip>
            },
            onCell: (record) => ({
                colSpan: record.isCutRow ? 2 : 1,
            }),
        },
        {
            title: 'Cut Status',
            dataIndex: 'cutStatus',
            align: 'center',
            render: (v) => <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Cut Status'>{cutStatusEnumDisplayValues[v]}</Tooltip>,
            onCell: (record) => ({
                colSpan: record.isCutRow ? 0 : 1,
            }),
        },
        {
            title: 'Lay Status',
            dataIndex: 'layStatus',
            align: 'center',
            render: (v, record) =>
                record.isCutRow ?
                    record.disabled ? <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={record.reason}> <Button type="primary" shape="circle" className={record.dispatchReqNo ? "btn-green" : "btn-orange"} icon={<InfoOutlined />} size='small' /></Tooltip> : ''
                    : <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Lay Status'>{LayingStatusEnumDisplayValues[v]}</Tooltip>,
        }

    ]
    const onCheckChange = (e, cutNo: string) => {
        console.log(e.target.checked, cutNo);
        // setChecked(e.target.checked);
    };
    const rowSelection = {
        selectedRowKeys: selectedCutNos,
        onChange: (selectedRowKeys: string[], selectedRows: ITblData[]) => {
            // rowkey here is a string. Mo when sending the request change these to numbers
            setSelectedCutNos(selectedRowKeys);
        },
        getCheckboxProps: (record: ITblData) => ({
            disabled: record.disabled
        }),
        // DO not remove
        // columnTitle:()=> <Checkbox   /> ,
        // renderCell: (checked: boolean, record: ITblData, index, originNode) => {
        //     console.log(index, checked)
        //     // console.log(originNode)
        //     return record.isCutRow ? <Checkbox disabled={record.disabled} value={record.cutNo} onChange={e => onCheckChange(e, record.cutNo)} /> : ''
        // }
    };
    const openDispatchFormModal = () => {
        setModalVisible(true);
    }
    const createDispatch = (fromValues) => {
        const bagNumbers = Object.keys(fromValues).map(cutKey => {
            const bagNumberObj: ICutToBagMapModel = {
                bagNumbers: fromValues[cutKey],
                cutNumber: Number(cutKey)
            }
            return bagNumberObj;
        })
        // type change the cut numbers from string to number. Since we are using rowkeys as the cut numbers, key will always be strings
        const cutNumbers = selectedCutNos.map(c => Number(c));
        const req = new CutDispatchCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, poSerial, cutNumbers, bagNumbers);
        cutDispatchService.createCutDispatch(req).then((res => {
            if (res.status) {
                getCutInfoForPoSerial(poSerial, selectedProductName);
                AlertMessages.getSuccessMessage(res.internalMessage);
                setModalVisible(false);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const closeModel = () => {
        setModalVisible(false);
    };
    return <>
        <Row justify="space-between">
            < Col xs={12} sm={8} md={6} lg={8}>
                <Form form={form} onFinish={getCutsInfo} layout="inline" name="PO">
                    <Form.Item label="MO/Plant Style Ref" name="manufacturingOrder" rules={[{ required: true, message: 'Select MO/Plant Style Ref' }]}>

                        <Select
                            //style={{ width: '300px' }}
                            placeholder='Select ghjgj MO/Plant Style Ref'
                            onChange={changeManufacturingOrder}
                            filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                            showSearch
                        >
                            {manufacturingOrders.map(moList => {
                                return <Option value={moList.orderId} key={`${moList.orderId}`}>{moList.plantStyle ? moList.orderNo + ' - ' + moList.plantStyle : moList.orderNo}</Option>
                            })}
                        </Select>

                    </Form.Item>

                    <Form.Item label="33 Cut Order" name="productionOrder" rules={[{ required: true, message: 'Select Cut Order' }]}>
                        <Select style={{ width: 200 }} onChange={poOnChange} placeholder='Select Cut Order' showSearch optionFilterProp="label">
                            {poS.map((poObj, i) => <Option key={`s` + i} label={`${poObj.poSerial}-${poObj.poDesc}`} value={poObj.poSerial}>{poObj.poSerial}-{poObj.poDesc}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='productName'
                        label="Select  Product Name"
                        rules={[{ required: true, message: 'Please Select Product Name' }]}>
                        <Select
                            style={{ width: '300px' }}
                            placeholder='Select Product Name'
                            filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                            showSearch
                            onChange={productNameOnChange}
                        >
                            {productTypesAndFabrics.map(bO => <Option key={bO.productName} value={bO.productName}>{bO.productName}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
            < Col xs={12} sm={8} md={6} lg={7}>
                {selectedCutNos.length > 0 ?
                    <Button type="primary" style={{marginTop:'10px'}} className="btn-green" onClick={openDispatchFormModal}>
                        Create Dispatch
                    </Button> : ''}
            </Col>
        </Row>
        <br />
        {/* <hr/> */}

        <Table size="small" rowKey={r => r.uniqueId} bordered pagination={false} rowClassName={r => r.isCutRow ? 'row-highlight' : 'hide-checkbox'} rowSelection={rowSelection} columns={columns} dataSource={cutTblData} />

        <Modal
            className='print-docket-modal'
            key={'modal' + Date.now()}
            width={'800px'}
            // style={{ top: 0 }}
            open={modalVisible}
            title={<React.Fragment>
                <Row>
                    <Col span={12}>
                        Select Bag Numbers for  Dispatch
                    </Col>

                </Row>
            </React.Fragment>}
            onCancel={closeModel}
            footer={[
                <Button key='back' onClick={closeModel}>
                    Cancel
                </Button>,
            ]}
        >
            <Form form={dispatchForm}
                onFinish={createDispatch}
                layout="horizontal"
                name="cut"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                {selectedCutNos.sort().map(cutNo => {
                const cutSubNumberObj = cutTblData.find(c=>c.uniqueId == cutNo);
                   return <Form.Item label={`Cut No ${cutSubNumberObj?.cutSubNumber}`} name={cutNo} rules={[{ required: true, message: 'Select Bag Order' }]}>
                        <Select mode="multiple" placeholder='Select Bag Number' showSearch>
                            {Array(10).fill(undefined).map((_, index) => <Option key={`c` + index + 1} value={index + 1}>{index + 1}</Option>)}
                        </Select>
                    </Form.Item>
                }
                )}

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Create Dispatch
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default PkCreateDispatchPage;
