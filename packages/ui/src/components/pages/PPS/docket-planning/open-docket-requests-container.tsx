import { Button, Card, Empty, Popover, Space, Tag } from 'antd'
import { convertBackendDateToLocalTimeZone, useAppSelector } from '../../../../common';
import './cutting-work-stations.css';
import { AlertMessages } from '../../../common';
import { CutTableDocketUnPlanRequest, CutTableDocketsModel, CutTableIdRequest, DocketPriorityModel, PlannedDocketGroupModel, PoProdutNameRequest, PoSummaryModel as number } from '@xpparel/shared-models';
import { DocketPlanningServices } from '@xpparel/shared-services';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import moment from 'moment';


interface IOpenDocketRequestsContainerProps {
    poSerial: number,
    selectedProductName: string;
    refreshKey: number;
    refreshPlannedDocs: (tableId: number) => void;
}
export const OpenDocketRequestsContainer = (props: IOpenDocketRequestsContainerProps) => {
    const { poSerial, selectedProductName, refreshKey, refreshPlannedDocs } = props;
    const [openCutTableDocketsModel, setOpenCutTableDocketsModel] = useState<CutTableDocketsModel>();
    const [toolTipValue, setToolTipValue] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const user = useAppSelector((state) => state.user.user.user);

    const docketPlanningServices = new DocketPlanningServices();

    useEffect(() => {
        getYetToPlanDocketRequests();
        setLoading(true);
    }, [selectedProductName, refreshKey]);

    const getYetToPlanDocketRequests = () => {
        const req: PoProdutNameRequest = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, selectedProductName, null);
        docketPlanningServices.getYetToPlanDocketRequests(req)
            .then((res) => {
                if (res.status) {
                    setOpenCutTableDocketsModel(res.data[0]);
                } else {
                    setOpenCutTableDocketsModel(null);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setOpenCutTableDocketsModel(null);
                AlertMessages.getErrorMessage(err.message);
            });
    }

    const unPlanDocketRequestsFromCutTable = (reqModel: CutTableDocketUnPlanRequest, tblId: number) => {
        docketPlanningServices.unPlanDocketRequestsFromCutTable(reqModel)
            .then((res) => {
                if (res.status) {
                    refreshPlannedDocs(tblId);
                    getYetToPlanDocketRequests();
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
        const docketInfo: PlannedDocketGroupModel = JSON.parse(event.dataTransfer.getData('docketInfo'));
        const reqModel = new CutTableDocketUnPlanRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, []);
        if (poSerial !== docketInfo.poSerial) {
            AlertMessages.getErrorMessage(`You Can't UnPlan other than selected PO`);
            event.dataTransfer.clearData();
            event.stopPropagation();
            return false;
        }
        // CORRECT
        const docketPriorityModel = new DocketPriorityModel(docketInfo.matReqNo, docketInfo.docketGroup, null, docketInfo.priority);
        reqModel.docketsList = [docketPriorityModel];
        unPlanDocketRequestsFromCutTable(reqModel, Number(docketInfo.tableId));
        event.dataTransfer.clearData();
        event.stopPropagation();
        return true;
    }

    const onDragStart = (event, jobData: any,) => {
        const currentJobData = JSON.stringify(jobData);
        event.dataTransfer.setData('docketInfo', currentJobData);
        setToolTipValue('');
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
        return <div>
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
            <span>Dockets Created Date: <b>{job.docCreatedAt ? convertBackendDateToLocalTimeZone(job.docCreatedAt) : ''}</b></span>           
        </div>
    };
    const onDragOver = (event) => {
        event.preventDefault();
    }

    const handleDragEnd = (event) => {
        event.preventDefault();
        setTimeout(() => {
            // getYetToPlanDocketRequests();
        }, 200);
    }

    return (
        <Card loading={loading} title={<div style={{ textAlign: 'center' }}>Unplanned Cuts</div>} size="small" style={{ textAlign: 'left' }} onDragOver={onDragOver} onDrop={(event) => onDrop(event)} bodyStyle={{ overflowY: "scroll", maxHeight: "90vh", minHeight: "50vh" }} headStyle={{ background: "#eee" }}>
           {openCutTableDocketsModel?.docketsInfo.length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
            <Space wrap size={5}>
                {openCutTableDocketsModel?.docketsInfo.map((openJob) => (
                    <Popover content={getHoverInfo(openJob)} key={openJob.matReqNo} mouseEnterDelay={0} mouseLeaveDelay={0} placement='top' overlayStyle={{
                        // width: '15%', fontSize: 'x-small', fontWeight: 'bold',
                        // display: ((openJob.matReqNo) === toolTipValue) ? 'block' : 'none'
                    }}>
                        <Button type='primary' onMouseOver={() => { onMouseOver(openJob.matReqNo) }} onMouseLeave={() => { onMouseLeave(openJob.matReqNo) }} className='drabble btn-orange' size='small' key={openJob.docGroupId} draggable onDragStart={(event) => onDragStart(event, openJob)}
                            onDragEnd={handleDragEnd}>

                            <strong >{openJob.docketGroup}</strong>

                        </Button>
                    </Popover>
                ))}
            </Space>
        </Card>
    )
}

export default OpenDocketRequestsContainer;