import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { GrnServices } from '@xpparel/shared-services';
import { Card, Col, Modal, Row, Statistic } from 'antd';
import deliveryTime from './icons/delivery-time.gif';
import moment from 'moment';


export const NoOfVehiclesArrived = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleShowTableModal = () => {
        setIsModalVisible(!isModalVisible);
    };
    const service = new GrnServices();
    const [vehicleData, setVehicleData] = useState<any[]>([]);

    useEffect(() => {
        getVehicleData();
    }, []);

    const getVehicleData = () => {
        service.getNoOfVehiclesArrived()
            .then((res) => {
                console.log(res, 'res');
                if (res.status) {
                    setVehicleData(res.data);
                } else {
                    throw new Error(res.internalMessage);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const chartOptions = {
        title: {
            text: 'No Of Vehicles Arrived',
            style: {
                color: 'black',
                fontSize: '14px',
            },
        },
        xAxis: {
            categories: vehicleData.map((item) => item.vehicleNumber),
        },
        yAxis: [
            {
                title: {
                    text: 'Weight',
                },
            },
            {
                title: {
                    text: 'Time',
                },
                labels: {
                    formatter: function () {
                        const timeValue = moment(this.value, 'HH:mm:ss');
                        return timeValue.format('HH:mm');
                    },
                },
                opposite: true,
            },
        ],

        plotOptions: {
            column: {
                pointWidth: 20,
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '12px',
                    },
                    inside: false,
                    formatter: function () {
                        if (this.series.name === 'Weight') {
                            return this.y;
                        }
                        const timeValue = moment(this.y); 
                        return timeValue.format('HH:mm'); 
                    },
                },
            },
        },
        series: [
            {
                type: 'column',
                name: 'Weight',
                yAxis: 0,
                data: vehicleData.map((item) => item.weight),
            },
            {
                type: 'column',
                name: 'Time',
                yAxis: 1,
                data: vehicleData.map((item) => {
                    if (item.entryTime) {
                        const timeValue = moment(item.entryTime, 'HH:mm:ss');
                        return timeValue.valueOf(); // Use Unix timestamp for ordering
                    }
                    return null;
                }),
            },
        ],
    };

    return (
        <div>
            <Row gutter={30}>
                <Col xs={24} sm={12} lg={4}>
                    <Card
                        title={
                            <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: '700', fontStyle: 'italic' }}>
                                No Of Vehicles Arrived
                            </div>
                        }
                        style={{
                            backgroundColor: '#F0FFFF',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                            width: '300px',
                            height: '120px',
                        }}
                    >
                        <div style={{ height: '100%' }}>
                            <Row>
                                <Col span={8}>
                                    <Statistic value={vehicleData.length} onMouseEnter={handleShowTableModal} style={{ fontSize: '32px' }} />
                                </Col>
                                <Col span={8}>
                                    <img
                                        src={deliveryTime}
                                        alt="Delivery Time GIF"
                                        style={{ width: '60px', marginLeft: '50px', marginTop: '-20px' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <img
                                        src={deliveryTime}
                                        alt="Delivery Time GIF"
                                        style={{ width: '60px', marginLeft: '50px', marginTop: '-20px' }}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Modal
                title="No Of Vehicles Waiting"
                open={isModalVisible}
                onCancel={handleShowTableModal}
                footer={null}
                style={{ backgroundColor: '#F0FFFF' }}
            >
                <div style={{ width: '100%', height: '400px' }}>
                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                </div>
            </Modal>
        </div>
    );
};