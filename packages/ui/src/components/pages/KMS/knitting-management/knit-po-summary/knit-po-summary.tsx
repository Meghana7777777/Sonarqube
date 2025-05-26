import { ProcessTypeEnum } from '@xpparel/shared-models'
import { KnitOrderService } from '@xpparel/shared-services'
import POProcessSummary from 'packages/ui/src/common/processing-order/po-process-summary'
import React from 'react'

export default function KnitPoSummary() {

  const poInfoService = new KnitOrderService()
  return (
    <POProcessSummary   poSerialsApi={(req) => poInfoService.getProcessingOrderInfo(req)} 
    poSummaryApi={(req) => poInfoService.getPoSummary(req)}  processType={ProcessTypeEnum.KNIT} />
  )
}
