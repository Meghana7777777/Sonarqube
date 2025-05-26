import { ScanOutlined } from '@ant-design/icons';
import { InsBasicInspectionRequest, InsBasicInspectionRollDetails, InsFabricInspectionRequestCategoryEnum, InsInspectionFinalInSpectionStatusEnum, InsInspectionResultEnum, InsIrIdRequest, InsRollBarcodeInspCategoryReq } from '@xpparel/shared-models';
import { FabricInspectionCaptureService, FabricInspectionInfoService } from '@xpparel/shared-services';
import { Affix, Badge, Button, Col, Form, Input, Progress, Row, Select, Space } from 'antd';
import Search from 'antd/es/input/Search';
import 'html2canvas';
import 'jspdf-autotable';
import moment from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import { ScxCard } from 'packages/ui/src/schemax-component-lib';
import { useEffect, useRef, useState } from 'react';
import { AlertMessages } from '../../../../../common';
import { defaultDateFormat } from '../../../../../common/data-picker/date-picker';
import { InspectionAttributesInfo } from '../inspection-attributes-info';
import '../inspection-forms.css';
import { InspectionHeaderForm } from '../inspection-header-form';
import FourPointInspectionRollCapturingForm from './four-point-inspection-roll-caprturing';
export interface FourPointInspectionProps {
  inspReqId: number;
  reloadParent?: () => void;
  reload: number;

}
export const FourPointInspectionForm = (props: FourPointInspectionProps) => {
  const user = useAppSelector((state) => state.user.user.user);
  const [form] = Form.useForm();
  const [headerForm] = Form.useForm();

  const { inspReqId, reload } = props;
  const insCaptureService = new FabricInspectionCaptureService();
  const inspectionInfoService = new FabricInspectionInfoService();
  const [fourPointInspectionDetails, setFourPointInspectionDetails] = useState<InsBasicInspectionRequest>(null);
  const [inspCompPercentage, setInspCompPercentage] = useState<number>(0);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [stateCounter, setStateCounter] = useState<number>(0);
  const rollInputRef = useRef(null);
  const [barcodeVal, setBarcodeVal] = useState<string>();
  const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false)
  const { Option } = Select;


  useEffect(() => {
    inspReqId ? getFourPointInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, inspReqId, null) : null
    return (() => {
      setFourPointInspectionDetails(null);
    })
  }, [stateCounter, reload]);

  const getFourPointInspectionDetailsForRoll = (e) => {
    console.log(e);
    const rollBarcode = e;
    setBarcodeVal(rollBarcode);
    return getFourPointInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, null, rollBarcode);
  }

  const manualBarcode = (val: string) => {
    setManualBarcodeVal(val.trim());
    getFourPointInspectionDetailsForRoll(val.trim());
  }
  const getFourPointInspectionDetails = (unitCode: string, companyCode: string, userName: string, userId: number, inspReqId: number, rollBarcode: string) => {
    setLoading(true)
    if (inspReqId) {
      console.log('coming here');
      const reqObj = new InsIrIdRequest(userName, unitCode, companyCode, userId, inspReqId);
      inspectionInfoService.getInspectionDetailsForRequestId(reqObj, true).then((res) => {
        if (res.status) {
          modifyAndSetInspectionData(res.data.basicInsInfo);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
        setLoading(false)

      }).catch(err => console.log(err.message));
    } else if (rollBarcode) {
      const reqObj = new InsRollBarcodeInspCategoryReq(userName, unitCode, companyCode, userId, rollBarcode, InsFabricInspectionRequestCategoryEnum.INSPECTION);
      inspectionInfoService.getInspectionDetailForRollIdAndInspCategory(reqObj, true).then((res) => {
        if (res.status) {
          setBarcodeVal('');
          setManualBarcodeVal('');
          modifyAndSetInspectionData(res.data.basicInsInfo);
          form.resetFields();
          form.setFieldValue('inspectionRollDetails', res.data?.basicInsInfo?.inspectionRollDetails);

        } else {
          setBarcodeVal('');
          setManualBarcodeVal('');
          AlertMessages.getErrorMessage(res.internalMessage);
        }
        setLoading(false)
      }).catch(err => console.log(err.message));
    }
  }

  const modifyAndSetInspectionData = (inspDetails: InsBasicInspectionRequest) => {
    const inspectedDate: any = moment(inspDetails?.inspectionHeader?.inspectedDate);
    inspDetails.inspectionHeader.inspectedDate = inspDetails?.inspectionHeader?.inspectedDate ? inspectedDate : null;

    const expCompletedDate: any = moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt);
    inspDetails.inspectionHeader.expInspectionCompleteAt = inspDetails?.inspectionHeader?.expInspectionCompleteAt ? expCompletedDate : null;

    const startDate: any = moment(inspDetails?.inspectionHeader?.inspectionStart);
    inspDetails.inspectionHeader.inspectionStart = inspDetails?.inspectionHeader?.inspectionStart ? startDate : null;

    const completedDate: any = moment(inspDetails?.inspectionHeader?.inspectionCompleteAt);
    inspDetails.inspectionHeader.inspectionCompleteAt = inspDetails?.inspectionHeader?.inspectionCompleteAt ? completedDate : null;

    inspDetails.inspectionHeader.inspector = inspDetails.inspectionHeader.inspector ? inspDetails.inspectionHeader.inspector : user?.userName;
    setFourPointInspectionDetails(old => inspDetails);
    inspDetails?.inspectionHeader?.expInspectionCompleteAt ? setDaysRemaining(calculateDateDifference(new Date(), new Date(moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt).format(defaultDateFormat)))) : null;

    const totalNoOfRolls = inspDetails.inspectionRollDetails.length;
    const totalInspOpenRolls = inspDetails.inspectionRollDetails.filter(eachRoll => eachRoll.rollInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN);
    const totalInspRolls = totalNoOfRolls - totalInspOpenRolls.length;
    const percentage = Math.ceil((totalInspRolls / totalNoOfRolls) * 100);
    setInspCompPercentage(percentage);
  }

  const getInspectionResultDropDown = (selectedValue: InsInspectionResultEnum) => {
    return (
      <Select
        placeholder="Select inspection status"
        defaultValue={selectedValue}
        style={selectedValue == InsInspectionResultEnum.FAIL ? { background: 'red' } : {}}
      >
        {Object.values(InsInspectionResultEnum).map((status) => (
          <Option key={status} value={status}>
            {status}
          </Option>
        ))}
      </Select>
    );
  }

  function reloadParentAfterPassFail(isnStatus: InsInspectionFinalInSpectionStatusEnum) {
    if (props.reloadParent) {
      if (isnStatus == InsInspectionFinalInSpectionStatusEnum.PASS || isnStatus == InsInspectionFinalInSpectionStatusEnum.FAIL) {
        props.reloadParent();
      } else {
        setStateCounter(preVal => preVal + 1);
      }
    }
  }

  function validateRollLevelCapturings(rollsInfo: InsBasicInspectionRollDetails[]) {
    console.log(rollsInfo);
    rollsInfo.forEach(roll => {
      let anyRollConsidered = false;
      const atMetersSet = new Set<number>();
      roll.fourPointInspection?.forEach((r, index) => {
        anyRollConsidered = true;
        if (r.atMeter > roll.measuredRollLength) {
          AlertMessages.getWarningMessage('At meter ' + r.atMeter + ' cannot be greater than measured object length : ' + roll.externalRollNo + ' at Sno : ' + (index + 1));
          throw null;
        }

        if (atMetersSet.has(r.atMeter)) {
          AlertMessages.getWarningMessage('At meter ' + r.atMeter + ' cannot be duplicated for the object : ' + roll.externalRollNo + ' at Sno : ' + (index + 1));
          throw null;
        }
        atMetersSet.add(r.atMeter);
        if (Number(r.atMeter) <= 0) {
          AlertMessages.getWarningMessage('At meter cannot be 0 for the object : ' + roll.externalRollNo + ' at Sno : ' + (index + 1));
          throw null;
        }
        if (Number(r.reasonId) <= 0) {
          AlertMessages.getWarningMessage('Reason cannot be empty for the object : ' + roll.externalRollNo + ' at Sno : ' + (index + 1));
          throw null;
        }
        if (!r.pointPosition) {
          AlertMessages.getWarningMessage('Point position must be slected : ' + roll.externalRollNo + ' at Sno : ' + (index + 1));
          throw null;
        }
        if (Number(r.points) <= 0) {
          AlertMessages.getWarningMessage('Points cannot be 0 for the object : ' + roll.externalRollNo + ' at Sno : ' + (index + 1));
          throw null;
        }
      });
      if (anyRollConsidered) {
        if (!roll.rollInsResult) {
          AlertMessages.getWarningMessage('Select inspection status for the roll : ' + roll.externalRollNo);
          throw null;
        }
        if (Number(roll.measuredRollWidth) <= 0) {
          AlertMessages.getWarningMessage('Enter object width for the object : ' + roll.externalRollNo);
          throw null;
        }
        if (Number(roll.measuredRollLength) <= 0) {
          AlertMessages.getWarningMessage('Enter measured object length for the object : ' + roll.externalRollNo);
          throw null;
        }
      }
    });
  }

  const onFinish = (val: InsBasicInspectionRequest) => {
    try {

      if (val.inspectionHeader.inspectionStatus !== InsInspectionFinalInSpectionStatusEnum.OPEN) {
        // Check if completion date is present
        if (!val.inspectionHeader.inspectionCompleteAt) {
          AlertMessages.getErrorMessage('Please enter completion date before finalizing the inspection status.');
          return;
        }
        // Validate that all roll inspections are finalized
        for (const eachRoll of fourPointInspectionDetails.inspectionRollDetails) {
          if (eachRoll.rollFinalInsResult === InsInspectionFinalInSpectionStatusEnum.OPEN) {
            AlertMessages.getErrorMessage('All the objects should be final inspected to do the request inspection.');
            form.setFieldValue(['inspectionHeader', 'inspectionStatus'], InsInspectionFinalInSpectionStatusEnum.OPEN);
            return;
          }
        }
      } 

      if (val.inspectionHeader.inspectionStatus === InsInspectionFinalInSpectionStatusEnum.OPEN) {
        AlertMessages.getErrorMessage('Please fill Header info status.');
        return;
      }



      // OVERRIDE THE FORM GIVEN OBJECT WITH THE STATE VERSION OF OBJECT. SICNE THE VALUES IN THE STATE VERSION ARE MODIFIED IN THE CHILD COMPONENTS.
      // SINCE WE ARE PASSING A REF FROM PARENT->CHILD AND IN THE CHILD, WE R CREATING A MAP AND SETTING THE USER VALUES.
      // override all the values and create a new object
      val.inspectionRollDetails = fourPointInspectionDetails.inspectionRollDetails;


      // do all the validations for the roll level capturings
      validateRollLevelCapturings(val.inspectionRollDetails);
      const basicInsReq = new InsBasicInspectionRequest();
      basicInsReq.inspectionRollDetails = fourPointInspectionDetails.inspectionRollDetails;
      basicInsReq.inspectionHeader = val.inspectionHeader;
      basicInsReq.companyCode = user?.orgData?.companyCode;
      basicInsReq.unitCode = user?.orgData?.unitCode;
      basicInsReq.userName = user?.userName;
      // return;
      insCaptureService.captureInspectionResultsForBasicInspection(basicInsReq, false).then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          setFourPointInspectionDetails(undefined);
          headerForm.resetFields();
          reloadParentAfterPassFail(val.inspectionHeader.inspectionStatus);
          return;
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
          return;
        }
      }).catch(err => console.log(err.message));
    } catch (error) {
      return;
    }
  };

  const calculateDateDifference = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    // Convert input dates to Date objects if they are not already
    const startDate: any = new Date(date1);
    const endDate: any = new Date(date2);
    // Calculate the difference in days
    const timeDifference = endDate - startDate;
    const daysDifference = Math.round(timeDifference / oneDay);
    return daysDifference;
  }

  const onInspectionStatusChange = (e) => {
    if (!inspReqId) {
      AlertMessages.getErrorMessage('Request status cannot be changed with roll barcode scanning.');
      form.setFieldValue(['inspectionHeader', 'inspectionStatus'], InsInspectionFinalInSpectionStatusEnum.OPEN);
      return;
    }
    console.log(e);
    if (e != InsInspectionFinalInSpectionStatusEnum.OPEN) {
      // check all the inspection final results are inspected or not
      // NOTE HERE WE ARE SENDING THE REFERENCE VAR fourPointInspectionDetails THAT WE HAVE OVERRIDED IN THE INSPECTION FORM
      const rollInfo = fourPointInspectionDetails.inspectionRollDetails;
      console.log(rollInfo);
      for (const eachRoll of rollInfo) {
        if (eachRoll.rollFinalInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN) {
          AlertMessages.getErrorMessage('All the objects should be final inspected to do the request inspection.');
          form.setFieldValue(['inspectionHeader', 'inspectionStatus'], InsInspectionFinalInSpectionStatusEnum.OPEN);
          return;
        }
      }
      form.setFieldValue(['inspectionHeader', 'inspectionCompleteAt'], moment(new Date()));
    } else {
      form.setFieldValue(['inspectionHeader', 'inspectionCompleteAt'], null);
    }
  }


  return (


    <div >
      <>
        <ScxCard size='small' title={<span>Four Point Inspection</span>}>
          <Form form={headerForm} initialValues={fourPointInspectionDetails}>
            <Form.Item name="rollBarcode" label="Scan Object Barcode" rules={[{ required: false }]}>
              <Space>
                <Col>
                  <Input placeholder="Scan Object Barcode" ref={rollInputRef} value={barcodeVal} autoFocus onChange={(e) => getFourPointInspectionDetailsForRoll(e.target.value)} prefix={<ScanOutlined />} />
                </Col>
                <Col>
                  <Search loading={loading} placeholder="Type Object Barcode" defaultValue={manualBarcodeVal} onSearch={manualBarcode} enterButton />
                </Col>
              </Space>
            </Form.Item>
          </Form>
        </ScxCard>
      </>
      {fourPointInspectionDetails &&
        <ScxCard title={<span>Four Point Inspection</span>}
        >
          <Form form={form} onFinish={onFinish} initialValues={fourPointInspectionDetails}>
            <div id='fourpointinspId'>
              {/* <Row>
            <Col span={4}>
                <Image width={200} src={insProgress} />
            </Col>
            <Col span={20}>
              <InspectionAttributesInfo headerAttributes={shadeInspDetails?.inspectionHeader?.headerAttributes} />
            </Col>
          </Row> */}
              <InspectionAttributesInfo key={Date.now()} headerAttributes={fourPointInspectionDetails?.inspectionHeader?.headerAttributes} />
              <br />
              <Form.List name="inspectionHeader">
                {(fields, { add, remove }) => (
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ overflow: 'scroll' }}>
                    <Col lg={24} md={24} sm={24} xs={24}>
                      <Badge.Ribbon text={<span style={{ textAlign: "left" }}>Inspection request id: {fourPointInspectionDetails?.inspectionHeader?.inspectionReqId}</span>} color="red"  >
                        <ScxCard size='small' title={<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}><span style={{ width: "10%" }}>Header Info</span><span style={{ width: "10%" }}>Inspection type : <b>{fourPointInspectionDetails?.inspectionHeader?.inspRequestCategory}</b></span><Progress style={{ width: "10%" }} percent={inspCompPercentage} status="active" /></div>}>
                          <InspectionHeaderForm key={Date.now()} inspectionHeader={fourPointInspectionDetails?.inspectionHeader} noOfRolls={fourPointInspectionDetails?.inspectionRollDetails?.length} noOfInspectedRolls={fourPointInspectionDetails?.inspectionRollDetails?.length} daysRemainingDefault={daysRemaining} onInspectionStatusChange={onInspectionStatusChange} onReRequestCreateCheck={null} />
                        </ScxCard>
                      </Badge.Ribbon>
                    </Col>
                  </Row>
                )}
              </Form.List>
              <br />
              <ScxCard title={<span> Roll level inspection</span>}>
                <Form.List name="inspectionRollDetails">
                  {(fields, { add, remove }) => (
                    <>
                      <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                          <FourPointInspectionRollCapturingForm key={stateCounter} reloadParent={props.reloadParent} rollsInfo={fourPointInspectionDetails} />
                        </Col>
                      </Row>
                    </>
                  )}
                </Form.List>
              </ScxCard>
            </div>
            <Affix offsetBottom={0}>
              <div style={{ display: 'flex', justifyContent: 'space-around', margin: 20, padding: 20 }}>
                <Form.Item>
                  <Button type='primary' htmlType="submit">
                    Save Inspection
                  </Button>
                </Form.Item>
              </div>
            </Affix>
          </Form>
        </ScxCard >}

    </div >

  );
}

export default FourPointInspectionForm;
