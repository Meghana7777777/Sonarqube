import { CutTableDocketPlanRequest, CutTableDocketsModel, CutTableIdRequest, CutTableModel, DocketPriorityModel, PlannedDocketGroupModel, WhMatReqLineStatusEnum } from '@xpparel/shared-models';
import { DocketPlanningServices } from '@xpparel/shared-services';
import { Badge, Button, Card, Divider, Empty, Modal, Popover, Row, Space, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { convertBackendDateToLocalTimeZone, useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import './cutting-work-stations.css';
import LayTimeUpdateComp from './laytime-update-comp';
import { LayReporting } from '../lay-reporting';


export interface ICuttingWorkStationsProps {
    cutTable: CutTableModel;
    refreshKey: number;
    refreshUnplannedDocs: () => void;
}
export const CuttingWorkStations = (props: ICuttingWorkStationsProps) => {
    const { cutTable, refreshUnplannedDocs, refreshKey } = props;
    const [cutTableDocketsModel, setCutTableDocketsModel] = useState<CutTableDocketsModel>();
    const [toolTipValue, setToolTipValue] = useState<string>('');
    const [openModal, setOpenModal] = useState(false);
    const [activeJob, setActiveJob] = useState<PlannedDocketGroupModel>();
    const [loading, setLoading] = useState(true);

    const user = useAppSelector((state) => state.user.user.user);

    const docketPlanningServices = new DocketPlanningServices();

    useEffect(() => {
        getPlannedDocketRequestsOfCutTable();
        setLoading(true);
    }, [refreshKey]);

    const getPlannedDocketRequestsOfCutTable = () => {
        const req: CutTableIdRequest = new CutTableIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, cutTable.id);
        docketPlanningServices.getPlannedDocketRequestsOfCutTable(req)
            .then((res) => {
                if (res.status) {
                    setCutTableDocketsModel(res.data[0]);
                } else {
                    setCutTableDocketsModel(null);
                }
                setLoading(false);
            })
            .catch((err) => {
                setCutTableDocketsModel(null);
                AlertMessages.getErrorMessage(err.message);
                setLoading(false);
            });
    }

    const planDocketRequestsToCutTable = (reqModel: CutTableDocketPlanRequest) => {
        docketPlanningServices.planDocketRequestsToCutTable(reqModel)
            .then((res) => {
                if (res.status) {
                    refreshUnplannedDocs();
                    getPlannedDocketRequestsOfCutTable();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }


    const onMouseOver = (jobId: string) => {
        setToolTipValue(jobId);
    }

    const onMouseLeave = (jobId: string) => {
        if (toolTipValue === jobId) {
            setToolTipValue('');
        };
    }

    const onDragStart = (event, docketWHReqData: PlannedDocketGroupModel) => {
        const docketWHReqDataString: string = JSON.stringify(docketWHReqData);
        event.dataTransfer.setData('docketInfo', docketWHReqDataString);
    }

    /**
     * Note 
     * on Drop if we plan on already planned job then it will be get that job priority otherwise will send priority undefined and it will updates as last priority
     */
    const onDrop = (event, droppedJobData: PlannedDocketGroupModel, cutTable: CutTableModel) => {
        const docketInfo: PlannedDocketGroupModel = JSON.parse(event.dataTransfer.getData('docketInfo'));
        const reqModel = new CutTableDocketPlanRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, cutTable.id, []);
        const jobInWorkstation = cutTableDocketsModel?.docketsInfo?.find(loadedJob => loadedJob.matReqNo === docketInfo.matReqNo);
        if (!jobInWorkstation) {
            if (droppedJobData) {
                docketInfo.priority = droppedJobData.priority;
            } else {
                docketInfo.priority = undefined;
            }
        } else {
            if (droppedJobData) {
                docketInfo.priority = droppedJobData.priority;
            }
        }
        // CORRECT
        const docketPriorityModel = new DocketPriorityModel(docketInfo.matReqNo, docketInfo.docketGroup, null, docketInfo.priority);
        reqModel.docketsList = [docketPriorityModel];
        planDocketRequestsToCutTable(reqModel);
        event.dataTransfer.clearData();
        event.stopPropagation();
    }

    const getHoverInfo = (job: PlannedDocketGroupModel) => {
        const uniqueValues = {
            soLines: new Set<string>(),
            components: new Set<string>(),
            docNumbers: new Set<string>(),
            colors: new Set<string>(),
            productNames: new Set<string>(),
            cutNumber:new Set<string>(),
            cutSubNumber:new Set <string>()
        };
        job.docketNumbers.forEach(d => {
            uniqueValues.soLines.add(d.moLine);
            d.components.forEach(c => uniqueValues.components.add(c));
            uniqueValues.docNumbers.add(d.docNumber);
            uniqueValues.colors.add(d.color);
            uniqueValues.productNames.add(d.productName);
            uniqueValues.cutNumber.add(d.cutNumber);
            uniqueValues.cutSubNumber.add(d.cutSubNumber);
        });

        return (
            <div>
                <span>So No: <b>{job.moNo}</b></span><br />
                <span>So Lines: <b>{[...uniqueValues.soLines]}</b></span><br />
                <span>Plant Style Ref : <b>{job.plantStyleRef}</b></span><br />
                <span>Req No: <b>{job.matReqNo}</b></span><br />
                <span>Req Qty: <b>{job.requestedQty.toFixed(2)} Yards</b></span><br />
                <span>Components: {[...uniqueValues.components].map(c => <Tag style={{ fontSize: '14px' }} color="cyan">{c}</Tag>)}</span><br />
                <span>Cut number: <b>{[...uniqueValues.cutSubNumber].join(', ')}</b></span><br />
                <span>Docket No: <b>{job.docketGroup}</b></span><br />
                <span>Sub Docket: <b>{[...uniqueValues.docNumbers].join(', ')}</b></span><br />
                <span>Color : <b>{[...uniqueValues.colors].join(', ')}</b></span><br />
                <span>Product Name : <b>{[...uniqueValues.productNames].join(',')}</b></span><br />
                <span>Dockets Created Date: <b>{job.docCreatedAt ? convertBackendDateToLocalTimeZone(job.docCreatedAt) : ''}</b></span><br />
                {(job.plannedDateTime) && <span>Cut Job Planned Date: <b>{convertBackendDateToLocalTimeZone(job.plannedDateTime)}</b></span>}<br />
                {(job.matFulFillmentDate) && <span>Material Fulfillment By: <b>{convertBackendDateToLocalTimeZone(job.matFulFillmentDate)}</b></span>}
            </div>
        );
    };


    const handleDragEnd = (event) => {
        event.preventDefault();
        setTimeout(() => {
            // getPlannedDocketRequestsOfCutTable();
        }, 100);
    }

    const handleCutWSOnClick = (job: PlannedDocketGroupModel) => {
        setOpenModal(true);
        setActiveJob(job);
    }

    const handleCancel = () => {
        setOpenModal(false);
        setActiveJob(undefined);
        setTimeout(() => {
            getPlannedDocketRequestsOfCutTable();
        }, 100);
    }

    const getClassName = (materialStatus: WhMatReqLineStatusEnum, materialReqAt?: string) => {
        if (materialStatus == WhMatReqLineStatusEnum.OPEN && materialReqAt) {
            return 'w-dark-pink'
        }
        switch (materialStatus) {
            case WhMatReqLineStatusEnum.OPEN: return 'w-gray';
            case WhMatReqLineStatusEnum.PREPARING_MATERIAL: return 'w-yellow';
            case WhMatReqLineStatusEnum.MATERIAL_NOT_AVL: return 'w-red';
            case WhMatReqLineStatusEnum.MATERIAL_READY: return 'w-ready';
            case WhMatReqLineStatusEnum.MATERIAL_ON_TROLLEY: return 'w-tro';
            case WhMatReqLineStatusEnum.MATERIAL_IN_TRANSIT: return 'w-tran';
            case WhMatReqLineStatusEnum.REACHED_DESITNATION: return 'w-lgreen';
            case WhMatReqLineStatusEnum.MATERIAL_ISSUED: return 'w-green';
            default: return 'w-dark-pink'
        }
    }

    const groupDocketsByDate = (dockets) => {
        return dockets.reduce((grouped, docket) => {
            const dateKey = moment(docket.plannedDateTime).format('YYYY-MM-DD');
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(docket);
            return grouped;
        }, {});
    };

    const docketsGroupedByDate = cutTableDocketsModel?.docketsInfo
        ? groupDocketsByDate(cutTableDocketsModel?.docketsInfo)
        : {};


    return (<>
        {/* <Row align="middle" style={{ alignItems: "center"}}> */}
        <Space direction="horizontal" style={{width: "100%", justifyContent: 'center'}}>
            <span>
                <Tooltip title="Cut Table Capacity">
                    <Tag bordered={true} color="blue">{props.cutTable.capacity ?? 'NA'}</Tag>
                </Tooltip>
                <Tooltip title="Planned Dockets">
                    <Tag bordered={true} color="error">{cutTableDocketsModel?.docketsInfo?.length ?? 0}</Tag>
                </Tooltip>
                <Tooltip title="Utilization Percentage">
                    <Tag bordered={true} color="magenta">
                        {
                            props.cutTable.capacity && cutTableDocketsModel?.docketsInfo?.length
                                ? (((cutTableDocketsModel?.docketsInfo?.length/props.cutTable.capacity) * 100)).toFixed(2)+'%' : '0%'
                        }
                    </Tag>
                </Tooltip>
            </span>
            {/* </Row> */}
        </Space>
        <Card
            loading={loading}
            title={<div style={{ textAlign: 'center' }}>{cutTable.tableName}</div>}
            size="small"
            style={{ width: '240px' }}
            key={cutTable.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => onDrop(event, null, cutTable)}
            bodyStyle={{ minHeight: '100px' }}
        >
            {cutTableDocketsModel? cutTableDocketsModel?.docketsInfo.length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}

            {Object.keys(docketsGroupedByDate).map((date) => (
               
                        <div key={date} style={{ marginBottom: '5px' }}>
                            <Divider className="custom-divider" style={{ margin: '3px', borderColor: 'gray', padding:'0px' }}>{moment(date).format('MMM Do YY')}</Divider>
                            <Space wrap size={10}>
                                {[...docketsGroupedByDate[date]]
                                    ?.sort((unsortedA, unsortedB) => unsortedA.priority - unsortedB.priority)
                                    ?.map((job, index) => (
                                        <Popover
                                            key={job.matReqNo + cutTable.id}
                                            content={getHoverInfo(job)}
                                            mouseEnterDelay={0}
                                            mouseLeaveDelay={0}
                                            placement="top"
                                        >
                                            <Badge count={index + 1} offset={[0, 13]} size="small" overflowCount={999}>
                                                <Button
                                                    size='small'
                                                    type='primary'
                                                    className={`${getClassName(job.materialStatus, job?.marterialReqAt)}`}
                                                    onMouseOver={() => onMouseOver(job.matReqNo)}
                                                    onMouseLeave={() => onMouseLeave(job.matReqNo)}
                                                    draggable={job.marterialReqAt === null}
                                                    onDragStart={(event) => onDragStart(event, job)}
                                                    onDragEnd={handleDragEnd}
                                                    onDrop={(event) => onDrop(event, job, cutTable)}
                                                    onClick={() => handleCutWSOnClick(job)}
                                                >
                                                    <strong>{job.docketGroup}</strong>
                                                </Button>
                                            </Badge>
                                        </Popover>
                                    ))}
                            </Space>
                        </div>

            ))}
        </Card>

        <Modal open={openModal} onCancel={handleCancel} footer={null} width={(activeJob && activeJob?.marterialReqAt !== null) ? '100vw' : undefined}>
            {activeJob?.marterialReqAt === null && <LayTimeUpdateComp activeJob={activeJob} handleCancel={handleCancel} />}
            {activeJob?.marterialReqAt !== null && <LayReporting key={Date.now()} docketGroup={activeJob?.docketGroup} />}
        </Modal>
    </>
    )
}

export default CuttingWorkStations