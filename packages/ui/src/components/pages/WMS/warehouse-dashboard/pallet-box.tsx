
import { CurrentPalletLocationEnum, InspectionPalletRollsModel, PalletBinStatusEnum, PalletIdRequest, PalletRollsUIModel, RollInfoUIModel, WarehousePalletRollsModel } from '@xpparel/shared-models';
import { LocationAllocationService } from '@xpparel/shared-services';
import { Button, Descriptions, Empty, message, Popover, Skeleton, Space, Tag, Tooltip } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';

// import { AlertMessages } from '../../../../common';
import './pallet-box.css';
import { CopyOutlined, DotChartOutlined } from '@ant-design/icons';
import { AlertMessages } from '../../../common';
interface Props {
    palletObj: WarehousePalletRollsModel;
    selectPallet: (palletInfo: PalletRollsUIModel) => void;
    filterVal: string;
}
export const PalletBox = (props: Props) => {
    const { palletObj, filterVal } = props;

    const user = useAppSelector((state) => state.user.user.user);
    const locationService = new LocationAllocationService();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (props.palletObj) {
            loadData(props.palletObj);
        }
    }, []);
    const [palletInfo, setPalletInfo] = useState<PalletRollsUIModel>();
    const loadData = (palletPar: WarehousePalletRollsModel) => {
        setLoading(true);
        if (props.palletObj.palletCurrentLoc == CurrentPalletLocationEnum.INSPECTION) {
            getInspectionPalletMappingInfoWithRolls(props.palletObj);
        }
        else {
            getWarehousePalletMappingInfoWithRolls(props.palletObj)
        }
    }
    const getInspectionPalletMappingInfoWithRolls = (palletObj: WarehousePalletRollsModel) => {
        const phIdReq = new PalletIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, palletObj.palletId, palletObj.palletCode);
        locationService.getInspectionPalletMappingInfoWithRolls(phIdReq).then((res => {
            if (res.status) {
                constructInspectionsRolls(res.data)
            } else {
                // AlertMessages.getErrorMessage(res.internalMessage);
            }
            setLoading(false);
        })).catch(error => {
            setLoading(false);
            AlertMessages.getErrorMessage(error.message)
        })
    }
    const getWarehousePalletMappingInfoWithRolls = (palletObj: WarehousePalletRollsModel) => {
        const phIdReq = new PalletIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, palletObj.palletId, palletObj.palletCode);
        locationService.getWarehousePalletMappingInfoWithRolls(phIdReq).then((res => {
            if (res.status) {
                constructWarehouseRolls(res.data)
            } else {
                // AlertMessages.getErrorMessage(res.internalMessage);
            }
            setLoading(false);
        })).catch(error => {
            setLoading(false);
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
                    // rollObj.groupedBy = groupedRoll.groupedBy; // TODO:CUT
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
                    rollObj.batchNumber = rollInfo.batchNumber;
                    rollObj.packListCode = rollInfo.packListCode;
                    if(rollObj.actualRollInfo){
                        rollObj.actualRollInfo.aGsm = rollInfo.actualRollInfo?.aGsm;
                        rollObj.actualRollInfo.aLength = rollInfo.actualRollInfo?.aLength;
                        rollObj.actualRollInfo.aShade = rollInfo.actualRollInfo?.aShade;
                        rollObj.actualRollInfo.aWidth = rollInfo.actualRollInfo?.aWidth;
                    }
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
                rollObj.batchNumber = rollInfo.batchNumber;
                rollObj.packListCode = rollInfo.packListCode;
                if(rollObj.actualRollInfo){
                    rollObj.actualRollInfo.aGsm = rollInfo.actualRollInfo?.aGsm;
                    rollObj.actualRollInfo.aLength = rollInfo.actualRollInfo?.aLength;
                    rollObj.actualRollInfo.aShade = rollInfo.actualRollInfo?.aShade;
                    rollObj.actualRollInfo.aWidth = rollInfo.actualRollInfo?.aWidth;
                }
                rollsInfo.push(rollObj);
            });

            palletObj.noOfRolls = noOfRolls;
            palletObj.rollsInfo = rollsInfo;
            pallets.push(palletObj);
        });
        setPalletInfo(pallets[0]);

    }
    const handleCopyBarcode = (rollObj: RollInfoUIModel) => {
        navigator.clipboard.writeText(rollObj.barcode).then(() => {
          message.success('Barcode copied to clipboard');
        });
      };


    const toolTip = (rollInfo: RollInfoUIModel) => {
        return <div>
            <Descriptions
                // title={rollInfo.rollNumber}
                bordered
                size='small'
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                {/* <Descriptions.Item label="Roll No">{rollInfo.externalRollNumber}</Descriptions.Item> */}
                <Descriptions.Item label="Batch No">{rollInfo.batchNo}</Descriptions.Item>
                <Descriptions.Item label="Lot No">{rollInfo.lotNo}</Descriptions.Item>
                {/* <Descriptions.Item label="Type">{rollInfo.objectType}</Descriptions.Item> */}
                <Descriptions.Item label="PL Length (Mts)">{rollInfo.supplierQuantity}</Descriptions.Item>
                {/* <Descriptions.Item label="UOM">{rollInfo.uom}</Descriptions.Item> */}
                <Descriptions.Item label="PL Shade">{rollInfo.shade}</Descriptions.Item>
                <Descriptions.Item label="PL GSM">{rollInfo.gsm}</Descriptions.Item>
                <Descriptions.Item label="PL Width">{rollInfo.supplierWidth}</Descriptions.Item>
                <Descriptions.Item label="PL Length (Yds)">{rollInfo.supplierLength}</Descriptions.Item>
                <Descriptions.Item label="Actual Width(Cm)">{rollInfo.actualRollInfo?.aWidth}</Descriptions.Item>
                <Descriptions.Item label="Actual Length(Mts)">{rollInfo.actualRollInfo?.aLength}</Descriptions.Item>
                <Descriptions.Item label="Actual GSM">{rollInfo.actualRollInfo?.aGsm}</Descriptions.Item>
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
    const blinkClassName = (rollObjP: RollInfoUIModel, filteringVal: string) => {
        const { packListCode, batchNumber, barcode } = rollObjP;
        const values = [packListCode, batchNumber, barcode];
        return values.includes(filteringVal) ? 'roll-blink' : '';
    }

    return (<>
        {loading ?  <><Skeleton.Avatar active={loading} size='large' shape={'circle'} /> <Skeleton.Avatar active={loading} size='large' shape={'circle'} /></> :
            <div className='db'>
                <div className='pallet-box'>
                    <div className='pallet-container' >
                        <div className='rolls-container'>
                            {palletInfo ? palletInfo.rollsInfo.map(rollObj => {
                                return <Popover key={'p' + rollObj.rollNumber} content={toolTip(rollObj)}
                                    title={<Space><>Roll Barode:<Tag style={{color:'green'}}> {rollObj.barcode}</Tag></><>   <Tooltip title="Copy Barcode">
                                    <CopyOutlined
                                      onClick={() => handleCopyBarcode(rollObj)}
                                      style={{ fontSize: '16px', cursor: 'pointer',color:'red' }}
                                    />
                                  </Tooltip></><>Status: <Tag style={{color:'green'}}>{rollObj.status == PalletBinStatusEnum.OPEN ? 'Not Yet Scanned' : 'Scanned'}</Tag></> <> Roll No:<Tag style={{color:'green'}}>{rollObj.externalRollNumber}</Tag></> <>Type:<Tag style={{color:'green'}}>{rollObj.objectType}</Tag></><>Packing List Number:{rollObj.packListCode}</></Space>}
                                >
                                    <div key={rollObj.rollNumber} id={rollObj.barcode} roll-barcode={rollObj.barcode} batch-no={rollObj.batchNumber} pack-no={rollObj.packListCode} className={`roll ${getClassName(rollObj.phId, 0, rollObj.status)} ${blinkClassName(rollObj, filterVal)}`}></div>
                                </Popover>

                            }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        </div>

                    </div>
                    <div className="pallet-bottam">
                        <div className="plank"></div>
                        <div className="plank"></div>
                        <div className="plank"></div>
                    </div>

                    {/* {palletObj.palletCode} <EyeOutlined style={{ fontSize: '20px', color: '#08c' }}/> */}
                    <Tooltip title={`Pallet Name. Click to View & Print `} mouseEnterDelay={0} mouseLeaveDelay={0} color={'cyan'} key={`${palletObj?.palletCode}c`}>
                        <Button size='small'
                            type="primary"
                            style={{ padding: '2px', height: '19px', lineHeight: 0 }}
                            onClick={() => props.selectPallet(palletInfo)}
                        //  icon={<EyeOutlined />}
                        >{palletObj?.palletCode}</Button>
                    </Tooltip>
                    {/* <Tooltip title={`No of Rolls : ${palletInfo?.noOfRolls}`} mouseEnterDelay={0} mouseLeaveDelay={0} color={'cyan'} key={`${palletObj?.palletCode}d`}>
                <Button
                    size='small'
                    type="dashed"
                    style={{ padding: '2px', height: '19px', lineHeight: 0 }}
                >{palletInfo?.noOfRolls}</Button>
            </Tooltip> */}

                </div>

            </div>}
    </>
    )
}
export default PalletBox;