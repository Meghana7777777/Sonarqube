import { CommonRequestAttrs, CutRmModel, MarkerCreateRequest, MarkerIdRequest, MarkerInfoModel, MarkerProdNameItemCodeModel, MarkerTypeModel, PoProdTypeAndFabModel, PoProdutNameRequest, PoSerialRequest, PoSummaryModel } from "@xpparel/shared-models";
import { MarkerTypeService, PoMarkerService, PoMaterialService } from "@xpparel/shared-services";
import { Button, Card, Col, Divider, Drawer, Form, Input, InputNumber, Row, Select, Space, Tag, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import MarkerGrid from "./marker-grid";
import { RedoOutlined } from "@ant-design/icons";

interface IMarkerInfo {
    productName: string;
    fgColor: string;
    markers: MarkerInfoModel[];
    itemCodes: CutRmModel[];
}
interface IProps {
    poObj: PoSummaryModel;
    onStepChange: (step: number, po: PoSummaryModel) => void
}
export const MarkerPage = (props: IProps) => {
    useEffect(() => {
        if (props.poObj) {
            getPoProdTypeAndFabrics(props.poObj.poSerial);
            getAllMarkerTypes();
        }
    }, [])
    const user = useAppSelector((state) => state.user.user.user);
    const [poProducts, setPoProducts] = useState<PoProdTypeAndFabModel[]>([]);
    const [markers, setMarkers] = useState<MarkerInfoModel[]>([]);
    const [productMarkersInfo, setProductMarkersInfo] = useState<IMarkerInfo[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [globalForm, setGlobalForm] = useState(false);
    const [markerProduct, setMarkerProduct] = useState<string>(undefined);
    const [markerFgColor, setMarkerFgColor] = useState<string>(undefined);
    const [markerItemCode, setMarkerItemCode] = useState<string>(undefined);
    const [selectedProductName, setSelectedProductName] = useState<string>(undefined);
    // const [selectedFgColor, setSelectedFgColor] = useState<string>(undefined);
    const [markerTypes, setMarkerTypes] = useState<MarkerTypeModel[]>([]);
    const markerService = new PoMarkerService();
    const poMaterialService = new PoMaterialService();
    const markerTypeService = new MarkerTypeService();
    const { Option } = Select;
    const [form] = Form.useForm();

    const getPoProdTypeAndFabrics = (poSerialNo: number) => {
        const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerialNo, undefined, false, false);
        poMaterialService.getPoProdTypeAndFabrics(req).then((res => {
            if (res.status) {
                setPoProducts(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const getAllMarkerTypes = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        markerTypeService.getAllMarkerTypes(req).then((res => {
            if (res.status) {
                setMarkerTypes(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const changeProductName = (productNameVal) => {
        try {
            setSelectedProductName(productNameVal);
            const productName = productNameVal === 'All' ? undefined : productNameVal;
            const req = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, productName, null);
            markerService.getPoMarkers(req).then((res => {
                if (res.status) {
                    setMarkers(res.data);
                    constructTblData(res.data, poProducts, productName);
                } else {
                    setMarkers([]);
                    constructTblData([], poProducts, productName);
                    // throw new Error(res.internalMessage);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })).catch(error => {
                setMarkers([]);
                constructTblData([], poProducts, productName);
                AlertMessages.getErrorMessage(error.message);
                // throw  Error(error)
            });

        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }
    }

    const constructTblData = (markersData: MarkerInfoModel[], poProductsInfo: PoProdTypeAndFabModel[], productName: string) => {
        const productMarkerMap = new Map<string, Map<string, MarkerInfoModel[]>>();
        const productSkuMap = new Map<string, Map<string, CutRmModel[]>>();
        const filterPoProducts = productName ? poProductsInfo.filter(e => e.productName === productName) : poProductsInfo;
        filterPoProducts.forEach(productObj => {
            if (!productSkuMap.has(productObj.productName)) {
                productSkuMap.set(productObj.productName, new Map<string, CutRmModel[]>());
                productMarkerMap.set(productObj.productName, new Map<string, MarkerInfoModel[]>());
            }
            if (!productSkuMap.get(productObj.productName).has(productObj.color)) {
                productSkuMap.get(productObj.productName).set(productObj.color, []);
                productMarkerMap.get(productObj.productName).set(productObj.color, []);
            }
            productSkuMap.get(productObj.productName).set(productObj.color, productObj.iCodes);
        });
        markersData.forEach(markerObj => {
            productMarkerMap.get(markerObj.productName).get(markerObj.fgColor).push(markerObj);
        });
        const productMarkers: IMarkerInfo[] = [];
        productMarkerMap.forEach((markersOfProduct, productName) => {
            markersOfProduct.forEach((markers, fgColor) => {
                const productMarker: IMarkerInfo = {
                    markers: markers,
                    productName: productName,
                    fgColor: fgColor,
                    itemCodes: productSkuMap.get(productName).get(fgColor)
                }
                productMarkers.push(productMarker);
            });
        });
        setProductMarkersInfo(productMarkers);
    }

    const deleteMarker = (markerId: number) => {
        const req = new MarkerIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, markerId);
        markerService.deletePoMarker(req).then((res => {
            if (res.status) {
                changeProductName(selectedProductName)
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    }

    const openMarkerForm = (productName: string, fgColor: string, itemCode: string) => {
        console.log(productName, fgColor, itemCode);
        setMarkerProduct(productName);
        setMarkerFgColor(fgColor);
        setMarkerItemCode(itemCode);
        setOpenForm(true);
        setGlobalForm(false);
    }

    const openGlobalMarkerForm = (productName: string) => {
        setMarkerProduct(productName);
        // setMarkerFgColor(fgColor);
        setOpenForm(true);
        setGlobalForm(true);
    }

    const onClose = () => {
        setMarkerProduct(undefined);
        setMarkerFgColor(undefined);
        setMarkerItemCode(undefined);
        setOpenForm(false);
        form.resetFields();
    }


    const onFinish = (values) => {
        const { markerLength, markerName, markerType, markerVersion, markerWidth, patternVersion, remarks1, remarks2, endAllowance, perimeter } = values;
        const items: MarkerProdNameItemCodeModel[] = [];
        if (globalForm) {
            const fabrics: string[] = values.fabrics;
            fabrics.forEach(f => {
                items.push(new MarkerProdNameItemCodeModel(null, null, f))
            });
        } else {
            items.push(new MarkerProdNameItemCodeModel(markerProduct, markerFgColor, markerItemCode))
        }

        const req = new MarkerCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, globalForm, props.poObj.poSerial, items, markerName, markerVersion, markerLength, markerWidth, patternVersion, remarks1, remarks2, markerType, markerType, endAllowance, perimeter);
        const functionName = globalForm ? 'createGlobalMarker' : 'createPoMarker';
        markerService[functionName](req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                onClose();
                changeProductName(selectedProductName);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    };

    const changeSelectedRms = (selectedValues: string[]) => {

    }

    const renderForm = (globalForm: boolean, selectedProduct: string) => {
        const fabrics = new Set<string>();
        poProducts.forEach(p => {
            if (selectedProduct == 'All') {
                p.iCodes.forEach(i => fabrics.add(i.iCode));
            } else {
                if (p.productName == selectedProduct) {
                    p.iCodes.forEach(i => fabrics.add(i.iCode));
                }
            }
        })
        const fabricsArray = Array.from(fabrics);
        return <>
            <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={onFinish} form={form} style={{ width: '400px' }} layout="horizontal">
                <Form.Item label="Marker Name" name="markerName" rules={[{ required: true, message: 'Please input marker name!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Marker Version" name="markerVersion" rules={[{ required: true, message: 'Please input marker version!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Marker Type" name="markerType" rules={[{ required: true, message: 'Please select marker type!' }]}>
                    <Select>
                        {markerTypes.map(mObj => <Option value={mObj.id}>{mObj.markerType}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item label="Marker Length" name="markerLength" rules={[{ required: true, message: 'Please input marker length!' }]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item label="Marker Width" name="markerWidth" rules={[{ required: true, message: 'Please input marker width!' }]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item label="End Allowance" name="endAllowance" rules={[{ required: true, message: 'Please input End Allowance!' }]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item label="Perimeter" name="perimeter" rules={[{ required: true, message: 'Please input perimeter!' }]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item label="Pattern Version" name="patternVersion">
                    <Input />
                </Form.Item>

                <Form.Item label="Cad Remarks" name="remarks1">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item label="Docket Remarks" name="remarks2">
                    <Input.TextArea rows={3} />
                </Form.Item>

                {globalForm ? <>
                    <Form.Item
                        label={"Fabric Codes"}
                        name={"fabrics"}
                        rules={[{ required: true, message: 'Please select fabrics' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select Components"
                            style={{ width: '100%' }}
                        // onChange={(selectedValues) => changeSelectedRms(selectedValues)}
                        >
                            {fabricsArray.map((sku) => {
                                return <Option key={sku} value={sku}>
                                    {sku}
                                </Option>
                            })}
                        </Select>
                    </Form.Item>
                </> : <></>}
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Create Marker
                    </Button>
                </Form.Item>
            </Form>
        </>
    }

    return <Card size="small" title='Markers' extra={<Tooltip title="Reload"><Button disabled={!selectedProductName} type='primary' icon={<RedoOutlined style={{ fontSize: '20px' }} />} onClick={() => changeProductName(selectedProductName)} /></Tooltip>}>
        <Form style={{ width: '600px' }}>
            <Row gutter={24}>
                <Col span={6}>
                    <Form.Item
                        name="productType"
                        label="Product Name"
                        rules={[{ required: true, message: 'Please Select Product Name' }]}
                    >
                        <Select placeholder="Please Select Product Name" onChange={changeProductName} style={{ width: '250px' }}>
                            <Option value="All">Select All</Option>
                            {
                                // poProducts.map(productObj => <Option key={productObj.productName} value={productObj.productName}>{productObj.productName}</Option>)
                                [...new Set(poProducts.map(bO => bO.productName))].map(productName => (
                                    <Option key={productName} value={productName}>{productName}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col offset={10} span={6}>
                    <Form.Item
                        label=""
                        rules={[{ required: true, message: 'Please Select Product Name' }]}
                    >
                        <Button type="primary" onClick={() => openGlobalMarkerForm(selectedProductName)} disabled={selectedProductName ? false : true}>Create Global Marker</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        {
            selectedProductName ?
                productMarkersInfo.map((productMarker, i) => {
                    return <><Card size="small" key={`c${i}`} className="card-title-bg-cyan" title={`Product Name : ${productMarker.productName} AND FG Color: ${productMarker.fgColor}`}>
                        <MarkerGrid markers={productMarker.markers} productName={productMarker.productName} fgColor= {productMarker.fgColor} itemCodes={productMarker.itemCodes} deleteMarker={deleteMarker} openMarkerForm={openMarkerForm} />
                    </Card><Divider /></>
                })
                : <></>
        }
        <Drawer
            title={globalForm ? "Create Global Marker" : "Create Marker"}
            placement={"right"}
            onClose={onClose}
            open={openForm}
            width={500}
        >
            {
                globalForm ?
                    <Space direction='vertical'><div>Product Name: <Tag color="#2db7f5">{markerProduct ? markerProduct : 'All'}</Tag></div></Space>
                    :
                    <Space direction='vertical'><div>Product Name: <Tag color="#2db7f5">{markerProduct}</Tag></div><div>Item Code: <Tag color="#87d068">{markerItemCode}</Tag></div></Space>
            }
            <Divider />
            {renderForm(globalForm, selectedProductName)}
        </Drawer>
    </Card>;
}

export default MarkerPage;