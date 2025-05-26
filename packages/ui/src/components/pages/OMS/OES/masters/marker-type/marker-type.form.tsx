import { CommonRequestAttrs, ProcessTypeEnum, OpFormEnum } from "@xpparel/shared-models";
import { ComponentServices } from "@xpparel/shared-services";
import { Button, Col, Form, FormInstance, Input, Row, Select } from "antd"
import { useEffect, useState } from "react";

interface IMarkerType {
    selectedRecord?: any;
    formRef: FormInstance<any>
    initialvalues: any;
    markerId:any;
}
export const MarkerTypeForm = (props: IMarkerType) => {
    const [intialValues, setInitialvalues] = useState<any>()
    const { initialvalues, formRef , markerId} = props;
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
                        label="Marker Type"
                        name="markerType"
                        rules={[{ required: true, message: 'Enter the Marker Type' }]}>
                        <Input disabled={markerId} placeholder="Please Enter Marker Type" />
                    </Form.Item>
                </Col>
            </Row>
            <Row style={{ textAlign: 'center' }}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }} offset={3}>
                    <Form.Item
                        label="Marker Description"
                        name="markerDesc"
                        rules={[{ required: true, message: 'Enter the Marker Type Description' }]}>
                        <Input placeholder="Please Enter Marker Type Description" />
                    </Form.Item>
                </Col>
            </Row>

           

        </Form>
    </>

}

export default MarkerTypeForm