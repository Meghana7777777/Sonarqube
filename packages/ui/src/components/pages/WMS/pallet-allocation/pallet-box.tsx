import { PrinterOutlined, SaveOutlined } from '@ant-design/icons';
import { CurrentPalletLocationEnum, InspectionPalletRollsModel, PalletBinStatusEnum, PalletDetailsModel, PalletIdRequest, PalletRollsUIModel, RollInfoUIModel, WarehousePalletRollsModel } from '@xpparel/shared-models';
import { LocationAllocationService } from '@xpparel/shared-services';
import { Button, Descriptions, Popover, Tooltip } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import './pallet.css';
interface Props {
  palletObj: PalletDetailsModel;
  phId: number;
  selectPallet: (palletInfo: PalletRollsUIModel) => void;
  selectPalletToUpdate: (palletId: number) => void;
}
export const PalletBox = (props: Props) => {
  const palletObj = props.palletObj;
  const phId = props.phId;
  const user = useAppSelector((state) => state.user.user.user);
  useEffect(() => {
    if (props.palletObj) {
      if (props.palletObj.palletCurrentLoc == CurrentPalletLocationEnum.INSPECTION) {
        getInspectionPalletMappingInfoWithRolls(props.palletObj);
      }
      else {
        getWarehousePalletMappingInfoWithRolls(props.palletObj)
      }
    }
  }, []);

  const [palletInfo, setPalletInfo] = useState<PalletRollsUIModel>();

  const locationService = new LocationAllocationService();

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
  /**
    * 
    * @param palletInfo 
    */
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
          rollObj.status = rollInfo.status;
          rollObj.phId = 17;
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
        rollObj.status = rollInfo.status;
        rollObj.phId = 17;
        rollsInfo.push(rollObj);
      });

      palletObj.noOfRolls = noOfRolls;
      palletObj.rollsInfo = rollsInfo;
      pallets.push(palletObj);
    });
    setPalletInfo(pallets[0]);

  }
  const toolTip = (rollInfo: RollInfoUIModel) => {
    return <div>
      <Descriptions
        // title={rollInfo.rollNumber}
        bordered
        size='small'
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="Batch No">{rollInfo.batchNo}</Descriptions.Item>
        <Descriptions.Item label="Lot No">{rollInfo.lotNo}</Descriptions.Item>
        <Descriptions.Item label="Object No">{rollInfo.externalRollNumber}</Descriptions.Item>
        <Descriptions.Item label="Type">{rollInfo.objectType}</Descriptions.Item>
        <Descriptions.Item label="Quantity">{rollInfo.inputQuantity}</Descriptions.Item>
        <Descriptions.Item label="UOM">{rollInfo.uom}</Descriptions.Item>
        <Descriptions.Item label="Shade">{rollInfo.shade}</Descriptions.Item>
        <Descriptions.Item label="GSM">{rollInfo.gsm}</Descriptions.Item>
        <Descriptions.Item label="Width">{rollInfo.inputWidth}</Descriptions.Item>
        <Descriptions.Item label="Length">{rollInfo.inputLength}</Descriptions.Item>
        <Descriptions.Item label="Shrinkage Width">{rollInfo.skWidth}</Descriptions.Item>
        <Descriptions.Item label="Shrinkage Length">{rollInfo.skLength}</Descriptions.Item>
        <Descriptions.Item label="Shrinkage Group">{rollInfo.skGroup}</Descriptions.Item>
        <Descriptions.Item label="Weight">{rollInfo.netWeight}</Descriptions.Item>
        <Descriptions.Item label="Remarks">{rollInfo.remarks}</Descriptions.Item>


        {/* <Descriptions.Item label="Config Info">
          Data disk type: MongoDB
          <br />
          Database version: 3.4
          <br />
          Package: dds.mongo.mid
          <br />
          Storage space: 10 GB
          <br />
          Replication factor: 3
          <br />
          Region: East China 1
        </Descriptions.Item> */}
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
  return (<>
    <div className='pallet-box'>
      <div className='pallet-container' >
        <div className='rolls-container'>
          {palletInfo && palletInfo.rollsInfo.map(rollObj => {
            return <Popover key={'p' + rollObj.rollNumber} content={toolTip(rollObj)}
              title={`Roll No: ${rollObj.rollNumber}`}
            >
              <div key={rollObj.rollNumber} className={`roll ${getClassName(rollObj.phId,phId,rollObj.status)}`}></div>
            </Popover>

          })}
        </div>

      </div>
      <div className="pallet-bottam">
        <div className="plank"></div>
        <div className="plank"></div>
        <div className="plank"></div>
      </div>
      <p>
        {/* {palletObj.palletCode} <EyeOutlined style={{ fontSize: '20px', color: '#08c' }}/> */}
        <Tooltip title={<div> <Button type="primary" onClick={() => props.selectPalletToUpdate(palletObj.palletId)} icon={<SaveOutlined />} size={'small'}>
          Update
        </Button> <Button type="primary" onClick={() => props.selectPallet(palletInfo)} icon={<PrinterOutlined />} size={'small'}>
            Print
          </Button></div>} color={'white'} key={'cyan'}>
          <Button size='small'
            type="primary"
          // onClick={() => props.selectPallet(palletObj.palletId)}
          //  icon={<EyeOutlined />}
          >{palletObj.palletCode}</Button>
        </Tooltip>
        <Tooltip title={`No of Rolls : ${palletInfo && palletInfo.noOfRolls}`} color={'cyan'} key={'cyan'}>
          <Button
            size='small'
            type="dashed"
          >{palletInfo && palletInfo.noOfRolls}</Button>
        </Tooltip>
      </p>
    </div>

  </>)
}
export default PalletBox;