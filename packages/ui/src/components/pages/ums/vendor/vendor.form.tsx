import { CommonRequestAttrs, ProcessTypeEnum, OpFormEnum, ReasonCategoryEnum, VendorCategoryEnum } from "@xpparel/shared-models";
import { ComponentServices } from "@xpparel/shared-services";
import { Button, Col, Form, FormInstance, Input, Row, Select } from "antd"
import { useEffect, useState } from "react";

interface IReasonType {
    selectedRecord?: any;
    formRef: FormInstance<any>
    initialvalues: any;
    reasonId: any;
}
export const VendorsForm = (props: IReasonType) => {
    const [intialValues, setInitialvalues] = useState<any>()
    const { initialvalues, formRef, reasonId } = props;
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
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Vendor Code"
                        name="vCode"
                        rules={[{ required: true, message: 'Enter the Vendor Code' }]}>
                        <Input disabled={reasonId} placeholder="Please Enter Vendor Code" />
                    </Form.Item>
                </Col>


                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Vendor Name"
                        name="vName"
                        rules={[{ required: true, message: 'Enter the Vendor Name' }]}>
                        <Input placeholder="Please Enter Vendor Name" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Vendor Description"
                        name="vDesc"
                        rules={[{ required: true, message: 'Enter the Vendor Description' }]}>
                        <Input placeholder="Please Enter Vendor Description" />
                    </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Vendor Category"
                        name="vCategory"
                        rules={[{ required: true, message: 'Select the Vendor Category' }]}>
                        <Select mode="multiple" placeholder="Please Select Vendor Category" value={VendorCategoryEnum} defaultValue={intialValues?.vCategory}>
                            {Object.keys(VendorCategoryEnum).map(key => (
                                <Option key={key} value={key}>
                                    {VendorCategoryEnum[key].name}
                                </Option>
                            ))}
                        </Select>

                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Vendor Place"
                        name="vPlace"
                        rules={[{ required: true, message: 'Enter the Vendor Place' }]}>
                        <Input placeholder="Please Enter Vendor Place" />
                    </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Vendor Country"
                        name="vCountry"
                        rules={[{ required: true, message: 'Enter the Vendor Country' }]}>
                        <Input placeholder="Please Enter Vendor Country" />
                    </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Vendor Address"
                        name="vAddress"
                        rules={[{ required: true, message: 'Enter the Vendor Address' }]}>
                        <Input placeholder="Please Enter Vendor Address" />
                    </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Vendor Contact"
                        name="vContact"
                        rules={[{ required: true, message: 'Enter the Vendor Contact Details' }]}>
                        <Input placeholder="Please Enter Vendor Contact Details" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </>

}

export default VendorsForm