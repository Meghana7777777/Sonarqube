import { EditFilled } from '@ant-design/icons';
import { AttributesMasterModelDto, CommonIdReqModal, CommonRequestAttrs } from '@xpparel/shared-models';
import { MasterService } from '@xpparel/shared-services'; // Replace with actual service
import { Button, Card, Divider, Form, Input, Modal, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SequenceUtils, useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useEffect, useState } from 'react';
import AttributesMasterForm from './attributes-master-form';



export const AttributesMasterGrid = () => {
  const [model, openModel] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<AttributesMasterModelDto | null>(null);
  const [attributesData, setAttributesData] = useState<AttributesMasterModelDto[]>([]);
  const [searchedText, setSearchedText] = useState<string>('');
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  const [dummyRefreshKey, SetDummyRefreshKey] = useState<number>(0);
  const [enumOptionItems, setEnumOptionItems] = useState<string[]>([]);


  const service = new MasterService();

  useEffect(() => {
    getAttributesMasters();
  }, []);

  const getAttributesMasters = () => {
    const req = new CommonRequestAttrs(userName, orgData.unitCode, orgData.companyCode, userId)
    service.getAttributesMasters(req).then((res) => {
      if (res.status) {
        setAttributesData(res.data);
      } else {
        setAttributesData([]);
      }
    }).catch((err) => {
      console.error('Error fetching data:', err);
    });
  };

  const edit = (record: any) => {
    if (!record.isActive) {
      AlertMessages.getErrorMessage('Please Activate the record before Edit');
      return;
    }
    setInitialValues(record);
    openModel(true);
  };

  const closeModel = () => {
    SetDummyRefreshKey(dummyRefreshKey + 1);
    openModel(false);
    formRef.resetFields();
  };

  const modelOpen = () => {
    SetDummyRefreshKey(dummyRefreshKey + 1);
    setInitialValues(null);
    openModel(true);
  };

  const saveAttributesMasters = () => {
    formRef.validateFields().then((values) => {
      values.companyCode = orgData.companyCode;
      values.username = userName;
      values.unitCode = orgData.unitCode;
      values.userId = userId
      values.hidden = values?.hidden ? values?.hidden : false
      values.disabled = values?.disabled ? values?.disabled : false;
      //have 2 input fields one is Form.Item and another one is state 
      values.optionsSource = enumOptionItems?.length ? enumOptionItems : [values.optionsSource]
      service.saveAttributesMasters(values).then((res) => {
        if (res.status) {
          getAttributesMasters();
          AlertMessages.getSuccessMessage(res.internalMessage);
          closeModel();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      }).catch((error) => {
        console.error('Error saving master:', error);
        AlertMessages.getErrorMessage(error.message);
      });
    }).catch((err) => {
      AlertMessages.getErrorMessage('Please fill all the required fields');
    });
  };

  const toggleAttributesMasters = (id: number) => {
    const req = new CommonIdReqModal(id, userName, orgData.unitCode, orgData.companyCode, userId);
    service.toggleAttributesMasters(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        getAttributesMasters();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => console.log(err.message));
  };

  const toggleAttributeStatus = (record: AttributesMasterModelDto) => {
    setInitialValues(record);
    toggleAttributesMasters(record.id);
  };

  const columns: ColumnsType<AttributesMasterModelDto> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter:(a,b)=>{
        return a.name.localeCompare(b.name);
      },
      sortDirections:["descend","ascend"],
      filteredValue:[String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
         return SequenceUtils.globalFilter(value, record);
      },
    },
    {
      title: 'Label Name',
      dataIndex: 'labelName',
      key: 'labelName',
   
    },
    {
      title: 'Input Type',
      dataIndex: 'inputType',
      key: 'inputType',
   
    },
    {
      title: 'Required Field',
      dataIndex: 'requiredField',
      key: 'requiredField',
      render: (value: boolean) => (value ? 'Yes' : 'No'),

    },
    {
      title: 'Placeholder',
      dataIndex: 'placeHolder',
      key: 'placeHolder',
    

    },
    {
      title: 'Validation Message',
      dataIndex: 'validationMessage',
      key: 'validationMessage',
    
    },
    {
      title: 'Max Length',
      dataIndex: 'maxLength',
      key: 'maxLength',
    
    },
    {
      title: 'Min Length',
      dataIndex: 'minLength',
      key: 'minLength',

    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <>
          <EditFilled onClick={() => edit(record)} style={{ fontSize: '20px', color: '#08c' }} />
          <Divider type="vertical" />
          <Switch
            checked={record.isActive}
            onChange={() => toggleAttributeStatus(record)}
          // disabled={record?.isExist}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Attributes Master"
        extra={<Button onClick={modelOpen} type="primary">Create</Button>}
      >
         <Input.Search
          placeholder="Search"
          allowClear
          onChange={(e) => {
            setSearchedText(e.target.value);
          }}
          onSearch={(value) => {
            setSearchedText(value);
          }}
          style={{ width: 200, float: "right" }}
        />

        <Table
          columns={columns}
          bordered
          dataSource={attributesData}
          size="small"
          rowKey="id"
          scroll={{ x: 'max-content' }}
        />


        <Modal
          key={dummyRefreshKey}
          width={600}
          title="Attributes Master"
          cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
          open={model}
          cancelText="Cancel"
          onOk={saveAttributesMasters}
          onCancel={closeModel}
          closable
          okText={initialValues ? 'Update' : 'Save'}
        >
          <AttributesMasterForm
            formRef={formRef}
            initialValues={initialValues}
            enumOptionItems={enumOptionItems}
            setEnumOptionItems={setEnumOptionItems}
          />
        </Modal>
      </Card>
    </div>
  );
};

export default AttributesMasterGrid;
