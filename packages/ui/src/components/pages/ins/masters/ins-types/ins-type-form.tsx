import { Col, Form, FormInstance, Input, Row, Select, Checkbox, InputNumber } from "antd";
import { useEffect, useState } from "react";

interface InsTypeProps {
    selectedRecord?: any;
    formRef: FormInstance<any>;
    initialvalues: any;
    cuttableId: any;
}
export const InsTypesForm = (props: InsTypeProps) => {
    const { initialvalues, formRef, cuttableId } = props;
    const { Option } = Select;

    useEffect(() => {
        if (initialvalues) {
            formRef.setFieldsValue(initialvalues);
        } else {
            formRef.resetFields();
        }
    }, [initialvalues]);

    return (
        <>
            <Form form={formRef} initialValues={initialvalues} layout="vertical">
                {/* Hidden ID Field */}
                <Form.Item style={{ display: "none" }} name="id">
                    <Input type="hidden" />
                </Form.Item>

                {/* Inspection Activity Status */}
                <Row gutter={16}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            label="Inspection Activity Status"
                            name="insActivityStatus"
                            rules={[{ required: true, message: "Select Inspection Activity Status" }]}
                        >
                            <Select placeholder="Select Inspection Activity Status">
                                <Option value="FABRIC">Fabric</Option>
                                <Option value="CARTON">Carton</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* Inspection Type I1 */}
                    <Col xs={24} lg={12}>
                        <Form.Item
                            label="Inspection Type I1"
                            name="insTypeI1"
                            rules={[{ required: true, message: "Enter Inspection Type I1" }]}
                        >
                            <Input placeholder="Enter Inspection Type I1" />
                        </Form.Item>
                    </Col>

                </Row>

                <Row gutter={16}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            label="Inspection Type I2"
                            name="insTypeI2"
                            rules={[{ required: true, message: "Enter Inspection Type I2" }]}
                        >
                            <Input placeholder="Enter Inspection Type I2" />
                        </Form.Item>
                    </Col>
                    {/* Required for Allocation */}
                    <Col xs={24} lg={12}>
                        <Form.Item name="requiredForAlloc" valuePropName="checked">
                            <Checkbox>Required for Allocation</Checkbox>
                        </Form.Item>
                    </Col>

                </Row>

                <Row gutter={16}>

                    {/* Required for Dispatch */}
                    <Col xs={24} lg={12}>
                        <Form.Item name="requiredForDis" valuePropName="checked">
                            <Checkbox>Required for Dispatch</Checkbox>
                        </Form.Item>
                    </Col>

                    {/* Default Percentage */}
                    <Col xs={24} lg={12}>
                        <Form.Item
                            label="Default Percentage"
                            name="defaultPerc"
                            rules={[{ required: true, message: "Enter Default Percentage" }]}
                        >
                            <InputNumber min={0} max={100} step={0.01} placeholder="Enter Default Percentage" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default InsTypesForm;
