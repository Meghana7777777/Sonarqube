import { InsInspectionFinalInSpectionStatusEnum, PKMSInsDetailsResponseDto, PackFinalInspectionStatusEnum } from '@xpparel/shared-models';
import { Col, Descriptions, Form, Input, Row, Select, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import DatePicker, { defaultDateFormat } from '../../../../common/data-picker/date-picker';
import './inspection-forms.css';

const { Option } = Select;

export interface InspectionHeaderFormProps {
    inspectionHeader: PKMSInsDetailsResponseDto;
    onInspectionStatusChange?: (e) => any;
    user: any;
    setFileList: any;
    fileList: any;
}
export const PKMSInspectionHeaderForm = (props: InspectionHeaderFormProps) => {
    const { inspectionHeader, onInspectionStatusChange, user, setFileList, fileList } = props;
    const [crateReReqVisible, setCrateReReqVisible] = useState(false);

    useEffect(() => {
        inspectionHeader?.finalInspectionStatus == PackFinalInspectionStatusEnum.FAIL ? setCrateReReqVisible(false) : setCrateReReqVisible(true);
    }, [])




    const getInspectionStatusDropDown = (selectedValue: PackFinalInspectionStatusEnum) => {
        return (
            <Select
                placeholder="Select inspection status"
                defaultValue={selectedValue}
            >
                {Object.values(InsInspectionFinalInSpectionStatusEnum).map((status) => (
                    <Option key={status} value={status}>
                        {status}
                    </Option>
                ))}
            </Select>
        );
    }




    return <div>
        <Descriptions size='small' bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}>

            <Descriptions.Item label={<b>{'Inspection Code'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.insCode}</span></Descriptions.Item>
            <Descriptions.Item label={<b>{'Final Inspection Status'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.finalInspectionStatus}</span></Descriptions.Item>
            <Descriptions.Item label={<b>{'Inspection Creation Time'}</b>} className='inspection-info1'>  <span>{inspectionHeader?.insCreationTime ? moment(new Date(inspectionHeader?.insCreationTime)).format(defaultDateFormat) : null}</span></Descriptions.Item>
            <Descriptions.Item label={<b>{'Total Items For Inspection'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.totalItemsForInspection}</span></Descriptions.Item>
            <Descriptions.Item label={<b>{'Inspection Request Created On'}</b>} className='inspection-info1'>
                <span style={{ color: "black" }}>
                    {new Date(inspectionHeader?.insCreatedOn).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                       timeZone: 'Asia/Dhaka'
                    })}
                </span>
            </Descriptions.Item>
            <Descriptions.Item label={<b>{'Inspection Started On'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.insStartedOn}</span></Descriptions.Item>
            <Descriptions.Item label={<b>{'First Inspection Completed On'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.firstInspectionCompletedOn}</span></Descriptions.Item>
            <Descriptions.Item label={<b>{'Material Received'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.materialReceived}</span></Descriptions.Item>
            <Descriptions.Item label={<b>{'Inspection In Progress'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.inspectionInProgress}</span></Descriptions.Item>
            <Descriptions.Item label={<b>{'Inspection Completed'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.inspectionCompleted}</span></Descriptions.Item>
            <Descriptions.Item label={<b>{'Failed Items'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.failedItems}</span></Descriptions.Item>
            <Descriptions.Item label={<b>{'Total Items Passed'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.totalItemsPassed}</span></Descriptions.Item>
            <Descriptions.Item label={<b>{'Status'}</b>}><Tag color={'deeppink'}>
                {inspectionHeader?.status}
            </Tag></Descriptions.Item>
        </Descriptions>
        <br />
        <Row gutter={16}>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                <Form.Item
                    label={<span>Inspector</span>}
                    name="inspector"
                >
                    <Input readOnly />
                </Form.Item>
            </ Col>

            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                <Form.Item
                    label={<span>Area</span>}
                    name="area"
                    initialValue={inspectionHeader?.area}
                >
                    <Input style={{ width: '100%' }} />
                </Form.Item>
            </ Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                <Form.Item
                    label={<span>Start date</span>}
                    name="insStartedAt"
                    initialValue={inspectionHeader?.insStartedAt ? inspectionHeader?.insStartedAt : ''}
                // rules={[{ required: true, message: 'Enter inspection start date' }]}
                >
                    <DatePicker format={defaultDateFormat} style={{ width: '100%' }} disabled={true} />
                </Form.Item>
            </ Col>
        </Row>
        <Row gutter={16}>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                <Form.Item
                    // valuePropName={'date'}
                    label={<span>Completion date</span>}
                    name="insCompletedAt"
                    initialValue={inspectionHeader?.insCompletedAt ? inspectionHeader?.insCompletedAt : ''}
                >
                    <DatePicker format={defaultDateFormat} style={{ width: '100%' }} />
                </Form.Item>
            </ Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                <Form.Item
                    label={<span>Status</span>}
                    name="finalInspectionStatus"
                >
                    {getInspectionStatusDropDown(inspectionHeader?.finalInspectionStatus)}
                </Form.Item>
            </ Col>

        </Row>
    </div>
}