import { CommonRequestAttrs, ProcessTypeEnum, OpFormEnum, ReasonCategoryEnum } from "@xpparel/shared-models";
import { ComponentServices } from "@xpparel/shared-services";
import { Button, Col, DatePicker, Form, FormInstance, Input, Row, Select, TimePicker } from "antd";
import type { Dayjs } from 'dayjs';
import moment from "moment";
import { useEffect, useState } from "react";

interface IReasonType {
    selectedRecord?: any;
    formRef: FormInstance<any>
    initialvalues: any;
    shiftId:any;
}
export const ShiftForm = (props: IReasonType) => {
    const [intialValues, setInitialvalues] = useState<any>()
    const { initialvalues, formRef , shiftId} = props;
    const { Option } = Select;
    const [selectedTime, setSelectedTime] = useState("00:00");
    useEffect(() => {
        if(intialValues){
        formRef.setFieldsValue(intialValues)
        }else {
            formRef.resetFields();
          }
    }, [intialValues])
    const onChange = (time: Dayjs, timeString: string) => {
        console.log(time, timeString);
      };

    return <>
        <Form form={formRef} initialValues={initialvalues} layout="vertical">
            <Form.Item style={{ display: 'none' }} name="id">
                <Input type="hidden" />
            </Form.Item>
            <Row gutter={16}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Shift"
                        name="shift"
                        rules={[{ required: true, message: 'Enter the Shift' }]}>
                        <Input disabled={shiftId} placeholder="Please Enter Shift" />
                    </Form.Item>
                </Col>
            
            
                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Start At"
                        name="startAt"
                        rules={[{ required: true, message: 'Enter the Start Time' }]}>
                        <TimePicker placeholder="Enter the Start Time" use12Hours format="h:mm a"  />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="End At"
                        name="endAt"
                        rules={[{ required: true, message: 'Enter the End Time' }]}>
                            <TimePicker placeholder="Enter the End Time" use12Hours format="h:mm a"  />
                     </Form.Item>
                </Col>
                
            </Row>

           

        </Form>
    </>

}

export default ShiftForm