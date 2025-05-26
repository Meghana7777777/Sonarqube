import { Card, Col, Form, Row, Select } from 'antd';
import { NoOfPacklistsYetToCome } from './no-of-packlists-form';
import { NoOfVehiclesInThePlantCurrently } from './no-of-vehicles-in-plant.form';
import { OnTimeDeliveriesCount } from './on-time-deliveries-count.from';
import { NoOfMissedPackLists } from './no-of-missed-packlists.form';
import { VehicleSecurityCheckOut } from './security-check-out.form';
import { DeliveriesStatusDonutChart } from './delivery-status-dounut-chart';
import { DayMnthYearWiseDeliveriesLineCharts } from './day-mnth-year-wise-deliveries-count-linechart';
import { GrnServices, PreIntegrationService } from '@xpparel/shared-services';
import { useEffect, useState } from 'react';
import { CommonRequestAttrs, SupplierInfoModel } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';

const PacklistsTable = () => {
    const { Option } = Select;
    const preIntegrationService: PreIntegrationService = new PreIntegrationService()
    const user = useAppSelector((state) => state.user.user.user);
    const [suppliersData, setSuppliersData] = useState<SupplierInfoModel[]>([])


    useEffect(() => {
        getSuppliersData();
    }, []);

    const getSuppliersData = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        preIntegrationService
            .getAllSupplierCodes(req)
            .then((res) => {
                if (res.status) {
                    setSuppliersData(res.data);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };



    return (
        <div>
            <Card headStyle={{ background: '#fccb9f' }}
                title={<span style={{ color: 'black', fontStyle: 'italic' }} >Select Supplier</span>}
                style={{
                    background: 'white',
                    borderRadius: '6px',
                    height: '100px',
                }}
            >
                <Form>
                    <Form.Item>
                        <Select>
                            {suppliersData.map((splr) => {
                                return <Option value={splr.supplierCode}>{splr.supplierName}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export const SecurityCheckinDashBoard = () => {

    return (
        <Card
            style={{
                backgroundImage: `url(https://t4.ftcdn.net/jpg/05/08/88/13/360_F_508881346_Y8NPkWuFIspsIucnv2mn43U8FcLxL3XB.jpg)`,
                borderRadius: '6px',
                textAlign: 'center'
            }}
        >
            <Row gutter={16}>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <NoOfPacklistsYetToCome />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <NoOfVehiclesInThePlantCurrently />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <VehicleSecurityCheckOut />
                </Col>
            </Row>

            <br />
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <PacklistsTable />
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <OnTimeDeliveriesCount />
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <NoOfMissedPackLists />
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <DeliveriesStatusDonutChart storagePercentage={57} />
                </Col>
            </Row>
            <br />
            <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <DayMnthYearWiseDeliveriesLineCharts />
                </Col>
                {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <DayMnthYearWiseDeliveriesLineCharts />
                </Col> */}
            </Row>
        </Card >
    );
};
