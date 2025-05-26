import { Col, Form, FormInstance, Input, Row } from 'antd';
import { useEffect } from 'react';

export interface ApproverFormProps {
    form: FormInstance<any>
    selectedRecord?: any;
    initialvalues?: any;
    approverId?: any;
}

const ApproverForm = (props: ApproverFormProps) => {
    const { form, approverId, initialvalues, selectedRecord } = props;

    useEffect(() => {
        if (initialvalues) {
            form.setFieldsValue(initialvalues)
        } else {
            form.resetFields();
        }
    }, [initialvalues])

    return (
        <Form form={form} initialValues={initialvalues} layout="vertical" >
            <Row gutter={24}   >
                <Form.Item name="id" style={{ display: "none" }}>
                    <Input hidden />
                </Form.Item>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item name="approverName" label="Approver Name"
                        rules={[
                            { required: true },
                        ]}>
                        <Input placeholder=" Enter Approver Name" />
                    </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        name="emailId"
                        label="Email Id"
                        rules={[
                            { required: true, message: 'Email ID is required' },
                            { type: 'email', message: 'Please enter a valid email address' },
                        ]}
                    >
                        <Input placeholder="Enter Approver Email" />
                    </Form.Item>
                </Col>
            </Row>

        </Form>
    )
}

export default ApproverForm;