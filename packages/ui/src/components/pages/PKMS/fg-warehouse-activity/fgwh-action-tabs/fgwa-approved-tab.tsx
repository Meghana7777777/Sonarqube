import { FgWhHeaderIdReqDto, FgwhPackListIdsModel, PkmsFgWhReqApprovalEnum, PkmsFgWhCurrStageEnum, FgWhReqHeaderDetailsModel, PkmsFgWhReqTypeEnum, FgwhSecurityUpdateReq, FgWhStageReq } from '@xpparel/shared-models';
import { PKMSFgWarehouseService } from '@xpparel/shared-services';
import { Button, Form, Modal, Space } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useState } from 'react';
import FGWAReqHeaderTable from '../fgwh-req-header-table';
import FGWHVehicleReqForm from '../fgwh-vehicle-req-from';
import CheckListReport from '../../__masters__/prints/check-list-report-print';
import { FgWhReqSecurityStatusEnum } from 'packages/libs/shared-models/src/pkms/enum/fg-wh-req-security-status.enum';

interface Props {
    reqType: PkmsFgWhReqTypeEnum
    statusUpdate: () => void
}
export default function FGWAApprovedTab({ reqType, statusUpdate }: Props) {
    const user = useAppSelector((state) => state.user.user.user);
    const [selectedRecord, setSelectedRecord] = useState<FgWhReqHeaderDetailsModel>()
    const [viewVehicleDtlModal, setVehicleDtlModal] = useState<boolean>(false)
    const [viewPrintModal, setViewPrintModal] = useState<boolean>(false)
    const [packlistIdData, setPacklistIdData] = useState<FgwhPackListIdsModel>()

    const fgWHService = new PKMSFgWarehouseService()
    const [securityForm] = Form.useForm()

    const handleSecurityCheckClick = (rec: FgWhReqHeaderDetailsModel) => {
        setSelectedRecord(rec)
        setVehicleDtlModal(true)
    }

    const closeModal = () => {
        setVehicleDtlModal(false)
        setViewPrintModal(false)
    }

    const updateSecurityDetaisl = () => {
        securityForm.validateFields().then(formValues => {
            const req = new FgwhSecurityUpdateReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedRecord.requestId, FgWhReqSecurityStatusEnum.SECURITY_IN, formValues.vehicleType, formValues.securityName)
            fgWHService.updateSecurityDetails(req).then((res) => {
                if (res.status) {
                    setVehicleDtlModal(false)
                    statusUpdate();
                    securityForm.resetFields();
                    AlertMessages.getSuccessMessage(res.internalMessage)
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)

                }
            }).catch(err => console.log(err.message))
        }).catch(err => console.log(err))


    }

    const getPackListIdsForHeaderReqId = (fgwhHeadReqId: number) => {
        const req = new FgWhHeaderIdReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, fgwhHeadReqId)
        fgWHService.getPackListIdsForHeaderReqId(req).then((res) => {
            if (res.status) {
                setPacklistIdData(res.data)
                setViewPrintModal(true)
            }
        }).catch(err => console.log(err.message))
    }

    const handlePrintClick = (rec: FgWhReqHeaderDetailsModel) => {
        setSelectedRecord(rec)
        getPackListIdsForHeaderReqId(rec.requestId)
    }

    const updatePrintStatus = () => {
        const req = new FgWhStageReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, PkmsFgWhCurrStageEnum.PRINT, selectedRecord.requestId)
        fgWHService.updateFgWhReqStage(req).then((res) => {
            if (res.status) {
                statusUpdate()
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => console.log(err.message)).finally(() => setViewPrintModal(false))
    }


    const inActionColumns = [{
        title: 'Action',
        render: (v, rec: FgWhReqHeaderDetailsModel) => {
            return <Space>
                <Button onClick={() => handleSecurityCheckClick(rec)} type='primary'>Security In</Button>
            </Space>
        }
    }]

    const outActionColumns = [
        {
            title: 'Action',
            render: (v, rec: FgWhReqHeaderDetailsModel) => {
                return <Space>
                    <Button onClick={() => handlePrintClick(rec)} type='primary'>Print</Button>
                </Space>
            }
        }
    ]

    const actionColumns = {
        [PkmsFgWhReqTypeEnum.IN]: inActionColumns,
        [PkmsFgWhReqTypeEnum.OUT]: outActionColumns
    }

    return (
        <>
            <FGWAReqHeaderTable
                approvalStatus={PkmsFgWhReqApprovalEnum.APPROVED}
                reqType={reqType} currentStage={[PkmsFgWhCurrStageEnum.APPROVED]}
                actionColumns={actionColumns[reqType]}
            />
            <Modal
                open={viewVehicleDtlModal}
                onOk={updateSecurityDetaisl}
                width={'50%'}
                closable
                onCancel={closeModal}
            >
                <FGWHVehicleReqForm
                    form={securityForm}

                />
            </Modal>
            <Modal
                open={viewPrintModal}
                onOk={updatePrintStatus}
                width={'70%'}
                closable
                onCancel={closeModal}
            >
                {packlistIdData ?
                    <CheckListReport
                        title='FG Pick list'
                        plIds={packlistIdData.packListIds}
                        userFromModal={user}
                        packListCartoonIds={[]}
                        whReqIds={[selectedRecord?.requestId]}
                        reqTyp={reqType}
                    /> : <></>}
            </Modal>


        </>
    )
}
