// import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

// import { Button, Card, Divider, Form, Modal, Table } from "antd";
// import { ColumnsType } from "antd/lib/table";
// import { useAppSelector } from "packages/ui/src/common";
// import { AlertMessages } from "packages/ui/src/components/common";
// import { useEffect, useState } from "react";
// import { InsTypesForm } from "./ins-type-form";
// import { InsTypeEnum, InsTypesModel, InsTypesRequest, InsTypesRequestById } from "packages/libs/shared-models/src/ins";

// export const CreateInsType = () => {
//     const [formRef] = Form.useForm();
//     const user = useAppSelector((state) => state.user.user.user);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [oktext, setOkText] = useState("Create");
//     const [istitle, setIsTitle] = useState("Create Cut Tables");
//     const [selectedRecord, setSelectedRecord] = useState<InsTypesModel>();
//     const service = new InsMasterService();
//     const [resData, setResData] = useState<InsTypesModel[]>([]);
//     const [insTypeId, setInsTypeId] = useState(false);

//     useEffect(() => {
//         getAllInsTypes();
//     }, []);
//     ;
//     const fieldsReset = () => {
//         formRef.resetFields();
//     };
//     const showModal = (record) => {
//         setInsTypeId(true);
//         setSelectedRecord(record);
//         setIsModalOpen(true);
//         setOkText("Update");
//         setIsTitle("Update Ins Types");
//     };
//     const showModals = () => {
//         fieldsReset();
//         setInsTypeId(false);
//         setOkText("Create");
//         setIsTitle("Create Ins Types");
//         setSelectedRecord(null);
//         setIsModalOpen(true);
//     }
//     const onClose = () => {
//         fieldsReset();
//         setIsModalOpen(false);

//     }
//     const dummydata: InsTypesModel[] = [
//         {

//             "id": 1,
//             "insActivityStatus": InsTypeEnum.CARTON,
//             "insTypeI1": "Type B",
//             "insTypeI2": "Type B",
//             "requiredForAlloc": false,
//             "requiredForDis": true,
//             "defaultPerc": 15.0

//         }
//     ]

//     const getAllInsTypes = () => {
//         // const req = new InsTypesRequestById(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, []);
//         // service.getInsType(req).then(res => {
//         //     if (res.status) {

//         //         setResData(res.data);
//         //     }
//         // }).catch(err => {
//         //     console.log(err.message)
//         // })
//         setResData(dummydata);

//     }
//     const handleOk = () => {
//         formRef.validateFields().then(values => {
//             const insTypesModel: InsTypesModel[] = [];
//             const cutblsModel = new InsTypesModel(values.id, values.insActivityStatus, values.insTypeI1, values.insTypeI2, values.requiredForAlloc, values.requiredForDis, values.defaultPerc);
//             console.log(values, 'values');
//             console.log(cutblsModel, 'cutblsModel');    
//             insTypesModel.push(cutblsModel);
//             const req = new InsTypesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, insTypesModel);
//             service.createInsType(req).then(res => {
//                 if (res.status) {
//                     AlertMessages.getSuccessMessage(res.internalMessage);
//                     console.log(res, '////');
//                     fieldsReset();
//                     setIsModalOpen(false);
//                     getAllInsTypes();
//                 } else {
//                     AlertMessages.getErrorMessage(res.internalMessage)
//                 }
//             }).catch(err => {
//                 console.log(err);
//                 fieldsReset();
//             })
//         }).catch((err) => {
//             AlertMessages.getErrorMessage("Please fill all the required fileds before creation.")
//         })

//     };

//     const deleteCutTable = (recod) => {
//         const obj = new InsTypesRequestById(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [recod]);
//         service.deleteInsType(obj).then(res => {
//             if (res.status) {
//                 AlertMessages.getSuccessMessage(res.internalMessage);
//                 getAllInsTypes();
//             }
//             else {
//                 AlertMessages.getErrorMessage(res.internalMessage)
//             }
//         }).catch(err => {

//             console.log(err.message)
//         })
//     }

//     const operationColumns: ColumnsType<any> = [
//         {
//             title: 'Inspection Activity Status',
//             dataIndex: 'insActivityStatus',
//             align: 'center',
//             key: 'insActivityStatus',
//         },
//         {
//             title: 'Inspection Type',
//             dataIndex: 'insTypeI1',
//             align: 'center',
//             key: 'insTypeI1',
//         },
//         {
//             title: 'Inspection Type',
//             dataIndex: 'insTypeI1',
//             align: 'center',
//             key: 'insTypeI1',
//         },
//         {
//             title: 'Required for Allocation',
//             dataIndex: 'requiredForAlloc',
//             align: 'center',
//             key: 'requiredForAlloc',
//             render: (value) => (value ? 'Yes' : 'No'),
//         },
//         {
//             title: 'Required for Dispatch',
//             dataIndex: 'requiredForDis',
//             align: 'center',
//             key: 'requiredForDis',
//             render: (value) => (value ? 'Yes' : 'No'),
//         },
//         {
//             title: 'Default Percentage',
//             dataIndex: 'defaultPerc',
//             align: 'center',
//             key: 'defaultPerc',
//         },
//         {
//             title: 'Action',
//             dataIndex: 'action',
//             align: 'center',
//             key: 'action',
//             render: (_, record) => (
//                 <>
//                     <EditOutlined style={{ color: "blue", fontSize: "20px" }} onClick={() => showModal(record)} />
//                     <Divider type="vertical" />
//                     <DeleteOutlined style={{ color: "red", fontSize: "20px" }} onClick={() => deleteCutTable(record.id)} />
//                 </>
//             ),
//         }
//     ];


//     return <>
//         <Card title='Ins Types' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
//             <Modal cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }} title={istitle} style={{ textAlign: "center" }} open={isModalOpen} okText={oktext} onCancel={onClose} onOk={handleOk} cancelText="Close">
//                 <Divider type="horizontal"></Divider>
//                 <InsTypesForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} cuttableId={insTypeId} />

//             </Modal>
//             <Table dataSource={resData} columns={operationColumns}></Table>
//         </Card>

//     </>

// }

// export default CreateInsType;