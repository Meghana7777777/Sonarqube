import { ReasonCategoryEnum } from "@xpparel/shared-models";
import { Col, Form, FormInstance, Input, Row, Select } from "antd"
import { useEffect, useState } from "react";

interface IReasonType {
    selectedRecord?: any;
    formRef: FormInstance<any>
    initialvalues: any;
    reasonId:any;
}
export const ReasonsForm = (props: IReasonType) => {
    const [intialValues, setInitialvalues] = useState<any>()
    const { initialvalues, formRef , reasonId} = props;
    const { Option } = Select;

    useEffect(() => {
        if(intialValues){
        formRef.setFieldsValue(intialValues)
        }else {
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
                        label="Reason Code"
                        name="reasonCode"
                        rules={[{ required: true, message: 'Enter the Reason Code' }]}>
                        <Input disabled={reasonId} placeholder="Please Enter Reason Code" />
                    </Form.Item>
                </Col>
            
            
                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Reason Name"
                        name="reasonName"
                        rules={[{ required: true, message: 'Enter the Reason Name' }]}>
                        <Input placeholder="Please Enter Reason Name" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Reason Description"
                        name="reasonDesc"
                        rules={[{ required: true, message: 'Enter the Reason Description' }]}>
                        <Input placeholder="Please Enter Reason Description" />
                    </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Reason Category"
                        name="reasonCategory"
                        rules={[{ required: true, message: 'Select the Reason Category' }]}>
                        <Select placeholder="Please Select Reason Category" value={ReasonCategoryEnum}>
                            {Object.keys(ReasonCategoryEnum).map(key => (
                                <option key={key} value={key}>
                                    {ReasonCategoryEnum[key].name}
                                </option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

           

        </Form>
    </>

}

export default ReasonsForm