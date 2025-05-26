import { CutStatusEnum, EmbDispatchCreateRequest, EmbLocationTypeEnum, PoSerialWithEmbPrefRequest, PoSummaryModel, RawOrderNoRequest, SoListModel, SoListRequest, SoStatusEnum, VendorCategoryEnum, VendorCategoryRequest, VendorModel, cutStatusEnumDisplayValues } from "@xpparel/shared-models";
import { EmbDispatchService, EmbRequestHandlingService, OrderManipulationServices, POService, VendorService } from "@xpparel/shared-services";
import { Alert, Button, Col, Form, Modal, Row, Select, Table, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Divider } from "antd/lib";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
const { Option } = Select
interface EmbJobInfoModel {
    lineId: number
    jobNumber: string
    operations: string[]
    supplierId: number
    supplierName: string
    supplierLocation: string
    laynumber: number
    component: string[]
    cutNumber: number
    refDocket: string[]
    gatePassRequestNo: string,
    cutStatus: CutStatusEnum
}

const EmbellishmentGatePassForm = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [embJobsData, setEmbJobsData] = useState<EmbJobInfoModel[]>([]);
    const [vendorsData, setvendorsData] = useState<VendorModel[]>([]);
    const [selectionType, setSelectionType] = useState<'checkbox'>('checkbox');
    const [checkedRows, setCheckedRows] = useState<any[]>([]);
    const [indices, setIndices] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [remarks, setRemarks] = useState<string>('');
    const [gatePassForm] = Form.useForm();
    const embRequestService = new EmbRequestHandlingService()
    const vendorService = new VendorService()
    const embDispatchService = new EmbDispatchService();
    const orderService = new OrderManipulationServices()
    const poService = new POService()
    const [saleOrders, setSaleOrders] = useState<SoListModel[]>([]);
    const [poSerial, setPoSerial] = useState<number>();
    const [productionOrders, setProductionOrders] = useState<PoSummaryModel[]>([]);
    useEffect(() => {
        getSaleOrders()
        getAllVendorsByCategory();
    }, []);
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
    const handeSoChange = (val, option) => {
        if (!option) {
            // unset all the pos once the so is changed or cancelled
            setProductionOrders([]);
            return;
        }
        setProductionOrders([]);
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
    /**
     * Get vendors under emb category
     * @param POSerail 
     */
    const getAllVendorsByCategory = () => {
        const req = new VendorCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, VendorCategoryEnum.EMBELLISHMENT);
        vendorService.getAllVendorsByVendorCategory(req)
            .then((res) => {
                if (res.status) {
                    setvendorsData(res.data);
                } else {
                    setvendorsData([]);
                }
            })
            .catch((err) => {
            });
    }

    /**
     * Get EMbJoblines under production order
     * @param POSerail 
     */
    const getEmbJobInfo = () => {
        const req = new PoSerialWithEmbPrefRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, true, true, false)
        embRequestService.getEmbJobsForPo(req)
            .then((res) => {
                if (res.status) {
                    const embJobs: EmbJobInfoModel[] = []
                    for (const headerData of res.data) {
                        if (headerData.embLines.length > 0) {
                            headerData.embLines.map((headerline) => {
                                const supplier = vendorsData.find(item => item.id == headerline.supplierId);
                                try {
                                    embJobs.push({ lineId: headerline.lineId, jobNumber: headerData.embJobNumber, operations: headerData.operations, supplierId: headerline.supplierId, supplierName: supplier?.vName, supplierLocation: supplier?.vPlace, laynumber: headerline.panelFormEmbProps?.layNumber, component: headerline.panelFormEmbProps?.components, cutNumber: headerline.panelFormEmbProps?.cutNumber, refDocket: headerData.dockets, gatePassRequestNo: headerline.dispatchReqNo, cutStatus: CutStatusEnum.COMPLETED });
                                } catch (error) {
                                    console.log(error);
                                }
                            });
                        } else {
                            embJobs.push({ lineId: null, jobNumber: headerData.embJobNumber, operations: headerData.operations, supplierId: null, supplierName: '', supplierLocation: '', laynumber: null, component: [], cutNumber: null, refDocket: headerData.dockets, gatePassRequestNo: '', cutStatus: CutStatusEnum.OPEN });
                        }
                    }
                    setEmbJobsData(embJobs);
                    // setEmbJobsData(res.data);
                } else {
                    setEmbJobsData([]);
                }
            }).catch((err) => {
            });
    }

    const rowSelection = {
        getCheckboxProps: record => ({
            disabled: (!record.supplierId || record.gatePassRequestNo),
            // Add more props as needed based on other column values
        }),
        onChange: (selectedRowKeys: React.Key[], selectedRows: EmbJobInfoModel[]) => {
            setCheckedRows(selectedRows)
            setIndices(selectedRowKeys)
        }
    }

    const handleGatepassRequest = () => {
        const seen = new Set();
        for (const item of checkedRows) {
            const value = item['supplierId'];
            seen.add(value);
        }
        if (Array.from(seen).length > 1) {
            AlertMessages.getErrorMessage('Multiple vendors cannot be under the same dispacth request')
        } else {
            setIsModalOpen(true)
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleRemarks = (e) => {
        setRemarks(e.target.value)
    }

    const createGatePass = () => {
        const lineIds: number[] = []
        checkedRows.map(line => {
            lineIds.push(line.lineId)
        })
        const req = new EmbDispatchCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, lineIds, checkedRows[0].supplierId, remarks)
        embDispatchService.createEmbDispatch(req)
            .then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage)
                    // const indexesToDelete = indices; // Indexes to delete from the array

                    // // Sort indexes in descending order to prevent issues with the splice operation
                    // indexesToDelete.sort((a, b) => b - a);

                    // indexesToDelete.forEach(index => {
                    //     embJobsData.splice(index, 1); 
                    // });
                    // setEmbJobsData([...embJobsData])
                    setIsModalOpen(false);
                    getEmbJobInfo();
                    setCheckedRows([]);
                    setIndices([]);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            })
            .catch((err) => {
            });

    }

    const getModalContent = () => {
        return (
            <>
                <Divider />
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name={`embLocation`}
                            label='Emb Location'
                        >
                            <Select
                                placeholder={'Select Location'}
                                style={{ width: '100%' }}
                                allowClear
                            >
                                {Object.keys(EmbLocationTypeEnum).map((location) => (
                                    <Option key={location} value={location}>
                                        {location}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="Remarks" label="Remarks">
                            <TextArea rows={1} onChange={handleRemarks} maxLength={50} placeholder="Only 50 cahracters are allowed"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify={"end"}>
                    <Button className="btn-green" type="primary" onClick={createGatePass}>
                        Create Gate Pass
                    </Button>
                </Row>
            </>
        )
    }

    const embJobInfoColumns: any[] = [
        {
            key: 'jobNumber',
            title: 'Emb Job',
            align: 'center',
            dataIndex: "jobNumber",
        },
        {
            key: 'refDocket',
            title: 'Docket Number',
            align: 'center',
            dataIndex: "refDocket",
        },
        {
            key: 'laynumber',
            title: 'Lay Number',
            align: 'center',
            dataIndex: "laynumber",
        },
        {
            key: 'operations',
            title: 'Operations',
            align: 'center',
            dataIndex: "operations",
            render: (values: string[]) => {
                return values.map(o => {
                    return <Tag color='red'>{o}</Tag>
                })
            }
        },
        {
            key: 'cutStatus',
            title: 'Cut Status',
            align: 'center',
            dataIndex: "cutStatus",
            render: (value: CutStatusEnum) => {
                const color = value == CutStatusEnum.COMPLETED ? "green" : "orange";
                return <Tag color={color}>{cutStatusEnumDisplayValues[value]}</Tag>
            }
        },
        {
            key: 'component',
            title: 'Components',
            align: 'center',
            dataIndex: "component",
            render: (value) => (
                <Tag color="blue">{value.toString()}</Tag>
            )
        },
        {
            key: 'cutNumber',
            title: 'Cut Number',
            align: 'center',
            dataIndex: "cutNumber",
        },
        {
            key: 'supplierName',
            title: 'Supplier',
            align: 'center',
            dataIndex: "supplierName",
        },
        {
            key: 'gatePassRequestNo',
            title: 'Gate Pass Request Number',
            align: 'center',
            dataIndex: "gatePassRequestNo",
            render: (reqNo: string) => {
                return reqNo ? reqNo : <span style={{ color: "red"}}>Print the emb barcodes to create dispatch</span>
            }
        },
    ];
    const handlePOChange = (val, row) => {
        if (!row) {
            setPoSerial(0);
            setProductionOrders([]);
            return;
        }
        setPoSerial(row.poSerial);
    }

    //to get the jobs against the SO and PO
    const handleSubmit = (values) => {
        getEmbJobInfo()
    }
    return (
        <>
            <Row justify="space-between">
                <Col>
                    <Form form={gatePassForm} layout="inline">
                        <Form.Item
                            label={`SO/Plant Style Ref`}
                            name={`saleOrder`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Select SO/Plant Style Ref',
                                },
                            ]}
                        >
                            <Select
                                style={{ width: '200px' }}
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

                        <Form.Item
                            label={`Select Cut Order`}
                            name={`prodOrder`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Select Cut Order',
                                },
                            ]}
                        >
                            <Select
                                placeholder={'Select Cut Order'}
                                style={{ width: 200 }}
                                onChange={handlePOChange}
                            >
                                {productionOrders.map((prodOrderInfo) => (
                                    <Option key={prodOrderInfo.poId} poSerial={prodOrderInfo.poSerial} value={prodOrderInfo.poId}>
                                        {`${prodOrderInfo.poSerial}-${prodOrderInfo.poDesc}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Button type="primary" onClick={handleSubmit}>Search</Button>
                    </Form>
                </Col>
                <Col>
                    {checkedRows.length > 0 ? <Button className="btn-green" type="primary" onClick={handleGatepassRequest}>
                        Create Gate Pass
                    </Button> : <></>}
                </Col>
            </Row>
            <br />

            <Table
                rowKey={(record, index) => index}
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={embJobInfoColumns}
                dataSource={embJobsData}
                bordered
                pagination={false}
                size='small'
                style={{ fontSize: '12px' }}
            />

            <Modal title={
                <Row gutter={24}>
                    <Col span={6}>
                        {'Gate Pass Creation'}
                    </Col>
                    <Col span={5}>
                    </Col>
                    <Col span={6}>
                        <Alert style={{ height: '25px' }} message={`Vendor : ${checkedRows[0]?.supplierName}`} type="success" />
                    </Col>
                    <Col span={6}>
                        <Alert style={{ height: '25px' }} message={`Location : ${checkedRows[0]?.supplierLocation}`} type="info" />
                    </Col>
                </Row>
            }
                footer={null} open={isModalOpen} width={'60%'} onCancel={handleCancel}
            >
                <>{getModalContent()}</>
            </Modal>
        </>
    )
}
export default EmbellishmentGatePassForm