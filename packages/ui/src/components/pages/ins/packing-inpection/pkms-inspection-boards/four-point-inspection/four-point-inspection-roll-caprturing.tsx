import { DeleteFilled, PlusSquareFilled, UploadOutlined } from '@ant-design/icons';
import { InsBasicInspectionRequest, InsBasicInspectionRollDetails, CommonIdReqModal, CommonRequestAttrs, InsFourPointPositionEnum, InsFourPointsInspectionRollDetails, InsInspectionFinalInSpectionStatusEnum, InsMasterdataCategoryEnum, PKMSInsSummeryCartonsDto, PackFinalInspectionStatusEnum, InsReasonsCategoryRequest, InsReasonsCreationModel, InsUomEnum,  } from '@xpparel/shared-models';
import { ReasonssServices, RejectedReasonsServices, configVariables } from '@xpparel/shared-services';
import { Button, Col, Collapse, CollapseProps, Descriptions, Form, Input, InputNumber, Radio, Row, Select, Space, Table, Tag, Upload } from 'antd';
import { convertValuesToASpecificUom } from 'packages/ui/src/components/common/helper-functions';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../../common';
import { AlertMessages, DocumentFilesAccepts, ImagesFilesAccepts } from '../../../../../common';
import '../inspection-forms.css';
const { Option } = Select;
const fourPointsRollLevelFailThresholdValue = 28;
const fourPointsBatchLevelFailThresholdValue = 26;

export interface FourPointInspectionRollCapturingProps {
    rollsInfo: InsBasicInspectionRequest;
    reloadParent?: () => void;
    cartons: PKMSInsSummeryCartonsDto[];
}



// const rollLevelInputDetailsMap = new Map<number, BasicInspectionRollDetails>();

const PKMSFourPointInspectionRollCapturingForm = (props: FourPointInspectionRollCapturingProps) => {
    const [form] = Form.useForm();
    const [stateRefresher, setStateRefresher] = useState<number>(0);
    const [reasons, setReasons] = useState<{ id: number, reasonName: string }[]>([]);
    const [rollLevelInputDetailsMap] = useState(new Map<number, InsBasicInspectionRollDetails>);
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
            calculateInspectionResultAndAssignToRoll(r.rollId);
        });
        getReasons();
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











    function calculateInspectionResultAndAssignToRoll(rollId) {
        const rollRef = rollLevelInputDetailsMap.get(rollId);
        let totalResultValue = 0;
        let totalPoints = 0;
        rollRef?.fourPointInspection?.forEach(r => {
            totalPoints += r.points;
        });
        const totalWidthInches = convertValuesToASpecificUom(rollRef.measuredRollWidth, InsUomEnum.CM, InsUomEnum.INCH);
        // const totalLengthYards = convertValuesToASpecificUom(rollRef.measuredRollLength, UomEnum.MTR, UomEnum.YRD);
        const totalLengthYards = Number(rollRef.measuredRollLength); // The measured Carton lenght is already being measured in yards
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
            const totalLengthYards = Number(rollRef.measuredRollLength); // The measured Carton lenght is already being measured in yards
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

    function renderInspectionResultSelection(rollInfo: PKMSInsSummeryCartonsDto, index: number) {
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
        const defaultVal = rollInfo.inspectionResult;
        const disabled = rollInfo.finalInspectionResult == PackFinalInspectionStatusEnum.PASS || rollInfo.finalInspectionResult == PackFinalInspectionStatusEnum.FAIL;
        return (
            <>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={<b>Carton Inspection Result  </b>}
                            name={[index, 'inspectionResult']}
                        >
                            <Select
                                key={'PS' + rollInfo.cartonNumber + ':' + stateRefresher}
                                style={{ width: 100 }}
                                size='small'
                                placeholder='status'
                                disabled={disabled}
                                defaultValue={defaultVal}
                                options={options}
                                allowClear={true}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={<b>Reason For Rejection</b>}
                            name={[index, 'rejectedReason']}
                        >
                            <Select
                                key={'PS' + rollInfo.cartonNumber + ':' + stateRefresher}
                                style={{ width: 200 }}
                                size='small'
                                placeholder='status'
                                disabled={disabled}
                                allowClear={true}
                            >
                                {reasons.length && reasons.map((rec) => <Option value={rec.id}>{rec.reasonName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
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

                    </Col>
                    <Col span={4}>
                        {/* {configVariable + '/' + props?.cartons?.[index]?.files?.fileName} */}
                        <a href={configVariable + '/' + props?.cartons?.[index]?.files?.fileName}>{props?.cartons?.[index]?.files?.fileName}</a>

                    </Col>
                </Row>



                <br /><br />
            </>
        )
    }


    function renderRollInspectionForm(rollInfo: PKMSInsSummeryCartonsDto, index) {
        return (
            <div style={{ backgroundColor: 'white', padding: '5px' }}>
                <hr />
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={<b>Ins Net Weight</b>}
                            name={[index, 'netWeight']}
                        >
                            <InputNumber size='small' type='number' min={0} style={{ width: '100px' }}
                                defaultValue={rollInfo.insGrossWeight ? rollInfo.insGrossWeight : 0} />
                        </Form.Item>
                        <Form.Item
                            hidden
                            name={[index, 'insReqId']}
                        >
                            <Input
                            />
                        </Form.Item>
                        <Form.Item
                            hidden
                            name={[index, 'insItemId']}
                        >
                            <Input
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Descriptions size='small' column={5}>
                            <Descriptions.Item label={<b>Carton Net Weight</b>}>
                                <Tag color="#2db7f5">
                                    {rollInfo.netWeight ? rollInfo.netWeight : 0}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>

                        <Form.Item
                            label={<b>Ins Gross Weight</b>}
                            name={[index, 'grossWeight']}
                        >
                            <InputNumber size='small' type='number' min={0} style={{ width: '100px' }}
                                defaultValue={rollInfo.insGrossWeight ? rollInfo.insGrossWeight : 0} />
                        </Form.Item>

                    </Col>
                    <Col span={8}>
                        <Descriptions size='small' column={5}>
                            <Descriptions.Item label={<b>Carton Gross Weight</b>}>
                                <Tag color="#2db7f5">{rollInfo.grossWeight ? rollInfo.grossWeight : 0}</Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>


                {renderInspectionResultSelection(rollInfo, index)}
            </div>
        )
    }

    function renderRollHeader(rollInfo: PKMSInsSummeryCartonsDto) {
        console.log("header info",rollInfo);
        return <>
            <Space size={'large'}>
                <span><b>Carton Number </b>: {rollInfo.cartonNumber}</span>
            </Space>
        </>
    }

    function renderCartons(rollsMap: PKMSInsSummeryCartonsDto[]): CollapseProps['items'] {
        const items: CollapseProps['items'] = [];
        rollsMap.forEach((r, index) => {
            items.push({
                key: 'R-' + index,
                label: renderRollHeader(r),
                extra: <><Tag color={r.inspectionResult === PackFinalInspectionStatusEnum.PASS ? 'green' : r.inspectionResult === PackFinalInspectionStatusEnum.FAIL ? 'red' : undefined}>{r.inspectionResult}</Tag></>,
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
            <Collapse items={renderCartons(props.cartons)} bordered={false} defaultActiveKey={[]} />
        </div>
    );
}

export default PKMSFourPointInspectionRollCapturingForm;
