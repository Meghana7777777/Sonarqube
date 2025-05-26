import Icon, { EditOutlined } from '@ant-design/icons'
import { EscallationTypeEnum, EscalltionChangeRequest, QualityTypeActivateDeactivateDto } from '@xpparel/shared-models'
import { EscallationServices } from '@xpparel/shared-services'
import { Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table, message } from 'antd'
import { useAppSelector } from 'packages/ui/src/common'
import { AlertMessages } from 'packages/ui/src/components/common'
import { useEffect, useState } from 'react'
import EscallationForm from './escallation-form'

const EscallationView = () => {
    const service = new EscallationServices();
    const [escallationData, setEscallationData] = useState<any>([])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(Boolean)
    const user = useAppSelector((state) => state.user.user.user);
    const [escallationId, setEscallationId] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [selectedRecord, setSelectedRecord] = useState<any>();
    const [title, setTitle] = useState("Create Escallation");
    const [form] = Form.useForm()


    useEffect(() => {
        getAllEscallation();
    }, []);

    const getAllEscallation = () => {
        service.getAllEscallation().then(res => {
            if (res.status) {
                setEscallationData(res.data);
            } else {
                setEscallationData([]);
            }
        }).catch(err => {
            setEscallationData([]);
            AlertMessages.getErrorMessage(err.message);
        }).finally(() => {
        })
    }

    const createEscallation = () => {
        form.validateFields().then(values => {
            const req = new EscalltionChangeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.escalationType, values.style, values.buyer, values.workOrder, values.qualityType, values.escalationPercentage, values.escalationPerson);
            service.createEscallation(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    setIsCreateModalOpen(false);
                    getAllEscallation();
                    form.resetFields()
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            }).catch(err => {
                console.log(err);
            })
        }).catch((err) => {
            AlertMessages.getErrorMessage("Please fill all the required fileds before creation.");
        })
    }

    const activateOrDeactivateEscallation = (rowData: any) => {
        rowData.isActive = rowData.isActive ? false : true;
        const req = new QualityTypeActivateDeactivateDto(rowData.id, rowData.isActive, rowData.versionFlag);
        service.activateOrDeactivateEscallation(req).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
                getAllEscallation();
            }
        })

    }

    const updateEscallation = () => {
        form.validateFields().then((values) => {
            service.updateEscallation(values).then((res) => {
                if (res.status) {
                    message.success('Updated Successfully');
                    setIsUpdateModalOpen(false);
                    getAllEscallation();
                } else {
                    message.error(res.internalMessage);
                }
            });
        }).catch((errorInfo) => {
            console.error("Validation failed:", errorInfo);
            message.error("Please fix the form errors before submitting.");
        });
    };

    const columnsSkelton: any = [
        {
            title: 'Escalation Type',
            dataIndex: 'escalationType',
            align: 'center',
        },
        {
            title: 'Style',
            dataIndex: 'style',
            align: 'center',
            render: (text) => {
                return text ? text : "-"
            }
        },
        {
            title: 'Buyer',
            dataIndex: 'buyer',
            align: 'center',
            render: (text) => {
                return text ? text : "-"
            }
        },
        {
            title: 'Work Order',
            dataIndex: 'workOrder',
            align: 'center',
            render: (text) => {
                return text ? text : "-"
            }
        },
        {
            title: 'Quality Type',
            dataIndex: 'qualityType',
            align: 'center',
        },
        {
            title: 'Escalation Person',
            dataIndex: 'approverName',
            align: 'center',
        },
        {
            title: 'Escalation Percentage',
            dataIndex: 'escalationPercentage',
            align: 'center',
        },
        {
            title: `Action`,
            dataIndex: 'action',
            align: "center",
            render: (text, rowData) => (
                <span>
                    <EditOutlined style={{ color: "blue", fontSize: "20px" }} onClick={() => showUpdateModal(rowData)} /><Divider type="vertical" />
                    <Divider type="vertical" />
                    <Popconfirm onConfirm={e => { activateOrDeactivateEscallation(rowData); }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to deactivate this Escallation   ?'
                                : 'Are you sure to activate this Escallation  ?'
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
        setTitle("Create Escallation");
    }

    const showUpdateModal = (record) => {
        setEscallationId(true);
        setSelectedRecord(record);
        setIsUpdateModalOpen(true);
        setOkText("Update");
        setTitle("Update Escallation");
    };

    const onCancel = () => {
        setIsCreateModalOpen(false)
        setIsUpdateModalOpen(false)
    }

    return (
        <div>
            <Card title='Escallation' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
                <Table
                    columns={columnsSkelton}
                    dataSource={escallationData}
                    sticky={true}
                />

                <Modal
                    width="50%"
                    title={title}
                    cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                    style={{ textAlign: "center" }}
                    open={isCreateModalOpen}
                    onCancel={onCancel}
                    onOk={createEscallation}
                    okText={oktext}
                    cancelText="Close"
                >
                    <EscallationForm form={form} />
                </Modal>

                <Modal
                    width="50%"
                    title={title}
                    cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                    style={{ textAlign: "center" }}
                    open={isUpdateModalOpen}
                    onCancel={onCancel}
                    onOk={updateEscallation}
                    okText={oktext}
                    cancelText="Close"
                >
                    <EscallationForm form={form} initialvalues={selectedRecord} escallationId={escallationId} />
                </Modal>
            </Card>
        </div>
    )
}

export default EscallationView