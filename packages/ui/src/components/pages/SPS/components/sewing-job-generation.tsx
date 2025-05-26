import { PoSummaryModel, SewSerialRequest } from '@xpparel/shared-models';
import React from 'react'

interface ComponentProps {
  poObj: SewSerialRequest;
  onStepChange: (step: number, po: SewSerialRequest) => void
}

const SewingJobGeneration = (props: ComponentProps) => {
  const { onStepChange } = props
  return (
    <div>SewingJobGeneration</div>
  )
}

export default SewingJobGeneration