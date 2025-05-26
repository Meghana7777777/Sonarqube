import { DateRequest, QMS_CommonDatesReq, QMS_DefectRatesModel, QMS_DefectRatesReqDto, QMS_LocVsQualitytypeDefectsModel, QMS_ReporitngStatsInfoModel } from '@xpparel/shared-models';
import { QualityChecksService, QualityTypeServices } from '@xpparel/shared-services';
import { Button, Card, Col, DatePicker, Row, Select, Skeleton } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import React, { useEffect, useState } from 'react'
import { AlertMessages } from '../../../common';
import { DefectRateBarChart } from './defective-rates-bar-chart';
import './dashboard.css';
import HeatmapHighcharts, { LocVsQTHeatMapChart } from './qt-vs-loc-chart';
import { ProCard } from '@ant-design/pro-components';

export default function QMSDashboardN() {

    const [qualityTypeData, setQualityTypeData] = useState<any[]>([])
    const [selectedQualityTypeData, setSelectedQualityTypeData] = useState<any[]>([])
    const [dateRange, setDateRange] = useState<any[]>([]);
    const [key, setKey] = useState<number | string>(Date.now());
    const [hoursTime, setHoursTime] = useState("00");
    const [minutesTime, setMinutesTime] = useState("00");
    const [styleDefectRates, setStyleDefectRates] = useState<QMS_DefectRatesModel[]>([])
    const [processTypesDefectRate, setProcessTypesDefectRate] = useState<QMS_DefectRatesModel[]>([])
    const [qualityTypesDefefctRates, setqualityTypesDefefctRates] = useState<QMS_DefectRatesModel[]>([])
    const [qualityStats, setQualityStats] = useState<QMS_ReporitngStatsInfoModel>({ totalFailPerecnt: 0, totalFailQty: 0, totalPassPercent: 0, totalQalityChecks: 0, defectiveRate: 0, totalPassQty: 0 })
    const user = useAppSelector((state) => state.user.user.user);
    const [isHeaderLoading, setIsHeaderLoading] = useState<boolean>(false)
    const [styleDefectRatesLoading, setStyleDefectRatesLoading] = useState<boolean>(false)
    const [processTypesDefectRateLoading, setProcessTypesDefectRateLoading] = useState<boolean>(false)
    const [qualityTypesDefefctRatesLoading, setqualityTypesDefefctRatesLoading] = useState<boolean>(false)
    const Option = Select;
    const { RangePicker } = DatePicker;
    const qualityTypeService = new QualityTypeServices();
    const qualityChecksService = new QualityChecksService();
    const [qualityTypeVsLocationData, setQualityTypeVsLocationData] = useState<QMS_LocVsQualitytypeDefectsModel[]>([])
    const [qtVsLocLoading,setQtVsLocLoaidng] = useState<boolean>(false)

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



    const handleSearch = () => {
        if (dateRange) {
            const fromDate = dateRange[0].format('YYYY-MM-DD');
            const toDate = dateRange[1].format('YYYY-MM-DD');
            getStyleDefectRates(fromDate, toDate)
            getQualityTypesDefectRates(fromDate, toDate)
            getProcessTypeDefectRates(fromDate, toDate)
            getQulaityRpeortingstats(fromDate, toDate)
            getLocationAndQualityTypeWiseDefectQty(fromDate,toDate)
            setKey(Date.now());
        }
    };

    const getStyleDefectRates = (fromDate, toDate) => {
        setStyleDefectRatesLoading(true)
        const req = new QMS_DefectRatesReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, "STYLE", fromDate, toDate)
        qualityChecksService.getDefectRates(req).then((res) => {
            if (res.status) {
                setStyleDefectRates(res.data)
            } else {
                setStyleDefectRates([])
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }
        ).catch((err) => {
            console.log(err);
            setStyleDefectRates([])
        }).finally(() => {
            setStyleDefectRatesLoading(false)

        })
    }

    const getProcessTypeDefectRates = (fromDate, toDate) => {
        setProcessTypesDefectRateLoading(true)
        const req = new QMS_DefectRatesReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, "PROCESS", fromDate, toDate)
        qualityChecksService.getDefectRates(req).then((res) => {
            if (res.status) {
                setProcessTypesDefectRate(res.data)
            } else {
                setProcessTypesDefectRate([])
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }
        ).catch((err) => {
            console.log(err);
            setProcessTypesDefectRate([])
        }).finally(() => {
            setProcessTypesDefectRateLoading(false)
        })
    }

    const getQualityTypesDefectRates = (fromDate, toDate) => {
        setqualityTypesDefefctRatesLoading(true)
        const req = new QMS_DefectRatesReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, "QUALITY", fromDate, toDate)
        qualityChecksService.getDefectRates(req).then((res) => {
            if (res.status) {
                setqualityTypesDefefctRates(res.data)
            } else {
                setqualityTypesDefefctRates([])
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }
        ).catch((err) => {
            console.log(err);
            setqualityTypesDefefctRates([])
        }).finally(() => {
            setqualityTypesDefefctRatesLoading(false)
        })
    }

    const getQulaityRpeortingstats = (fromDate, toDate) => {
        const dateReq = new DateRequest(fromDate, toDate)
        setIsHeaderLoading(true)
        qualityChecksService.getDashboardHeaderStats(dateReq).then((res) => {
            if (res.status) {
                setQualityStats(res.data)
            } else {
                setQualityStats(null)
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }
        ).catch((err) => {
            console.log(err);
            setQualityStats(null)
        }).finally(() => {
            setIsHeaderLoading(false)
        })

    }

    const getLocationAndQualityTypeWiseDefectQty = (fromDate,toDate) => {
        setQtVsLocLoaidng(true)
        const dateReq = new QMS_CommonDatesReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,fromDate,toDate)
        qualityChecksService.getLocationAndQualityTypeWiseDefectQty(dateReq).then((res) => {
            if (res.status) {
                setQualityTypeVsLocationData(res.data)
            } else {
                setQualityTypeVsLocationData([])
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }
        ).catch((err) => {
            console.log(err);
            setQualityTypeVsLocationData([])
        }).finally(() => {
            setQtVsLocLoaidng(false)
        })
   
    }

    function renderHeaderStats(isLoading: boolean, title: string, value: string) {
        if (isLoading) return <Skeleton active />
        return <Card className='wrap'>
            <div style={{ marginTop: '-32px' }}>
                <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">{title}<svg
                    className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                </svg></h4>
                <span className="hind-font caption-12 c-dashboardInfo__count">{value}</span>
            </div>
        </Card>
    }


    return (
        <ProCard ghost >
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
                    {renderHeaderStats(isHeaderLoading, "Total Quality Check", `${qualityStats.totalQalityChecks > 0 ? qualityStats.totalQalityChecks : 0}`)}
                    {/* <div className="wrap">
                        <div style={{ marginTop: '-32px' }}>
                            <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Quality Check<svg
                                className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                            </svg></h4>
                            <span className="hind-font caption-12 c-dashboardInfo__count">{qualityStats.totalQalityChecks > 0 ? qualityStats.totalQalityChecks : 0} Pcs</span>
                        </div>
                    </div> */}
                </Col>

                <Col className="c-dashboardInfo" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                    {renderHeaderStats(isHeaderLoading, "Total Pass Quantity / %", `${qualityStats.totalPassQty} Pcs / ${qualityStats.totalPassPercent}%`)}
                </Col>
                <Col className="c-dashboardInfo" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                    {renderHeaderStats(isHeaderLoading, "Total Fail Quantity / %", `${qualityStats.totalFailQty} Pcs / ${qualityStats.totalFailPerecnt}%`)}

                </Col>
                 <Col className="c-dashboardInfo" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                    {renderHeaderStats(isHeaderLoading, "DHU", `${qualityStats.defectiveRate}`)}
                </Col>
            </Row >
            <br />
            <Row gutter={[24, 12]}>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 8 }}>

                    <DefectRateBarChart loading={styleDefectRatesLoading} data={styleDefectRates} title='Style wise defect rates' />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 8 }} >

                    <DefectRateBarChart loading={processTypesDefectRateLoading} data={processTypesDefectRate} title='Process type wise defect rates' />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 8 }}>
                    <DefectRateBarChart loading={qualityTypesDefefctRatesLoading} data={qualityTypesDefefctRates} title='Quality type wise defect rates' />
                </Col>
                <Col span={24}>
                    <LocVsQTHeatMapChart loading={qtVsLocLoading} data={qualityTypeVsLocationData} />
                </Col>
            </Row>
        </ProCard>
    )
}
