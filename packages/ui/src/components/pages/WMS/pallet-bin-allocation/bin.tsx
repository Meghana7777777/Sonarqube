import { BinDetailsModel, BinIdRequest, BinPalletModel, CurrentPalletLocationEnum, PalletBinStatusEnum, RackBinPalletsModel, RollBasicInfoModel, WarehousePalletRollsModel } from "@xpparel/shared-models";
import { LocationAllocationService } from "@xpparel/shared-services";
import { Badge, Button, Card, Col, Descriptions, Popover, Space, Tag, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";

interface props {
    binInfo: BinDetailsModel;
    binColSize?: number;
    phId: number;
}
const Bin = (props: props) => {
    const binInfo = props.binInfo;
    const [rackInfo, setRackInfo] = useState<RackBinPalletsModel>();
    const phId = props.phId;
    const user = useAppSelector((state) => state.user.user.user);
    const locationService = new LocationAllocationService();
    useEffect(() => {
        if (binInfo) {
            getBinPalletsWithoutRolls(binInfo);
        }
    }, []);
    const getBinPalletsWithoutRolls = (binObj: BinDetailsModel) => {
        const binReq = new BinIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, binObj.binId, binObj.binCode);
        locationService.getBinPalletsWithoutRolls(binReq).then((res => {
            if (res.status) {
                setRackInfo(res.data[0]);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);

            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        })
    }
    const toolTip = (binInfo: BinPalletModel) => {
        return <div>
            <Descriptions
                // title={rollInfo.rollNumber}
                bordered
                size='small'
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                {/* <Descriptions.Item label="Bin Description">{binInfo.binDesc}</Descriptions.Item> */}
                <Descriptions.Item label="Capacity">{binInfo.totalSupportedPallets}</Descriptions.Item>
                {/* <Descriptions.Item label="No of Empty Pallets">{binInfo.emptyPallets}</Descriptions.Item> */}
                <Descriptions.Item label="No of Used Pallets">{binInfo.palletsInfo.length}</Descriptions.Item>
            </Descriptions>
        </div>
    }
    const getRollsQtyForPallet = (palletInfo: WarehousePalletRollsModel) => {
        let sum = 0;
        for (const rollInfo of palletInfo.rollsInfo) {
            sum += rollInfo.supplierQuantity;
        }
        return sum;
    }
    enum SamePackListEnum {
        SAMEPACKLISTID = 1,
        NOTSAMEPACKLISTID = 2,
        SAMEPACKLISTIDANDNOTMAPPED = 3,
        SAMEPACKLISTIDANDMAPPED = 4
    }
    const getIsSamePackLintId = (palletObj: WarehousePalletRollsModel, phIdL: number) => {
        const samePackListObj = palletObj.rollsBasicInfo.find(entity => entity.packListId == phIdL);
        if (samePackListObj) {
            return palletObj.status == PalletBinStatusEnum.CONFIRMED ? SamePackListEnum.SAMEPACKLISTIDANDMAPPED : SamePackListEnum.SAMEPACKLISTIDANDNOTMAPPED;
        } else {
            return SamePackListEnum.NOTSAMEPACKLISTID;
        }


    }

    return (<>
        {/* <Badge.Ribbon text="Rack" color="pink"> */}
        {/* <Card title={rackInfo?.rackCode} size="small"> */}
        {rackInfo ?
            <>
                {rackInfo.binInfo.map(bin => {
                    return <Col xs={24} sm={12} md={12} lg={6} xl={5} span={props?.binColSize ? props?.binColSize : 4}><Badge.Ribbon key={'pb' + bin.binCode} text={`Rack: ${rackInfo.rackCode}`} color="pink">

                        <Card key={'cb' + bin.binCode} title={<Popover mouseEnterDelay={0} mouseLeaveDelay={0} key={'p' + bin.binCode} content={toolTip(bin)} title={`Bin Code: ${bin.binCode}`}>{bin.binCode}</Popover>} size="small" ><Space key={'sb' + bin.binCode} direction="horizontal" style={{ width: '100%' }}>{bin.palletsInfo.map(pallet => {
                            const palletStatus = getIsSamePackLintId(pallet, phId);
                            return <Button type="dashed" key={'p' + pallet.palletCode} danger={palletStatus == SamePackListEnum.NOTSAMEPACKLISTID} block className={palletStatus == SamePackListEnum.NOTSAMEPACKLISTID ? '' : palletStatus == SamePackListEnum.SAMEPACKLISTIDANDMAPPED ? 'btn-green' : 'btn-orange'} >
                                <Space size="large">
                                    <>{pallet.palletCode}</>
                                    <Tooltip title={`No Of Rolls `} mouseEnterDelay={0} mouseLeaveDelay={0} key={'c' + pallet.palletCode}>
                                        <Tag key={'n' + pallet.palletCode} color="#f50">{pallet.totalMappedRolls}</Tag>
                                    </Tooltip>
                                    {/* <Tooltip title={`Total Roll Qty `} mouseEnterDelay={0} mouseLeaveDelay={0}  key={'#87d068'}>
                                        <Tag color="#87d068">{getRollsQtyForPallet(pallet)}</Tag>
                                    </Tooltip> */}
                                </Space>
                            </Button>
                        })}</Space>

                        </Card>

                    </Badge.Ribbon>
                    </Col>
                })}

            </>
            : ''}
        {/* </Card> */}
        {/* </Badge.Ribbon> */}
    </>)
}
export default Bin;