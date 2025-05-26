import React, { useEffect, useState } from "react";
import Icon, { EditOutlined, PrinterTwoTone } from "@ant-design/icons";
import { Button, Card, ColorPicker, Divider, Form, Input, Modal, Popconfirm, QRCode, Select, Space, Switch, Table, Tooltip, } from "antd";
import { SketchPicker } from "react-color";

import { ColumnsType } from "antd/es/table";
import { AlertMessages } from "../../../../common";
import { CommonRequestAttrs, ModuleCreateRequest, ModuleIdRequest, ModuleModel } from "@xpparel/shared-models";
import form from "antd/es/form";
import { ModuleSharedService, SectionSharedService } from "@xpparel/shared-services";
import { useAppSelector } from './../../../../../common';

export interface ICreateModuleProps {
  updateDetails: (moduledata: ModuleModel) => void;
  newWindow: boolean;
}


const CreateModule = (props: ICreateModuleProps) => {
  const user = useAppSelector((state) => state.user.user.user);
  const { newWindow } = props;
  const { Option } = Select;
  const [moduleData, setModuleData] = useState<any[]>([]);
  const [formRef] = Form.useForm();
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const service = new ModuleSharedService
  const SectionService = new SectionSharedService
  const [disable, setDisable] = useState<boolean>(false)
  const [color, setColor] = useState("#ffffff");
  const [sections, setSections] = useState<any[]>([])
  // const [hexColor, setHexColor] = useState("#ffffff");
  const [moduleId, setModuleId] = useState(false);
  let externalWindow: any;
  let containerEl: any;


  if (newWindow) {
    externalWindow = window.open("", "", "width=600,height=700,left=200,top=50");
    containerEl = externalWindow.document.createElement("div");
    externalWindow.document.body.appendChild(containerEl);
    // externalWindow.document.title = "Barcodes";
  }


  useEffect(() => {
    getModule();

  }, []);

  const getModule = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getModule(obj).then((res) => {
      if (res.status) {

        setModuleData(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch((err) => {
      AlertMessages.getErrorMessage(err.message)
    })
  }




  useEffect(() => {
    SectionService.getSection().then((res) => {
      if (res.status) {

        setSections(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch((err) => {
      AlertMessages.getErrorMessage(err.message)
    })
    
  }, [])

  const createShowModal = () => {
    setModuleId(false)
    onReset()
    setIsModalOpen(true);
    setIsTitle("Create Module");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
    setColor("#ffffff");
  };

  const editShowModal = (record) => {
    setModuleId(true)
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update Module");
    setOkText("Update");
    formRef.setFieldsValue({ ...record, moduleColor:record.moduleColor || "#ffffff",});
    setColor(record.moduleColour || "#ffffff");
  };

  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();
  };


  const deactivateModule = (id: number) => {
    const req = new ModuleIdRequest("", "", "", 5, id);
    service.activateDeactivateModule(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getModule();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };



  const moduleColumns: ColumnsType<any> = [
    {
      title: "Module Code",
      dataIndex: "moduleCode",
      align: "center",
      key: "moduleCode"
    },

    {
      title: "Module Name",
      dataIndex: "moduleName",
      align: "center",
      key: "moduleName"
    },

    {
      title: "Module Description",
      dataIndex: "moduleDesc",
      align: "center",
      key: "moduleDescription"
    },

    {
      title: "External Ref",
      dataIndex: "moduleExtRef",
      align: "center",
      key: "moduleExtRef"
    },

    {
      title: "Module Capacity (No of Jobs)",
      dataIndex: "moduleCapacity",
      align: "center",
      key: "moduleCapacity"
    },

    {
      title: "Max Inputs Jobs",
      dataIndex: "maxInputJobs",
      align: "center",
      key: "maxInputsJobs"
    },

    { title: "Maximum Display Jobs",
       dataIndex: "maxDisplayJobs", 
       align: "center",
        key: "maximumDisplayJobs"
       },

    { title: "Head Name",
       dataIndex: "moduleHeadName",
        align: "center",
         key: "moduleHeader" 
    },

    { title: "Head Count",
       dataIndex: "moduleHeadCount",
        align: "center",
         key: "headCount" 
        
    },

    { title: "Module Order", 
      dataIndex: "moduleOrder",
       align: "center",
        key: "moduleOrder" 
    },

    {
      title: "Module Colour",
      dataIndex: "moduleColor",
      align: "center",
      key: "moduleColour",
      render: (color) => (
        <div style={{ width: "20px", height: "20px", backgroundColor: color, borderRadius: "50%" }} />
      ),
    },
    { title: "Section",
       dataIndex: "secCode", 
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
            onConfirm={() => deactivateModule(record.key)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Module?"
                : "Are you sure to Activate Module?"
            }
          >
            <Switch
              size="default"
              checked={record.isActive}
              className={record.isActive ? "toggle-activated" : "toggle-deactivated"}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onReset = () => {
    form.resetFields();
  };


  const saveModule = (val: any) => {
    setDisable(true);
    const moduleModel = new ModuleModel( val.id, val.moduleCode, val.moduleName, val.moduleDesc, val.moduleType, val.moduleExtRef, val.moduleCapacity, val.maxInputJobs, val.maxDisplayJobs, val.moduleHeadName, val.moduleHeadCount, val.moduleOrder, val.moduleColor, val.secCode, val.isActive);
    const req = new ModuleCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[moduleModel]);
    service.createModule(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Module Created Successfully');
        setIsModalOpen(false);
        getModule()
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
        updateModule(formData);
      } else {
        saveModule(formData);
      }
    } catch (err) {
      console.error("Validation Failed:", err);
    }
  }


  const updateModule = (val: any) => {
    const moduleModel = new ModuleModel( val.id, val.moduleCode, val.moduleName, val.moduleDesc, val.moduleType, val.moduleExtRef, val.moduleCapacity, val.maxInputJobs, val.maxDisplayJobs, val.moduleHeadName, val.moduleHeadCount, val.moduleOrder,val.moduleColor, val.secCode, val.isActive)
    const req = new ModuleCreateRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      [moduleModel]
    );
    service.createModule(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Module Updated Successfully');
        onReset();
        setIsModalOpen(false);
        getModule()
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })
      .catch((err) => {
        setDisable(false)
        AlertMessages.getErrorMessage(err.message);
      });
  }


  // const handleColorChange = (color) => {
  //   const hex = color.toHexString();
  //   setHexColor(hex);
  // };


  return (
    <div>
      <Card
        title="Module"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={moduleData.map((item) => ({ ...item, key: item.id }))}
          size="small" columns={moduleColumns} bordered />
      </Card>
      <Modal
        title={isTitle}
        width={1000}
        open={isModalOpen}
        onOk={save}
        okText={okText}
        cancelText="Close"
        onCancel={handleCancel}
        cancelButtonProps={{ style: { backgroundColor: "red", color: "white" } }}
      >
        <Form form={formRef} layout="vertical">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <Form.Item
              label="id"
              name="id"
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Module Code"
              name="moduleCode"
              rules={[{ required: true, message: "Module Code is required" }]}
            >
              <Input placeholder="Please Enter Module Code"  disabled={!!selectedRecord} />
            </Form.Item>

            <Form.Item
              label="Module Name"
              name="moduleName"
              rules={[{ required: true, message: "Module Name is required" }]}
            >
              <Input placeholder="Please Enter Module Name" />
            </Form.Item>

            <Form.Item
              label="Module Description"
              name="moduleDesc"
              rules={[{ required: true, message: "Module Description is required" }]}
            >
              <Input placeholder="Please Enter Module Description" />
            </Form.Item>


            <Form.Item
              label="External Ref"
              name="moduleExtRef"
              rules={[{ required: true, message: "External Ref Code is required" }]}
            >
              <Input placeholder="Please Enter External Ref Code" />
            </Form.Item>

            <Form.Item
              label="Module Capacity (No of Jobs)"
              name="moduleCapacity"
              rules={[{ required: true, message: "Module Capacity is required" }]}
            >
              <Input placeholder="Please Enter Module Capacity" />
            </Form.Item>

            <Form.Item
              label="Max Inputs Jobs"
              name="maxInputJobs"
              rules={[{ required: true, message: "Max Inputs Jobs is required" }]}
            >
              <Input placeholder="Please Enter Max Inputs Jobs" />
            </Form.Item>



            <Form.Item
              label="Maximum Display Jobs"
              name="maxDisplayJobs"
              rules={[{ required: true, message: "Maximum Display Jobs is required" }]}
            >
              <Input placeholder="Please Enter Maximum Display Jobs" />
            </Form.Item>

            <Form.Item
              label="Module Head Name"
              name="moduleHeadName"
              rules={[{ required: true, message: "Module Header Name is required" }]}
            >
              <Input placeholder="Please Enter Module Header Name" />
            </Form.Item>

            <Form.Item
              label="Head Count"
              name="moduleHeadCount"
              rules={[{ required: true, message: "Head Count is required" }]}
            >
              <Input placeholder="Please Enter Head Count" />
            </Form.Item>

            <Form.Item
              label="Module Order"
              name="moduleOrder"
              rules={[{ required: true, message: "Module Order is required" }]}
            >
              <Input type="number" placeholder="Please Enter Module Order" />
            </Form.Item>

            <Form.Item
              label="Section"
              name="secCode"
              rules={[{ required: true, message: "Section  is required" }]}
            >
              <Select placeholder="Select a Section">
                {sections?.map((section) => (
                  <Select.Option key={section.id} value={section.secCode} allowCancel={true}>
                    {section.secCode}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
             label="Module Colour" name="moduleColor"
             rules={[{ required: true, message: "Module Colour  is required" }]}
             >
               <SketchPicker placeholder="Please Select Module Color"
                color={color}
                onChangeComplete={(updatedColor) =>  formRef.setFieldsValue({ moduleColor: updatedColor.hex })} />
            </Form.Item>

          </div>
        </Form>
      </Modal>

    </div>
  );
};

export default CreateModule;
