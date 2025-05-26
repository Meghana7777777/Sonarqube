import { ProcessTypeEnum } from '@xpparel/shared-models'
import { SewingProcessingOrderService } from '@xpparel/shared-services'
import POProcessSummary from 'packages/ui/src/common/processing-order/po-process-summary'
import React from 'react'

export default function SpsPoSummary() {
    const poInfoService = new SewingProcessingOrderService()
    return (
        <POProcessSummary
            poSerialsApi={(req) => poInfoService.getProcessingOrderInfo(req)}
            poSummaryApi={(req) => poInfoService.getPoSummary(req)} processType={ProcessTypeEnum.SEW} />
    )
}
