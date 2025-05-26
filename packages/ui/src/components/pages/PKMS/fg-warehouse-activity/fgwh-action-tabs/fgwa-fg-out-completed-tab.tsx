import { PkmsFgWhReqApprovalEnum, PkmsFgWhCurrStageEnum, FgWhReqHeaderDetailsModel, PkmsFgWhReqTypeEnum } from '@xpparel/shared-models';
import { Button, Modal, Space } from 'antd';
import React, { useState } from 'react'
import FGWAReqHeaderTable from '../fgwh-req-header-table';
import FgOutScan from '../../fg-check-in-checkout/fg-out';


interface Props{
    statusUpdate : () => void
}
export default function FGWAFgOutCompletedTab({statusUpdate}:Props) {
    const [viewScanModal, setViewScanModal] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<FgWhReqHeaderDetailsModel>() 
    const [sessionStarted, setSessionStarted] = useState(false);




    const handleScan = (rec) => {
        setViewScanModal(true)
        setSelectedRecord(rec)
    }

    const actionColumns = [
        {
            title: 'Cartons scanned',
            dataIndex: 'scannedCartons',
            key: 'scannedCartons',
        },
        {
            title: 'Pending cartons',
            dataIndex: 'pendingCartons',
            key: 'pendingCartons',
        },
        // {
        //     title: 'Action',
        //     render: (v, rec: FgWhReqHeaderDetailsModel) => {
        //         return <Space>
        //             <Button key={rec.requestId} onClick={() => handleScan(rec)} type='primary'>Scan</Button>
        //         </Space>
        //     }
        // }
    ]

    const closeModal = () => {
        setViewScanModal(false)
        statusUpdate()
    }

    return (
        <>
            <FGWAReqHeaderTable approvalStatus={PkmsFgWhReqApprovalEnum.APPROVED} reqType={PkmsFgWhReqTypeEnum.OUT} currentStage={[PkmsFgWhCurrStageEnum.FG_OUT_COMPLETE]} actionColumns={actionColumns} />
            <Modal
                style={{ top: 0, minHeight: '90Vh' }}
                open={viewScanModal}
                width={'100%'}
                footer={false}
                closable={!sessionStarted}
                onCancel={() => {
                    setViewScanModal(false);
                    setSessionStarted(false)
                }}
            >
                {selectedRecord ? <FgOutScan
                    whreqHeadId={selectedRecord.requestId}
                    onSessionEnd={closeModal}
                    pendingCartonsDefault={selectedRecord.pendingCartons}
                    selectedRecord={selectedRecord}
                    sessionStarted={sessionStarted}
                    setSessionStarted={setSessionStarted}

                /> : <></>}
            </Modal>
        </>
    )
}
