import { Button, DatePicker, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';
import './module-change-alert.css'

interface ModuleDetails {
    moduleId: string;
    moduleType: string;
    wsInModule: number;
    wsDownTimeInModule: number;
    moduleEfficiency: number;
    moduleColor: string;
    moduleForecastActualMins: number;
    moduleAlreadyPlannedMins: number;
    jobDetails: {
        jobOrderId: string;
        jobOrderName: string;
        jobOrderType: string;
        jobOrderCreatedDate: string;
        jobOrderDispatchDate: string;
        operationsInJobOrder: {
            operationId: string[];
        };
    }[];
}

interface ModuleChangeProps {
    moduleFromData: ModuleDetails;
    moduleToData: ModuleDetails;
}

const ModuleChange = (props: ModuleChangeProps) => {
    const [fromModuleJobs, setFromModuleJobs] = useState(props.moduleFromData.jobDetails);
    const [toModuleJobs, setToModuleJobs] = useState(props.moduleToData.jobDetails);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const getAvailableMins = (moduleForecastActualMins: number, moduleAlreadyPlannedMins: number) => {
        return moduleAlreadyPlannedMins - moduleForecastActualMins;
    };

    const handleDragStart = (event: React.DragEvent<HTMLElement>, job: any) => {
        event.dataTransfer.setData('job', JSON.stringify(job));
    };

    const handleDrop = (
        event: React.DragEvent<HTMLDivElement>,
        setTargetJobs: React.Dispatch<React.SetStateAction<any[]>>,
        setSourceJobs: React.Dispatch<React.SetStateAction<any[]>>,
        sourceJobs: any[]
    ) => {
        if (!selectedDate) {
            alert("Please select a date before assigning a job.");
            return;
        }

        const droppedJob = JSON.parse(event.dataTransfer.getData("job"));

        setTargetJobs((prevJobs: any[]) => {
            const isSameModule = sourceJobs.some(
                (job: any) => job.jobOrderId === droppedJob.jobOrderId
            );

            if (isSameModule) {
                const originalIndex = sourceJobs.findIndex(
                    (job: any) => job.jobOrderId === droppedJob.jobOrderId
                );
                const newJobs = [...prevJobs];
                const updatedJob = {
                    ...droppedJob,
                    assignedDate: selectedDate,
                };
                newJobs.splice(originalIndex, 0, updatedJob);
                return newJobs;
            } else {
                const isJobAlreadyAssigned = prevJobs.some(
                    (job: any) => job.jobOrderId === droppedJob.jobOrderId
                );
                if (!isJobAlreadyAssigned) {
                    const updatedJob = {
                        ...droppedJob,
                        assignedDate: selectedDate,
                    };
                    return [...prevJobs, updatedJob];
                }
                return prevJobs;
            }
        });

        setSourceJobs((prevJobs: any[]) =>
            prevJobs.filter((job: any) => job.jobOrderId !== droppedJob.jobOrderId)
        );
    };

    const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const groupAndSortJobs = (jobs: any[], groupByAssignedDate: boolean = false) => {
        const groupedJobs: { [key: string]: any[] } = jobs.reduce((acc, job) => {
            const date = groupByAssignedDate && job.assignedDate ? job.assignedDate : job.jobOrderCreatedDate;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(job);
            return acc;
        }, {});

        const sortedDates = Object.keys(groupedJobs).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        return sortedDates.map(date => ({ date, jobs: groupedJobs[date] }));
    };


    const handleDateChange = (date: any, dateString: string) => {
        console.log("Selected Date:", dateString)
        setSelectedDate(dateString);
    };

    const renderModuleCard = (title: string, moduleData: ModuleDetails, jobs: any, setJobs: any, otherJobs: any, setOtherJobs: any, width: any, className, pClassName, groupByAssignedDate: boolean = false, disableDrop: boolean = false) => {
        const groupedAndSortedJobs = groupAndSortJobs(jobs, groupByAssignedDate);

        return (
            <div style={{
                margin: '10px', width: width,
                //  background: moduleData.moduleColor, 
            }} className={className}>
                <p className={pClassName} > {title}  </p>
                <section
                    style={{ display: "flex", justifyContent: "space-evenly", marginBottom: "10px", background: "#f6f6f6", borderRadius: "10px", width: "250px", padding: "5px", margin: "0 auto" }}
                >
                    <Tooltip title="Forecast Actual Mins">
                        <Tag color="blue" style={{ margin: "0px", textAlign: "center", width: "15%", padding: "1px" }}>
                            <strong>{moduleData.moduleForecastActualMins}</strong>
                        </Tag>
                    </Tooltip>
                    <Tooltip title="Already Planned Mins">
                        <Tag color="red" style={{ margin: "0px", textAlign: "center", width: "15%", padding: "1px" }}>
                            <strong>{moduleData.moduleAlreadyPlannedMins}</strong>
                        </Tag>
                    </Tooltip>
                    <Tooltip title="Available Mins">
                        <Tag color="orange" style={{ margin: "0px", textAlign: "center", width: "15%", padding: "1px" }}>
                            <strong>
                                {getAvailableMins(moduleData.moduleForecastActualMins, moduleData.moduleAlreadyPlannedMins)}
                            </strong>
                        </Tag>
                    </Tooltip>
                    <Tooltip title="Utilization Percentage">
                        <Tag color="green" style={{ margin: "0px", textAlign: "center", width: "15%", padding: "1px" }}>
                            <strong>{moduleData.moduleEfficiency}%</strong>
                        </Tag>
                    </Tooltip>
                </section>
                <div
                    onDrop={!disableDrop ? (event) => handleDrop(event, setJobs, setOtherJobs, otherJobs) : undefined}
                    onDragOver={!disableDrop ? allowDrop : undefined}
                    style={{
                        background: moduleData.moduleColor,
                        padding: "10px", borderRadius: "10px", margin: "19px", minHeight: "150px", height: "433px",
                        opacity: disableDrop ? 0.5 : 1,
                        pointerEvents: disableDrop ? "none" : "auto",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: "5px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Module {moduleData.moduleId}</span>
                        {/* <Tag style={{ alignContent: "center" }} color="orange">
                            {moduleData.moduleType.toString()}
                        </Tag> */}
                    </div>
                    <div style={{ background: moduleData.moduleColor, overflow: "scroll", scrollbarWidth: "none", height: "390px" }}>
                        {groupedAndSortedJobs.map((group, index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                                <div style={{ fontWeight: "bold", marginBottom: "5px", textAlign: "center" }}>{group.date}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                                    {group.jobs.map((job: any, jobIndex: number) => (
                                        <Tooltip
                                            key={jobIndex}
                                            title={
                                                <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
                                                    <span><strong>Job Order Name: </strong>{job.jobOrderName}</span>
                                                    <span><strong>Job Order Type: </strong>{job.jobOrderType}</span>
                                                    <span><strong>Created Date: </strong>{job.jobOrderCreatedDate}</span>
                                                    <span><strong>Dispatch Date: </strong>{job.jobOrderDispatchDate}</span>
                                                    <span><strong>Operations: </strong>{job.operationsInJobOrder.operationId.join(', ')}</span>
                                                    {job.assignedDate && (
                                                        <span><strong>Assigned Date: </strong>{job.assignedDate}</span>
                                                    )}
                                                </div>
                                            }
                                        >
                                            <Button
                                                size="small"
                                                type="primary"
                                                draggable
                                                onDragStart={(event) => handleDragStart(event, job)}
                                                className='job-order-btn'
                                            >
                                                <strong>{job.jobOrderId}</strong>
                                            </Button>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <>
            <div style={{ background: "", padding: "10px", borderRadius: "10px", display: "flex", justifyContent: "space-between", width: "100%" }}>
                {renderModuleCard("From Module", props.moduleFromData, fromModuleJobs, setFromModuleJobs, toModuleJobs, setToModuleJobs, 600, 'custom-div', 'module-heading')}
                {renderModuleCard("To Module", props.moduleToData, toModuleJobs, setToModuleJobs, fromModuleJobs, setFromModuleJobs, 600, 'custom-div-2', 'module-heading-1', true, !selectedDate)}
                <div className='plan-input-date' >
                    <div className="module-plan-input-date"  >
                        <span> Plan Input Date: </span> &nbsp;
                        <DatePicker onChange={handleDateChange} defaultValue={null} />
                    </div>
                    <div className="module-legend-container" >
                        <Tag color="blue" style={{ margin: "2px" }}> Forecast Actual Mins </Tag>
                        <Tag color="red" style={{ margin: "2px" }}> Already Planned Mins </Tag>
                        <Tag color="orange" style={{ margin: "2px" }}> Available Mins </Tag>
                        <Tag color="green" style={{ margin: "2px" }}> Utilization Percentage </Tag>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModuleChange;
