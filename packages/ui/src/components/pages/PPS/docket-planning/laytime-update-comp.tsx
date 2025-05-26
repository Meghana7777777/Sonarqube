import { MaterialRequestToWhRequest, PlannedDocketGroupModel } from '@xpparel/shared-models';
import { DocketPlanningServices } from '@xpparel/shared-services';
import { Button, Col, Form, Input, Row } from 'antd';
import moment from 'moment';
import { useAppSelector } from '../../../../common';
import { disabledBackDates } from '../../../../common/utils/utils';
import { AlertMessages } from '../../../common';
import DatePicker, { defaultDateFormat, defaultDateTimeFormat, defaultTimePicker } from '../../../common/data-picker/date-picker';

interface ILayTimeUpdateCompProps {
    activeJob: PlannedDocketGroupModel;
    handleCancel: () => void
}

export const LayTimeUpdateComp = (props: ILayTimeUpdateCompProps) => {
    const { activeJob, handleCancel } = props;
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);

    const docketPlanningServices = new DocketPlanningServices();

    const handelSubmit = () => {
        formRef.validateFields().then((values) => {
            const materialFulFillmentDate = values.fulfillmentDateTime ? moment(values.fulfillmentDateTime).utc().format(defaultDateTimeFormat) : '';
            // safe validation
            if(!materialFulFillmentDate) {
                AlertMessages.getErrorMessage('Fulfillment date and time are not selected');
                return false;
            }
            // CORRECT
            const req: MaterialRequestToWhRequest = new MaterialRequestToWhRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, activeJob.docketGroup, activeJob.matReqNo, values.remarks, materialFulFillmentDate);
            docketPlanningServices.requestFabricForDocketRequest(req)
            .then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    handleCancel();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                    handleCancel();
                }
            })
            .catch((err) => {
                handleCancel();
                AlertMessages.getErrorMessage(err.message);
            });
            return true;
        }).catch(err => {
            console.log(err)
        })

    }
    return (
        <>
            <Form form={formRef}>
                <Row gutter={[16, 16]} justify="space-between" align="middle">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name={'fulfillmentDateTime'} label="Fulfillment Date Time"
                            rules={[{ required: true, message: 'Select Fulfillment Date Time' }]}
                        >
                            <DatePicker showTime={{ format: defaultTimePicker }}  format={defaultDateTimeFormat} disabledDate={(current) => disabledBackDates(current, moment().format(defaultDateTimeFormat))} allowClear={false} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item name='remarks' label="Remarks"
                            rules={[{ required: false, message: 'Enter Remarks' }]}
                        >
                            <Input.TextArea placeholder="Only 50 characters are allowed" maxLength={50} />
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type='primary' onClick={() => handelSubmit()}>
                        Submit
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default LayTimeUpdateComp