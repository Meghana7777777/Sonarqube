import { ProcessTypeEnum } from '@xpparel/shared-models'
import { PreIntegrationServicePKMS } from '@xpparel/shared-services'
import POProcessSummary from 'packages/ui/src/common/processing-order/po-process-summary'
import React from 'react'

export default function PKMSPoSummary() {
    const poInfoService = new PreIntegrationServicePKMS()
    return (
        <POProcessSummary poSerialsApi={(req) => poInfoService.getProcessingOrderInfo(req)}
            poSummaryApi={(req) => poInfoService.getPoSummary(req)} processType={ProcessTypeEnum.PACK} />
    )
}
