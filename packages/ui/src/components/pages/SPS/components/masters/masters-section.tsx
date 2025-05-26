import React, { useEffect, useState } from "react";
import Icon, { EditOutlined, PrinterTwoTone } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, Modal, Popconfirm, QRCode, Select, Space, Switch, Table, Tooltip, } from "antd";
import { SketchPicker } from "react-color";
import { ColumnsType } from "antd/es/table";

import { AlertMessages } from "../../../../common";
import { CommonRequestAttrs,  DepartmentTypeEnumForMasters, ProcessTypeEnum,processTypeEnumDisplayValues, SectionCreateRequest, SectionIdRequest, SectionModel } from "@xpparel/shared-models";
import { SectionSharedService } from "@xpparel/shared-services";
import { useAppSelector } from './../../../../../common';

export interface ICreateSectionProps {
  updateDetails: (sectiondata: SectionModel) => void;
  newWindow: boolean;
}


const { Option } = Select;
const Section = (props: ICreateSectionProps) => {
   const user = useAppSelector((state) => state.user.user.user);
  const { newWindow } = props;
  const [sectionData, setSectionData] = useState<any[]>([]);
  const [formRef] = Form.useForm();
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const [color, setColor] = useState("#ffffff");
  const service = new SectionSharedService()
  const [disable, setDisable] = useState<boolean>(false)
  const [sectionId, setSectionId] = useState(false);
  let externalWindow: any;
  let containerEl: any;

  if (newWindow) {
    externalWindow = window.open("", "", "width=600,height=700,left=200,top=50");
    containerEl = externalWindow.document.createElement("div");
    externalWindow.document.body.appendChild(containerEl);
    // externalWindow.document.title = "Barcodes";
  }

  useEffect(() => {
    getSection();

  }, []);

  // 
  const getSection = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getSection(obj).then(res => {
        if (res.status) {
            setSectionData(res.data);
        } else {
            AlertMessages.getErrorMessage(res.internalMessage);
        }
    }).catch(err => {
        AlertMessages.getErrorMessage(err.message);
    });
}



  const createShowModal = () => {
    setSectionId(false)
    onReset()
    setIsModalOpen(true);
    setIsTitle("Create Section");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
    setColor("#ffffff");
  };

  const editShowModal = (record) => {
    setSectionId(true)
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update Section");
    setOkText("Update");
    formRef.setFieldsValue({ ...record, secColor: record.secColor || "#ffffff" });
    setColor(record.sectionColour || "#ffffff");
  };

  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();
  };




  const deactivateSection = (id: number) => {
    const req = new SectionIdRequest("", "", "", 5, id);
    service.activeDeactiveSection(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getSection();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };
  const sectionColumns: ColumnsType<any> = [
    {
      title: "Section Code",
      dataIndex: "secCode",
      align: "center",
      key: "sectionCode"
    },
    {
      title: "Section Name",
      dataIndex: "secName",
      align: "center",
      key: "sectionName"
    },
    {
      title: "Section Description",
      dataIndex: "secDesc",
      align: "center",
      key: "sectionDescription"
    },
    {
      title: "Department Type",
      dataIndex: "depType",
      align: "center",
      key: "depType"
    },
    {
      title: "Section Colour",
      dataIndex: "secColor",
      align: "center",
      key: "sectionColour",
      render: (color) => (
        <div style={{ width: "20px", height: "20px", backgroundColor: color, borderRadius: "50%" }} />
      ),
    },
    {
      title: "Head Name",
      dataIndex: "secHeadName",
      align: "center",
      key: "headName"
    },
    {
      title: "Section Order",
      dataIndex: "secOrder",
      align: "center",
      key: "sectionOrder"
    },
    {
      title: "Section Type",
      dataIndex: "secType",
      align: "center",
      key: "sectionType"
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
            onConfirm={(e) => deactivateSection(record.id)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Section?"
                : "Are you sure to Activate Section?"
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
    form.resetFields();
  };

  const saveSection = (val: any) => {
    setDisable(true);
    const sectionModel = new SectionModel(val.id,val.secCode,val.secName,val.secDesc,val.depType, val.secColor,val.secHeadName,val.secOrder,val.isActive,val.secType);
    const req = new SectionCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[sectionModel]);
    service.createSection(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Section Created Successfully');
        setIsModalOpen(false);
        getSection();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      setDisable(false);
      AlertMessages.getErrorMessage(err.message);
    });
  };


  const save = async () => {
    try {
      const formData = await formRef.validateFields();
      if (selectedRecord) {
        updateSection(formData);
      } else {
        saveSection(formData);
      }
    } catch (err) {
      console.error("Validation Failed:", err);
    }
  }



  const updateSection = (val: any) => {
    const sectionModel = new SectionModel(val.id,val.secCode,val.secName,val.secDesc,val.depType, val.secColor,val.secHeadName,val.secOrder,val.isActive,val.secType);
    const req = new SectionCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[sectionModel] );
    service.createSection(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Section Updated Successfully');
        setIsModalOpen(false);
        getSection();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      setDisable(false);
      AlertMessages.getErrorMessage(err.message);
    });
  }


  return (
    <div>
      <Card
        title="Sections"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={sectionData.map((item) => ({ ...item, key: item.id }))}
          size="small"
          columns={sectionColumns} bordered />
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
        <Form form={formRef} layout="vertical">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              label="id"
              name="id"
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Section Code"
              name="secCode"
              rules={[{ required: true, message: "Section Code is required" }]}
            >
              <Input placeholder="Please Enter Section Code"  disabled={!!selectedRecord}/>
            </Form.Item>

            <Form.Item
              label="Section Name"
              name="secName"
              rules={[{ required: true, message: "Section Name is required" }]}
            >
              <Input placeholder="Please Enter Section Name" />
            </Form.Item>

            <Form.Item
              label="Section Description"
              name="secDesc"
              rules={[{ required: true, message: "Section Description is required" }]}
            >
              <Input placeholder="Please Enter Section Description" />
            </Form.Item>

           
              <Form.Item
              label="Department Type"
              name="depType"
              rules={[{ required: true, message: "Department Type is required" }]}
            >
              <Select placeholder="Select a department">
                {Object.values(DepartmentTypeEnumForMasters).map((dept) => (
                  <Select.Option key={dept} value={dept}>
                    {dept}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>  

            <Form.Item
              label="Section Head Name"
              name="secHeadName"
              rules={[{ required: true, message: "Section Head Name is required" }]}
            >
              <Input placeholder="Please Enter Head Name" />
            </Form.Item>

            <Form.Item
              label="Section Order"
              name="secOrder"
              rules={[{ required: true, message: "Section Order is required" }]}
            >
              <Input type="number" placeholder="Please Enter Section Order" />
            </Form.Item>

            <Form.Item label="Section Color" name="secColor"
            rules={[{ required: true, message: "Section Color is required" }]}
            >
             <SketchPicker placeholder="Please Select Section Color"
                color={color}
                onChangeComplete={(updatedColor) =>  formRef.setFieldsValue({ secColor: updatedColor.hex })}
              />
            </Form.Item>

            <Form.Item
              label="Section Type"
              name="secType"
              rules={[{ required: true, message: "Section Type is required" }]}
            >
              <Select placeholder="Select a section type">
                {Object.values(ProcessTypeEnum).map((type) => (
                  <Select.Option key={type} value={type}>
                    {processTypeEnumDisplayValues[type]}
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

export default Section;


