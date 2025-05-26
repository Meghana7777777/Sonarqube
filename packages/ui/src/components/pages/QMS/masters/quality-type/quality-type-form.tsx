import { Col, Form, FormInstance, Input, Row, theme } from 'antd';
import { useEffect } from 'react';
const { useToken } = theme;

export interface QualityTypeFormProps {
    form: FormInstance<any>;
    selectedRecord?: any;
    initialvalues?: any
    qualitytypeId?: any
}

const QualityTypeForm = (props: QualityTypeFormProps) => {
    const { form, qualitytypeId, initialvalues, selectedRecord } = props;

    useEffect(() => {
        if (initialvalues) {
            form.setFieldsValue(initialvalues)
        } else {
            form.resetFields();
        }
    }, [initialvalues])

    return (
        <Form form={form} initialValues={initialvalues} layout='vertical' >
            <Row gutter={24}   >
                <Form.Item name="id" style={{ display: "none" }}>
                    <Input hidden />
                </Form.Item>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item name="qualityType" label="Quality Type"
                        rules={[
                            { required: true },
                        ]}>
                        <Input placeholder=" Enter Quality Type" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default QualityTypeForm;