
import Icon, { EditOutlined } from "@ant-design/icons";
import { WorkstationOperationIdRequest, WorkstationOperationModel } from "@xpparel/shared-models";
import { OperationService, WorkstationOperationSharedService, WorkStationService } from "@xpparel/shared-services";
import { Button, Card, Col, Divider, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";

export interface ICreateOperationMappingProps {
  updateDetails: (workdata: WorkstationOperationModel) => void;
  newWindow: boolean;
  getWorkstationOperation: () => void
}

const CreateOperationMapping = (props: ICreateOperationMappingProps) => {
  const user = useAppSelector((state) => state.user.user.user);
  const { newWindow } = props;
  const { Option } = Select;
  const [formRef] = Form.useForm();
  const [dynamicFormRef] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const [form] = Form.useForm()
  const [disable, setDisable] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);
  const service = new WorkStationService();
  const service1 = new WorkstationOperationSharedService();
  const newservice = new OperationService();
  const [data, setData] = useState<any>()
  const [workStationDropdown, setWorkStationDropdown] = useState<any[]>([]);
  const [operationDropdown, setOperationDropdown] = useState<any[]>([]);
  const [dynamicData, setDynamicData] = useState([])
  const [isCreating, setIsCreating] = useState<boolean>(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  let externalWindow: any;
  let containerEl: any;


  if (newWindow) {
    externalWindow = window.open("", "", "width=600,height=700,left=200,top=50");
    containerEl = externalWindow.document.createElement("div");
    externalWindow.document.body.appendChild(containerEl);
    // externalWindow.document.title = "Barcodes";
  }


  useEffect(() => {
    getWorkstationOperation();
  }, []);

  const getWorkstationOperation = () => {
    setLoading(true);
    service1.getWorkstationOperation().then((res) => {
      if (res.status) {
        setData(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch((err) => {
      AlertMessages.getErrorMessage(err.message)
    })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getWorkstationDropdown();
    getOperationDropdown();
  }, []);

  const getWorkstationDropdown = () => {
    service.WorkstationOperationTypeDropDown()
      .then((res) => {
        if (res.status) {
          setWorkStationDropdown(res.data);
        } else {
          setWorkStationDropdown([]);
          message.error(res.internalMessage, 2);
        }
      })
      .catch((err) => console.log(err));
  };

  const getOperationDropdown = () => {
    newservice.OperationsTypeDropDown()
      .then((res) => {
        if (res.status) {
          setOperationDropdown(res.data);
        } else {
          setOperationDropdown([]);
          message.error(res.internalMessage, 2);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleOperationChange = (value: any, option: any) => {
    if(option){

    dynamicFormRef.setFieldsValue({ "opName": option.name });
    }
  };

  const handleWorkstationChange = (value: any, option: any) => {
    if(option){
    formRef.setFieldsValue({ "wsName": option.name });
    }
  };

  const createShowModal = () => {
    setIsModalOpen(true);
    setIsTitle("Create OperationMapping");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
    setIsCreating(true);
  };

  const editShowModal = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update OperationMapping");
    setOkText("Update");
    formRef.setFieldsValue(record);
    dynamicFormRef.setFieldsValue(record);
    setIsCreating(false); 
  };

  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();
  };


  const deactivateWorkStationOperation = (id: number) => {
    const req = new WorkstationOperationIdRequest("", "", "", 5, id);
    service1.activateDeactivateWorkStationOperation(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getWorkstationOperation();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };


  const operationMappingColumns: ColumnsType<any> = [

    {
      title: "WorkStation Code",
      dataIndex: "wsCode",
      align: "center",
      key: "wsCode"
    },
    {
      title: "Workstation Name",
      dataIndex: "wsName",
      align: "center",
      key: "wsName"
    },

    {
      title: "Operation Code",
      dataIndex: "iOpCode",
      align: "center",
      key: "iOpCode"
    },
    {
      title: "Operation Name",
      dataIndex: "opName",
      align: "center",
      key: "opName"
    },
    {
      title: "External Ref",
      dataIndex: "externalRefCode",
      align: "center",
      key: "externalRefCode"
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
              deactivateWorkStationOperation(record.id);
            }}
            title={
              record.isActive
                ? "Are you sure to Deactivate WorkStationOperation?"
                : "Are you sure to Activate WorkStationOperation?"
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

  const dynamicTableColumns: ColumnsType<any> = [
    {
      title: "WorkStation Code",
      dataIndex: "wsCode",
      align: "center",
      key: "wsCode"
    },
    {
      title: "Workstation Name",
      dataIndex: "wsName",
      align: "center",
      key: "wsName"
    },
    {
      title: "Operation Code",
      dataIndex: "iOpCode",
      align: "center",
      key: "iOpCode"
    },
    {
      title: "Operation Name",
      dataIndex: "opName",
      align: "center",
      key: "opName"
    },
    {
      title: "External Ref",
      dataIndex: "externalRefCode",
      align: "center",
      key: "externalRefCode"
    },
    ...(isCreating ? [{
      title: "Action",
      dataIndex: "action",
      align: "center" as "center",
      key: "action",
      render: (_, record, index) => (
        <Space>
           <EditOutlined onClick={() => editDynamicRecord(index)} />
        </Space>
      ),
    }] : [])
  ];
  const onReset = () => {
    form.resetFields();
  };

  const saveWorkStationOperation = (val, isUpdate) => {
    setDisable(true);
    const req: WorkstationOperationModel[] = [];
    dynamicData.forEach(rec => {
        req.push(new WorkstationOperationModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, val.id, rec.wsCode, rec.iOpCode, rec.opName, rec.externalRefCode, rec.isActive));
    });
    service1.createWorkstationOperation(req).then((res) => {
        if (res.status) {
            const successMessage = isUpdate ? 'WorkStationOperation Updated Successfully' : 'WorkStationOperation Created Successfully';
            AlertMessages.getSuccessMessage(successMessage);
            setDynamicData([]);
            onReset();
            setIsModalOpen(false);
            getWorkstationOperation();
        } else {
            AlertMessages.getErrorMessage(res.internalMessage);
        }
    })
    .catch((err) => {
        setDisable(false);
        AlertMessages.getErrorMessage(err.message);
    });
};

const save = async () => {
    try {
        const formData = await formRef.validateFields();
        const isUpdate = !!selectedRecord;
        saveWorkStationOperation(formData, isUpdate);
    } catch (err) {
        console.error("Validation Failed:", err);
    }
};

const addHandler = () => {
  dynamicFormRef.validateFields().then(res => {
    const id = formRef.getFieldValue('id')
    const wsCode = formRef.getFieldValue('wsCode')
    const wsName = formRef.getFieldValue('wsName')
    if (editingIndex !== null) {
      setDynamicData(prev => {
        const newData = [...prev];
        newData[editingIndex] = { ...newData[editingIndex], ...res, id, wsCode, wsName };
        return newData;
      });
      setEditingIndex(null);
    } else {
      setDynamicData(prev => {
        return [
          ...prev,
          { ...res, id, wsCode, wsName }
        ]
      });
    }
    dynamicFormRef.resetFields();
  }).catch(err => console.log(err.message));

}

  const editDynamicRecord = (index: number) => {
    const record = dynamicData[index];
    dynamicFormRef.setFieldsValue(record);
    setEditingIndex(index);
  }

  const updateDynamicRecord = () => {
    dynamicFormRef.validateFields().then(res => {
      setDynamicData(prev => {
        const newData = [...prev];
        newData[editingIndex] = { ...newData[editingIndex], ...res };
        return newData;
      });
      dynamicFormRef.resetFields();
      setEditingIndex(null);
    }).catch(err => console.log(err.message));


  };

  return (
    <div>
      <Card
        title="OperationMappings"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={data} size="small" columns={operationMappingColumns} bordered />
      </Card>
      <Modal
        title={isTitle}
        width={1020}
        open={isModalOpen}
        onOk={save}
        okText={okText}
        cancelText="Close"
        onCancel={handleCancel}
        cancelButtonProps={{ style: { backgroundColor: "red", color: "white" } }}
      >
        <Form form={formRef} layout="vertical">
          <Form.Item
            label="id"
            name="id"
            hidden
          >
            <Input />
          </Form.Item>
          <Row gutter={[16,8]}>
            <Col span={11}>
              <Form.Item
                label="Workstation Code"
                name="wsCode"
                rules={[{ required: true, message: 'Please select Workstation Code' }]}
              >
                <Select
                  onChange={handleWorkstationChange}
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  placeholder="Select Workstation Code"
                >
                  {workStationDropdown?.map((rec) => (
                    <Option key={rec?.wsCode} value={rec?.wsCode} name={rec?.wsName}>
                      {rec?.wsCode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              </Col>

            <Col span={11}> 
            <Form.Item
              label="Workstation Name"
              name="wsName"
              rules={[{ required: true, message: "Workstation Name is required" }]}
            >
              <Input placeholder="Workstation Name" style={{ 'fontWeight': 'bold' }} disabled />
            </Form.Item></Col>
            <Col span={2}></Col>
          </Row>
        </Form>


        <Form form={dynamicFormRef} layout="vertical">
          <Row gutter={[16,8]}>
            <Col span={7}><Form.Item
              label="Operation Code"
              name="iOpCode"
              rules={[{ required: true ,message:"Please Select Operation Code " }]}
            >
              <Select
                onChange={handleOperationChange}
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder="Select operation Type"
              >
                {operationDropdown?.map((rec) => (
                  <Option key={rec.id} value={rec.iOpCode} name={rec.opName}>
                    {rec.iOpCode}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                label="Operation Name"
                name="opName"
                rules={[{ required: true, message: "Operation Name is required" }]}
              >
                <Input placeholder="Operation Name" style={{ 'fontWeight': 'bold' }} disabled />
              </Form.Item></Col>
            <Col span={7}>
              <Form.Item
                label="External Ref"
                name="externalRefCode"
                rules={[{ required: true, message: " External Ref is required" }]}
              >
                <Input placeholder="Please Enter External Ref" />
              </Form.Item></Col>
            <Col span={2}>
              <Form.Item
                label="">
               <Button style={{marginTop:30}}onClick={editingIndex === null ? addHandler : updateDynamicRecord}>
                  {editingIndex === null ? '+' : 'Update'}
                </Button>

              </Form.Item></Col>
          </Row>
        </Form>
        <Table dataSource={dynamicData} size="small" columns={dynamicTableColumns} bordered />
      </Modal>
    </div>
  );
};

export default CreateOperationMapping;



