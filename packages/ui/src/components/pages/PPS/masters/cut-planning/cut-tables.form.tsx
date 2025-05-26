import { Col, Form, FormInstance, Input, Row, Select } from "antd"
import { useEffect, useState } from "react";

interface ICutTableType {
    selectedRecord?: any;
    formRef: FormInstance<any>
    initialvalues: any;
    cuttableId: any;
}
export const CutTablesForm = (props: ICutTableType) => {
    const [intialValues, setInitialvalues] = useState<any>()
    const { initialvalues, formRef, cuttableId } = props;
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
            <Row gutter={16}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Cut Table Name"
                        name="tableName"
                        rules={[{ required: true, message: 'Enter the Cut Table' }]}>
                        <Input disabled={cuttableId} placeholder="Please Enter Cut Table" />
                    </Form.Item>
                </Col>


                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Cut Table Desc"
                        name="tableDesc"
                        rules={[{ required: true, message: 'Enter the Cut Table Desc' }]}>
                        <Input placeholder="Please Enter Cut Table Desc" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Capacity"
                        name="capacity"
                        rules={[{ required: true, message: 'Enter the Capacity' }]}>
                        <Input placeholder="Please Enter Capacity" />
                    </Form.Item>
                </Col>


                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="External Ref Code"
                        name="extRefCode"
                        rules={[{ required: true, message: 'Enter the External Ref Code' }]}>
                        <Input placeholder="Please Enter External Ref Code" />
                    </Form.Item>
                </Col>
            </Row>



        </Form>
    </>

}

export default CutTablesForm