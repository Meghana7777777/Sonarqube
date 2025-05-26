import Icon, { EditOutlined } from '@ant-design/icons'
import { ApproverActivateDeactivateDto, ApproverChangeRequest, CommonRequestAttrs } from '@xpparel/shared-models'
import { ApproverServices } from '@xpparel/shared-services'
import { Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table, message } from 'antd'
import { useAppSelector } from 'packages/ui/src/common'
import { AlertMessages } from 'packages/ui/src/components/common'
import { useEffect, useState } from 'react'
import ApproverForm from './approver-form'

const ApproverView = () => {
    const service = new ApproverServices();
    const [approverData, setApproverTypeData] = useState<any[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(Boolean)
    const user = useAppSelector((state) => state.user.user.user);
    const [approverId, setApproverId] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [selectedRecord, setSelectedRecord] = useState<any>();
    const [title, setTitle] = useState("Create Approver");
    const [form] = Form.useForm()

    useEffect(() => {
        getAllApprovers();
    }, []);

    const getAllApprovers = () => {
        service.getAllApprovers().then(res => {
            if (res) {
                setApproverTypeData(res.data);
            } else {
                if (res.data) {
                    setApproverTypeData([]);
                } else {
                }
            }
        }).catch(err => {
            setApproverTypeData([]);
        }).finally(() => {
        })
    }

    const createApprover = () => {
        form.validateFields().then(values => {
            const req = new ApproverChangeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.approverName, values.emailId);
            service.createApprover(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    setIsCreateModalOpen(false);
                    getAllApprovers();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            }).catch(err => {
                console.log(err);
            })
        }).catch((err) => {
            AlertMessages.getErrorMessage("Please fill all the required fileds before creation.");
        })

    };

    const updateApprover = () => {
        form.validateFields().then((values) => {
            service.updateApprover(values).then((res) => {
                if (res.status) {
                    message.success('Updated Successfully');
                    setIsUpdateModalOpen(false);
                    getAllApprovers();
                } else {
                    message.error(res.internalMessage);
                }
            });
        }).catch((errorInfo) => {
            console.error("Validation failed:", errorInfo);
            message.error("Please fix the form errors before submitting.");
        });
    };

    const activateOrDeactivateApprover = (rowData: any) => {
        rowData.isActive = rowData.isActive ? false : true;
        const req = new ApproverActivateDeactivateDto(rowData.id, rowData.isActive, rowData.versionFlag);
        service.activateOrDeactivateApprover(req).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
                getAllApprovers();
            }
        })

    }

    const columnsSkelton: any = [
        {
            title: 'Approver',
            dataIndex: 'approverName',
            align: 'center',
        },
        {
            title: 'Email',
            dataIndex: 'emailId',
            align: 'center',
        },

        {
            title: `Actions`,
            dataIndex: 'action',
            align: "center",
            render: (text, rowData) => (
                <span>
                    <EditOutlined style={{ color: "blue", fontSize: "20px" }} onClick={() => showUpdateModal(rowData)} /><Divider type="vertical" />
                    <Divider type="vertical" />
                    <Popconfirm onConfirm={e => { activateOrDeactivateApprover(rowData); }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to deactivate this Approver  ?'
                                : 'Are you sure to activate this Approver ?'
                        }
                    >
                        <Switch size='default' defaultChecked
                            className={rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            checked={rowData.isActive} />
                    </Popconfirm>
                </span>
            )
        }

    ]

    const showModals = () => {
        setIsCreateModalOpen(true)
        setOkText("Submit")
        setTitle("Create Shift");
    }

    const showUpdateModal = (record) => {
        setApproverId(true);
        setSelectedRecord(record);
        setIsUpdateModalOpen(true);
        setOkText("Update");
        setTitle("Update Approver");
    };

    const onCancel = () => {
        setIsCreateModalOpen(false)
        setIsUpdateModalOpen(false)
    }

    return (

        <div>
            <Card title='Approver' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
                <br />
                <Table
                    columns={columnsSkelton}
                    dataSource={approverData}
                    sticky={true}
                />
                <Modal
                    width="50%"
                    title={title}
                    cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                    style={{ textAlign: "center" }}
                    open={isCreateModalOpen}
                    onCancel={onCancel}
                    onOk={createApprover}
                    okText={oktext}
                    cancelText="Close"
                >
                    <ApproverForm form={form} />
                </Modal>

                <Modal
                    width="50%"
                    title="Update Approver"
                    cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                    style={{ textAlign: "center" }}
                    open={isUpdateModalOpen}
                    onCancel={onCancel}
                    onOk={updateApprover}
                    okText={oktext}
                    cancelText="Close"
                >
                    <ApproverForm form={form} initialvalues={selectedRecord} approverId={approverId} />
                </Modal>

            </Card>
        </div>
    )
}

export default ApproverView