import React, { useState } from 'react'
import { FGContainerToCartonAllocation } from '../../location-update'
import FGWAReqHeaderTable from '../fgwh-req-header-table'
import { FgWhInActivityActionsEnum, PkmsFgWhReqApprovalEnum, PkmsFgWhCurrStageEnum, FgWhReqHeaderDetailsModel, PkmsFgWhReqTypeEnum } from '@xpparel/shared-models'
import { useAppSelector } from 'packages/ui/src/common'
import { Button, Modal, Space } from 'antd'
interface IFGWAPalletisationTabProps {
  statusUpdate: () => void
}
export default function FGWAPalletisationTab(props: IFGWAPalletisationTabProps) {
  const { statusUpdate } = props;
  const [viewModal, setViewModal] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user.user.user);
  const [pendingBarCodes, setPendingBarCodes] = useState<string[]>([]);
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
        <Button key={rec.requestId} onClick={() => {
          handleViewClick(rec);
          setPendingBarCodes(rec.pendingCartonBarCodes)
        }} type='primary'>Palletisation</Button>
      </Space>
    }
  }]
  return (
    <>
      <FGWAReqHeaderTable
        approvalStatus={PkmsFgWhReqApprovalEnum.APPROVED}
        reqType={PkmsFgWhReqTypeEnum.IN}
        currentStage={[PkmsFgWhCurrStageEnum.FG_IN_COMPLETE, PkmsFgWhCurrStageEnum.PALLET_MAP_PROGRESS]}
        actionColumns={actionColumns}
        tab={FgWhInActivityActionsEnum.PALLETISATION}
      />
      <Modal 
        style={{ top: 0, minHeight: '90Vh' }}
        open={viewModal}
        onOk={closeModal}
        width={'100%'}
        closable
        onCancel={closeModal}>
        <FGContainerToCartonAllocation
          pendingBarCodes={pendingBarCodes}
          key={dummyRefreshKey}
        />
      </Modal>
    </>
  )
}
