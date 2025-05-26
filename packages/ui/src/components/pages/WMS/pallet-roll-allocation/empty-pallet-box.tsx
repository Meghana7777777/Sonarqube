import { EyeOutlined } from '@ant-design/icons';
import { BinDetailsModel, BinPalletMappingRequest, CurrentPalletLocationEnum, InspectionPalletRollsModel, PackListIdRequest, PalletBinStatusEnum, PalletDetailsModel, PalletIdRequest, PalletRollsUIModel, RollInfoModel, RollInfoUIModel, WarehousePalletRollsModel } from '@xpparel/shared-models';
import { LocationAllocationService } from '@xpparel/shared-services';
import { Button, Descriptions, Empty, Form, Modal, Popover, Row, Select, Space, Tooltip } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import './pallet-roll-allocation.css'
interface Props {
  palletObj?: PalletDetailsModel;
  selectPallet: (palletInfo: PalletRollsUIModel) => void;
  phId: number;
  showBin?: boolean;
}
export const EmptyPalletBox = (props: Props) => {
  const palletObj = props.palletObj;
  const phId = props.phId;
  const user = useAppSelector((state) => state.user.user.user);
  const locationService = new LocationAllocationService();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allBins, setAllBins] = useState<BinDetailsModel[]>([]);
  const [selectedSugBin, setSelectedSugBin] = useState<BinDetailsModel>(undefined);
  const [form] = Form.useForm();
  const { Option } = Select;
  useEffect(() => {
    if (props.palletObj) {
      loadData(props.palletObj);
    }
  }, []);
  const [palletInfo, setPalletInfo] = useState<PalletRollsUIModel>();
  const loadData = (palletPar: PalletDetailsModel) => {
    if (props.palletObj.palletCurrentLoc == CurrentPalletLocationEnum.INSPECTION) {
      getInspectionPalletMappingInfoWithRolls(props.palletObj);
    }
    else {
      getWarehousePalletMappingInfoWithRolls(props.palletObj)
    }
  }
  const getInspectionPalletMappingInfoWithRolls = (palletObj: PalletDetailsModel) => {
    const phIdReq = new PalletIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, palletObj.palletId, palletObj.palletCode);
    locationService.getInspectionPalletMappingInfoWithRolls(phIdReq).then((res => {
      if (res.status) {
        constructInspectionsRolls(res.data)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })).catch(error => {

      AlertMessages.getErrorMessage(error.message)
    })
  }
  const getWarehousePalletMappingInfoWithRolls = (palletObj: PalletDetailsModel) => {
    const phIdReq = new PalletIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, palletObj.palletId, palletObj.palletCode);
    locationService.getWarehousePalletMappingInfoWithRolls(phIdReq).then((res => {
      if (res.status) {
        constructWarehouseRolls(res.data)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })).catch(error => {

      AlertMessages.getErrorMessage(error.message)
    })
  }
  const constructInspectionsRolls = (palletInfo: InspectionPalletRollsModel[]) => {
    const pallets: PalletRollsUIModel[] = [];

    palletInfo.forEach((eachPallet, index) => {
      const palletObj = new PalletRollsUIModel();
      palletObj.palletCode = eachPallet.palletCode;
      palletObj.palletId = eachPallet.palletId;
      palletObj.phId = eachPallet.phId;
      palletObj.palletCapacity = 0;
      let noOfRolls = 0;
      const rollsInfo: RollInfoUIModel[] = [];
      eachPallet.groupedRolls.forEach(groupedRoll => {
        groupedRoll.rollsInfo.forEach(rollInfo => {
          noOfRolls++;
          const rollObj = new RollInfoUIModel();
          rollObj.batchNo = rollInfo.batchNumber;
          rollObj.barcode = rollInfo.barcode;
          rollObj.externalRollNumber = rollInfo.externalRollNumber;
          // todo:
          // rollObj.groupedBy = groupedRoll.groupedBy;
          rollObj.groupedObjDesc = groupedRoll.groupedObjDesc;
          rollObj.groupedObjNumber = groupedRoll.groupedObjNumber;
          rollObj.gsm = rollInfo.gsm;
          rollObj.id = rollInfo.id;
          rollObj.isOverRideSysAllocation = rollInfo.isOverRideSysAllocation;
          rollObj.inputLength = rollInfo.inputLength;
          rollObj.lotNo = rollInfo.lotNumber;
          rollObj.objectType = rollInfo.objectType;
          rollObj.pickForInspection = rollInfo.pickForInspection;
          rollObj.inputLengthUom = rollInfo.inputLengthUom;
          rollObj.inputWidthUom = rollInfo.inputWidthUom;
          rollObj.inputQuantityUom = rollInfo.inputQuantityUom;
          rollObj.printReleased = rollInfo.printReleased;
          rollObj.printStatus = rollInfo.printStatus;
          rollObj.qrCodeInfo = rollInfo.qrCodeInfo;
          rollObj.inputQuantity = rollInfo.inputQuantity;
          rollObj.supplierQuantity = rollInfo.supplierQuantity;
          rollObj.remarks = rollInfo.remarks;
          rollObj.rollNumber = rollInfo.rollNumber;
          rollObj.shade = rollInfo.shade;
          rollObj.skGroup = rollInfo.skGroup;
          rollObj.skLength = rollInfo.skLength;
          rollObj.skWidth = rollInfo.skWidth;
          rollObj.netWeight = rollInfo.netWeight;
          rollObj.inputWidth = rollInfo.inputWidth;
          rollObj.supplierWidth = rollInfo.supplierWidth;
          rollObj.supplierLength = rollInfo.supplierLength;
          rollObj.status = rollInfo.status;
          rollObj.phId = rollInfo.packListId;
          rollsInfo.push(rollObj);
        });
      });
      palletObj.noOfRolls = noOfRolls;
      palletObj.rollsInfo = rollsInfo;
      pallets.push(palletObj);
    });
    setPalletInfo(pallets[0]);

  }
  const constructWarehouseRolls = (palletInfo: WarehousePalletRollsModel[]) => {
    const pallets: PalletRollsUIModel[] = [];

    palletInfo.forEach((eachPallet, index) => {
      const palletObj = new PalletRollsUIModel();
      palletObj.palletCode = eachPallet.palletCode;
      palletObj.palletId = eachPallet.palletId;
      palletObj.phId = eachPallet.phId;
      palletObj.palletCapacity = eachPallet.palletCapacity;
      let noOfRolls = 0;
      const rollsInfo: RollInfoUIModel[] = [];

      eachPallet.rollsInfo.forEach(rollInfo => {
        noOfRolls++;
        const rollObj = new RollInfoUIModel();
        rollObj.batchNo = rollInfo.batchNumber;
        rollObj.barcode = rollInfo.barcode;
        rollObj.externalRollNumber = rollInfo.externalRollNumber;
        rollObj.gsm = rollInfo.gsm;
        rollObj.id = rollInfo.id;
        rollObj.isOverRideSysAllocation = rollInfo.isOverRideSysAllocation;
        rollObj.inputLength = rollInfo.inputLength;
        rollObj.lotNo = rollInfo.lotNumber;
        rollObj.objectType = rollInfo.objectType;

        rollObj.pickForInspection = rollInfo.pickForInspection;
        rollObj.inputLengthUom = rollInfo.inputLengthUom;
        rollObj.inputWidthUom = rollInfo.inputWidthUom;
        rollObj.inputQuantityUom = rollInfo.inputQuantityUom;
        rollObj.printReleased = rollInfo.printReleased;
        rollObj.printStatus = rollInfo.printStatus;
        rollObj.qrCodeInfo = rollInfo.qrCodeInfo;
        rollObj.inputQuantity = rollInfo.inputQuantity;
        rollObj.supplierQuantity = rollInfo.supplierQuantity;
        rollObj.remarks = rollInfo.remarks;
        rollObj.rollNumber = rollInfo.rollNumber;
        rollObj.shade = rollInfo.shade;
        rollObj.skGroup = rollInfo.skGroup;
        rollObj.skLength = rollInfo.skLength;
        rollObj.skWidth = rollInfo.skWidth;
        rollObj.netWeight = rollInfo.netWeight;
        rollObj.inputWidth = rollInfo.inputWidth;
        rollObj.supplierWidth = rollInfo.supplierWidth;
        rollObj.supplierLength = rollInfo.supplierLength;
        rollObj.status = rollInfo.status;
        rollObj.phId = rollInfo.packListId;
        rollsInfo.push(rollObj);
      });

      palletObj.noOfRolls = noOfRolls;
      palletObj.rollsInfo = rollsInfo;
      pallets.push(palletObj);
    });
    setPalletInfo(pallets[0]);

  }
  const getAllSpaceFreeBinsInWarehouse = (phIdL: number) => {
    const binId = selectedSugBin ? selectedSugBin.binId : props.palletObj?.status == PalletBinStatusEnum.CONFIRMED ? props.palletObj.confimredBinInfo?.binId : props.palletObj.suggestedBinInfo?.binId ?? '';
    form.setFieldValue('bin',binId)
    const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phIdL);
    locationService.getAllSpaceFreeBinsInWarehouse(phIdReq).then((res => {
      if (res.status) {
        setAllBins(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
        setAllBins([]);
      }
      setIsModalOpen(true);     
    })).catch(error => {
      setAllBins([]);
      AlertMessages.getErrorMessage(error.message)
    });
  }
  const allocatePalletsToBin = (binId: number) => {
    const { palletId, palletCode } = props.palletObj;
    const phIdReq = new BinPalletMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, binId, true, [{ palletId: palletId, barcode: palletCode }]);
    locationService.allocatePalletsToBin(phIdReq).then((res => {
      if (res.status) {
        const binObj = allBins.find(binEnt => binEnt.binId == binId);
        setSelectedSugBin(binObj);
        setIsModalOpen(false);
        form.setFieldValue('bin', '');
        AlertMessages.getSuccessMessage(res.internalMessage)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })).catch(error => {
      AlertMessages.getErrorMessage(error.message)
    });
  }
  const toolTip = (rollInfo: RollInfoUIModel) => {
    return <div>
      <Descriptions
        // title={rollInfo.rollNumber}
        bordered
        size='small'
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="Object No">{rollInfo.externalRollNumber}</Descriptions.Item>
        <Descriptions.Item label="Batch No">{rollInfo.batchNo}</Descriptions.Item>
        <Descriptions.Item label="Lot No">{rollInfo.lotNo}</Descriptions.Item>
        <Descriptions.Item label="Type">{rollInfo.objectType}</Descriptions.Item>
        <Descriptions.Item label="Quantity">{rollInfo.supplierQuantity}</Descriptions.Item>
        {/* <Descriptions.Item label="UOM">{rollInfo.uom}</Descriptions.Item> */}
        <Descriptions.Item label="Shade">{rollInfo.shade}</Descriptions.Item>
        <Descriptions.Item label="GSM">{rollInfo.gsm}</Descriptions.Item>
        <Descriptions.Item label="Width">{rollInfo.supplierWidth}</Descriptions.Item>
        <Descriptions.Item label="Length">{rollInfo.supplierLength}</Descriptions.Item>
        <Descriptions.Item label="Shrinkage Width">{rollInfo.skWidth}</Descriptions.Item>
        <Descriptions.Item label="Shrinkage Length">{rollInfo.skLength}</Descriptions.Item>
        <Descriptions.Item label="Shrinkage Group">{rollInfo.skGroup}</Descriptions.Item>
        <Descriptions.Item label="Net Weight">{rollInfo.netWeight}</Descriptions.Item>
        <Descriptions.Item label="Remarks">{rollInfo.remarks}</Descriptions.Item>
      </Descriptions>
    </div>
  }
  const getClassName = (rollPhId: number, phId: number, rollStatus: PalletBinStatusEnum) => {
    if (rollPhId == phId) {
      return rollStatus == PalletBinStatusEnum.OPEN ? 'red-b' : 'green-b';
    } else {
      return 'black-b'
    }
  }

  const updateSugBinToPallet = (values: any) => {
    allocatePalletsToBin(values.bin);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const titleStyle: React.CSSProperties = {
    margin: 0,

  };
  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  };
  const tailLayout = {
    wrapperCol: { offset: 10, span: 14 },
  };
  const disBinCode = selectedSugBin ? selectedSugBin.binCode : props.palletObj?.status == PalletBinStatusEnum.CONFIRMED ? props.palletObj.confimredBinInfo?.binCode : props.palletObj.suggestedBinInfo?.binCode ?? 'No Bin';
  const isBinConfirmed = props.palletObj?.status == PalletBinStatusEnum.CONFIRMED;
  return (<>
    <div className='pallet-box'>
      <div className='pallet-container' >
        <div className='rolls-container'>
          {palletInfo ? palletInfo.rollsInfo.map(rollObj => {
            return <Popover key={'p' + rollObj.rollNumber} content={toolTip(rollObj)}
              title={<Space><>Roll Barode: {rollObj.barcode} </><>Status: {rollObj.status == PalletBinStatusEnum.OPEN ? 'Not Yet Scanned' : 'Scanned'}</></Space>}
            >
              <div key={rollObj.rollNumber} className={`roll ${getClassName(rollObj.phId, phId, rollObj.status)}`}></div>
            </Popover>

          }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </div>

      </div>
      <div className="pallet-bottam">
        <div className="plank"></div>
        <div className="plank"></div>
        <div className="plank"></div>
      </div>
      <p>
        {/* {palletObj.palletCode} <EyeOutlined style={{ fontSize: '20px', color: '#08c' }}/> */}
        <Tooltip title={`Pallet Name. Click to View & Print `} mouseEnterDelay={0} mouseLeaveDelay={0} color={'cyan'} key={`${palletObj?.palletCode}c`}>
          <Button size='small'
            type="primary"
            onClick={() => props.selectPallet(palletInfo)}
          //  icon={<EyeOutlined />}
          >{palletObj?.palletCode}</Button>
        </Tooltip>
        <Tooltip title={`No of Rolls : ${palletInfo?.noOfRolls}`} mouseEnterDelay={0} mouseLeaveDelay={0} color={'cyan'} key={`${palletObj?.palletCode}d`}>
          <Button
            size='small'
            type="dashed"
          >{palletInfo?.noOfRolls}</Button>
        </Tooltip>
        {props.showBin &&
          <Tooltip title={isBinConfirmed ? 'Bin Confirmed' : `Update Suggest Bin`} mouseEnterDelay={0} mouseLeaveDelay={0} color={'orange'} key={`${disBinCode}s`}>
            <Button
              key={`${disBinCode}stn`}
              size='small'
              className={isBinConfirmed ? 'btn-green' :'btn-orange'} 
              // disabled={props.palletObj?.status == PalletBinStatusEnum.CONFIRMED}
              onClick={() => isBinConfirmed ? close : getAllSpaceFreeBinsInWarehouse(props.phId)}
            >{disBinCode}</Button>
          </Tooltip>
        }
      </p>
    </div>
    <Modal
      title={`Update Suggest Bin for - ${props.palletObj?.palletCode}`}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="Cancel" onClick={handleCancel}>
          Cancel
        </Button>

      ]}
    >
      <Row justify="center" gutter={[16, 16]}>
        <Form form={form} {...layout} labelAlign="left" onFinish={updateSugBinToPallet} style={{ width: '90%' }}>
          <Form.Item
            label='Select Bin'
            name="bin"           
            rules={[{ required: true, message: 'Select Bin' }]}>
            <Select filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '100%' }} placeholder='Please Select'>
              <Option value='' disabled>Select Bin</Option>
              {allBins.map(binObj => {
                return <Option value={binObj.binId}>{binObj.binCode}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </Modal>
  </>)
}
export default EmptyPalletBox;