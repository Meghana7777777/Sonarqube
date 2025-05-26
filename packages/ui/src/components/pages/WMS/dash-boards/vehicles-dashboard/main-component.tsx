import { Card, Col, Row } from 'antd';
import React from 'react';
import { NoOfVehiclesArrived } from './no-of-vehicles-arrived';
import {  NoOfVehiclesTobeArrived } from './no-of-vehicles-to-be-arrived';
import {  NoOfVehiclesCompletedUnloading } from './no-of-vehicles-unloading-completed';
import { AverageWaitingTime } from './vehicles-average-waiting time';
import { NoOfVehiclesWaitingForUnloading } from './no-of-vehicles-waiting-for-unloading';
import { VehiclesInEachGate } from './vehicles-in-each-gate';
import { NoOfVehiclesUnloadingInprogress } from './no-of-vehicles-unloading-inprogress';
import { VehicleTimeInPlant } from './how-much-time-vehicles-in-the-plant';
import { AverageUnloadingTime } from './average-unloadingtime';


export const DashBoard = () => {
    return (
        <div>
            <Card
                title="Dash Board"
                style={{ textAlign: 'center', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}
                headStyle={{ backgroundColor: '#1890ff', color: 'white' }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6} xl={6}>
                        <NoOfVehiclesTobeArrived />
                    </Col>   
                    <Col xs={24} sm={12} lg={6} xl={6}>
                        <NoOfVehiclesArrived />
                    </Col>
                    <Col xs={24} sm={12} lg={6} xl={6}>
                        <NoOfVehiclesWaitingForUnloading />
                    </Col> 

                    <Col xs={24} sm={12} lg={6} xl={6}>
                        <NoOfVehiclesUnloadingInprogress />
                    </Col>

                    <Col xs={24} sm={12} lg={6} xl={6}>
                        <NoOfVehiclesCompletedUnloading/>
                    </Col>
                    <Col xs={24} sm={24} lg={12}>
                        <VehicleTimeInPlant />
                    </Col>
                    

                   

                </Row>
                <br />
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} lg={12}>
                        <AverageWaitingTime />
                    </Col>
                    <Col xs={24} sm={24} lg={12}>
                        <VehiclesInEachGate />
                    </Col>
                </Row>
                <br></br>
                <Row gutter={[16, 16]}>
                  
                    <Col xs={24} sm={24} lg={12}>
                        <AverageUnloadingTime />
                    </Col>

                </Row>






            </Card>
        </div>
    );
};
