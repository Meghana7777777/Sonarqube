import React, { useEffect, useState } from 'react';
import { Form, Select, Button, Row, Col, Card, Tag, Space, Divider, Input } from 'antd';
import { AlertMessages } from '../../../common';
import { useAppSelector } from 'packages/ui/src/common';
import { CommonRequestAttrs, RawOrderIdRequest, RawOrderInfoModel, RawOrderNoRequest, RawOrderSizesRequest, sizesOrderArray } from '@xpparel/shared-models';
import { OrderManipulationServices, SizesService } from '@xpparel/shared-services';

interface IOrderSizeProps {
    orderIdPk: number;
    updateStep: () => void;
}
const { Option } = Select;

const OrderSizeSelection = (props: IOrderSizeProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    useEffect(() => {
        if (props.orderIdPk) {
            getRawOrderInfo(props.orderIdPk);
            getAllSizes();
        }
    }, []);
    // const [options] = useState(Array.from({ length: 100 }, (_, i) => `Size ${i + 1}`));
    const [options] = useState(sizesOrderArray);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [rawOrderInfo, setRawOrderInfo] = useState<RawOrderInfoModel>();
    const [stateKey, setStateKey] = useState<number>(0);
    const omsManipulationService = new OrderManipulationServices();
    const sizesService = new SizesService();
    const[sizesData, setSizesData]=useState([]);
    const getRawOrderInfo = (orderIdPk: number) => {
        const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, orderIdPk, undefined, undefined, undefined, false, false, false, false, false);
        // omsManipulationService.getRawOrderInfo(req).then((res => {
        //     if (res.status) {
        //         const data = res.data[0];
        //         setRawOrderInfo(data);
        //         setSelectedSizes(data.sizes);
        //         setStateKey(preState => preState + 1);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // })).catch(error => {
        //     AlertMessages.getErrorMessage(error.message)
        // });
    }
    const getAllSizes = () => {
        const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        sizesService.getAllSizes(obj).then(res => {
            if (res.status) {
                setSizesData(res.data);
            }
        }).catch(err => {
            console.log(err.message)
        })
    }
    const saveMOSizesAndPackMethod = (sizes: string[], plantStyle: string) => {
        const saveSizeOrderInfo = new RawOrderSizesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, '', 0, 0, plantStyle, sizes);
        saveSizeOrderInfo.orderId = props.orderIdPk;
        saveSizeOrderInfo.orderNo = undefined;
        saveSizeOrderInfo.packMethod = 0;
        saveSizeOrderInfo.sizes = sizes;
        omsManipulationService.saveMoSizes(saveSizeOrderInfo).then((res => {
            if (res.status) {
                props.updateStep();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const onFinish = (values) => {
        saveMOSizesAndPackMethod(values.sizes, values.plantStyle?.trim());
    };

    return (
        <Card size='small'>

            <Row gutter={16}>
                <Col span={20} offset={1}>
                    {selectedSizes.map((size, i) => <Tag key={`s${size}`} style={{ minWidth: '55px', fontWeight: 'bold' }} color={i % 2 ? 'cyan' : 'green'}>{size}</Tag>)}
                </Col>
            </Row>
            <Divider orientation="left"></Divider>
            <Space></Space>
            <Form
                onFinish={onFinish}
                labelCol={{ span: 4 }}
                // wrapperCol={{ span: 20 }}
                key={stateKey}
                //   layout="vertical"
                initialValues={{
                    sizes: selectedSizes,
                    plantStyle: rawOrderInfo?.plantStyle
                }}
            >
                <Row gutter={24}>
                    <Col offset={2} span={16}>
                        <Form.Item
                            label="Sizes"
                            name="sizes"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select at least one Size',
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select Sizes"
                                style={{ width: '100%' }}
                                disabled={rawOrderInfo?.packMethodConfirmed}
                                onChange={(selectedValues) => setSelectedSizes(selectedValues)}
                            >
                                {sizesData.map((size) => (
                                    <Option key={size.sizeCode} value={size.sizeCode}>
                                        {size.sizeCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col offset={2} span={16} >
                        <Form.Item
                            label="Plant Style Ref"
                            name="plantStyle"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the style',
                                },
                            ]}
                        >
                            <Input 
                                style={{width: "400px"}} 
                                type="text" maxLength={30} 
                                disabled={rawOrderInfo?.packMethodConfirmed} 
                                placeholder='Only 30 characters are allowed'>    
                            </Input>
                        </Form.Item>
                    </Col>
                </Row>
                
                <Col span={5}>
                        <Form.Item style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" disabled={rawOrderInfo?.packMethodConfirmed}>
                                Save
                            </Button>
                        </Form.Item>
                    </Col>
            </Form>
        </Card>
    );
};

export default OrderSizeSelection;

