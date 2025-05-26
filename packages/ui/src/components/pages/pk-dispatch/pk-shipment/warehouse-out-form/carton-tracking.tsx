import React, { useEffect, useState } from "react";
import { Steps, Card, Row, Typography, Tag, Space, Col, Form, Input } from "antd";
import {
    CheckCircleOutlined,
    SyncOutlined,
    ClockCircleOutlined,
    MinusCircleOutlined,
    ScanOutlined
} from '@ant-design/icons';
import { CartonBarcodeRequest, CartonStatusEnum, CartonStatusTrackingEnum, cartonBarcodePatternRegExp, cartonBarcodeRegExp } from "@xpparel/shared-models";
import Search from "antd/es/input/Search";
import { PackListService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";

const { Text, Title } = Typography;
const { Step } = Steps;



export interface CartonData {
    stage: CartonStatusTrackingEnum,
    remarks: string,
    status: CartonStatusEnum,
    inTime: string,
    outTime: string,
}


const sampleData: CartonData[] = [
    {
        stage: CartonStatusTrackingEnum.CARTON_REPORTING,
        remarks: "Carton has been reported and recorded.",
        status: CartonStatusEnum.COMPLETED,
        inTime: "2025-01-02 10:00 AM",
        outTime: "2025-01-02 10:30 AM",
    },
    {
        stage: CartonStatusTrackingEnum.INSPECTION,
        remarks: "Carton is under inspection.",
        status: CartonStatusEnum.INPROGRESS,
        inTime: "2025-01-02 10:30 AM",
        outTime: "",
    },
    {
        stage: CartonStatusTrackingEnum.FG_WAREHOUSE_IN,
        remarks: "Carton has entered the FG warehouse.",
        status: CartonStatusEnum.OPEN,
        inTime: "2025-01-02 11:00 AM",
        outTime: "",
    },
    {
        stage: CartonStatusTrackingEnum.PALLETIZATION,
        remarks: "Carton is ready for palletization.",
        status: CartonStatusEnum.NA,
        inTime: "2025-01-02 12:00 PM",
        outTime: "",
    },
    {
        stage: CartonStatusTrackingEnum.LOCATION_MAPPING,
        remarks: "Carton has been mapped to a location.",
        status: CartonStatusEnum.NA,
        inTime: "2025-01-02 01:00 PM",
        outTime: "",
    },
    {
        stage: CartonStatusTrackingEnum.FG_WAREHOUSE_OUT,
        remarks: "Carton is ready to exit the FG warehouse.",
        status: CartonStatusEnum.NA,
        inTime: "2025-01-02 02:00 PM",
        outTime: "",
    },
    {
        stage: CartonStatusTrackingEnum.DISPATCH,
        remarks: "Carton has been dispatched.",
        status: CartonStatusEnum.NA,
        inTime: "2025-01-02 03:00 PM",
        outTime: "",
    },
];

const CartonTracking: React.FC = () => {
    const [cartonData, setCartonData] = useState<CartonData[]>([]);
    const [formRef] = Form.useForm();
    const pkListService = new PackListService();
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;



    const getStatusTag = (status: CartonStatusEnum) => {
        const statusConfig = {
            [CartonStatusEnum.COMPLETED]: {
                icon: <CheckCircleOutlined />,
                color: 'success',
                text: 'COMPLETED'
            },
            [CartonStatusEnum.INPROGRESS]: {
                icon: <SyncOutlined spin />,
                color: 'processing',
                text: 'IN PROGRESS'
            },
            [CartonStatusEnum.OPEN]: {
                icon: <ClockCircleOutlined />,
                color: 'warning',
                text: 'OPEN'
            },
            [CartonStatusEnum.NA]: {
                icon: <MinusCircleOutlined />,
                color: 'default',
                text: 'N/A'
            }
        };

        const config = statusConfig[status];
        return (
            <Tag icon={config.icon} color={config.color} style={{ padding: '4px 8px' }}>
                {config.text}
            </Tag>
        );
    };

    const formatStageTitle = (stage: string) => {
        return stage.split('_').map(word =>
            word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const renderStepCard = (data: CartonData) => (
        <Card
            className="step-card"
            bodyStyle={{ padding: '12px' }}
            style={{
                width: '220px',
                marginTop: 12,
                height: '160px',
                background: '#fafafa',
                border: '1px solid #f0f0f0',
                borderRadius: '8px'
            }}
        >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: '13px' }}>{data.remarks}</Text>
                {getStatusTag(data.status)}
                <div>
                    <Text strong style={{ fontSize: '13px' }}>In Time: </Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>{data.inTime}</Text>
                </div>
                {data.outTime && (
                    <div>
                        <Text strong style={{ fontSize: '13px' }}>Out Time: </Text>
                        <Text type="secondary" style={{ fontSize: '13px' }}>{data.outTime}</Text>
                    </div>
                )}
            </Space>
        </Card>
    );


    const getCartonTrackInfo = (value: string) => {
        const req = new CartonBarcodeRequest(value, userName, orgData.unitCode, orgData.companyCode, userId)
        pkListService.getCartonTrackInfo(req).then(res => {
            if (res.status) {
                setCartonData(res.data);
            } else {
                setCartonData([]);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => console.log(err.message));
    }


    let timeoutId;
    const scanBarcodeValue = (value: string) => {

        clearTimeout(timeoutId);
        if (value) {
            timeoutId = setTimeout(() => {
                if (value) {
                    getCartonTrackInfo(value)
                }
            }, 500)
        }
    }


    return (
        <Card   >

            <Row>
                <Col span={5}> </Col>
                <Col span={14}>
                    <Card
                        title={'Carton Tracking'}
                    >
                        <Form
                            layout='horizontal'
                            form={formRef}
                        >
                            <Row>
                                <Col >
                                    <Form.Item
                                        name='cartonNo'
                                        label='Scan Carton No'
                                        rules={[{
                                            required: true,
                                            pattern: new RegExp(cartonBarcodeRegExp),
                                            message: 'Please Provide Valid Carton Barcode'
                                        }]}
                                    >
                                        <Input
                                            onChange={(v) => {
                                                const pattern = cartonBarcodePatternRegExp;
                                                if (pattern.test(v.target.value)) {
                                                    scanBarcodeValue(v.target.value)
                                                }
                                            }}
                                            autoFocus
                                            placeholder='Scan Carton No'
                                            prefix={<ScanOutlined />}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col  >
                                    <Form.Item
                                        name='enteredCartonNo'
                                        rules={[{
                                            required: true,
                                            pattern: new RegExp(cartonBarcodeRegExp),
                                            message: 'Please Provide Valid Carton Barcode'
                                        }]}
                                    >
                                        <Search
                                            placeholder='Type Carton No'
                                            enterButton
                                            onChange={(v) => {
                                                const pattern = cartonBarcodePatternRegExp;
                                                if (pattern.test(v.target.value)) {
                                                    scanBarcodeValue(v.target.value)
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Col>

                            </Row>

                        </Form>

                    </Card>

                </Col>
            </Row>

            <br></br>
            {/* <Row>
                Details of  Carton
            </Row> */}
            {cartonData?.length !== 0 &&
                <Row gutter={[0, 32]}>
                    <div style={{ width: '100%' }}>
                        <Steps
                            current={cartonData.findIndex(data => data.status === CartonStatusEnum.INPROGRESS)}
                            progressDot
                            size="small"
                            style={{ padding: '0 20px' }}
                        >
                            {cartonData.slice(0, 4).map((data, index) => (
                                <Step
                                    key={index}
                                    title={
                                        <Text style={{ fontSize: '13px', fontWeight: 500 }}>
                                            {formatStageTitle(data.stage)}
                                        </Text>
                                    }
                                    description={renderStepCard(data)}
                                    status={
                                        data.status === CartonStatusEnum.COMPLETED
                                            ? 'finish'
                                            : data.status === CartonStatusEnum.INPROGRESS
                                                ? 'process'
                                                : 'wait'
                                    }
                                />
                            ))}
                        </Steps>
                    </div>

                    <div style={{ width: '100%' }}>
                        <Steps
                            current={Math.max(0, cartonData.findIndex(data => data.status === CartonStatusEnum.INPROGRESS) - 4)}
                            progressDot
                            size="small"
                            style={{
                                padding: '0 20px',
                                width: '75%',
                                margin: '0 auto',
                                marginTop: '-8px'
                            }}
                        >
                            {cartonData.slice(4).map((data, index) => (
                                <Step
                                    key={index}
                                    title={
                                        <Text style={{ fontSize: '13px', fontWeight: 500 }}>
                                            {formatStageTitle(data.stage)}
                                        </Text>
                                    }
                                    description={renderStepCard(data)}
                                    status={
                                        data.status === CartonStatusEnum.COMPLETED
                                            ? 'finish'
                                            : data.status === CartonStatusEnum.INPROGRESS
                                                ? 'process'
                                                : 'wait'
                                    }
                                />
                            ))}
                        </Steps>
                    </div>
                </Row>
            }


            <style>
                {`
          .ant-steps-item {
            padding-inline-end: 8px !important;
          }
          .ant-steps-item-description {
            padding: 0 4px;
          }
          .step-card {
            transition: all 0.2s ease;
          }
          .step-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .ant-steps-item-title {
            font-size: 13px !important;
            margin-bottom: 4px !important;
          }
        `}
            </style>
        </Card>
    );
};

export default CartonTracking;