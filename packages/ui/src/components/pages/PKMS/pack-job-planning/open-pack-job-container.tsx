import { CommonIdReqModal, PackingTableJobsDto, PackJobModel, unPlanRequest } from "@xpparel/shared-models";
import { PackJobPlanningServices } from "@xpparel/shared-services";
import { Button, Card, Empty, Popover, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import { convertBackendDateToLocalTimeZone, useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';

interface IOpenPackJobContainerProps {
    selectedPo: number;
    refreshKey: number;
    refreshPlannedPackJobs: (tableId: number) => void;
}
export const OpenPackJobContainer = (props: IOpenPackJobContainerProps) => {
    const { selectedPo, refreshKey, refreshPlannedPackJobs } = props;
    const [openPackJobsModel, setOpenPackJobsModel] = useState<PackJobModel[]>([]);
    const [toolTipValue, setToolTipValue] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;

    const packJobPlanningService = new PackJobPlanningServices();

    useEffect(() => {
        getYetToPlanPackJobs();
        setLoading(true);
    }, [selectedPo, refreshKey]);

    const getYetToPlanPackJobs = () => {
        const req = new CommonIdReqModal(selectedPo, userName, orgData.unitCode, orgData.companyCode, userId);
        packJobPlanningService.getYetToPlanPackJobs(req)
            .then((res) => {
                if (res.status) {
                    setOpenPackJobsModel(res.data);
                } else {
                    setOpenPackJobsModel([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setOpenPackJobsModel([]);
                AlertMessages.getErrorMessage(err.message);
            });
    }

    const unPlanPackJobRequestsFromPackTable = (reqModel: unPlanRequest, tblId: number) => {
        packJobPlanningService.unPlanPackJobRequestsFromPackTable(reqModel)
            .then((res) => {
                if (res.status) {
                    getYetToPlanPackJobs();
                    refreshPlannedPackJobs(tblId);
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

    const onDrop = (event) => {
        const packJobInfo: PackJobModel = JSON.parse(event.dataTransfer.getData('packJobInfo'));
        const reqModel = new unPlanRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, []);
        if (selectedPo !== packJobInfo.poId) {
            AlertMessages.getErrorMessage(`You Can't UnPlan other than selected MO`);
            event.dataTransfer.clearData();
            event.stopPropagation();
            return false;
        }
        // CORRECT
        reqModel.packJobs = [packJobInfo];
        unPlanPackJobRequestsFromPackTable(reqModel, Number(packJobInfo.tableId));
        event.dataTransfer.clearData();
        event.stopPropagation();
        return true;
    }

    const onDragStart = (event, jobData: any,) => {
        const currentJobData = JSON.stringify(jobData);
        event.dataTransfer.setData('packJobInfo', currentJobData);
        setToolTipValue('');
    }

    const getHoverInfo = (job: PackJobModel) => {
        const { unPlannedPjs } = job;
        return <div>
            <span>Crtn No: <b>{unPlannedPjs.ctnNo}</b></span><br />
            <span>ExFactory: <b>{unPlannedPjs.exFactory}</b></span><br />
            <span>Carton Qty : <b>{unPlannedPjs.cartonQty}</b></span><br />
            <span>Color: <b>{unPlannedPjs.color}</b></span><br />
            <span>Pack List No: <b>{unPlannedPjs.packListNo}</b></span><br />
            <span>MO No: <b>{unPlannedPjs.poNo}</b></span><br />
            <span>Size: <b>{unPlannedPjs.sizeRatio.map((rec) => <Tag>{rec.size + "-" + rec.ratio}</Tag>)}</b></span><br />
            <span>Destination: <b>{unPlannedPjs.destination}</b></span><br />
            <span>Supplier: <b>{unPlannedPjs?.supplier}</b></span><br />
            {/* <span>Buyer Address: <b>{unPlannedPjs.buyerAddress}</b></span><br /> */}
        </div>
    };
    const onDragOver = (event) => {
        event.preventDefault();
    }

    const handleDragEnd = (event) => {
        event.preventDefault();
        setTimeout(() => {
            // getYetToPlanPackJobs();
        }, 200);
    }

    return <Card loading={loading} title={<div style={{ textAlign: 'center' }}>Unplanned PackJobs</div>} size="small" style={{ textAlign: 'left' }} onDragOver={onDragOver} onDrop={(event) => onDrop(event)} bodyStyle={{ overflowY: "scroll", maxHeight: "50vh", minHeight: "50vh" }} headStyle={{ background: "#eee" }}>
        {openPackJobsModel?.length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        <Space wrap size={5}>
            {openPackJobsModel?.map((openJob) => (
                <Popover
                    content={getHoverInfo(openJob)}
                    key={openJob.matReqNo}
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    placement='top'
                    trigger="click"
                >
                    <Button type='primary'
                        onMouseOver={() => { onMouseOver(openJob.matReqNo) }}
                        onMouseLeave={() => { onMouseLeave(openJob.matReqNo) }}
                        className='drabble btn-orange' size='small' key={openJob.packJobId} draggable onDragStart={(event) => onDragStart(event, openJob)}
                        onDragEnd={handleDragEnd}>

                        <strong >{openJob.packJobNumber}</strong>

                    </Button>
                </Popover>
            ))}
        </Space>
    </Card>
};

export default OpenPackJobContainer;
