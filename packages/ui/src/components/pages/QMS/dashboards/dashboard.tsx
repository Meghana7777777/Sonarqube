import { PoCreationService, QualityTypeServices } from "@xpparel/shared-services";
import { Button, Card, Col, DatePicker, message, Row, Select } from "antd";
import { useEffect, useState } from "react";
import './dashboard.css';
import { DefectWise } from "./defect-wise";
import { POWise } from "./po-wise";

const QMSDahsboard = () => {
    const poCreationService = new PoCreationService();
    const [totalDefects, setTotalDefects] = useState<any>([])
    const [totalPassCount, setPassCount] = useState<any>([])
    const [totalFailCount, setFailCount] = useState<any>([])
    const [topTenDefects, setTopTenDefects] = useState<any>([])
    const [qualityTypeData, setQualityTypeData] = useState<any[]>([])
    const [qualityWiseTopTenDefects, setQualityWiseTopTenDefects] = useState<any[]>([])
    const [selectedQualityTypeData, setSelectedQualityTypeData] = useState<any[]>([])
    const [dateRange, setDateRange] = useState<any[]>([]);
    const [key, setKey] = useState<number | string>(Date.now());
    const [hoursTime, setHoursTime] = useState("00");
    const [minutesTime, setMinutesTime] = useState("00");
    const Option = Select;
    const { RangePicker } = DatePicker;
    const qualityTypeService = new QualityTypeServices();

    console.log(qualityWiseTopTenDefects, 'qualityWiseTopTenDefects');

    useEffect(() => {
        getAllActiveQualityType();
    }, [])

    const handleSearch = () => {
        if (dateRange) {
            const fromDate = dateRange[0].format('YYYY-MM-DD');
            const toDate = dateRange[1].format('YYYY-MM-DD');
            getAllTotalDefects(fromDate, toDate);
            getAllPassCount(fromDate, toDate);
            getAllFailCount(fromDate, toDate);
            getAllTopTenDefects(fromDate, toDate);
            if (selectedQualityTypeData) {
                getAllQualityTypeTopTenDefects(fromDate, toDate, selectedQualityTypeData);
            }
            setKey(Date.now());
        }
    };

    useEffect(() => {
        const updateTime = () => {
            const currentDate = new Date();
            let hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const amPm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;
            const formattedHours = hours.toString().padStart(2, "0");
            const formattedMinutes = minutes.toString().padStart(2, "0");
            setHoursTime(`${formattedHours}`);
            setMinutesTime(formattedMinutes);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const getAllTotalDefects = (fromDate?, toDate?) => {
        poCreationService.getAllTotalDefects({ fromDate, toDate }).then((res) => {
            if (res.status) {
                setTotalDefects(res.data)
            } else {
                setTotalDefects([])
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const getAllPassCount = (fromDate?, toDate?) => {
        poCreationService.getAllPassCount({ fromDate, toDate }).then((res) => {
            if (res.status) {
                setPassCount(res.data)
            } else {
                setPassCount([])
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const getAllFailCount = (fromDate?, toDate?) => {
        poCreationService.getAllFailCount({ fromDate, toDate }).then((res) => {
            if (res.status) {
                setFailCount(res.data)
            } else {
                setFailCount([])
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const getAllTopTenDefects = (fromDate?, toDate?) => {
        poCreationService.getAllTopTenDefects({ fromDate, toDate }).then((res) => {
            if (res.status) {
                setTopTenDefects(res.data)
            } else {
                setTopTenDefects([])
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const getAllQualityTypeTopTenDefects = (fromDate, toDate, qualityTypeId) => {
        if (!fromDate || !toDate) {
            message.warning('Select Date');
            return;
        }
        poCreationService.getAllQualityTypeTopTenDefects({ fromDate, toDate, qualityTypeId })
            .then((res) => {
                if (res.status) {
                    setQualityWiseTopTenDefects(res.data);
                } else {
                    setQualityWiseTopTenDefects([]);
                }
            })
            .catch((err) => {
                console.error('Error fetching defects:', err);
            });
    };


    const getAllActiveQualityType = () => {
        qualityTypeService.getAllActiveQualityType().then((res) => {
            if (res.status) {
                setQualityTypeData(res.data)
            } else {
                setQualityTypeData([])
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const calculatePassPercentage = () => {
        if (totalDefects?.length > 0 && totalPassCount?.length > 0) {
            const totalDfectsCount = totalDefects?.reduce((sum, item) => sum + item.totalDefects, 0);
            const totalPass = totalPassCount?.reduce((sum, item) => item.passResult, 0);
            if (totalPass > 0) {
                const percentage = (totalPass / totalDfectsCount) * 100;
                return percentage.toFixed(0);
            } else {
                return 0;
            }
        }
        return 0;
    };

    const calculateFailPercentage = () => {
        if (totalDefects?.length > 0 && totalFailCount?.length > 0) {
            const totalCheckCount = totalDefects?.reduce((sum, item) => sum + item.totalDefects, 0);
            const totalFail = totalFailCount?.reduce((sum, item) => item.failResult, 0);
            if (totalFail > 0) {
                const percentage = (totalFail / totalCheckCount) * 100;
                return percentage.toFixed(0);
            } else {
                return 0;
            }
        }

        return 0;
    };

    const calculateDefectRatePer100Pcs = () => {
        if (totalDefects?.length > 0 && totalFailCount?.length > 0) {
            const totalCheckCount = totalDefects?.reduce((sum, item) => sum + item.totalDefects, 0);
            const totalFail = totalFailCount?.reduce((sum, item) => item.failResult, 0);
            if (totalCheckCount > 0) {
                const defectRatePer100Pcs = (totalFail / 100) * 100;
                return defectRatePer100Pcs.toFixed(0);
            } else {
                return 0;
            }
        }

        return 0;
    };

    const CommonColumn1 = () => {
        const colors = ['#15b0ff', '#2f84f9', '#35c498', '#a2c523', '#ff5733', '#ffbd33', '#33ff57', '#33ffbd', '#3385ff', '#8a33ff'];
        return (
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 6 }}>
                <Card style={{ width: '100%', height: '100%', textAlign: 'center' }} title="Top 10 Defects">
                    <div className="defect-container">
                        <Row gutter={6}>
                            {topTenDefects.slice(0, 10).map((defect, index) => (
                                <Col key={index} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
                                    <div className={`defect defect${index + 1}`} style={{ height: '70px', marginTop: '10px', backgroundColor: colors[index % colors.length] }}>
                                        {defect.reasonName} - {defect.defectRate} Pcs
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Card>
            </Col>
        );
    };

    const colors = ['#12b8f1', '#ff6347', '#32cd32', '#F5B17B', '#ffa500', '#015551', '#00ced1', '#ffd700', '#354259', '#8a2be2']; // Add more colors as needed

    const passDefectPercentage = calculatePassPercentage();
    const failDefectPercentage = calculateFailPercentage();
    const defectPercentage = calculateDefectRatePer100Pcs();

    const handleQualityTypeChange = (value) => {
        setSelectedQualityTypeData(value);

        if (dateRange?.length === 2) {
            const fromDate = dateRange[0].format('YYYY-MM-DD');
            const toDate = dateRange[1].format('YYYY-MM-DD');
            getAllQualityTypeTopTenDefects(fromDate, toDate, value);
        } else {
            message.warning('Select Date Range');
        }
    };


    return (
        <>
            <Card style={{ height: "100%" }}>
                <Card style={{ width: '100%', height: '100%', backgroundColor: '#16203b', position: 'sticky', top: '9%', zIndex: '10' }} hoverable>
                    <Row gutter={24}>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 9 }} style={{ color: 'white', borderRight: '1px solid #fff', padding: '0 15px' }}>
                            <div style={{ fontSize: '15px', textAlign: 'center', marginTop: '3%' }}>
                                <RangePicker
                                    format="YYYY-MM-DD"
                                    onChange={(dates) => {
                                        setDateRange(dates);
                                    }}
                                />
                                <Button type='primary' style={{ backgroundColor: 'green' }} onClick={() => handleSearch()}> Search </Button>
                            </div>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 9 }} style={{ color: 'white', borderRight: '1px solid #fff', padding: '0 15px' }}>
                            <div style={{ fontSize: '15px', textAlign: 'center', marginTop: '3%' }}>QMS</div>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 3 }} style={{ color: 'white', borderRight: '1px solid #fff', padding: '0 15px' }}>
                            <div style={{ fontSize: '30px', textAlign: 'center' }}>{hoursTime}</div>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 3 }} style={{ color: 'white', padding: '0 15px' }}>
                            <div style={{ fontSize: '30px', textAlign: 'center' }}>{minutesTime}</div>
                        </Col>
                    </Row>
                </Card>
                <br />

                <Row gutter={24}>
                    <Col className="c-dashboardInfo" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                        <div className="wrap">
                            <div style={{ marginTop: '-32px' }}>
                                <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Quality Check<svg
                                    className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                </svg></h4>
                                <span className="hind-font caption-12 c-dashboardInfo__count">{totalDefects?.length > 0 ? totalDefects[0].totalDefects : 0} Pcs</span>
                            </div>
                        </div>
                    </Col>
                    <Col className="c-dashboardInfo" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                        <div className="wrap">
                            <div style={{ marginTop: '-32px' }}>
                                <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Pass Quantity / %<svg
                                    className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                </svg></h4>
                                <span className="hind-font caption-12 c-dashboardInfo__count">{totalPassCount?.length > 0 ? totalPassCount[0].passResult : 0} Pcs / {passDefectPercentage}%</span>
                            </div>
                        </div>
                    </Col>
                    <Col className="c-dashboardInfo" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                        <div className="wrap">
                            <div style={{ marginTop: '-32px' }}>
                                <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Fail Quantity / %<svg
                                    className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                </svg></h4>
                                <span className="hind-font caption-12 c-dashboardInfo__count"> {totalFailCount?.length > 0 ? totalFailCount[0].failResult : 0} Pcs / {failDefectPercentage}%</span>
                            </div>
                        </div>
                    </Col>
                    <Col className="c-dashboardInfo" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                        <div className="wrap">
                            <div style={{ marginTop: '-32px' }}>
                                <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Defective Rate / 100 Pcs<svg
                                    className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                </svg></h4>
                                <span className="hind-font caption-12 c-dashboardInfo__count">{defectPercentage} %</span>
                            </div>
                        </div>
                    </Col>
                </Row >
                <br />

                <Row gutter={24}>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 9 }} >
                        <DefectWise key={key} fromDate={dateRange[0]?.format('YYYY-MM-DD')} toDate={dateRange[1]?.format('YYYY-MM-DD')} />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 9 }} >
                        <POWise key={key} fromDate={dateRange[0]?.format('YYYY-MM-DD')} toDate={dateRange[1]?.format('YYYY-MM-DD')} />
                    </Col>
                    <CommonColumn1 />
                </Row>
                <br />

                <Card
                    title={
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 5 }} xl={{ span: 6 }}>
                            <Select placeholder="Select Quality Type" style={{ width: "100%" }} showSearch allowClear optionFilterProp='children'
                                onChange={handleQualityTypeChange}
                            >
                                {qualityTypeData.map((rec) => (
                                    <Option key={rec.id} value={rec.id}>
                                        {rec.qualityType}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    }
                >
                    <Row gutter={24}>
                        {qualityWiseTopTenDefects.map((rec, index) => (
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }} key={index}>
                                <div className="card">
                                    <div style={{ fontSize: '20px', backgroundColor: colors[index % colors.length], padding: '10px', borderRadius: '8px 8px 0 0' }}>
                                        {rec.reason_name}
                                    </div>
                                    <div style={{ fontSize: '20px', color: 'black', backgroundColor: '#e5f8ff', padding: '10px', borderRadius: '0 0 8px 8px', borderTop: '1px solid #ccc' }}>
                                        {rec.defectRate}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </Card >
        </>
    )
}
export default QMSDahsboard;