import { CopyOutlined, EyeOutlined, PrinterOutlined, SaveOutlined } from '@ant-design/icons';
import { CurrentPalletLocationEnum, InspectionPalletRollsModel, PalletBinStatusEnum, PalletDetailsModel, PalletGroupTypeEnum, PalletIdRequest, PalletRollsUIModel, PgIdRequest, PgRollsModel, RollInfoModel, RollInfoUIModel, WarehousePalletRollsModel } from '@xpparel/shared-models';
import { LocationAllocationService } from '@xpparel/shared-services';
import { Button, Card, Col, Descriptions, message, Popover, Space, Tag, Tooltip } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import bin from '../pallet-bin-allocation/bin';
import BoxIcon from "./../../../../assets/icons/packlists.png";
import RollIcon from "./../../../../assets/icons/roll.png";
import BaleIcon from "./../../../../assets/icons/hay-bale.png";
import PackIcon from "./../../../../assets/icons/packing-goods.png";
import ConeIcon from "./../../../../assets/icons/thread.png";
import './pallet.css';
interface Props {
    pgObj: PgRollsModel;
    phId: number;
    selectPallet: (palletInfo: PalletRollsUIModel) => void;
    selectPalletToUpdate: (palletId: number) => void;
}
export const PalletRollNameBox = (props: Props) => {
    const palletObj = props.pgObj;
    const phId = props.phId;
    const user = useAppSelector((state) => state.user.user.user);
    useEffect(() => {
        if (props.pgObj) {
            if (props.pgObj.pgType == PalletGroupTypeEnum.INSPECTION) {
                getInspectionRollsForPgId(props.pgObj);
            }
            else {
                getWarehouseRollsForForPgId(props.pgObj)
            }
        }
    }, []);


    const [palletInfo, setPalletInfo] = useState<PalletRollsUIModel>();

    const locationService = new LocationAllocationService();

    const getInspectionRollsForPgId = (pgObj: PgRollsModel) => {
        const phIdReq = new PgIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, undefined, pgObj.pgId);
        locationService.getInspectionRollsForPgId(phIdReq).then((res => {
            if (res.status) {
                constructInspectionsRolls(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);

            }
        })).catch(error => {

            AlertMessages.getErrorMessage(error.message)
        })
    }
    const getWarehouseRollsForForPgId = (pgObj: PgRollsModel) => {
        const phIdReq = new PgIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, undefined, pgObj.pgId);
        locationService.getWarehouseRollsForForPgId(phIdReq).then((res => {
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
      * @param pgRollInfo 
      */
    const constructInspectionsRolls = (pgRollInfo: PgRollsModel[]) => {
        const pallets: PalletRollsUIModel[] = [];

        pgRollInfo.forEach((eachPgPallet, index) => {
            const palletObj = new PalletRollsUIModel();
            palletObj.palletCode = '';
            // palletObj.palletId = eachPgPallet.palletId;
            // palletObj.phId = eachPgPallet.phId;
            palletObj.palletCapacity = 0;
            palletObj.pgName = eachPgPallet.pgName;
            let noOfRolls = 0;
            const rollsInfo: RollInfoUIModel[] = [];
            // eachPgPallet.groupedRolls.forEach(groupedRoll => {
            eachPgPallet.rollsInfo.forEach(rollInfo => {
                noOfRolls++;
                const rollObj = new RollInfoUIModel();
                rollObj.batchNo = rollInfo.batchNumber;
                rollObj.externalRollNumber = rollInfo.externalRollNumber;
                // rollObj.groupedBy = groupedRoll.groupedBy;
                // rollObj.groupedObjDesc = groupedRoll.groupedObjDesc;
                // rollObj.groupedObjNumber = groupedRoll.groupedObjNumber;
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
                rollObj.barcode = rollInfo.barcode;
                rollsInfo.push(rollObj);
            });
            // });
            palletObj.noOfRolls = noOfRolls;
            palletObj.rollsInfo = rollsInfo;
            pallets.push(palletObj);
        });
        setPalletInfo(pallets[0]);

    }
    const constructWarehouseRolls = (palletInfo: PgRollsModel[]) => {
        const pallets: PalletRollsUIModel[] = [];

        palletInfo.forEach((eachPallet, index) => {
            const palletObj = new PalletRollsUIModel();
            palletObj.palletCode = 'eachPallet.palletCode';
            // palletObj.palletId = eachPallet.palletId;
            // palletObj.phId = eachPallet.phId;
            // palletObj.palletCapacity = eachPallet.palletCapacity;
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
                rollObj.supplierLength = rollInfo.supplierLength;
                rollObj.status = rollInfo.status;
                rollObj.phId = rollInfo.packListId;
                rollObj.barcode = rollInfo.barcode;
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
    const iconStyle = { marginLeft: 4, width: 14, height: 14 };
    const objectTypeIcons: Record<string, JSX.Element> = {
        BOX: <img src={BoxIcon} alt="box" style={iconStyle} />,
        ROLL: <img src={RollIcon} alt="roll" style={iconStyle} />,
        BALE: <img src={BaleIcon} alt="bale" style={iconStyle} />,
        CONE: <img src={ConeIcon} alt="cone" style={iconStyle} />,
        PACK: <img src={PackIcon} alt="pack" style={iconStyle} />,
    };

    const getColor = (rollPhId: number, phId: number, rollStatus: PalletBinStatusEnum) => {
        if (rollPhId == phId) {
            return rollStatus == PalletBinStatusEnum.OPEN ? '#f50' : '#87d068';
        } else {
            return '#000'
        }
    }

    const handleCopyBarcode = (rollObj: RollInfoUIModel) => {
        navigator.clipboard.writeText(rollObj.barcode).then(() => {
            message.success('Barcode copied to clipboard');
        }).catch(err => console.log(err.message));
    };
    const splitRollInfoIntoGroups = (rollInfoArray: RollInfoUIModel[]) => {
        const groupSize = 12;
        const result = [];

        for (let i = 0; i < rollInfoArray.length; i += groupSize) {
            const group = rollInfoArray.slice(i, i + groupSize);
            result.push(<Space.Compact direction="vertical" size={'middle'}>
                {group.map(rollObj => {
                    return <Popover key={'p' + rollObj.rollNumber} trigger="click" mouseEnterDelay={0} mouseLeaveDelay={0} content={toolTip(rollObj)}
                        title={<Space>
                            <span>Roll Barcode: {rollObj.barcode}</span>
                            <Tooltip title="Copy Barcode">
                                <CopyOutlined
                                    onClick={() => handleCopyBarcode(rollObj)}
                                    style={{ fontSize: '16px', cursor: 'pointer', color: 'red' }}
                                />
                            </Tooltip>
                            <span>Status: {rollObj.status === PalletBinStatusEnum.OPEN ? 'Not Yet Scanned' : 'Scanned'}</span>
                        </Space>
                        }
                    >
                        <Space.Compact block>
                            {/* <div style={{background:getColor(rollObj.phId, phId, rollObj.status), marginBottom:'1px'}}> */}
                            <Button type="primary" className={`${rollObj.status == PalletBinStatusEnum.OPEN ? '' : 'btn-green'}`} style={{ textAlign: 'left', minWidth: '70px', marginBottom: '1px' }} size='small'>{rollObj.barcode}{objectTypeIcons[rollObj.objectType] ?? null}</Button>
                            <Button type='dashed' className="btn-orange" style={{ width: '58px', textAlign: 'right', marginBottom: '1px' }} size='small'>{rollObj.supplierWidth}</Button>
                            {/* </div> */}
                        </Space.Compact>
                    </Popover>
                })}
            </Space.Compact>
            )
            // result.push(group);
        }

        return result;
    }
    return (<>
        <div className='pallet-box-name'>
            <p style={{ margin: 0 }}>
                {/* {palletObj.palletCode} <EyeOutlined style={{ fontSize: '20px', color: '#08c' }}/> */}
                <Tooltip title={<div>
                    {/* <Button type="primary" onClick={() => props.selectPalletToUpdate(palletObj.pgId)} icon={<SaveOutlined />} size={'small'}>
                    Update
                </Button>  */}
                    <Button type="primary" danger onClick={() => props.selectPallet(palletInfo)} icon={<PrinterOutlined />} size={'small'}>
                        Print
                    </Button></div>} color={'white'} key={'cyan'}>
                    <Button size='small'
                        type="primary"
                        danger
                    // onClick={() => props.selectPallet(palletObj.palletId)}
                    //  icon={<EyeOutlined />}
                    >{palletObj.pgName}</Button>
                </Tooltip>
                <Tooltip title={`No of Objects : ${palletInfo && palletInfo.noOfRolls}`} color={'cyan'} key={'cyan'}>
                    <Button
                        size='small'
                        type="dashed"
                    >{palletInfo && palletInfo.rollsInfo.length}</Button>
                </Tooltip>
            </p>
            <div className='pallet-container-name' >
                <div className='rolls-name-container'>

                    {/* <Col span={6}> */}
                    {/* <Card size='small' title={palletObj.palletCode}> */}
                    <Space align='end' >
                        <div style={{ minHeight: '150px' }}></div> {/*Dummy for roll should be bottom */}
                        {palletInfo && splitRollInfoIntoGroups(palletInfo.rollsInfo)}
                    </Space>
                    {/* <Space size={[0, 'small']} wrap style={{ display: 'none' }}>
                        {palletInfo && palletInfo.rollsInfo.map(rollObj => {
                            return <Popover key={'p' + rollObj.rollNumber} mouseEnterDelay={0} mouseLeaveDelay={0} content={toolTip(rollObj)}
                                title={`Roll No: ${rollObj.rollNumber}`}
                            > */}
                    {/* <div key={rollObj.rollNumber} className={`roll ${getClassName(rollObj.phId, phId, rollObj.status)}`}></div> */}
                    {/* <Button type="dashed" size='small' >                                */}
                    {/* <>{rollObj.rollNumber}</>                                   */}
                    {/* <Tag key={rollObj.rollNumber} style={{ width: '85px' }} color={`${getColor(rollObj.phId, phId, rollObj.status)}`}>{rollObj.barcode}-{rollObj.inputWidth}</Tag> */}
                    {/* <Tag color="#87d068">{ }</Tag>                                    */}

                    {/* </Button> */}
                    {/* </Popover> */}

                    {/* })}
                    </Space> */}
                    {/* </Card> */}
                    {/* </Col> */}
                </div>

            </div>
            {/* <div className="pallet-bottam">
                <div className="plank"></div>
                <div className="plank"></div>
                <div className="plank"></div>
            </div> */}
            {/* <p>              
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
                    >{palletInfo && palletInfo.rollsInfo.length}</Button>
                </Tooltip>
            </p> */}
        </div>

    </>)
}
export default PalletRollNameBox;