import { PackingTableJobsDto, PackJobModel, PackJobPlanningRequest, PackMatReqStatusEnum, PackTableModel, PlanPackJobModel } from "@xpparel/shared-models";
import { PackJobPlanningServices } from "@xpparel/shared-services";
import { Badge, Button, Card, Empty, Popover, Space, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useAppSelector } from '../../../../common';
import { AlertMessages } from "../../../common";



export interface IPackingWorkStationsProps {
    packTable: PackTableModel;
    refreshKey: number;
    refreshUnplannedPackJobs: () => void;
}
export const PackingWorkStations = (props: IPackingWorkStationsProps) => {
    const { packTable, refreshUnplannedPackJobs, refreshKey } = props;
    const [packTableJobData, setPackTableJobData] = useState<PackingTableJobsDto>();
    const [toolTipValue, setToolTipValue] = useState<string>('');
    const [openModal, setOpenModal] = useState(false);
    const [activeJob, setActiveJob] = useState<PackJobModel>();

    const [loading, setLoading] = useState(true);

    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;


    const packJobPlanningService = new PackJobPlanningServices();

    useEffect(() => {
        getPlannedPackJobRequestsOfPackTable();
        setLoading(true);
    }, [refreshKey]);


    const getPlannedPackJobRequestsOfPackTable = () => {
        const req = new PackJobPlanningRequest(userName, orgData.unitCode, orgData.companyCode, userId, packTable.id);
        packJobPlanningService.getPlannedPackJobRequestsOfPackTable(req)
            .then((res) => {
                if (res.status) {
                    setPackTableJobData(res.data);
                } else {
                    setPackTableJobData(null);
                }
                setLoading(false);
            })
            .catch((err) => {
                setPackTableJobData(null);
                AlertMessages.getErrorMessage(err.message);
                setLoading(false);
            });
    };


    const planPackJobToPackTable = (req: PlanPackJobModel) => {
        packJobPlanningService.planPackJobToPackTable(req)
            .then((res) => {
                if (res.status) {
                    refreshUnplannedPackJobs();
                    getPlannedPackJobRequestsOfPackTable();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }

    const onDrop = (event, droppedJobData: PackJobModel, packTable: PackTableModel) => {
        const packJobInfo: PackJobModel = JSON.parse(event.dataTransfer.getData('packJobInfo'));
        const reqModel = new PlanPackJobModel(packTable.id, [], user?.orgData?.companyCode, user?.orgData?.unitCode, user?.userName, user?.userId);
        const jobInWorkstation = packTableJobData?.jobInfo?.find(loadedJob => loadedJob.matReqNo === packJobInfo.matReqNo);
        if (!jobInWorkstation) {
            if (droppedJobData) {
                packJobInfo.priority = droppedJobData.priority;
            } else {
                packJobInfo.priority = undefined;
            }
        } else {
            if (droppedJobData) {
                packJobInfo.priority = droppedJobData.priority;
            }
        }
        // CORRECT
        // const docketPriorityModel = new DocketPriorityModel(packJobInfo.matReqNo, packJobInfo.docketGroup, null, packJobInfo.priority);
        reqModel.packJobs = [packJobInfo];
        planPackJobToPackTable(reqModel);
        event.dataTransfer.clearData();
        event.stopPropagation();
    }

    const onDragStart = (event, packJobReqData: PackJobModel) => {
        const packJobReqDataString: string = JSON.stringify(packJobReqData);
        event.dataTransfer.setData('packJobInfo', packJobReqDataString);
    }



    const getHoverInfo = (job: PackJobModel) => {
        const { unPlannedPjs } = job;
        return <div>
            <span>Crtn No: <b>{unPlannedPjs?.ctnNo}</b></span><br />
            <span>ExFactory: <b>{unPlannedPjs?.exFactory}</b></span><br />
            <span>Carton Qty : <b>{unPlannedPjs?.cartonQty}</b></span><br />
            <span>Color: <b>{unPlannedPjs?.color}</b></span><br />
            <span>Pack List No: <b>{unPlannedPjs?.packListNo}</b></span><br />
            <span>Po No: <b>{unPlannedPjs?.poNo}</b></span><br />
            <span>Size: <b>{unPlannedPjs?.sizeRatio?.map((rec) => <Tag>{rec.size + "-" + rec.ratio}</Tag>)}</b></span><br />
            <span>Destination: <b>{unPlannedPjs?.destination}</b></span><br />
            <span>Supplier: <b>{unPlannedPjs?.supplier}</b></span><br />
            {/* <span>Buyer Address: <b>{unPlannedPjs?.buyerAddress}</b></span><br /> */}
        </div>
    };

    const getClassName = (materialStatus: PackMatReqStatusEnum, materialReqAt?: string) => {
        if ((materialStatus === PackMatReqStatusEnum.OPEN) && materialReqAt) {
            return 'w-dark-pink'
        }
        switch (materialStatus) {
            case PackMatReqStatusEnum.OPEN: return 'w-gray';
            case PackMatReqStatusEnum.PREPARING_MATERIAL: return 'w-yellow';
            case PackMatReqStatusEnum.MATERIAL_NOT_AVL: return 'w-red';
            case PackMatReqStatusEnum.MATERIAL_READY: return 'w-ready';
            case PackMatReqStatusEnum.MATERIAL_ON_TROLLEY: return 'w-tro';
            case PackMatReqStatusEnum.MATERIAL_IN_TRANSIT: return 'w-tran';
            case PackMatReqStatusEnum.REACHED_DESITNATION: return 'w-lgreen';
            case PackMatReqStatusEnum.MATERIAL_ISSUED: return 'w-green';
            default: return 'w-dark-pink'
        }
    }

    const handleDragEnd = (event) => {
        event.preventDefault();
        setTimeout(() => {
            // getPlannedPackJobRequestsOfPackTable();
        }, 100);
    }


    const onMouseOver = (jobId: string) => {
        setToolTipValue(jobId);
    }

    const onMouseLeave = (jobId: string) => {
        if (toolTipValue === jobId) {
            setToolTipValue('');
        };
    }

    const handleCutWSOnClick = (job: PackJobModel) => {
        setOpenModal(true);
        setActiveJob(job);
    }



    return <><Space direction="horizontal" style={{ width: "100%", justifyContent: 'center' }}>
        <span>
            <Tooltip title="Cut Table Capacity">
                <Tag bordered={true} color="blue">{packTable.capacity ?? 'NA'}</Tag>
            </Tooltip>
            <Tooltip title="Planned Cartons">
                <Tag bordered={true} color="error">{packTableJobData?.cartonsPerPackJob}</Tag>
            </Tooltip>
            <Tooltip title="Utilization Percentage">
                <Tag bordered={true} color="magenta">
                    {
                        packTable.capacity && packTableJobData?.jobInfo?.length
                            ? (((packTableJobData?.jobInfo?.reduce((prev, cur) => prev + cur.cartons, 0) / packTable.capacity) * 100)).toFixed(2) + '%' : '0%'
                    }
                </Tag>
            </Tooltip>
        </span>
    </Space>
        <Card
            loading={loading}
            title={<div style={{ textAlign: 'center' }}>
                {packTable.tableName}</div>}
            size="small"
            style={{ width: '240px' }}
            key={packTable.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, null, packTable)}
            bodyStyle={{ minHeight: '100px' }}
        >
            {packTableJobData ? packTableJobData?.jobInfo.length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            <Space wrap size={10}>
                {
                    [...packTableJobData?.jobInfo ? packTableJobData?.jobInfo : []]?.sort((unsortedA, unsortedB) => unsortedA.priority - unsortedB.priority)?.map((job, i) => {
                        return <Popover
                            trigger="click"
                            content={getHoverInfo(job)}
                            mouseEnterDelay={0}
                            mouseLeaveDelay={0}
                            key={job.packJobNumber + packTable.id} placement='top'
                        >
                            <Badge count={i + 1} offset={[0, 13]} size="small" overflowCount={999}>
                                <Button size='small' type='primary' style={{ paddingRight: '15px' }}
                                    onMouseOver={() => { onMouseOver(job.matReqNo) }} onMouseLeave={() => { onMouseLeave(job.matReqNo) }}
                                    // className={`topdown-button ${getClassName(job.materialStatus)}`} 
                                    className={`${getClassName(job.materialStatus, job?.materialReqAt)}`}
                                    draggable={job.materialReqAt === null} onDragStart={(event) => onDragStart(event, job)}
                                    onDragEnd={handleDragEnd}
                                    onDrop={(event) => onDrop(event, job, packTable)}
                                    onClick={() => handleCutWSOnClick(job)}
                                >
                                    <strong>{job.packJobNumber}</strong>
                                </Button>
                            </Badge>
                        </Popover>
                    })
                }
            </Space>
        </Card>
    </>;
};

export default PackingWorkStations;
