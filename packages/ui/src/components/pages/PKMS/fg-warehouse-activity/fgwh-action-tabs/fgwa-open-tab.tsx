import React, { useState } from 'react'
import FGWAReqHeaderTable from '../fgwh-req-header-table'
import { PkmsFgWhReqApprovalEnum, PkmsFgWhCurrStageEnum, FgWhReqHeaderDetailsModel, PkmsFgWhReqTypeEnum, FgWhStageReq, FgWhStatusReq } from '@xpparel/shared-models'
import { Button, Space } from 'antd'
import { PKMSFgWarehouseService } from '@xpparel/shared-services'
import { useAppSelector } from 'packages/ui/src/common'
import { AlertMessages } from '../../../../common'


interface Props {
    reqType: PkmsFgWhReqTypeEnum
    statusUpdate: () => void
}
export default function FGWAOpenTab({ reqType, statusUpdate }: Props) {

    const [stateUpdateKey, setStateUpdateKey] = useState<number>(1)
    const user = useAppSelector((state) => state.user.user.user);
    const fgWHService = new PKMSFgWarehouseService()


    function updateFgWhReqApprovalStatus(rec: FgWhReqHeaderDetailsModel, approvalStatus: PkmsFgWhReqApprovalEnum) {
        const req = new FgWhStatusReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, approvalStatus, rec.requestId)
        fgWHService.updateFgWhReqApprovalStatus(req).then((res) => {
            if (res.status) {
                setStateUpdateKey((prev) => prev + 1)
                statusUpdate()
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => console.log(err.message))
    }

    function updateFgWhReqRejectedStatus(rec: FgWhReqHeaderDetailsModel, approvalStatus: PkmsFgWhReqApprovalEnum) {
        const req = new FgWhStatusReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, approvalStatus, rec.requestId)
        fgWHService.updateFgWhReqRejectedStatus(req).then((res) => {
            if (res.status) {
                setStateUpdateKey((prev) => prev + 1)
                statusUpdate()
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => console.log(err.message))
    }





    const actionColumns = [{
        title: 'Action',
        render: (v, rec: FgWhReqHeaderDetailsModel) => {
            return <Space>
                <Button
                    onClick={() => updateFgWhReqApprovalStatus(rec, PkmsFgWhReqApprovalEnum.APPROVED)} type='primary'
                >Approve
                </Button>
                <Button
                    danger
                    onClick={() => updateFgWhReqRejectedStatus(rec, PkmsFgWhReqApprovalEnum.REJECT)}
                    type='primary'
                >Reject</Button>
            </Space>
        }
    }]


    return (
        <FGWAReqHeaderTable
            stateUpdateKey={stateUpdateKey}
            approvalStatus={PkmsFgWhReqApprovalEnum.OPEN}
            reqType={reqType}
            currentStage={[PkmsFgWhCurrStageEnum.OPEN]}
            actionColumns={actionColumns}
        />
    )
}
