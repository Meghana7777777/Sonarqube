import { DownTimeDetailsModel, DownTimeDetailsReq, ForecastDataModel, GetAllSectionsResDto, IModuleIdRequest, LocationDataByDateRequest, P_LocationCodeRequest, PJP_LocationWiseJobsModel, ProcessTypeEnum, processTypeEnumKeys } from "@xpparel/shared-models";
import { AssetManagementService, ForecastPlanningService } from "@xpparel/shared-services";
import { Card, Collapse, DatePicker, Popover, Select, Tabs, Tag, Tooltip, message } from "antd";
import dayjs from "dayjs";
import { useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import Maintanence from './../../../../assets/icons/svg.png';
const { Panel } = Collapse;
const { Option } = Select;

interface SewingModulesProps {
  moduleAssignments: { [moduleId: string]: any[] };
  onDrop: (e: React.DragEvent, moduleId: string, moduleType: ProcessTypeEnum, selectedDate: any) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, job: string, moduleId: string) => void;
  sections: GetAllSectionsResDto[];
  getUnPlannedProcessingJobs: (value: number) => void;
  getAllLocationsByDeptAndSectionsFromGbC: (secId: number) => Promise<void>;
  plannedJobs: PJP_LocationWiseJobsModel[];
}

const SewingModules: React.FC<SewingModulesProps> = ({ moduleAssignments, onDrop, sections, getAllLocationsByDeptAndSectionsFromGbC, plannedJobs, onDragStart }) => {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string[]>([]);
  const [restructuredArray, setRestructuredArray] = useState<any>([])
  const [downtimeDetails, setDowntimeDetails] = useState<DownTimeDetailsModel[]>([]);
  const user = useAppSelector((state) => state.user.user.user);
  const todayDate = new Date().toLocaleDateString();
  const assetService = new AssetManagementService();
  const [sectionCodes, setSectionCodes] = useState<number>();
  const [activeTabKey, setActiveTabKey] = useState<string>(sections[0]?.secType || '');
  const forecastService = new ForecastPlanningService();
  const [actualMinutes, setActualMinutes] = useState<ForecastDataModel[]>()

  useEffect(() => {
    if (moduleAssignments) {
      setRestructuredArray(transformData(moduleAssignments))
    }
  }, [moduleAssignments]);

  useEffect(() => {
    if (sections?.length) {
      setActiveTabKey(sections[0].id.toString());
    }
  }, [sections]);

  useEffect(() => {
  }, [restructuredArray])

  const getDowntimeDataForSection = async (sectionId: number) => {
    try {
      const req = new DownTimeDetailsReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedDate, String(sectionId))
      const response = await assetService.getDowntimeDetailsBySectionCode(req);
      if (response?.status) {
        setDowntimeDetails(response.data || []);
        setSectionCodes(sectionId)
      } else {
        setSectionCodes(null)
      }
    } catch (error: any) {
    }
  };


  const handleDrop = (e: React.DragEvent, moduleId: string, moduleType: ProcessTypeEnum) => {
    if (!selectedDate.length) {
      message.error("Please select a date before assigning a job order.");
      return;
    }
    console.log(moduleId, moduleType, selectedDate, 'moduleId, moduleType, selectedDate')
    onDrop(e, moduleId, moduleType, selectedDate);
  };

  // const onDragStart = (event: React.DragEvent, job: string, locationCode?: string) => {
  //     event.dataTransfer.setData("jobNo", job);
  //     event.dataTransfer.setData("locationCode", locationCode);
  // console.log("Drag Start:", job, locationCode);
  //   };

  const handleDateChange = (date: any, dateString: string) => {
    setSelectedDate([dateString]);
  };

  const handlePanelChange = (key: string[]) => {
    getAllLocationsByDeptAndSectionsFromGbC(Number(key[0]))
    if (selectedDate.length) {
      getDowntimeDataForSection(Number(key[0]))
    }
  };

  const filteredSections = selectedSection
    ? sections.filter((section) => section.id === selectedSection)
    : sections;

  const getAvailableMins = (moduleForecastActualMins: number, moduleAlreadyPlannedMins: number) => {
    const foreCastActualMins = moduleForecastActualMins;
    const alreadyPlannedMins = moduleAlreadyPlannedMins;
    const availableMins = foreCastActualMins - alreadyPlannedMins;
    return availableMins;
  };

  const transformData = (data) => {
    const result = {};
    Object.keys(data).forEach((key) => {
      const items = data[key];
      const groupedByDate = {};
      items.forEach((item) => {
        const date = item.assignedDate;
        if (!groupedByDate[date]) {
          groupedByDate[date] = [];
        }
        groupedByDate[date].push(item);
      });
      result[key] = Object.entries(groupedByDate).map(([assignedDate, data]) => ({ assignedDate, data }));
    });
    return result;
  };

  const popoverContent = (
    <div style={{ width: "500px", overflowX: "auto" }}>
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: "8px", backgroundColor: "#f4f4f4", border: "1px solid #ddd" }}>
                S.No
              </th>
              <th style={{ padding: "8px", backgroundColor: "#f4f4f4", border: "1px solid #ddd" }}>
                Service Name
              </th>
              <th style={{ padding: "8px", backgroundColor: "#f4f4f4", border: "1px solid #ddd" }}>
                Module
              </th>
              <th style={{ padding: "8px", backgroundColor: "#f4f4f4", border: "1px solid #ddd" }}>
                Work Station
              </th>
              <th style={{ padding: "8px", backgroundColor: "#f4f4f4", border: "1px solid #ddd" }}>
                Asset Code
              </th>
              <th style={{ padding: "8px", backgroundColor: "#f4f4f4", border: "1px solid #ddd" }}>
                Actual Time
              </th>
            </tr>
          </thead>
          <tbody>
            {downtimeDetails.map((detail, index) => (
              <tr key={index}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{index + 1}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{detail.serviceName}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{detail.module}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{detail.workStation}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{detail.assetCode}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{detail.actualTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  function renderProductTabItems(): any {
    if (sections && sections.length > 0) {
      const uniqueProcessTypes = Array.from(
        new Set(sections.map((v) => processTypeEnumKeys[v.secType]))
      );
      return uniqueProcessTypes.map((processType) => ({
        key: processType,
        label: processType,
        children: '',
      }));
    }
    return [];
  }

  function onTabChange(key) {
    setActiveTabKey(key);
  }

  const getEachModulePlannedMinutes = (locationCode: string): number => {
    let totalPlannedMinutes = 0;
    plannedJobs.forEach((location) => {
      if (location.locationCode === locationCode) {
        location.planDateWiseJobModel.forEach((job) => {
          job.processingJobsModel.forEach((data) => {
            const quantity = data.quantity || 0;
            const smv = data.totalSmv || 0;
            totalPlannedMinutes += quantity * smv;
          });
        });
      }
    });
    return totalPlannedMinutes;
  };

  const getActualMinutes = async (locationCode: string[]) => {
    try {
      const req = new LocationDataByDateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, locationCode,'')
      const res = await forecastService.getForecastDataByLocationCode(req)
      if (res.status) {
        setActualMinutes(res.data)
      }
    } catch (err) {
      err.message
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "10px", display: "flex" }}>
        <Select
          style={{ width: 200 }}
          placeholder="Select Section ID"
          allowClear
          showSearch
          onChange={(value) => setSelectedSection(value || null)}
        >
          {sections.map((sec) => (
            <Option key={sec.id} value={sec.id}>
              {sec.secCode}
            </Option>
          ))}
        </Select>
        <div style={{ display: 'flex', marginLeft: "10px", alignItems: "center" }} >
          <span style={{ marginRight: '5px' }}> Plan Input Date: </span>
          <DatePicker onChange={handleDateChange} defaultValue={null} />
        </div>
        <Tag color="blue" style={{ margin: '2px', marginLeft: '15px' }}> Forecast Actual Mins </Tag>
        <Tag color="red" style={{ margin: "2px" }}> Already Planned Mins </Tag>
        <Tag color="orange" style={{ margin: "2px" }}> Available Mins </Tag>
        <Tag color="green" style={{ margin: "2px" }}> Utilization Percentage </Tag>
      </div>
      <Tabs size='small' className='knit-job-ratio-tabs' items={renderProductTabItems()} defaultActiveKey={activeTabKey} onChange={(key) => onTabChange(key)} />
      <Collapse style={{ width: "100%" }} defaultActiveKey={filteredSections.length > 0 ? filteredSections[0].id : null} accordion
        onChange={handlePanelChange}
      >
        {filteredSections.filter(section => processTypeEnumKeys[section.secType] === activeTabKey).map((section, index) => (
          <Panel
            header={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: '5px 10px' }}>
                <div>
                  <span>{section.secCode}</span>
                  {sectionCodes === section.id &&
                    <Popover
                      content={popoverContent}
                      title={<span style={{ display: 'flex', justifyContent: 'center' }}>Downtime Details</span>}
                      trigger="hover"
                      placement="rightBottom"
                    >
                      <img
                        src={Maintanence}
                        alt="maintenance"
                        height="28px"
                        width="28px"
                        style={{ cursor: "pointer", marginLeft: '20px', marginTop: '0px', marginBottom: '0px' }}
                      />
                    </Popover>
                  }
                </div>
                <Tag style={{ alignContent: "center" }} color="orange">
                  {section.processType}
                </Tag>
              </div>
            }
            key={section.id}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", gap: "20px" }}>
              {plannedJobs.map((module) => (
                <div key={module.locationCode}>
                  <section
                    style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}
                  >
                    <Tooltip title="Forecast Actual Mins">
                      <Tag color="blue" style={{ marginLeft: "10px", textAlign: "center", width: "15%", padding: "1px" }}>
                        {/* <strong>{}</strong> */}
                        <strong>16000</strong>
                      </Tag>
                    </Tooltip>
                    <Tooltip title="Already Planned Mins">
                      <Tag color="red" style={{ marginLeft: "10px", textAlign: "center", width: "15%", padding: "1px" }}>
                        <strong>{getEachModulePlannedMinutes(module.locationCode)}</strong>
                      </Tag>
                    </Tooltip>
                    <Tooltip title="Available Mins">
                      <Tag color="orange" style={{ marginLeft: "10px", textAlign: "center", width: "15%", padding: "1px" }}>
                        <strong>
                          {/* {getAvailableMins(module.moduleForecastActualMins, module.moduleAlreadyPlannedMins)} */}
                          50
                        </strong>
                      </Tag>
                    </Tooltip>
                    <Tooltip title="Utilization Percentage">
                      <Tag color="green" style={{ marginLeft: "10px", textAlign: "center", width: "15%", padding: "1px" }}>
                        {/* <strong>{module.utilizationPercentage}%</strong> */}
                        111.1%
                      </Tag>
                    </Tooltip>
                  </section>
                  <div
                    style={{ backgroundColor: module.locationColor, borderRadius: "10px", height: "250px", padding: "10px", width: "263px", overflowY: 'auto' }}
                    onDrop={(e) => handleDrop(e, module.locationCode, module.processingType)}
                    onDragOver={(e) => e.preventDefault()}

                  >
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>{module.locationCode}</span>
                      <Tag style={{ alignContent: "center" }} color="orange">
                        {module.processingType}
                      </Tag>
                    </div>
                    {module.planDateWiseJobModel.map((datesWithJob) => {
                      return <>-
                        <div
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px", textAlign: "center", marginBottom: "5px", color: selectedDate[0] === dayjs(datesWithJob.plannedDate).format("YYYY-MM-DD") ? "#fff" : "#000", background: selectedDate[0] === dayjs(datesWithJob.plannedDate).format("YYYY-MM-DD") ? "linear-gradient(90deg, #4caf50, #81c784)" : "transparent", boxShadow: selectedDate[0] === dayjs(datesWithJob.plannedDate).format("YYYY-MM-DD") ? "0 4px 15px rgba(76, 175, 80, 0.4)" : "none", borderRadius: "10px", padding: "5px", height: "30px", width: "120px", transition: "all 0.3s ease-in-out", transform: selectedDate[0] === dayjs(datesWithJob.plannedDate).format("YYYY-MM-DD") ? "scale(1.05)" : "scale(1)", margin: "0 auto" }}
                        >
                          {dayjs(datesWithJob.plannedDate).format("MM-DD-YYYY")}
                        </div>
                        {datesWithJob.processingJobsModel?.map((e) => {
                          return (
                            <>
                              <div style={{ display: "inline-block", justifyContent: "center", flexWrap: "wrap", height: "auto", overflow: "scroll", scrollbarWidth: "none", gap: "6px", }} >
                                {
                                  <div key={e.jobNumber}>
                                    <Popover
                                      className="module-job-order-tooltip"
                                      title={
                                        <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
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
                                        </div>}
                                    >
                                      <Card
                                        className="module-job-order-card"
                                        key={e.jobNumber}
                                        draggable
                                        onDragStart={(event) => onDragStart(event, e.jobNumber, module.locationCode)}
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
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default SewingModules;
