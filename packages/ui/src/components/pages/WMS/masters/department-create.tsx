import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Table, Space, message, Card, Row, Col, Typography, Switch, Divider, Popconfirm } from 'antd';
import Icon, { EditOutlined, DeleteOutlined, PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useAppSelector } from 'packages/ui/src/common';
import { CommonRequestAttrs, DepartmentCreateModel, DepartmentResponseModel, DepartmentTypeEnumForMasters } from '@xpparel/shared-models';
import { GbConfigHelperService, UMSUnitsService } from '@xpparel/shared-services';
import { AlertMessages } from '../../../common';
import { ColumnType } from 'antd/es/table';

const { Title } = Typography;

const DepartmentManagement: React.FC = () => {
    const [form] = Form.useForm();
    const [departments, setDepartments] = useState<DepartmentResponseModel[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<DepartmentResponseModel | null>(null);
    const masterService = new GbConfigHelperService()
    const umsUnitsService = new UMSUnitsService()
    const [unitValues, setUnitValues] = useState([])
    const user = useAppSelector((state) => state.user.user.user);

    const { userName, orgData, userId } = user;

    useEffect(() => {
        GetAllDepartments();
    }, [])

    const getUnitOptions = async () => {
        await umsUnitsService.getUnitsByOrgId(user.orgData.companyCode).then((res) => {
            if (res.status) {
                setUnitValues(res.data)
            }
        })
    }
    const unitOptions = unitValues.map((i) => ({
        value: i.name,
        label: i.name
    }));

    ;
    const GetAllDepartments = () => {
        const req = new CommonRequestAttrs(userName, orgData.unitCode, user.orgData.companyCode, user.userId)
        masterService.GetAllDepartments(req).
            then((res) => {
                if (res.status) {
                    // AlertMessages.getSuccessMessage(res.internalMessage)
                    setDepartments(res.data)
                }
            }
            )
    }



    const showCreateModal = () => {
        getUnitOptions()
        form.resetFields();
        form.setFieldsValue({ unit: orgData.unitCode });
        setEditingDepartment(null);
        setIsModalVisible(true);
    };

    const showEditModal = (record: DepartmentResponseModel) => {
        if (!record.isActive) {
            AlertMessages.getWarningMessage("You cannot edit a deactivated department.");
            return;
        }
        form.setFieldsValue(record);
        setEditingDepartment(record);
        setIsModalVisible(true);
    };


    const handleSubmit = () => {
        form.validateFields().then(async values => {
            if (editingDepartment) {
                const req = new DepartmentCreateModel(userName, orgData.unitCode, user.orgData.companyCode, user.userId, editingDepartment.id, values.name, values.code, values.type, values.isActive);
                masterService.createDepartment(req).then((res) => {
                    if (res.status) {
                        GetAllDepartments()
                        AlertMessages.getSuccessMessage(res.internalMessage)
                    } else {
                        AlertMessages.getErrorMessage(res.internalMessage);
                    }
                })
            } else {
                const req = new DepartmentCreateModel(userName, orgData.unitCode, user.orgData.companyCode, user.userId, null, values.name, values.code, values.type, true);
                masterService.createDepartment(req).then((res) => {
                    if (res.status) {
                        GetAllDepartments()
                        AlertMessages.getSuccessMessage(res.internalMessage)
                    } else {
                        AlertMessages.getErrorMessage(res.internalMessage);
                    }
                })
            }
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    // const handleDelete = (id: number) => {
    //     Modal.confirm({
    //         title: 'Are you sure you want to delete this department?',
    //         content: 'This action cannot be undone.',
    //         okText: 'Yes',
    //         okType: 'danger',
    //         cancelText: 'No',
    //         onOk: () => {
    //             const req = new DepartmentCreateModel(userName, orgData.unitCode, user.orgData.companyCode, user.userId, id, undefined, undefined, undefined, undefined
    //             );
    //             masterService.deleteDepartment(req).then((res) => {
    //                 if (res.status) {
    //                     GetAllDepartments()
    //                     AlertMessages.getSuccessMessage(res.internalMessage)
    //                 }else {
    //                     AlertMessages.getErrorMessage(res.internalMessage);
    //                 }
    //             })
    //         }
    //     });
    // };

    const handleToggle = (record: DepartmentResponseModel, isActive: boolean) => {
        Modal.confirm({
            title: `Are you sure you want to ${isActive ? 'enable' : 'disable'} this department?`,
            content: 'This change will update the active status.',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                const req = new DepartmentCreateModel(
                    userName,
                    orgData.unitCode,
                    orgData.companyCode,
                    userId,
                    record.id,
                    record.name,
                    record.code,
                    record.type,
                    record.isActive
                );
                req.isActive = isActive;

                masterService.toggleDepartment(req).then((res) => {
                    if (res.status) {
                        GetAllDepartments();
                        AlertMessages.getSuccessMessage(`Department ${isActive ? 'enabled' : 'disabled'} successfully`);
                    } else {
                        AlertMessages.getErrorMessage(res.internalMessage);
                    }
                });
            }
        });
    };



    const columns: ColumnType<any>[] = [
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            align: 'center'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            align: 'center'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            align: 'center'
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record: DepartmentResponseModel) => (
                <Space size="middle">
                    {/* <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button> */}
                    <Space>
                        <EditOutlined onClick={() => showEditModal(record)} /><Divider type="vertical" />

                        <Popconfirm
                            onConfirm={
                                e => {
                                    handleToggle(record, record.isActive)
                                }}
                            title={record.isActive ? "Are you sure to Deactivate Department ?" : "Are you sure to Activate Department ?"}>
                            <Switch size='default' defaultChecked
                                className={record.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                checked={record.isActive} />
                        </Popconfirm>
                    </Space>

                </Space>
            ),
        }


    ];

    return (
        <div className="p-6">
            <Card
                className="shadow-md mb-6"
                title={
                    <div className="flex justify-between items-center">
                        <Space>
                            <Title level={5} className="m-0">Department Management</Title>
                        </Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showCreateModal}
                            size="middle"
                            style={{ float: 'right' }}
                        >
                            Create
                        </Button>
                    </div>
                }
            >
                <Table
                    dataSource={departments}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    bordered
                    size='small'
                    scroll={{x: 'max-content'}}
                    style={{minWidth: '100%'}}
                    className="shadow-sm"
                />
            </Card>

            <Modal
                title={
                    <Space>
                        {editingDepartment ? <EditOutlined /> : <PlusOutlined />}
                        <span>{editingDepartment ? 'Edit Department' : 'Create Department'}</span>
                    </Space>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        {editingDepartment ? 'Update' : 'Create'}
                    </Button>,
                ]}
                width={500}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ unit: orgData.unitCode }}
                >
                    {/* <Row gutter={16}> */}
                    <Col span={24}>
                        <Form.Item
                            name="unit"
                            label="Unit"
                            rules={[{ required: true, message: 'Please select a unit' }]}
                        >
                            <Select options={unitOptions} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please enter the department name' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    {/* </Row> */}

                    {/* <Row gutter={16}> */}
                    <Col span={24}>
                        <Form.Item
                            name="code"
                            label="Code"
                            rules={[{ required: true, message: 'Please enter the department code' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="type"
                            label="Department Type"
                            rules={[{ required: true, message: 'Please select a department type' }]}
                        >
                            <Select>
                                {Object.values(DepartmentTypeEnumForMasters).map(type => (
                                    <Select.Option key={type} value={type}>
                                        {type}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* </Row> */}
                </Form>
            </Modal>
        </div>
    );
};

export default DepartmentManagement;