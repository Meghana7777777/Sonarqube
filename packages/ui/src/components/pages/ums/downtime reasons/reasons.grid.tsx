import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Form, Modal, Table } from "antd"
import { useEffect, useState } from "react"
import { useAppSelector } from "packages/ui/src/common";
import { ReasonsService } from "@xpparel/shared-services";
import { CommonRequestAttrs, ReasonCreateRequest, ReasonIdRequest, ReasonModel } from "@xpparel/shared-models";
import { AlertMessages } from "packages/ui/src/components/common";
import ReasonsForm from "./reasons.form";
import { ColumnsType } from "antd/lib/table";

export const CreateDownTimeReasons = () => {
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [selectedRecord, setSelectedRecord] = useState<ReasonModel>();
    const service = new ReasonsService();
    const [resData, setResData] = useState<ReasonModel[]>([]);
    const [reasons, setReasons] = useState(false);
    const [title, setTitle] = useState("Create Reason");
    useEffect(() => {
        getAllReasons();
    }, []);
    ;
    const fieldsReset = () => {
        formRef.resetFields();
    };
    const showModal = (record) => {
        setReasons(true);
        setSelectedRecord(record);
        setIsModalOpen(true);
        setOkText("Update");
        setTitle("Update Reason");
    };
    const showModals = () => {
        fieldsReset();
        setSelectedRecord(null);
        setReasons(false);
        setOkText("Create");
        setTitle("Create Reason");
        setIsModalOpen(true);
    }
    const onClose = () => {
        fieldsReset();
        setIsModalOpen(false);

    }

    const getAllReasons = () => {
        const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        service.getAllReasons(obj).then(res => {
            if (res.status) {
                setResData(res.data);
                // AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
                // AlertMessages.getErrorMessage(res.internalMessage)
        }
        }).catch(err => {
                // AlertMessages.getErrorMessage(err.message)
        })
    }
    const handleOk = () => {
        formRef.validateFields().then(values => {
            const reasonsModel: ReasonModel[] = [];
            const reasonsDataModel = new ReasonModel(values.id, values.reasonCode, values.reasonName, values.reasonDesc, values.reasonCategory);
            reasonsModel.push(reasonsDataModel);
            const req = new ReasonCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, reasonsModel);
            service.createReason(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    fieldsReset();
                    setIsModalOpen(false);
                    getAllReasons();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            }).catch(err => {
                console.log(err);
                fieldsReset();
            })
        }).catch((err) => {
            AlertMessages.getErrorMessage("Please fill all the required fileds before creation.");
        })

    };  

    const deleteReason = (recod) => {
        const obj = new ReasonIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, recod);
        service.deleteReason(obj).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllReasons();

            }
            else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {

            console.log(err.message)
        })
    }

    const reasonsColumns: ColumnsType<any> = [
        {
            title: 'Reason Code',
            dataIndex: 'reasonCode',
            align: 'center',
            key: 'reasonCode',
        },
        {
            title: 'Reason Name',
            dataIndex: 'reasonName',
            align: 'center',
            key: 'reasonName',
        },
        {
            title: 'Reason Description',
            dataIndex: 'reasonDesc',
            align: 'center',
            key: 'reasonDesc',
        },
        {
            title: 'Reason Category',
            dataIndex: 'reasonCategory',
            align: 'center',
            key: 'reasonCategory',
        },

        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            key: 'action',
            render: (value, recod) => {
                return <>
                    <EditOutlined style={{ color: "blue", fontSize: "20px" }} onClick={() => showModal(recod)} /><Divider type="vertical" />
                    <DeleteOutlined style={{ color: "red", fontSize: "20px" }} onClick={() => deleteReason(recod.id)} /><Divider type="vertical" />



                </>
            }
        }
    ]
    return <>
        <Card title='DownTime Reasons' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
            <Modal cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }} title={title} style={{ textAlign: "center" }} open={isModalOpen} okText={oktext} onCancel={onClose} onOk={handleOk} cancelText="Close">
                <ReasonsForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} reasonId={reasons} />
            </Modal>
            <Table dataSource={resData} columns={reasonsColumns} size="small" bordered scroll={{x: 'max-content'}} style={{maxWidth: '100%'}}></Table>
        </Card>

    </>

}

export default CreateDownTimeReasons;