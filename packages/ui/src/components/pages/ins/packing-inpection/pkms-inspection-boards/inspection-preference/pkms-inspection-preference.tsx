import { PackListIdRequest, PackingListSummaryModel, RollSelectionTypeEnum, RollSelectionTypeEnumDisplayValue, SystemPreferenceModel } from '@xpparel/shared-models';
import { GrnServices } from '@xpparel/shared-services';
import { Form, Input, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import { PKMSAllocationTabForm } from './pkms-allocation-tab-form';
import { ScxButton, ScxCard, ScxColumn, ScxForm, ScxRow } from 'packages/ui/src/schemax-component-lib';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';

interface IInspectionPreferenceProps {
  summeryDataRecord: PackingListSummaryModel
}
const { Option } = Select;
export const InspectionPreference = (props: IInspectionPreferenceProps) => {
  const [formRef] = ScxForm.useForm();
  const [initialValues, setInitialValues] = useState<SystemPreferenceModel>();
  const [inspectionPickSaveFlag, setInspectionPickSaveFlag] = useState(false);
  const { summeryDataRecord } = props;
  const grnServices = new GrnServices();
  const user = useAppSelector((state) => state.user.user.user);

  useEffect(() => {
    getSystemPreferences();
  }, []);


  
  const getSystemPreferences = () => {
    const reqModel: PackListIdRequest = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.id)
    grnServices.getSystemPreferences(reqModel).then(res => {
      if (res.status) {
        setInitialValues(res.data);
        formRef.setFieldsValue(res.data);
      } else {
        //AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message)
    })
  }

  const saveSystemPreferences = () => {
    formRef.validateFields().then((values) => {
      const reqModel: SystemPreferenceModel = new SystemPreferenceModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.id, values.rollSelectionType, values.rollsPickPercentage, values.remarks)
      grnServices.saveSystemPreferences(reqModel).then(res => {
        if (res.status) {
          setInitialValues(undefined)
          getSystemPreferences()
          AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      }).catch(err => {
        AlertMessages.getErrorMessage(err.message)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  return (<>
    <ScxCard title='Inspection Option'>
      <ScxForm form={formRef} autoComplete="off" initialValues={initialValues}>
        <ScxRow justify='space-around'>
          <ScxColumn xs={24} sm={4} md={4} lg={4} xl={4}>
            <Form.Item label={<span style={{ fontWeight: '500' }}>Percentage</span>} name='rollsPickPercentage' rules={[{ required: true, message: 'Enter Percentage' }]} initialValue={10}>
              <InputNumber style={{ width: '100%', minWidth: '250px' }} />
            </Form.Item>
          </ScxColumn>
          <ScxColumn xs={24} sm={4} md={4} lg={4} xl={4}>
            <ScxForm.Item label={<span style={{ fontWeight: '500' }}>Inspection Type</span>} name='rollSelectionType' rules={[{ required: true, message: 'Select Inspection Type' }]}>
              <Select filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '100%', minWidth: '250px' }} placeholder='Please Select'>
                {Object.keys(RollSelectionTypeEnum).map(inspectionType => {
                  return <Option value={RollSelectionTypeEnum[inspectionType]}>{RollSelectionTypeEnumDisplayValue[RollSelectionTypeEnum[inspectionType]]}</Option>
                })}
              </Select>
            </ScxForm.Item>
          </ScxColumn>
          <ScxColumn xs={24} sm={4} md={4} lg={4} xl={4}>
            <ScxForm.Item name={'remarks'} label="Remarks"
              rules={[{ required: false, message: 'Enter Remarks' }]}
            >
              <Input.TextArea placeholder="Remarks" />
            </ScxForm.Item>
          </ScxColumn>
          {/* </ScxRow> */}
          <ScxColumn xs={24} sm={4} md={4} lg={4} xl={4}>
            {/* <ScxRow justify='end'> */}
            <ScxForm.Item name={'remarks'} style={{ marginTop: '23px' }}>
              <ScxButton type="primary" onClick={saveSystemPreferences} disabled={inspectionPickSaveFlag}>
                Save Preference
              </ScxButton>
            </ScxForm.Item>
          </ScxColumn>
        </ScxRow>
      </ScxForm>
      {initialValues && <PKMSAllocationTabForm summeryDataRecord={summeryDataRecord} inspectionPickSaveFlag={inspectionPickSaveFlag} setInspectionPickSaveFlag={setInspectionPickSaveFlag} />}
    </ScxCard>
  </>
  )
}

export default InspectionPreference;