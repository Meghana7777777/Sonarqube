import Icon, { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table } from "antd"
import { useEffect, useState } from "react"
import { useAppSelector } from "packages/ui/src/common";
import { MarkerTypeService } from "@xpparel/shared-services";
import { CommonRequestAttrs, MarkerTypeCreateRequest, MarkerTypeIdRequest, MarkerTypeModel } from "@xpparel/shared-models";
import { AlertMessages } from "packages/ui/src/components/common";
import MarkersForm from "./marker-type.form";
import { ColumnsType } from "antd/lib/table";

export const MarkerTypeGrid = () => {
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [selectedRecord, setSelectedRecord] = useState<MarkerTypeModel>();
    const service = new MarkerTypeService();
    const [resData, setResData] = useState<MarkerTypeModel[]>([]);
    const [markerId, setmarkerId] = useState(false);
    const [title, setTitle] = useState("Create Marker");

    useEffect(() => {
        getAllMarkerTypes();
    }, []);
    ;
    const fieldsReset = () => {
        formRef.resetFields();
    };
    const showModal = (record) => {
        if (!record?.isActive) {
            AlertMessages.getInfoMessage('You Cannot edit an Inactive Marker Type');
        }
        setmarkerId(true);
        setSelectedRecord(record);
        setIsModalOpen(true);
        setOkText("Update");
        setTitle("Update Marker");
    };
    const showModals = () => {
        fieldsReset();
        setmarkerId(false);
        setSelectedRecord(null);
        setOkText("Create");
        setTitle("Create Marker");
        setIsModalOpen(true);
    }
    const onClose = () => {
        fieldsReset();
        setIsModalOpen(false);

    }

    const getAllMarkerTypes = () => {
        const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        service.getAllMarkerTypes(obj).then(res => {
            if (res.status) {
                setResData(res.data);
                // AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                setResData([]);
                // AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {
            console.log(err);
            // AlertMessages.getErrorMessage(err);
        })
    }
    const handleOk = () => {
        formRef.validateFields().then(values => {
            const markerTypeModel: MarkerTypeModel[] = [];
            const markersModel = new MarkerTypeModel(values.id, values.markerType, values.markerDesc);
            markerTypeModel.push(markersModel);
            const req = new MarkerTypeCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, markerTypeModel);
            service.createMarkerType(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    fieldsReset();
                    setIsModalOpen(false);
                    getAllMarkerTypes();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            }).catch(err => {
                console.log(err);
                fieldsReset();
            })
        }).catch((err) => {
            AlertMessages.getErrorMessage("Please fill all the required fileds before creation.")
        })

    };

    const deleteMarkerType = (recod) => {
        const obj = new MarkerTypeIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, recod);
        service.deleteMarkerType(obj).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllMarkerTypes();
            }
            else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {

            console.log(err.message)
        })
    }

    const markerColumns: ColumnsType<any> = [
        {
            title: 'Marker Type',
            dataIndex: 'markerType',
            align: 'center',
            key: 'markerType',
        },
        {
            title: 'Marker Description',
            dataIndex: 'markerDesc',
            align: 'center',
            key: 'markerDesc',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            key: 'action',
            render: (value, recod) => {
                return <>
                    <EditOutlined style={{ color: "blue", fontSize: "20px" }} onClick={() => showModal(recod)} /><Divider type="vertical" />
                    <DeleteOutlined style={{ color: "red", fontSize: "20px" }} onClick={() => deleteMarkerType(recod.id)} /><Divider type="vertical" />
                    <Popconfirm
                        onConfirm={
                            e => {
                                const req = new MarkerTypeIdRequest('', '', '', 5, recod.id);
                                service.deActivateMarkerType(req).then(res => {
                                    AlertMessages.getSuccessMessage(res.internalMessage);

                                    getAllMarkerTypes();
                                }).catch(err => {
                                    console.log(err);
                                })
                            }}
                        title={recod.isActive ? "Are you sure to Deactivate Marker ?" : "Are you sure to Activate Marker ?"}>
                        <Switch size='default' defaultChecked
                            className={recod.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            checked={recod.isActive} />
                    </Popconfirm>


                </>
            }
        }
    ]
    return <>
        <Card title='Markers' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
            <Modal cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }} title={title} style={{ textAlign: "center" }} open={isModalOpen} okText={oktext} onCancel={onClose} onOk={handleOk} cancelText="Close"><Divider type="horizontal"></Divider>
                <MarkersForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} markerId={markerId} />
            </Modal>
            <Table dataSource={resData} columns={markerColumns} size="small" bordered scroll={{ x: 'max-content' }} style={{ maxWidth: '100%' }}></Table>
        </Card>

    </>

}

export default MarkerTypeGrid;