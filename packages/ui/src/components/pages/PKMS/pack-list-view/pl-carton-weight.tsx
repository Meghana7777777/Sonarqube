import { CopyFilled } from "@ant-design/icons";
import { PackIdRequest, PackingListIdRequest, PlCartonWeightModel } from "@xpparel/shared-models";
import { PackListService } from "@xpparel/shared-services";
import { Button, Card, Col, Collapse, Descriptions, Form, Input, InputNumber, Row, Table } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";

interface IPLCartonWeightProps {
    selectedPackListId: number[];
    onClosePackListWeightModal: () => void;
};
const { Panel } = Collapse;
export const PLCartonWeight = (props: IPLCartonWeightProps) => {
    const { selectedPackListId, onClosePackListWeightModal } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;
    const [packListWeightDetails, setPackListWeightDetails] = useState<PlCartonWeightModel>(null);

    const [form] = Form.useForm();

    const service = new PackListService();

    useEffect(() => {
        if (selectedPackListId.length !== 0)
            getCartonWeightDetails(selectedPackListId[0]);
    }, [selectedPackListId]);

    const getCartonWeightDetails = (packListId: number) => {
        const req = new PackingListIdRequest(packListId, userName, userId, orgData.unitCode, orgData.companyCode);
        service.getCartonWeightDetails(req).then((res) => {
            if (res.status) {
                setPackListWeightDetails(res.data);
                form.setFieldsValue(res.data);
            } else {
                setPackListWeightDetails(null);
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    const getColumns = (protoIndex: number) => {
        return [
            {
                title: "Bar Code",
                dataIndex: "barCode",
                key: "barCode",
                render: (val: any, record: any, index) => (<>
                    {val}
                    <Form.Item name={[`cartonProtoModels`, protoIndex, "cartons", index, "id"]} style={{ display: 'none' }}>
                        <Input hidden />
                    </Form.Item>
                    <Form.Item name={[`cartonProtoModels`, protoIndex, "cartons", index, "barCode"]} style={{ display: 'none' }}>
                        <Input hidden />
                    </Form.Item>
                </>

                ),
            },
            {
                title: "Net Weight",
                dataIndex: "netWeight",
                key: "netWeight",
                render: (_: any, record: any, index) => (
                    <Form.Item name={[`cartonProtoModels`, protoIndex, "cartons", index, "netWeight"]}>
                        <InputNumber placeholder="Net Weight" />
                    </Form.Item>
                ),
            },
            {
                title: "Gross Weight",
                dataIndex: "grossWeight",
                key: "grossWeight",
                render: (_: any, record: any, index) => (
                    <Form.Item name={[`cartonProtoModels`, protoIndex, "cartons", index, "grossWeight"]}>
                        <InputNumber placeholder="Gross Weight" />
                    </Form.Item>
                ),
            },
        ]
    };

    const onFinish = (values: any) => {
        service.upDateCartonWeightDetails(values).then((res) => {
            if (res.status) {
                onClosePackListWeightModal();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch((err) => {
            console.log(err);
        });

    };

    const copyNetWeight = (protoTypeIndex: number) => {
        const fields = [];
        packListWeightDetails.cartonProtoModels[protoTypeIndex].cartons.forEach((element, index) => {
            let field = {}
            field['name'] = ['cartonProtoModels', protoTypeIndex, 'cartons', index, 'netWeight'];
            field['value'] = form.getFieldValue(['cartonProtoModels', protoTypeIndex, 'netWeight']);
            fields.push(field)
        });
        form.setFields(fields);
    };

    const copyGrossWeight = (protoTypeIndex: number) => {
        const fields = [];
        packListWeightDetails.cartonProtoModels[protoTypeIndex].cartons.forEach((element, index) => {
            let field = {}
            field['name'] = ['cartonProtoModels', protoTypeIndex, 'cartons', index, 'grossWeight'];
            field['value'] = form.getFieldValue(['cartonProtoModels', protoTypeIndex, 'grossWeight']);
            fields.push(field)
        });
        form.setFields(fields);
    }

    return <Card title={'Carton Weight Details'}>
        <Descriptions title="" bordered column={2}>
            <Descriptions.Item label="PL Config No">{packListWeightDetails?.plConfigNo}</Descriptions.Item>
            <Descriptions.Item label="PL Config Desc">{packListWeightDetails?.plConfigDesc}</Descriptions.Item>
            <Descriptions.Item label="Pack Serial">{packListWeightDetails?.packSerial}</Descriptions.Item>
            <Descriptions.Item label="PO Date">{packListWeightDetails?.poDate}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{packListWeightDetails?.qty}</Descriptions.Item>
            <Descriptions.Item label="Pack Type">{packListWeightDetails?.packType}</Descriptions.Item>
            <Descriptions.Item label="Pack Method">{packListWeightDetails?.packMethod}</Descriptions.Item>
            <Descriptions.Item label="No of Cartons">{packListWeightDetails?.noOfCartons}</Descriptions.Item>
        </Descriptions>

        <Form form={form} onFinish={onFinish} layout='vertical' style={{ marginTop: 20 }} initialValues={packListWeightDetails}>
            <Collapse collapsible="header" defaultActiveKey={packListWeightDetails?.cartonProtoModels?.map((model) => model.id)}>
                {packListWeightDetails?.cartonProtoModels?.map((model, modelIndex: number) => (
                    <Panel
                        key={model.id}
                        header={`Item: ${model.itemCode} (Count: ${model.count})`}
                        extra={
                            <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        name={[`cartonProtoModels`, modelIndex, 'id']}
                                        style={{ display: 'none' }}
                                    >
                                        <Input hidden />
                                    </Form.Item>
                                    <span style={{ marginTop: '-16px' }}>Net Weight</span>
                                    <Form.Item
                                        name={[`cartonProtoModels`, modelIndex, `netWeight`]}
                                    >
                                        <InputNumber placeholder="Net Weight" style={{ marginRight: 8 }} />
                                    </Form.Item>
                                    <CopyFilled
                                        style={{ color: '#ffffffcf', fontSize: '15px', cursor: 'pointer', marginLeft: '2px', marginTop: '-8px', marginRight: '4px', }}
                                        onClick={() => copyNetWeight(modelIndex)}
                                    /></span>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginTop: '-16px' }}>Gross Weight</span>
                                    <Form.Item
                                        name={[`cartonProtoModels`, modelIndex, `grossWeight`]}
                                    >
                                        <InputNumber placeholder="Gross Weight" />
                                    </Form.Item>
                                    <CopyFilled
                                        style={{ color: '#ffffffcf', fontSize: '15px', cursor: 'pointer', marginLeft: '2px', marginTop: '-8px', marginRight: '4px' }}
                                        onClick={() => copyGrossWeight(modelIndex)}
                                    /></span>
                            </div>
                        }
                    >
                        <Table
                            dataSource={model?.cartons ? model?.cartons : []}
                            columns={getColumns(modelIndex)}
                            rowKey="id"
                            pagination={false}
                            scroll={{y: '90Vh'}}
                        />
                    </Panel>
                ))}
            </Collapse>
            <Row justify='end'>
                <Col>
                    <Form.Item style={{ marginTop: 20 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>

        </Form>
    </Card>;
};

export default PLCartonWeight;
