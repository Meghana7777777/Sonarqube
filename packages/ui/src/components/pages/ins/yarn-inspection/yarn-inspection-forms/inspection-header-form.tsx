import { InsCommonInspectionHeaderInfo, InsInspectionFinalInSpectionStatusEnum, YarnInsCommonInspectionHeaderInfo } from '@xpparel/shared-models';
import { Checkbox, Col, Descriptions, Form, Input, Row, Select, Tag } from 'antd';
import moment from 'moment';
import { disabledBackDates } from 'packages/ui/src/common/utils/utils';
import { useEffect, useState } from 'react';
import DatePicker, { defaultDateFormat } from '../../../../common/data-picker/date-picker';
import './inspection-forms.css';
import { CommonInfoService } from '../../common-info.service';

const { Option } = Select;

export interface InspectionHeaderFormProps {
    inspectionHeader: YarnInsCommonInspectionHeaderInfo;
    noOfRolls: number;
    noOfInspectedRolls: number;
    daysRemainingDefault: number;
    onInspectionStatusChange: (e) => any;
    onReRequestCreateCheck: (e) => void;
}
export const InspectionHeaderForm = (props: InspectionHeaderFormProps) => {
    const { inspectionHeader, noOfRolls, noOfInspectedRolls, daysRemainingDefault, onInspectionStatusChange, onReRequestCreateCheck } = props;
    const [daysRemaining, setDaysRemaining] = useState<number>(null);
    const [completionDate, setCompletionDate] = useState<any>(null);
    const [isChecked, setIsChecked] = useState(false);
    const [crateReReqVisible, setCrateReReqVisible] = useState(false);


    useEffect(() => {
        setIsChecked(inspectionHeader.createReRequest);
        console.log("inspectionHeader", inspectionHeader);
        inspectionHeader?.inspectionStatus == InsInspectionFinalInSpectionStatusEnum.FAIL ? setCrateReReqVisible(false) : setCrateReReqVisible(true);
    }, [])

    const handleDateChange = (e) => {
        onExpCompletionDateChange(e);
    }

    const OnInspStatusChange = (e) => {
        const res = onInspectionStatusChange(e);
        if (e == InsInspectionFinalInSpectionStatusEnum.FAIL && res) {
            setCrateReReqVisible(false);
        } else {
            setCrateReReqVisible(true);
            setIsChecked(false);
        }
        // onInspectionStatusChange(e)
    }

    const getInspectionStatusDropDown = (selectedValue: InsInspectionFinalInSpectionStatusEnum) => {
        return (
            <Select
                placeholder="Select inspection status"
                defaultValue={selectedValue}
                onChange={OnInspStatusChange}

            >
                {Object.values(InsInspectionFinalInSpectionStatusEnum).map((status) => (
                    <Option key={status} value={status}>
                        {status}
                    </Option>
                ))}
            </Select>
        );
    }

    const calculateDateDifference = (date1, date2) => {
        const momDate1 = moment(date1);
        const momDate2 = moment(date2);
        return momDate2.diff(momDate1, 'days');
    }

    const onExpCompletionDateChange = (e) => {
        console.log(e);
        setDaysRemaining(calculateDateDifference(new Date(), new Date(moment(e).format(defaultDateFormat))));
    }

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
        onReRequestCreateCheck(e.target.checked)
    };

    return <div>
        <Descriptions size='small' bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}>
            {/* <Descriptions.Item label={<b>{'REQUEST ID'}</b>}>{shadeInspDetails?.inspectionHeader?.inspectionReqId}</Descriptions.Item> */}

            <Descriptions.Item label={<b>{'Batch no'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.batchNo}</span></Descriptions.Item>

            {/* <Descriptions.Item label={<b>{'Lot no'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{inspectionHeader?.lotNo}</span></Descriptions.Item> */}

            <Descriptions.Item label={<b>{'Batch Qty'}</b>} className='inspection-info1-qty'><span style={{ color: "black" }}>{inspectionHeader?.batchQty} Mts.</span></Descriptions.Item>

            <Descriptions.Item label={<b>{'Total Batch Objects'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{inspectionHeader?.totalNoOfBatchRolls}</span></Descriptions.Item>

            <Descriptions.Item label={<b>{'Inspection Percentage'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{inspectionHeader?.inspectionPercentage}</span></Descriptions.Item>

            <Descriptions.Item label={<b>{'Inspection Objects'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{inspectionHeader?.totalNoOfRequestRolls}</span></Descriptions.Item>

            <Descriptions.Item label={<b>{'Inspection Qty'}</b>} className='inspection-info1-qty'><span style={{ color: "black" }}>{inspectionHeader?.inspectionQty}</span></Descriptions.Item>

            <Descriptions.Item label={<b>{'Inspected Qty'}</b>} className='inspection-info1-qty'><span style={{ color: "black" }}>{inspectionHeader?.inspectedQty}</span></Descriptions.Item>

            <Descriptions.Item label={<b>{'Total inspected Objects'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{inspectionHeader?.totalNoOfInspectedRolls}</span></Descriptions.Item>

            <Descriptions.Item label={<b>{'Request creation date'}</b>}><span>{inspectionHeader?.inspectedDate ? moment(new Date(inspectionHeader?.inspectedDate)).format(defaultDateFormat) : null}</span></Descriptions.Item>

            <Descriptions.Item label={<b>{'Request age'}</b>}><span>{CommonInfoService.getRequestAge(new Date(moment(inspectionHeader?.inspectedDate).format(defaultDateFormat)).toString())}</span></Descriptions.Item>

            <Descriptions.Item label={<b>{'Status'}</b>}><Tag color={'deeppink'}>
                {inspectionHeader?.inspectionStatus}
            </Tag></Descriptions.Item>
        </Descriptions>
        <br />
        <Row gutter={16}>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                <Form.Item
                    label={<span>Inspector</span>}
                    name="inspector"
                // rules={[{ required: true, message: 'Enter the inspector name' }]}
                >
                    <Input readOnly />
                </Form.Item>
            </ Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}> */}
                <Form.Item
                    label={<span>Exp completion date</span>}
                    name="expInspectionCompleteAt"
                    initialValue={moment(inspectionHeader?.expInspectionCompleteAt).format(defaultDateFormat)}
                // rules={[{ required: true, message: 'Enter expected completion date' }]}
                >
                    <DatePicker onChange={handleDateChange} style={{ width: '100%' }}
                        disabledDate={(current) => disabledBackDates(current, moment().format(defaultDateFormat), false)} defaultValue={moment()} />
                </Form.Item>
                {<b style={{ color: (daysRemaining ? daysRemaining : daysRemainingDefault) <= 0 ? "red" : "green" }}>{(daysRemaining == 0 || daysRemaining) ? daysRemaining : Number.isNaN(daysRemainingDefault) ? 0 : daysRemainingDefault} Days remaining </b>}
                {/* </div> */}

            </ Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                <Form.Item
                    label={<span>Area</span>}
                    name="lab"
                    initialValue={inspectionHeader?.lab}
                // rules={[{ required: true, message: 'PLEASE GIVE LAB NAME' }]}
                >
                    <Input style={{ width: '100%' }} />
                </Form.Item>
            </ Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                <Form.Item
                    label={<span>Start date</span>}
                    name="inspectionStart"
                    initialValue={moment(inspectionHeader?.inspectionStart).format(defaultDateFormat)}
                // rules={[{ required: true, message: 'Enter inspection start date' }]}
                >
                    <DatePicker format={defaultDateFormat} style={{ width: '100%' }} disabled={true} />
                </Form.Item>
            </ Col>
        </Row>
        <Row gutter={16}>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                <Form.Item
                    label={<span>Completion date</span>}
                    name="inspectionCompleteAt"
                    initialValue={moment(inspectionHeader?.inspectionCompleteAt).format(defaultDateFormat)}
                >
                    <DatePicker format={defaultDateFormat} style={{ width: '100%' }} />
                </Form.Item>
            </ Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                <Form.Item
                    label={<span>Status</span>}
                    name="inspectionStatus"
                >
                    {getInspectionStatusDropDown(inspectionHeader?.inspectionStatus)}
                </Form.Item>
            </ Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                <Form.Item
                    label={<span></span>}
                    name="createReRequest"
                ></Form.Item>
                <Checkbox checked={isChecked} onChange={handleCheckboxChange} disabled={crateReReqVisible}>
                    Create Re-Request
                </Checkbox>
            </ Col>
        </Row>
    </div>
}