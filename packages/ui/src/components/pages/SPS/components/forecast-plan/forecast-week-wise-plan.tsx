import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { ForecastPlanYearMonthModel, ForecastQtyUpdateRequest, ForecastYearMonthRequest } from '@xpparel/shared-models';
import { ForecastPlanningService } from '@xpparel/shared-services';
import { Button, Card, Col, message, Modal, Row, Table, Tag } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import EyeIcon from './../../../../../assets/icons/eye.png';

interface ForecastWeekWiseComponentProps {
    selectedYear: number;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const ForecastWeekWiseComponent = ({ selectedYear, handleFileUpload }: ForecastWeekWiseComponentProps) => {
    const [selectedMonth, setSelectedMonth] = useState<number>(0);
    const [weeks, setWeeks] = useState<any[]>([]);
    const service = new ForecastPlanningService()
    const user = useAppSelector((state) => state.user.user.user);
    const [yearMonthData, setYearMonthData] = useState<any>();
    const [isUploadedData, setIsUploadedData] = useState(false);
    const [selectedDayData, setSelectedDayData] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const calculateWeeks = (year: number) => {
            const weeksData: any[] = [];
            for (let month = 0; month < 12; month++) {
                const monthWeeks: any[] = [];
                const firstDayOfMonth = new Date(year, month, 1);
                const lastDayOfMonth = new Date(year, month + 1, 0);
                let currentDate = new Date(firstDayOfMonth);
                while (currentDate <= lastDayOfMonth) {
                    const weekDays: string[] = [];
                    for (let i = 0; i < 7; i++) {
                        if (currentDate <= lastDayOfMonth) {
                            weekDays.push(currentDate.toDateString());
                            currentDate.setDate(currentDate.getDate() + 1);
                        } else {
                            break;
                        }
                    }
                    monthWeeks.push({
                        week: monthWeeks.length + 1,
                        days: weekDays,
                    });
                }
                weeksData.push({ month, monthName: getMonthName(month), weeks: monthWeeks });
            }

            return weeksData;
        };

        const weeksData = calculateWeeks(selectedYear);
        setWeeks(weeksData);
    }, [selectedYear]);

    const groupByWeeks = (data: any[], year: number, month: number) => {
        const groupedData: { [week: number]: any[] } = {};
    
        data.forEach((item) => {
            const date = new Date(item.date);
            if (date.getFullYear() === year && date.getMonth() === month) {
                const firstDayOfMonth = new Date(year, month, 1);
                const daysSinceFirstDay = (date.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24);
                const weekNumber = Math.floor(daysSinceFirstDay / 7) + 1;
                if (!groupedData[weekNumber]) {
                    groupedData[weekNumber] = [];
                }
                groupedData[weekNumber].push(item);
            }
        });
    
        return groupedData;
    };    

    const fetchForecastStatus = async (year: number, month: number) => {
        try {
            const req = new ForecastYearMonthRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, year.toString(), (month + 1).toString());
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
                    const weekWiseData = groupByWeeks(res.data, year, month)
                    setYearMonthData(weekWiseData);
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

    const getIcon = (weekNumber: number, weekDays: string[]) => {
        const weekData = yearMonthData?.[weekNumber];
        const isUploaded = weekData?.some((item: any) => item.isUploaded);
        return isUploaded ? (
            <>
                <CheckCircleOutlined style={{ color: "green", fontSize: "24px", cursor: "pointer" }} />
                <img
                    src={EyeIcon}
                    alt="eye outlined"
                    height="20px"
                    width="20px"
                    style={{ marginLeft: "15px", cursor: "pointer" }}
                    onClick={() => handleViewClick(weekNumber)}
                />
            </>
        ) : (
            <>
                <UploadOutlined
                    onClick={() => {
                        document.getElementById("file-input")?.click();
                    }}
                    style={{ color: "blue", fontSize: "24px", cursor: "pointer" }}
                />
                <input
                    type="file"
                    id="file-input"
                    style={{ display: "none" }}
                    accept=".xlsx"
                    onChange={(event) => {
                        handleFileUpload(event);
                    }}
                />
            </>
        );
    };

    const handleViewClick = (weekNumber: number) => {
        const weekDetails = yearMonthData?.[weekNumber];
        if (weekDetails) {
            setSelectedDayData(weekDetails);
            setIsUploadedData(true);
            setIsModalVisible(true);
        } else {
            message.info("No data available for the selected week.");
        }
    };

    useEffect(() => {
        if (selectedMonth >= 0) {
            fetchForecastStatus(selectedYear, selectedMonth);
        }
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        setSelectedMonth(0);
    }, []);

    const handleMonthClick = (index: number) => {
        setSelectedMonth(index);
    };

    const getMonthName = (monthIndex: number) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        return monthNames[monthIndex];
    };

    const updateForecastQty = () => {
        const updatedRecords = selectedDayData.map((record) => {
            const { date, forecastQty } = record;
            return new ForecastQtyUpdateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, date, forecastQty);
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
        <>
            <Row gutter={[16, 16]} justify="center" className="months-row">
                {weeks.map((monthData, monthIndex) => (
                    <Col span={2} xs={6} sm={4} md={2} key={monthData.month} className="month-col">
                        <Tag
                            className={`month-tag ${selectedMonth === monthIndex ? 'selected' : ''}`}
                            onClick={() => handleMonthClick(monthIndex)}
                            style={{
                                backgroundColor: `hsl(${Math.random() * 360}, 100%, 75%)`,
                                borderRadius: '0',
                                padding: '4px 8px',
                                margin: '0 8px',
                            }}
                        >
                            {monthData.monthName}
                        </Tag>
                    </Col>
                ))}
            </Row>
            <Card className="dates-card">
                <Row gutter={[16, 16]} justify="center" className="">
                    {weeks[selectedMonth]?.weeks.map((week: any, index: number) => (
                        <Col key={index} span={4} className="day-col">
                            <Card className="week-card" hoverable>
                                <div>
                                    Week {week.week}
                                </div>
                                <div className="day-icon">
                                    {new Date(week.days[0]).getDate()} - {new Date(week.days[week.days.length - 1]).getDate()}
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                {getIcon(week.week, week.days)}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
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
                    <Button key="save" type="primary" onClick={updateForecastQty}>
                        Update
                    </Button>
                ]}
            >
                <Table
                    columns={viewColumns}
                    dataSource={selectedDayData}
                    rowKey="date"
                    pagination={false}
                />
            </Modal>
        </>
    );
};
