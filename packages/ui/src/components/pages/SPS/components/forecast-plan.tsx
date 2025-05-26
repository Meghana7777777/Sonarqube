import { CheckCircleOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { ForecastPlanModel, ForecastPlanYearMonthModel, ForecastQtyUpdateRequest, ForecastYearMonthRequest, Months } from "@xpparel/shared-models";
import { ForecastPlanningService } from "@xpparel/shared-services";
import { Button, Card, Col, message, Modal, Row, Select, Table, Tabs, Tag } from "antd";
import moment from "moment";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import EyeIcon from './../../../../assets/icons/eye.png';
import "./forecast-plan.css";
import { ForecastMonthWiseComponent } from "./forecast-plan/forecast-month-wise-plan";
import { ForecastWeekWiseComponent } from "./forecast-plan/forecast-week-wise-plan";

const { Meta } = Card;
const { Option } = Select;

const ForecastPlan = () => {
	const [selectedMonth, setSelectedMonth] = useState<number>(0);
	const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
	const service = new ForecastPlanningService()
	const user = useAppSelector((state) => state.user.user.user);
	const [yearMonthData, setYearMonthData] = useState<{ [day: number]: { isUploaded: boolean; details: { [key: string]: any } } }>({});
	const [uploadedData, setUploadedData] = useState<any[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [activeTab, setActiveTab] = useState('day-wise');
	const [isUploadedData, setIsUploadedData] = useState(false);
	const [selectedDayData, setSelectedDayData] = useState<any[]>([]);
	const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

	const getDaysInMonth = (month: number, year: number): number[] => {
		const days = new Date(year, month + 1, 0).getDate();
		return Array.from({ length: days }, (_, i) => i + 1);
	};

	useEffect(() => {
		if (selectedYear && selectedMonth != null) {
			fetchForecastStatus(selectedYear, selectedMonth);
		}
	}, []);

	const fetchForecastStatus = async (year: number, month: number) => {
		try {
			const req = new ForecastYearMonthRequest( user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, year.toString(), (month + 1).toString());
			service.getForecastStatusByYearAndMonth(req).then((res) => {
				if (res.status) {
					const transformedData = Array.isArray(res.data)
						? res.data.reduce((acc: { [day: number]: { isUploaded: boolean; details: { [key: string]: any } } }, item: ForecastPlanYearMonthModel) => {
							if (item.date) {
								const date = new Date(item.date);
								const day = date.getDate();
								acc[day] = {
									isUploaded: item.isUploaded,
									details: item,
								};
							}
							return acc;
						}, {})
						: {};

					setYearMonthData(transformedData);
					message.success("Forecast data loaded successfully.");
				} else {
					message.error("Failed to fetch forecast data.");
				}
			}).catch(() => {
				message.error("Error occurred while fetching data.");
			});

		} catch (err) {
			message.error("Error occurred while fetching data.");
		}
	};


	const handleMonthClick = (index: number) => {
		setSelectedMonth(index);
		fetchForecastStatus(selectedYear, index);
	};

	const handleYearChange = (year: number) => {
		setSelectedYear(year);
		fetchForecastStatus(year, selectedMonth);
	};

	const handleTabChange = (key: string) => {
		setActiveTab(key);
	};

	const days = getDaysInMonth(selectedMonth, selectedYear);

	const getIcon = (day: number) => {
		const dayData = yearMonthData[day];
		const isUploaded = dayData ? dayData.isUploaded : false;
		return isUploaded ? (
			<>
				<CheckCircleOutlined style={{ color: "green", fontSize: "24px", cursor: "pointer" }} />
				<img src={EyeIcon} alt="eye outlined" height='20px' width='20px' style={{ marginLeft: "15px", cursor: "pointer" }}
					onClick={() => handleViewClick(day)}
				/>
			</>
		) : (
			<>
				<UploadOutlined
					onClick={() => document.getElementById("file-input")?.click()}
					style={{ color: "blue", fontSize: "24px", cursor: "pointer" }}
				/>
				<input
					type="file"
					id="file-input"
					style={{ display: "none" }}
					accept=".xlsx"
					onChange={handleFileUpload}
				// ref={(input) => { this.fileInput = input }}
				/>
			</>
		);
	};

	const handleViewClick = (day: number) => {
		const dayDetails = yearMonthData[day]?.details;
		if (dayDetails) {
			setSelectedDayData([dayDetails]);
			setIsUploadedData(false);
			setIsModalVisible(true);
		} else {
			message.info("No data available for the selected day.");
		}
	};



	const downloadExcel = () => {
		const uniqueFilename = `Forecast-Plan-template-${moment(new Date()).unix()}.xlsx`;
		const link = document.createElement('a');
		link.href = './assets/Forecast-Plan-template.xlsx';
		link.download = uniqueFilename;
		link.click();
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: "array" });
				const sheet = workbook.Sheets[workbook.SheetNames[0]];
				const jsonData = XLSX.utils.sheet_to_json(sheet);
				validateAndDisplayData(jsonData);
			};
			reader.readAsArrayBuffer(file);
		}
		event.target.value = '';
	};

	const isForecastPlanModel = (item: any): item is ForecastPlanModel => {
		return (
			typeof item.module === "string" &&
			typeof item.workstationCode === "string" &&
			(typeof item.styleOrMo === "string" || typeof item.styleOrMo === "number") &&
            (typeof item.scheduleOrMoLine === "string" || typeof item.scheduleOrMoLine === "number") &&
			typeof item.color === "string" &&
			typeof item.planCutDate === "string" &&
			typeof item.planDelDate === "string" &&
			typeof item.planPcs === "number" &&
			typeof item.planSah === "number" &&
			typeof item.smv === "number" &&
			typeof item.planSmo === "number" &&
			typeof item.planEff === "number" &&
			typeof item.planType === "string" &&
			typeof item.date === "string"
		);
	};

	const excelSerialToDate = (serial: number): string => {
		const date = moment.utc("1899-12-30").add(serial, 'days');
		return date.format('YYYY-MM-DD');
	};

	const validateAndDisplayData = (data: any[]) => {
		const validData = data.map((item: any) => {
			const planCutDate = excelSerialToDate(item.plan_cut_date);
			const planDelDate = excelSerialToDate(item.plan_del_date);
			const date = excelSerialToDate(item.Date);

			const formattedItem = {
				module: String(item.Module),
				workstationCode: item["Workstation Code"],
				styleOrMo: item["style/mo"],
				scheduleOrMoLine: item["schedule/mo line"],
				color: item.color,
				planCutDate,
				planDelDate,
				planPcs: item.Plan_pcs,
				planSah: item.plan_sah,
				smv: item.smv,
				planSmo: item.plan_smo,
				planEff: item.plan_eff,
				planType: item["Plan Type"],
				date,
			};
			const isValid = isForecastPlanModel(formattedItem);
			return { ...formattedItem, isValid };
		});
		const invalidData = validData.filter((item) => !item.isValid);
		if (invalidData.length > 0) {
			message.error("The uploaded file contains invalid data.");
		} else {
			setUploadedData(validData);
			setIsUploadedData(true);
			setIsModalVisible(true);
		}
	};

	const saveForecastPlan = () => {
		const modelArray: ForecastPlanModel[] = []
		uploadedData.forEach((item) => {
			const forecastPlanModel = new ForecastPlanModel(
				user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, item.module, item.workstationCode, item.styleOrMo, item.scheduleOrMoLine, item.color, item.planCutDate, item.planDelDate, item.planPcs, item.planSah, item.smv, item.planSmo, item.planEff, item.planType, item.date);
			modelArray.push(forecastPlanModel)
		});
		service.saveForecastPlan(modelArray).then((res) => {
			if (res.status) {
				message.success("Data saved successfully!");
				fetchForecastStatus(selectedYear, selectedMonth)
				setIsModalVisible(false)
			} else {
				message.error("Error saving data.");
			}
		}).catch((err) => {
			console.error("Error occurred while saving forecast plan:", err);
			message.error("Error occurred while saving data.");
		});
	};

	const updateForecastQty = () => {
		const updatedRecords = selectedDayData.map((record) => {
			const { date, forecastQty } = record;
			return new ForecastQtyUpdateRequest( user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, date, forecastQty);
		});
		service.updateForecastQty(updatedRecords).then((res) => {
			if (res.status) {
				message.success("forecastQty updated successfully!");
			} else {
				message.error("Error upadting data.");
			}
		}).catch((err) => {
			console.error("Error occurred while updating forecastQty:", err);
			message.error("Error occurred while updating data.");
		});
	};

	const uploadColumns = [
		{ title: "Module", dataIndex: "module" },
		{ title: "Workstation Code", dataIndex: "workstationCode" },
		{ title: "Style or MO", dataIndex: "styleOrMo" },
		{ title: "Schedule or MO Line", dataIndex: "scheduleOrMoLine" },
		{ title: "Color", dataIndex: "color" },
		{ title: "Plan Cut Date", dataIndex: "planCutDate" },
		{ title: "Plan Delivery Date", dataIndex: "planDelDate" },
		{ title: "Plan Pieces", dataIndex: "planPcs" },
		{ title: "Plan SAH", dataIndex: "planSah" },
		{ title: "SMV", dataIndex: "smv" },
		{ title: "Plan SMO", dataIndex: "planSmo" },
		{ title: "Plan Efficiency", dataIndex: "planEff" },
		{ title: "Plan Type", dataIndex: "planType" },
		{ title: "Date", dataIndex: "date" },
	];

	const viewColumns = [
		{ title: "Module", dataIndex: "module" },
		{ title: "Workstation Code", dataIndex: "workstationCode" },
		{ title: "Style or MO", dataIndex: "styleOrMo" },
		{ title: "Schedule or MO Line", dataIndex: "scheduleOrMoLine" },
		{ title: "Color", dataIndex: "color" },
		{ title: "Plan Cut Date", dataIndex: "planCutDate" },
		{ title: "Plan Delivery Date", dataIndex: "planDelDate" },
		{ title: "Plan Pieces", dataIndex: "planPcs" },
		{ title: "Plan SAH", dataIndex: "planSah" },
		{ title: "SMV", dataIndex: "smv" },
		{ title: "Plan SMO", dataIndex: "planSmo" },
		{ title: "Plan Efficiency", dataIndex: "planEff" },
		{ title: "Plan Type", dataIndex: "planType" },
		{ title: "Date", dataIndex: "date" },
		{
			title: "Forecast Quantity",
			dataIndex: "forecastQty",
			render: (_, record) => (
			  <input
				type="number"
				value={record.forecastQty ?? record.planPcs}
				onChange={(e) => handleForecastQuantityChange(e, record.key)}
				style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
			  />
			),
		  },
	];

	const handleForecastQuantityChange = (e, key) => {
		const value = Number(e.target.value);
		const updatedData = selectedDayData.map((item) =>
		  item.key === key ? { ...item, forecastQty: value } : item
		);
		setSelectedDayData(updatedData);
	  };
	
	return (
		<div className="monthly-calendar">
			<Card size="small"
				className="monthly-calendar"
				headStyle={{ backgroundColor: '#01576F' }}
				title={
					<span
						style={{
							display: "flex",
							justifyContent: "center",
							color: "white",
							padding: "10px",
							borderRadius: "8px",
						}}
					>
						Forecast Plan
					</span>
				}
				extra={
					<>
						<Select
							value={selectedYear}
							onChange={handleYearChange}
							style={{ width: 120 }}
							placeholder="Select Year"
							size="small"
						>
							{years.map((year) => (
								<Option key={year} value={year}>
									{year}
								</Option>
							))}
						</Select>
						<Button
							type="primary"
							icon={<DownloadOutlined />}
							onClick={downloadExcel}
							style={{ marginLeft: "10px" }}
							size="small"
						>
							Download Excel
						</Button>
					</>
				}
			>
				<Tabs defaultActiveKey="day-wise" onChange={handleTabChange} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '100px' }}>
					<Tabs.TabPane
						tab={<Tag
							color="blue"
							style={{ background: 'linear-gradient(90deg, rgba(25,25,112,1) 0%, rgba(0,0,255,1) 100%)', color: 'white', borderRadius: '0px' }}
						>
							Day Wise Forecast Plan
						</Tag>}
						key="day-wise"
					>
						<Row gutter={[16, 16]} justify="center" className="months-row">
							{Object.values(Months).map((month, index) => (
								<Col span={2} xs={6} sm={4} md={2} key={month} className="month-col">
									<Tag
										className={`month-tag ${selectedMonth === index ? "selected" : ""}`}
										onClick={() => handleMonthClick(index)}
										style={{ backgroundColor: `hsl(${Math.random() * 360}, 100%, 75%)`, borderRadius: '0', padding: '4px 8px', margin: '0 8px' }}
									>
										{month}
									</Tag>
								</Col>
							))}
						</Row>

						<Card className="dates-card">
							<Row gutter={[16, 16]} justify="center" className="days-grid">
								{days.map((day) => {
									const formattedDate = moment(`${selectedYear}-${selectedMonth + 1}-${day}`, 'YYYY-MM-DD').format('DD-MM-YYYY');
									return (
										<Col key={day} xs={12} sm={8} md={6} lg={4} xl={3} className="day-col">
											<Card className="day-card" hoverable>
												<div className="day-content">
													<Meta title={formattedDate} />
													<div className="day-icon">
														{getIcon(day)}
													</div>
												</div>
											</Card>
										</Col>
									);
								})}
							</Row>
						</Card>
					</Tabs.TabPane>
					<Tabs.TabPane
						tab={
							<Tag
								color="green"
								style={{ background: 'linear-gradient(90deg, rgba(0,94,77,1) 0%, rgba(0,153,105,1) 100%)', color: 'white', borderRadius: '0px' }}
							>
								Week Wise Forecast Plan
							</Tag>
						}
						key="week-wise"
					>
						<ForecastWeekWiseComponent selectedYear={selectedYear} handleFileUpload={handleFileUpload} />
					</Tabs.TabPane>

					<Tabs.TabPane
						tab={
							<Tag
								color="orange"
								style={{ background: 'linear-gradient(120deg, rgba(0,131,143,1) 0%, rgba(0,184,212,1) 50%, rgba(0,229,255,1) 100%)', color: 'white', borderRadius: '0px', }}
							>
								Month Wise Forecast Plan
							</Tag>
						}
						key="month-wise"
					>
						<ForecastMonthWiseComponent selectedYear={selectedYear} handleFileUpload={handleFileUpload} />
					</Tabs.TabPane>
				</Tabs>
			</Card>

			<Modal
				title="Uploaded Data"
				width='90%'
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={[
					<Button key="back" onClick={() => setIsModalVisible(false)}>
						Cancel
					</Button>,
					isUploadedData ? (
						<Button key="save" type="primary" onClick={saveForecastPlan}>
						  Save Data
						</Button>
					  ) : (
						<Button key="save" type="primary" onClick={updateForecastQty}>
						  Update
						</Button>
					  ),
				]}
			>
				{isUploadedData ? (
					<Table
						columns={uploadColumns}
						dataSource={uploadedData}
						rowKey="date"
						pagination={false}
					/>
				) : (
					<Table
						columns={viewColumns}
						dataSource={selectedDayData}
						rowKey="date"
						pagination={false}
					/>
				)}
			</Modal>
		</div>
	);
};

export default ForecastPlan;