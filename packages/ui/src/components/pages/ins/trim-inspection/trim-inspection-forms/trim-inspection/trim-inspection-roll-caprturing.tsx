import { CommonRequestAttrs, InsInspectionFinalInSpectionStatusEnum, InsTrimDefectTypesEnum, InsTrimNamesEnum, InsTrimTypesEnum, PackFinalInspectionStatusEnum, TrimInsBasicInspectionRequest, TrimInsBasicInspectionRollDetails } from '@xpparel/shared-models';
import { RejectedReasonsServices, configVariables } from '@xpparel/shared-services';
import { Button, Col, Collapse, CollapseProps, Descriptions, Form, Input, InputNumber, Row, Select, Space, Tag, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../../common';
import { AlertMessages, DocumentFilesAccepts, ImagesFilesAccepts } from '../../../../../common';
import '../inspection-forms.css';
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;
const fourPointsRollLevelFailThresholdValue = 28;
const fourPointsBatchLevelFailThresholdValue = 26;

export interface FourPointInspectionRollCapturingProps {
    rollsInfo: TrimInsBasicInspectionRequest;
    reloadParent?: () => void;

}



// const rollLevelInputDetailsMap = new Map<number, BasicInspectionRollDetails>();

const TrimInspectionRollCapturingForm = (props: FourPointInspectionRollCapturingProps) => {
    const cartons: TrimInsBasicInspectionRollDetails[] = props?.rollsInfo?.inspectionRollDetails;

    console.log('re', props.rollsInfo);

    const [form] = Form.useForm();
    const [stateRefresher, setStateRefresher] = useState<number>(0);
    const [reasons, setReasons] = useState<{ id: number, reasonName: string }[]>([]);
    const [rollLevelInputDetailsMap] = useState(new Map<number, TrimInsBasicInspectionRollDetails>);
    const [rollLevelInsCompletedMap] = useState(new Map<number, boolean>);
    const reasonService = new RejectedReasonsServices();
    const user = useAppSelector((state) => state.user.user.user);
    const configVariable = configVariables.APP_PKMS_SERVICE_URL;
    const [finalResult,setFinalResult]=useState<InsInspectionFinalInSpectionStatusEnum>(InsInspectionFinalInSpectionStatusEnum.OPEN);


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

    console.log('ffffffffffff',finalResult)

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

  
    let disabled;
    function renderInspectionResultSelection(rollInfo: TrimInsBasicInspectionRollDetails, index: number) {
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
        
        // disabled = rollInfo.trimFinalInsResult == InsInspectionFinalInSpectionStatusEnum.PASS || rollInfo.trimFinalInsResult == InsInspectionFinalInSpectionStatusEnum.FAIL;
        return (
            <>
                <Row>
                    {/* <Col span={8}>
                        <Form.Item
                            label={<b>Cone Inspection Result  </b>}
                            name={[index, 'inspectionResult']}
                        >
                            <Select
                                key={'PS' + rollInfo.rollId + ':' + stateRefresher}
                                style={{ width: 100 }}
                                size='small'
                                placeholder='status'
                                disabled={disabled}
                                defaultValue={defaultVal}
                                options={options}
                                allowClear={true}
                            />
                        </Form.Item>
                    </Col> */}
                    <Col span={8}>
                        <Form.Item
                            label={<b>Trim Final Result  </b>}
                            name={[index, 'trimFinalInsResult']}
                        >
                            <Select
                                key={'PS' + rollInfo.rollId + ':' + stateRefresher}
                                style={{ width: 100 }}
                                size='small'
                                placeholder='status'
                                disabled={disabled}
                                defaultValue={defaultVal}
                                options={options}
                                allowClear={true}
                                onChange={(value) => setFinalResult(value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        {/* <Form.Item
                            label={<b>Reason For Rejection</b>}
                            name={[index, 'rejectedReason']}
                        >
                            <Select
                                key={'PS' + rollInfo.rollId + ':' + stateRefresher}
                                style={{ width: 200 }}
                                size='small'
                                placeholder='status'
                                disabled={disabled}
                                allowClear={true}
                            >
                                {reasons.length && reasons.map((rec) => <Option value={rec.id}>{rec.reasonName}</Option>)}
                            </Select>
                        </Form.Item> */}

                        {/* <Form.Item label={<b>Cone Defects</b>}>
                            <Table
                                columns={columns}
                                dataSource={dataSource}
                                pagination={false}
                                bordered
                                size="small"
                            />
                        </Form.Item> */}
                    </Col>
                    {/* <Col span={4}>
                        <Form.Item
                            name={[index, 'document']}
                        >
                            <Upload
                                multiple={false}
                                showUploadList
                                type='drag'
                                listType='picture-card'
                                accept={ImagesFilesAccepts + DocumentFilesAccepts}
                                maxCount={1}
                                progress={{
                                    strokeColor: {
                                        '0%': '#108ee9',
                                        '100%': '#87d068',
                                    },
                                    strokeWidth: 3,
                                    format: percent => `${parseFloat(percent.toFixed(2))}%`,
                                }}
                                beforeUpload={() => false}
                                onChange={({ fileList }) => {
                                    form.setFieldValue([index, 'document'], fileList);
                                }}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                >
                                    Click To upload
                                </Button>
                            </Upload>

                        </Form.Item>

                    </Col> */}
                    <Col span={4}>
                        {/* {configVariable + '/' + props?cartons?.[index]?.files?.fileName} */}
                        {/* <a href={configVariable + '/' + cartons?.[index]?.files?.fileName}>{cartons?.[index]?.files?.fileName}</a> */}

                    </Col>
                </Row>
                {finalResult === InsInspectionFinalInSpectionStatusEnum.FAIL && defaultVal && ( <Row>
                    <Form.Item label={<b>Trim Inspection Defects</b>}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '16px',
                            background: '#fafafa',
                            padding: '16px',
                            borderRadius: '8px',
                            border: '1px solid #d9d9d9'
                        }}
                        >
                            <Form.Item label="Defect Type" name={[index, 'defectType']} style={{ marginBottom: 0 }}>
                                <Select
                                    size="small"
                                    placeholder="Select defect type"
                                    style={{ width: '100%' }}
                                    disabled={disabled}
                                >
                                    {Object.entries(InsTrimDefectTypesEnum).map(([key, value]) => (
                                        <Select.Option key={key} value={key}>
                                            {value}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Defect Description" name={[index, 'defectDescription']} style={{ marginBottom: 0 }}>
                                <Input
                                    size="small"
                                    placeholder="Enter description"
                                    style={{ width: '100%' }}
                                    disabled={disabled}
                                />
                            </Form.Item>

                            <Form.Item label="Defect Quantity" name={[index, 'defectQuantity']} style={{ marginBottom: 0 }}>
                                <InputNumber
                                    min={0}
                                    size="small"
                                    placeholder="Enter quantity"
                                    style={{ width: '100%' }}
                                     disabled={disabled}
                                />
                            </Form.Item>
                        </div>
                    </Form.Item>
                </Row>)}
                <br /><br />
            </>
        )
    }

    const statusOptions = [InsInspectionFinalInSpectionStatusEnum.PASS, InsInspectionFinalInSpectionStatusEnum.FAIL];

    function renderRollInspectionForm(rollInfo: TrimInsBasicInspectionRollDetails, index) {
        return (
            <div style={{ backgroundColor: 'white', padding: '5px' }}>
                <hr />
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label={<b>Trim Name</b>} name={[index, 'trimName']}>
                            <Select size="small" style={{ width: '100%' }} disabled={disabled}>
                                {Object.values(InsTrimNamesEnum).map((value) => (
                                    <Select.Option key={value} value={value}>
                                        {value}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label={<b>Trim Type</b>} name={[index, 'trimType']}>
                            <Select size="small" style={{ width: '100%' }} disabled={disabled}>
                                {Object.values(InsTrimTypesEnum).map((value) => (
                                    <Select.Option key={value} value={value} >
                                        {value}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label={<b>Quantity Passed</b>} name={[index, 'qualityPassed']} >
                            <InputNumber size="small" min={0} style={{ width: '100%' }} disabled={disabled}/>
                        </Form.Item>

                        <Form.Item label={<b>Quantity Failed</b>} name={[index, 'qualityFailed']}>
                            <InputNumber size="small" min={0} style={{ width: '100%' }} disabled={disabled}/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label={<b>Functional Checks</b>} name={[index, 'functionalChecks']} initialValue={InsInspectionFinalInSpectionStatusEnum.OPEN}>
                            <Select size="small" style={{ width: '100%' }} disabled={disabled}>
                                {Object.values(InsInspectionFinalInSpectionStatusEnum)
                                    .filter((value) => value !== InsInspectionFinalInSpectionStatusEnum.OPEN) // Only PASS and FAIL in dropdown
                                    .map((value) => (
                                        <Select.Option key={value} value={value}>
                                            {value}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>


                        <Form.Item label={<b>Visual Checks</b>} name={[index, 'visualChecks']} >
                            <Select size="small" style={{ width: '100%' }} disabled={disabled}>
                                {statusOptions.map((value) => (
                                    <Select.Option key={value} value={value}>
                                        {value}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label={<b>Color Checks</b>} name={[index, 'colorChecks']}>
                            <Select size="small" style={{ width: '100%' }} disabled={disabled}>
                                {statusOptions.map((value) => (
                                    <Select.Option key={value} value={value}>
                                        {value}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label={<b>Strength Checks</b>} name={[index, 'strengthChecks']}>
                            <Select size="small" style={{ width: '100%' }} disabled={disabled}>
                                {statusOptions.map((value) => (
                                    <Select.Option key={value} value={value}>
                                        {value}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label={<b>Remarks</b>} name={[index, 'remarks']}>
                            <Input.TextArea rows={4} placeholder="Enter any remarks" disabled={disabled}/>
                        </Form.Item>
                    </Col>
                </Row>


                {/* <Row>
                    <Col span={8}>



                    </Col>
                    <Col span={8}>
                        <Descriptions size='small' column={5}>
                            {/* <Descriptions.Item label={<b>Carton Gross Weight</b>}> */}
                {/* <Tag color="#2db7f5">{rollInfo.grossWeight ? rollInfo.grossWeight : 0}</Tag> */}
                {/* </Descriptions.Item> */}
                {/* </Descriptions>
                    </Col>
                </Row> */}


                {renderInspectionResultSelection(rollInfo, index)}
            </div>
        )
    }

    function renderRollHeader(rollInfo: TrimInsBasicInspectionRollDetails) {
        console.log("header info", rollInfo);
        return <>
            <Space size={'large'}>
                <span><b>Box Number</b>: {rollInfo.rollId}</span>
                <span><b>Box Barcode</b>: {rollInfo.barcode}</span>
            </Space>
        </>
    }

    function renderCartons(rollsMap: TrimInsBasicInspectionRollDetails[]): CollapseProps['items'] {
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

export default TrimInspectionRollCapturingForm;
