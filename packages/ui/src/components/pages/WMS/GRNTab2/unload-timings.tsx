import { GrnConfirmRequest, GrnUnLoadingModel, GrnUnLoadingRequest, PackListLoadingStatus, PackingListSummaryModel } from '@xpparel/shared-models';
import { GrnServices } from '@xpparel/shared-services';
import { Form } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import DatePicker from '../../../common/data-picker/date-picker';
interface IUnloadTimingsProps {
    summeryDataRecord: PackingListSummaryModel;
    grnUnLoadData: GrnUnLoadingModel;
    getGrnUnloadingDetails: () => void;
    setElapsedSeconds: Dispatch<SetStateAction<number>>;
    elapsedSeconds: number
};
const { TimePicker } = DatePicker;
export const UnloadTimings = (props: IUnloadTimingsProps) => {
    const [formRef] = Form.useForm();
    const { summeryDataRecord, grnUnLoadData, getGrnUnloadingDetails, elapsedSeconds, setElapsedSeconds, } = props;
    const user = useAppSelector((state) => state.user.user.user);
    // const [unloadingStartTimeValue, setUnloadingStartTimeValue] = useState(grnUnLoadData.originalUnloadingStartTime ? new Date(grnUnLoadData.originalUnloadingStartTime) : undefined);
    const [showModal, setShowModal] = useState<boolean>(false)
    const [unloadingEndTimeValue, setUnloadingEndTimeValue] = useState<Date>();

    const grnServices = new GrnServices();

    useEffect(() => {
        if (grnUnLoadData.status == PackListLoadingStatus.UN_LOADING_COMPLETED || grnUnLoadData.status == PackListLoadingStatus.OUT) {
            // setUnloadingEndTimeValue(new Date(grnUnLoadData.originalUnloadingCompletedTime));
        }
    }, [grnUnLoadData]);


    const handleUnloadCompleted = () => {
        const now = new Date();
        setUnloadingEndTimeValue(now);
        const reqModel: GrnUnLoadingRequest = new GrnUnLoadingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.phVehicleId, summeryDataRecord.id, new Date(), grnUnLoadData.originalUnloadingStartTime, undefined, elapsedSeconds, undefined, undefined,0);
        grnServices.grnUnLoadingCompleteUpdate(reqModel).then(res => {
            if (res.status) {
                getGrnUnloadingDetails();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        })
    };

    const calculateUnloadTime = () => {
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        return <div className="stopwatch-container"
            style={{
                textAlign: 'center'
            }}
        ><b>Unloading Time:</b>
            <div className="time-card">
                <div className="time-card-value" >{hours}</div>
            </div>
            <div className="time-card">
                <div className="time-card-value" >{minutes}</div>
            </div>
            <div className="time-card">
                <div className="time-card-value">{seconds}</div>
            </div>
        </div>
    };


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

    return (
        <>

        </>
    );
};
