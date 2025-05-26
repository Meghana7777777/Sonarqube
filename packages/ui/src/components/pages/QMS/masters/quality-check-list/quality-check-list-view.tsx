import Icon, { EditOutlined } from '@ant-design/icons';
import { QualityCheckListChangeRequest, QualityTypeChangeRequest } from '@xpparel/shared-models';
import { QualityCheckListServices } from '@xpparel/shared-services';
import { Button, Card, Divider, Form, message, Modal, Popconfirm, Switch, Table } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useEffect, useState } from 'react';
import QualityCheckListForm from './quality-check-list-form';

const QualityCheckListView = () => {

    const service = new QualityCheckListServices()
    const [data, setData] = useState<any>([])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(Boolean)
    const user = useAppSelector((state) => state.user.user.user);
    const [qualityCheckListId, setQualityCheckListId] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [selectedRecord, setSelectedRecord] = useState<any>();
    const [title, setTitle] = useState("Create Quality Check List");
    const [form] = Form.useForm()

    useEffect(() => {
        getAllQualityCheckListParameter()
    }, [])

    const getAllQualityCheckListParameter = () => {
        try {
            service.getAllQualityCheckListParameter().then((res) => {
                if (res.status) {
                    setData(res.data)
                } else {
                    setData([])
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const createQualityCheckListParameter = () => {
        form.validateFields().then(values => {
            const req = new QualityCheckListChangeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.qualityTypeId, values.parameter);
            service.createQualityCheckListParameter(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    setIsCreateModalOpen(false);
                    getAllQualityCheckListParameter();
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

    const updateQualityCheckListParameter = () => {
        form.validateFields().then((values) => {
            service.updateQualityCheckListParameter(values).then((res) => {
                if (res.status) {
                    message.success('Updated Successfully');
                    setIsUpdateModalOpen(false);
                    getAllQualityCheckListParameter();
                } else {
                    message.error(res.internalMessage);
                }
            });
        }).catch((errorInfo) => {
            console.error("Validation failed:", errorInfo);
            message.error("Please fix the form errors before submitting.");
        });
    };

    const activateDeactivateQualityCheckListParameter = (rowData: any) => {
        rowData.isActive = rowData.isActive ? false : true;
        service.activateDeactivateQualityCheckListParameter(rowData)
            .then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage)
                    getAllQualityCheckListParameter();
                }
            })
    }

    const columns: any = [
        {
            title: "Quality Type",
            align: 'center',
            dataIndex: "qualityType",
        },
        {
            title: "Parameter",
            align: 'center',
            dataIndex: "parameter",
        },
        {
            title: "Actions",
            align: 'center',
            dataIndex: 'action',
            render: (text, rowData) => (
                <>
                    <EditOutlined style={{ color: "blue", fontSize: "20px" }} onClick={() => showUpdateModal(rowData)} />
                    <Divider type="vertical" />
                    <Popconfirm onConfirm={e => { activateDeactivateQualityCheckListParameter(rowData); }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to deactivate this Quality Parameter  ?'
                                : 'Are you sure to activate this Quality Parameter ?'
                        }
                    >
                        <Switch size='default' defaultChecked
                            className={rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            checked={rowData.isActive} />
                    </Popconfirm>
                </>
            )
        },

    ]

    const showModals = () => {
        setIsCreateModalOpen(true)
        setOkText("Submit")
        setTitle("Create Quality Check List");
    }

    const showUpdateModal = (record) => {
        setQualityCheckListId(true);
        setSelectedRecord(record);
        setIsUpdateModalOpen(true);
        setOkText("Update");
        setTitle("Update Quality Check List");
    };

    const onCancel = () => {
        setIsCreateModalOpen(false)
        setIsUpdateModalOpen(false)
    }

    return (
        <>
            <Card title='Quality Check List' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
                <br />
                <Table columns={columns} dataSource={data} className='custom-table' size='small' />

                <Modal
                    width="40%"
                    title={title}
                    cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                    style={{ textAlign: "center" }}
                    open={isCreateModalOpen}
                    onCancel={onCancel}
                    onOk={createQualityCheckListParameter}
                    okText={oktext}
                    cancelText="Close"
                >
                    <QualityCheckListForm form={form} />
                </Modal>

                <Modal
                    width="50%"
                    title="Update Quality Type"
                    cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                    style={{ textAlign: "center" }}
                    open={isUpdateModalOpen}
                    onCancel={onCancel}
                    onOk={updateQualityCheckListParameter}
                    okText={oktext}
                    cancelText="Close"
                >
                    <QualityCheckListForm form={form} initialvalues={selectedRecord} qualityCheckListId={qualityCheckListId} />
                </Modal>

            </Card>
        </>
    )
}

export default QualityCheckListView