import { Card, Col, Modal, Row, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import truckUnload from './icons/unloading-packlist.gif';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { GrnServices } from '@xpparel/shared-services';

interface VehicleData {
    vehicleNumber: string;
}

export const NoOfVehiclesUnloadingInprogress = () => {
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
        service.getNoOfVehiclesUnloadingInprogress()
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
            text: 'NO Of Vehicles Unloading Inprogress',
            style: {
                color: 'black',
                fontSize: '14px',
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.vehicleNumber}',
                },
            },
        },
        series: [
            {
                type: 'pie',
                data: vehicleData.map(item => ({
                    name: Number,
                    vehicleNumber: item.vehicleNumber,
                    y: 1,
                })),
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
                                NO Of Vehicles Unloading Inprogress
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
                                <Col span={6}>
                                    <Statistic value={vehicleData.length} onMouseEnter={handleShowTableModal} style={{ fontSize: '32px', marginTop: '9px' }} />
                                </Col>
                                <Col span={6}>
                                    <img
                                        src={truckUnload}
                                        alt="Delivery Time GIF"
                                        style={{ width: '100px', marginLeft: '50px', marginTop: '-18px' }}
                                    />
                                </Col>
                                <Col span={6}>
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
