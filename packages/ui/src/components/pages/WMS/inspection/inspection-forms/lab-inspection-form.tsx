import Icon, { ScanOutlined } from '@ant-design/icons';
import { AdjustmentType, InsCommonInspectionHeaderInfo, InsFabricInspectionRequestCategoryEnum, InsInspectionFinalInSpectionStatusEnum, InsIrIdRequest, InsLabInspectionRequest, InsLabInspectionRollDetails, InsRollBarcodeInspCategoryReq, InsShadeLevelAbstractInfoModel } from '@xpparel/shared-models';
import { FabricInspectionCaptureService, FabricInspectionInfoService } from '@xpparel/shared-services';
import { Affix, Badge, Button, Col, Form, Input, Progress, Radio, Row, Select, Space, Table } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from "antd/lib/table";
import moment from 'moment';
import { useAppSelector } from "packages/ui/src/common";
import { ScxCard } from 'packages/ui/src/schemax-component-lib';
import { useEffect, useRef, useState } from 'react';
import { AlertMessages } from '../../../../common';
import { defaultDateFormat } from '../../../../common/data-picker/date-picker';
import { ReactComponent as minusIcon } from '../../../../common/images/minus.svg';
import { ReactComponent as plusIcon } from '../../../../common/images/plus.svg';
import { InspectionAttributesInfo } from './inspection-attributes-info';
import './inspection-forms.css';
import { InspectionHeaderForm } from './inspection-header-form';
import { each } from 'highcharts';


const { Option } = Select;


export interface LabInspectionProps {
  inspReqId: number;
  reloadParent?: () => void;
  reload: number;
}
export const LabInspectionForm = (props: LabInspectionProps) => {
  const user = useAppSelector((state) => state.user.user.user);
  console.log(user);
  const [form] = Form.useForm();
  const [headerForm] = Form.useForm();
  const { inspReqId, reload } = props;
  const insCaptureService = new FabricInspectionCaptureService();
  const inspectionInfoService = new FabricInspectionInfoService();
  const [labInspDetails, setLabInspectionDetails] = useState<InsLabInspectionRequest>(null);
  const [inspectionStatus, setInspectionStatus] = useState<InsInspectionFinalInSpectionStatusEnum>(InsInspectionFinalInSpectionStatusEnum.OPEN);
  const [inspCompPercentage, setInspCompPercentage] = useState<number>(0);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [finalInspDropDownDisable, setFinalInspDropDownDisable] = useState<boolean>(false);
  const [stateCounter, setStateCounter] = useState<number>(0);
  const rollInputRef = useRef(null);
  const [barcodeVal, setBarcodeVal] = useState<string>();
  const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();

  useEffect(() => {
    console.log(inspReqId);
    inspReqId ? getLabInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, inspReqId, null) : null
  }, [stateCounter, reload]);

  const getLabInspDetailsByRollBarcode = (e) => {
    console.log(e);
    const rollBarcode = e;
    return getLabInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, null, rollBarcode);
  }

  const manualBarcode = (val: string) => {
    setManualBarcodeVal(val.trim());
    getLabInspDetailsByRollBarcode(val.trim());
  }

  const getLabInspectionDetails = (unitCode: string, companyCode: string, userName: string, userId: number, inspReqId: number, rollBarcode: string) => {
    if (inspReqId) {
      const reqObj = new InsIrIdRequest(userName, unitCode, companyCode, userId, inspReqId);
      inspectionInfoService.getInspectionDetailsForRequestId(reqObj, true).then((res) => {
        if (res.status) {
          setLabInspDetails(res.data.labInsInfo)
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      }).catch(err => console.log(err.message));
    }
    if (rollBarcode) {
      const reqObj = new InsRollBarcodeInspCategoryReq(userName, unitCode, companyCode, userId, rollBarcode, InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION);
      inspectionInfoService.getInspectionDetailForRollIdAndInspCategory(reqObj, true).then((res) => {
        if (res.status) {
          setBarcodeVal('');
          setManualBarcodeVal('');
          setLabInspDetails(res.data.labInsInfo)
          form.resetFields();
          form.setFieldValue('inspectionRollDetails', res.data?.labInsInfo?.inspectionRollDetails);
        } else {
          setBarcodeVal('');
          setManualBarcodeVal('');
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      }).catch(err => console.log(err.message));
    }

  }

  const setLabInspDetails = (inspDetails: InsLabInspectionRequest) => {
    const inspectedDate: any = moment(inspDetails?.inspectionHeader?.inspectedDate);
    inspDetails.inspectionHeader.inspectedDate = inspDetails?.inspectionHeader?.inspectedDate ? inspectedDate : null;

    const expCompletedDate: any = moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt);
    inspDetails.inspectionHeader.expInspectionCompleteAt = inspDetails?.inspectionHeader?.expInspectionCompleteAt ? expCompletedDate : null;

    const startDate: any = moment(inspDetails?.inspectionHeader?.inspectionStart);
    inspDetails.inspectionHeader.inspectionStart = inspDetails?.inspectionHeader?.inspectionStart ? startDate : null;

    const completedDate: any = moment(inspDetails?.inspectionHeader?.inspectionCompleteAt);
    inspDetails.inspectionHeader.inspectionCompleteAt = inspDetails?.inspectionHeader?.inspectionCompleteAt ? completedDate : null;

    inspDetails.inspectionHeader.inspector = inspDetails.inspectionHeader.inspector ? inspDetails.inspectionHeader.inspector : user?.userName;

    setLabInspectionDetails(inspDetails);

    inspDetails?.inspectionHeader?.expInspectionCompleteAt ? setDaysRemaining(calculateDateDifference(new Date(), new Date(moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt).format(defaultDateFormat)))) : null;
  }

  const onInspectionStatusChange = (e) => {
    console.log(e);
    if (!inspReqId) {
      AlertMessages.getErrorMessage('Request status cannot be changed with roll barcode scanning.');
      form.setFieldValue(['inspectionHeader', 'inspectionStatus'], InsInspectionFinalInSpectionStatusEnum.OPEN);
      return false;
    }
    if (e != InsInspectionFinalInSpectionStatusEnum.OPEN) {
      // check all the inspection final results are inspected or not
      const rollInfo = form.getFieldValue('inspectionRollDetails');
      console.log(rollInfo);
      for (const eachRoll of rollInfo) {
        if (eachRoll.rollFinalInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN) {
          AlertMessages.getErrorMessage('All the rolls should be final inspected to do the request inspection.');
          form.setFieldValue(['inspectionHeader', 'inspectionStatus'], InsInspectionFinalInSpectionStatusEnum.OPEN);
          return false;
        }
      }
      form.setFieldValue(['inspectionHeader', 'inspectionCompleteAt'], moment(new Date()));
    } else {
      form.setFieldValue(['inspectionHeader', 'inspectionCompleteAt'], null);
    }
    return true;
  }

  const onRollInspectionStatusChange = (name: string, index: number) => {
    if (name == 'rollFinalInsResult') {
      const rollInfo = form.getFieldValue('inspectionRollDetails');
      for (const eachRoll of rollInfo) {
        if (eachRoll.rollInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN) {
          AlertMessages.getErrorMessage('All the Objects should be inspected to do the final inspection.');
          form.setFieldValue(['inspectionRollDetails', index, 'rollFinalInsResult'], InsInspectionFinalInSpectionStatusEnum.OPEN);
          return;
        }
        if (eachRoll.rollFinalInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN) {
          form.setFieldValue(['inspectionHeader', 'inspectionStatus'], InsInspectionFinalInSpectionStatusEnum.OPEN);
          // form.setFieldValue(['inspectionHeader','createReRequest'], false);
        }
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

  function reloadParentAfterPassFail(isnStatus: InsInspectionFinalInSpectionStatusEnum) {
    if (props.reloadParent) {
      if (isnStatus == InsInspectionFinalInSpectionStatusEnum.PASS || isnStatus == InsInspectionFinalInSpectionStatusEnum.FAIL) {
        props.reloadParent();
      } else {
        setStateCounter(preVal => preVal + 1);
      }
    }
  }

  const onFinish = async (val: InsLabInspectionRequest) => {
    console.log(val);
    if (val.inspectionHeader.createReRequest) {
      if (val.inspectionHeader.inspectionStatus != InsInspectionFinalInSpectionStatusEnum.FAIL) {
        AlertMessages.getErrorMessage('You cannot do RE Request for the not failed requests');
        return;
      }
    }
    if (val.inspectionHeader.inspectionStatus != InsInspectionFinalInSpectionStatusEnum.OPEN) {
      if (!val.inspectionHeader.inspectionCompleteAt) {
        AlertMessages.getErrorMessage('Please enter completion date before finalizing the inspection status.');
        return;
      }
      const isValid = await validateRollDetailsFields(val.inspectionRollDetails);
      if (!isValid) {
        return;
      }

      for (const eachRoll of val.inspectionRollDetails) {
        if (eachRoll.gsm === 0 || eachRoll.gsm === null || eachRoll.toleranceFrom == 0 || eachRoll.toleranceTo == 0) {
          AlertMessages.getErrorMessage('Still some Objects not yet inspected. Please verify.');
          return;
        }
      }
    }
    if (val.inspectionHeader.inspectionStatus === InsInspectionFinalInSpectionStatusEnum.OPEN) {
      AlertMessages.getErrorMessage('Final Inspection Status Should Not be Open. Please verify.');
      return;
    }

    insCaptureService.captureInspectionResultsForLabInspection(val, false).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        setLabInspectionDetails(undefined);
        headerForm.resetFields();
        reloadParentAfterPassFail(val.inspectionHeader.inspectionStatus);
        return;
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
        return;
      }
    }).catch(err => console.log(err.message));
  };


  const validateRollDetailsFields = async (inspectionRollDetails: InsLabInspectionRollDetails[]) => {
    const incompleteRows = inspectionRollDetails
      .map((row, index) => {
        const missingFields = [];
        if (row.gsm === undefined || row.gsm === null || row.gsm === 0) {
          missingFields.push('GSM');
        }
        if (row.toleranceFrom === undefined || row.toleranceFrom === null || row.toleranceFrom === 0) {
          missingFields.push('Tolerance From');
        }
        if (row.toleranceTo === undefined || row.toleranceTo === null || row.toleranceTo === 0) {
          missingFields.push('Tolerance To');
        }

        if (missingFields.length > 0) {
          return `Row ${index + 1}: ${missingFields.join(', ')}`;
        }
        return null;
      })
      .filter(Boolean);

    if (incompleteRows.length > 0) {
      AlertMessages.getErrorMessage(
        `Please fill all required fields.\n\nMissing fields:\n${incompleteRows.join('\n')}`
      );
      return false; // Validation failed
    }

    return true; // Validation passed
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


  const getResultAbsComp = (labInfo: InsShadeLevelAbstractInfoModel[]) => {
    const columns: ColumnsType<any> = [
      {
        title: <span>Inspection result</span>,
        dataIndex: 'shade',
        fixed: 'left',
        render: (text, record) => {
          return {
            children: <>{text}</>
          };
        }
      },
      {
        title: <span>No of Objects</span>,
        dataIndex: 'noOfRolls',
        fixed: 'left',
        render: (text, record) => {
          return {
            children: <>{text}</>
          };
        }
      },
      {
        title: <span>Quantity</span>,
        dataIndex: 'quantity',
        fixed: 'left',
        render: (text, record) => {
          return {
            children: <div>{Math.ceil(text)}</div>
          };
        }
      },
    ]
    return <Table
      id="predictionTableS"
      size='small'
      rowKey={(record) => record.operation}
      columns={columns}
      dataSource={labInfo}
      pagination={false}
      bordered
    />
  };

  const shadeLevelAbstractInfo: InsShadeLevelAbstractInfoModel[] = [];
  const shadeRollQtyMap = new Map<InsInspectionFinalInSpectionStatusEnum, Map<number, number>>();
  labInspDetails?.inspectionRollDetails?.forEach((eachRoll) => {
    if (eachRoll.gsm) {
      if (!shadeRollQtyMap.has(eachRoll.rollInsResult)) {
        shadeRollQtyMap.set(eachRoll.rollInsResult, new Map<number, number>());
      }
      if (!shadeRollQtyMap.get(eachRoll.rollInsResult).has(eachRoll.rollId)) {
        shadeRollQtyMap.get(eachRoll.rollInsResult).set(eachRoll.rollId, eachRoll.rollQty)
      }
    }
  });
  console.log(shadeRollQtyMap);
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

  }

  const onActualGsmChange = (index) => {
    const supplierGsm = form.getFieldValue(['inspectionRollDetails', index, 'sGsm']);
    const actualGsm = form.getFieldValue(['inspectionRollDetails', index, 'gsm']);
    if(actualGsm<0)
    {
      return
    }
    const variance = Number(actualGsm) - Number(supplierGsm);
    Number(variance.toFixed(2));
    const varianceType = variance < 0 ? AdjustmentType.NEGATIVE : AdjustmentType.POSITIVE;
    form.setFieldValue(['inspectionRollDetails', index, 'adjustment'], varianceType);
    form.setFieldValue(['inspectionRollDetails', index, 'adjustmentValue'], variance);
    onToleranceChange(index);
  }

  const onToleranceChange = (index) => {
    const toleranceFrom = form.getFieldValue(['inspectionRollDetails', index, 'toleranceFrom']);
    const toleranceTo = form.getFieldValue(['inspectionRollDetails', index, 'toleranceTo']);
    const actualGsm = form.getFieldValue(['inspectionRollDetails', index, 'gsm']);
    let checkBoolean = false;
    if (toleranceFrom && toleranceTo && actualGsm) {
      checkBoolean = actualGsm >= toleranceFrom && actualGsm <= toleranceTo;
      if (checkBoolean) {
        form.setFieldValue(['inspectionRollDetails', index, 'rollInsResult'], InsInspectionFinalInSpectionStatusEnum.PASS);
      } else {
        form.setFieldValue(['inspectionRollDetails', index, 'rollInsResult'], InsInspectionFinalInSpectionStatusEnum.FAIL);
      }
    } else {
      form.setFieldValue(['inspectionRollDetails', index, 'rollInsResult'], InsInspectionFinalInSpectionStatusEnum.OPEN);
    }
  }

  const handleInspectionDropdownChange = (value) => {
    labInspDetails?.inspectionRollDetails.map((rec, index) => {
      form.setFields([
        {
          name: ['inspectionRollDetails', index, "rollInsResult"],
          value: value
        }
      ])
    })
  };
  const handleFinalInspectionDropdownChange = (value) => {
    labInspDetails?.inspectionRollDetails.map((rec, index) => {
      form.setFields([
        {
          name: ['inspectionRollDetails', index, "rollFinalInsResult"],
          value: value
        }
      ])
    })
  };

  const getRollLevelInspectionFormTable = (inspectionRollDetails: InsLabInspectionRollDetails[]) => {
    const columns: any[] = [
      {
        title: <span>Object Id</span>,
        dataIndex: 'rollId',
        key: 'rollId',
        // render: (text: string, record: { [key: string]: any }, index: number) => (
        //   <Form.Item noStyle name={[index, 'rollId']} initialValue={text}>
        //     <Input readOnly />
        //   </Form.Item>
        // ),
      },
      {
        title: <span>Object No</span>,
        dataIndex: 'externalRollNo',
        key: 'externalRollNo',
        // render: (text: string, record: { [key: string]: any }, index: number) => (
        //   <Form.Item noStyle name={[index, 'externalRollNo']} initialValue={text}>
        //     <Input readOnly />
        //   </Form.Item>
        // ),
      },
      {
        title: <span>Object Barcode</span>,
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
        title: <span>Object qty</span>,
        dataIndex: 'rollQty',
        key: 'rollQty',
        // render: (text: string, record: { [key: string]: any }, index: number) => (
        //   <Form.Item noStyle name={[index, 'rollQty']} initialValue={text}>
        //     <Input readOnly />
        //   </Form.Item>
        // ),
      },
      {
        title: <span>Supplier GSM</span>,
        dataIndex: 'sGsm',
        key: 'sGsm',
        // render: (text: string, record: { [key: string]: any }, index: number) => (
        //   <Form.Item noStyle name={[index, 'sGsm']} initialValue={text}>
        //     <Input readOnly />
        //   </Form.Item>
        // ),
      },
      {
        title: <span className='required-field'> Actual GSM</span>,
        dataIndex: 'gsm',
        key: 'gsm',
        width: '8%',
        render: (text: string, record: { [key: string]: any }, index: number) => (
          <Form.Item noStyle name={[index, 'gsm']} initialValue={text}>
            <Input type='number' onBlur={() => onActualGsmChange(index)}
              min={0}
              onChange={negativeValidation('gsm', index)}/>
          </Form.Item>
        ),
      },
      {
        title: <span>Variance Type</span>,
        dataIndex: 'adjustment',
        key: 'adjustment',
        width: '8%',
        render: (text: string, record: { [key: string]: any }, index: number) => (
          <Form.Item noStyle name={[index, 'adjustment']} initialValue={text}>
            <Radio.Group defaultValue={text} buttonStyle="solid" disabled={true}>
              <Radio.Button value={AdjustmentType.POSITIVE}><Icon component={plusIcon} color='green' /></Radio.Button>
              <Radio.Button value={AdjustmentType.NEGATIVE}><Icon component={minusIcon} color='red' /></Radio.Button>
            </Radio.Group>
          </Form.Item>
        ),
      },
      {
        title: <span className='required-field'>Variance value</span>,
        dataIndex: 'adjustmentValue',
        key: 'adjustmentValue',
        width: '8%',
        render: (text: string, record: { [key: string]: any }, index: number) => (
          <Form.Item noStyle name={[index, 'adjustmentValue']} initialValue={text}>
            <Input type='number' readOnly />
          </Form.Item>
        ),
      },
      {
        title: <span className='required-field'>Tolerance from</span>,
        dataIndex: 'toleranceFrom',
        key: 'toleranceFrom',
        width: '8%',
        render: (text: string, record: { [key: string]: any }, index: number) => (
          <Form.Item noStyle name={[index, 'toleranceFrom']} initialValue={text}>
            <Input type='number' onBlur={() => onToleranceChange(index)}
              min={0}
             onChange={negativeValidation('toleranceFrom', index)}/>
          </Form.Item>
        ),
      },
      {
        title: <span className='required-field'>Tolerance to</span>,
        dataIndex: 'toleranceTo',
        key: 'toleranceTo',
        width: '8%',
        render: (text: string, record: { [key: string]: any }, index: number) => (
          <Form.Item noStyle name={[index, 'toleranceTo']} initialValue={text}>
            <Input
              type='number'
              min={0}
              onChange={negativeValidation('toleranceTo', index)}
              onBlur={() => onToleranceChange(index)}
            />
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
      key={Date.now()}
      size='small'
      dataSource={inspectionRollDetails}
      columns={columns}
      pagination={false}
      bordered={true}
      scroll={{ x: 'max-content' }}
    />
  };

  const negativeValidation = (vname: string, index: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (value < 0) {
        AlertMessages.getErrorMessage(`${vname} cannot be negative`);
        return;
      }

      // Optional: handle positive value if needed
    };
  };

  const onReRequestCreateCheck = (e) => {
    form.setFieldValue(['inspectionHeader', 'createReRequest'], e);
  }
  return (

    <div>
      <>
        <ScxCard size='small' title={<span>GSM Inspection</span>}>
          <Form form={form} initialValues={labInspDetails}>
            <Form.Item name="rollBarcode" label="Scan Object Barcode" rules={[{ required: false }]}>
              <Space>
                <Col>
                  <Input placeholder="Scan Object Barcode" ref={rollInputRef} value={barcodeVal} autoFocus onChange={(e) => getLabInspDetailsByRollBarcode(e.target.value)} prefix={<ScanOutlined />} />
                </Col>
                <Col>
                  <Search placeholder="Type Object Barcode" defaultValue={manualBarcodeVal} onSearch={manualBarcode} enterButton />
                </Col>
              </Space>
            </Form.Item>
          </Form>
        </ScxCard>
      </>
      {labInspDetails &&
        <ScxCard title={<span>Lab Inspection</span>} size='small'>
          <Form form={form} layout="vertical" onFinish={onFinish} initialValues={labInspDetails}>
            {/* <Row>
            <Col span={4}>
                <Image width={200} src={insProgress} />
            </Col>
            <Col span={20}>
              <InspectionAttributesInfo headerAttributes={labInspDetails?.inspectionHeader?.headerAttributes} />
            </Col>
          </Row> */}
            <InspectionAttributesInfo headerAttributes={labInspDetails?.inspectionHeader?.headerAttributes} />
            <br />
            <Form.List name="inspectionHeader">
              {(fields, { add, remove }) => (
                <Row>
                  <Col lg={18} md={20} sm={24} xs={24}>
                    <Badge.Ribbon text={<span style={{ textAlign: "left" }}>Inspection request id: {labInspDetails?.inspectionHeader?.inspectionReqId}</span>} color="red"  >
                      <ScxCard title={<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}><span style={{ width: "10%" }}>Header info</span><span style={{ width: "10%" }}>Inspection type: <b>{labInspDetails?.inspectionHeader?.inspRequestCategory}</b></span><Progress style={{ width: "10%" }} percent={inspCompPercentage} status="active" /></div>}>
                        <InspectionHeaderForm inspectionHeader={labInspDetails?.inspectionHeader} noOfRolls={labInspDetails?.inspectionRollDetails?.length} noOfInspectedRolls={labInspDetails?.inspectionRollDetails?.length} daysRemainingDefault={daysRemaining} onInspectionStatusChange={onInspectionStatusChange} onReRequestCreateCheck={onReRequestCreateCheck} />

                      </ScxCard>
                    </Badge.Ribbon>
                  </Col>
                  <Col lg={6} md={8} sm={12} xs={18}>
                    <ScxCard size='small' title={<span>Inspection result level abstract</span>}>
                      {getResultAbsComp(shadeLevelAbstractInfo)}
                    </ScxCard>
                  </Col>
                </Row>
              )}
            </Form.List>
            <br />
            <ScxCard size='small' title={<span>Object level inspection</span>}>
              <Form.List name="inspectionRollDetails">
                {(fields, { add, remove }) => (
                  <>
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        {getRollLevelInspectionFormTable(labInspDetails?.inspectionRollDetails)}
                      </Col>
                    </Row>
                  </>
                )}
              </Form.List>
            </ScxCard>
            <Affix>
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

export default LabInspectionForm;