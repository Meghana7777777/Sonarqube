import { ADDVehicleReqModal, GrnConfirmRequest, GrnStatusEnum, GrnUnLoadingModel, LocationFromTypeEnum, PackListVehicleIdModel, PackingListSummaryModel, VehicleModal } from '@xpparel/shared-models';
import { GatexService, GrnServices } from '@xpparel/shared-services';
import { Card, Form, Input, Modal } from 'antd';
import moment from 'moment';
import { ScxButton, ScxColumn, ScxRow } from 'packages/ui/src/schemax-component-lib';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import DatePicker from '../../../common/data-picker/date-picker';
import Batches from './batches';
import StopwatchNew from './stopwatch';

interface IStartUnloadButtonProps {
    summeryDataRecord: PackingListSummaryModel
}
export const GRNUnLoadingPage = (props: IStartUnloadButtonProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;
    const [grnUnLoadData, setGrnUnLoadData] = useState<GrnUnLoadingModel[]>([]);
    const [vehicleDetails, setVehicleDetails] = useState<VehicleModal[]>([]);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const { summeryDataRecord } = props;
    const [showScanner, setShowScanner] = useState(false);
    const grnServices = new GrnServices();
    const gatexService = new GatexService();
    const [formRef] = Form.useForm();
    const [showModal, setShowModal] = useState<boolean>(false)
    useEffect(() => {
        getVehicleDetails();
        getGrnUnloadingDetails();
    }, [])


    const getVehicleDetails = () => {
        const vehicleReq = new ADDVehicleReqModal(String(summeryDataRecord.id), undefined, LocationFromTypeEnum.SUPP, [], undefined, orgData.uniCode, orgData.companyCode, undefined);
        gatexService.getVehicleDetails(vehicleReq).then(res => {
            if (res.status) {
                setVehicleDetails(res.data.vehicleDetails)
            } else {
                setVehicleDetails([])
            }
        }).catch(err => {
            console.log(err)
        })

    }



    const getGrnUnloadingDetails = () => {
        const getReqModel: PackListVehicleIdModel = new PackListVehicleIdModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, summeryDataRecord.id);
        grnServices.getGrnUnloadingDetails(getReqModel).then(res => {
            if (res.status) {
                if (res.data[0]?.originalUnloadingStartTime) {
                    setShowScanner(true);
                }
                setGrnUnLoadData(res.data);
            } else {
                // updateUnLoadingStartOrResume()
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        })
    }


    const confirmGrn = () => {
        formRef.validateFields().then(vals => {
            const grnDate = vals['date'];
            const remarks = vals['remarks'];
            const grnNo = vals['grn_number'];

            const request = new GrnConfirmRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.id, grnNo, true, grnDate, remarks);
            grnServices.confirmGrn(request).then((res) => {
                if (res.status) {
                    setShowModal(false);
                    getGrnUnloadingDetails();
                    AlertMessages.getSuccessMessage(res.internalMessage);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }).catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                console.log(err.message);
            })

        }).catch(err => {
            return false;
        });
    }
    const showGrnData = () => {
        setShowScanner(true);
    }
    return (
        <Card title='Unloading' size='small'>
            {/* <StopwatchNew vehicleId={summeryDataRecord.phVehicleId} phId={summeryDataRecord.id}/> */}
            <ScxRow justify="center" align="middle">
                <ScxColumn span={24} style={{ textAlign: 'center' }}>

                    {summeryDataRecord &&
                        grnUnLoadData.map(rec => <Card title={<>vehicle No: {rec.vehicleNumber}</>}><StopwatchNew phId={summeryDataRecord.id} callGrn={showGrnData} vehicleId={rec.id} vehicleDetails={vehicleDetails}/></Card>)}
                    {showScanner ?
                        <ScxRow>
                            <ScxColumn xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} style={{ marginTop: '1rem' }}>
                                <Batches summeryDataRecord={summeryDataRecord} />
                            </ScxColumn>
                            <ScxColumn xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} style={{ float: 'right' }}>
                                <ScxButton type="primary" onClick={() => setShowModal(true)} style={{ marginTop: '1rem' }} disabled={grnUnLoadData[0]?.grnStatus == GrnStatusEnum.GRN_CONFIRMED}>
                                    Confirm GRN
                                </ScxButton>
                            </ScxColumn>
                        </ScxRow>
                        : ''}
                    <Modal open={showModal} onCancel={() => setShowModal(false)} onOk={() => { confirmGrn() }}>
                        <ScxRow>
                            <ScxColumn span={20}>
                                <Form form={formRef}>
                                    <ScxRow justify='space-around'>
                                        <ScxColumn>
                                            <Form.Item
                                                label="GRN Date"
                                                name="date"
                                                rules={[{ required: true, message: 'Select the date' }]}
                                                initialValue={moment()}
                                            >
                                                <DatePicker />
                                            </Form.Item>
                                        </ScxColumn>
                                        <ScxColumn>
                                            <Form.Item
                                                label="GRN Number"
                                                name="grn_number"
                                                rules={[{ required: true, message: 'Enter the grn number' }]}
                                                initialValue={""}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </ScxColumn>
                                    </ScxRow>
                                    <ScxRow justify='space-around'>
                                        <ScxColumn>
                                            <Form.Item
                                                label="Remarks"
                                                name="remarks"
                                                rules={[{ message: 'Enter the remarks' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </ScxColumn>
                                    </ScxRow>
                                </Form>
                            </ScxColumn>
                        </ScxRow>
                    </Modal>
                </ScxColumn>
            </ScxRow>
        </Card>
    );
};
