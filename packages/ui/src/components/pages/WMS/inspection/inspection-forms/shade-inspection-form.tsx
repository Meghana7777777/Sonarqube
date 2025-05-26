import { ScanOutlined } from '@ant-design/icons';

import { InsCommonInspectionHeaderInfo, InsFabricInspectionRequestCategoryEnum, InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, InsInspectionStatusEnum, InsIrIdRequest, InsRollBarcodeInspCategoryReq, InsShadeInspectionRequest, InsShadeInspectionRollDetails, InsShadeLevelAbstractInfoModel } from '@xpparel/shared-models';
import { FabricInspectionCaptureService, FabricInspectionInfoService } from '@xpparel/shared-services';
import { Affix, Badge, Button, Col, Form, Input, Progress, Row, Select, Space, Table } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from "antd/lib/table";
import 'jspdf-autotable';
import moment from 'moment';
import { useAppSelector } from "packages/ui/src/common";
import { ScxCard } from 'packages/ui/src/schemax-component-lib';
import { useEffect, useRef, useState } from 'react';
import { AlertMessages } from '../../../../common';
import { defaultDateFormat } from '../../../../common/data-picker/date-picker';
import { InspectionAttributesInfo } from './inspection-attributes-info';
import './inspection-forms.css';
import { InspectionHeaderForm } from './inspection-header-form';
const { Option } = Select;


export interface ShadeInspectionProps {
  inspReqId: number;
  reloadParent?: () => void;
  reload: number;
}
export const ShadeInspectionForm = (props: ShadeInspectionProps) => {
  console.log('shade form', props);
  const user = useAppSelector((state) => state.user.user.user);
  const [form] = Form.useForm();
  const { inspReqId, reload } = props;
  const insCaptureService = new FabricInspectionCaptureService()
  const inspectionInfoService = new FabricInspectionInfoService()
  const [shadeInspDetails, setShadeInspectionDetails] = useState<InsShadeInspectionRequest>(null);
  const [inspectionStatus, setInspectionStatus] = useState<InsInspectionFinalInSpectionStatusEnum>(InsInspectionFinalInSpectionStatusEnum.OPEN);
  const [inspCompPercentage, setInspCompPercentage] = useState<number>(0);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [stateCounter, setStateCounter] = useState<number>(0);
  const rollInputRef = useRef(null);
  const [barcodeVal, setBarcodeVal] = useState<string>();
  const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
  const [headerForm] = Form.useForm();

  useEffect(() => {
    console.log(inspReqId);
    inspReqId ? getShadeLevelInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, inspReqId, null) : null
  }, [stateCounter, reload]);



  const getShadeLevelInspDetailsByRollBarcode = (e) => {
    console.log(e);
    const rollBarcode = e;
    return getShadeLevelInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, null, rollBarcode);
  }

  const manualBarcode = (val: string) => {
    setManualBarcodeVal(val.trim());
    getShadeLevelInspDetailsByRollBarcode(val.trim());
  }

  const getShadeLevelInspectionDetails = (unitCode: string, companyCode: string, userName: string, userId: number, inspReqId: number, rollBarcode: string) => {
    if (inspReqId) {
      console.log('coming here');
      const reqObj = new InsIrIdRequest(userName, unitCode, companyCode, userId, inspReqId);
      inspectionInfoService.getInspectionDetailsForRequestId(reqObj, true).then((res) => {
        if (res.status) {
          setInspectionData(res.data.shadeInsInfo);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      }).catch(err => console.log(err.message));
    }
    if (rollBarcode) {
      const reqObj = new InsRollBarcodeInspCategoryReq(userName, unitCode, companyCode, userId, rollBarcode, InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION);
      inspectionInfoService.getInspectionDetailForRollIdAndInspCategory(reqObj, true).then((res) => {
        if (res.status) {
          setBarcodeVal('');
          setManualBarcodeVal('');
          setInspectionData(res.data.shadeInsInfo);
          form.resetFields();
          form.setFieldValue('inspectionRollDetails', res.data?.shadeInsInfo?.inspectionRollDetails);

        } else {
          setBarcodeVal('');
          setManualBarcodeVal('');
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      }).catch(err => console.log(err.message));
    }
  }

  const setInspectionData = (inspData: InsShadeInspectionRequest) => {
    const inspectedDate: any = moment(inspData.inspectionHeader?.inspectedDate);
    inspData.inspectionHeader.inspectedDate = inspData.inspectionHeader?.inspectedDate ? inspectedDate : null;

    const expCompletedDate: any = moment(inspData?.inspectionHeader?.expInspectionCompleteAt);
    inspData.inspectionHeader.expInspectionCompleteAt = inspData?.inspectionHeader?.expInspectionCompleteAt ? expCompletedDate : null;;

    const startDate: any = moment(inspData.inspectionHeader?.inspectionStart);
    inspData.inspectionHeader.inspectionStart = inspData.inspectionHeader?.inspectionStart ? startDate : null;

    const completedDate: any = moment(inspData.inspectionHeader?.inspectionCompleteAt);
    inspData.inspectionHeader.inspectionCompleteAt = inspData.inspectionHeader?.inspectionCompleteAt ? completedDate : null;

    inspData.inspectionHeader.inspector = inspData.inspectionHeader.inspector ? inspData.inspectionHeader.inspector : user?.userName;

    setShadeInspectionDetails(inspData);
    setDaysRemaining(calculateDateDifference(new Date(), new Date(moment(inspData.inspectionHeader?.expInspectionCompleteAt).format(defaultDateFormat))));

    const totalNoOfRolls = inspData.inspectionRollDetails.length;
    const totalInspOpenRolls = inspData.inspectionRollDetails.filter(eachRoll => eachRoll.inspectionStatus == InsInspectionActivityStatusEnum.OPEN);
    const totalInspRolls = totalNoOfRolls - totalInspOpenRolls.length;
    const percentage = Math.ceil((totalInspRolls / totalNoOfRolls) * 100);
    setInspCompPercentage(percentage);
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

  const onFinish = (val: InsShadeInspectionRequest) => {
    if (val.inspectionHeader.inspectionStatus != InsInspectionFinalInSpectionStatusEnum.OPEN) {
      if (!val.inspectionHeader.inspectionCompleteAt) {
        AlertMessages.getErrorMessage('Please enter completion date before finalizing the inspection status.');
        return;
      }
      // for (const eachRoll of val.inspectionRollDetails) {
      //   if (!eachRoll.shade) {
      //     AlertMessages.getErrorMessage('Still some roll not yet inspected. Please verify.');

      //     return;
      //   }
      // } 

      const isValid = validateRollShadeFields(val.inspectionRollDetails)
      if (!isValid) {
        return;
      }
    }
    if (val.inspectionHeader.inspectionStatus === InsInspectionFinalInSpectionStatusEnum.OPEN) {
      AlertMessages.getErrorMessage('Final Inspection Status Should Not be Open. Please verify.');
      return;
    }


    insCaptureService.captureInspectionResultsForLabShade(val, false).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        setShadeInspectionDetails(undefined);
        headerForm.resetFields();
        reloadParentAfterPassFail(val.inspectionHeader.inspectionStatus);
        return;
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
        return;
      }
    }).catch(err => console.log(err.message));

  };

  const validateRollShadeFields = async (inspectionRollDetails: InsShadeInspectionRollDetails[]) => {
    for (const row of inspectionRollDetails) {
      if (!row.shade || row.shade.trim() === '' || row.rollFinalInsResult === InsInspectionFinalInSpectionStatusEnum.OPEN) {
        AlertMessages.getErrorMessage(`Roll ${row.rollId} not yet inspected. Please verify.`);
        return false; 
      }
    }
    return true;
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


  const getShadeLevelAbsComp = (shadeInfo: InsShadeLevelAbstractInfoModel[]) => {
    const columns: ColumnsType<any> = [
      {
        title: <span>Shade</span>,
        dataIndex: 'shade',
        fixed: 'left',
        render: (text, record) => {
          return {
            children: <div>{text}</div>
          };
        }
      },
      {
        title: <span>No of rolls</span>,
        dataIndex: 'noOfRolls',
        fixed: 'left',
        render: (text, record) => {
          return {
            children: <div>{text}</div>
          };
        }
      },
      {
        title: <span>Quantity</span>,
        dataIndex: 'quantity',
        fixed: 'left',
        render: (text, record) => {
          return {
            children: <div>{Number(text).toFixed(2)}</div>
          };
        }
      },
    ]
    return <Table
      id="predictionTableS"
      size='small'
      rowKey={(record) => record.operation}
      columns={columns}
      dataSource={shadeInfo}
      pagination={false}
      bordered
    // style={
    //   { height: "140px" }
    // }
    />
  };

  const shadeLevelAbstractInfo: InsShadeLevelAbstractInfoModel[] = [];
  const shadeRollQtyMap = new Map<string, Map<number, number>>();
  shadeInspDetails?.inspectionRollDetails?.forEach((eachRoll) => {
    if (eachRoll.shade) {
      if (!shadeRollQtyMap.has(eachRoll.shade)) {
        shadeRollQtyMap.set(eachRoll.shade, new Map<number, number>());
      }
      if (!shadeRollQtyMap.get(eachRoll.shade).has(eachRoll.rollId)) {
        shadeRollQtyMap.get(eachRoll.shade).set(eachRoll.rollId, eachRoll.rollQty)
      }
    }
  });
  shadeRollQtyMap?.forEach((shadeLevelInfo, eachShade) => {
    const shadeInfo = new InsShadeLevelAbstractInfoModel();
    shadeInfo.shade = eachShade;
    shadeInfo.noOfRolls = shadeLevelInfo.size;
    let qtySum = 0;
    shadeLevelInfo.forEach((qty, rollNo) => {
      qtySum += Number(qty);
    })
    shadeInfo.quantity = qtySum;
    shadeLevelAbstractInfo.push(shadeInfo);
  });

  const onStatusChange = (e) => {
    const completionDate = form.getFieldValue('inspectionHeader').inspectionCompleteAt;
    if (e != InsInspectionFinalInSpectionStatusEnum.OPEN) {
      if (!completionDate) {

        const preFieldValues: InsCommonInspectionHeaderInfo = form.getFieldValue('inspectionHeader');
        preFieldValues.inspectionStatus = InsInspectionFinalInSpectionStatusEnum.OPEN;
        console.log(preFieldValues);
        form.setFieldsValue({
          inspectionHeader: { ...preFieldValues }
        });
      }
    };

  };

  const onRollInspectionStatusChange = (name: string, index: number) => {
    if (name == 'rollFinalInsResult') {
      const rollInfo = form.getFieldValue('inspectionRollDetails');
      for (const eachRoll of rollInfo) {
        if (eachRoll.rollInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN) {
          AlertMessages.getErrorMessage('All the rolls should be inspected to do the final inspection.');
          form.setFieldValue(['inspectionRollDetails', index, 'rollFinalInsResult'], InsInspectionFinalInSpectionStatusEnum.OPEN);
          return;
        }
      }
    } else {
      const shade = form.getFieldValue(['inspectionRollDetails', index, 'shade']);
      if (!shade) {
        AlertMessages.getErrorMessage('Please enter the Shade to give the inspection result.');
        form.setFieldValue(['inspectionRollDetails', index, 'rollInsResult'], InsInspectionFinalInSpectionStatusEnum.OPEN)
      }
    }
  }

  const getInspectionResultDropDown = (selectedValue: InsInspectionFinalInSpectionStatusEnum, index, name: string) => {
    console.log('coming here');
    // disable logic
    return (
      <Select size='small'
        placeholder="Select inspection status"
        defaultValue={selectedValue}
        style={{ width: '100%' }}
        onChange={() => onRollInspectionStatusChange(name, index)}
      // style={selectedValue == InsInspectionFinalInSpectionStatusEnum.FAIL ? {background: 'red' }: { } }
      >
        {Object.values(InsInspectionFinalInSpectionStatusEnum).map((status) => (
          <Option key={status} value={status} >
            {status}
          </Option>
        ))}
      </Select>
    );
  }
  const handleInspectionDropdownChange = (value) => {
    shadeInspDetails?.inspectionRollDetails.map((rec, index) => {
      form.setFields([
        {
          name: ['inspectionRollDetails', index, "rollInsResult"],
          value: value
        }
      ])
    })
  };
  const handleFinalInspectionDropdownChange = (value) => {
    shadeInspDetails?.inspectionRollDetails.map((rec, index) => {
      form.setFields([
        {
          name: ['inspectionRollDetails', index, "rollFinalInsResult"],
          value: value
        }
      ])
    })
  };

  const getRollLevelInspectionFormTable = (inspectionRollDetails: InsShadeInspectionRollDetails[]) => {
    const columns: any[] = [
      {
        title: <span>Roll id</span>,
        dataIndex: 'rollId',
        key: 'rollId',
        // render: (text: string, record: { [key: string]: any }, index: number) => (
        //   <Form.Item noStyle name={[index, 'rollId']} initialValue={text}>
        //     <Input readOnly />
        //   </Form.Item>
        // ),
      },
      {
        title: <span>Barcode</span>,
        dataIndex: 'barcode',
        key: 'barcode',
        // render: (text: string, record: { [key: string]: any }, index: number) => (
        //   <Form.Item noStyle name={[index, 'barcode']} initialValue={text}>
        //     <Input readOnly />
        //   </Form.Item>
        // ),
      },
      {
        title: <span>Lot number</span>,
        dataIndex: 'lotNumber',
        key: 'lotNumber',
        // render: (text: string, record: { [key: string]: any }, index: number) => (
        //   <Form.Item noStyle name={[index, 'lotNumber']} initialValue={text}>
        //     <Input readOnly />
        //   </Form.Item>
        // ),
      },
      {
        title: <span>Roll qty</span>,
        dataIndex: 'rollQty',
        key: 'rollQty',
        // render: (text: string, record: { [key: string]: any }, index: number) => (
        //   <Form.Item noStyle name={[index, 'rollQty']} initialValue={text}>
        //     <Input readOnly />
        //   </Form.Item>
        // ),
      },
      {
        title: <span>Roll no</span>,
        dataIndex: 'externalRollNo',
        key: 'externalRollNo',
        // render: (text: string, record: { [key: string]: any }, index: number) => (
        //   <Form.Item noStyle name={[index, 'externalRollNo']} initialValue={text}>
        //     <Input readOnly />
        //   </Form.Item>
        // ),
      },
      {
        title: <span>Shade</span>,
        dataIndex: 'shade',
        key: 'shade',
        width: '15%',
        render: (text: string, record: { [key: string]: any }, index: number) => (
          <Form.Item noStyle name={[index, 'shade']} initialValue={text}>
            <Input />
          </Form.Item>
        ),
      },
      {
        title: <> <span className='required-field'>Inspection result</span>
          <Form.Item name='inspectionResult'   >
            <Select
              size='small'
              placeholder="Set status for all"
              style={{ marginLeft: 8, width: 150 }}
              onChange={handleInspectionDropdownChange}
              value={inspectionStatus}
            >
              {Object.values(InsInspectionFinalInSpectionStatusEnum).map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item></>,
        dataIndex: 'inspectionResult',
        key: 'inspectionResult',
        width: '10%',
        render: (text: InsInspectionFinalInSpectionStatusEnum, record: { [key: string]: any }, index: number) => (
          <Form.Item noStyle name={[index, 'rollInsResult']} initialValue={text}>
            {getInspectionResultDropDown(text, index, 'rollInsResult')}
          </Form.Item>
        ),
      },
      {
        title: <><span className='required-field'>Final Inspection result</span>
          <Form.Item name='finalInspectionResult'>
            <Select
              size='small'
              placeholder='set status for all'
              style={{ marginLeft: 8, width: 150 }}
              onChange={handleFinalInspectionDropdownChange}
              value={inspectionStatus}
            >
              {Object.values(InsInspectionFinalInSpectionStatusEnum).map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}

            </Select>
          </Form.Item></>,
        dataIndex: 'inspectionResult',
        key: 'inspectionResult',
        width: '10%',
        render: (text: InsInspectionFinalInSpectionStatusEnum, record: { [key: string]: any }, index: number) => (
          <Form.Item noStyle name={[index, 'rollFinalInsResult']} initialValue={text}>
            {getInspectionResultDropDown(text, index, 'rollFinalInsResult')}
          </Form.Item>
        ),
      },
      {
        title: <span>Remarks</span>,
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text: string, record: { [key: string]: any }, index: number) => (
          <Form.Item noStyle name={[index, 'remarks']} initialValue={text}>
            <Input />
          </Form.Item>
        ),
      }
    ];

    return <Table
      size='small'
      dataSource={inspectionRollDetails}
      columns={columns}
      pagination={false}
      bordered={true}
      scroll={{ x: 'max-content' }}
    />
  };

  const onInspectionStatusChange = (e) => {
    if (!inspReqId) {
      AlertMessages.getErrorMessage('Request status cannot be changed with roll barcode scanning.');
      form.setFieldValue(['inspectionHeader', 'inspectionStatus'], InsInspectionFinalInSpectionStatusEnum.OPEN);
      return;
    }
    console.log(e);
    if (e != InsInspectionFinalInSpectionStatusEnum.OPEN) {
      // check all the inspection final results are inspected or not
      const rollInfo = form.getFieldValue('inspectionRollDetails');
      // console.log("fffffffffffffffrollsinfo",rollInfo);
      for (const eachRoll of rollInfo) {
        if (eachRoll.rollFinalInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN) {
          AlertMessages.getErrorMessage('All the rolls should be final inspected to do the request inspection.');
          form.setFieldValue(['inspectionHeader', 'inspectionStatus'], InsInspectionFinalInSpectionStatusEnum.OPEN);
          return;
        }
      }
      form.setFieldValue(['inspectionHeader', 'inspectionCompleteAt'], moment(new Date()));
    } else {
      form.setFieldValue(['inspectionHeader', 'inspectionCompleteAt'], null);
    }
  }


  const getInspectionStatusDropDown = (selectedValue: InsInspectionFinalInSpectionStatusEnum) => {
    return (
      <Select
        placeholder="Select inspection status"
        defaultValue={selectedValue}
        onChange={onStatusChange}

      >
        {Object.values(InsInspectionFinalInSpectionStatusEnum).map((status) => (
          <Option key={status} value={status}>
            {status}
          </Option>
        ))}
      </Select>
    );
  }
  return (
    <div>
      <>
        <ScxCard size='small' title={<span>Shade Inspection</span>}>
          <Form form={form} initialValues={shadeInspDetails}>
            <Form.Item name="rollBarcode" label="Scan Object Barcode" rules={[{ required: false }]}>
              <Space>
                <Col>
                  <Input placeholder="Scan Object Barcode" value={barcodeVal} autoFocus onChange={(e) => getShadeLevelInspDetailsByRollBarcode(e.target.value)} prefix={<ScanOutlined />} />
                </Col>
                <Col>
                  <Search placeholder="Type Object Barcode" defaultValue={manualBarcodeVal} onSearch={manualBarcode} enterButton />
                </Col>
              </Space>
            </Form.Item>
          </Form>
        </ScxCard>
      </>
      {shadeInspDetails &&
        <ScxCard title={<span>Shade Segregation Inspection</span>} size='small' >
          <Form form={form} onFinish={onFinish} layout="vertical" initialValues={shadeInspDetails}>
            {/* <Row>
            <Col span={4}>
                <Image width={200} src={insProgress} />
            </Col>
            <Col span={20}>
              <InspectionAttributesInfo headerAttributes={shadeInspDetails?.inspectionHeader?.headerAttributes} />
            </Col>
          </Row> */}
            <InspectionAttributesInfo headerAttributes={shadeInspDetails?.inspectionHeader?.headerAttributes} />
            <br />
            <Form.List name="inspectionHeader">
              {(fields, { add, remove }) => (
                <Row>
                  <Col lg={18} md={20} sm={24} xs={24}>
                    <Badge.Ribbon text={<span style={{ textAlign: "left" }}>Inspection request id: {shadeInspDetails?.inspectionHeader?.inspectionReqId}</span>} color="red"  >
                      <ScxCard size='small' title={<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}><span style={{ width: "10%" }}>Header info</span><span style={{ width: "10%" }}>Inpsection type: <b>{shadeInspDetails?.inspectionHeader?.inspRequestCategory}</b></span><Progress style={{ width: "10%" }} percent={inspCompPercentage} status="active" /></div>}>
                        <InspectionHeaderForm inspectionHeader={shadeInspDetails?.inspectionHeader} noOfRolls={shadeInspDetails?.inspectionRollDetails?.length} noOfInspectedRolls={shadeInspDetails?.inspectionRollDetails?.length} daysRemainingDefault={daysRemaining ? daysRemaining : 0} onInspectionStatusChange={onInspectionStatusChange} onReRequestCreateCheck={null} />

                      </ScxCard>
                    </Badge.Ribbon>
                  </Col>
                  <Col lg={6} md={8} sm={12} xs={18}>
                    <ScxCard title={<span>Shade level abstract</span>} size='small'>
                      {getShadeLevelAbsComp(shadeLevelAbstractInfo)}
                    </ScxCard>
                  </Col>
                </Row>
              )}
            </Form.List>
            <br />
            <ScxCard size='small' title={<span> Roll level inspection</span>}>
              <Form.List name="inspectionRollDetails">
                {(fields, { add, remove }) => (
                  <>
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        {getRollLevelInspectionFormTable(shadeInspDetails?.inspectionRollDetails)}
                      </Col>
                    </Row>
                  </>
                )}
              </Form.List>
            </ScxCard>
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

export default ShadeInspectionForm;
