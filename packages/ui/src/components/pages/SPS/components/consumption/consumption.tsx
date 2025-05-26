import React, { useState, useEffect } from "react";
import { Form, Input, Card, Typography, Row, Col, Button, Select, InputNumber } from "antd";
import {
    ShoppingOutlined,
    CodepenOutlined,
    CheckCircleOutlined,
    SkinOutlined,
} from "@ant-design/icons";
import { CutRmSizePropsModel, InsUomEnum } from "@xpparel/shared-models";

const { Title, Text } = Typography;
const { Option } = Select;

interface SizeData {
    uom: string | null;
    mode: string;
    productName: string;
    iCode: string;
    sizeWiseRmProps: CutRmSizePropsModel[];
}


interface SizeSelectionFormProps {
    data: SizeData;
    hasConsumption: boolean;
    handleModalClose: () => void;
    rowKey: number;
    handleSubmit: (values: any, rowKey: number) => void;
    rowData: {
        [key: number]: CutRmSizePropsModel[];
    }
}

const SizeSelectionForm = ({
    data,
    hasConsumption,
    handleModalClose,
    rowKey,
    handleSubmit,
    rowData
}: SizeSelectionFormProps) => {
    const [form] = Form.useForm();
    const [hederForm] = Form.useForm();
    const [isCommonConsumptionSet, setIsCommonConsumptionSet] = useState(false);

    useEffect(() => {
        const initialValues = rowData[rowKey].reduce((acc, item) => {
            acc[item.size] = { cons: item.cons || 0, uom: item.uom };
            return acc;
        }, {} as { [key: string]: { cons: number, uom: string } });
        hederForm.setFieldValue('uom', rowData[rowKey][0]?.uom);
        form.setFieldsValue({ sizes: initialValues });
    }, [data, form]);

    const handleCommonConsumptionSubmit = () => {
        hederForm.validateFields().then((values) => {
            setIsCommonConsumptionSet(true);
            const updatedValues = data.sizeWiseRmProps.reduce((acc, item) => {
                acc[item.size] = { cons: values.cons, uom: values.uom };
                return acc;
            }, {} as { [key: string]: { cons: number, uom: string } });
            form.setFieldsValue({ sizes: updatedValues });
        }).catch(err => {
            console.log(err);
        })

    };

    const handleClearCommonConsumption = () => {
        setIsCommonConsumptionSet(false);
        hederForm.resetFields();
        form.resetFields();
    };


    const handleSubmitForm = (values) => {
        const submittedValues = data.sizeWiseRmProps.map((item) => ({
            size: item.size,
            cons: values.sizes[item.size]?.cons || "",
            uom: hederForm.getFieldValue('uom') || "",
            wastage: item.wastage || "0.0",
        }));

        console.log("consumptionValues:", submittedValues);
        handleSubmit(submittedValues, rowKey);
        handleModalClose();
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: 24 }}>
                <Card style={{ backgroundColor: "#f0f5ff", margin: '0px auto 20px auto', width: "36%", textAlign: 'center' }}>
                    <Title level={4} style={{ textAlign: 'center', margin: '0px 0px 0px 0px' }}>
                        <ShoppingOutlined style={{ marginRight: 8 }} />
                        Consumption Report {hasConsumption ? "Details" : "Requests"}
                    </Title>
                </Card>

                <Row gutter={[16, 16]} justify={"center"}>
                    <Card style={{ margin: "auto", width: "36%" }}>
                        <Text strong style={{ padding: 5 }}>
                            <CodepenOutlined style={{ marginRight: 8 }} />
                            Product Name: {data.productName}
                        </Text>
                    </Card>
                    <Card style={{ margin: "auto", width: "36%" }}>
                        <Text strong style={{ padding: 5 }}>
                            <CheckCircleOutlined style={{ marginRight: 8 }} />
                            Item Code: {data.iCode}
                        </Text>
                    </Card>
                </Row>

                <div style={{ marginTop: 24 }}>
                    {hasConsumption ? (
                        <>
                            <Row>
                                <Card style={{ margin: "auto", width: "36%" }}>
                                    <Text strong style={{ padding: 5 }}>
                                        <CheckCircleOutlined style={{ marginRight: 8 }} />
                                        UOM: {data.uom}
                                    </Text>
                                </Card>
                            </Row>
                            <Form form={form} onFinish={handleSubmitForm} style={{ marginTop: 24 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "16px",
                                        justifyContent: "center",
                                    }}
                                >
                                    {data.sizeWiseRmProps.map((item) => (
                                        <div
                                            key={item.size}
                                            style={{
                                                flexShrink: 1,
                                                flexBasis: "calc(12.5% - 16px)",
                                                minWidth: "100px",
                                                maxWidth: "200px",
                                                backgroundColor: "white",
                                                border: "1px solid #ddd",
                                                borderRadius: "4px",
                                                padding: "16px",
                                                boxShadow:
                                                    "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.06)",
                                            }}
                                        >
                                            <Text strong style={{ display: "block", marginBottom: 8 }}>
                                                <SkinOutlined style={{ marginRight: 8 }} />
                                                Size: {item.size}
                                            </Text>
                                            <Form.Item
                                                name={["sizes", item.size, "cons"]}
                                                rules={[{ required: true, message: "Please input consumption" }]}
                                            >
                                                <InputNumber
                                                    type="text"
                                                    value={item.cons || "N/A"}
                                                    style={{ width: "100%" }}
                                                    readOnly
                                                    disabled
                                                    placeholder="Consumption"
                                                />
                                            </Form.Item>
                                        </div>
                                    ))}
                                </div>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        style={{ marginTop: 16, width: "50%", marginLeft: "25%" }}
                                    >
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </>
                    ) : (
                        <>
                            <Form form={hederForm} style={{ marginTop: 24 }}>
                                <Row gutter={16} align="middle" justify="center">
                                    <Form.Item
                                        name="uom"
                                        rules={[{ required: true, message: "Please Select UOM" }]}
                                        style={{ margin: 0 }}
                                    >
                                        <Select
                                            style={{ width: 200, height: 40, marginRight: 20, marginBottom: 10 }}
                                            allowClear
                                            showSearch
                                            placeholder={'Select UOM'}
                                        >
                                            {Object.values(InsUomEnum).map((value) => (
                                                <Option key={value} value={value}>
                                                    {value}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name="cons"
                                        rules={[{ required: true, message: "Please Enter Consumption" }]}
                                        style={{ margin: 0 }}
                                    >
                                        <InputNumber
                                            type="text"
                                            placeholder="Enter common consumption value"
                                            disabled={isCommonConsumptionSet}
                                            style={{ padding: 10, marginBottom: 10 }}
                                        />
                                    </Form.Item>
                                    <Button
                                        type="primary"
                                        disabled={isCommonConsumptionSet}
                                        style={{ marginLeft: 10, marginBottom: 10 }}
                                        onClick={handleCommonConsumptionSubmit}
                                    >
                                        Apply to All
                                    </Button>
                                    <Button
                                        type="default"
                                        onClick={handleClearCommonConsumption}
                                        style={{ marginLeft: 10, marginBottom: 10 }}
                                    >
                                        Clear
                                    </Button>
                                </Row>
                            </Form>
                            <Form form={form} onFinish={handleSubmitForm} style={{ marginTop: 24 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "16px",
                                        justifyContent: "center",
                                    }}
                                >
                                    {data.sizeWiseRmProps.map((item) => (
                                        <div
                                            key={item.size}
                                            style={{
                                                flexShrink: 1,
                                                flexBasis: "calc(12.5% - 16px)",
                                                minWidth: "100px",
                                                maxWidth: "200px",
                                                backgroundColor: "white",
                                                border: "1px solid #ddd",
                                                borderRadius: "4px",
                                                padding: "16px",
                                                boxShadow:
                                                    "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.06)",
                                            }}
                                        >
                                            <Text strong style={{ display: "block", marginBottom: 8 }}>
                                                <SkinOutlined style={{ marginRight: 8 }} />
                                                Size: {item.size}
                                            </Text>
                                            <Form.Item
                                                name={["sizes", item.size, "cons"]}
                                                rules={[{ required: true, message: "Please input consumption" }]}
                                            >
                                                <Input
                                                    type="text"
                                                    placeholder="Consumption"
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        </div>
                                    ))}
                                </div>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        style={{ marginTop: 16, width: "50%", marginLeft: "25%" }}
                                    >
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SizeSelectionForm;
