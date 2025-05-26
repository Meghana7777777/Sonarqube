import { ScanOutlined } from '@ant-design/icons';
import { CommonRequestAttrs, CurrentPalletLocationEnum, InsCommonInspectionHeaderInfo, InsFabricInspectionRequestCategoryEnum, InsFabricInspectionRequestCategoryEnumDisplayValue, InsInspectionFinalInSpectionStatusEnum, InsInspectionStatusEnum, InsIrIdRequest, InsRelaxationInspectionRequest, InsRelaxationInspectionRollDetails, InsRollBarcodeInspCategoryReq, InsShadeLevelAbstractInfoModel, InsWidthAtMeterModel, PalletRollMappingRequest, RollIdRequest, TrayIdsRequest, TrayModel, TrayRollMappingRequest, TrayTrolleyMappingRequest } from '@xpparel/shared-models';
import { FabricInspectionCaptureService, FabricInspectionInfoService, LocationAllocationService, TraysServices, TrayTrolleyService, TrolleysServices } from '@xpparel/shared-services';
import { Affix, Badge, Button, Col, Form, Input, Progress, Row, Select, Space, Spin, Table } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from "antd/lib/table";
import moment from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import { ScxCard } from 'packages/ui/src/schemax-component-lib';
import { useEffect, useRef, useState } from 'react';
import { AlertMessages } from '../../../../common';
import { defaultDateFormat } from '../../../../common/data-picker/date-picker';
import { InspectionAttributesInfo } from './inspection-attributes-info';
import './inspection-forms.css';
import { InspectionHeaderForm } from './inspection-header-form';

const { Option } = Select;

interface LabelVal {
  label: string;
  value: number;
  barCode: string;
}

interface LabelValu {
  label: string;
  value: number;
}


const objPallet = {
  pallet: "pallet",
};

const objTrayTrolley = {
  trayTrolley: "trayTrolley"
};

export interface RelaxationInspectionProps {
  inspReqId: number;
  reloadParent?: () => void;
  reload:number;
}
export const RelaxationInspectionForm = (props: RelaxationInspectionProps) => {
  const user = useAppSelector((state) => state.user.user.user);
  const [form] = Form.useForm();
  const { inspReqId,reload } = props;
  const insCaptureService = new FabricInspectionCaptureService();
  const inspectionInfoService = new FabricInspectionInfoService();
  const [shadeInspDetails, setRelaxationInspectionDetails] = useState<InsRelaxationInspectionRequest>(null);
  const [inspectionStatus, setInspectionStatus] = useState<InsInspectionFinalInSpectionStatusEnum>(InsInspectionFinalInSpectionStatusEnum.OPEN);
  const [inspCompPercentage, setInspCompPercentage] = useState<number>(0);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [stateCounter, setStateCounter] = useState<number>(0);
  const rollInputRef = useRef(null);
  const [barcodeVal, setBarcodeVal] = useState<string>(undefined);
  const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
  const relaxationinspId = 'relaxationinspId';
  const [headerForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<any>();
  const trayMasterService = new TraysServices();
  const [allTraysInfo, setAllTraysInfo] = useState<LabelVal[]>([]);
  const service = new TrolleysServices();
  const [trollysdata, settrollyssData] = useState([]);
  const trayTrolleyService = new TrayTrolleyService();
  const [allPallets, setAllPallets] = useState<LabelValu[]>([]);
  const locationService = new LocationAllocationService();
  const [scannedRollTray, setScannedRollTray] = useState<TrayModel>();
  const [fabricLocation, setFabricLocation] = useState<number>();
  const [selectedPallet, setSelectedPallet] = useState<string | null>(null);
  const [selectedTray, setSelectedTray] = useState<string | null>(null);
  const [selectedTrolley, setSelectedTrolley] = useState<string | null>(null);
  const [rack, setRack] = useState<string | null>(null);

  const handlePalletChange = (value: string | null, index: number) => {
    setRack('pallet')
    setSelectedPallet(value);
    setSelectedTray(null);
    setSelectedTrolley(null);

    form.setFieldsValue({ [index]: { code: null, name: null } });
    form.validateFields();
  };

  const handleTrayChange = (value: string | null, index: number) => {
    setRack('trayTrolley')
    setSelectedTray(value);
    setSelectedPallet(null);
    // setSelectedTrolley(null);

    form.setFieldsValue({ [index]: { palletCode: null, name: null } });
    form.validateFields();
  };

  const handleTrolleyChange = (value: string | null, index: number) => {
    setRack('trayTrolley')
    setSelectedTrolley(value);
    setSelectedPallet(null);
    // setSelectedTray(null);

    form.setFieldsValue({ [index]: { palletCode: null, code: null } });
    form.validateFields();
  };




  useEffect(() => {
    // getAllTrays();
    // getTrollys();
    // getAllSpaceFreePalletsInWarehouse();


  }, [])
  useEffect(() => {
    console.log(inspReqId);
    inspReqId ? getShadeLevelInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, inspReqId, null) : null

  },
    [stateCounter,reload]);

  const getShadeLevelInspDetailsByRollBarcode = (e: string) => {
    clearTimeout(debounceTimer);
    setBarcodeVal(e);
    const timeoutId = setTimeout(() => {
      const rollBarcode = e;
      getShadeLevelInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, null, rollBarcode);
    }, 500);
    setDebounceTimer(timeoutId);
    setIsLoading(true);
  };

  const manualBarcode = (val: string) => {
    setManualBarcodeVal(val.trim());
    getShadeLevelInspDetailsByRollBarcode(val.trim());
    setIsLoading(true);
  }

  const getShadeLevelInspectionDetails = (unitCode: string, companyCode: string, userName: string, userId: number, inspReqId: number, rollBarcode: string) => {
    if (inspReqId) {
      // console.log('coming here');
      const reqObj = new InsIrIdRequest(userName, unitCode, companyCode, userId, inspReqId);
      inspectionInfoService.getInspectionDetailsForRequestId(reqObj, true).then((res) => {
        if (res.status) {
          setInspRelaxationData(res.data.relaxationInfo)
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
        setIsLoading(false);
      }).catch(err => console.log(err.message));
    }
    if (rollBarcode) {
      const reqObj = new InsRollBarcodeInspCategoryReq(userName, unitCode, companyCode, userId, rollBarcode, InsFabricInspectionRequestCategoryEnum.RELAXATION);
      inspectionInfoService.getInspectionDetailForRollIdAndInspCategory(reqObj, true).then((res) => {
        if (res.status) {
          setBarcodeVal('');
          setManualBarcodeVal('');
          setInspRelaxationData(res.data.relaxationInfo);
          form.setFieldValue('inspectionRollDetails', res.data?.relaxationInfo?.inspectionRollDetails);
        } else {
          setBarcodeVal('');
          setManualBarcodeVal('');
          AlertMessages.getErrorMessage(res.internalMessage);
        }
        setIsLoading(false);
      }).catch(err => console.log(err.message));
    }
  }

  const setInspRelaxationData = (inspDetails: InsRelaxationInspectionRequest) => {
    const inspectedDate: any = moment(inspDetails?.inspectionHeader?.inspectedDate);
    inspDetails.inspectionHeader.inspectedDate = inspDetails?.inspectionHeader?.inspectedDate ? inspectedDate : null;

    const expCompletedDate: any = moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt);
    inspDetails.inspectionHeader.expInspectionCompleteAt = inspDetails?.inspectionHeader?.expInspectionCompleteAt ? expCompletedDate : null;

    const startDate: any = moment(inspDetails?.inspectionHeader?.inspectionStart);
    inspDetails.inspectionHeader.inspectionStart = inspDetails?.inspectionHeader?.inspectionStart ? startDate : null;

    const completedDate: any = moment(inspDetails?.inspectionHeader?.inspectionCompleteAt);
    inspDetails.inspectionHeader.inspectionCompleteAt = inspDetails?.inspectionHeader?.inspectionCompleteAt ? completedDate : null;

    setRelaxationInspectionDetails(inspDetails);
    inspDetails?.inspectionHeader?.expInspectionCompleteAt ? setDaysRemaining(calculateDateDifference(new Date(), new Date(moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt).format(defaultDateFormat)))) : null;
    inspDetails.inspectionHeader.inspector = inspDetails.inspectionHeader.inspector ? inspDetails.inspectionHeader.inspector : user?.userName;

    const totalNoOfRolls = inspDetails.inspectionRollDetails.length;
    const totalInspOpenRolls = inspDetails.inspectionRollDetails.filter(eachRoll => eachRoll.inspectionStatus == InsInspectionStatusEnum.OPEN);
    const totalInspRolls = totalNoOfRolls - totalInspOpenRolls.length;
    const percentage = Math.ceil((totalInspRolls / totalNoOfRolls) * 100);
    setInspCompPercentage(percentage);
  }

  const getInspectionResultDropDown = (selectedValue: InsInspectionFinalInSpectionStatusEnum, index, name: string) => {
    // console.log('coming here');
    // disable logic
    return (
      <Select size='small'
        placeholder="Select inspection status"
        defaultValue={selectedValue}
        style={{ width: '100%' }}
        onChange={() => onRollInspectionStatusChange(name, index)}
      // style={selectedValue == InspectionResultEnum.FAIL ? {background: 'red' }: { } }
      >
        {Object.values(InsInspectionFinalInSpectionStatusEnum).map((status) => (
          <Option key={status} value={status} >
            {status}
          </Option>
        ))}
      </Select>
    );
  }

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
      const rollInfo = form.getFieldValue('inspectionRollDetails');
      // console.log(rollInfo)
      const aWidth = form.getFieldValue(['inspectionRollDetails', index, 'aWidth']);
      // console.log(aWidth)
      if (Number(aWidth) == 0) {
        AlertMessages.getErrorMessage('Please enter the actual width to give the inspection result.');
        form.setFieldValue(['inspectionRollDetails', index, 'rollInsResult'], InsInspectionFinalInSpectionStatusEnum.OPEN)
      }
    }
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

  const enableAllInputs = () => {
    setSelectedPallet('');
    setSelectedTray('');
    setSelectedTrolley('');
  };

  const captureInspectionResultsForLabRelaxation = async (values: InsRelaxationInspectionRequest) => {
    const res = await insCaptureService.captureInspectionResultsForLabRelaxation(values, false);
    if (res.status) {
      AlertMessages.getSuccessMessage(res.internalMessage);
      setRelaxationInspectionDetails(undefined);
      headerForm.resetFields();
      form.resetFields();
      enableAllInputs()
      reloadParentAfterPassFail(values.inspectionHeader.inspectionStatus);
    } else {
      AlertMessages.getErrorMessage(res.internalMessage);
    }
  }

  const validateSelection = () => {
    if (!selectedTray || !selectedTrolley) {
      AlertMessages.getErrorMessage("Both Tray and Trolley must be selected.");
      return false;
    }
    return true;
  };





  const mapWithTray = (values: InsRelaxationInspectionRequest, rollId: number) => {
    if (!validateSelection()) return;
    const trayRollMapReq = new TrayRollMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, Number(selectedTray), [rollId], false);
    trayTrolleyService.mapRollToTray(trayRollMapReq).then(res => {
      if (res.status) {
        captureInspectionResultsForLabRelaxation(values)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => console.log(err.message));
  };

  const rollPalletMapping = (values: InsRelaxationInspectionRequest, rollId: number, barcode: string) => {
    const overrideAlloc = true;
    const markAsIssued = undefined;
    const insRollOverride = true;
    const reqFor = false ? CurrentPalletLocationEnum.INSPECTION : CurrentPalletLocationEnum.WAREHOUSE
    const rollIdReq = new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rollId, barcode);
    const phIdReq = new PalletRollMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, null, Number(selectedPallet), overrideAlloc, reqFor, false, [rollIdReq], markAsIssued, insRollOverride);
    locationService.confirmRollsToPallet(phIdReq).then(res => {
      if (res.status) {
        captureInspectionResultsForLabRelaxation(values)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => console.log(err.message));
  };

  const trayToTrolleyMapping = (values: InsRelaxationInspectionRequest, trayId: number) => {
    if (!validateSelection()) return;
    const trolleyTrayMapReq = new TrayTrolleyMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [trayId], Number(selectedTrolley), false);
    trayTrolleyService.mapTrayToTrolley(trolleyTrayMapReq).then(res => {
      if (res.status) {
        captureInspectionResultsForLabRelaxation(values)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => console.log(err.message));
  };



  const onFinish = async (values: InsRelaxationInspectionRequest) => {
    try {
      await form.validateFields();
      console.log(values, 'valuesfrom onFinish');
      if (values.inspectionHeader.inspectionStatus !== InsInspectionFinalInSpectionStatusEnum.OPEN) {
        console.log('coming here')
        if (!values.inspectionHeader.inspectionCompleteAt) {
          AlertMessages.getErrorMessage(
            'Please enter completion date before finalizing the inspection status.'
          );
          return;
        }

        for (const eachRoll of values.inspectionRollDetails) {
          if (!eachRoll.aWidth) {
            AlertMessages.getErrorMessage('Still some roll not yet inspected. Please verify.');
            return;
          }
          // eachRoll.rollInsResult = InsInspectionFinalInSpectionStatusEnum.PASS;
          // eachRoll.rollFinalInsResult = InsInspectionFinalInSpectionStatusEnum.PASS;
        }
      }
      captureInspectionResultsForLabRelaxation(values);
      // if (rack === objPallet.pallet) {
      //   rollPalletMapping(values, shadeInspDetails.inspectionRollDetails[0].rollId, shadeInspDetails.inspectionRollDetails[0].barcode)


      // } else if (rack === objTrayTrolley.trayTrolley) {
      //   mapWithTray(values, shadeInspDetails.inspectionRollDetails[0].rollId)
      //   trayToTrolleyMapping(values, Number(selectedTray))

      // }

    } catch (error) {
      console.error('Validation failed:', error);
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


  const getResultAbsComp = (shadeInfo: InsShadeLevelAbstractInfoModel[]) => {
    const columns: ColumnsType<any> = [
      {
        title: <span>Actual width</span>,
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
        render: (text, record) => {
          return {
            children: <div>{Math.ceil(text)}</div>
          };
        }
      },
    ]
    return <Table
      rowKey={(record) => record.operation}
      columns={columns}
      dataSource={shadeInfo}
      pagination={false}
      bordered
      scroll={{ x: 'scrollable' }}
    />
  };

  const shadeLevelAbstractInfo: InsShadeLevelAbstractInfoModel[] = [];
  const shadeRollQtyMap = new Map<number, Map<number, number>>();
  shadeInspDetails?.inspectionRollDetails?.forEach((eachRoll) => {
    if (eachRoll.aWidth) {
      if (!shadeRollQtyMap.has(eachRoll.aWidth)) {
        shadeRollQtyMap.set(eachRoll.aWidth, new Map<number, number>());
      }
      if (!shadeRollQtyMap.get(eachRoll.aWidth).has(eachRoll.rollId)) {
        shadeRollQtyMap.get(eachRoll.aWidth).set(eachRoll.rollId, eachRoll.rollQty)
      }
    }
  });
  shadeRollQtyMap?.forEach((shadeLevelInfo, eachShade) => {
    const shadeInfo = new InsShadeLevelAbstractInfoModel();
    shadeInfo.shade = eachShade.toString();
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
        // console.log(preFieldValues);
        form.setFieldsValue({
          inspectionHeader: { ...preFieldValues }
        });
      }
    };

  }

  const getInspectionMeasuredWidthChild = (measureWidthDetails: InsWidthAtMeterModel[]) => {
    const measuredWidthAtPointSet = new Set<string>();
    for (const eachPoint of measureWidthDetails) {
      measuredWidthAtPointSet.add(eachPoint.measuredRef)
    }
    const measuredWidthChild = Array.from(measuredWidthAtPointSet).map((eachPoint) => {
      return {
        title: <>{eachPoint}</>,
        // render: (text: string, record: { [key: string]: any }, index: number) => (
        //   <Form.Item name={[index, 'rollId']} initialValue={text}>
        //     <Input readOnly />
        //   </Form.Item>
        // ),
      }
    });
    return measuredWidthChild;
  }

  const calculateMinWidth = (index) => {
    const rollDetails: InsRelaxationInspectionRollDetails[] = form.getFieldValue('inspectionRollDetails');
    const minWidth = Math.min(rollDetails[index].startWidth, rollDetails[index].midWidth, rollDetails[index].endWidth)
    rollDetails[index].aWidth = minWidth;
    // console.log(rollDetails);
    form.setFieldsValue({
      inspectionRollDetails: { ...rollDetails }
    });

  }

  const getAllTrays = () => {
    const req = new TrayIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [], false, false, false);
    trayMasterService.getAllTrays(req).then((res => {
      if (res.status) {
        const allTraysInfo = res.data.map(trayObj => {
          return { label: trayObj.code, value: trayObj.id, barCode: trayObj.barcode }
        });
        setAllTraysInfo(allTraysInfo);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
        setAllTraysInfo([]);
      }
    })).catch(error => {
      AlertMessages.getErrorMessage(error.message)
    })
  };

  const getTrollys = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getAllTrollys(obj).then(res => {
      if (res.status) {

        settrollyssData(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message)
    })
  };

  const getAllSpaceFreePalletsInWarehouse = () => {
    const phIdReq = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    locationService.getAllSpaceFreePalletsInWarehouse(phIdReq).then((res => {
      if (res.status) {
        const allPallets = res.data.map(palletObj => {
          return { label: palletObj.palletCode, value: palletObj.palletId }
        });
        setAllPallets(allPallets);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
        setAllPallets([]);
      }
    })).catch(error => {
      AlertMessages.getErrorMessage(error.message)
    })
  };





  // const getTrayInfoForRollId = (rollId: number) => {
  //   const rollIdsRequest = new RollIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [rollId], false);
  //   trayTrolleyService.getTrayInfoForRollIds(rollIdsRequest).then((res => {
  //     if (res.data.length) {
  //       setScannedRollTray(res.data[0])
  //     }
  //   })).catch(error => {
  //     AlertMessages.getErrorMessage(error.message)
  //   })
  // }
  

  const getRollLevelInspectionFormTable = (inspectionRollDetails: InsRelaxationInspectionRollDetails[]) => {

    console.log(inspectionRollDetails, 'IIIIIIIIIIII')
    const columns: ColumnsType<any> = [
      {
        title: <span>Roll id</span>,
        dataIndex: 'rollId',
        key: 'rollId',
        width: '150px',

      },
      {
        title: <span>Roll no</span>,
        dataIndex: 'externalRollNo',
        key: 'externalRollNo',
        width: '150px',

      },
      {
        title: <span>Barcode</span>,
        dataIndex: 'barcode',
        key: 'barcode',
        width: '150px',

      },
      {
        title: <span>Lot number</span>,
        dataIndex: 'lotNumber',
        key: 'lotNumber',
        width: '150px',

      },
      {
        title: <span>Roll qty</span>,
        dataIndex: 'rollQty',
        key: 'rollQty',
        width: '150px',

      },
      {
        title: <span>Supplier length</span>,
        dataIndex: 'sLength',
        key: 'sLength',
        width: '150px',

      },
      {
        title: <span>Actual length</span>,
        dataIndex: 'aLength',
        key: 'aLength',
        width: '150px',

        render: (text: string, record: { [key: string]: any }, index: number) => (
          <Form.Item name={[index, 'aLength']} initialValue={text}>
            <Input type='number' min={0} />
          </Form.Item>
        ),
      },
      {
        title: <span>No of joins</span>,
        dataIndex: 'noOfJoins',
        key: 'noOfJoins',
        width: '200px',

        render: (text: string, record: { [key: string]: any }, index: number) => (
          <Form.Item name={[index, 'noOfJoins']} initialValue={text}>
            <Input type='number' min={0} />
          </Form.Item>
        ),
      },
      {
        title: <span>Supplier width</span>,
        dataIndex: 'sWidth',
        key: 'sWidth',
        width: '150px',

        // render: (text: string, record: { [key: string]: any }, index: number) => (
        //   <Form.Item name={[index, 'sWidth']} initialValue={text}>
        //     <Input readOnly />
        //   </Form.Item>
        // ),
      },
      {
        title: <span>Start width</span>,
        dataIndex: 'startWidth',
        key: 'startWidth',
        width: '200px',
        render: (text: string, record: any, index: number) => (
          <Form.Item
            name={[index, 'startWidth']}
            rules={[
              { required: true, message: 'Start width is required' },
            ]}
          >
            <Input type='number' onChange={() => calculateMinWidth(index)} min={0} />
          </Form.Item>
        ),
      },
      {
        title: <span>Mid width</span>,
        dataIndex: 'midWidth',
        key: 'midWidth',
        width: '200px',
        render: (text: string, record: any, index: number) => (
          <Form.Item
            name={[index, 'midWidth']}
            rules={[
              { required: true, message: 'Mid width is required' },
            ]}
          >
            <Input type='number' onChange={() => calculateMinWidth(index)} min={0} />
          </Form.Item>
        ),
      },
      {
        title: <span>End width</span>,
        dataIndex: 'endWidth',
        key: 'endWidth',
        width: '200px',
        render: (text: string, record: any, index: number) => (
          <Form.Item
            name={[index, 'endWidth']}
            rules={[
              { required: true, message: 'End width is required' },
            ]}
          >
            <Input type='number' onChange={() => calculateMinWidth(index)} min={0} />
          </Form.Item>
        ),
      },
      {
        title: <span>Min width</span>,
        dataIndex: 'aWidth',
        key: 'aWidth',
        width: '200px',
        render: (text: string, record: { [key: string]: any }, index: number) => (
          <Form.Item name={[index, 'aWidth']} initialValue={text}>
            <Input readOnly type='number' style={{ background: 'red', color: 'white' }} />
          </Form.Item>
        ),
      },

      // {
      //   title: <span>Fabric Location</span>,
      //   dataIndex: 'code',
      //   key: 'code',
      //   width: '8%',
      //   render: (text: string, record: { [key: string]: any }, index: number) => (
      //     <Form.Item name={[index, 'code']}>
      //       <Select
      //       onChange={(value)=>{
      //         setFabricLocation(Number(value))
      //       }}
      //         showSearch
      //         placeholder="Select Tray"
      //         optionFilterProp="children"
      //         filterOption={(input, option) =>
      //           (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      //         }
      //         options={allTraysInfo.map(tray => ({
      //           label: tray.label,
      //           value: tray.value,

      //         }))}
      //       />
      //     </Form.Item>
      //   ),
      // },
      // {
      //   title: <span className='required-field'>Inspection result</span>,
      //   dataIndex: 'inspectionResult',
      //   key: 'inspectionResult',
      //   width: '10%',
      //   render: (text: InsInspectionFinalInSpectionStatusEnum, record: { [key: string]: any }, index: number) => (
      //     <Form.Item noStyle name={[index, 'rollInsResult']} initialValue={text}>
      //       {getInspectionResultDropDown(text, index, 'rollInsResult')}
      //     </Form.Item>
      //   ),
      // },
      // {
      //   title: <span className='required-field'>Final Inspection result</span>,
      //   dataIndex: 'inspectionResult',
      //   key: 'inspectionResult',
      //   width: '10%',
      //   render: (text: InsInspectionFinalInSpectionStatusEnum, record: { [key: string]: any }, index: number) => (
      //     <Form.Item noStyle name={[index, 'rollFinalInsResult']} initialValue={text}>
      //       {getInspectionResultDropDown(text, index, 'rollFinalInsResult')}
      //     </Form.Item>
      //   ),
      // },
      {
        title: <> <span className='required-field'>Inspection result</span>
          <Form.Item name='inspectionResult'   >
            <Select
              size='small'
              placeholder="Set status for all"
              style={{ marginLeft: 8, width: 150 }}
              // onChange={handleInspectionDropdownChange}
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
              // onChange={handleFinalInspectionDropdownChange}
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
        width: '200px',
        render: (text: string, record: { [key: string]: any }, index: number) => (
          <Form.Item name={[index, 'remarks']} initialValue={text}>
            <Input />
          </Form.Item>
        ),
      },
      // {
      //   title: <span>Select Pallet</span>,
      //   dataIndex: 'palletCode',
      //   key: 'palletCode',
      //   width: '8%',
      //   render: (text: string, record: { [key: string]: any }, index: number) => (
      //     <Form.Item
      //       name={[index, 'palletCode']}
      //       rules={[
      //         {
      //           required: !selectedTray && !selectedTrolley,
      //           message: 'Pallet is required',
      //         },
      //       ]}
      //     >
      //       <Select
      //         disabled={!!selectedTray || !!selectedTrolley}
      //         onChange={(value) => handlePalletChange(value, index)}
      //         allowClear
      //         showSearch
      //         placeholder="Select Pallet"
      //         optionFilterProp="children"
      //         filterOption={(input, option) =>
      //           (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase())
      //         }
      //         options={allPallets.map((pallet) => ({
      //           label: pallet.label,
      //           value: pallet.value,
      //         }))}
      //       />
      //     </Form.Item>
      //   ),
      // },
      // {
      //   title: <span>Select Tray</span>,
      //   dataIndex: 'code',
      //   key: 'code',
      //   width: '8%',
      //   render: (text: string, record: { [key: string]: any }, index: number) => (
      //     <Form.Item
      //       name={[index, 'code']}
      //       rules={[
      //         {
      //           required: !selectedPallet && !selectedTrolley,
      //           message: 'Tray is required',
      //         },
      //       ]}
      //     >
      //       <Select
      //         disabled={!!selectedPallet}
      //         onChange={(value) => handleTrayChange(value, index)}
      //         allowClear
      //         showSearch
      //         placeholder="Select Tray"
      //         optionFilterProp="children"
      //         filterOption={(input, option) =>
      //           (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase())
      //         }
      //         options={allTraysInfo.map((tray) => ({
      //           label: tray.label,
      //           value: tray.value,
      //         }))}
      //       />
      //     </Form.Item>
      //   ),
      // },
      // {
      //   title: <span>Select Trolley</span>,
      //   dataIndex: 'name',
      //   key: 'name',
      //   width: '8%',
      //   render: (text: string, record: { [key: string]: any }, index: number) => (
      //     <Form.Item
      //       name={[index, 'name']}
      //       rules={[
      //         {
      //           required: !selectedPallet && !selectedTray,
      //           message: 'Trolley is required',
      //         },
      //       ]}
      //     >
      //       <Select
      //         disabled={!!selectedPallet}
      //         onChange={(value) => handleTrolleyChange(value, index)}
      //         allowClear
      //         showSearch
      //         placeholder="Select Trolley"
      //         optionFilterProp="children"
      //         filterOption={(input, option) =>
      //           (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase())
      //         }
      //         options={trollysdata.map((trolley) => ({
      //           label: trolley.name,
      //           value: trolley.id,
      //         }))}
      //       />
      //     </Form.Item>
      //   ),
      // }
    ];
    return <Table
      dataSource={inspectionRollDetails}
      columns={columns}
      pagination={false}
      bordered={true}
      scroll={{ x: 1500 }}
      size='small'
    />
  };

  const onInspectionStatusChange = (e) => {
    if (!inspReqId) {
      AlertMessages.getErrorMessage('Request status cannot be changed with roll barcode scanning.');
      form.setFieldValue(['inspectionHeader', 'inspectionStatus'], InsInspectionFinalInSpectionStatusEnum.OPEN);
      return;
    }
    // console.log(e);
    if (e != InsInspectionFinalInSpectionStatusEnum.OPEN) {
      // check all the inspection final results are inspected or not
      const rollInfo = form.getFieldValue('inspectionRollDetails');
      // console.log(rollInfo);
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

  return (

    <div>
      <Spin spinning={isLoading} size="large">

        <>

          <ScxCard size='small' title={<span>Relaxation Inspection</span>}>
            <Form form={headerForm} initialValues={shadeInspDetails}>
              <Form.Item name="rollBarcode" label="Scan Object Barcode" rules={[{ required: false }]}>
                <Space>
                  <Col>
                    <Input placeholder="Scan Object Barcode" ref={rollInputRef} value={barcodeVal} autoFocus onChange={(e) => getShadeLevelInspDetailsByRollBarcode(e.target.value.trim())} prefix={<ScanOutlined />} />
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
          <ScxCard size='small' title={<span>Relaxation</span>}>
            <Form form={form} onFinish={onFinish} initialValues={shadeInspDetails} >
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
                  <Col lg={24} md={20} sm={24} xs={24}>
                    <Badge.Ribbon
                      text={
                        <span style={{ textAlign: "left" }}>
                          Inspection request id: {shadeInspDetails?.inspectionHeader?.inspectionReqId}
                        </span>
                      }
                      color="red"
                    >
                      <ScxCard
                        size="small"
                        title={
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-evenly",
                              width: "100%",
                            }}
                          >
                            <span style={{ width: "10%" }}>Header Info</span>
                            <span style={{ width: "10%" }}>
                              Inspection type : <b>{InsFabricInspectionRequestCategoryEnumDisplayValue[shadeInspDetails?.inspectionHeader?.inspRequestCategory]}</b>
                            </span>
                            <Progress style={{ width: "10%" }} percent={inspCompPercentage} status="active" />
                          </div>
                        }
                      >
                        <InspectionHeaderForm
                          inspectionHeader={shadeInspDetails?.inspectionHeader}
                          noOfRolls={shadeInspDetails?.inspectionRollDetails?.length}
                          noOfInspectedRolls={shadeInspDetails?.inspectionRollDetails?.length}
                          daysRemainingDefault={daysRemaining}
                          onInspectionStatusChange={onInspectionStatusChange}
                          onReRequestCreateCheck={null}
                        />
                        {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                          <Form.Item>
                            <Button type="primary" htmlType="submit">
                              Save
                            </Button>
                          </Form.Item>
                        </div> */}
                      </ScxCard>
                    </Badge.Ribbon>
                  </Col>
                )}
              </Form.List>
              <br />
              <ScxCard size='small' title={<span> Roll level Relaxation</span>}>
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
                      Save Relaxation
                    </Button>
                  </Form.Item>
                </div>
              </Affix>
            </Form>
          </ScxCard >}
      </Spin>

    </div >

  );
}

export default RelaxationInspectionForm;