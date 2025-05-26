import { ForecastDataModel, GbGetAllLocationsDto, GBLocationRequest, GbSectionReqDto, GetAllSectionsResDto, IModuleIdRequest, LocationDataByDateRequest, P_LocationCodeRequest, PJP_LocationCodesRequest, PJP_LocationWiseJobsModel, PJP_PlannedProcessingJobsModel, ProcessTypeEnum } from "@xpparel/shared-models";
import { ForecastPlanningService, GbConfigHelperService, ProcessingJobsPlanningService } from "@xpparel/shared-services";
import { Card, Col, Popover, Row, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";

interface ILocPlannedJobs {
    [key: string]: PJP_LocationWiseJobsModel[];
}
interface IProps {
    section: GetAllSectionsResDto;
    onDrop: (e: React.DragEvent, moduleId: string, moduleType: string, selectedDate: any, sectionId: number) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragStart: (e: React.DragEvent, job: string, moduleId: string, sectionId: number) => void;
    selectedDate: string[];
    refreshCount: number;
}
const SewLocationSection = (props: IProps) => {
    const { onDragOver, onDragStart, onDrop, selectedDate, section, refreshCount } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const globalService = new GbConfigHelperService();
    const planningService = new ProcessingJobsPlanningService();
    const [locationData, setLocationData] = useState<GbGetAllLocationsDto[]>([]);
    const [plannedJobs, setPlannedJobs] = useState<PJP_LocationWiseJobsModel[]>([]);
    const [locPlannedJobs, setLocPlannedJobs] = useState<ILocPlannedJobs>({});
    const [previousSection, setPreSection] = useState<GetAllSectionsResDto>(undefined); // No use for now
    const forecastService = new ForecastPlanningService();
    const [actualMinutes, setActualMinutes] = useState<ForecastDataModel[]>();

    useEffect(() => {
        if (props.section) {
            if (previousSection?.secCode == section.secCode) {
                if (locationData.length > 0) {
                    refreshLocations(locationData);
                } else {
                    getAllLocationsByDeptAndSectionsFromGbC(props.section.secCode);
                }
            } else {
                setPreSection(props.section);
                getAllLocationsByDeptAndSectionsFromGbC(props.section.secCode);
            }
        }
    }, [props.section, refreshCount])

    useEffect(() => {
        if (selectedDate) {
            getActualMinutes(selectedDate[0])
        }
    }, [selectedDate])


    const refreshLocations = async (locations: GbGetAllLocationsDto[]) => {
        const locationCodes = locations.map(loc => loc.locationCode);
        const locPlannedJobsObj = await getPlannedProcessingJobs(locationCodes);
        setLocPlannedJobs(locPlannedJobsObj);

    }


    const getAllLocationsByDeptAndSectionsFromGbC = async (secId) => {
        try {
            const req = new GBLocationRequest(user.user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [secId])
            const res = await globalService.getAllLocationsByDeptAndSectionsFromGbC(req)
            if (res.status) {

                const locationCodes = res.data.map(loc => loc.locationCode);
                const locPlannedJobsObj = await getPlannedProcessingJobs(locationCodes);
                setLocPlannedJobs(locPlannedJobsObj);
                setLocationData(res.data);
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }
    }
    const getPlannedProcessingJobs = async (locationCodes: string[]) => {
        try {
            const req = new PJP_LocationCodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, locationCodes);
            const res = await planningService.getPlannedProcessingJobs(req);
            if (res.status) {
                setPlannedJobs(res.data);
                const locPlannedJobsObj: ILocPlannedJobs = {};
                res.data.forEach(locJobObj => {
                    if (!locPlannedJobsObj.hasOwnProperty(locJobObj.locationCode)) {
                        locPlannedJobsObj[locJobObj.locationCode] = [];
                    }
                    locPlannedJobsObj[locJobObj.locationCode].push(locJobObj);
                });
                return locPlannedJobsObj;
            } else {
                return {}
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
            return {};
        }
    }

    const handleDrop = (e: React.DragEvent, moduleId: string, moduleType: string, sectionId: number) => {
        if (!selectedDate.length) {
            AlertMessages.getErrorMessage("Please select a date before assigning a job order.");
            return;
        }

        onDrop(e, moduleId, moduleType, selectedDate, sectionId);
    };

    const renderPopOverTitle = (e: PJP_PlannedProcessingJobsModel) => {
        return <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
            <span><strong>Job Order Name: </strong>{e.jobNumber}</span>
            <span><strong>Product Code: </strong>{e.productCode}</span>
            <span><strong>Process Type: </strong>{e.processType}</span>
            <span><strong>Quantity: </strong>{e.quantity}</span>
            <div style={{ marginTop: "20px" }}>
                <span><strong>Job color and size wise details:</strong></span>
                {e.colorSizeQty.length > 0 ? (
                    <table style={{ marginTop: "10px", width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f4f4f4" }}>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Color</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Original Qty</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {e.colorSizeQty.map((operation, index) => (
                                <tr key={index}>
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{operation.color}</td>
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{operation.quantity}</td>
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{operation.size}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <span>No color and size details available</span>
                )}
            </div>
        </div>
    }

    const getActualMinutes = async (plannedDate) => {
        try {
            const locationCodes = locationData.map(loc => loc.locationCode);
            const req = new LocationDataByDateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, locationCodes, plannedDate)
            const res = await forecastService.getForecastDataByLocationCode(req)
            if (res.status) {
                setActualMinutes(res.data)
            } else {
                // AlertMessages.getErrorMessage('No locations found in fr with planned date');
                setActualMinutes([]);
            }
        } catch (err) {
            err.message
            setActualMinutes([]);
        }
    }

    const getEachModulePlannedMinutes = (locationCode: string): number => {
        let totalPlannedMinutes = 0;
        plannedJobs.forEach((location) => {
            if (location.locationCode === locationCode
                // && location.planDateWiseJobModel[0].plannedDate === selectedDate[0]
            ) {
                location.planDateWiseJobModel.forEach((job) => {
                    job.processingJobsModel.forEach((data) => {
                        const quantity = data.quantity || 0;
                        const smv = data.totalSmv || 0;
                        totalPlannedMinutes += quantity * smv;
                    });
                });
            }
        });
        return totalPlannedMinutes || 0;
    };

    return <>
        <Row gutter={[16, 16]}>

            {Object.values(locationData).map((locationObj, ind) => {
                const locationCode = locationObj.locationCode;
                const matchedLocation = actualMinutes?.find(fcp => fcp.locationCode === locationCode);
                const forecastActualQuantity = matchedLocation?.planPcs || 0;
                const forecastActualSmv = matchedLocation?.smv || 0;
                const forecastActualMins = forecastActualQuantity * forecastActualSmv;
                const alreadyPlannedMins = getEachModulePlannedMinutes(locationCode);
                const availableMins = forecastActualMins - alreadyPlannedMins;
                const utilizationPercent = forecastActualMins > 0 ? ((alreadyPlannedMins / forecastActualMins) * 100).toFixed(1): '0.0';
                return (
                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                        <section style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", marginBottom: "10px", width: "100%" }}>
                            <Tooltip title="Forecast Actual Mins">
                                <Tag color="blue" style={{ flex: "0 1 auto", minWidth: "60px", padding: "2px 6px", fontSize: "12px", textAlign: "center" }}>
                                    <strong>{forecastActualMins}</strong>
                                </Tag>
                            </Tooltip>
                            <Tooltip title="Already Planned Mins">
                                <Tag color="red" style={{ flex: "0 1 auto", minWidth: "60px", padding: "2px 6px", fontSize: "12px", textAlign: "center" }}>
                                    <strong>{alreadyPlannedMins}</strong>
                                </Tag>
                            </Tooltip>
                            <Tooltip title="Available Mins">
                                <Tag color="orange" style={{ flex: "0 1 auto", minWidth: "60px", padding: "2px 6px", fontSize: "12px", textAlign: "center" }}>
                                    <strong>{availableMins}</strong>
                                </Tag>
                            </Tooltip>
                            <Tooltip title="Utilization Percentage">
                                <Tag color="green" style={{ flex: "0 1 auto", minWidth: "60px", padding: "2px 6px", fontSize: "12px", textAlign: "center" }}>
                                    <strong>{utilizationPercent}%</strong>
                                </Tag>
                            </Tooltip>
                        </section>
                        <Card size="small" title={locationObj.locationCode} bodyStyle={{ padding: '4px', minHeight: '50px' }} onDrop={(e) => handleDrop(e, locationObj.locationCode, locationObj.locationType, section.id)}
                            onDragOver={(e) => e.preventDefault()}>

                            {locPlannedJobs.hasOwnProperty(locationObj.locationCode) ?
                                locPlannedJobs[locationObj.locationCode].map(locJobObj => <>
                                    {locJobObj.planDateWiseJobModel.map(planDateObj => {
                                        return <>
                                            <div
                                                style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px", textAlign: "center", marginBottom: "5px", color: selectedDate[0] === dayjs(planDateObj.plannedDate).format("YYYY-MM-DD") ? "#fff" : "#000", background: selectedDate[0] === dayjs(planDateObj.plannedDate).format("YYYY-MM-DD") ? "linear-gradient(90deg, #4caf50, #81c784)" : "transparent", boxShadow: selectedDate[0] === dayjs(planDateObj.plannedDate).format("YYYY-MM-DD") ? "0 4px 15px rgba(76, 175, 80, 0.4)" : "none", borderRadius: "10px", padding: "5px", height: "30px", width: "120px", transition: "all 0.3s ease-in-out", transform: selectedDate[0] === dayjs(planDateObj.plannedDate).format("YYYY-MM-DD") ? "scale(1.05)" : "scale(1)", margin: "0 auto" }}
                                            >
                                                {dayjs(planDateObj.plannedDate).format("MM-DD-YYYY")}
                                            </div>
                                            {planDateObj.processingJobsModel.map(e => {
                                                return (
                                                    <>
                                                        <div style={{ display: "inline-block", justifyContent: "center", flexWrap: "wrap", height: "auto", overflow: "scroll", scrollbarWidth: "none", gap: "6px", }} >
                                                            {
                                                                <div key={e.jobNumber}>
                                                                    <Popover
                                                                        className="module-job-order-tooltip"
                                                                        title={
                                                                            renderPopOverTitle(e)
                                                                        }
                                                                    >
                                                                        <Card
                                                                            className="module-job-order-card"
                                                                            key={e.jobNumber}
                                                                            draggable
                                                                            bodyStyle={{ padding: '4px 2px' }}
                                                                            onDragStart={(event) => onDragStart(event, e.jobNumber, locationObj.locationCode, section.id)}
                                                                        >
                                                                            <span>{e.jobNumber.length > 30 ? `${e.jobNumber.substring(0, 30)}...` : e.jobNumber}</span>
                                                                        </Card>
                                                                    </Popover>
                                                                </div>
                                                            }
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </>
                                    })}
                                </>)
                                : <> </>}
                        </Card>
                    </Col>
                )
            })}
        </Row>
    </>
}

export default SewLocationSection;