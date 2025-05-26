
import { CheckCard } from '@ant-design/pro-components';
import { CommonRequestAttrs, MasterModelDto } from '@xpparel/shared-models';
import { MasterService } from '@xpparel/shared-services';
import { Button, Card, Form, Space } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import ConfigMasterGrid from './config-master-grid';

export const MastersRendering = () => {
  const [configData, setConfigData] = useState<MasterModelDto[]>([]);
  const service = new MasterService();
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  const [parentData, setParentData] = useState<MasterModelDto>();
  const [formRef] = Form.useForm();

  useEffect(() => {
    getDropDownParentId();
  }, []);

  const getDropDownParentId = () => {
    const req = new CommonRequestAttrs(userName, orgData.unitCode, orgData.companyCode, userId);
    service.getGlobalConfigMasters(req)
      .then((res) => {
        if (res.status) {
          setConfigData(res.data);
        } else {
          setConfigData([]);
        }
      })
      .catch((error) => console.error(error));
  };



  return (
    <>
      <Card size='small'>
        <Space wrap>
          {configData.map((rec) => (
            <Button
              className={rec?.id === parentData?.id ? 'orange-button-masters' : ''}
              key={rec.masterName}
              type='primary'
              style={{ minWidth: '100px' }}
              onClick={() => {
                setParentData(rec)
              }} >{rec.masterName}</Button>


          ))}

        </Space>



      </Card >


      {parentData && <ConfigMasterGrid parentData={parentData} formRef={formRef}/>
      }
    </>
  );
};

export default MastersRendering;


