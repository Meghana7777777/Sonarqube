import { useState, useEffect } from 'react';
import { Table, Card, Col, Typography, Flex, Tag, Button, Row } from 'antd';
import { PkmsFgWhReqTypeEnum, FgWhSrIdPlIdsRequest, PKMSFgWhereHouseCreateDto, WarehouseGroup, PackListCartoonIDs } from '@xpparel/shared-models';
import { PKMSFgWarehouseService } from '@xpparel/shared-services';
import { useAppSelector } from './../../../../../common';
import { PkFgWhCodesEnum } from '../../pk-wh';
import { AlertMessages } from 'packages/ui/src/components/common';
import { WarehousePanel } from './ware-house-panel';
import StopwatchNew from '../../../WMS/GRNTab2/stopwatch';
import CurrentTimeRendering from '../../../../../common/time-components/current-time-rendering';

const { Text } = Typography;



interface FgWarehouseFormProps {
    shippingOrderId: number;
    moNo: string;
    vpo: string;
    packingListIds: number[];
    packListCartoonIds: PackListCartoonIDs[];
    toggleFgWhReqPopUp: (status: boolean) => void;
    fgOutReqCreated: boolean;
    getShippingRequestByFilterRequest: (manufacturingOrderPks: string[]) => Promise<void>;
    selectedManufacturingOrder: string[]
}


const FgWarehouseForm = (props: FgWarehouseFormProps) => {
    const [floorInfoData, setFloorInfoData] = useState<WarehouseGroup[]>([]);
    const [packListIds, setPackListIds] = useState<number[]>([]);
    const service = new PKMSFgWarehouseService();

    const user = useAppSelector((state) => state.user.user.user);

    useEffect(() => {
        getWhFloorInfoForPackListIds(props.packingListIds, props.packListCartoonIds);
    }, [props.packingListIds, props.packListCartoonIds]);




    const getWhFloorInfoForPackListIds = (plIds: number[], packListCartoonIDs: PackListCartoonIDs[]) => {
        const cartoonId: PackListCartoonIDs[] = []
        packListCartoonIDs.forEach(rec => cartoonId.push(new PackListCartoonIDs(rec.packListId, rec.cartonIds)));
        const req = new FgWhSrIdPlIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, plIds, '', false, false, false, false, false, [], cartoonId, [PkmsFgWhReqTypeEnum.OUT])
        service.getWhFloorInfoForPackListIds(req).then((response) => {
            const data = response.data;
            data.forEach(d => {
                d.packingLists.forEach(p => {
                    if (p.packListId) {
                        packListIds.push(Number(p.packListId));
                    }
                })
            })
            setFloorInfoData(response.data);
            // check and set the pack list ids eligible for the create request

        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
        })
    }


    const createFgWhReq = (plIds: number[]) => {
        if (plIds.length <= 0) {
            AlertMessages.getErrorMessage('Requested packing lists are not present in the WH');
            return;
        }
        const req = new PKMSFgWhereHouseCreateDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, plIds, PkFgWhCodesEnum.Celsius, '', 'Created from Dispacth', PkmsFgWhReqTypeEnum.OUT, props.packListCartoonIds, Number(props?.shippingOrderId));
        service.saveFgWhereHouseReq(req).then(res => {
            if (res.status) {
                props.getShippingRequestByFilterRequest(props.selectedManufacturingOrder)
                props.toggleFgWhReqPopUp(false);
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    }



    return (
        <div>
            <Row style={{ marginBottom: '16px' }}>
                <Col span={6}>
                    <Text style={{ fontSize: '12px' }}>
                        MO No:
                        <span style={{ marginLeft: '4px', color: '#555' }}>{props.moNo}</span>
                    </Text>
                </Col>
                <Col span={10}>
                    <Text style={{ fontSize: '12px' }}>
                        VPO Number:
                        <span style={{ marginLeft: '4px', color: '#555' }}>{props.vpo}</span>
                    </Text>
                </Col>
                <Col >
                    <Text style={{ fontSize: '12px' }}>
                        Current Time:
                        <span style={{ marginLeft: '4px', color: '#555' }}>
                            <CurrentTimeRendering />
                        </span>
                    </Text>
                </Col>
            </Row>
            <Row style={{ marginBottom: '16px' }}>
                <Col span={8}>
                    <Text style={{ fontSize: '12px' }}>
                        Total Pack lists required: <span style={{ marginLeft: '4px', color: '#555' }}>
                            <Tag color="orange" style={{ fontSize: '12px', padding: '0 4px' }}>
                                {props.packingListIds.length}
                            </Tag></span>
                    </Text>
                </Col>
                <Col span={8}>
                    <Text style={{ fontSize: '12px' }}>
                        Total packlists in WH: <span style={{ marginLeft: '4px', color: '#555' }}>
                            <Tag color="orange" style={{ fontSize: '12px', padding: '0 4px' }}>
                                {packListIds.length}
                            </Tag>
                        </span>
                    </Text>
                </Col>
            </Row>
            <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: '16px' }} />

            <Row justify={"start"}>
                {floorInfoData.map((warehouse, index) => (
                    <Col xs={24} sm={12} key={index}>
                        <WarehousePanel
                            cartonIds={props.packListCartoonIds}
                            warehouse={warehouse}
                        />
                    </Col>
                ))}
            </Row>
            <Row justify="end" style={{ marginTop: '16px' }}>
                <Button
                    type="primary"
                    onClick={() => createFgWhReq(packListIds)}
                    style={{
                        backgroundColor: '#f56a46',
                        fontSize: '12px',
                        height: '28px',
                        padding: '0 16px'
                    }}
                >
                    Submit
                </Button>
            </Row>
        </div>
    );
};

export default FgWarehouseForm;
