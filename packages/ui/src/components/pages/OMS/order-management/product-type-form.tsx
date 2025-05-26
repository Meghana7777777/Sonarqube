import { CommonRequestAttrs } from "@xpparel/shared-models";
import { ComponentServices } from "@xpparel/shared-services";
import { Button, Col, Form, FormInstance, Input, Row, Select } from "antd"
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";

interface IProductType {
    selectedRecord?: any;
    formRef: FormInstance<any>
    initialvalues: any;
    prodTypes: any;
}

export const ProductTypeForm = (props: IProductType) => {
    const { initialvalues, formRef, prodTypes } = props;
    const compservice = new ComponentServices();
    const [compData, setCompData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { Option } = Select;
    const user = useAppSelector((state) => state.user.user.user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getAllComponents();
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && initialvalues) {
            // Prepare the components values
            const componentValues = initialvalues?.components?.map(comp => 
                typeof comp === 'object' ? comp.compName : comp
            );
            
            // Set all form values at once
            formRef.setFieldsValue({
                ...initialvalues,
                components: componentValues || []
            });
        } else if (!initialvalues) {
            formRef.resetFields();
        }
    }, [initialvalues, loading, formRef]);

    const onFinish = (e) => {
        console.log(e);
    }

    const getAllComponents = () => {
        return new Promise((resolve, reject) => {
            const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
            compservice.getAllComponents(obj)
                .then(res => {
                    if (res.status) {
                        setCompData(res.data);
                        resolve(res.data);
                    } else {
                        reject(new Error('Failed to load components'));
                    }
                })
                .catch(err => {
                    console.log(err.message);
                    reject(err);
                });
        });
    }

    return (
        <Form form={formRef} initialValues={initialvalues} layout="vertical">
            <Form.Item style={{ display: 'none' }} name="id">
                <Input type="hidden" />
            </Form.Item>
            <Row style={{ textAlign: 'center' }}>
                <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
                    <Form.Item
                        label="Product Type"
                        name="productType"
                        rules={[{ required: true, message: 'Enter the product type' }]}>
                        <Input disabled={prodTypes} placeholder="Please Enter product Type" />
                    </Form.Item>
                </Col>
            </Row>
            <Row style={{ textAlign: 'center' }}>
                <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
                    <Form.Item
                        label="Product Description"
                        name="desc"
                        rules={[{ required: true, message: 'Enter the Product Description' }]}>
                        <Input placeholder="Please Enter Product Description" />
                    </Form.Item>
                </Col>
            </Row>
            <Row style={{ textAlign: 'center' }}>
                <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
                    <Form.Item
                        label="Components"
                        name="components"
                        rules={[{ required: false, message: 'Select the components' }]}>
                        <Select 
                            mode="multiple" 
                            placeholder="Please select components" 
                            loading={loading}
                        >
                            {compData.map((value) => (
                                <Option key={value.id} value={value.compName}>
                                    {value.compName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

export default ProductTypeForm;