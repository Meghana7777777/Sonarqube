import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Form, Modal, Table } from "antd"
import { useEffect, useState } from "react"
import { useAppSelector } from "packages/ui/src/common";
import { OperationService } from "@xpparel/shared-services";
import { CommonRequestAttrs, OperationCategoryFormRequest, OperationCodeRequest, OperationCreateRequest, OperationModel, OpFormEnum, OpFormEnumDisplayValues } from "@xpparel/shared-models";
import { OperationsForm } from "./operations.form";
import { AlertMessages } from "packages/ui/src/components/common";
import { ColumnsType } from "antd/lib/table";

export const CreateOperations = () => {
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [selectedRecord, setSelectedRecord] = useState<OperationModel>();
    const service = new OperationService();
    const [resData, setResData] = useState<OperationModel[]>([]);
    const [opId, setopId] = useState(false);
    const [isTitle, setIsTitle] = useState("Create Operation");

    useEffect(() => {
        getAllOperations();
    }, []);
    ;
    const fieldsReset = () => {
        formRef.resetFields();
    };
    const showModal = (record) => {
        setopId(true);
        setSelectedRecord({
            ...record,
            machineName: record.machineName ? record.machineName.split(',').map(name => name.trim()) : [],
        });
        setIsModalOpen(true);
        setOkText("Update");
        setIsTitle("Update Operation");
        setTimeout(() => {
            formRef.setFieldsValue({
                ...record,
                machineName: record.machineName ? record.machineName.split(',').map(name => name.trim()) : [],
            });
        }, 0);
    };
    
    const showModals = () => {
        fieldsReset();
        setopId(false);
        setSelectedRecord(null);
        setOkText("Create");
        setIsTitle("Create Operation");
        setIsModalOpen(true);
    }
    const onClose = () => {
        fieldsReset();
        setIsModalOpen(false);

    }

    const getAllOperations = () => {
        const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        service.getAllOperations(obj).then(res => {
            if (res.status) {
                console.log(res, '---------------');
                setResData(res.data);
                // AlertMessages.getSuccessMessage(res.internalMessage);
            }
        }).catch(err => {
            console.log(err.message)
        })
    }

    const handleOk = () => {
        formRef.validateFields().then(values => {
            const req = new OperationCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.opCode, values.eOpCode, values.opCategory, values.opForm, values.opName,values.machineName);
            service.createOperation(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    console.log(res, '////');
                    fieldsReset();
                    setIsModalOpen(false);
                    getAllOperations();
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

    const deleteOperations = (opCode: string) => {
        const obj = new OperationCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, opCode);
        service.deleteOperation(obj).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllOperations();

            }
            else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {

            console.log(err.message)
        })
    }

    const operationColumns: ColumnsType<any> = [
        {
            title: 'Operation Id',
            dataIndex: 'opCode',
            align: 'center',
            key: 'opCode',
        },
        {
            title: 'External Operation Id',
            dataIndex: 'eOpCode',
            align: 'center',
            key: 'eOpCode',
        },
        {
            title: 'Operation Name',
            dataIndex: 'opName',
            align: 'center',
            key: 'opName',
        },
        {
            title: 'Operation Category',
            dataIndex: 'opCategory',
            align: 'center',
            key: 'opCategory',
        },
        {
            title: 'Operation Form',
            dataIndex: 'opForm',
            align: 'center',
            key: 'opForm',
            render(value: string) {
                const enumKey = Object.keys(OpFormEnum).find(
                    (key) => OpFormEnum[key as keyof typeof OpFormEnum] === value
                ) as keyof typeof OpFormEnum;

                return OpFormEnumDisplayValues[enumKey] || value;
            } 
        },
        // {
        //     title: 'Sequence',
        //     dataIndex: 'sequence',
        //     align: 'center',
        //     key: 'sequence',
        // },
        // {
        //     title: 'Machine Name',
        //     dataIndex: 'assets',
        //     align: 'center',
        //     key: 'assets',
        //     render: (assets, record) => (
        //       <>
        //         {assets?.map((asset, index) => (
        //           <span key={asset.itemId}>
        //             {asset.itemName}
        //             {index !== assets.length - 1 && ', '}
        //           </span>
        //         ))}
        //       </>
        //     ),
        //   },
          {
            title: 'Machine Name',
            dataIndex: 'machineName',
            align: 'center',
            key: 'machineName',
            render: (machineName) => (
              <>
                {machineName?.split(',').map((name, index) => (
                  <div key={index}>{name.trim()}</div>
                ))}
              </>
            ),
          },
          
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            key: 'action',
            render: (value, recod) => {
                return <>
                    <EditOutlined onClick={() => showModal(recod)} /><Divider type="vertical" />
                    <DeleteOutlined onClick={() => deleteOperations(recod.opCode)} />


                </>
            }
        }
    ]
    return <>
        <Card title='Operations' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
            <Modal title={isTitle} cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }} style={{ textAlign: "center" }} open={isModalOpen} okText={oktext} onCancel={onClose} onOk={handleOk} cancelText="Close" width={800}>
                <Divider type="horizontal"></Divider>
                <OperationsForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.opCode} opId={opId} />
            </Modal>
            <Table dataSource={resData} bordered columns={operationColumns} size="small" scroll={{x: 'max-content'}} style={{maxWidth: '100%'}} ></Table>
        </Card>

    </>

}

export default CreateOperations;