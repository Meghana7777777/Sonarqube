import Icon, { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table } from "antd"
import { useEffect, useState } from "react"
import { useAppSelector } from "packages/ui/src/common";
import {ShiftService } from "@xpparel/shared-services";
import { CommonRequestAttrs, ComponentModel, CutTableCreateRequest, CutTableIdRequest, CutTableModel, MarkerCreateRequest, MarkerTypeCreateRequest, MarkerTypeIdRequest, MarkerTypeModel,ProductTypeCompModel, ProductTypeIdRequest, ProductTypeModel, ProductTypeRequest, ReasonCreateRequest, ReasonIdRequest, ReasonModel, ShiftCreateRequest } from "@xpparel/shared-models";
import { AlertMessages } from "packages/ui/src/components/common";
import { ColumnsType } from "antd/lib/table";
import ShiftForm from "./shift.form";

export const CreateShift = () => {
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [selectedRecord, setSelectedRecord] = useState<any>();
    const service = new ShiftService();
    const [resData, setResData] = useState([]);
    const [shiftId, setShiftId] = useState(false);
    const [title, setTitle] = useState("Create Shift");
    useEffect(() => {
        getAllShifts();
    }, []);
    ;
    const fieldsReset = () => {
        formRef.resetFields();
    };
    const showModal = (record) => {
        setShiftId(true);
        setSelectedRecord(record);
        setIsModalOpen(true);
        setOkText("Update");
        setTitle("Update Shift");
    };
    const showModals = () => {
        fieldsReset();
        setIsModalOpen(true);
    }
    const onClose = () => {
        fieldsReset();
        setIsModalOpen(false);

    }

    const getAllShifts = () => {
        const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        service.getAllShifts(obj).then(res => {
            if (res.status) {
                console.log(res, '---------------');
                setResData(res.data);
                // AlertMessages.getSuccessMessage(res.internalMessage);

            } else {
                // AlertMessages.getErrorMessage(res.internalMessage)
            }
            
        }).catch(err => {
            console.log(err.message)
        })
    }
    const handleOk = () => {
        formRef.validateFields().then(values => {
            const req = new ShiftCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,values.id,values.shift,values.startAt,values.endAt);
            service.createShift(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    console.log(res, '////');
                    fieldsReset();
                    setIsModalOpen(false);
                    getAllShifts();
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

    const deleteShift = (recod) => {
        const obj = new ShiftCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, recod.id,recod.shift,recod.startAt,recod.endAt);
        service.deleteShift(obj).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllShifts();
                console.log(res, '---------------');

            }
            else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {

            console.log(err.message)
        })
    }

    const shiftColumns: ColumnsType<any> = [
        {
            title: 'Shift',
            dataIndex: 'shift',
            align: 'center',
            key: 'shift',
        },
        {
            title: 'Start At',
            dataIndex: 'startAt',
            align: 'center',
            key: 'startAt',
        },
        {
            title: 'End At',
            dataIndex: 'endAt',
            align: 'center',
            key: 'endAt',
        },

        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            key: 'action',
            render: (value, recod) => {
                return <>
                    <EditOutlined style={{ color: "blue", fontSize: "20px" }} onClick={() => showModal(recod)} /><Divider type="vertical" />
                    <DeleteOutlined style={{ color: "red", fontSize: "20px" }} onClick={() => deleteShift(recod)} /><Divider type="vertical" />



                </>
            }
        }
    ]
    return <>
        <Card title='Shifts' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
            <Modal cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }} title={title} style={{ textAlign: "center" }} open={isModalOpen} okText={oktext} onCancel={onClose} onOk={handleOk} cancelText="Close">
                <ShiftForm formRef={formRef} initialvalues={selectedRecord} shiftId={shiftId} />
            </Modal>
            <Table dataSource={resData} columns={shiftColumns} size="small" bordered scroll={{x: 'max-content'}} style={{maxWidth: '100%'}}></Table>
        </Card>

    </>

}

export default CreateShift;