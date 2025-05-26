import { QuestionCircleOutlined } from '@ant-design/icons';
import { ADDHistoryReqModel, GRNPauseReasonsEnum, GrnUnLoadingModel, GrnUnLoadingRequest, PackListLoadingStatus, PackListVehicleIdModel, TruckStateEnum, VehicleModal } from '@xpparel/shared-models';
import { GatexService, GrnServices } from '@xpparel/shared-services';
import { Button, Col, Form, Modal, Popconfirm, Row, Select, Typography } from 'antd';
import moment from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import React, { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import { getProperDateWithTime } from '../../../common/helper-functions';
import './st.css';
const { Title } = Typography;

interface StopwatchProps {
    vehicleId: number;
    phId: number;
    callGrn?: () => void;
    vehicleDetails: VehicleModal[]
}

const StopwatchNew: React.FC<StopwatchProps> = (props: StopwatchProps) => {
    const { phId, vehicleId, vehicleDetails } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [running, setRunning] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [backEndTime, setBackEndTime] = useState<number>(0); // Saved Time
    const [grnUnloadInfo, setGrnUnLoadInfo] = useState<GrnUnLoadingModel>(undefined);
    const [gatexVehicleId, setGatexVehicleId] = useState<number>(undefined);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const grnServices = new GrnServices();
    const gatexService = new GatexService();
    const { Text } = Typography;
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (running) {
            setStartTime(backEndTime ? backEndTime : Date.now() - elapsedTime);
            intervalId = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 1000);
        } else if (!running && startTime !== 0) {
            clearInterval(intervalId as NodeJS.Timeout);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [running, startTime, elapsedTime]);

    useEffect(() => {
        if (props.vehicleId) {
            getGrnUnloadingDetails()
        }
    }, [])

    const handleStart = () => {
        const versionFlag = 0; // Todo
        const reqModel: GrnUnLoadingRequest = new GrnUnLoadingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, vehicleId, phId, moment.utc(new Date()).toDate(), undefined, undefined, undefined, undefined, undefined, versionFlag)
        grnServices.grnUnLoadingStartOrResumeUpdate(reqModel).then(res => {
            if (res.status) {
                if (!running) {
                    setRunning(true);
                }
                getGrnUnloadingDetails();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        });
        const req: ADDHistoryReqModel = new ADDHistoryReqModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, String(phId), gatexVehicleId, TruckStateEnum.UNLOADING);
        if (gatexVehicleId)
            addHistoryToGatex(req);
    };
    const getGrnUnloadingDetails = () => {
        const getReqModel: PackListVehicleIdModel = new PackListVehicleIdModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, vehicleId, phId);
        grnServices.getGrnUnloadingDetails(getReqModel).then(res => {
            if (res.status) {
                const grnUnloadRecord = res.data[0];
                const gatexVehicleData = vehicleDetails.find((rec) => rec.vehicleNo === grnUnloadRecord.vehicleNumber);
                setGatexVehicleId(gatexVehicleData?.id);
                setGrnUnLoadInfo(grnUnloadRecord);
                if (grnUnloadRecord.status == PackListLoadingStatus.UN_LOADING_START) {
                    // setShowScanner(true);
                    setRunning(true);
                    const initialTime = new Date(grnUnloadRecord.lastUnloadStartTime).getTime();
                    const ms = (initialTime - (grnUnloadRecord.totalUnloadingSpentSeconds * 1000));
                    setBackEndTime(ms);
                    setStartTime(ms)
                    props.callGrn();
                } else {
                    setRunning(false);
                    setBackEndTime((grnUnloadRecord.totalUnloadingSpentSeconds * 1000));
                }

            } else {
                // setRunning(false);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        })
    }

    const handlePause = () => {
        setIsModalOpen(true);

    };

    // const formatTime = (ms: number): string => {
    //     const hours = Math.floor(ms / 3600000);
    //     const minutes = Math.floor((ms % 3600000) / 60000);
    //     const seconds = Math.floor((ms % 60000) / 1000);
    //     return `${hours.toString().padStart(2, '0')}:${minutes
    //         .toString()
    //         .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // };
    const formatTime = (ms: number): JSX.Element => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);

        return (
            <div className="time-display">
                <div className='number-box' key='h'><span className="counter-digit">{hours.toString().padStart(2, '0')}</span> <span className="counter-divider">:</span> </div>
                <div className='number-box' key='m'>  <span className="counter-digit">{minutes.toString().padStart(2, '0')}</span> <span className="counter-divider">:</span>  </div>
                <div className='number-box' key='s'>  <span className="counter-digit">{seconds.toString().padStart(2, '0')}</span></div>
            </div>
        );
    };
    const { Option } = Select;

    const grnUnLoadingPauseUpdate = () => {
        const versionFlag = grnUnloadInfo.versionFlag;
        const curDateTime = moment().local().toDate();
        const reqModel: GrnUnLoadingRequest = new GrnUnLoadingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, vehicleId, phId, new Date(grnUnloadInfo.originalUnloadingStartTime), curDateTime, curDateTime, 0, form.getFieldValue('remarks'), undefined, versionFlag)
        grnServices.grnUnLoadingPauseUpdate(reqModel).then(res => {
            if (res.status) {
                setRunning(true);
                setIsModalOpen(false);
                getGrnUnloadingDetails();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        })
        const req: ADDHistoryReqModel = new ADDHistoryReqModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, String(phId), gatexVehicleId, TruckStateEnum.PAUSE);
        if (gatexVehicleId)
            addHistoryToGatex(req);
    }
    const handleUnloadCompleted = () => {
        const versionFlag = grnUnloadInfo.versionFlag;
        const curDateTime = moment().local().toDate();
        const reqModel: GrnUnLoadingRequest = new GrnUnLoadingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, vehicleId, phId, new Date(grnUnloadInfo.originalUnloadingStartTime), curDateTime, curDateTime, 0, undefined, undefined, versionFlag);
        grnServices.grnUnLoadingCompleteUpdate(reqModel).then(res => {
            if (res.status) {
                getGrnUnloadingDetails();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        });
        const req: ADDHistoryReqModel = new ADDHistoryReqModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, String(phId), gatexVehicleId, TruckStateEnum.UNLOAD_COMPLETED);
        if (gatexVehicleId)
            addHistoryToGatex(req);

    };

    const addHistoryToGatex = (req: ADDHistoryReqModel) => {
        gatexService.addHistoryRecords(req).then(res => {
            if (res.status) {
                setRunning(true);
                setIsModalOpen(false);
                getGrnUnloadingDetails();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        })
    }

    const handleOk = () => {
        grnUnLoadingPauseUpdate()
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const titleStyle: React.CSSProperties = {
        margin: 0,

    };
    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    };
    const tailLayout = {
        wrapperCol: { offset: 10, span: 14 },
    };
    const isUnloadNotCompleted = (!(grnUnloadInfo?.status == (PackListLoadingStatus.OUT) || grnUnloadInfo?.status == (PackListLoadingStatus.UN_LOADING_COMPLETED)));
    return (
        <>
            <Row gutter={16}>
                <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 12, order: 2 }} lg={{ span: 6, order: 1 }} xl={{ span: 6, order: 1 }} >
                    <Typography.Title level={4} key='stat' style={titleStyle}>Started AT : {grnUnloadInfo ? getProperDateWithTime(grnUnloadInfo.originalUnloadingStartTime, true) : ''}</Typography.Title>
                </Col>
                <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 12, order: 2 }} lg={{ span: 6, order: 1 }} xl={{ span: 6, order: 1 }} >
                    {grnUnloadInfo?.originalUnloadingStartTime ?
                        running ? '' :
                            isUnloadNotCompleted ?
                                <Typography.Title level={4} key='pt' style={titleStyle}>Paused AT : {grnUnloadInfo ? getProperDateWithTime(grnUnloadInfo.unloadingPauseTime, true) : ''}</Typography.Title>
                                : <Typography.Title level={4} key='end' style={titleStyle}>End Time : {grnUnloadInfo ? getProperDateWithTime(grnUnloadInfo.originalUnloadingCompletedTime, true) : ''}</Typography.Title>
                        : ''}
                </Col>
                <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 12, order: 2 }} lg={{ span: 6, order: 1 }} xl={{ span: 6, order: 1 }} >
                    {formatTime(running ? elapsedTime : backEndTime)}
                    {running ? <Button style={{}} danger key='pause' type='primary' onClick={handlePause}>Pause</Button> :
                        isUnloadNotCompleted ?
                            <Button type="primary" key='res' onClick={handleStart} disabled={!grnUnloadInfo}>
                                {grnUnloadInfo ? grnUnloadInfo.status == PackListLoadingStatus.UN_LOADING_PAUSED ? "Resume" : " Start Unload" : '----'}
                            </Button> : ''
                    }</Col>
                <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 12, order: 2 }} lg={{ span: 6, order: 1 }} xl={{ span: 6, order: 1 }} >
                    {grnUnloadInfo?.originalUnloadingStartTime ?
                        isUnloadNotCompleted ?
                            <Popconfirm
                                title="Are you sure to Finish Unload"
                                // description="Are you sure to delete this task?"
                                onConfirm={handleUnloadCompleted}
                                // onCancel={cancel}
                                icon={<QuestionCircleOutlined style={{ color: 'Orange' }} />}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button style={{}} key='fin' className='btn-orange' >Finish Unload</Button>
                            </Popconfirm>
                            : <Typography.Title level={4} style={{ ...titleStyle, "color": 'green' }} className='blinking-text'>Unload Completed</Typography.Title>
                        : ''}
                </Col>
            </Row>
            <Modal
                title="Unload Pause"
                open={isModalOpen}
                // onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="Cancel" onClick={handleCancel}>
                        Cancel
                    </Button>

                ]}
            >
                <Row justify="center" gutter={[16, 16]}>
                    {/* <Col xs={24} lg={15}> */}
                    <Form form={form} {...layout} labelAlign="left" key='un' onFinish={handleOk} style={{ width: '90%' }}>
                        <Form.Item
                            label="Unload Pause Reason"
                            name="remarks"
                            rules={[{ required: true, message: 'Select Pause Reason' }]}>
                            <Select filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '100%' }} placeholder='Please Select'>
                                {Object.keys(GRNPauseReasonsEnum).map(reason => {
                                    const val = GRNPauseReasonsEnum[reason];
                                    return <Option key={val} value={val}>{val}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item key={'sub'} {...tailLayout}>
                            <Button type="primary" key={'sBtn'} htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>

                    </Form>
                    {/* </Col> */}
                </Row>
            </Modal>
        </>
    );
};

export default StopwatchNew;
