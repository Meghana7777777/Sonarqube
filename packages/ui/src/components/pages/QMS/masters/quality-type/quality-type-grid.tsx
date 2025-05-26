import Icon, { EditOutlined } from '@ant-design/icons'
import { QualityTypeActivateDeactivateDto, QualityTypeChangeRequest } from '@xpparel/shared-models'
import { QualityTypeServices } from '@xpparel/shared-services'
import { Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table, message } from 'antd'
import { useAppSelector } from 'packages/ui/src/common'
import { AlertMessages } from 'packages/ui/src/components/common'
import { useEffect, useState } from 'react'
import QualityTypeForm from './quality-type-form'

const QualityTypeView = () => {
    const service = new QualityTypeServices();
    const [qualityTypeData, setQualityTypeData] = useState<any[]>([]);
    const [approverData, setApproverTypeData] = useState<any[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(Boolean)
    const user = useAppSelector((state) => state.user.user.user);
    const [qualitytypeId, setQualityTypeId] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [selectedRecord, setSelectedRecord] = useState<any>();
    const [title, setTitle] = useState("Create Quality Type");
    const [refreshKey,setRefreshKey] = useState<number>(1)
    const [form] = Form.useForm()

    useEffect(() => {
        getAllQualityType();
    }, []);

    const getAllQualityType = () => {
        service.getAllQualityType().then(res => {
            if (res.status) {
                setQualityTypeData(res.data);
            } else {
                setQualityTypeData([]);
            }
        }).catch(err => {
            setQualityTypeData([]);
        }).finally(() => {
        })
    }

    const createQualityType = () => {
        form.validateFields().then(values => {
            const req = new QualityTypeChangeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.qualityType);
            service.createQualityType(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    setIsCreateModalOpen(false);
                    getAllQualityType();
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

    const updateQualityType = () => {
        form.validateFields().then((values) => {
            service.updateQualityType(values).then((res) => {
                if (res.status) {
                    message.success('Updated Successfully');
                    setIsUpdateModalOpen(false);
                    getAllQualityType();
                } else {
                    message.error(res.internalMessage);
                }
            });
        }).catch((errorInfo) => {
            console.error("Validation failed:", errorInfo);
            message.error("Please fix the form errors before submitting.");
        });
    };

    const activateOrDeactivateQualityType = (rowData: any) => {
        rowData.isActive = rowData.isActive ? false : true;
        const req = new QualityTypeActivateDeactivateDto(rowData.id, rowData.isActive, rowData.versionFlag);
        service.activateOrDeactivateQualityType(req).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
                getAllQualityType();
            }
        })

    }

    const columnsSkelton: any = [
        {
            title: 'Quality Type',
            dataIndex: 'qualityType',
            align: 'center',
        },

        {
            title: `Action`,
            dataIndex: 'action',
            align: "center",
            render: (text, rowData) => (
                <span>
                    <EditOutlined style={{ color: "blue", fontSize: "20px" }} onClick={() => showUpdateModal(rowData)} />
                    <Divider type="vertical" />
                    <Popconfirm onConfirm={e => { activateOrDeactivateQualityType(rowData); }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to deactivate this Quality type  ?'
                                : 'Are you sure to activate this Quality type ?'
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
        setTitle("Create Quality Type");
    }

    const showUpdateModal = (record) => {
        setQualityTypeId(true);
        setSelectedRecord(record);
        setIsUpdateModalOpen(true);
        setOkText("Update");
        setTitle("Update Quality Type");
    };

    const onCancel = () => {
        setIsCreateModalOpen(false)
        setIsUpdateModalOpen(false)
        setRefreshKey(prev => prev+1)
    }

    return (
        <div>
            <Card title='Quality Type' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
                <br />
                <Table
                    columns={columnsSkelton}
                    dataSource={qualityTypeData}
                    // sticky={true}
                    size='small'
                    style={{minWidth: '100%'}}
                    scroll={{x: 'max-content'}}
                />

                <Modal
                    key={new Date().toJSON()}
                    width="40%"
                    title={title}
                    cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                    style={{ textAlign: "center" }}
                    open={isCreateModalOpen}
                    onCancel={onCancel}
                    onOk={createQualityType}
                    okText={oktext}
                    cancelText="Close"
                >
                    <QualityTypeForm  form={form} />
                </Modal>

                <Modal
                    width="50%"
                    title="Update Quality Type"
                    cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                    style={{ textAlign: "center" }}
                    open={isUpdateModalOpen}
                    onCancel={onCancel}
                    onOk={updateQualityType}
                    okText={oktext}
                    cancelText="Close"
                >
                    <QualityTypeForm form={form} initialvalues={selectedRecord} qualitytypeId={qualitytypeId} />
                </Modal>

            </Card>
        </div>
    )
}

export default QualityTypeView