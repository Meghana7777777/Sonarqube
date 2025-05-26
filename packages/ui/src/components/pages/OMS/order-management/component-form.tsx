import { CommonRequestAttrs } from "@xpparel/shared-models";
import { ComponentServices } from "@xpparel/shared-services";
import { Button, Col, Form, FormInstance, Input, Row, Select } from "antd"
import { useEffect, useState } from "react";

interface Icomponents {
    selectedRecord?: any;
    formRef: FormInstance<any>
    initialvalues: any;
    componentName: any;
}
export const ComponentForm = (props: Icomponents) => {
    const [intialValues, setInitialvalues] = useState<any>()
    const { initialvalues, formRef, componentName } = props;
    const [compData, setCompData] = useState([]);
    const { Option } = Select;

    useEffect(() => {
        if (intialValues) {
            formRef.setFieldsValue(intialValues)
        } else {
            formRef.resetFields();
        }
    }, [intialValues])
    return <>
        <Form form={formRef} initialValues={initialvalues} layout="vertical">
            <Form.Item style={{ display: 'none' }} name="id">
                <Input type="hidden" />
            </Form.Item>
            <Row style={{ textAlign: 'center' }}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }} offset={3}>
                    <Form.Item
                        label="Component Name"
                        name="compName"
                        rules={[{ required: true, message: 'Enter the Component Name' }, {
                            pattern: /^[A-Za-z_ ]+$/,
                            message: 'Only alphabets, underscores, and spaces are allowed'
                        }]}>
                        <Input placeholder="Please Enter Component Name" />
                    </Form.Item>
                </Col>
            </Row>
            <Row style={{ textAlign: 'center' }}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }} offset={3}>
                    <Form.Item
                        label="Component Description"
                        name="compDesc"
                        rules={[{ required: true, message: 'Enter the Component Description' },]}>
                        <Input placeholder="Please Enter Component Description" />
                    </Form.Item>
                </Col>
            </Row>


        </Form>
    </>

}

export default ComponentForm