import { CheckOutlined, DeleteFilled, FolderOpenOutlined, MinusOutlined, PlusOutlined, PrinterOutlined, SendOutlined } from "@ant-design/icons";
import { EmbDispacthLineModel, EmbDispatchIdStatusRequest, EmbDispatchRequestModel, EmbDispatchStatusEnum, EmbDispatchStatusRequest, VendorCategoryEnum, VendorCategoryRequest, VendorModel } from "@xpparel/shared-models";
import { EmbDispatchService, VendorService } from "@xpparel/shared-services";
import { Button, Col, Divider, Row, Table, Tabs, TabsProps, Tag, Tooltip } from "antd";
import { convertBackendDateToLocalTimeZone, useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { ColumnProps } from "antd/es/table";
import EmbDispatchLinesGrid from "./emb-dispatch-lines-grid";

// interface IProps {
//     soId: string;
//     poId: string
// }
const EmbellishmentGatePassRequestsGrid = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const embDispatchReqService = new EmbDispatchService()
    const vendorService = new VendorService()
    const [dispatchRequestsData, setDispatchRequestsData] = useState<EmbDispatchRequestModel[]>([]);
    const [dispatchLinesData, setDispatchLinesData] = useState<EmbDispacthLineModel[]>([]);
    const [vendorsData, setvendorsData] = useState<VendorModel[]>([]);
    const [tabValue, setTabValue] = useState<EmbDispatchStatusEnum>(EmbDispatchStatusEnum.OPEN);
    useEffect(() => {
        getEmbDispatchRequsets(EmbDispatchStatusEnum.OPEN)
        getAllVendorsByCategory()
    }, [])

    const getEmbDispatchRequsets = (status) => {
        const req = new EmbDispatchStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, status, true)
        embDispatchReqService.getEmbDispatchRequestsByReqStatus(req).then((res) => {
            if (res.status) {
                setDispatchRequestsData(res.data)
            } else {
                setDispatchRequestsData([])
            }
        }).catch(() => {

        });
    }

    /**
     * Get vendors under emb category
     * @param POSerail 
     */
    const getAllVendorsByCategory = () => {
        const req = new VendorCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, VendorCategoryEnum.EMBELLISHMENT)
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

    const dispatchEMbRequest = (id, index, status: EmbDispatchStatusEnum) => {
        const req = new EmbDispatchIdStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, id, status)
        embDispatchReqService.updateEmbDispatchStatus(req).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
                dispatchRequestsData.splice(index, 1);
                setDispatchRequestsData(dispatchRequestsData);
                status == EmbDispatchStatusEnum.SENT ? tabOnChange(EmbDispatchStatusEnum.OPEN) : tabOnChange(EmbDispatchStatusEnum.SENT);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(() => {

        })
    }

    const deleteEmbGatePassReq = (reqId: number, index: number) => {
        const req = new EmbDispatchIdStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, reqId, null);
        embDispatchReqService.deleteEmbDispatch(req).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                dispatchRequestsData.splice(index, 1);
                setDispatchRequestsData(dispatchRequestsData);
                tabOnChange(EmbDispatchStatusEnum.OPEN);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(() => {

        })
    }


    const dispatchCreatedDateColumns = {
        key: 'dispatchReqCreationDate',
        title: 'Dispatch Created On',
        align: 'center',
        dataIndex: "dispatchReqCreatedOn",
        render: (value) => {
            return <>{convertBackendDateToLocalTimeZone(value)}</>
        }
    }

    const sentOutDateColumns = {
        key: 'sentOutDate',
        title: 'Sent Out On',
        align: 'center',
        dataIndex: "dispatchSentOutOn",
        render: (value) => {
            return <>{convertBackendDateToLocalTimeZone(value)}</>
        }
    }

    const receivedInDateColumns = {
        key: 'receivedDate',
        title: 'Received On',
        align: 'center',
        dataIndex: "dispatchReceivedInOn",
        render: (value) => {
            return <>{convertBackendDateToLocalTimeZone(value)}</>
        }
    }

    const tableDataColumns: any[] = [
        {
            key: 'dispatchReqNo',
            title: 'Gatepass Request No.',
            align: 'center',
            dataIndex: "dispatchReqNo",
        },
        {
            key: 'soNo',
            title: 'SO Number',
            align: 'center',
            dataIndex: "soNo",
        },
        {
            key: 'soLines',
            title: 'SO Lines',
            align: 'center',
            dataIndex: "soLines",
            render: (values: string[]) => {
                return <>{values.toString()}</>
            }
        },
        {
            key: 'embJobNumbers',
            title: 'Emb Job Numbers',
            align: 'center',
            dataIndex: "embJobNumbers",
            render: (value) => {
                return <>{value.toString()}</>
            }
        },
        {
            key: 'docketGroup',
            title: 'Ref Dockets',
            align: 'center',
            dataIndex: "docketGroup",
            render: (value: string, record) => {
                    return <Tag color='orange'>{value}</Tag>
              
            }
        },
        // {
        //     key: 'dockets',
        //     title: 'Ref Dockets',
        //     align: 'center',
        //     dataIndex: "dockets",
        //     render: (values: string[], record) => {
        //         return values.map(d => {
        //             return <Tag color='orange'>{d}</Tag>
        //         })
        //     }
        // },
        {
            key: 'supplierId',
            title: 'Supplier Name',
            align: 'center',
            dataIndex: "supplierId",
            render: (value) => {
                return <>{vendorsData?.filter(item => String(item.id) == value)[0].vName}</>
            }
        },

        ...(tabValue == EmbDispatchStatusEnum.OPEN ? [dispatchCreatedDateColumns] : tabValue == EmbDispatchStatusEnum.SENT ? [dispatchCreatedDateColumns,sentOutDateColumns] : [dispatchCreatedDateColumns, sentOutDateColumns, receivedInDateColumns]),

        tabValue == EmbDispatchStatusEnum.RECEIVED ? <></> :
            {
                key: 'action',
                title: 'Action',
                align: 'center',
                render: (value, record, index) => {
                    return <>
                        <span>
                            <><Row>
                                {tabValue == EmbDispatchStatusEnum.OPEN ?
                                    <>
                                    {/* <Tooltip title='Print'>
                                        <Button icon={<PrinterOutlined />} className="btn-green" danger type="primary" >
                                        </Button>
                                    </Tooltip> */}
                                    <Tooltip title='Delete'>
                                        <Button className="btn-red" danger type="primary" onClick={()=>deleteEmbGatePassReq(record.dispatchReqId, index)}>Delete</Button>
                                    </Tooltip>
                                    </> : <></>}
                                <Divider type="vertical" />
                                {/* {tabValue != EmbDispatchStatusEnum.RECEIVED? */}
                                <Tooltip title={tabValue == EmbDispatchStatusEnum.OPEN ? "Check Out" : "Check In"}>
                                    <Button className="btn-blue" type="primary" onClick={() => dispatchEMbRequest(record.dispatchReqId, index, tabValue == EmbDispatchStatusEnum.OPEN ? EmbDispatchStatusEnum.SENT : EmbDispatchStatusEnum.RECEIVED)}>
                                        {tabValue == EmbDispatchStatusEnum.OPEN ? "Check Out" : "Check In"}
                                    </Button>
                                </Tooltip>
                                {/* :<>N/A</>} */}
                            </Row></>
                        </span>
                    </>
                }
            },]
    const embJobsData = []
    const dispatchLinesColumns: any[] = [
        {
            key: 'embJobNo',
            title: 'Emb Job',
            align: 'center',
            dataIndex: "embJobNo",
        },
        {
            key: 'docketNumber',
            title: 'Docket Number',
            align: 'center',
            dataIndex: "docketNumber",
        },
        {
            key: 'cutNo',
            title: 'Cut Number',
            align: 'center',
            dataIndex: "cutNo",
        },
        {
            key: 'layNumber',
            title: 'Lay Number',
            align: 'center',
            dataIndex: "layNumber",
        },
        {
            key: 'components',
            title: 'Components',
            align: 'center',
            dataIndex: "components",
            render: (value) => {
                return <Tag color="blue">{value.toString()}</Tag>
            }
        },
        {
            key: 'totalBundles',
            title: 'Total Bundles',
            align: 'center',
            dataIndex: "totalBundles",
        },
        {
            key: 'quantity',
            title: 'Total Quantity',
            align: 'center',
            dataIndex: "quantity",
        },

    ]

    const getLineInfo = (id, status) => {
        return <EmbDispatchLinesGrid {...{ dispatchId: id, status: status }} />
    }

    const tabComponents: TabsProps['items'] = [
        {
            key: EmbDispatchStatusEnum.OPEN,
            label: <><FolderOpenOutlined />Open Requests</>,
            children: <Table
                expandable={{
                    expandedRowRender: (record) => getLineInfo(record.dispatchReqId, EmbDispatchStatusEnum.OPEN),
                    // rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
                rowKey={(record, index) => index}
                columns={tableDataColumns}
                dataSource={dispatchRequestsData}
                bordered
                pagination={false}
                size='small'

            />
        },
        {
            key: EmbDispatchStatusEnum.SENT,
            label: <><SendOutlined />Sent</>,
            children: <Table
                expandable={{
                    expandedRowRender: (record) => getLineInfo(record.dispatchReqId, EmbDispatchStatusEnum.SENT),
                    // rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
                rowKey={(record, index) => index}
                columns={tableDataColumns}
                dataSource={dispatchRequestsData}
                bordered
                pagination={false}
                size='small'

            />,
        },
        {
            key: EmbDispatchStatusEnum.RECEIVED,
            label: <><CheckOutlined />Received</>,
            children: <Table
                expandable={{
                    expandedRowRender: (record) => getLineInfo(record.dispatchReqId, EmbDispatchStatusEnum.RECEIVED),
                    // rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
                rowKey={(record, index) => index}
                columns={tableDataColumns}
                dataSource={dispatchRequestsData}
                bordered
                pagination={false}
                size='small'
            />,
        },

    ];
    const tabOnChange = (val) => {
        setTabValue(val)
        if (val == EmbDispatchStatusEnum.OPEN) {
            getEmbDispatchRequsets(EmbDispatchStatusEnum.OPEN)
        }
        if (val == EmbDispatchStatusEnum.SENT) {
            getEmbDispatchRequsets(EmbDispatchStatusEnum.SENT)
        }
        if (val == EmbDispatchStatusEnum.RECEIVED) {
            getEmbDispatchRequsets(EmbDispatchStatusEnum.RECEIVED)
        }
    }
    return (
        <>
            <Tabs defaultActiveKey={EmbDispatchStatusEnum.OPEN} items={tabComponents} onChange={tabOnChange} />
        </>
    )
}
export default EmbellishmentGatePassRequestsGrid

