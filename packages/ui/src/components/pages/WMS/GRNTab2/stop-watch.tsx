import { GRNPauseReasonsEnum, GrnUnLoadingModel, GrnUnLoadingRequest, PackingListSummaryModel } from '@xpparel/shared-models';
import { GrnServices } from '@xpparel/shared-services';
import { Button, Form, Modal } from 'antd';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import { GrnRemarks } from './grn-remarks';
import './stop-watch-style.css';

interface IStopWatchProps {
    grnUnLoadData: GrnUnLoadingModel
    summeryDataRecord: PackingListSummaryModel;
    setElapsedSeconds: Dispatch<SetStateAction<number>>;
    elapsedSeconds: number
}
export const Stopwatch = (props: IStopWatchProps) => {
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const { elapsedSeconds, setElapsedSeconds, summeryDataRecord, grnUnLoadData } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const grnServices = new GrnServices();

    useEffect(() => {
        if (!isPaused) {
            intervalRef.current = window.setInterval(() => {
                setElapsedSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current !== null) {
                // const isConfirmed = window.confirm('Are you sure you want to proceed?');
                // if (isConfirmed) {
                //     grnUnLoadingPauseUpdate(GRNPauseReasonsEnum.TechnicalIssues, intervalRef.current);
                // }
                clearInterval(intervalRef.current);
            }
        };
    }, [isPaused]);

    const grnUnLoadingPauseUpdate = (remarks?: GRNPauseReasonsEnum, timer?: number) => {
        const versionFlag = 0; // Todo
        const reqModel: GrnUnLoadingRequest = new GrnUnLoadingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, grnUnLoadData.id, summeryDataRecord.id, new Date(summeryDataRecord.unloadingStartTime), undefined, new Date(), timer ? timer : elapsedSeconds, remarks ? remarks : formRef.getFieldValue('remarks'), undefined, versionFlag);
        grnServices.grnUnLoadingPauseUpdate(reqModel).then(res => {
            if (res.status) {
                setIsPaused(true);
                setIsModalOpen(false)
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        })
    }


    const togglePause = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        grnUnLoadingPauseUpdate()
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsPaused(false);
    };


    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            remainingSeconds: remainingSeconds.toString().padStart(2, '0'),
        };
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="stopwatch-container"
                style={{
                    textAlign: 'center'
                }}
            >
                <div className="time-card">
                    <div className="time-card-value" >{formatTime(elapsedSeconds).hours}</div>
                </div>
                <div className="time-card">
                    <div className="time-card-value" >{formatTime(elapsedSeconds).minutes}</div>
                </div>
                <div className="time-card">
                    <div className="time-card-value">{formatTime(elapsedSeconds).remainingSeconds}</div>
                </div>
            </div>
            <Button onClick={togglePause} type="primary" style={{ marginLeft: '10px' }}>
                {isPaused ? 'Resume' : 'Pause'}
            </Button>

            <Modal
                title="Grn Remarks"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <GrnRemarks formRef={formRef} />
            </Modal>
        </div>
    );
};
