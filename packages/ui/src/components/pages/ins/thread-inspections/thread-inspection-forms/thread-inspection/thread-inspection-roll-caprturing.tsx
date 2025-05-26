import { CommonRequestAttrs, InsInspectionFinalInSpectionStatusEnum, PackFinalInspectionStatusEnum, ThreadInsBasicInspectionRequest, ThreadInsBasicInspectionRollDetails } from '@xpparel/shared-models';
import { RejectedReasonsServices, configVariables } from '@xpparel/shared-services';
import { Col, Collapse, CollapseProps, Descriptions, Form, Input, InputNumber, Row, Select, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../../common';
import { AlertMessages } from '../../../../../common';
import '../inspection-forms.css';
const { Option } = Select;
const fourPointsRollLevelFailThresholdValue = 28;
const fourPointsBatchLevelFailThresholdValue = 26;

export interface FourPointInspectionRollCapturingProps {
    rollsInfo: ThreadInsBasicInspectionRequest;
    reloadParent?: () => void;

}



// const rollLevelInputDetailsMap = new Map<number, BasicInspectionRollDetails>();

const ThreadInspectionRollCapturingForm = (props: FourPointInspectionRollCapturingProps) => {
    const cartons: ThreadInsBasicInspectionRollDetails[] = props?.rollsInfo?.inspectionRollDetails;

    console.log('re', props.rollsInfo);

    const [form] = Form.useForm();
    const [stateRefresher, setStateRefresher] = useState<number>(0);
    const [reasons, setReasons] = useState<{ id: number, reasonName: string }[]>([]);
    const [rollLevelInputDetailsMap] = useState(new Map<number, ThreadInsBasicInspectionRollDetails>);
    const [rollLevelInsCompletedMap] = useState(new Map<number, boolean>);
    const reasonService = new RejectedReasonsServices();
    const user = useAppSelector((state) => state.user.user.user);
    const configVariable = configVariables.APP_PKMS_SERVICE_URL;


    useEffect(() => {
        // construct the map as the form data will be rendered based on the map
        props.rollsInfo?.inspectionRollDetails?.forEach(r => {
            if (r.rollInsResult != InsInspectionFinalInSpectionStatusEnum.OPEN) {
                rollLevelInsCompletedMap.set(r.rollId, true);
            } else {
                rollLevelInsCompletedMap.set(r.rollId, false);
            }
            // by default if there are no any line items for the roll, then add a default ins line item
            if (!r.fourPointInspection?.length) {
                r.fourPointInspection = [];
                // r.fourPointInspection.push(getDummyRollInsLine());
            }
            rollLevelInputDetailsMap.set(r.rollId, r);
            // call the below line only after the map is set
            // calculateInspectionResultAndAssignToRoll(r.rollId);
        });
        // getReasons();
        return () => {
            rollLevelInputDetailsMap.clear();
        };
    }, [1]);

    function getReasons() {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        reasonService.rejectedReasonsDropDown(req).then(res => {
            if (res.status) {
                setReasons(res.data);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })
    }

    // function getDummyRollInsLine(): InsFourPointsInspectionRollDetails {
    //     return {
    //         atMeter: 0,
    //         reason: null,
    //         reasonId: null,
    //         points: 0,
    //         remarks: '',
    //         pointPosition: null
    //     }
    // }



    // function calculateInspectionResultAndAssignToRoll(rollId) {
    //     const rollRef = rollLevelInputDetailsMap.get(rollId);
    //     let totalResultValue = 0;
    //     let totalPoints = 0;
    //     rollRef?.fourPointInspection?.forEach(r => {
    //         totalPoints += r.points;
    //     });
    //     const totalWidthInches = convertValuesToASpecificUom(rollRef.measuredRollWidth, InsUomEnum.CM, InsUomEnum.INCH);
    //     // const totalLengthYards = convertValuesToASpecificUom(rollRef.measuredRollLength, UomEnum.MTR, UomEnum.YRD);
    //     const totalLengthYards = Number(rollRef.measuredRollLength); // The measured Carton lenght is already being measured in yards
    //     if (totalWidthInches > 0 && totalLengthYards > 0 && totalPoints > 0) {
    //         totalResultValue = (((totalPoints * 3600) / totalWidthInches) / totalLengthYards);
    //     }
    //     rollRef.calculatedPointResult = Number(totalResultValue?.toFixed(2)) ?? 0;
    //     return Number(totalResultValue?.toFixed(2)) ?? 0;
    // }

    // function calculateInspectionResultForAllRolls() {
    //     let totalResultValue = 0;
    //     let totalWidthInches = 0;
    //     let totalLengthYards = 0;
    //     let totalPoints = 0;
    //     rollLevelInputDetailsMap?.forEach(rollRef => {
    //         rollRef?.fourPointInspection?.forEach(r => {
    //             totalPoints += r.points;
    //         });
    //         totalWidthInches += convertValuesToASpecificUom(rollRef.measuredRollWidth, InsUomEnum.CM, InsUomEnum.INCH);
    //         // totalLengthYards += convertValuesToASpecificUom(rollRef.measuredRollLength, UomEnum.MTR, UomEnum.YRD);
    //         const totalLengthYards = Number(rollRef.measuredRollLength); // The measured Carton lenght is already being measured in yards
    //     });
    //     if (totalWidthInches > 0 && totalLengthYards > 0 && totalPoints > 0) {
    //         totalResultValue = (((totalPoints * 3600) / totalWidthInches) / totalLengthYards);
    //     }
    //     return Number(totalResultValue?.toFixed(2)) ?? 0;
    // }

    function renderFinalSuggestionForBatch() {
        // const finalResult = calculateInspectionResultForAllRolls();
        const finalResult = 0;

        const obj = {
            label: '',
            color: ''
        }
        if (finalResult == 0) {
            obj.label = 'NA';
            obj.color = 'gray';
        } else if (finalResult > fourPointsBatchLevelFailThresholdValue) {
            obj.label = 'Fail';
            obj.color = 'red';
        } else {
            obj.label = 'Pass';
            obj.color = 'green';
        }
        return (
            <Descriptions size='small' column={4}>
                <Descriptions.Item label={<b>Final Insepction Suggestion : </b>}>
                    <Tag color={obj.color}>{obj.label}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<b>Final Result : </b>}>
                    <Tag>{finalResult}</Tag>
                </Descriptions.Item>
            </Descriptions>
        );
    }

    const columns = [
        {
            title: 'Property',
            dataIndex: 'property',
            key: 'property',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            render: (_, record, index) => (
                <Form.Item name={['yarnInspection', record.key]} initialValue={record.defaultValue} style={{ marginBottom: 0 }}>
                    {record.isNumber ? (
                        <InputNumber min={0} style={{ width: '100%' }} />
                    ) : (
                        <Input />
                    )}
                </Form.Item>
            ),
        },
    ];

    const dataSource = [
        { key: 'slubs', property: 'Slubs', isNumber: true },
        { key: 'neps', property: 'Neps', isNumber: true },
        { key: 'yarnBreaks', property: 'Yarn Breaks', isNumber: true },
        { key: 'contamination', property: 'Contamination', isNumber: false },
    ];


    function renderInspectionResultSelection(rollInfo: ThreadInsBasicInspectionRollDetails, index: number) {
        return (
            <Col span={8}>
                <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                    <Form.Item label={<b>Thread Inspection Defects</b>}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Form.Item label="Slubs" name={[index, 'slubs']} initialValue={0}>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Neps" name={[index, 'neps']} initialValue={0}>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Yarn Breaks" name={[index, 'yarnBreaks']} initialValue={0}>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Contamination" name={[index, 'contamination']} initialValue={0}>
                                <Input min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </div>
                    </Form.Item>
                </div>
            </Col>
        );
    }


    function renderRollInspectionForm(rollInfo: ThreadInsBasicInspectionRollDetails, index) {
        const keys = Object.keys(PackFinalInspectionStatusEnum);
        const options = [];
        keys.forEach(k => {
            if (k != PackFinalInspectionStatusEnum.OPEN) {
                options.push({
                    value: k,
                    label: k,
                });
            }
        });
        const defaultVal = rollInfo.rollInsResult;
        const disabled = rollInfo.rollFinalInsResult == InsInspectionFinalInSpectionStatusEnum.PASS || rollInfo.rollFinalInsResult == InsInspectionFinalInSpectionStatusEnum.FAIL;

        return (
            <div style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                marginBottom: '30px',
                borderRadius: '10px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
            }}>
                <hr />
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label={<b>Ins Net Weight</b>} name={[index, 'netWeight']}>
                            <InputNumber size="small" min={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label={<b>Ins Gross Weight</b>} name={[index, 'grossWeight']}>
                            <InputNumber size='small' min={0} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item hidden name={[index, 'insReqId']}>
                            <Input />
                        </Form.Item>
                        <Form.Item label={<b>Thread Count</b>} name={[index, 'yarnCount']}>
                            <InputNumber size="small" min={0} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item label={<b>Spool Final Result</b>} name={[index, 'rollFinalInsResult']}>
                            <Select
                                key={'PS' + rollInfo.rollId + ':' + stateRefresher}
                                style={{ width: '100%' }}
                                size='small'
                                placeholder='Status'
                                disabled={disabled}
                                defaultValue={defaultVal}
                                options={options}
                                allowClear={true}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item hidden name={[index, 'insItemId']}>
                            <Input />
                        </Form.Item>

                        <Form.Item label={<b>Twist Per Inch</b>} name={[index, 'twistPerInch']} initialValue={0}>
                            <InputNumber size="small" min={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label={<b>Moisture Content</b>} name={[index, 'moistureContent']} initialValue={0}>
                            <InputNumber size="small" min={0} step={0.1} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label={<b>Tensile Strength</b>} name={[index, 'tensileStrength']} initialValue={0}>
                            <InputNumber size="small" min={0} step={0.1} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label={<b>Elongation</b>} name={[index, 'elongation']} initialValue={0}>
                            <InputNumber size="small" min={0} step={0.1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    {renderInspectionResultSelection(rollInfo, index)}
                </Row>
            </div>
        );
    }

    function renderRollHeader(rollInfo: ThreadInsBasicInspectionRollDetails) {
        console.log("header info", rollInfo);
        return <>
            <Space size={'large'}>
                <span><b>Spool Number</b>: {rollInfo.rollId}</span>
                <span><b>Spool Barcode</b>: {rollInfo.barcode}</span>
            </Space>
        </>
    }

    function renderCartons(rollsMap: ThreadInsBasicInspectionRollDetails[]): CollapseProps['items'] {
        const items: CollapseProps['items'] = [];
        rollsMap.forEach((r, index) => {
            items.push({
                key: 'R-' + index,
                label: renderRollHeader(r),
                extra: <><Tag color={r.rollInsResult === InsInspectionFinalInSpectionStatusEnum.PASS ? 'green' : r.rollInsResult === InsInspectionFinalInSpectionStatusEnum.FAIL ? 'red' : undefined}>{r.rollInsResult}</Tag></>,
                children: <>
                    {renderRollInspectionForm(r, index)}
                </>
            });
        });
        return items;
    }

    return (
        <div>
            {renderFinalSuggestionForBatch()}
            <Collapse items={renderCartons(cartons)} bordered={false} defaultActiveKey={[]} />
        </div>
    );
}

export default ThreadInspectionRollCapturingForm;
