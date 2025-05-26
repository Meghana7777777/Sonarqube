import { CommonRequestAttrs, WareHouseResponseDto, WhFloorRequest, WhRequestDashboardInfoModel } from "@xpparel/shared-models";
import { PKMSFgWarehouseService, WareHouseService } from "@xpparel/shared-services";
import { Card, Col, Divider, Form, Row, Select, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import Approved from './../../../../../assets/icons/approved.png';
import Cartons from './../../../../../assets/icons/cartons.png';
import Completed from './../../../../../assets/icons/completed.png';
import FGIN from './../../../../../assets/icons/fg-in.png';
import FGOUT from './../../../../../assets/icons/fg-out.png';
import LocationIN from './../../../../../assets/icons/location-in.png';
import LocationOut from './../../../../../assets/icons/location-out.png';
import Packlists from "./../../../../../assets/icons/packlists.png";
import ManufacturingOrders from './../../../../../assets/icons/manufacturing-orders.png';
import TotalRequests from './../../../../../assets/icons/total-requests.png';
import Inprogress from './../../../../../assets/icons/work-in-progress.png';
import { fgWhReqColumns } from "./fg-wh-req-columns";
import './fg-wh-rq-analysis-dashboard.css';


export const FgWhReqAnalysis = () => {
    const [form] = useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const service = new PKMSFgWarehouseService();
    const [whdashboardData, setWhDashboardData] = useState<WhRequestDashboardInfoModel>()
    const [warehouseDropDown, setWarehouseDropDown] = useState<WareHouseResponseDto[]>([]);
    const [floors, setFloors] = useState<number>();
    const wareHouseService = new WareHouseService()

    useEffect(() => {
        getWareHouseDropDown();
        setWhDashboardData(null);
    }, []);

    const getWareHouseDropDown = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        wareHouseService.getWareHouseDropDown(req).then(res => {
            if (res.status) {
                setWarehouseDropDown(res.data)
            } else {
                setWarehouseDropDown([])
            }
        }).catch(err => console.log(err.message))
    }

    const wareHouseOnChange = (value: string) => {
        const record = warehouseDropDown.find((rec) => rec.wareHouseCode === value);
        if (record?.noOfFloors) {
            setFloors(record.noOfFloors);
        } else {
            setFloors(0);
        }
    }

    const getWhRequestDetailsForDashboard = async (whCode: string, floor: string) => {
        try {
            const requestPayload = new WhFloorRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, whCode, floor);
            const response = await service.getWhRequestDetailsForDashboard(requestPayload);
            if (response.status) {
                setWhDashboardData(response.data);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('An error occurred while fetching warehouse request details:', error.message || error);
        }
    };

    const handleFloorChange = async (value: string) => {
        try {
            const values = await form.validateFields();
            const { toWhCode } = values;
            if (toWhCode && value) {
                getWhRequestDetailsForDashboard(toWhCode, value);
            }
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    const days = whdashboardData?.WhRequestsApprovalCountInfo?.map(item => item.date);
    const dailyRequests = whdashboardData?.WhRequestsApprovalCountInfo?.map(item => item.requestsCount);
    const approvalRequests = whdashboardData?.WhRequestsApprovalCountInfo?.map(item => item.approvedCount);

    const options: Highcharts.Options = {
        title: {
            text: 'Daily Requests vs Approval Requests',
            style: {
                fontSize: '16px',
            },
        },
        xAxis: {
            categories: days,
            title: {
                text: 'Days',
            },
            crosshair: true,
        },
        yAxis: {
            title: {
                text: 'Requests',
            },
        },
        tooltip: {
            shared: true,
        },
        series: [
            {
                name: 'Daily Requests',
                data: dailyRequests,
                type: 'line',
                color: '#2196F3',
            },
            {
                name: 'Approval Requests',
                data: approvalRequests,
                type: 'line',
                color: '#4CAF50',
            },
        ],
        credits: {
            enabled: false,
        },
        chart: {
            height: 300,
        },
    };
    const chartOptions: Highcharts.Options = {
        chart: {
            type: "pie",
        },
        title: {
            text: `Rejection & Approval Analysis`,
        },
        tooltip: {
            pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
        },
        accessibility: {
            point: {
                valueSuffix: "%",
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                },
            },
        },
        series: [
            {
                name: "Requests",
                colorByPoint: true,
                type: "pie",
                data: [
                    {
                        name: "Rejected Requests",
                        y: whdashboardData?.rejApprovePercentageInfo[0]?.rejectionPercentage,
                        color: "#FF6F61",
                    },
                    {
                        name: "Approved Requests",
                        y: whdashboardData?.rejApprovePercentageInfo[0]?.approvalPercentage,
                        color: "#4CAF50",
                    },
                ],
            } as Highcharts.SeriesPieOptions,
        ],
    };

    const tableContainerStyle: React.CSSProperties = {
        padding: '20px',
        backgroundColor: '#f9f9f9',
        width: '100%'
    };

    const headerStyle: React.CSSProperties = {
        backgroundColor: '#001529',
        color: '#fff',
        fontWeight: 'bold',
    };

    const lightRowStyle: React.CSSProperties = {
        backgroundColor: '#ffffff',
    };

    const darkRowStyle: React.CSSProperties = {
        backgroundColor: '#f5f5f5',
    };

    return (
        <Card size="small" title={<span style={{ display: 'flex', justifyContent: 'center', marginLeft: '350px' }}>FG WAREHOUSE REQUEST ANALYSIS DASHBOARD</span>} bodyStyle={{ overflow: 'scroll', minHeight: '90vh' }} headStyle={{ background: '#6ac0a9', color: '#fff', textAlign: 'center' }} extra={
            <Form form={form}>
                <Row gutter={16}>
                    <Col>
                        <Form.Item name={"toWhCode"} rules={[{ message: 'Please Select Warehouse Code', required: true }]} label={'Warehouse Code'} style={{ margin: '0px', padding: '0px' }}>
                            <Select
                                placeholder={'Please Select Warehouse Code'}
                                allowClear
                                showSearch
                                style={{ width: '150px' }}
                                onChange={wareHouseOnChange}
                            >
                                {warehouseDropDown.map((rec) => <Select.Option value={rec.wareHouseCode}>{rec.wareHouseCode + "-" + rec.wareHouseDesc}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label={'Floor'} name={"floor"} rules={[{ message: 'Please Select Floor', required: true }]} style={{ margin: '0px', padding: '0px' }}>
                            <Select
                                allowClear
                                showSearch
                                placeholder={'Select Floor'}
                                onChange={handleFloorChange}
                            >
                                {Array.from(Array(floors).keys()).map(rec => <Select.Option value={rec + 1}>{'Floor' + " " + (rec + 1)}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        }>
            <Row gutter={16}>
                <Divider style={{ borderColor: '#7cb305', margin: '3px', fontFamily:'' }}>To Do Requests</Divider>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={TotalRequests} alt="" /></div>
                        <div className="fg-wh-dashboard-card">
                            <p className="fg-wh-req-card-description" >
                                REQUESTS
                            </p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.toDoList.totalRequests || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={Approved} alt="" /></div>
                        <div className="fg-wh-dashboard-card">
                            <p className="fg-wh-req-card-description" >
                                APPROVE
                            </p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.toDoList?.noOfRequestsForApproval || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={FGIN} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description" >
                                FG IN
                            </p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.toDoList?.noOfRequestsForFgIn || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={FGOUT} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description" >
                                FG OUT
                            </p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.toDoList?.noOfRequestsForFgOut || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={LocationIN} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description" >
                                LOCATION IN
                            </p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.toDoList?.noOfRequestsForLocationIn || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={LocationOut} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description" >
                                LOCATION OUT
                            </p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.toDoList?.noOfRequestsForLocationOut || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '10px' }}>
                <Divider style={{ borderColor: '#7cb305', margin: '3px', }}>In Progress Requests</Divider>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={Inprogress} alt="" /></div>
                        <div className="fg-wh-dashboard-card">
                            <p className="fg-wh-req-card-description" >REQUESTS</p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.inprogressList?.totalRequests || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={Approved} alt="" /></div>
                        <div className="fg-wh-dashboard-card">
                            {/* style={{ backgroundColor: '#FFECE5' }} */}
                            <p className="fg-wh-req-card-description" >Approve</p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.inprogressList?.noOfRequestsForApproval || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={FGIN} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description" >FG IN</p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.inprogressList?.noOfRequestsForFgIn || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={FGOUT} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description" >FG OUT</p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.inprogressList?.noOfRequestsForFgOut || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={LocationIN} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description" >Location IN</p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.inprogressList?.noOfRequestsForLocationIn || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={LocationOut} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description">Location OUT</p>
                            <h2 className="fg-wh-req-card-value">{whdashboardData?.progressWiseReqCountInfo?.inprogressList?.noOfRequestsForLocationOut || 0}</h2>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '10px' }}>
                <Divider style={{ borderColor: '#7cb305', margin: '3px', }}>Completed Requests</Divider>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={Completed} alt="" /></div>
                        <div className="fg-wh-dashboard-card">
                            <p className="fg-wh-req-card-description" >REQUESTS</p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.completedList?.totalRequests || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={Approved} alt="" /></div>
                        <div className="fg-wh-dashboard-card">
                            {/* style={{ backgroundColor: '#FFECE5' }} */}
                            <p className="fg-wh-req-card-description" >Approve</p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.completedList?.noOfRequestsForApproval || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={FGIN} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description" >FG IN</p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.completedList?.noOfRequestsForFgIn || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={FGOUT} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description" >FG OUT</p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.completedList?.noOfRequestsForFgOut || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={LocationIN} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description" >Location IN</p>
                            <h2 className="fg-wh-req-card-value" >
                                {whdashboardData?.progressWiseReqCountInfo?.completedList?.noOfRequestsForLocationIn || 0}
                            </h2>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div style={{ position: 'relative' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={LocationOut} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description">Location OUT</p>
                            <h2 className="fg-wh-req-card-value">{whdashboardData?.progressWiseReqCountInfo?.completedList?.noOfRequestsForLocationOut || 0}</h2>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: '15px' }}>
                <Col span={10}>
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </Col>
                <Col span={8}>
                    <div>
                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                    </div>
                </Col>
                <Col span={6}>
                    <Divider style={{ borderColor: '#7cb305', margin: '3px', }}>Packlist Info</Divider>
                    <div style={{ position: 'relative', marginBottom: '15px' }} className="fg-wh-req-main-card">
                         <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={ManufacturingOrders} alt="" /></div> 
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description">Manufacturing Orders In Warehouse</p>
                            <h2 className="fg-wh-req-card-value">{whdashboardData?.packListInfo[0]?.packListInfo[0]?.totalMOCountInWh || 0}</h2>
                        </div>
                    </div>
                    <div style={{ position: 'relative', marginBottom: '15px' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={Packlists} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description">PackLists In Warehouse</p>
                            <h2 className="fg-wh-req-card-value">{whdashboardData?.packListInfo[0]?.packListInfo[0]?.totalPackListsInWarehouse || 0}</h2>
                        </div>
                    </div>
                    <div style={{ position: 'relative', marginBottom: '15px' }} className="fg-wh-req-main-card">
                        <div className="fg-wh-dashboard-mini-card"><img style={{ height: '40px', width: '40px' }} src={Cartons} alt="" /></div>
                        <div className="fg-wh-dashboard-card" >
                            <p className="fg-wh-req-card-description">Cartons In Warehouse</p>
                            <h2 className="fg-wh-req-card-value" >{whdashboardData?.packListInfo[0]?.packListInfo[0]?.noOfCartonsInWh || 0}</h2>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <div style={tableContainerStyle}>
                        <h1 className="fg-wh-departure-header">Arrival Requests</h1>
                        <Table
                            dataSource={whdashboardData?.arrivalsInfo[0]?.arrivalsInfo}
                            columns={fgWhReqColumns}
                            bordered
                            pagination={false}
                            rowKey="requestNo"
                            rowClassName={(record, index) =>
                                index % 2 === 0 ? 'light-row' : 'dark-row'
                            }
                            components={{
                                body: {
                                    row: ({ children, ...props }) => {
                                        const index = props['data-row-key'] % 2;
                                        const style = index === 0 ? lightRowStyle : darkRowStyle;
                                        return (
                                            <tr {...props} style={style}>
                                                {children}
                                            </tr>
                                        );
                                    },
                                },
                                header: {
                                    cell: (props) => (
                                        <th {...props} style={headerStyle}>
                                            {props.children}
                                        </th>
                                    ),
                                },
                            }}
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <div style={tableContainerStyle}>
                        <h1 className="fg-wh-departure-header">Departure Requests</h1>
                        <Table
                            dataSource={whdashboardData?.departuresInfo[0]?.arrivalsInfo}
                            columns={fgWhReqColumns}
                            bordered
                            pagination={false}
                            rowKey="requestNo"
                            rowClassName={(record, index) =>
                                index % 2 === 0 ? 'light-row' : 'dark-row'
                            }
                            components={{
                                body: {
                                    row: ({ children, ...props }) => {
                                        const index = props['data-row-key'] % 2;
                                        const style = index === 0 ? lightRowStyle : darkRowStyle;
                                        return (
                                            <tr {...props} style={style}>
                                                {children}
                                            </tr>
                                        );
                                    },
                                },
                                header: {
                                    cell: (props) => (
                                        <th {...props} style={headerStyle}>
                                            {props.children}
                                        </th>
                                    ),
                                },
                            }}
                        />
                    </div>
                </Col>
            </Row>
        </Card>
    )

}
