import { FgWhReqHeaderDetailsModel, FgWhStageReq, PkmsFgWhCurrStageEnum, PkmsFgWhReqApprovalEnum, PkmsFgWhReqTypeEnum } from '@xpparel/shared-models'
import { PKMSFgWarehouseService } from '@xpparel/shared-services'
import { Button, Modal, Space } from 'antd'
import { useAppSelector } from 'packages/ui/src/common'
import { useState } from 'react'
import { AlertMessages } from '../../../../common'
import PickListDataPrint from '../fg-warehouse-creation/fg-create-request/pick-list-data'
import FGWAReqHeaderTable from '../fgwh-req-header-table'

interface Props {
    statusUpdate: () => void
}

export default function FGWASecurityInTab({ statusUpdate }: Props) {
    const user = useAppSelector((state) => state.user.user.user);
    const [selectedRecord, setSelectedRecord] = useState<FgWhReqHeaderDetailsModel>()
    const fgWHService = new PKMSFgWarehouseService()
    const [viewPrintModal, setViewPrintModal] = useState<boolean>(false)

    const handleFgInClick = () => {
        updateFgInStatus()
    }

    const closeModal = () => {
        setViewPrintModal(false)
    }



    const handlePrintClick = () => {
        setViewPrintModal(true)
    }

    const updatePrintStatus = () => {
        const req = new FgWhStageReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, PkmsFgWhCurrStageEnum.PRINT, selectedRecord.requestId)
        fgWHService.updateFgWhReqStage(req).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                statusUpdate()
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => console.log(err.message)).finally(() => setViewPrintModal(false))
    }

    const updateFgInStatus = () => {
        const req = new FgWhStageReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, PkmsFgWhCurrStageEnum.FG_IN_PROGRESS, selectedRecord.requestId)
        fgWHService.updateFgWhReqStage(req).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => console.log(err.message)).finally(() => setViewPrintModal(false))
    }



    const handleActionClick = (rec: FgWhReqHeaderDetailsModel) => {
        setSelectedRecord(rec)
        if (rec.currentStage === PkmsFgWhCurrStageEnum.SECURITY_IN) {
            handlePrintClick()
        } else {
            handleFgInClick()
        }
    }




    const actionColumns = [
        {
            title: 'Action',
            render: (v, rec: FgWhReqHeaderDetailsModel) => {
                return <Space>
                    <Button
                        key={rec.requestId}
                        onClick={() => handleActionClick(rec)}
                        type='primary'>
                        {rec.currentStage === PkmsFgWhCurrStageEnum.SECURITY_IN ? "Print" : "FG In"}
                    </Button>
                </Space>
            }
        }
    ]

    return (
        <>
            <FGWAReqHeaderTable
                approvalStatus={PkmsFgWhReqApprovalEnum.APPROVED}
                reqType={PkmsFgWhReqTypeEnum.IN}
                currentStage={[PkmsFgWhCurrStageEnum.SECURITY_IN]}
                actionColumns={actionColumns}
            />
            <Modal
                title="Print"
                open={viewPrintModal}
                width={'70%'}
                closable
                onCancel={closeModal}
                onOk={updatePrintStatus}
            >
                {selectedRecord ?
                    <PickListDataPrint
                        plIds={[]}
                        fgWhReqIds={[selectedRecord?.requestId]}
                    />
                    // <DeliveryChalanPrint whReqHeaderId={selectedRecord?.requestId} />
                    : <></>}
            </Modal>
        </>
    )
}
