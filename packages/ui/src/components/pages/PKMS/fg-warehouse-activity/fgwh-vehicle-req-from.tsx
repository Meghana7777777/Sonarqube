import { CheckCard } from '@ant-design/pro-components';
import { Col, Form, FormInstance, Input, Row } from 'antd'
import React from 'react'

export enum FgWhReqVehTypeEnum {
    MOVER = "MOVER",
    TRUCK = "TRUCK",
    TROLLY = "TROLLY"
}

interface Props {
    form: FormInstance
}
export default function FGWHVehicleReqForm({ form }: Props) {
    return (
        <Form form={form} layout='vertical'>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item required name="vehicleType" label="Vehicle type">
                        <CheckCard.Group size="small" style={{ width: '100%' }} onChange={(value) => { console.log('Selected value:', value); }}>
                            {Object.keys(FgWhReqVehTypeEnum)
                                .map((key) => (
                                    <CheckCard key={key} title={FgWhReqVehTypeEnum[key]} value={FgWhReqVehTypeEnum[key]} />
                                ))}
                        </CheckCard.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item rules={[{ required: true, message: 'Security Name Is Required' }]} name="securityName" label="Security name">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

        </Form>
    )
}
