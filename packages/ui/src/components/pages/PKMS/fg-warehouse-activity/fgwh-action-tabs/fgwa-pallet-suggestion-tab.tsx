import { FgWhHeaderIdReqDto, FgWhInActivityActionsEnum, FgwhPackListIdsModel, PkmsFgWhReqApprovalEnum, PkmsFgWhCurrStageEnum, FgWhReqHeaderDetailsModel, PkmsFgWhReqTypeEnum } from '@xpparel/shared-models'
import { PKMSFgWarehouseService } from '@xpparel/shared-services'
import { Button, Modal, Space } from 'antd'
import { useAppSelector } from 'packages/ui/src/common'
import { useState } from 'react'
import { ContainerGroupSuggestions } from '../../container-allocation/container-group-suggestions'
import FGWAReqHeaderTable from '../fgwh-req-header-table'

export default function FGWAPalletSuggestionTab() {

  const [viewModal, setViewModal] = useState<boolean>(false)
  const [selectedRecord, setSelectedRecord] = useState<FgWhReqHeaderDetailsModel>()
  const [packlistIdData,setPacklistIdData] = useState<FgwhPackListIdsModel>()
  const user = useAppSelector((state) => state.user.user.user);

  const fgWHService = new PKMSFgWarehouseService()

  const closeModal = () => {
    setViewModal(false)
  }

  const handlieViewClick = (rec:FgWhReqHeaderDetailsModel) => {
    getPackListIdsForHeaderReqId(rec.requestId)
   


  }

  const getPackListIdsForHeaderReqId = (fgwhHeadReqId: number) => {
    const req = new FgWhHeaderIdReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,fgwhHeadReqId)
    fgWHService.getPackListIdsForHeaderReqId(req).then((res) => {
      if(res.status){
        setPacklistIdData(res.data)
        setViewModal(true)
      }
    }).catch(err => console.log(err.message))
  }
  

  const actionColumns = [{
    title: 'Action',
    render: (v, rec: FgWhReqHeaderDetailsModel) => {
      return <Space>
        <Button key={rec.requestId} onClick={() => { handlieViewClick(rec) }} type='primary'>View suggestions</Button>
      </Space>
    }
  }]
  return (
    <>
      <FGWAReqHeaderTable approvalStatus={PkmsFgWhReqApprovalEnum.APPROVED} reqType={PkmsFgWhReqTypeEnum.IN} currentStage={[PkmsFgWhCurrStageEnum.FG_IN_COMPLETE]} actionColumns={actionColumns} tab={FgWhInActivityActionsEnum.PALLET_SUGGESTION} />
      <Modal open={viewModal} onOk={closeModal} width={'80%'} closable onCancel={closeModal}>
       {viewModal && <>{packlistIdData.packListIds.map(packListId=><ContainerGroupSuggestions packListId={packListId}/>)}</>}
      </Modal>
    </>)
}
