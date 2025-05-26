import { DeleteFilled, PlusSquareFilled } from '@ant-design/icons';
import { InsBasicInspectionRequest, InsBasicInspectionRollDetails, InsFourPointPositionEnum, InsFourPointPositionEnumDisplayValues, InsFourPointsInspectionRollDetails, InsInspectionFinalInSpectionStatusEnum, InsMasterdataCategoryEnum, InsReasonsCategoryRequest, InsReasonsCreationModel, InsUomEnum } from '@xpparel/shared-models';
import { InsReasonsServices } from '@xpparel/shared-services';
import { Button, Col, Collapse, CollapseProps, Descriptions, Form, Input, InputNumber, Radio, Row, Select, Space, Table, Tag } from 'antd';
import { convertValuesToASpecificUom } from 'packages/ui/src/components/common/helper-functions';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../../common';
import { AlertMessages } from '../../../../../common';
import '../inspection-forms.css';
const { Option } = Select;
const fourPointsRollLevelFailThresholdValue = 28;
const fourPointsBatchLevelFailThresholdValue = 26;

export interface FourPointInspectionRollCapturingProps {
    rollsInfo: InsBasicInspectionRequest;
    reloadParent?: () => void;
}


// const rollLevelInputDetailsMap = new Map<number, BasicInspectionRollDetails>();

const FourPointInspectionRollCapturingForm = (props: FourPointInspectionRollCapturingProps) => {
    const [form] = Form.useForm();
    const [stateRefresher, setStateRefresher] = useState<number>(0);
    const [reasons, setReasons] = useState<InsReasonsCreationModel[]>([]);
    const [rollLevelInputDetailsMap] = useState(new Map<number, InsBasicInspectionRollDetails>);
    const [rollLevelInsCompletedMap] = useState(new Map<number, boolean>);
    const service = new InsReasonsServices();

    const user = useAppSelector((state) => state.user.user.user);

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
            calculateInspectionResultAndAssignToRoll(r.rollId);
        });
        reRenderTheComponent();
        getReasons();
        return () => {
            rollLevelInputDetailsMap.clear();
        };
    }, [1]);

    function getReasons() {
        const req = new InsReasonsCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, InsMasterdataCategoryEnum.INSPECTION);
        service.insGetAllReasonsData(req, true).then(res => {
            if (res.status) {
                setReasons(res.data);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })
    }

    function getDummyRollInsLine(): InsFourPointsInspectionRollDetails {
        return {
            atMeter: 0,
            reason: null,
            reasonId: null,
            points: 0,
            remarks: '',
            pointPosition: null
        }
    }

    function deletRollInspectionLine(rollId: number, index: number) {
        const rollRefs = rollLevelInputDetailsMap.get(rollId).fourPointInspection;
        // if(rollRefs.length == 1) {
        //     return;
        // }
        rollRefs.pop();
        calculateInspectionResultAndAssignToRoll(rollId);
        reRenderTheComponent();
    }

    function reRenderTheComponent() {
        setStateRefresher(val => val + 1);
    }


    function addRollInspectionLine(rollId: number) {
        const currentRowCount = rollLevelInputDetailsMap.get(rollId)?.fourPointInspection?.length;
        if (!currentRowCount) {
            rollLevelInputDetailsMap.get(rollId).fourPointInspection = [];
        }
        if (Number(currentRowCount) + 1 > 1000) {
            AlertMessages.getWarningMessage('You cannot inspect more than 1000 points');
            return
        }
        rollLevelInputDetailsMap.get(rollId).fourPointInspection.push(getDummyRollInsLine());
        reRenderTheComponent();
    }

    function setValues(rollId: number, index: number, values: { key: string, value: any }[], points: boolean) {
        try {
            const rollRef = rollLevelInputDetailsMap.get(rollId);
            // header roll info
            if (index == -1) {
                // if -1 that means we are setting the parent content
                values.forEach(k => { rollRef[k.key] = k.value });
            } else {
                const rollInsRef = rollLevelInputDetailsMap.get(rollId).fourPointInspection[index];
                if (points) {
                    // do something if needed
                    values.forEach(k => { rollInsRef[k.key] = k.value });
                } else {
                    values.forEach(k => {
                        rollInsRef[k.key] = k.value
                    });
                }
                // console.log(rollId, index, values[0], values[1]);
                // set the calculated value fro the ins total result
            }
            const calculatedValues = calculateInspectionResultAndAssignToRoll(rollId);
            // rollRef.calculatedPointResult = calculatedValues;
            // after all the values are set, override the props values
            autoSetInspectionStatus(rollId);
            autoSetFinalInspectionStatus(rollId);
            props.rollsInfo.inspectionRollDetails?.forEach(r => {
                if (r.rollId == rollId) {
                    r = rollRef;
                }
            })
            reRenderTheComponent();
        } catch (err) {
            // do nothing
            reRenderTheComponent();
            return;
        }
    }

    function autoSetInspectionStatus(rollId: number) {
        const rollRef = rollLevelInputDetailsMap.get(rollId);
        if (rollRef.calculatedPointResult > 0) {
            rollRef.rollInsResult = rollRef.calculatedPointResult > fourPointsRollLevelFailThresholdValue ? InsInspectionFinalInSpectionStatusEnum.FAIL : InsInspectionFinalInSpectionStatusEnum.PASS;
        } else {
            rollRef.rollInsResult = InsInspectionFinalInSpectionStatusEnum.OPEN;
        }
    }

    function autoSetFinalInspectionStatus(rollId: number) {
        const rollRef = rollLevelInputDetailsMap.get(rollId);
        if (rollRef.rollFinalInsResult != InsInspectionFinalInSpectionStatusEnum.OPEN) {
            if (rollRef.rollInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN) {
                rollRef.rollFinalInsResult = InsInspectionFinalInSpectionStatusEnum.OPEN;
            }
        }
    }

    function onInspectionResultChange(rollId: number, values: { key: string, value: any }[]) {
        const rollRef = rollLevelInputDetailsMap.get(rollId);
        values.forEach(k => { rollRef[k.key] = k.value });
        if (!values[0]?.value) {
            rollRef.rollInsResult = InsInspectionFinalInSpectionStatusEnum.OPEN;
        }
        autoSetFinalInspectionStatus(rollId);
        reRenderTheComponent();
    }

    function onFinalInspectionResultChange(rollId: number, values: { key: string, value: any }[]) {
        const rollRef = rollLevelInputDetailsMap.get(rollId);
        values.forEach(k => { rollRef[k.key] = k.value });
        reRenderTheComponent();
    }


    function calculateInspectionResultAndAssignToRoll(rollId) {
        const rollRef = rollLevelInputDetailsMap.get(rollId);
        let totalResultValue = 0;
        let totalPoints = 0;
        rollRef?.fourPointInspection?.forEach(r => {
            totalPoints += r.points;
        });
        const totalWidthInches = convertValuesToASpecificUom(rollRef.measuredRollWidth, InsUomEnum.CM, InsUomEnum.INCH);
        // const totalLengthYards = convertValuesToASpecificUom(rollRef.measuredRollLength, UomEnum.MTR, UomEnum.YRD);
        const totalLengthYards = Number(rollRef.measuredRollLength); // The measured Roll lenght is already being measured in yards
        if (totalWidthInches > 0 && totalLengthYards > 0 && totalPoints > 0) {
            totalResultValue = (((totalPoints * 3600) / totalWidthInches) / totalLengthYards);
        }
        rollRef.calculatedPointResult = Number(totalResultValue?.toFixed(2)) ?? 0;
        return Number(totalResultValue?.toFixed(2)) ?? 0;
    }

    function calculateInspectionResultForAllRolls() {
        let totalResultValue = 0;
        let totalWidthInches = 0;
        let totalLengthYards = 0;
        let totalPoints = 0;
        rollLevelInputDetailsMap?.forEach(rollRef => {
            rollRef?.fourPointInspection?.forEach(r => {
                totalPoints += r.points;
            });
            totalWidthInches += convertValuesToASpecificUom(rollRef.measuredRollWidth, InsUomEnum.CM, InsUomEnum.INCH);
            // totalLengthYards += convertValuesToASpecificUom(rollRef.measuredRollLength, UomEnum.MTR, UomEnum.YRD);
            const totalLengthYards = Number(rollRef.measuredRollLength); // The measured Roll lenght is already being measured in yards
        });
        if (totalWidthInches > 0 && totalLengthYards > 0 && totalPoints > 0) {
            totalResultValue = (((totalPoints * 3600) / totalWidthInches) / totalLengthYards);
        }
        return Number(totalResultValue?.toFixed(2)) ?? 0;
    }

    function renderFinalSuggestionForBatch() {
        const finalResult = calculateInspectionResultForAllRolls();
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

    function renderReasons(rollId: number, record: InsFourPointsInspectionRollDetails, index: number) {
        const options = [];
        reasons.forEach(r => {
            options.push({
                value: r.id,
                label: r.name,
            });
        });
        const rollAlreadyInspected = rollLevelInsCompletedMap.get(rollId);
        // HERE THE KEY MUST MATCH THE OBJECT KEY 
        return <Select
            style={{ width: 150 }}
            size='small'
            showSearch
            placeholder="Search"
            optionFilterProp="children"
            disabled={rollAlreadyInspected}
            // The ** opt.label ** is mandatory here, and the label is a keyword of and for the select options 
            onChange={(c, opt) => setValues(rollId, index, [{ key: 'reasonId', value: c }, { key: 'reason', value: opt.label }], false)}
            defaultValue={record.reason}
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={
                (optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={options}
        />
    }

    function renderPointPositionDropDown(rollId: number, record: InsFourPointsInspectionRollDetails, index: number) {
        const values: string[] = Object.values(InsFourPointPositionEnum);
        const options = [];
        values.forEach(r => {
            options.push({
                value: r,
                label: InsFourPointPositionEnumDisplayValues[r],
            });
        });
        const rollAlreadyInspected = rollLevelInsCompletedMap.get(rollId);
        return <Select
            style={{ width: 150 }}
            size='small'
            optionFilterProp="children"
            disabled={rollAlreadyInspected}
            // The ** opt.label ** is mandatory here, and the label is a keyword of and for the select options 
            onChange={(c, opt) => setValues(rollId, index, [{ key: 'pointPosition', value: c }], false)}
            defaultValue={record.pointPosition}
            options={options}
        />
    }

    function renderLines(rollInfo: InsBasicInspectionRollDetails, rollLineInsInfo: InsFourPointsInspectionRollDetails[]) {
        const totalLineitemsInRoll = rollLineInsInfo.length;
        // check if the fields need to be disabled based on the inspection saved status
        const rollAlreadyInspected = rollLevelInsCompletedMap.get(rollInfo.rollId);
        const columns = [
            {
                title: 'Sno',
                render: (text: string, record: InsFourPointsInspectionRollDetails, index: number) => (
                    <>{index + 1}</>
                )
            },
            {
                title: 'At Meter',
                dataIndex: 'atMeter',
                render: (text: string, record: InsFourPointsInspectionRollDetails, index: number) => (
                    <Form.Item noStyle>
                        <InputNumber
                            disabled={rollAlreadyInspected}
                            // key={rollInfo.rollId+'@'+index+'@'+text} 
                            size='small' style={{ width: 100 }} max={rollInfo.measuredRollLength?.toString()} min='0'
                            onChange={(c) => setValues(rollInfo.rollId, index, [{ key: 'atMeter', value: Number(c) }], false)}
                            defaultValue={text} />
                    </Form.Item>
                )
            },
            {
                title: 'Reason',
                dataIndex: 'reasonId',
                render: (text: string, record: InsFourPointsInspectionRollDetails, index: number) => (
                    <Form.Item noStyle initialValue={text}>
                        {renderReasons(rollInfo.rollId, record, index)}
                    </Form.Item>
                )
            },
            {
                title: <Space size={'middle'}>Four Points</Space>,
                dataIndex: 'points',
                // width: '100px',
                render: (text: string, record: InsFourPointsInspectionRollDetails, index: number) => (
                    <Form.Item noStyle>
                        <Radio.Group
                            disabled={rollAlreadyInspected}
                            optionType="button" buttonStyle="solid"
                            onChange={(c) => setValues(rollInfo.rollId, index, [{ key: 'points', value: c.target.value }], true)}
                            value={Number(text)}>
                            <Radio.Button value={1}>P1</Radio.Button>
                            <Radio.Button value={2}>P2</Radio.Button>
                            <Radio.Button value={3}>P3</Radio.Button>
                            <Radio.Button value={4}>P4</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                )
            },
            {
                title: 'Point position',
                // dataIndex: 'inspected_position',
                render: (text: string, record: InsFourPointsInspectionRollDetails, index: number) => {
                    return <Form.Item noStyle initialValue={text}>
                        {renderPointPositionDropDown(rollInfo.rollId, record, index)}
                    </Form.Item>
                }
            },
            {
                title: 'Final Points',
                dataIndex: 'points',
                render: (text: string, record: InsFourPointsInspectionRollDetails, index: number) => (
                    <Form.Item noStyle>
                        <Tag color="#f50" style={{ height: '20px' }}>{text}</Tag>
                        {/* <Input disabled size='small' type='text' defaultValue={text}/> */}
                    </Form.Item>
                )
            },
            {
                title: 'Remarks',
                dataIndex: 'remarks',
                render: (text: string, record: InsFourPointsInspectionRollDetails, index: number) => (
                    <Form.Item noStyle>
                        <Input size='small' type='text'
                            disabled={rollAlreadyInspected}
                            onChange={(c) => setValues(rollInfo.rollId, index, [{ key: 'remarks', value: c.target.value }], false)}
                            defaultValue={text} />
                    </Form.Item>
                )
            }, {
                title: rollLineInsInfo.length == 0 ? <Form.Item noStyle>
                    <Button size='small' disabled={rollAlreadyInspected} onClick={() => addRollInspectionLine(rollInfo.rollId)} type='primary' icon={<PlusSquareFilled />}></Button>
                </Form.Item> : '',
                render: (text: string, record: InsFourPointsInspectionRollDetails, index: number) => (
                    <>
                        {totalLineitemsInRoll == index + 1 ?
                            <>
                                <Form.Item noStyle>
                                    <Button disabled={rollAlreadyInspected} size='small' onClick={() => deletRollInspectionLine(rollInfo.rollId, index)} type='primary' danger icon={<DeleteFilled />}></Button>
                                </Form.Item>
                                <Space size={'large'}> </Space>
                                <Form.Item noStyle>
                                    <Button disabled={rollAlreadyInspected} size='small' onClick={() => addRollInspectionLine(rollInfo.rollId)} type='primary' icon={<PlusSquareFilled />}></Button>
                                </Form.Item>
                            </>
                            : ''}
                    </>
                )
            }
        ];
        return <>
            <Table bordered={true} size='small' dataSource={rollLineInsInfo} columns={columns} pagination={false} />
        </>
    }

    function renderPassFailButton(rollInfo: InsBasicInspectionRollDetails) {
        const obj = {
            label: '',
            color: ''
        }
        if (rollInfo.calculatedPointResult == 0) {
            obj.label = 'NA';
            obj.color = 'gray'
        } else if (rollInfo.calculatedPointResult > fourPointsRollLevelFailThresholdValue) {
            obj.label = 'Fail';
            obj.color = 'red'
        } else {
            obj.label = 'Pass';
            obj.color = 'green'
        }
        return (
            <Tag color={obj.color}>
                {obj.label}
            </Tag>
        )
    }

    function renderInspectionResultSelection(rollInfo: InsBasicInspectionRollDetails) {
        const keys = Object.keys(InsInspectionFinalInSpectionStatusEnum);
        const options = [];
        keys.forEach(k => {
            if (k != InsInspectionFinalInSpectionStatusEnum.OPEN) {
                options.push({
                    value: k,
                    label: k,
                });
            }
        });
        const defaultVal = rollInfo.rollInsResult;
        const disabled = rollInfo.rollFinalInsResult == InsInspectionFinalInSpectionStatusEnum.PASS || rollInfo.rollFinalInsResult == InsInspectionFinalInSpectionStatusEnum.FAIL;
        return (
            <>
                <b>Object Inspection Result : </b>
                <Select
                    key={'PS' + rollInfo.barcode + ':' + stateRefresher}
                    style={{ width: 100 }}
                    size='small'
                    placeholder='status'
                    disabled={disabled}
                    defaultValue={defaultVal}

                    // The ** opt.label ** is mandatory here, and the label is a keyword of and for the select options 
                    // onChange={(c, opt)=>setValues(rollInfo.rollId, -1, [ { key: 'rollInsResult', value: c} ], false ) } 
                    onChange={(c, opt) => onInspectionResultChange(rollInfo.rollId, [{ key: 'rollInsResult', value: c }])}
                    options={options}
                    allowClear={true}
                />
                <br /><br />
            </>
        )
    }

    function renderInspectionFinalResultSelection(rollInfo: InsBasicInspectionRollDetails) {
        const keys = Object.keys(InsInspectionFinalInSpectionStatusEnum);
        const options = [];
        keys.forEach(k => {
            if (k != InsInspectionFinalInSpectionStatusEnum.OPEN) {
                options.push({
                    value: k,
                    label: k,
                });
            }
        });
        const defaultVal = rollInfo.rollFinalInsResult;
        const disabled = !(rollInfo.rollInsResult == InsInspectionFinalInSpectionStatusEnum.FAIL || rollInfo.rollInsResult == InsInspectionFinalInSpectionStatusEnum.PASS);
        return (
            <>
                <b>Object Final Inspection Result : </b>
                <Select
                    key={'FS' + rollInfo.barcode + ':' + stateRefresher}
                    style={{ width: 100 }}
                    size='small'
                    placeholder='status'
                    disabled={disabled}
                    defaultValue={defaultVal}
                    // The ** opt.label ** is mandatory here, and the label is a keyword of and for the select options 
                    // onChange={(c, opt)=>setValues(rollInfo.rollId, -1, [ { key: 'rollFinalInsResult', value: c} ], false ) }
                    onChange={(c, opt) => onFinalInspectionResultChange(rollInfo.rollId, [{ key: 'rollFinalInsResult', value: c }])}
                    options={options}
                    allowClear={true}
                />
                <br /><br />
            </>
        )
    }

    const getTotalPoints = (insepctionInfo: InsFourPointsInspectionRollDetails[]): number => {
        let sum = 0;
        insepctionInfo.forEach(r => sum += r.points);
        return sum;
    }

    function renderRollInspectionForm(rollInfo: InsBasicInspectionRollDetails) {
        const rollAlreadyInspected = rollLevelInsCompletedMap.get(rollInfo.rollId);
        return (
            <div style={{backgroundColor:'white'}}>
                <hr />
                <Row>
                    <Col xl={16} lg={20} sm={24} xs={24}>
                        <Descriptions size='small' column={2}>
                            <Descriptions.Item label={<b>Object Width(cm)</b>}>
                                <InputNumber size='small' type='number'  min={0} style={{ width: '100px' }} disabled={rollAlreadyInspected}
                                    onChange={(c) => setValues(rollInfo.rollId, -1, [{ key: 'measuredRollWidth', value: c}], false)}
                                    defaultValue={rollInfo.measuredRollWidth} />
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Object Width(inch)</b>}>
                                <Tag color="#2db7f5">{convertValuesToASpecificUom(rollInfo.measuredRollWidth, InsUomEnum.CM, InsUomEnum.INCH)}</Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Row>
                    <Col xl={16} lg={20} sm={24} xs={24}>
                        <Descriptions size='small' column={2}>
                            <Descriptions.Item label={<b>Measured Object length(yard)</b>}>
                                <InputNumber size='small' type='number' min={0} style={{ width: '100px' }} disabled={rollAlreadyInspected}
                                    onChange={(c) => setValues(rollInfo.rollId, -1, [{ key: 'measuredRollLength', value: c }], false)}
                                    defaultValue={rollInfo.measuredRollLength} />
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Measured Object length(mtr)</b>}>
                                <Tag color="#2db7f5">{convertValuesToASpecificUom(rollInfo.measuredRollLength, InsUomEnum.YRD, InsUomEnum.MTR)}</Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Row>
                    <Col xl={16} lg={24} sm={24} xs={24}>
                        <Descriptions size='small' column={5}>
                            <Descriptions.Item label={<b>Object length(yard)</b>}>
                                <Tag color="#2db7f5">{convertValuesToASpecificUom(rollInfo.rollQty, InsUomEnum.MTR, InsUomEnum.YRD)}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Object length(mtr)</b>}>
                                <Tag color="#2db7f5">{rollInfo.rollQty}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Total Damage Points</b>}><Tag color="#f50" style={{height: '20px'}}>
                                {getTotalPoints(rollInfo.fourPointInspection)}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>4 Point Result</b>}><Tag color="#f50" style={{ height: '20px' }}>{rollInfo.calculatedPointResult}</Tag></Descriptions.Item>
                            <Descriptions.Item label={<b>4 point Suggestion</b>}>{renderPassFailButton(rollInfo)}</Descriptions.Item>
                            {/* <Tag color="#f50">#f50</Tag>
                            <Tag color="#2db7f5">#2db7f5</Tag>
                            <Tag color="#87d068">#87d068</Tag>
                            <Tag color="#108ee9">#108ee9</Tag> */}
                        </Descriptions>
                    </Col>
                </Row>
                {/* The ROLLs level table */}
                <Row key={'RL-' + rollInfo.fourPointInspection.length}>
                    <Col xl={16} lg={24} md={24} sm={24}>
                        {renderLines(rollInfo, rollInfo.fourPointInspection)}
                    </Col>
                    <Col offset={1} xl={4} lg={12} md={12} sm={24}>
                        <br />
                        {renderInspectionResultSelection(rollInfo)}
                        <br />
                        {renderInspectionFinalResultSelection(rollInfo)}
                    </Col>
                </Row>

            </div>
        )
    }

    function renderRollHeader(rollInfo: InsBasicInspectionRollDetails) {
        return <>
            <Space size={'large'}>
                <span><b>Object Number </b>: <Tag color=''>{rollInfo.rollId}</Tag></span>
                <span><b>Object Barcode</b>: <Tag>{rollInfo.barcode}</Tag></span>
                <span><b>Shade</b>: {rollInfo.sShade}</span>
            </Space>
        </>
    }

    function renderRolls(rollsMap: Map<number, InsBasicInspectionRollDetails>): CollapseProps['items'] {
        const items: CollapseProps['items'] = [];
        rollsMap.forEach((r, id) => {
            items.push({
                key: 'R-' + r.rollId,
                label: renderRollHeader(r),
                children: <>
                    {renderRollInspectionForm(r)}
                </>
            });
        });
        return items;
    }

    return (
        <div>
            { renderFinalSuggestionForBatch() }
            <Collapse items={renderRolls(rollLevelInputDetailsMap)} bordered={false} defaultActiveKey={[]} />
        </div>
    );
}

export default FourPointInspectionRollCapturingForm;
