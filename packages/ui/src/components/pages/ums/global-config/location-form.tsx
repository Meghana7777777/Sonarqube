import React, { useEffect, useState } from "react";
import Icon, { EditOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, } from "antd";
import { SketchPicker } from "react-color";

import { ColumnsType } from "antd/es/table";
import { CommonRequestAttrs, LocationsIdRequest, LocationCreateRequest, LocationModel,  } from "@xpparel/shared-models";
import { GbConfigHelperService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "../../../common";

// export interface ICreateLocationProps {
//   updateDetails: (locationdata: LocationModel) => void;
//   newWindow: boolean;
// }


const CreateLocation = () => {
  const user = useAppSelector((state) => state.user.user.user);
  // const { newWindow } = props;
  const { Option } = Select;
  const [locationData, setLocationData] = useState<any[]>([]);
  const [formRef] = Form.useForm();
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const service = new GbConfigHelperService();
  const SectionService = new GbConfigHelperService();
  const [disable, setDisable] = useState<boolean>(false)
  const [color, setColor] = useState("#ffffff");
  const [sections, setSections] = useState<any[]>([])
  // const [hexColor, setHexColor] = useState("#ffffff");
  const [locationId, setLocationId] = useState(false);
  let externalWindow: any;
  let containerEl: any;


  // if (newWindow) {
  //   externalWindow = window.open("", "", "width=600,height=700,left=200,top=50");
  //   containerEl = externalWindow.document.createElement("div");
  //   externalWindow.document.body.appendChild(containerEl);
  //   // externalWindow.document.title = "Barcodes";
  // }


  useEffect(() => {
    getLocation();

  }, []);

  const getLocation = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getLocation(obj).then((res) => {
      if (res.status) {
        setLocationData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);

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
    setLocationId(false)
    onReset()
    setIsModalOpen(true);
    setIsTitle("Create Location");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
    setColor("#ffffff");
  };

  const editShowModal = (record) => {
    if (record.isActive) {
    setLocationId(true)
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update Location");
    setOkText("Update");
    formRef.setFieldsValue({ ...record, locationColor:record.locationColor || "#ffffff",});
  } else {
    AlertMessages.getErrorMessage("You Cannot Edit Deactivated Location");
  }
    setColor(record.locationColour || "#ffffff");
  };

  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();
  };


  const deactivateLocation = (id: number) => {
    const req = new LocationsIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, id);
    service.activateDeactivateLocation(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getLocation();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };



  const locationColumns: ColumnsType<any> = [
    {
      title: "Location Code",
      dataIndex: "locationCode",
      align: "center",
      key: "locationCode"
    },

    {
      title: "Location Name",
      dataIndex: "locationName",
      align: "center",
      key: "locationName"
    },

    {
      title: "Location Description",
      dataIndex: "locationDesc",
      align: "center",
      key: "locationDescription"
    },

    {
      title: "External Ref",
      dataIndex: "locationExtRef",
      align: "center",
      key: "locationExtRef"
    },

    {
      title: "Location Capacity (No of Jobs)",
      dataIndex: "locationCapacity",
      align: "center",
      key: "locationCapacity"
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
       dataIndex: "locationHeadName",
        align: "center",
         key: "locationHeader" 
    },

    { title: "Head Count",
       dataIndex: "locationHeadCount",
        align: "center",
         key: "headCount" 
        
    },

    { title: "Location Order", 
      dataIndex: "locationOrder",
       align: "center",
        key: "locationOrder" 
    },

    {
      title: "Location Colour",
      dataIndex: "locationColor",
      align: "center",
      key: "locationColour",
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
            onConfirm={() => deactivateLocation(record.key)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Location?"
                : "Are you sure to Activate Location?"
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


  const saveLocation = (val: any) => {
    setDisable(true);
    const locationModel = new LocationModel( val.id, val.locationCode, val.locationName, val.locationDesc, val.locationType, val.locationExtRef, val.locationCapacity, val.maxInputJobs, val.maxDisplayJobs, val.locationHeadName, val.locationHeadCount, val.locationOrder, val.locationColor, val.secCode, val.isActive);
    const req = new LocationCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[locationModel]);
    service.createLocation(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Location Created Successfully');
        setIsModalOpen(false);
        getLocation()
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
        updateLocation(formData);
      } else {
        saveLocation(formData);
      }
    } catch (err) {
      console.error("Validation Failed:", err);
    }
  }


  const updateLocation = (val: any) => {
    const locationModel = new LocationModel( val.id, val.locationCode, val.locationName, val.locationDesc, val.locationType, val.locationExtRef, val.locationCapacity, val.maxInputJobs, val.maxDisplayJobs, val.locationHeadName, val.locationHeadCount, val.locationOrder,val.locationColor, val.secCode, val.isActive)
    const req = new LocationCreateRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      [locationModel]
    );
    service.createLocation(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('location Updated Successfully');
        onReset();
        setIsModalOpen(false);
        getLocation()
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })
      .catch((err) => {
        setDisable(false)
        //AlertMessages.getErrorMessage(err.message);
      });
  }


  // const handleColorChange = (color) => {
  //   const hex = color.toHexString();
  //   setHexColor(hex);
  // };


  return (
    <div>
      <Card
        title="Location"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={locationData.map((item) => ({ ...item, key: item.id }))}
          size="small" columns={locationColumns} bordered scroll={{x: 'max-content'}} style={{minWidth: '100%'}} />
      </Card>
      <Modal
       title= {<span
        style={{ textAlign: "center", display: "block", margin: "5px 0px" }}> {isTitle}</span>}
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
              label="Location Code"
              name="locationCode"
              rules={[{ required: true, message: "Location Code is required" }]}
            >
              <Input placeholder="Please Enter Location Code"  disabled={!!selectedRecord} />
            </Form.Item>

            <Form.Item
              label="Location Name"
              name="locationName"
              rules={[{ required: true, message: "Location Name is required" }]}
            >
              <Input placeholder="Please Enter Location Name" />
            </Form.Item>

            <Form.Item
              label="Location Description"
              name="locationDesc"
              rules={[{ required: true, message: "Location Description is required" }]}
            >
              <Input placeholder="Please Enter Location Description" />
            </Form.Item>


            <Form.Item
              label="External Ref"
              name="locationExtRef"
              rules={[{ required: true, message: "External Ref Code is required" }]}
            >
              <Input placeholder="Please Enter External Ref Code" />
            </Form.Item>

            <Form.Item
              label="Location Capacity (No of Jobs)"
              name="locationCapacity"
              rules={[{ required: true, message: "Location Capacity is required" }]}
            >
              <Input placeholder="Please Enter Location Capacity" />
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
              label="Location Head Name"
              name="locationHeadName"
              rules={[{ required: true, message: "Location Header Name is required" }]}
            >
              <Input placeholder="Please Enter Location Header Name" />
            </Form.Item>

            <Form.Item
              label="Head Count"
              name="locationHeadCount"
              rules={[{ required: true, message: "Head Count is required" }]}
            >
              <Input placeholder="Please Enter Head Count" />
            </Form.Item>

            <Form.Item
              label="Location Order"
              name="locationOrder"
              rules={[{ required: true, message: "Location Order is required" }]}
            >
              <Input type="number" placeholder="Please Enter Location Order" />
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
             label="Location Color" 
             name="locationColor"
             rules={[{ required: true, message: "Location Colour  is required" }]}
             style={{ gridColumn: "span 3" }}
             >
               <SketchPicker placeholder="Please Select Location Color"
                color={color}
                onChangeComplete={(updatedColor) =>  formRef.setFieldsValue({ locationColor: updatedColor.hex })} />
            </Form.Item>

          </div>
        </Form>
      </Modal>

    </div>
  );
};

export default CreateLocation;
