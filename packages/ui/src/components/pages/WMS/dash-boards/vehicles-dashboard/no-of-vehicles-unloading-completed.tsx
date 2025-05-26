import React, { useEffect, useState } from 'react';
import { Card, Col, Modal, Row, Statistic } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import truckUnload from './icons/unloading-packlist.gif';
import { GrnServices } from '@xpparel/shared-services';

interface VehicleData {
    vehicleNumber: string;
    unloadingCompletedTime: Date;
}

export const NoOfVehiclesCompletedUnloading = () => {
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
        service.getNoOfvehiclesCompletedUnloading()
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

    const chartOptions = {
        title: {
            text: 'No Of Vehicles Unloading Completed',
            style: {
                color: 'black',
                fontSize: '14px',
            },
        },
        xAxis: {
            title: {
                text: 'Vehicle Number',
            },
            categories: vehicleData.map(item => item.vehicleNumber),
        },
        yAxis: {
            title: {
                text: 'Completion Date and Time',
            },
            type: 'datetime', // Set the axis type to datetime
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat('%Y-%m-%d', this.value);
                },
            },
        },
        plotOptions: {
            column: {
                pointWidth: 20,
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '12px',
                    },
                    inside: false,
                    color: '#333',
                    formatter: function () {
                        const vehicle = vehicleData.find(item => new Date(item.unloadingCompletedTime).getTime() === this.y);
                        if (vehicle) {
                            const formattedDate = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.y);
                            return `${vehicle.vehicleNumber}<br>${formattedDate}`;
                        }
                        return ''; // If no matching vehicle is found, display an empty label
                    },
                },
            },
        },
        series: [
            {
                type: 'column',
                name: 'Completion Date',
                data: vehicleData.map(item => new Date(item.unloadingCompletedTime).getTime()),
                colorByPoint: true,
                colors: [
                    '#DAA520',
                    '#696969',
                    '#8B4513',
                    '#A0522D',
                    '#778899',
                    '#808080',
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
                                No Of Vehicles Unloading Completed
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
                                        value={vehicleData.length}
                                        onMouseEnter={handleShowTableModal}
                                        style={{ fontSize: '32px', marginTop: '9px' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <img
                                        src={truckUnload}
                                        alt="Delivery Time GIF"
                                        style={{ width: '100px', marginLeft: '50px', marginTop: '-18px' }}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Completion Date"
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
