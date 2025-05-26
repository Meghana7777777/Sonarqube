import { Col, Form, FormInstance, Input, Row } from 'antd';
import moment from 'moment';
import { disabledBackDates, disabledDateTime } from '../../../../common/utils/utils';
import DatePicker, { defaultDateFormat, defaultDateTimeFormat, defaultTimePicker } from '../../../common/data-picker/date-picker';
interface IPackListInfoFormProps {
    formRef: FormInstance<any>
}
export const PackListInfoForm = (props: IPackListInfoFormProps) => {
    const { formRef } = props;

    const getMaxOfCurrentAndPackListDate = () => {
        if (formRef.getFieldValue('packListDate')) {
            return moment.max(moment(), moment(formRef.getFieldValue('packListDate'))).startOf('day')
        } else {
            return moment().startOf('day')
        }
    }
    return (
        <div>
            <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                    <Form.Item name={'packListDate'} label="Pack List Date"
                        rules={[{ required: true, message: 'Select Pack List Date' }]}
                    >
                        <DatePicker format={defaultDateFormat} disabledDate={(current) => disabledBackDates(current, moment().subtract(2, 'months').format(defaultDateFormat))} onChange={(value) => {
                            if (formRef.getFieldValue('deliveryDate')) {
                                // AlertMessages.getErrorMessage('Expected Arrival Date will change to default please check')
                                // if(moment(value).isSameOrBefore(moment(formRef.getFieldValue('deliveryDate')))){
                                //     formRef.setFieldValue('deliveryDate', moment().set({ hour: 9, minute: 0, second: 0 }));
                                // }
                                formRef.setFieldValue('deliveryDate', undefined);
                            }
                        }} allowClear={false} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                    <Form.Item name={'packListCode'} label="Pack List No"
                        rules={[{ required: true, message: 'Please Enter PackL ist No' }]}
                    >
                        <Input placeholder="Pack List No" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                    <Form.Item name={'description'} label="Pack List Description"
                        rules={[{ required: true, message: 'Please Enter Pack List Description' }]}
                    >
                        <Input placeholder="Pack List Description" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                    <Form.Item name={'deliveryDate'} label="Expected Arrival Date & Time"
                        rules={[{ required: true, message: 'Select Expected Arrival Date & Time' }]}
                    >
                        <DatePicker showTime={{ format: defaultTimePicker }} format={defaultDateTimeFormat} disabledTime={(current) => disabledDateTime(moment(), current)} disabledDate={(current) => current && (current < getMaxOfCurrentAndPackListDate() || current > moment().add(2, 'months'))} defaultValue={moment().set({ hour: 9, minute: 0, second: 0 })} allowClear={false} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                    <Form.Item name={'remarks'} label="Remarks"
                        rules={[{ required: false, message: 'Enter Remarks' }]}
                    >
                        <Input.TextArea placeholder="Remarks" />
                    </Form.Item>
                </Col>
            </Row></div>
    )
}

export default PackListInfoForm