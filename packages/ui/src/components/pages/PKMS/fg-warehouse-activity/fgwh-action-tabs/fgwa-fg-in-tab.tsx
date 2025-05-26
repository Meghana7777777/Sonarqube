import React, { useState } from 'react'
import FGWAReqHeaderTable from '../fgwh-req-header-table'
import { PkmsFgWhReqApprovalEnum, PkmsFgWhCurrStageEnum, FgWhReqHeaderDetailsModel, PkmsFgWhReqTypeEnum } from '@xpparel/shared-models'
import { Button, Modal, Space } from 'antd'
import FgInScan from '../../fg-check-in-checkout/fg-in';


interface Props {
    statusUpdate: () => void
}

export default function FGWAFgInTab({ statusUpdate }: Props) {

    const [viewScanModal, setViewScanModal] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<FgWhReqHeaderDetailsModel>();
    const [sessionStarted, setSessionStarted] = useState(false);
    const [dummyRefresh, setDummyRefresh] = useState<number>(0)


    const handleScan = (rec: FgWhReqHeaderDetailsModel) => {
        setDummyRefresh(dummyRefresh + 1)
        setSelectedRecord(rec);
        setViewScanModal(true);
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
        {
            title: 'Action',
            render: (v, rec: FgWhReqHeaderDetailsModel) => {
                return <Space>
                    <Button key={rec.requestId} onClick={() => handleScan(rec)} type='primary'>Scan</Button>
                </Space>
            }
        }]

    const onScanOk = () => {
        closeModal()
    }


    const closeModal = () => {
        setViewScanModal(false);
        statusUpdate();
    }

    const ScanStatusUpdate = () => {
        statusUpdate();
    }


    return (
        <>
            <FGWAReqHeaderTable
                approvalStatus={PkmsFgWhReqApprovalEnum.APPROVED}
                reqType={PkmsFgWhReqTypeEnum.IN}
                currentStage={[PkmsFgWhCurrStageEnum.PRINT, PkmsFgWhCurrStageEnum.FG_IN_PROGRESS]}
                actionColumns={actionColumns}
            />
            <Modal
                style={{ top: 0, minHeight: '90Vh' }}
                open={viewScanModal}
                width={'100%'}
                footer={false}
                closable={!sessionStarted}
                onCancel={() => {
                    setDummyRefresh(dummyRefresh + 1)
                    setViewScanModal(false);
                    setSessionStarted(false)
                }}
            >
                <FgInScan
                    key={dummyRefresh}
                    sessionStarted={sessionStarted}
                    setSessionStarted={setSessionStarted}
                    whreqHeadId={selectedRecord?.requestId}
                    onSessionEnd={closeModal}
                    pendingCartonsDefault={selectedRecord?.pendingCartons}
                    ScanstatusUpdate={ScanStatusUpdate}
                    scanStartTime={selectedRecord?.scanStartTime}
                    selectedRecord={selectedRecord}
                    setDummyRefresh={setDummyRefresh}


                />
            </Modal >
        </>
    )
}
