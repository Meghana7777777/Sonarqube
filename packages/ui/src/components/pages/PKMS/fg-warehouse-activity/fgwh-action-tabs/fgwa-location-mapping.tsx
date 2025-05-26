import React, { useState } from 'react'
import FGWAReqHeaderTable from '../fgwh-req-header-table'
import { FgWhInActivityActionsEnum, PkmsFgWhReqApprovalEnum, PkmsFgWhCurrStageEnum, FgWhReqHeaderDetailsModel, PkmsFgWhReqTypeEnum } from '@xpparel/shared-models'
import { Button, Modal, Space } from 'antd'
import { useAppSelector } from 'packages/ui/src/common'
import { FgContainerToLocationAllocation } from '../../location-update'

interface IFGWALocationMappingTabProps {
  statusUpdate: () => void
}
export default function FGWALocationMappingTab(props: IFGWALocationMappingTabProps) {
  const { statusUpdate } = props

  const [viewModal, setViewModal] = useState<boolean>(false)
  const user = useAppSelector((state) => state.user.user.user);
  const [dummyRefreshKey, setDummyRefreshKey] = useState<number>(0)



  const closeModal = () => {
    setViewModal(false);
    statusUpdate();
    setDummyRefreshKey(dummyRefreshKey + 1)
  }

  const handleViewClick = (rec: FgWhReqHeaderDetailsModel) => {
    setViewModal(true);
    setDummyRefreshKey(dummyRefreshKey + 1)
  }

  const actionColumns = [{
    title: 'Action',
    render: (v, rec: FgWhReqHeaderDetailsModel) => {
      return <Space>
        <Button
          key={rec.requestId}
          onClick={() => {
            handleViewClick(rec)

          }}
          type='primary'
        >Location Mapping
        </Button>
      </Space>

    }
  }]

  return (
    <>
      <FGWAReqHeaderTable approvalStatus={PkmsFgWhReqApprovalEnum.APPROVED} reqType={PkmsFgWhReqTypeEnum.IN} currentStage={[PkmsFgWhCurrStageEnum.PALLET_MAP_COMPLETED, PkmsFgWhCurrStageEnum.LOC_MAP_PROGRESS]} actionColumns={actionColumns} tab={FgWhInActivityActionsEnum.LOCATION_MAPPING} />
      <Modal
        style={{ top: 0, minHeight: '90Vh' }}
        open={viewModal}
        onOk={closeModal}
        width={'100%'}
        closable
        onCancel={closeModal}
      >
        {viewModal && <FgContainerToLocationAllocation
          key={dummyRefreshKey}

        />}
      </Modal>
    </>
  )
}
