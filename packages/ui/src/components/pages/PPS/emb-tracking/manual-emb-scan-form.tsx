import { DocketNumberModel, EmbBundleScanModel, EmbBundleScanRequest, EmbJobBundleModel, PoDocketNumberRequest, PoDocketOpCodeRequest, PoSerialRequest, PoSummaryModel, RawOrderNoRequest, ReasonCategoryEnum, ReasonCategoryRequest, ReasonModel, ReportedEmbBundleScanModel, SoListModel, SoListRequest, SoStatusEnum } from "@xpparel/shared-models";
import { DocketGenerationServices, EmbTrackingService, OrderManipulationServices, POService, ReasonsService } from "@xpparel/shared-services";
import { Alert, Button, Card, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Table } from "antd";
import form from "antd/es/form";
import { ColumnProps } from "antd/es/table";
import { RejectionScanModel } from "packages/libs/shared-models/src/ets/emb-transaction/rejection/rejection-scan.model";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useRef, useState } from "react";
import { AlertMessages } from "../../../common";
import ReprtedEmbBundleInfoGrid from "./reported-bundle-info-grid";
import { SearchOutlined } from "@ant-design/icons";
import ReportedEmbBundleInfoGrid from "./reported-bundle-info-grid";
import { OperationDirectionEnum } from "./operation-direction.enum";
const { Option } = Select


interface ManualScanProps {
    operation: string;
    shift: string;
    operationDirection: OperationDirectionEnum;
}
const ManualEmblishmentScanForm = (props: ManualScanProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [embReportForm] = Form.useForm();
    useEffect(() => {
        if (props) {
            embReportForm.resetFields()
            setBundleInfo([])
            setReportedBundlInfo([])
            getSaleOrders()
            getReasons()
        }
    }, [])
    const [rejForm] = Form.useForm();
    const [saleOrders, setSaleOrders] = useState<SoListModel[]>([]);
    const [reasons, setReasons] = useState<ReasonModel[]>([]);
    const [productionOrders, setProductionOrders] = useState<PoSummaryModel[]>([]);
    const [dockets, setDockets] = useState<DocketNumberModel[]>([]);
    const [rejectionsData, setRejectionsData] = useState<RejectionScanModel[]>([{
        reasonId: null,
        quantity: null,
        components: []
    }]);
    const [poSerial, setPoSerial] = useState<number>();
    const [selIndex, setSelIndex] = useState<number>();
    const [toBeReportedQty, setToBeReportedQty] = useState<number>();
    const [bundleInfo, setBundleInfo] = useState<EmbJobBundleModel[]>([]);
    const [currentReportedBundleInfo, setCurrentReportedBundleInfo] = useState<EmbJobBundleModel>();
    const [reportedBundlInfo, setReportedBundlInfo] = useState<ReportedEmbBundleScanModel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [counter, setCounter] = useState<number>(0);
    const orderService = new OrderManipulationServices()
    const reasonService = new ReasonsService()
    const poService = new POService()
    const docketGenService = new DocketGenerationServices()
    const embTrackService = new EmbTrackingService()
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    //search feature 
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: string, test: string) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    size="small"
                    style={{ width: 90 }}
                    onClick={() => {
                        handleReset(clearFilters);
                        setSearchedColumn(dataIndex);
                        confirm({ closeDropdown: true });
                    }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                type="search"
                style={{ color: filtered ? 'black' : 'white' }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex][test]
                ? record[dataIndex][test]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current.select());
            }
        },
        // render: (text) =>
        //   text ? (
        //     searchedColumn === dataIndex ? (
        //       <Highlighter
        //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        //         searchWords={[searchText]}
        //         autoEscape
        //         textToHighlight={text.toString()}
        //       />
        //     ) : (
        //       text
        //     )
        //   ) : null,
    });

    /**
     * Get saleorders under operation
     * @param status 
     */
    const getSaleOrders = () => {
        const req = new SoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, SoStatusEnum.OPEN)
        orderService.getListOfSo(req)
            .then((res) => {
                if (res.status) {
                    setSaleOrders(res.data);
                } else {
                    setSaleOrders([]);
                }
            })
            .catch((err) => {
            });

    }

    /**
     * Get Reasons under Emblishment Category
     * @param reasoncategory 
     */
    const getReasons = () => {
        const req = new ReasonCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, ReasonCategoryEnum.EMB_REJECTIONS)
        reasonService.getReasonsByCategory(req)
            .then((res) => {
                if (res.status) {
                    setReasons(res.data);
                } else {
                    setReasons([]);
                }
            })
            .catch((err) => {
            });
    }

    const handeSoChange = (val, option) => {
        getProductionOrders(val, option.children)
    }

    //get production orders against the saleorder
    const getProductionOrders = (soId, saleorderNo) => {
        const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, saleorderNo, soId, '', '', null, false, false, false, false, false)
        poService.getPosForSo(req)
            .then((res) => {
                if (res.status) {
                    setProductionOrders(res.data);
                } else {
                    setProductionOrders([]);
                }
            })
            .catch((err) => {
            });
    }

    //get docket info for production orders 
    const getDocketInfo = (val, option) => {
        if (option) {
            const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, option.poSerial, val, false, false)
            docketGenService.getDocketNumbersForPo(req)
                .then((res) => {
                    if (res.status) {
                        const embAndOpMappedDockets = res.data.filter(d => {
                            return d.hasEmbOperation && d.embOperations?.includes(props.operation);
                        })
                        setDockets(embAndOpMappedDockets);
                    } else {
                        setDockets([]);
                    }
                })
                .catch((err) => {
                });
        }
    }


    const getBundleInfo = (values) => {
        const req = new PoDocketOpCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.docketNumber, props.operation, false)
        embTrackService.getEmbJobBundlesInfo(req)
            .then((res) => {
                if (res.status) {
                    if(res.data.length == 0) {
                        AlertMessages.getErrorMessage('No bundles found. Please verify if the cut is reported');
                    }
                    setBundleInfo(res.data);
                } else {
                    setBundleInfo([]);
                }
            })
            .catch((err) => {
            });
    }


    const handleReportBundleClick = (record: EmbJobBundleModel, index: number, qty: number, operationDir: OperationDirectionEnum) => {
        console.log('--------------------');
        console.log(record);
        console.log(index);
        console.log('--------------------');
        setCurrentReportedBundleInfo(record);
        setSelIndex(index);
        if(operationDir == OperationDirectionEnum.FORWARD) {
            setToBeReportedQty(qty)
            rejForm.setFieldsValue({ gQty: qty })
            openModal()
        } else if(operationDir == OperationDirectionEnum.REVERSE) {
            reportEmbBundleReversal(record.bundleInfo.barcode, props.operation, qty, props.shift, index);
        }

    }

    const openModal = () => {
        setRejectionsData([{
            reasonId: null,
            quantity: null,
            components: []
        }])
        rejForm.resetFields()
        setIsModalOpen(true)
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleReportEmbBundle = (values: { rQty: number, gQty: number }) => {
        if (values.rQty + values.gQty <= 0) {
            AlertMessages.getErrorMessage('Good and rejection quantity cannot be 0');
            return;
        }
        const bundleQty = currentReportedBundleInfo?.bundleInfo?.quantity ?? 0;
        if(values.gQty > Number(bundleQty)) {
            AlertMessages.getErrorMessage('Trying to scan more than bundle quantity');
            return;
        }
        rejectionsData.splice((rejectionsData.length - 1), 1);
        if (props.operationDirection == OperationDirectionEnum.FORWARD) {
            reportEmbBundleGood(values.gQty, values.rQty, rejectionsData);
        } else if (props.operationDirection == OperationDirectionEnum.REVERSE) {
            // DO nothing.
        }
    }

    const reportEmbBundleGood = (gQty: number, rQty: number, rejections: RejectionScanModel[]) => {
        //deleting empty last row of rejections table
        rejectionsData.splice((rejectionsData.length - 1), 1);
        const req = new EmbBundleScanRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, currentReportedBundleInfo.bundleInfo.barcode, props.operation, gQty, rQty, false, props.shift, false, rejectionsData, false);
        embTrackService.reportEmbBundle(req).then((res) => {
            if (res.status) {
                try {
                    setIsModalOpen(false);
                    setRejectionsData([...rejectionsData]);
                    const prevReportedGQty = bundleInfo[selIndex].opQtys.filter(item => item.opCode == props.operation)[0].gQty
                    const prevReportedRQty = bundleInfo[selIndex].opQtys.filter(item => item.opCode == props.operation)[0].rQty
                    reportedBundlInfo.push({ ...res.data[0], status: res.status, reason: res.internalMessage })
                    setReportedBundlInfo([...reportedBundlInfo])
                    bundleInfo[selIndex].opQtys.filter(item => item.opCode == props.operation)[0].gQty = Number(prevReportedGQty) + Number(gQty)
                    bundleInfo[selIndex].opQtys.filter(item => item.opCode == props.operation)[0].rQty = Number(prevReportedRQty) + Number(rQty)
                    setBundleInfo([...bundleInfo]);
                } catch (error) {
                    console.log(error);
                }
            } else {
                reportedBundlInfo.push({
                    barcode: bundleInfo[selIndex].bundleInfo.barcode,
                    operationCode: '',
                    gQty: 0,
                    rQty: 0,
                    bundleQty: 0,
                    otherProps: undefined,
                    status: res.status, reason: res.internalMessage
                })
                setReportedBundlInfo([...reportedBundlInfo])
            }
        }).catch(() => {

        })
    }

    const reportEmbBundleReversal = (barcode: string, opCode: string, gQty: number, shift: string, index: number) => {
        const req = new EmbBundleScanRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, barcode, opCode, gQty, 0, true, shift, false, null,false)
        embTrackService.reportEmbBundleReversal(req).then((res) => {
            if (res.status) {
                try {
                    console.log('response camed');
                    const prevReportedGQty = bundleInfo[index].opQtys.filter(item => item.opCode == props.operation)[0].gQty;
                    reportedBundlInfo.push({ ...res.data[0], status: res.status, reason: res.internalMessage })
                    
                    console.log('pushed');
                    setReportedBundlInfo([...reportedBundlInfo]);
                    
                    console.log('setted');
                    bundleInfo[index].opQtys.filter(item => item.opCode == props.operation)[0].gQty = Number(prevReportedGQty) - Number(gQty);
                    setCounter(pre => pre + 1 );
                    console.log('done all');
                } catch (error) {
                    console.log(error);
                }
                
            } else {
                reportedBundlInfo.push({
                    barcode: bundleInfo[index].bundleInfo.barcode,
                    operationCode: '',
                    gQty: 0,
                    rQty: 0,
                    bundleQty: 0,
                    otherProps: undefined,
                    status: res.status, reason: res.internalMessage
                })
                setCounter(pre => pre + 1);
            }
        }).catch(() => {

        })
    }

    const getModalContent = () => {
        return (
            <>
                <Divider />

                {/* <Row gutter={24}>
                <Col span = {18}> */}
                {/* <Table size="small" bordered dataSource={rejectionsData} columns={rejectionColumns} pagination={false} /> */}
                {/* </Col>
                <Col span = {6}>
                <Row>
                    <Alert style={{width:'130px'}} message={`Barcode: ${eachBundleInfo?.bundleInfo?.barcode}`} type="success" />
                </Row>
                <Row>
                <Alert style={{width:'130px'}} message={`Quantity: ${eachBundleInfo?.bundleInfo?.quantity}`} type="info"/>
                </Row>
                </Col>
            </Row> */}
                <Form form={rejForm} layout="vertical" onFinish={handleReportEmbBundle}>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item label="Total Good" name="gQty" initialValue={toBeReportedQty} rules={[
                                {
                                    required: true,
                                    message: 'Missing goodQty',
                                },
                            ]}>
                                <Input placeholder="Good Qty"
                                // defaultValue={`${toBeReportedQty}`}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Total Rejected" name="rQty" initialValue={0} rules={[
                                {
                                    required: true,
                                    message: 'Missing Rejected Qty',
                                },
                            ]}>
                                <Input placeholder="Rej Qty" disabled />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="quantity" name="totalQuantity" initialValue={0} rules={[
                                {
                                    required: true,
                                    message: 'Missing Total Qty',
                                },
                            ]}>
                                <Input placeholder="Total Qty" disabled />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label=" " >
                                <Button className="btn-green" type="primary" htmlType="submit" >
                                    Report
                                </Button>
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </>
        )
    }

    const handleReasonChange = (val, row, index) => {
        rejectionsData[index].reasonId = val

    }

    const handlequantityChange = (val, index) => {
        rejectionsData[index].quantity = val
    }

    const addRow = (val, index, record) => {
        let rejQty = rejForm.getFieldValue('rQty')
        const prevrQty = rejQty ? rejQty : 0
        const totrQty = Number(prevrQty) + Number(record.quantity)
        const totgQty = toBeReportedQty - totrQty
        if (rejectionsData[index].reasonId == null || rejectionsData[index].quantity == null) {
            AlertMessages.getErrorMessage('Reason or quantity Missed')
        }
        //to validate total rejected quantity not to greater than bundle quantity 
        else if ((totrQty) > toBeReportedQty) {
            AlertMessages.getErrorMessage('Rejection should not exceed Bundle Quantity')
            rejForm.setFieldsValue({ [`quantity${index}`]: null })
        }
        else {
            rejForm.setFieldsValue({ rQty: totrQty })
            rejForm.setFieldsValue({ gQty: totgQty })
            rejForm.setFieldsValue({ totalQuantity: Number(totrQty) + Number(totgQty) })
            setRejectionsData([...rejectionsData,
            {
                reasonId: null,
                quantity: null,
                components: []
            }
            ])
        }
        // rejectionsData[index].quantity = 
    }


    const bundleInfoColumns: any[] = [
        {
            key: 'sno',
            title: 'S.No.',
            width: '20px',
            responsive: ['sm'],
            render: (text, object, index) => (index + 1)
        },
        {
            key: 'cutSubNumber',
            title: 'Cut Number',
            align: 'center',
            dataIndex: "cutSubNumber",
        },
        {
            key: 'docketGroup',
            title: 'Docket',
            align: 'center',
            dataIndex: "docketGroup",
            // render: (text, record) => {
            //     return <>{embReportForm.getFieldValue('docketNumber')}</>
            // }
        },
        {
            key: 'layNumber',
            title: 'Lay Number',
            align: 'center',
            dataIndex: "layNumber",
            render: (text, record) => {
                return <>{text}</>
            }
        },
        {
            key: 'underLayBundleNo',
            title: 'Bundle Number',
            align: 'center',
            dataIndex: "cutNumber",
            render: (text, record) => {
                return <>{record.bundleInfo.underLayBundleNo}</>
            },
            ...getColumnSearchProps('bundleInfo', 'underLayBundleNo'),

        },
        {
            key: 'barcode',
            title: 'Barcode',
            align: 'center',
            // dataIndex: "barcode",
            render: (text, record) => {
                return <>{record.bundleInfo.barcode}</>
            }
        },
        {
            key: 'shade',
            title: 'Shade',
            align: 'center',
            // dataIndex: "shade",
            render: (text, record) => {
                return <>{record.bundleInfo.shade}</>
            }
        },
        {
            key: 'quantity',
            title: 'Quantity',
            align: 'center',
            // dataIndex: "quantity",
            render: (text, record) => {
                return <>{record.bundleInfo.quantity}</>
            }
        },
        {
            key: 'gQty',
            title: 'Good Qty',
            align: 'center',
            // dataIndex: "gQty",
            render: (text, record) => {
                return <>{record.opQtys.filter(item => item.opCode == props.operation)[0]?.gQty}</>
            }
        },
        {
            key: 'rQty',
            title: 'Rejected Qty',
            align: 'center',
            dataIndex: "rQty",
            render: (text, record) => {
                return <>{record.opQtys.filter(item => item.opCode == props.operation)[0]?.rQty}</>
            }
        },
        {
            key: 'action',
            title: 'Status',
            align: 'center',
            render: (text, record, index) => {
                const gqty = Number(record.opQtys.filter(item => item.opCode == props.operation)[0]?.gQty);
                const rqty = Number(record.opQtys.filter(item => item.opCode == props.operation)[0]?.rQty);
                let reportingQty = 0;
                let reportButtonDisabled = false;
                if(props.operationDirection == OperationDirectionEnum.FORWARD) {
                    reportingQty = Number(record.bundleInfo.quantity) - Number((gqty + rqty));
                    reportButtonDisabled = reportingQty <= 0;
                } else if(props.operationDirection == OperationDirectionEnum.REVERSE) {
                    reportingQty = gqty;
                    reportButtonDisabled = reportingQty <= 0;
                }
                return <>
                    <Button size="small" disabled={reportButtonDisabled} onClick={() => handleReportBundleClick(record, index, reportingQty, props.operationDirection)} type="primary" >
                        Report
                    </Button>
                </>
            }
        },
    ]

    const rejectionColumns: ColumnProps<any>[] = [
        {
            key: 'sno',
            title: 'S No.',
            width: '70px',
            responsive: ['sm'],
            render: (text, object, index) => (index + 1)
        },
        {
            key: 'reason',
            title: 'Reason',
            align: 'center',
            // dataIndex: "cutNumber",
            render: (text, record, index) => (
                <span>
                    <Form form={rejForm}>
                        <Form.Item
                            name={`reasonId${index}`}
                        >
                            <Select
                                placeholder={'Select Reason'}
                                style={{ width: '100%' }}
                                allowClear
                                // defaultValue={record.reasonId}
                                onChange={(val, row) => handleReasonChange(val, row, index)}
                            >
                                {reasons.map((reasonInfo) => (
                                    <Option key={reasonInfo.reasonName} value={reasonInfo.id}>
                                        {reasonInfo.reasonName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>

                </span>
            )
        },


        {
            key: 'quantity',
            title: 'Quantity',
            align: 'center',
            dataIndex: "rejQty",
            render: (text, record, index) => {
                return <>
                    <Form form={rejForm}>
                        <Form.Item name={`quantity${index}`} >
                            <InputNumber placeholder="quantity" onChange={(val) => handlequantityChange(val, index)} />
                        </Form.Item>
                    </Form>
                </>
            }
        },
        {
            key: 'action',
            title: 'Action',
            align: 'center',
            // dataIndex: "group",
            render: (text, rec, index) => {
                return <>
                    <span>
                        <Row><Button size="small" style={{ backgroundColor: 'green' }} onClick={(val) => addRow(val, index, rec)} type="primary">
                            + Add
                        </Button>
                        </Row>
                    </span>
                </>
            }

        }
    ];

    return (
        <>
            <Row>
                <span style={{ marginLeft: '40%' }}>{`You are doing ${props.operationDirection} scanning`}</span>               
            </Row>
            <br/>
            <Form form={embReportForm} onFinish={getBundleInfo}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            label={`SO/Plant Style Ref`}
                            name={`saleOrder`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Missing SO/Plant Style Ref',
                                },
                            ]}
                        >
                            <Select
                                // style={{ width: '200px' }}
                                placeholder='Select SO/Plant Style Ref'
                                onChange={handeSoChange}
                                filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                showSearch
                                >
                                {saleOrders.map(soList => {
                                    return <Option value={soList.orderId} key={`${soList.orderId}`}>{soList.plantStyle ? soList.orderNo+' - '+soList.plantStyle : soList.orderNo}</Option>
                                })}
                             </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label={`Select Cut order`}
                            name={`prodOrder`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Missing Cut Order',
                                },
                            ]}
                        >
                            <Select
                                placeholder={'Select Cut Order'}
                                style={{ width: '100%' }}
                                onChange={getDocketInfo}
                                allowClear
                            >
                                {productionOrders.map((prodOrderInfo) => (
                                    <Option key={prodOrderInfo.poId} poSerial={prodOrderInfo.poSerial} value={prodOrderInfo.poId}>
                                        {`${prodOrderInfo.poSerial}-${prodOrderInfo.poDesc}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col span={4}>
                        <Form.Item
                            label={`Docket`}
                            name={`docketNumber`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Missing Docket',
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                placeholder={'Docket'}
                                style={{ width: '100%' }}
                                // onChange={getDocketInfo}
                            >
                                {dockets.map((docketInfo) => (
                                    <Option key={docketInfo.docketNumber} value={docketInfo.docketNumber}>
                                        {docketInfo.docketGroup}-{docketInfo.productName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col span={6}>
                        <Button className="btn-green" type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
            <>
                <Row gutter={24}>
                    <Col span={18}>
                        {bundleInfo.length > 0 ?
                            <Table
                                // rowKey={record => record.opCode}
                                columns={bundleInfoColumns}
                                dataSource={bundleInfo}
                                bordered
                                pagination={false}
                                size='small'
                                style={{ fontSize: '12px' }}
                            />

                            : <></>}
                    </Col>
                    <Col span={6}>
                        {reportedBundlInfo.length > 0 ?
                            <ReportedEmbBundleInfoGrid {...{ bundleResponse: reportedBundlInfo, scanType: 'Manual' }} />
                            : <></>}
                    </Col>
                </Row>
            </>

            {isModalOpen ? <Modal title={
                <Row gutter={24}>
                    <Col span={6}>
                        {'Bundle Report'}
                    </Col>
                    <Col span={6}>
                    </Col>
                    <Col span={6}>
                        <Alert style={{ width: '145px', height: '25px' }} message={`Barcode: ${currentReportedBundleInfo?.bundleInfo?.barcode}`} type="success" />
                    </Col>
                    <Col span={6}>
                        <Alert style={{ width: '145px', height: '25px' }} message={`Quantity: ${toBeReportedQty}`} type="info" />
                    </Col>
                </Row>
            }
                // {`Bundle Report Barcode:${eachBundleInfo.bundleInfo.barcode} Quantity:${eachBundleInfo.bundleInfo.quantity}`}
                footer={null} open={isModalOpen} width={'60%'} onCancel={handleCancel}
            >
                <>{getModalContent()}</>
            </Modal> : '' }
        </>
    )

}
export default ManualEmblishmentScanForm;