import React, { useEffect, useState } from "react";
import Icon, { EditOutlined, PrinterTwoTone } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, Modal, Popconfirm, QRCode, Select, Space, Switch, Table, Tooltip, } from "antd";
import { ColumnsType } from "antd/es/table";
import { AlertMessages } from "../../../../common";
import form from "antd/es/form";
import { CommonRequestAttrs, WorkstationCreateRequest, WorkstationIdRequest, WorkstationModel } from "@xpparel/shared-models";
import { ModuleSharedService, WorkStationService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";

export interface ICreateWorkStationProps {
    updateDetails:(workdata:WorkstationModel)=>void;
    newWindow: boolean;
}


const { Option } = Select;
  const  WorkStation = (props: ICreateWorkStationProps) => {
  const user = useAppSelector((state) => state.user.user.user);
    const { newWindow } = props;
    const [formRef] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>();
    const [moduleData, setModuleData] = useState<any[]>([]);
    const [isTitle, setIsTitle] = useState("");
    const [okText, setOkText] = useState("");
    const [form] = Form.useForm()
    const service = new WorkStationService();
    const moduleService = new ModuleSharedService();
    const [disable,setDisable]=useState<boolean>(false)
    const [workstationId, setWorkstationId] = useState(false);
    const [data,setData]=useState<any>()
    let externalWindow: any;
    let containerEl: any;

    if (newWindow) {
        externalWindow = window.open("", "", "width=600,height=700,left=200,top=50");
        containerEl = externalWindow.document.createElement("div");
        externalWindow.document.body.appendChild(containerEl);
        // externalWindow.document.title = "Barcodes";
    }

   
    useEffect(()=> {
        getWorkStation();
        getModule();
    }, []);

    const getWorkStation = () =>{
      const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
      service.getWorkstation(obj).then((res)=>{
        if(res.status){
             setData(res.data);
        }else{
            AlertMessages.getErrorMessage(res.internalMessage)
        }
    }).catch((err)=>{
        AlertMessages.getErrorMessage(err.message)
    })
    }

    const getModule = () => {
      moduleService.getModule().then((res) => {
        if (res.status) {
  
          setModuleData(res.data);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage)
        }
      }).catch((err) => {
        AlertMessages.getErrorMessage(err.message)
      })
    }
  
 
   
    
    const createShowModal = () => {
        setWorkstationId(false)
        onReset()
        setIsModalOpen(true);
        setIsTitle("Create WorkStation");
        setOkText("Create");
        setSelectedRecord(undefined);
        formRef.resetFields();
    };

    const editShowModal = (record) => {
        setWorkstationId(true)
        setSelectedRecord(record);
        setIsModalOpen(true);
        setIsTitle("Update WorkStation");
        setOkText("Update");
        formRef.setFieldsValue(record);

    };

    const handleCancel = () => {
        setSelectedRecord(undefined);
        setIsModalOpen(false);
        formRef.resetFields();
    };

   


    const deactivateWorkStation = (id: number) => {
        const req = new WorkstationIdRequest("", "", "",5, id);
        service.activateDeactivateWorkStation(req)
          .then((res) => {
            if (res.status) {
              AlertMessages.getSuccessMessage(res.internalMessage);
              getWorkStation();
            } else {
              AlertMessages.getErrorMessage(res.internalMessage);
            }
          })
          .catch((err) => {
            AlertMessages.getErrorMessage(err.message);
          });
      };


    const workStationColumns: ColumnsType<any> = [
        { title: "WorkStation Code",
             dataIndex: "wsCode", 
             align: "center",
              key: "wsCode"
             },
        { title: "WorkStation Name",
            dataIndex: "wsName",
             align: "center", 
             key: "wsName" 
            },
        { title: "WorkStation Description", 
            dataIndex: "wsDesc",
             align: "center", 
             key: "wsDesc"
             },
  
        { title: "Module",
             dataIndex: "moduleCode", 
             align: "center", 
             key: "section"
             },  
        {
          title: "Action",
          dataIndex: "action",
          align: "center",
          key: "action",
          render: (_, record) => (
            <Space>
              <EditOutlined onClick={() => editShowModal(record)} />
              <Divider type="vertical" />
              <Popconfirm
                onConfirm={(e) => {
                  deactivateWorkStation(record.id);
                }}
                title={
                  record.isActive
                    ? "Are you sure to Deactivate WorkStation?"
                    : "Are you sure to Activate WorkStation?"
                }
              >
                <Switch
                  size="default"
                  checked={record.isActive}
                  defaultChecked    
                  className={record.isActive ? "toggle-activated" : "toggle-deactivated"}
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="close" />}
                />
              </Popconfirm>
            </Space>
          ),
        },
      ];
      const onReset = () => {
        formRef.resetFields();

    };
      const saveWorkStation= (val:any) => {
        setDisable(true)
        const workstationModel = new WorkstationModel(val.id,val.wsCode,val.wsName,val.wsDesc,val.moduleCode,val.isActive)
        const req = new WorkstationCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[workstationModel]);

              service.createWorkstation(req).then((res) => {
            if (res.status) {
              AlertMessages.getSuccessMessage('WorkStation Created Successfully');
              onReset();
              getWorkStation()
              setIsModalOpen(false);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
          })
          .catch((err) => {
            setDisable(false)
            AlertMessages.getErrorMessage(err.message);
          });
    };

      
    const save = async () => {
      try {
        const formData = await formRef.validateFields();
        if (selectedRecord) {
          updateWorkStation(formData);
        } else {
          saveWorkStation(formData);
        }
      } catch (err) {
        console.error("Validation Failed:", err);
      }
    }
  
      
 const updateWorkStation = (val: any)=>{
    
    const workstationModel= new WorkstationModel(val.id,val.wsCode,val.wsName,val.wsDesc,val.moduleCode,val.isActive)
    const req = new WorkstationCreateRequest( user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode,user?.userId,[workstationModel]);
    service.createWorkstation(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('WorkStation Updated Successfully');
         getWorkStation()
         formRef.resetFields()
         setIsModalOpen(false);
        } else {
      AlertMessages.getErrorMessage(res.internalMessage);
       }
      }).catch((err) => {
       setDisable(false)
       AlertMessages.getErrorMessage(err.message);
      });
  }
    
    return (
        <div>
            <Card
                title="WorkStations"
                extra={
                    <Space>
                        <Button type="primary" onClick={createShowModal}>
                            Create
                        </Button>
                    </Space>
                }
            >
                <Table dataSource={data} size="small" columns={workStationColumns} bordered />
            </Card>
            <Modal
                title={isTitle}
                width={800}
                open={isModalOpen}
                onOk={save}
                okText={okText}
                cancelText="Close"
                onCancel={handleCancel}
                cancelButtonProps={{ style: { backgroundColor: "red", color: "white" } }}
            >
                <Form form={formRef} layout="vertical" >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Form.Item
                            label="id"
                            name="id"
                            hidden
                            >
                            <Input  />
                        </Form.Item>
                        <Form.Item
                            label="WorkStation Code"
                            name="wsCode"
                            rules={[{ required: true, message: "WorkStation Code is required" }]}
                        >
                            <Input placeholder="Please Enter WorkStation Code" allowClear />
                        </Form.Item>

                        <Form.Item
                            label="WorkStation Name"
                            name="wsName"
                            rules={[{ required: true, message: "WorkStation Name is required" }]}
                        >
                            <Input placeholder="Please Enter WorkStation Name" />
                        </Form.Item>

                        <Form.Item
                            label="WorkStation Description"
                            name="wsDesc"
                            rules={[{ required: true, message: "WorkStation Description is required" }]}
                        >
                            <Input placeholder="Please Enter WorkStation Description" />
                        </Form.Item>


                        <Form.Item
                            label="Module"
                            name="moduleCode"
                            rules={[{ required: true, message: "Module  is required" }]}
                        >
                            <Select placeholder="Select a Module">
                                {moduleData.map((module) => (
                                    <Select.Option key={module.moduleCode} value={module.moduleCode} allowCancel={true}>
                                        {module.moduleCode}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default WorkStation;
