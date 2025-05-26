import { ScanOutlined } from '@ant-design/icons';
import { InsBasicInspectionRequest, CommonRequestAttrs, InsInspectionFinalInSpectionStatusEnum, PKMSInsDetailsResponseDto, PKMSInsReqIdDto, PKMSIrActivityChangeRequest, PackActivityStatusEnum, PackFinalInspectionStatusEnum, cartonBarcodePatternRegExp, cartonBarcodeRegExp, InsInspectionActivityStatusEnum, PackFabricInspectionRequestCategoryEnum } from '@xpparel/shared-models';
import { FgInspectionCaptureService, FgInspectionInfoService, InspectionPreferenceService } from '@xpparel/shared-services';
import { Affix, Badge, Button, Col, Form, Input, Progress, Row, Space } from 'antd';
import Search from 'antd/es/input/Search';
import 'html2canvas';
import 'jspdf-autotable';
import moment from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { ScxCard } from 'packages/ui/src/schemax-component-lib';
import { useEffect, useRef, useState } from 'react';
import { PKMSInspectionAttributesInfo } from '../inspection-attributes-info';
import '../inspection-forms.css';
import { PKMSInspectionHeaderForm } from '../inspection-header-form';
import PKMSFourPointInspectionRollCapturingForm from './four-point-inspection-roll-caprturing';
export interface FourPointInspectionProps {
  inspReqId: number;
  reloadParent?: () => void;
  inspectionType:PackFabricInspectionRequestCategoryEnum,

}
export const PKMSFourPointInspectionForm = (props: FourPointInspectionProps) => {
  const user = useAppSelector((state) => state.user.user.user);
  const [form] = Form.useForm();
  const [headerForm] = Form.useForm();

  const { inspReqId } = props;
  const pkmsInspectionPreferenceService = new InspectionPreferenceService();
  const [fourPointInspectionDetails, setFourPointInspectionDetails] = useState<InsBasicInspectionRequest>(null);
  const [inspCompPercentage, setInspCompPercentage] = useState<number>(0);
  const [stateCounter, setStateCounter] = useState<number>(0);
  const rollInputRef = useRef(null);
  const [barcodeVal, setBarcodeVal] = useState<string>();
  const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false)
  const [insCartonsSummery, setInsCartonsSummery] = useState<PKMSInsDetailsResponseDto>();
  const [fileList, setFileList] = useState<any>()
  const fgInspectionInfoService=new FgInspectionInfoService();
  const fgInspectionCaptureService=new  FgInspectionCaptureService();


  useEffect(() => {
    getInsCartonsSummary();
  }, [inspReqId]);

  useEffect(() => {
    form.resetFields();
  }, [insCartonsSummery]);


  let timeOutId;
  const getInsCartonsSummaryInDebounce = (cartonNo: string) => {
    clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
      getInsCartonsSummary(cartonNo)
    }, 500)
  }

  const getInsCartonsSummary = (cartonNo?: string) => {
    const req = new PKMSInsReqIdDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, inspReqId, cartonNo);
    fgInspectionInfoService.getInsCartonsSummary(req).then(res => {
      if (res.status) {
        setStateCounter(stateCounter + 1)
        console.log("result dataaaa",res.data)
        setInsCartonsSummery(res.data);
        res.data.inspector = res.data.inspector ? res.data.inspector : user?.userName
        if (res.data?.insCompletedAt) {
          res.data.insCompletedAt = moment(res.data?.insCompletedAt) as any
        }
        if (res.data?.insStartedAt) {
          res.data.insStartedAt = moment(res.data?.insStartedAt) as any
        }

      } else {
        setInsCartonsSummery(null)
      }
    }).catch(err => console.log(err.message))
  };


  const saveInspectionDetails = (values) => {
    if (values.finalInspectionStatus !== InsInspectionFinalInSpectionStatusEnum.OPEN) {
      const insValidationWithInspectionResult = values.insCartons.find((rec) => rec.inspectionResult === PackFinalInspectionStatusEnum.OPEN);
      if (insValidationWithInspectionResult) {
        AlertMessages.getErrorMessage('Please Select All Cartons');
        return
      }
    }

    const formData = new FormData();
    delete values.document
    const userReq = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
    for (const files of values.insCartons) {
      if (files?.document?.file) {
        formData.append('document', files.document.file);
        delete files.document
      }
    } 

    formData.append('formValues', JSON.stringify({ ...values, ...userReq }))
    
    fgInspectionCaptureService.captureInspectionResultsForFg(formData).then(res => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        const req = new PKMSIrActivityChangeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, insCartonsSummery.insReqId, insCartonsSummery.insCompletedAt, InsInspectionActivityStatusEnum.COMPLETED, '');
        props.reloadParent();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch(err => console.log(err.message));
  }


  return (


    < div >
      <>
        <ScxCard size='small'>
          <Form form={headerForm} initialValues={fourPointInspectionDetails}>
            <Form.Item
              name="rollBarcode"
              label="Scan Carton Barcode"
              rules={[{
                required: false, pattern: new RegExp(cartonBarcodeRegExp),
                message: 'Please Provide Valid Carton Barcode'
              }]}

            >
              <Space>
                <Col>
                  <Input placeholder="Scan Carton Barcode"
                    ref={rollInputRef}
                    value={barcodeVal}
                    autoFocus

                    onChange={(v) => {
                      const pattern = cartonBarcodePatternRegExp;
                      if (pattern.test(v.target.value)) {
                        getInsCartonsSummaryInDebounce(v.target.value.trim())
                      }
                    }
                    }
                    prefix={<ScanOutlined />}
                  />
                </Col>
                <Col>
                  <Search
                    onChange={(v) => {
                      const pattern = cartonBarcodePatternRegExp;
                      if (pattern.test(v.target.value)) {
                        getInsCartonsSummaryInDebounce(v.target.value)
                      }
                    }}
                    loading={loading}
                    placeholder="Type Carton Barcode"
                    defaultValue={manualBarcodeVal}
                    enterButton
                  />
                </Col>
              </Space>
            </Form.Item>
          </Form>
        </ScxCard>
      </>
      {
        insCartonsSummery &&
        <ScxCard title={props.inspectionType === PackFabricInspectionRequestCategoryEnum.PRE_INSPECTION
          ? "PRE INSPECTION"
          : "POST INSPECTION"}
        >
          <Form form={form} initialValues={insCartonsSummery} onFinish={saveInspectionDetails}>
            <div id='fourpointinspId'>

              <PKMSInspectionAttributesInfo key={Date.now()} headerAttributes={insCartonsSummery.attributes} />
              <br />
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ overflow: 'scroll' }}>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Badge.Ribbon text={<span style={{ textAlign: "left" }}>Inspection request id: {insCartonsSummery?.insReqId}</span>} color="red"  >
                    <ScxCard size='small' title={<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}><span style={{ width: "10%" }}>Header Info</span><span style={{ width: "10%" }}>Inspection type : <b>{''}</b></span><Progress style={{ width: "10%" }} percent={inspCompPercentage} status="active" /></div>}>
                      <PKMSInspectionHeaderForm
                        key={Date.now()}
                        inspectionHeader={insCartonsSummery}
                        user={user}
                        setFileList={setFileList}
                        fileList={fileList}
                      />
                    </ScxCard>
                  </Badge.Ribbon>
                </Col>
              </Row>
              <br />
              <ScxCard title={<span> Carton level inspection</span>}>
                {insCartonsSummery.insCartons.length &&
                  <Form.List name="insCartons">
                    {(fields, { add, remove }) => (
                      <>
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                            <PKMSFourPointInspectionRollCapturingForm
                              cartons={insCartonsSummery.insCartons}
                              key={stateCounter}
                              reloadParent={props.reloadParent}
                              rollsInfo={fourPointInspectionDetails}
                            />
                          </Col>
                        </Row>
                      </>
                    )}
                  </Form.List>
                }

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
        </ScxCard >
      }

    </div >

  );
}

export default PKMSFourPointInspectionForm;
