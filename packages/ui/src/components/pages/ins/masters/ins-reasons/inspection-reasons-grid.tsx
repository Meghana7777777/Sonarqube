import Icon, { EditOutlined } from "@ant-design/icons";
import { InsMasterReasonsCreateRequest, InsReasonsActivateRequest, InsReasonsCategoryRequest, InsReasonsCreateRequest, InsReasonsCreationModel, InsTypesEnumType, InsTypesForMasterEnum, InsTypesForMasterEnumDisplayValues } from "@xpparel/shared-models";

import { Button, Card, Divider, Form, Modal, Popconfirm, Select, Switch, Table } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/lib/table";
import ReasonsCreateForm from "./inspection-reasons-form";
import { AlertMessages } from "packages/ui/src/components/common";
import { InsReasonsServices } from "@xpparel/shared-services";

export const InspectionReasonsGrid = () => {

  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = new InsReasonsServices();
  const [reasonsdata, setReasonssData] = useState<InsReasonsCreationModel[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<InsReasonsCreationModel>();
  const [isTitle, setIsTitle] = useState('');
  const [oktext, setOkText] = useState('');
  const [selectedInsType, setSelectedInsType] = useState<InsTypesForMasterEnum | undefined>(undefined);
  useEffect(() => {
    // getReasons();
  }, []);

  const getReasons = (selectedMInsType: InsTypesForMasterEnum) => {
    const obj = new InsReasonsCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, null, selectedMInsType);
    service.insGetAllReasonsData(obj).then(res => {
      if (res.status) {

        setReasonssData(res.data);
      } else {
        setReasonssData([]);
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch(err => {
      console.log(err.message)
    })
  }

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle('Update Inpection Reason');
    setOkText("Update");
  };

  const showModals = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
    setIsTitle('Create Inpection Reason');
    setOkText("Create");
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    formRef.resetFields();
  };
  const fieldsReset = () => {
    formRef.resetFields();
  };
  const handleOk = () => {
    formRef.validateFields().then(values => {
      const req = new InsMasterReasonsCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.name, values.code, values.extCode, values.pointValue, values.category, values.isActive, selectedInsType, values.reasonName, values.reasonDesc);
      service.insCreateReasons(req).then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          setIsModalOpen(false);
          fieldsReset();
          getReasons(selectedInsType);
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

  const handleInsTypeChange = (value) => {
    formRef.setFieldsValue({ insType: value });
    if (value) {
      getReasons(value);
    }
    setSelectedInsType(value);
  };



  const getColumnsByInsType = (insType: InsTypesForMasterEnum): ColumnsType<any> => {
    const baseColumns: ColumnsType<any> = [];
    baseColumns.push(
      {
        title: 'Code',
        dataIndex: 'code',
        align: 'center',
        key: 'code',
      },
      {
        title: 'Inspection Type',
        dataIndex: 'insType',
        align: 'center',
        key: 'insType',
        render: (text: string) =>
          text?.trim() && InsTypesForMasterEnumDisplayValues[text as keyof typeof InsTypesForMasterEnumDisplayValues]
            ? InsTypesForMasterEnumDisplayValues[text as keyof typeof InsTypesForMasterEnumDisplayValues]
            : '-',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        align: 'center',
        key: 'name',
        render: (text: string) => text?.trim() ? text : '-',
      },
    )


    if (insType === InsTypesForMasterEnum.FGINS || insType === InsTypesForMasterEnum.THREADINS || insType === InsTypesForMasterEnum.YARNINS || insType === InsTypesForMasterEnum.TRIMINS) {
      baseColumns.push(

        {
          title: 'Reason Desc',
          dataIndex: 'reasonDesc',
          align: 'center',
          key: 'reasonDesc',
          render: (text: string) => text?.trim() ? text : '-',
        },


      );
    }

    if (insType === InsTypesForMasterEnum.FABRICINS) {
      baseColumns.push(

        {
          title: 'Ext Code',
          dataIndex: 'extCode',
          align: 'center',
          key: 'extCode',
        },
        {
          title: 'Point Value',
          dataIndex: 'pointValue',
          align: 'center',
          key: 'pointValue',
        },

        {
          title: 'Category',
          dataIndex: 'category',
          align: 'center',
          key: 'category',
        },

      );
    }

    // Add common "Action" column at the end
    baseColumns.push({
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (value, recod) => (
        <>
          {recod.isActive ? (
            <EditOutlined onClick={() => showModal(recod)} style={{ cursor: 'pointer' }} />
          ) : (
            <EditOutlined style={{ color: '#ccc', cursor: 'not-allowed' }} />
          )}

          <Divider type="vertical" />

          <Popconfirm
            onConfirm={() => {
              const req = new InsReasonsActivateRequest('', '', '', 5, recod.id);
              service.insActivateDeactivateReasons(req)
                .then(res => {
                  AlertMessages.getSuccessMessage(res.internalMessage);
                  getReasons(selectedInsType);
                })
                .catch(err => console.log(err));
            }}
            title={recod.isActive ? "Deactivate Inspection Reason?" : "Activate Inspection Reason?"}
          >
            <Switch
              size='default'
              className={recod.isActive ? 'toggle-activated' : 'toggle-deactivated'}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              checked={recod.isActive}
            />
          </Popconfirm>
        </>
      )

    });
    console.log(baseColumns, 'baseColumns');
    return baseColumns;
  };











  return <>
    <Card title='Inspection Failed Reasons' extra={
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Form.Item
          label="Inspection Type"
          name="insType"
          style={{ marginBottom: 0 }}
          rules={[{ required: false, message: 'Enter the inspection type' }]}
        >
          <Select
            placeholder="Please Select Inspection Type"
            allowClear
            showSearch
            onChange={handleInsTypeChange}
            style={{ minWidth: 200 }}
          >
            {/* {Object.keys(InsTypesForMasterEnum).map(key => (
              <Select.Option key={key} value={key}>
                {InsTypesForMasterEnum[key].name}
              </Select.Option>
            ))} */}

            {Object.keys(InsTypesForMasterEnum).map((key) => (
              <Select.Option key={key} value={key}>
                {InsTypesForMasterEnumDisplayValues[InsTypesForMasterEnum[key as keyof typeof InsTypesForMasterEnum]]}
              </Select.Option>
            ))}

          </Select>
        </Form.Item>

        {selectedInsType && <Button onClick={showModals} type="primary">
          <b>Create</b>
        </Button>}
      </div>
    }

    >
      {selectedInsType && <Table dataSource={reasonsdata}
        columns={getColumnsByInsType(selectedInsType)} size="small" scroll={{ x: 'max-content' }} style={{ minWidth: '100%' }}> </Table>}
      <Modal title={<span style={{ textAlign: 'center', display: 'block', margin: '5px 0px' }}>{isTitle}</span>} open={isModalOpen} onOk={handleOk} okText={oktext} cancelText="Close" onCancel={handleCancel} cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }} style={{ maxWidth: 600 }} width="90%">
        <ReasonsCreateForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} SelectedInsType={selectedInsType} />
      </Modal>
    </Card>
  </>

}
export default InspectionReasonsGrid;