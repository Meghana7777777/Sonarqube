import { EscallationTypeEnum } from '@xpparel/shared-models';
import { ApproverServices, QualityTypeServices } from '@xpparel/shared-services';
import { Col, Form, FormInstance, Input, Row, Select, theme } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EscallationServices } from '../../../../../../../libs/shared-services/src/qms/escallation/escallation-service';
const { useToken } = theme;

export interface EsclationFormProps {
    form: FormInstance<any>;
    selectedRecord?: any;
    initialvalues?: any
    escallationId?: any
}

const EscallationForm = (props: EsclationFormProps) => {
    const Option = Select
    const { form, escallationId, initialvalues, selectedRecord } = props;
    const [data2, setData2] = useState<any[]>([]);
    const [data3, setData3] = useState<any[]>([]);
    const [data4, setData4] = useState<any[]>([]);
    const [data5, setData5] = useState<any[]>([]);
    const [selectedStyle, setSelectedStyle] = useState("");
    const [selectedBuyer, setSelectedBuyer] = useState("");
    const [selectedWorkOrder, setSelectedWorkOrder] = useState("");
    const qualityTypeservicess = new QualityTypeServices();
    const approverService = new ApproverServices();

    const handleChangeEscallations = (value) => {
        setSelectedStyle(value);
        setSelectedBuyer(value);
        setSelectedWorkOrder(value);
    }

    useEffect(() => {
        getAllQualityType();
        getAllActiveApprovers();
    }, []);

    useEffect(() => {
        if (initialvalues) {
            form.setFieldsValue(initialvalues)
        } else {
            form.resetFields();
        }
    }, [initialvalues])

    const getAllQualityType = () => {
        qualityTypeservicess.getAllQualityType().then((res) => {
            if (res.status) {
                setData2(res.data);
            } else {
                setData2([]);
            }
        }).catch((err) => {
            console.log(err.message);
        });
    };

    const getAllActiveApprovers = () => {
        approverService.getAllActiveApprovers().then((res) => {
            if (res.status) {
                setData5(res.data);
            } else {
                setData5([]);
            }
        }).catch((err) => {
            console.log(err.message);
        });
    };

    return (

        <Form form={form} initialValues={initialvalues} layout='vertical'>
            <Row gutter={24} >

                <Form.Item name="id" style={{ display: "none" }}>
                    <Input hidden />
                </Form.Item>

                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item label="Escalation Type"
                        name="escalationType"
                        rules={[{ required: true, message: 'Escalation Type is required' },
                        ]}>
                        <Select placeholder='SELECT Escalation Type'
                            onChange={handleChangeEscallations}
                        >
                            {Object.keys(EscallationTypeEnum).map(indext => {
                                return <Select.Option value={EscallationTypeEnum[indext]}>{EscallationTypeEnum[indext]}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>

                {selectedStyle === EscallationTypeEnum.Style && (
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item
                            label="Style"
                            name="style"
                            rules={[{ required: true, message: "Style is required" }]}
                        >
                            <Select placeholder="Select Style">
                                {data3.map((option) => (
                                    <Option key={option.styleId} value={option.styleId}>
                                        {option.styleName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                )}


                {selectedBuyer === EscallationTypeEnum.Buyer && (
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item
                            label="Buyer"
                            name="buyer"
                            rules={[{ required: true, message: "Buyer is required" }]}
                        >
                            <Select placeholder="Select Buyer">
                                {data4.map((option) => (
                                    <Option key={option.customersId} value={option.customersId}>
                                        {option.firstName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                )}

                {selectedWorkOrder === EscallationTypeEnum.Wo && (
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item
                            label="Work Order"
                            name="workOrder"
                            rules={[{ required: true, message: "Work Order is required" }]}
                        >
                            <Select placeholder="Select Work Order">
                                <Select.Option value="Work Order 1">Work Order 1</Select.Option>
                                <Select.Option value="Work Order 2">Work Order 2</Select.Option>
                                <Select.Option value="Work Order 3">Work Order 3</Select.Option>
                                <Select.Option value="Work Order 4">Work Order 4</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                )}

                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Quality"
                        name="qualityType"
                        rules={[{ required: true, message: "Quality Is Required" }]}
                    >
                        <Select
                            placeholder=" Select Quality"
                            allowClear
                            popupMatchSelectWidth
                        >
                            {data2.map((option) => (
                                <Option key={option.id} value={option.id}>
                                    {option.qualityType}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item name="escalationPercentage" label="Escalation Percentage"
                        rules={[{ required: true }]}>
                        <Input placeholder=" Enter Escalation Percentage" />
                    </Form.Item>
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Escalation Person"
                        name="escalationPerson"
                        rules={[{ required: true, message: "Escalation Person Is Required" }]}
                    >
                        <Select
                            placeholder=" Select Escalation Person"
                        >
                            {data5.map((option) => (
                                <Option key={option.id} value={option.id}>
                                    {option.approverName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

            </Row>
        </Form>
    )
}

export default EscallationForm;