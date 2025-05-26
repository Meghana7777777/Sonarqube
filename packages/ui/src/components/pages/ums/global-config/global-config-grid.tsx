
import { EditFilled } from '@ant-design/icons';
import { Button, Card, Divider, Drawer, Form, Input, Modal, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { MasterService } from '@xpparel/shared-services'; // Replace with actual service
import { CommonRequestAttrs, MasterResponse, MasterModelDto, ConfigMasterModelIdDto, CommonIdReqModal, AttributesMasterModelDto } from '@xpparel/shared-models';
import { AlertMessages } from 'packages/ui/src/components/common';
import { ColumnsType } from 'antd/es/table';
import { SequenceUtils, useAppSelector } from 'packages/ui/src/common';
import GlobalConfigForm from './global-config-from'; // Import your form
import GlobalConfigPreview from './global-config-preview';

export class prop {
  name: string;
  id: number;

}


export const GLobalConfigGrid = () => {
  const [model, openModel] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<MasterModelDto | null>(null);
  const [formRef] = Form.useForm();
  const [configData, setConfigData] = useState<any[]>([]);
  const [searchedText, setSearchedText] = useState<string>('');

  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  const [dropdown, setDropdown] = useState<prop[]>([]);
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState<boolean>(false);
  const [selectedAttributes, setSelectedAttributes] = useState<AttributesMasterModelDto[]>([]);
  const [attributesData, setAttributesData] = useState<AttributesMasterModelDto[]>([]);


  const service = new MasterService();
  // let dropdown:string[]=[];

  // Fetch Global Config Masters and Parent Data
  useEffect(() => {
    getGlobalConfigMasters();
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



  const getGlobalConfigMasters = () => {
    const req = new ConfigMasterModelIdDto(userName, orgData.unitCode, orgData.companyCode, userId);
    service.getGlobalConfigMasters(req).then((res: MasterResponse) => {
      if (res.status) {
        setConfigData(res.data);
        const dro = res.data.map((itr) => ({
          name: itr.masterName,
          id: itr.id,
        }));
        setDropdown(dro);
      } else {
        setConfigData([]);
      }
    }).catch((err) => {
      console.error('Error fetching data:', err);
    });
  };

  console.log(selectedAttributes, 'llllllllllll')

  const edit = (record: any) => {
    if (!record.isActive) {
      AlertMessages.getErrorMessage('Please Activate the record before Edit')
      return
    }
    setInitialValues(record);
    openModel(true);
  };

  const closeModel = () => {
    openModel(false);
    formRef.resetFields();
    getGlobalConfigMasters();
  };

  const modelOpen = () => {
    setInitialValues(null);
    openModel(true);
  };

  const saveGlobalConfigMasters = () => {
    formRef.validateFields().then((values) => {
      const reqModel = new MasterModelDto(
        userName,
        orgData.unitCode,
        orgData.companyCode,
        userId,
        values.id,
        values.masterName,
        values.masterCode,
        values.masterLabel,
        values.parentId,
        values.attributes
      );

      service.saveGlobalConfigMasters(reqModel).then((res) => {
        if (res.status) {
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
  const toggleGlobalConfigMasters = (id: number) => {
    const req = new CommonIdReqModal(id, userName, orgData.unitCode, orgData.companyCode, userId);
    service.toggleGlobalConfigMasters(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        getGlobalConfigMasters();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => console.log(err.message));
  };

  const toggleConfigMastersData = (record: any) => {
    setInitialValues(record);
    toggleGlobalConfigMasters(record.id);
  };
  const columns: ColumnsType<any> = [
    {
      title: 'Master Name',
      dataIndex: 'masterName',
      sorter: (a, b) => {
        return a.masterName.localeCompare(b.masterName);
      },
      sortDirections: ["descend", "ascend"],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      },
    },
    {
      title: 'Master Code',
      dataIndex: 'masterCode'
    
    },
    {
      title: 'Master Label',
      dataIndex: 'masterLabel',
  
    },
    {
      title: 'Parent',
      dataIndex: 'parentCode',
  
    },
    {
      title: 'Action',
      render: (_, record) => (
        <>
          <EditFilled onClick={() => edit(record)} style={{ fontSize: '20px', color: '#08c' }} />
          <Divider type='vertical' />
          <Switch
            className={record.isActive ? 'toggle-activated' : 'toggle-deactivated'}
            checked={record.isActive}
            onChange={() => toggleConfigMastersData(record)}
            style={{ fontSize: '20px', color: '#08c' }}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Global Master"
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
          dataSource={configData}
          size='small'
        />
      </Card>
      <Modal
        width={600}
        cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
        open={model}
        cancelText="Cancel"
        onOk={saveGlobalConfigMasters}
        onCancel={closeModel}
        closable
        okText={initialValues ? 'Update' : 'Save'}
      >
        <Card
          title={'Master Creation'}
          extra={<>
            <Button
              onClick={() => {
                setOpenPreviewDrawer(true)
              }}
              type='primary'>Preview</Button>
          </>}
        >
          <GlobalConfigForm
            attributesData={attributesData}
            formRef={formRef}
            initialValues={initialValues}
            dropdown={dropdown}
            setSelectedAttributes={setSelectedAttributes}
          />
        </Card>

      </Modal>
      <Drawer
        width={1300}
        open={openPreviewDrawer}
        closable
        onClose={() => {
          setOpenPreviewDrawer(false)
        }}

      >
        <GlobalConfigPreview formRef={formRef} selectedAttributes={selectedAttributes} />
        <br></br>
        <div style={{ float: 'right' }}>
          <Button type='primary' danger> Cancel</Button>
          <Button type='primary'>Create</Button>
        </div>

      </Drawer>
    </div>
  );
};

export default GLobalConfigGrid;

