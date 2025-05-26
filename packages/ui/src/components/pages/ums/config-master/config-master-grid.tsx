import { EditFilled } from '@ant-design/icons';
import { CommonIdReqModal, ConfigGcIdModelDto, GetAttributesByGcId, InputTypesEnum, MasterModelDto } from '@xpparel/shared-models';
import { MasterService } from '@xpparel/shared-services'; // Replace with actual service
import { Button, Card, FormInstance, Input, Modal, Switch, Table } from 'antd';
import { SequenceUtils, useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useEffect, useState } from 'react';
import ConfigMasterForm from './config-master-form';
import { ColumnsType } from 'antd/es/table';

interface IProps {
  parentData?: MasterModelDto
  formRef: FormInstance<any>
}


export const ConfigMasterGrid = (props: IProps) => {
  const { parentData, formRef } = props
  const [model, openModel] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<MasterModelDto | null>(null);
  const [configData, setConfigData] = useState<any[]>([]);
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  const [dummyRefreshKey, SetDummyRefreshKey] = useState<number>(0);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [configAttributes, setConfigAttributes] = useState<GetAttributesByGcId[]>([]);
  const [searchedText, setSearchedText] = useState<string>('');


  const service = new MasterService();

  useEffect(() => {
    getConfigMasters()
  }, [parentData])

  const getConfigMasters = () => {
    const req = new ConfigGcIdModelDto(userName, orgData.unitCode, orgData.companyCode, userId, parentData?.id);
    service.getConfigMasters(req).then((res) => {
      if (res.status) {
        setConfigData(res.data.data);
        dynamicColumns(res.data.keysAndLabels)
      } else {
        setConfigData([]);
        setTableColumns([])
      }
    }).catch((err) => {
      console.error('Error fetching data:', err);
    });
  };

  const edit = (record: any) => {
    if (!record.isActive) {
      AlertMessages.getErrorMessage('Please Activate the record before Edit')
      return
    }
    const selectedRecord = record;
    selectedRecord.id = record?.configMasterId;
    setInitialValues(record);
    openModel(true);
  };

  const closeModel = () => {
    SetDummyRefreshKey(dummyRefreshKey + 1)
    openModel(false);
    formRef.resetFields();
    getConfigMasters()
  };

  const modelOpen = () => {
    SetDummyRefreshKey(dummyRefreshKey + 1)
    setInitialValues(null);
    openModel(true);
    formRef.setFieldsValue(undefined)
  };


  const isFileInputTypeIsIncludesOrNot = (): { fileKey: string }[] => {
    const fileUploadProperties = configAttributes[0].attributeProperties.filter((rec) => rec.inputType === InputTypesEnum.Upload);
    const existedFileKeys: { fileKey: string }[] = []
    if (fileUploadProperties?.length) {
      for (const up of fileUploadProperties) {
        existedFileKeys.push({ fileKey: up.name })
      }
    }
    return existedFileKeys
  }

  const fileUpload = (formData: FormData) => {

    service.fileUpload(formData).then(res => {
      if (res.status) {
        closeModel();
      }
    }).catch(err => console.log(err.message))
  }


  const saveConfigMasters = () => {
    formRef.validateFields().then((values) => {
      // const keys = isFileInputTypeIsIncludesOrNot();
      // const formData = new FormData();
      // if (keys?.length) {
      //   for (const key of keys) {
      //     formData.append('file', values[key.fileKey].file.originFileObj);
      //     formData.append('fileKey', key.fileKey);
      //     delete values[key.fileKey];
      //     values[key.fileKey] = values[key.fileKey];
      //   }
      // }
      values.username = userName;
      values.unitCode = orgData.unitCode;
      values.companyCode = orgData.companyCode;
      values.userId = userId;
      values.globalConfigId = parentData.id;
      values.parentId = values.parentId;
      service.saveConfigMasters(values).then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          // if (keys?.length) {
          //   fileUpload(formData)
          // } else {
          //   closeModel();
          // }
          closeModel();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      }).catch((error) => {
        console.error('Error saving master:', error);
        AlertMessages.getErrorMessage(error.message);
      });
    }).catch((err) => {
      console.log(err, 'llll')
      AlertMessages.getErrorMessage('Please fill all the required fields');
    });
  };

  const toggleConfigMasters = (id: number) => {
    const req = new CommonIdReqModal(id, userName, orgData.unitCode, orgData.companyCode, userId);
    service.toggleConfigMasters(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        getConfigMasters();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => console.log(err.message));
  };

  const toggleConfigMastersData = (record: any) => {
    setInitialValues(record);
    toggleConfigMasters(record.configMasterId);
  };

  const dynamicColumns = (keysAndColumns: { title: string, dataIndex: string, render?: any }[]) => {
    const columns: ColumnsType<any> = keysAndColumns;
    
    columns.push({
      title: 'Parent Code',
      dataIndex: 'parentCode',
      sorter: (a, b) => {
        return a.parentCode.localeCompare(b.parentCode);
      },
      sortDirections: ["descend", "ascend"],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      },
    })
    columns.push(
      {
        title: 'Action',
        dataIndex: 'configMasterId',
        fixed: 'right',
        render: (_, record) => (
          <>
            <EditFilled onClick={() => edit(record)} style={{ fontSize: '20px', color: '#08c' }} />
            <Switch
              disabled={record?.isExist}
              className={record.isActive ? "toggle-activated" : "toggle-deactivated"}
              checked={record.isActive}
              onChange={() => toggleConfigMastersData(record)}
              style={{ fontSize: "20px", color: "#08c" }}
            />
          </>
        ),
      }
      ,)
    setTableColumns(columns)
  }

  [



  ];

  const resetFields = () => {
    formRef.resetFields()
  }

  return (
    <div>

      <Card
        title={props?.parentData?.masterName}
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
        {parentData &&
          <Table
            columns={tableColumns}
            bordered
            dataSource={configData}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        }

        <Modal
          key={dummyRefreshKey}
          width={1300}
          cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
          open={model}
          cancelText="Cancel"
          onOk={saveConfigMasters}
          onCancel={closeModel}
          closable
          okText={initialValues ? 'Update' : 'Save'}
        >
          <ConfigMasterForm
            dummyRefreshKey={dummyRefreshKey}
            formRef={formRef}
            initialValues={initialValues}
            parentData={parentData}
            closeModel={closeModel}
            setConfigAttributes={setConfigAttributes}
          />
        </Modal>
      </Card>
    </div>
  );
};

export default ConfigMasterGrid;
