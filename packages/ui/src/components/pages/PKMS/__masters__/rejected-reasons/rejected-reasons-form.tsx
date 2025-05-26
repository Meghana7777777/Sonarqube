import { Col, Form, Input, Row } from 'antd'
import { FormInstance } from 'antd/lib'
import React, { useEffect } from 'react'

interface Iprops {
    formRef: FormInstance<any>
    initialValues: any
}

export const RejectedReasonsForm = (props: Iprops) => {
    const { formRef, initialValues } = props

    useEffect(() => {
        if (initialValues) {
            formRef.setFieldsValue(initialValues);
        }
    }, [initialValues]);


    return (
        <Form form={props.formRef} layout='vertical'>
            <Form.Item
                label='id'
                name='id'
                hidden
            >

            </Form.Item>
            <Row gutter={16}>
                <Col>
                    <Form.Item label='Reason Code' name={'reasonCode'} rules={[{ required: true }]}>
                        <Input placeholder='Reason Code'></Input>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item label='Reason Name' name={'reasonName'} rules={[{ required: true }]}>
                        <Input placeholder='Reason Name'></Input>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Item label='Reason Description' name={'reasonDesc'} rules={[{ required: true }]}>
                        <Input placeholder='Reason Description'></Input>
                    </Form.Item>

                </Col>

            </Row>
        </Form>
    )

}

export default RejectedReasonsForm
