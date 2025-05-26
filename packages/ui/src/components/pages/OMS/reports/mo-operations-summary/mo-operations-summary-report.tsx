import { CommonRequestAttrs, MoCombinationDetails, MoCombinationFlags, MoCombinationRequest, MoCombinationWithPslIdsModel, MoNumberDropdownModel, MoPslIdProcessTypeReq, StyleCodeRequest, StyleModel } from '@xpparel/shared-models'
import { OrderCreationService, StyleSharedService } from '@xpparel/shared-services';
import { Alert, Button, Card, Checkbox, Col, Empty, Form, Radio, Row, Select } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import React, { useEffect, useState } from 'react'
import { ProCard } from '@ant-design/pro-components';
import { CheckboxProps } from 'antd/lib';
import MoCombinationsContainer from './mo-combinations-container';
const { Item } = Form
const { Option } = Select


enum MoCombinationFlagEnum {
    Product = 'product',
    Destination = 'destination',
    DeliveryDate = 'deliveryDate',
    Color = 'color'
}

const combiantionsOptions = [
    { value: MoCombinationFlagEnum.Product, label: 'Product', disabled: true },
    { value: MoCombinationFlagEnum.Color, label: 'Color', disabled: true },
    { value: MoCombinationFlagEnum.Destination, label: 'Destination' },
    { value: MoCombinationFlagEnum.DeliveryDate, label: 'Delivery date' },

];
const defaultCombination = [MoCombinationFlagEnum.Color, MoCombinationFlagEnum.Product]

export default function MoOperationsSummaryReport() {
    const [styleCodeDropdownData, setStyleCodeDropdownData] = useState<StyleModel[]>([])
    const [moNumberDropdownData, setMoNumberDropdownData] = useState<MoNumberDropdownModel[]>([])
    const [moCombinationsInfo, setMoCombinationsInfo] = useState<MoCombinationWithPslIdsModel[]>([])
    const [refreshKey, setRefreshKey] = useState<number>(0)
    const user = useAppSelector((state) => state.user.user.user);
    const [form] = Form.useForm()

    const stylesService = new StyleSharedService();
    const ordercreationService = new OrderCreationService();
    const [errorText, setErrorText] = useState<string>(null)
    const [selectedCombinations, setSelectedCombinations] = useState<MoCombinationFlagEnum[]>(defaultCombination);
    const checkAll = selectedCombinations.length === combiantionsOptions.length;
    const indeterminate = selectedCombinations.length > 0 && !checkAll;


    useEffect(() => {
        getStyleCodeDropdownData()

        return () => {
            setErrorText(null)
        }
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
            }).finally(() => {
                setMoNumberDropdownData([])
            });
    }

    const onStyleCodeChange = (v) => {
        form.resetFields(['moNumber'])
        setMoCombinationsInfo([])
        setMoNumberDropdownData([])
        getMoNumberDropdownData()
        setRefreshKey(prev => prev + 1);

    }

    const getMoNumberDropdownData = () => {
        const styleCode = form.getFieldValue('styleCode');
        const styleCodeReq = new StyleCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode)
        ordercreationService.getMoNumbersForStyleCode(styleCodeReq).then((res) => {
            if (res.status) {
                setMoNumberDropdownData(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setMoNumberDropdownData([]);
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setMoNumberDropdownData([]);
            });
    }




    const onFinish = () => {
        const moNumber = form.getFieldValue('moNumber');
        const moCombinationsFlags: MoCombinationFlags = Object.values(MoCombinationFlagEnum).reduce(
            (acc, key) => {
                acc[key] = selectedCombinations.includes(key);
                return acc;
            },
            {} as MoCombinationFlags
        );

        const req = new MoCombinationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moNumber, moCombinationsFlags)

        ordercreationService.getPslIdsForMoCombinations(req).then((res) => {
            if (res.status) {
                setMoCombinationsInfo(res.data)
                setRefreshKey(prev => prev + 1)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                dataNotFoundHandler(res.internalMessage)
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                dataNotFoundHandler(err.message)
            });
    }

    const onCombinationChange = (checkedValues: any[]) => {
        setSelectedCombinations(checkedValues);
    };

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        setSelectedCombinations(e.target.checked ? combiantionsOptions.map(opt => opt.value) : []);
    };

    function dataNotFoundHandler(errorTextParam: string) {
        setErrorText(errorTextParam)
        setMoCombinationsInfo([])
    }

    return (
        <>
            <Card size='small' style={{ padding: 0, position: 'sticky', zIndex: '10', top: '9%' }}>
                <Form form={form} onFinish={onFinish} >
                    <Row gutter={24}>
                        <Col span={6}>
                            <Item name={'styleCode'} label="Style" required rules={[{ required: true, message: "Please select style code" }]} >
                                <Select allowClear showSearch onChange={onStyleCodeChange} placeholder="Select style code" filterOption={(input, option) =>
                                    option?.children?.toString().toLowerCase().includes(input.toLowerCase())
                                }
                                >
                                    {
                                        styleCodeDropdownData.length && styleCodeDropdownData.map((v) => (<Option value={v.styleCode} key={v.styleCode}>{v.styleName}</Option>))
                                    }
                                </Select>
                            </Item>
                        </Col>
                        <Col span={6}>
                            <Item name={'moNumber'} label="MO Number" required rules={[{ required: true, message: "Please select SO Number" }]}>
                                <Select placeholder={"Select MO Number"} showSearch allowClear mode='multiple'>
                                    {
                                        moNumberDropdownData.length && moNumberDropdownData.map((v) => (<Option key={v.moNumber} value={v.moNumber}>{v.moNumber}</Option>))
                                    }
                                </Select>
                            </Item>
                        </Col>

                        <Col>
                            <Form.Item>
                                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                    Check all
                                </Checkbox>
                                <Checkbox.Group
                                    options={combiantionsOptions}
                                    value={selectedCombinations}
                                    onChange={onCombinationChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Button type='primary' htmlType='submit'>Search</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <br />
            <ProCard ghost size='small'>
                {
                    moCombinationsInfo.length ? <Row gutter={[24, 24]}>{
                        moCombinationsInfo.map((v) => (<Col span={12}>
                            <MoCombinationsContainer dataNotFoundHandler={dataNotFoundHandler} moNumber={v.moNumber} key={v.moPslIds.toString() + refreshKey} moCombinationsInfo={v} />
                        </Col>))
                    }
                    </Row> : <Empty description={errorText ? <Alert type="error" message={errorText} /> : ""} />
                }
            </ProCard>
        </>
    )
}
