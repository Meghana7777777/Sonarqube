import { Card, Col, Modal, Row, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import deliveryTime from './icons/delivery-time.gif';
import tollPlaza from './icons/toll-plaza.png';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import moment from 'moment';
import { GrnServices } from '@xpparel/shared-services';

interface VehicleData {
    vehicleNumber: string;
}

export const NoOfVehiclesWaitingForUnloading = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleShowTableModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const service = new GrnServices();
    const [vehicleData, setVehicleData] = useState<VehicleData[]>([]);

    useEffect(() => {
        getVehicleData();
    }, []);

    const getVehicleData = () => {
        service.getNoOfVehiclesWaitingForUnloading()
            .then((res) => {
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

    const currentHours = moment().format('HH');
    const currentMinutes = moment().format('mm');

    const chartOptions = {
        title: {
            text: ' No Of Vehicle WaitIng For Unloading',
            style: {
                color: 'black',
                fontSize: '14px',
            },
        },
        xAxis: {
            categories: vehicleData.map(item => item.vehicleNumber),
        },
        yAxis: {
            title: {
                text: 'Current Time',
            },
            labels: {
                formatter: function () {
                    const hours = Math.floor(this.value / 60);
                    const minutes = this.value % 60;
                    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                },
            },
        },
        plotOptions: {
            column: {
                pointWidth: 20,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        const hours = Math.floor(this.y / 60);
                        const minutes = this.y % 60;
                        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    },
                    style: {
                        fontSize: '12px',
                    },
                    align: 'center',
                    verticalAlign: 'top',
                    y: -20,
                    color: '#333',
                },
            },
        },
        series: [
            {
                type: 'column',
                name: 'Current Time',
                data: vehicleData.map(() => {
                    const hours = parseInt(currentHours);
                    const minutes = parseInt(currentMinutes);
                    return hours * 60 + minutes;
                }),
                colorByPoint: true,
                colors: [
                    '#DAA520',
                    '#696969',
                    '#8B4513',
                    '#A0522D',
                    '#778899',
                    '#808080'
                ],
            },
        ],
    };

    return (
        <div>
            <Row gutter={30}>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        title={
                            <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: '700', fontStyle: 'italic' }}>
                               No Of Vehicle WaitIng For Unloading
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
                                <Col span={6}>
                                    <img
                                        src={deliveryTime}
                                        alt="Delivery Time GIF"
                                        style={{ width: '60px', marginLeft: '50px', marginTop: '-20px' }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <img
                                        src={tollPlaza}
                                        alt="Toll Plaza PNG"
                                        style={{ width: '60px', marginLeft: '50px', marginTop: '-20px' }}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Modal title="Current Time" open={isModalVisible} onCancel={handleShowTableModal} footer={null}>
                <div style={{ width: '100%', height: '400px' }}>
                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                </div>
            </Modal>
        </div>
    );
};