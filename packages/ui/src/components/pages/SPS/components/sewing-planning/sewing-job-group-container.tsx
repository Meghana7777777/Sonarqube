import { PJP_ProcessingJobPlanningRequest, PJP_UnPlannedProcessingJobsModel, ProcessTypeEnum } from "@xpparel/shared-models";
import { ProcessingJobsPlanningService } from "@xpparel/shared-services";
import { Button, DatePicker, Popover } from "antd";
import dayjs from "dayjs";
import { useAppSelector } from "packages/ui/src/common";
import React, { useState } from "react";
import { AlertMessages } from "../../../../common";
import './sewing-order-planning.css';

interface SewingJobGroupContainerProps {
	selectedProcessingSerial: number | null;
	jobOrders: PJP_UnPlannedProcessingJobsModel[];
	onDragStart: (e: React.DragEvent, job: string, locationCode: string, sectionId: number) => void;
	onDrop: (e: React.DragEvent, moduleId: string, moduleType: ProcessTypeEnum, selectedDate: any, sectionId: number) => void;
	onDragOver: (e: React.DragEvent) => void;
	refreshKey: number;
}

const groupJobOrdersByDate = (jobOrderDetails: PJP_UnPlannedProcessingJobsModel[]) => {
	const validJobOrders = jobOrderDetails?.filter(
		(job) => job && job.jobFeatures.delDate[0],
	);

	const sortedJobOrders = validJobOrders?.sort((a, b) => {
		return new Date(a.jobFeatures.delDate[0]).getTime() - new Date(b.jobFeatures.delDate[0]).getTime();
	});

	return sortedJobOrders?.reduce((groups, job) => {
		const date = dayjs(job.jobFeatures.delDate[0]).format("MM-DD-YYYY")
		if (!groups[date]) {
			groups[date] = [];
		}
		groups[date]?.push(job);
		return groups;
	}, {} as { [date: string]: PJP_UnPlannedProcessingJobsModel[] });
};

const SewingJobGroupContainer: React.FC<SewingJobGroupContainerProps> = ({ selectedProcessingSerial, jobOrders, onDragStart, onDrop, onDragOver }) => {
	const [draggingJobId, setDraggingJobId] = useState<string | null>(null);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const user = useAppSelector((state) => state.user.user.user);
	const planningService = new ProcessingJobsPlanningService();

	const reverseOnDrop = async () => {
		
		try {
			const req = new PJP_ProcessingJobPlanningRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, '', null, null);
			const res = await planningService.planProcessingJobToLocation(req);
			if (!res.status) {
				throw new Error(res.internalMessage)
			}
		} catch (error) {
			AlertMessages.getErrorMessage(error.message)
		}
	}

	const handleDragStart = (event: React.DragEvent, job: string) => {
		event.dataTransfer.setData("jobOrder", JSON.stringify(job));
		setDraggingJobId(job);
		onDragStart(event, job, undefined, undefined);
	};

	const handleDragEnd = (jobNo: string) => {
		setDraggingJobId(null);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		onDrop(e,undefined,undefined,undefined,undefined)
	};

	const allJobOrderDetails = jobOrders?.flatMap((jobOrder) => jobOrder);
	const groupedJobOrders = groupJobOrdersByDate(allJobOrderDetails);

	const filteredJobOrders = selectedDate ? Object.entries(groupedJobOrders).reduce((filtered, [date, jobs]) => {
		const isSameDate = dayjs(date, "MM-DD-YYYY").isSame(dayjs(selectedDate, "YYYY-MM-DD"), "day");
		if (isSameDate) {
			filtered[date] = jobs;
		}
		return filtered;
	}, {} as { [date: string]: PJP_UnPlannedProcessingJobsModel[] }) : groupedJobOrders;
	const renderPopOverTitle = (job: PJP_UnPlannedProcessingJobsModel) => {
		return <div style={{ display: "flex", flexDirection: "column", padding: "10px", }}>
			<span><strong>Job Order Name: </strong>{job.jobNumber}</span>
			<span><strong>Product Code: </strong>{job.productCode}</span>
			<span><strong>Quantity: </strong>{job.quantity}</span>
			<span><strong>Job Order Type: </strong>{job.processType}</span>
		</div>
	}
	return (
		<div>
			<DatePicker style={{ marginBottom: "10px", width: "100%" }}
				onChange={(date, dateString) => {
					setSelectedDate(dateString || null);
				}}
			/>

			<div className="job-order-container"
				onDrop={(e) => handleDrop(e)}
				onDragOver={onDragOver}>
				<span className="job-card-title">Unassigned Job Order</span>
				<div style={{ overflow: "scroll", scrollbarWidth: "none", height: "500px" }}>
					{selectedProcessingSerial ? (
						<div style={{ minHeight: "100px", display: "flex", flexWrap: "wrap", gap: "0px", padding: "0px" }} >
							{Object.keys(filteredJobOrders).length > 0 ? (
								Object.keys(filteredJobOrders).map((date) => (
									<div
										className="job-order-main-container"
										key={date}
										style={{ marginBottom: "5px" }}
									>
										<span className="job-order-date">{date}</span>
										<div style={{ display: "flex", flexWrap: "wrap", gap: "0px" }}>
											{filteredJobOrders[date].slice().sort((a, b) => a.jobNumber.localeCompare(b.jobNumber)).map((job) => (
												<Popover style={{ backgroundColor: 'white' }}
													key={job.jobNumber} mouseEnterDelay={0} mouseLeaveDelay={0}
													content={renderPopOverTitle(job)}
													 
												>
													<Button
														size="small"
														type="primary"
														className={`draggable btn-orange ${draggingJobId === job.jobNumber ? "dragging" : ""}`}
														draggable
														onDragStart={(event) => handleDragStart(event, job.jobNumber)}
														onDragEnd={() => handleDragEnd(job.jobNumber)}
														style={{
															marginBottom: "3px", marginRight: "3px",
															zIndex: draggingJobId === job.jobNumber ? 1000 : 1,
														}}
													>
														<strong>{job.jobNumber}</strong>
													</Button>
												</Popover>
											))}
										</div>
									</div>
								))
							) : (
								<p>No job orders available for this processing serial.</p>
							)}
						</div>
					) : (
						<p>Select a processing serial to see job orders.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default SewingJobGroupContainer;
