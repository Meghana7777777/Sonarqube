import { FileSearchOutlined } from '@ant-design/icons';
import { CommonRequestAttrs, PackFabricInspectionRequestCategoryEnum, PackSerialDropDownModel, PoReqModel, SystematicPreferenceReqModel } from '@xpparel/shared-models';
import { InspectionPreferenceService, PreIntegrationServicePKMS } from '@xpparel/shared-services';
import { Card, Col, Form, Input, Row, Select } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import InspectionPreference from './inspection-fg-preference';

export const InspectionRequest = () => {
  const [formRef] = Form.useForm();
  const [initialValues, setInitialValues] = useState<SystematicPreferenceReqModel>();
  const [selectedPo, setSelectedPo] = useState(null);
  const [poData, setPoData] = useState<PackSerialDropDownModel[]>([]);
  const preIntegrationService = new PreIntegrationServicePKMS();
  const ipService = new InspectionPreferenceService();
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;

  useEffect(() => {
    getAllPos()
  }, []);


  const getAllPos = () => {
    const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    preIntegrationService.getAllPackSerialDropdownData(reqObj)
      .then((res) => {
        if (res.status) {
          setPoData(res.data);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
          setPoData([]);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
        setPoData([]);
      });
  };



  const getSystemPreferences = (poId: number, preferenceInspection: PackFabricInspectionRequestCategoryEnum) => {
    if (!poId && !preferenceInspection) {
      return
    }
    const reqModel: PoReqModel = new PoReqModel(user?.userName, user?.userId, user?.orgData?.unitCode, user?.orgData?.companyCode, poId, preferenceInspection)
    ipService.getSystemPreferences(reqModel).then(res => {
      if (res.status) {
        const data: SystematicPreferenceReqModel = { username: user?.userName, unitCode: user?.orgData?.unitCode, companyCode: user?.orgData?.companyCode, userId: user?.userId, po: res.data.po, insSelectionType: res.data.insSelectionType, pickPercentage: res.data.pickPercentage, remarks: res.data.remarks, inspectionType: res.data.inspectionType };
        setInitialValues(data);
        formRef.setFieldsValue(res.data);
      } else {
        setInitialValues(undefined);
        formRef.setFieldsValue({
          poId: poId,
          pickPercentage: '',
          insSelectionType: '',
          remarks: '',
        });
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message)
    })
  }





  return (
    <Card
      title={<>
        <br></br>
        <Form form={formRef} size="small" layout="horizontal">
          <Row gutter={[12, 12]}>

            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
              <Form.Item
                label={<span>Pack Order</span>}
                name="poId"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Po"
                  filterOption={(input, option) =>
                    (option.label as string)?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
                  }
                  allowClear
                  showSearch
                  style={{ width: "100%" }}
                  onChange={(val, option: any) => {
                    setSelectedPo(val)
                    getSystemPreferences(val, formRef.getFieldValue('inspectionType'))
                    formRef.setFieldValue('customerName', option?.customerName)
                  }}
                >
                  {poData.map((po) => (
                    <Select.Option key={po.id} value={po.id} customerName={po?.customerName}>
                      {po.packSerial}-{po.packOrderDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
              <Col xs={24} sm={12} md={6} lg={6} xl={6}>
              <Form.Item name={'customerName'} label={'Customer Name'} >
                <Input
                  disabled
                  placeholder='Customer Name'
                ></Input>
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </>

      }
      extra={<>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileSearchOutlined style={{ fontSize: 20 }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            Inspection Request
          </span>
        </div>
      </>}
    >
      {/* {initialValues && <InspectionBySelection initialValues={initialValues} setInspectionPickSaveFlag={setInspectionPickSaveFlag} inspectionPickSaveFlag={inspectionPickSaveFlag} poID={selectedPo} />} */}

      {selectedPo && <InspectionPreference packOrder={selectedPo} formRef={formRef} />}

    </Card>
  );

}




