import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Form, Modal, Table } from "antd"
import { useEffect, useState } from "react"
import { useAppSelector } from "packages/ui/src/common";
import { CutTableService } from "@xpparel/shared-services";
import { CommonRequestAttrs, CutTableCreateRequest, CutTableIdRequest, CutTableModel } from "@xpparel/shared-models";
import { AlertMessages } from "packages/ui/src/components/common";
import CutTablesForm from "./cut-tables.form";
import { ColumnsType } from "antd/lib/table";

export const CreateCutTables = () => {
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [istitle, setIsTitle] = useState("Create Cut Tables");
    const [selectedRecord, setSelectedRecord] = useState<CutTableModel>();
    const service = new CutTableService();
    const [resData, setResData] = useState<CutTableModel[]>([]);
    const [cuttableId, setcuttableId] = useState(false);

    useEffect(() => {
        getAllCutTables();
    }, []);
    ;
    const fieldsReset = () => {
        formRef.resetFields();
    };
    const showModal = (record) => {
        setcuttableId(true);
        setSelectedRecord(record);
        setIsModalOpen(true);
        setOkText("Update");
        setIsTitle("Update Cut Tables");
    };
    const showModals = () => {
        fieldsReset();
        setcuttableId(false);
        setOkText("Create");
        setIsTitle("Create Cut Tables");
        setSelectedRecord(null);
        setIsModalOpen(true);
    }
    const onClose = () => {
        fieldsReset();
        setIsModalOpen(false);

    }

    const getAllCutTables = () => {
        const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        service.getAllCutTables(obj).then(res => {
            if (res.status) {
                setResData(res.data);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })
    }
    const handleOk = () => {
        formRef.validateFields().then(values => {
            const cutTableModel: CutTableModel[] = [];
            const cutblsModel = new CutTableModel(values.id, values.capacity, values.tableName, values.tableDesc, values.extRefCode);
            cutTableModel.push(cutblsModel);
            const req = new CutTableCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, cutTableModel);
            service.createCutTable(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    console.log(res, '////');
                    fieldsReset();
                    setIsModalOpen(false);
                    getAllCutTables();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            }).catch(err => {                
                // fieldsReset();
                AlertMessages.getErrorMessage(err.message);
            })
        }).catch((err) => {
            AlertMessages.getErrorMessage("Please fill all the required fileds before creation.")
        })

    };

    const deleteCutTable = (recod) => {
        const obj = new CutTableIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,recod);
        service.deleteCutTable(obj).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllCutTables();
            }
            else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);            
        })
    }

    const operationColumns: ColumnsType<any> = [
        {
            title: 'Cut Table Name',
            dataIndex: 'tableName',
            align: 'center',
            key: 'tableName',
        },
        {
            title: 'Cut Table Desc',
            dataIndex: 'tableDesc',
            align: 'center',
            key: 'tableDesc',
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            align: 'center',
            key: 'capacity',
        },
        {
            title: 'External Ref Code',
            dataIndex: 'extRefCode',
            align: 'center',
            key: 'extRefCode',
        },

        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            key: 'action',
            render: (value, recod) => {
                return <>
                    <EditOutlined style={{ color: "blue", fontSize: "20px" }} onClick={() => showModal(recod)} /><Divider type="vertical" />
                    <DeleteOutlined style={{ color: "red", fontSize: "20px" }} onClick={() => deleteCutTable(recod.id)} /><Divider type="vertical" />



                </>
            }
        }
    ]

    return <>
        <Card title='Cut Tables' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
            <Modal cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }} title={istitle} style={{ textAlign: "center"}} open={isModalOpen} okText={oktext} onCancel={onClose} onOk={handleOk} cancelText="Close">
                <Divider type="horizontal"></Divider>
                <CutTablesForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} cuttableId={cuttableId} />

            </Modal>
            <Table dataSource={resData} columns={operationColumns} size="small" bordered scroll={{x: 'max-content'}}></Table>
        </Card>

    </>

}

export default CreateCutTables;