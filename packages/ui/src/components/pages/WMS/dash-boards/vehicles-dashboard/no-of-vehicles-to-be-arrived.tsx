import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, Col, Modal, Row, Statistic } from 'antd';
import deliveryTime from './icons/delivery-time.gif';
import tollPlaza from './icons/toll-plaza.png';
import { GrnServices } from '@xpparel/shared-services';
import moment from 'moment';

interface VehicleData {
    deliveryDate: Date;
    vehicleNumber: string;
}

export const NoOfVehiclesTobeArrived = () => {
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
        service.getNoOfVehiclesToBeArrived()
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

    const dates = vehicleData.map((i) => moment(i.deliveryDate).format('YYYY-MM-DD'));
    const vehicleCount = vehicleData.length;

    const uniqueDates = [...new Set(dates)];

    const chartOptions = {
        title: {
            text: 'No Of Vehicle To Be Arrived',
            style: {
                color: 'black',
                fontSize: '14px',
            },
        },
        xAxis: {
            categories: uniqueDates,
            title: {
                text: 'Dates',
            },
        },
        yAxis: {
            title: {
                text: 'Vehicle Count',
            },
        },
        plotOptions: {
            column: {
                pointWidth: 20,
                dataLabels: {
                    enabled: true,
                    format: '{point.y}',
                    style: {
                        fontSize: '12px',
                    },
                },
            },
        },
        series: [
            {
                type: 'column',
                name: 'Vehicle Count',
                colorByPoint: true,
                colors: [
                    '#DAA520',
                    '#696969',
                    '#8B4513',
                    '#A0522D',
                    '#778899',
                    '#808080',
                ],
                data: uniqueDates.map(date => vehicleData.filter(i => moment(i.deliveryDate).format('YYYY-MM-DD') === date).length),
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
                                No Of Vehicle To Be Arrived
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
                                    <Statistic
                                        value={vehicleCount}
                                        onMouseEnter={handleShowTableModal}
                                        style={{ fontSize: '32px', marginTop: '9px' }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <img
                                        src={deliveryTime}
                                        alt="Delivery Time GIF"
                                        style={{ width: '60px', marginLeft: '40px', marginTop: '-10px' }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <img
                                        src={tollPlaza}
                                        alt="Toll Plaza PNG"
                                        style={{ width: '60px', marginLeft: '40px', marginTop: '-10px' }}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Vehicle Count"
                open={isModalVisible}
                onCancel={handleShowTableModal}
                footer={null}
            >
                <div style={{ width: '100%', height: '400px' }}>
                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                </div>
            </Modal>
        </div>
    );
};
