import { CommonRequestAttrs, ProcessTypeEnum, OpFormEnum, ReasonCategoryEnum } from "@xpparel/shared-models";
import { ComponentServices } from "@xpparel/shared-services";
import { Button, Col, DatePicker, Form, FormInstance, Input, Row, Select, TimePicker } from "antd";
import type { Dayjs } from 'dayjs';
import moment from "moment";
import { useEffect, useState } from "react";

interface ISizeType {
    selectedRecord?: any;
    formRef: FormInstance<any>
    initialvalues: any;
    sizeId: any;
    maxSizeIndex: number;
}
export const SizesForm = (props: ISizeType) => {
    const [intialValues, setInitialvalues] = useState<any>()
    const { initialvalues, formRef, sizeId, maxSizeIndex } = props;
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
                        label="Size Index"
                        name="sizeIndex"
                        rules={[{ required: true, message: 'Enter the Size Index' }]}
                    >
                        <Input
                            disabled={sizeId}
                            type="number"
                            placeholder={`Available index number is ${maxSizeIndex + 1}`}
                        />
                    </Form.Item>


                </Col>


                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Size Code"
                        name="sizeCode"
                        rules={[{ required: true, message: 'Enter the Size Code' }]}>
                        <Input disabled={sizeId} placeholder="Please Enter Size Code" />
                    </Form.Item>
                </Col>


                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Size Description"
                        name="sizeDesc"
                        rules={[{ required: true, message: 'Enter the Size Description' }]}>
                        <Input placeholder="Please Enter Size Description" />
                    </Form.Item>
                </Col>
            </Row>



        </Form>
    </>

}

export default SizesForm