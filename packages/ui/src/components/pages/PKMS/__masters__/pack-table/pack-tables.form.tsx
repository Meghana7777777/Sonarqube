import { Col, Form, FormInstance, Input, InputNumber, Row, Select } from "antd"
import { useEffect, useState } from "react";

interface IPackTableType {
    selectedRecord?: any;
    formRef: FormInstance<any>
    initialvalues: any;
    packtableId: any;
}
export const PackTablesForm = (props: IPackTableType) => {
    const [intialValues, setInitialvalues] = useState<any>()
    const { initialvalues, formRef, packtableId } = props;
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
                        label="Pack Table Name"
                        name="tableName"
                        rules={[{ required: true, message: 'Enter the Pack Table' }]}>
                        <Input disabled={packtableId} placeholder="Please Enter Pack Table" />
                    </Form.Item>
                </Col>


                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Pack Table Desc"
                        name="tableDesc"
                        rules={[{ required: true, message: 'Enter the Pack Table Desc' }]}>
                        <Input placeholder="Please Enter Pack Table Desc" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Capacity"
                        name="capacity"
                        rules={[{ required: true, message: 'Enter the Capacity' }]}>
                        <InputNumber style={{width:'100%'}} min={0} placeholder="Please Enter Capacity" />
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

export default PackTablesForm