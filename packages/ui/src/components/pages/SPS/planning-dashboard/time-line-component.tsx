import React from "react";
import { Timeline, Card, Modal, Tooltip } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import './Timeline.css';

//  Not using
interface StatusDetail {
	status: string;
	date: string;
	description: string;
}

interface Job {
	jobNo: string;
	currentStatus: string;
	statusDetails: StatusDetail[];
}

interface Module {
	moduleId: number;
	jobs: Job[];
}

interface Section {
	sectionId: number;
	module: Module;
}

interface JobTimelineModalProps {
	isModalVisible: boolean;
	handleCancel: () => void;
	sectionId: number;
	moduleId?: number;
	jobNo?: string;
}

const StatusTimeline: React.FC<JobTimelineModalProps> = ({
	isModalVisible,
	handleCancel,
	sectionId,
	moduleId,
	jobNo,
}) => {
	const data: Section = {
		sectionId: 456,
		module: {
			moduleId: 123,
			jobs: [
				{
					jobNo: '567',
					currentStatus: "cutJob-complete",
					statusDetails: [
						{ status: "trim-partial-input", date: "2024-11-28 10:00", description: "Initial trim input" },
						{ status: "trim-full-input", date: "2024-11-28 10:05", description: "Full trim input" },
						{ status: "cutJob-partial-input", date: "2024-11-28 10:10", description: "Partial cut job input" },
						{ status: "cutJob-full-input", date: "2024-11-28 10:15", description: "Full cut job input" },
						{ status: "cutJob-inprogress-input", date: "2024-11-28 11:30", description: "Cut job in progress" },
						{ status: "cutJob-complete", date: "2024-11-28 12:45", description: "Cut job complete" },
					],
				},
				{
					jobNo: '568',
					currentStatus: "cutJob-partial-input",
					statusDetails: [
						{ status: "trim-partial-input", date: "2024-11-28 10:00", description: "Initial trim input" },
						{ status: "cutJob-partial-input", date: "2024-11-28 11:30", description: "Partial cut job input" },
					],
				},
			],
		},
	};

	const countStatuses = (jobs: Job[]) => {
		const statusCount: Record<string, number> = {};
		jobs.forEach((job) => {
			job.statusDetails.forEach(({ status }) => {
				statusCount[status] = (statusCount[status] || 0) + 1;
			});
		});
		return statusCount;
	};

	const renderJobTimeline = (job: Job) => {
		const statusIndex = job.statusDetails.findIndex(
			(detail) => detail.status === job.currentStatus
		);

		return (
			<Timeline mode="alternate">
				{job.statusDetails.map((detail, index) => {
					const isCompleted = index <= statusIndex;
					const color = isCompleted ? "green" : "gray";
					const icon = isCompleted ? <CheckCircleOutlined /> : <ClockCircleOutlined />;
					return (
						<Timeline.Item
							key={detail.status}
							color={color}
							dot={
								<Tooltip title={detail.description}>
									{isCompleted ? (
										<CheckCircleOutlined style={{ fontSize: "18px", color: "green" }} />
									) : (
										<ClockCircleOutlined style={{ fontSize: "18px", color: "gray" }} />
									)}
								</Tooltip>
							}
						>
							<div className="timeline-content">
								<strong className={`status-title ${isCompleted ? "completed" : "pending"}`}>
									{detail.status}
								</strong>
								<span className="status-date">{detail.date}</span>
								<p className="status-description">{detail.description}</p>
							</div>
						</Timeline.Item>
					);
				})}
			</Timeline>
		);
	};

	const filterData = () => {
		if (data.sectionId !== sectionId) return null;
		if (moduleId && data.module.moduleId !== moduleId) return null;
		if (jobNo) {
			const job = data.module.jobs.find((job) => job.jobNo === jobNo);
			return job ? { ...data, module: { ...data.module, jobs: [job] } } : null;
		}
		if (moduleId) {
			return { ...data, module: { ...data.module, jobs: data.module.jobs } };
		}
		return data;
	};

	const filteredData = filterData();

	if (!filteredData) {
		return (
			<Modal
				title="Status Timeline"
				open={isModalVisible}
				onCancel={handleCancel}
				footer={null}
				width={800}
			>
				<div>No data available for the provided identifiers.</div>
			</Modal>
		);
	}

	return (
		<Modal
			title="Status Timeline"
			visible={isModalVisible}
			onCancel={handleCancel}
			footer={null}
			width={800}
		>
			<div style={{ padding: "20px" }}>
				{filteredData && !moduleId && !jobNo && (
					<Card
						className="section-card"
						title={
							<div className="section-card-title">
								Section Timeline (Section ID: {filteredData.sectionId})
							</div>
						}
						bordered={false}
					>
						<div className="section-summary-container">
							{Object.entries(countStatuses(filteredData.module.jobs)).map(
								([status, count]) => (
									<div className="timeline-summary-item" key={status}>
										<CheckCircleOutlined className="timeline-summary-icon" />
										<span>{count}</span> {status}
									</div>
								)
							)}
						</div>
					</Card>
				)}
				{moduleId && !jobNo && (
					<Card
						title={`Module Timeline (Module ID: ${filteredData.module.moduleId})`}
						bordered={false}
						style={{ marginTop: "20px" }}
					>
						<Timeline mode="alternate">
							{Object.entries(countStatuses(filteredData.module.jobs)).map(([status, count]) => (
								<Timeline.Item key={status}>
									{status}: {count}
								</Timeline.Item>
							))}
						</Timeline>
					</Card>
				)}

				{jobNo && filteredData.module.jobs.length === 1 && (
					<Card
						title={`Job Timeline (Job ID: ${filteredData.module.jobs[0].jobNo}, Current Status: ${filteredData.module.jobs[0].currentStatus})`}
						bordered={false}
						style={{ marginTop: "20px" }}
					>
						{renderJobTimeline(filteredData.module.jobs[0])}
					</Card>
				)}
			</div>
		</Modal>
	);
};

export default StatusTimeline;
