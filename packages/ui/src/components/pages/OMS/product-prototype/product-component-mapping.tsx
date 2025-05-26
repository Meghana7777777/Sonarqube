import { MinusOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, ComponentModel, ProductIdRequest, ProductItemModel, ProductTypeModel, RmCompMapModel, MoProductStatusEnum, SubProductItemMapRequest } from "@xpparel/shared-models";
import { ProductPrototypeServices, ProductTypeServices } from "@xpparel/shared-services";
import { Button, Card, Col, Collapse, CollapseProps, Divider, Form, Popconfirm, Row, Select, Space, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
interface IProductComponentProps {
    orderIdPk: number;
    manufacturingOrderNo: string;
}
interface IRmSkuComponent {
    rmSkuCode: string;
    rmSkuDesc: string;
    components: string[]
}
interface IProductComponentData {
    fgColor: string;
    components: string[];
    utilizedComponents: string[];
    subProductType: string;
    orderLineNo: string;
    subProdId: number;
    productId: number;
    rmSkuComponents: IRmSkuComponent[];
}

const ProductComponentMapping = (props: IProductComponentProps) => {
    const [rawProductComponents, setRawProductComponents] = useState<ProductItemModel>();
    const [productCompData, setProductCompData] = useState<IProductComponentData[]>([]);
    const [isProdConfirm, setIsProdConfirm] = useState<boolean>(true);
    const [productTypeCompM, setProductTypeCompM] = useState<ProductTypeModel[]>([]);
    const [stateKey, setStateKey] = useState<number>(0);
    const { Option } = Select;
    const formRefs = [];

    // BAD PRACTISE. Have to find a way arround for initializing multiple forms in a loop
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [form4] = Form.useForm();
    const [form5] = Form.useForm();
    const [form6] = Form.useForm();
    const [form7] = Form.useForm();
    const [form8] = Form.useForm();
    const [form9] = Form.useForm();
    const [form10] = Form.useForm();
    const [form11] = Form.useForm();
    const [form12] = Form.useForm();
    const [form13] = Form.useForm();
    const [form14] = Form.useForm();
    const [form15] = Form.useForm();
    const [form16] = Form.useForm();
    const [form17] = Form.useForm();
    const [form18] = Form.useForm();
    const [form19] = Form.useForm();
    const [form20] = Form.useForm();

    formRefs.push(form1,form2,form3,form4,form5,form6,form7,form8,form9,form10,form11,form12,form13,form14,form15,form16,form17,form18,form19,form20);

    const user = useAppSelector((state) => state.user.user.user);
    useEffect(() => {
        if (props.orderIdPk) {
            getProductRmItemComps(props.orderIdPk);
        }
        // constructProductComponentsData(rawProductComponents);
    }, []);
    const productPrototypeServices = new ProductPrototypeServices();
    const productTypeMasterService = new ProductTypeServices();

    const getProductRmItemComps = (orderIdPk: number) => {
        const req = new ProductIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, undefined, undefined, orderIdPk);
        // productPrototypeServices.getProductRmItemComps(req).then((res => {
        //     if (res.status) {
        //         setRawProductComponents(res.data[0]);
        //         setIsProdConfirm(res.data[0].productConfirmationStatus == MoProductStatusEnum.CONFIRMED);
        //         // constructProductComponentsData(res.data[0]);
        //         getUniqueProductTypesAndConstructData(res.data[0]);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // })).catch(error => {
        //     AlertMessages.getErrorMessage(error.message)
        // });
    }
    //TODO: get product type components for product code
    const getUniqueProductTypesAndConstructData = (productItemData: ProductItemModel) => {
        const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        productTypeMasterService.getAllProductTypes(obj).then((res => {
            if (res.status) {
                setProductTypeCompM(res.data);
                constructProductComponentsData(productItemData, res.data);
            } else {
                // AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const constructProductComponentsData = (rawProductCompData: ProductItemModel, productTypeCompMasters: ProductTypeModel[]) => {
        const productComponentsData: IProductComponentData[] = rawProductCompData.subProducts.map(subProduct => {
            const utilizedComp = [];
            const rmComponents = subProduct.rmCompMapping.map(rmComp => {
                const components = rmComp.components.map(compObj => compObj.compName);
                utilizedComp.push(...components);
                const rmCompObj: IRmSkuComponent = {
                    components: components,
                    rmSkuCode: rmComp.iCode,
                    rmSkuDesc: rmComp.iDesc
                }
                return rmCompObj;
            });
            const productTypeCompObj = productTypeCompMasters.find(e => e.productType == subProduct.subProductType);
            const componentsM = productTypeCompObj ? productTypeCompObj.components.map(c => c.compName) : [];
            const prodCompObj: IProductComponentData = {
                components: componentsM,
                utilizedComponents: utilizedComp,
                fgColor: subProduct.fgColor,
                orderLineNo: subProduct.orderLineNo,
                subProdId: subProduct.subProdId,
                productId: rawProductCompData.prodId,
                subProductType: subProduct.subProductType,
                rmSkuComponents: rmComponents
            }
            return prodCompObj;
        });
        setProductCompData(productComponentsData);
        setStateKey(preC => preC + 1);
    }
    const changeRmskuComponents = (selectedComp: string[], rnSkuCompObj: IRmSkuComponent, subProdId: number) => {
        rnSkuCompObj.components = selectedComp;
        const proComp = productCompData.find(record => record.subProdId == subProdId);
        const utilizedComp = [];
        proComp.rmSkuComponents.forEach(rmskuCompOb => {
            utilizedComp.push(...rmskuCompOb.components)
        });
        proComp.utilizedComponents = utilizedComp;
        setProductCompData(JSON.parse(JSON.stringify(productCompData)));
    }

    const saveProductComponents = (rmSkuMapValues: { [key: string]: string[] }, subProdId: number, productId: number) => {
        const rmCompMapping: RmCompMapModel[] = [];
        for (const [rmsku, components] of Object.entries(rmSkuMapValues)) {
            const componentModelReq = components.map(comp => new ComponentModel(undefined, undefined, undefined, undefined, undefined, comp, undefined));
            rmCompMapping.push(new RmCompMapModel(rmsku, undefined, undefined, undefined, undefined, undefined, undefined, undefined, componentModelReq))
        }
        const rmskuCompMappingReq = new SubProductItemMapRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, undefined, rmCompMapping, productId, subProdId);
        productPrototypeServices.saveSubProductRmItemComps(rmskuCompMappingReq).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const deleteProductRmItemComps = (subProdId: number, productId: number, formName: string, formIndex: number, formItemNamesToClear: string[]) => {
        const rmskuCompDelReq = new ProductIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, productId, subProdId);
        productPrototypeServices.deleteSubProductRmItemComps(rmskuCompDelReq).then((res => {
            if (res.status) {
                // alert(formIndex);
                const currentForm = formRefs[formIndex];
                currentForm?.resetFields();
                currentForm?.setFieldsValue(formItemNamesToClear[0], null);
                getProductRmItemComps(props.orderIdPk);
                // form.resetFields();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const confirmOrUnConfirmProductRmItemComps = (productId: number, isConfirm: boolean) => {
        const rmskuCompDelReq = new ProductIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, productId, undefined);
        const methodName = isConfirm ? 'confirmProductRmItemComps' : 'unConfirmProductRmItemComps';
        productPrototypeServices[methodName](rmskuCompDelReq).then((res => {
            if (res.status) {
                setIsProdConfirm(preState=> !preState)
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const saveProductComponentsFailed = (values) => {
        
    }


    const saveAllProuctSkuCompMappings = () => {
        // now iterate each and every form and perform the save operation serially
        productCompData.map((prodLineObj, index) => {
            const relevantForm = formRefs[index];
            relevantForm?.submit();
        });
    }



    const constructItems = (prodComp: IProductComponentData[]) => {
        const items: CollapseProps['items'] = prodComp.map((prodLineObj, index) => {
            let skusFormItemNamesForProduct = [];
            return {
                key: index,
                label: <Space align="baseline"> <span>Product Type : {prodLineObj.subProductType}</span><span> | Color : {prodLineObj.fgColor}</span></Space>,
                children: <>
                    <Row>
                        <Col span={24}>
                            {prodLineObj.utilizedComponents.sort().map((e, i) => <Tag style={{ fontWeight: 'bold' }} color={i % 2 ? 'cyan' : 'green'}>{e}</Tag>)}
                        </Col>
                    </Row>
                    <Divider />
                    <Form
                        key={'form'+index}
                        name={'from' + prodLineObj.subProdId}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        form={formRefs[index]}
                        // style={{ maxWidth: 600 }}
                        // initialValues={{ remember: true }}
                        onFinish={e => saveProductComponents(e, prodLineObj.subProdId, prodLineObj.productId)}
                        onFinishFailed={saveProductComponentsFailed}
                        autoComplete="off"
                    >
                        {prodLineObj.rmSkuComponents.map(rmSkuCompObj => {

                            skusFormItemNamesForProduct.push(rmSkuCompObj.rmSkuCode);
                            return <Form.Item
                                label={rmSkuCompObj.rmSkuCode}
                                name={rmSkuCompObj.rmSkuCode}
                                rules={[{ required: true, message: 'Please select components' }]}
                                initialValue={rmSkuCompObj.components}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select Components"
                                    style={{ width: '100%' }}
                                    onChange={(selectedValues) => changeRmskuComponents(selectedValues, rmSkuCompObj, prodLineObj.subProdId)}
                                    disabled={isProdConfirm}
                                >
                                    {prodLineObj.components.map((component) => {
                                        const isDisable = rmSkuCompObj.components.includes(component) ? false : prodLineObj.utilizedComponents.includes(component);
                                        return <Option key={component} disabled={isDisable} value={component}>
                                            {component}
                                        </Option>
                                    })}
                                </Select>
                            </Form.Item>
                        })}
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Space>
                                <Button type="primary" size="small" htmlType="submit" disabled={isProdConfirm}>
                                    Save
                                </Button>
                                <Popconfirm
                                    title="Delete Product type Sku Component Mapping"
                                    description="Are you sure to delete this ?"
                                    onConfirm={() => deleteProductRmItemComps(prodLineObj.subProdId, prodLineObj.productId, 'from' + prodLineObj.subProdId, index, skusFormItemNamesForProduct)}
                                    // onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                >
                                    <Button type="primary" size={'small'} danger disabled={isProdConfirm}>Delete</Button>
                                </Popconfirm>
                            </Space>
                        </Form.Item>
                    </Form></>,
            }
        });
        return items;
    }

    return <>
        <Card size="small">
            <Collapse
                expandIconPosition='end'
                key={stateKey + 1 + 'r'}
                style={{fontWeight: '500' }}
                expandIcon={({ isActive }) => isActive ? < MinusOutlined style={{ fontSize: '20px' }} /> : <  PlusOutlined style={{ fontSize: '20px' }} />} defaultActiveKey={Array.from({ length: 100 }, (_, i) => (i - 1) + 1)} bordered items={constructItems(productCompData)} 
            />
                <Row>
                    <Col span={4} offset={4}>
                        <br/>
                        <Space>
                            <Button onClick={saveAllProuctSkuCompMappings} type="primary" size={'small'} disabled={isProdConfirm} >Save All</Button>
                        </Space>
                    </Col>
                    <Col span={4} offset={10}>
                        <Space>
                            <Popconfirm
                                title={isProdConfirm ? 'Revert Product from Cutting' : 'Confirm Product for Cutting'}
                                description="Are you sure to do this ?"
                                onConfirm={() => confirmOrUnConfirmProductRmItemComps(rawProductComponents?.prodId, !isProdConfirm)}
                                // onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                                icon={<QuestionCircleOutlined style={{ color: isProdConfirm ? 'red' : 'green' }} />}
                            >
                                <br/>
                                <Button type="primary" className="btn" size={'small'} danger={isProdConfirm}>{isProdConfirm ? 'Revert Product from Cutting' : 'Confirm Product for Cutting'}</Button>
                            </Popconfirm>
                        </Space>
                    </Col>
                </Row>
        </Card>
    </>
}

export default ProductComponentMapping;