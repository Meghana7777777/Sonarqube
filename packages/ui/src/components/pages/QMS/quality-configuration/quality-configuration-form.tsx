import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { CommonRequestAttrs, ProcessTypeEnum, processTypeEnumDisplayValues, QualityConfigurationCreationReq, QualityEsclationsConfigModel, QualityTypeDto, StyleModel, UserDropdownReqDto } from '@xpparel/shared-models'
import { QualityConfigurationService, QualityTypeServices, StyleSharedService, UserService } from '@xpparel/shared-services'
import { Button, Col, Form, FormInstance, Input, InputNumber, Radio, Row, Select } from 'antd'
import { useAppSelector } from 'packages/ui/src/common'
import { AlertMessages } from 'packages/ui/src/components/common'
import { useEffect, useState } from 'react'
const { Item } = Form
const { Option } = Select

interface IProps {
    formRef: FormInstance<any>;
    initialValues: any;
    onFinish: () => void;
}

export default function QualityConfigurationForm(props: IProps) {
    const [form] = Form.useForm()

    const [styleCodeDropdownData, setStyleCodeDropdownData] = useState<StyleModel[]>([])
    const [qualityTypes, setQualityTypes] = useState<QualityTypeDto[]>([])
    const [users, setUsers] = useState<any[]>([])
    const user = useAppSelector((state) => state.user.user.user);

    const stylesService = new StyleSharedService()
    const qualityTypeservicess = new QualityTypeServices();
    const qualityConfigurationService = new QualityConfigurationService();
    const userService = new UserService()

    useEffect(() => {
        getStyleCodeDropdownData()
        getAllActiveQualityTypes()
        getUsersDropdownData()
    }, [])

    const getStyleCodeDropdownData = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        stylesService.getAllStyles(reqObj).then((res) => {
            if (res.status) {
                setStyleCodeDropdownData(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setStyleCodeDropdownData([]);
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setStyleCodeDropdownData([]);
            });
    }

    const getAllActiveQualityTypes = () => {
        qualityTypeservicess.getAllActiveQualityType().then((res) => {
            if (res.status) {
                setQualityTypes(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setQualityTypes([]);
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setQualityTypes([]);
            });
    }

    const getUsersDropdownData = () => {
        const reqObj = new UserDropdownReqDto('Admin', user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        userService.getUsersDropdowntoWarehouse(reqObj).then((res) => {
            if (res.status) {
                setUsers(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setUsers([]);
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setUsers([]);
            });
    }

    const onFinish = (values: any) => {
        const esclationsArr : QualityEsclationsConfigModel[] = []
        if(values.escalationList && values.escalationList.length){
            values.escalationList.map((v:any) => {
                esclationsArr.push(new QualityEsclationsConfigModel(v.esclationName,v.esclationQty,v.esclationResponsibleUser,v.esclationLevel,null))
            })
        
        }
        const reqObj = new QualityConfigurationCreationReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.qualityType, values.styleCode, values.processType, values.qualityPercentage, values.isMandatory, esclationsArr);
        qualityConfigurationService.createQualityConfiguration(reqObj).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                 // form.resetFields()

            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            }).finally(() => {
                props.onFinish()
            });
    }

    function onReset(){
        form.resetFields()
    }

    return (
        <ProCard size='small' security='' about='Something' title='Quality configuration' bordered headerBordered>
            <Form form={form} layout='vertical' name="qualityConfigurationForm" autoComplete="off" onFinish={onFinish} >
                <Row gutter={24}>
                    <Col span={4}>
                        <Item name={'styleCode'} label="Style" required rules={[{ required: true, message: "Please selct style code" }]} >
                            <Select allowClear showSearch placeholder="Select style code" filterOption={(input, option) =>
                                option?.children?.toString().toLowerCase().includes(input.toLowerCase())
                            }
                            >
                                {
                                    styleCodeDropdownData.length && styleCodeDropdownData.map((v) => (<Option value={v.styleCode} key={v.styleCode}>{v.styleName}</Option>))
                                }
                            </Select>
                        </Item>
                    </Col>
                    <Col span={4}>
                        <Item name={'processType'} label="Process Type" required rules={[{ required: true, message: "Please selct process type" }]} >
                            <Select allowClear showSearch placeholder="Select process type" filterOption={(input, option) =>
                                option?.children?.toString().toLowerCase().includes(input.toLowerCase())
                            }
                            >
                                {
                                    Object.keys(ProcessTypeEnum).map((key) => {
                                        return <Option value={ProcessTypeEnum[key]} key={key}>{processTypeEnumDisplayValues[key]}</Option>
                                    })
                                }
                            </Select>
                        </Item>
                    </Col>
                    <Col span={4}>
                        <Item name={'qualityType'} label="Quality Type" required rules={[{ required: true, message: "Please selct quality type" }]} >
                            <Select allowClear showSearch placeholder="Select quality type" filterOption={(input, option) =>
                                option?.children?.toString().toLowerCase().includes(input.toLowerCase())
                            }
                            >
                                {
                                    qualityTypes.length && qualityTypes.map((v) => (<Option value={v.id} key={v.id}>{v.qualityType}</Option>))
                                }
                            </Select>
                        </Item>
                    </Col>
                    <Col span={4}>
                        <Item name={'qualityPercentage'} label="Quality Percentage" required rules={[{ required: true, message: "Please selct quality percentage" }]} >
                            <InputNumber placeholder="Enter quality percentage" min={0} max={100} style={{ width: '100%' }} />
                        </Item>
                    </Col>
                    <Col span={4}>
                        <Item name={'isMandatory'} label="Is Mandatory" required rules={[{ required: true, message: "Please selct is mandatory" }]} initialValue={true} >
                            <Radio.Group defaultValue={true} buttonStyle="solid">
                                <Radio.Button value={true}>Yes</Radio.Button>
                                <Radio.Button value={false}>No</Radio.Button>
                            </Radio.Group>
                        </Item>
                    </Col>

                </Row>
                <Row>
                    <ProCard headerBordered title="Add Escalations" style={{ width: '100%' }}>
                        <Form.List name="escalationList" initialValue={[{ esclationName: '', esclationQty: 0 }]}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, fieldKey, ...restField }, i, arr) => (
                                        <Row key={key} gutter={24}>
                                            <Col span={4}>
                                                <Item
                                                    {...restField}
                                                    name={[name, 'esclationName']}
                                                    fieldKey={[fieldKey, 'esclationName']}
                                                    label="Escalation Name"
                                                    required rules={[{ required: true, message: "Please selct escalation name" }]} >
                                                    <Input placeholder="Enter escalation name" />
                                                </Item>
                                            </Col>
                                            <Col span={4}>
                                                <Item
                                                    {...restField}
                                                    name={[name, 'esclationQty']}
                                                    fieldKey={[fieldKey, 'esclationQty']}
                                                    label="Escalation Quantity"
                                                    required rules={[{ required: true, message: "Please selct escalation Quantity" }]} >
                                                    <InputNumber placeholder="Enter escalation Quantity" min={0} max={100} style={{ width: '100%' }} />
                                                </Item>
                                            </Col>
                                            <Col span={4}>
                                                <Item
                                                    {...restField}
                                                    name={[name, 'esclationLevel']}
                                                    fieldKey={[fieldKey, 'esclationLevel']}
                                                    label="Escalation Level"
                                                    required rules={[{ required: true, message: "Please selct escalation level" }]} >
                                                    <InputNumber placeholder="Enter escalation level" min={0} max={100} style={{ width: '100%' }} />
                                                </Item>
                                            </Col>
                                            <Col span={4}>
                                                <Item
                                                    {...restField}
                                                    name={[name, 'esclationResponsibleUser']}
                                                    fieldKey={[fieldKey, 'esclationResponsibleUser']}
                                                    label="Responsible User"
                                                    required rules={[{ required: true, message: "Please selct escalation responsible user" }]} >
                                                    <Select allowClear showSearch placeholder="Select escalation responsible user" filterOption={(input, option) =>
                                                        option?.children?.toString().toLowerCase().includes(input.toLowerCase())
                                                    }>
                                                        {
                                                            users.length && users.map((v) => (<Option value={v.usersId} key={v.usersId}>{v.name}</Option>))
                                                        }
                                                    </Select>
                                                </Item>
                                            </Col>
                                            <Col span={1}>
                                                <Button icon={<MinusOutlined />} type='dashed' danger shape='round' onClick={() => remove(name)} style={{ marginTop: '32px' }} />
                                            </Col>
                                            <Col span={2}>
                                                {i === (arr.length - 1) ? <Button icon={<PlusOutlined />} shape='round' type='primary' onClick={() => add()} style={{ marginTop: '32px' }}>Add </Button> : <></>
                                                } </Col>
                                        </Row>
                                    ))}

                                </>
                            )}

                        </Form.List>

                    </ProCard>

                </Row>
                <Row justify={'center'}>
                    <Col span={3}>
                        <Button type='primary' htmlType='submit' >Save configuration</Button>
                    </Col>
                    <Col span={2}>
                        <Button onClick={onReset} danger >Reset</Button>
                    </Col>
                </Row>
            </Form>
        </ProCard>
    )
}
