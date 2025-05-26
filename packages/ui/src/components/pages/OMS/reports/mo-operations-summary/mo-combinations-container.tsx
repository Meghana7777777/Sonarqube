import { MoCombinationWithPslIdsModel, MoOpSequenceInfoModel, MoOpSequenceInfoResponse, MoProductColorReq, MoPslIdsOrderFeatures, MoPslIdsRequest, ProcessTypeEnum } from '@xpparel/shared-models';
import { OpReportingService, OrderCreationService } from '@xpparel/shared-services';
import { Card, Col, Row, Space, Tag, Timeline } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import React, { useEffect, useState } from 'react'
import SizeWiseQuantityCard from './mos-size-wise-qtys-card';
import { ProcessTypeQtysInfo } from './mos-processtype-qtys-info';
import { ProCard, ProSkeleton } from '@ant-design/pro-components';
import MOSProcessTypesCard from './mos-processtypes-card';

interface Props {
    moCombinationsInfo: MoCombinationWithPslIdsModel
    moNumber: string;
    dataNotFoundHandler: (errorTextParam: string) => void;
}

interface SizesInfo {
    processType: ProcessTypeEnum
    sizesInfo: {
        size: string
        moPslIds: number[]
    }[]
    lastOpGroup?:string

}
export default function MoCombinationsContainer(props: Props) {
    const { moCombinationsInfo, moNumber, dataNotFoundHandler } = props
    const { combination, moPslIds } = moCombinationsInfo
    const { product, deliveryDate, destination, color, } = combination
    const [moFeatures, setMoFeatues] = useState<MoPslIdsOrderFeatures[]>([])
    const [opSequences, setOpSequences] = useState<MoOpSequenceInfoModel[]>([])
    const [sizesInfo, setSizesInfo] = useState<SizesInfo[]>()
    const [loading, setLoading] = useState<boolean>(true)
    const user = useAppSelector((state) => state.user.user.user);
    const ordercreationService = new OrderCreationService();
    const opReportingService = new OpReportingService()


    useEffect(() => {
        getOrderFeaturesForGivenPslIds()
        // getOpSequenceForGiveMoPRoductFgColor()
    }, [moCombinationsInfo])

    const getOrderFeaturesForGivenPslIds = async () => {
        setLoading(true)
        const req = new MoPslIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moPslIds)
        ordercreationService.getOrderFeaturesForGivenPslIds(req).then(async (res) => {
            if (res.status) {
                setMoFeatues(res.data)
                getOpSequenceForGiveMoPRoductFgColor(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
            dataNotFoundHandler(err.message)
        }).finally(() => {
            setLoading(false)

        });
    }

    const getOpSequenceForGiveMoPRoductFgColor = (moFeaturesParam: MoPslIdsOrderFeatures[]) => {
        setLoading(true)

        const req = new MoProductColorReq(
            user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId,
            product,
            color,
            moNumber
        );
        opReportingService.getOpSequenceForGiveMoPRoductFgColor(req).then((res) => {
            if (res.status) {
                setOpSequences(res.data)
                const sizesData = constructSizesInfo(res.data, moFeaturesParam)
                console.log(sizesData, 'sizes data')
                setSizesInfo(sizesData)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
        }).finally(() => {
            setLoading(false)
        })
    }

    function constructSizesInfo(opSequences: MoOpSequenceInfoModel[], moFeatures: MoPslIdsOrderFeatures[]): SizesInfo[] {
        const result: SizesInfo[] = [];

        for (const seq of opSequences) {
            const sizeMap = new Map<string, number[]>();

            for (const feature of moFeatures) {
                const { size, moPslId } = feature;

                if (!sizeMap.has(size)) {
                    sizeMap.set(size, []);
                }
                sizeMap.get(size)!.push(moPslId);
            }

            const sizesInfo = Array.from(sizeMap.entries()).map(([size, moPslIds]) => ({
                size,
                moPslIds,
            }));

            result.push({
                processType: seq.processType,
                sizesInfo,
                lastOpGroup:seq?.lastOpGroup || ""
            });
        }

        return result;
    }

    function renderTitleTags() {
        return <Space>
            <span className="f-600"> Product : <Tag style={{ fontSize: '0.9rem', padding: '3px 5px' }} color={'#ff5500'}> {product}</Tag></span>
            <span className="f-600">Delivery date: <Tag style={{ fontSize: '0.9rem', padding: '3px 5px' }} color={'#ff5500'}> {deliveryDate}</Tag></span>
            <span className="f-600">Destination:  <Tag style={{ fontSize: '0.9rem', padding: '3px 5px' }} color={'#ff5500'}>{destination}</Tag></span>
            <span className="f-600"> Color: <Tag style={{ fontSize: '0.9rem', padding: '3px 5px' }} color={'#ff5500'}>{color}</Tag></span>

        </Space>
    }

    if (loading) {
        return <ProSkeleton active />
    }


    const timeLineItems = sizesInfo?.map((v) => ({
        key: v.processType,
        label: <strong>{v.processType}</strong>,
        children: <MOSProcessTypesCard lastOpGroup={v.lastOpGroup} sizesInfo={v.sizesInfo} processType={v.processType} />
    })) || []



    return (
        <>
            <ProCard bordered boxShadow headerBordered  size="small" title={renderTitleTags()} >
                <Row gutter={[24, 24]} justify={'center'}>
                    <Col span={24}>
                        <SizeWiseQuantityCard data={moFeatures} />
                    </Col>

                </Row>
                <Row gutter={[24, 24]} justify={'center'}>
                    <Col span={24}>
                        <div style={{ height: '400px', paddingTop: '10px', overflow: 'scroll', display: 'flex', }}>
                            <Timeline mode="left" items={timeLineItems} />
                        </div>
                    </Col>
                </Row>
            </ProCard>  </>
    )
}
