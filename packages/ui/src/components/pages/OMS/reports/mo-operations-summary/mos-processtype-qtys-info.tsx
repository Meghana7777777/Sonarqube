import { MoOperationReportedQtyInfoModel, MoPslIdProcessTypeReq, MoPslIdsOrderFeatures, ProcessTypeEnum } from "@xpparel/shared-models"
import { KnittingJobsService, OpReportingService } from "@xpparel/shared-services";
import { Skeleton, Tag, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";

interface Props {
    processType: ProcessTypeEnum;
    moPslIds: number[]
    lastOpGroup?: string
}




export function ProcessTypeQtysInfo(props: Props) {
    const { processType, moPslIds, lastOpGroup } = props
    const serviceMap = {
        [ProcessTypeEnum.KNIT]: new KnittingJobsService(),
        // other mappings...
    };
    const processTypeServiceMap = serviceMap[processType] || new OpReportingService();
    const user = useAppSelector((state) => state.user.user.user);
    const [qtysInfo, setQtysInfo] = useState<MoOperationReportedQtyInfoModel[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        getQtyInfoForGivenPslIdAndProcType()
    }, [moPslIds])

    const getQtyInfoForGivenPslIdAndProcType = () => {
        setLoading(true)
        console.log('service callled')
        const qtyReq = new MoPslIdProcessTypeReq(
            user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId,
            moPslIds,
            processType,
            lastOpGroup
        );

        processTypeServiceMap.getQtyInfoForGivenPslIdAndProcType(qtyReq).then((res) => {
            if (res.status) {
                setQtysInfo(res.data)
            } else {
                setQtysInfo([])

            }
        }).catch((err) => {
            setQtysInfo([])
        }).finally(() => {
            setLoading(false)
        })
    }

    if (loading) {
        return <Skeleton loading />
    }


    return (
        <>
            {loading ? <Skeleton loading /> : <> <td>
                <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title="Completed Qty">
                    <Tag style={{ minWidth: '45px' }} className='s-tag' color="#5adb00">{qtysInfo[0]?.completedQty ?? '-'}</Tag>
                </Tooltip>
            </td>
                <td>
                    <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title="Rejected Qty">
                        <Tag style={{ minWidth: '45px' }} className='s-tag' color="#da8d00">{qtysInfo[0]?.rejectedQty ?? '-'}</Tag>
                    </Tooltip>
                </td></>}
        </>



    )
}