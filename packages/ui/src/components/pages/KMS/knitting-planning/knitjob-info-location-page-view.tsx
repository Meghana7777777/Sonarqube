import { Select, Button, Drawer, Table, Card, Row, Col, Modal, Checkbox, Descriptions, Form, FloatButton } from 'antd';
import { useState, useEffect } from 'react';
import { CommonRequestAttrs, PO_StyleInfoModel, StyleCodeRequest, ProductInfoModel, ProcessingOrderInfoModel, ProcessingSerialProdCodeRequest, ProcessTypeEnum, KJ_LocationKnitJobsModel, ModuleModel, StyleProductCodeRequest, KJ_locationCodeRequest, KC_KnitOrderJobsModel, GbDepartmentReqDto, DepartmentTypeEnumForMasters, GetAllDepartmentsResDto, GbSectionReqDto, GetAllSectionsResDto, GbGetAllLocationsDto, GBLocationRequest, GBSectionRequest } from '@xpparel/shared-models';
import { GbConfigHelperService, KnitOrderService, KnittingJobPlanningService, KnittingJobsService } from '@xpparel/shared-services';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from '../../../common';
import KnitJobPlanningGrid from './knit-job-planning-grid';
import KnitLocation from './knit-location';
import KnitJobLegend from './knit-job-legends';

const { Option } = Select;
const KnitJobReporting = () => {
    const [styles, setStyles] = useState<PO_StyleInfoModel[]>([]);
    const [products, setProducts] = useState<ProductInfoModel[]>([]);
    const [processingOrders, setProcessingOrders] = useState<ProcessingOrderInfoModel[]>([]);
    const [selectedStyleCode, setSelectedStyleCode] = useState<string | null>(null);
    const [selectedProductCode, setSelectedProductCode] = useState<string | null>(null);
    const [selectedProcessingSerial, setSelectedProcessingSerial] = useState<number | null>(null);
    const [selectedProcessName, setSelectedProcessName] = useState<string>('');
    const [knitJobs, setKnitJobs] = useState<KC_KnitOrderJobsModel[]>([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [departments, setDepartments] = useState<GetAllDepartmentsResDto[]>([]);
    const [sections, setSections] = useState<GetAllSectionsResDto[]>([]);
    const [locations, setLocations] = useState<GbGetAllLocationsDto[]>([]);
    const [updateKey, setUpdateKey] = useState<number>(0)
    const apiService = new KnitOrderService();
    const knitService = new KnittingJobsService();
    const gbConfigHelperService = new GbConfigHelperService();
    const user = useAppSelector((state) => state.user.user.user);


    useEffect(() => {
        getDepartments();
        fetchStyles();
    }, [])

    const getDepartments = async () => {
        try {
            const request = new GbDepartmentReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [], DepartmentTypeEnumForMasters.KNITTING);
            const response = await gbConfigHelperService.getAllDepartmentsFromGbC(request);
            if (response.status) {
                setDepartments(response.data);
                getSections(response.data.map(e => e.DepartmentId))
            } else {
                AlertMessages.getErrorMessage(response.internalMessage);
            }
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
        }
    };

    const getSections = async (departments: number[]) => {
        try {
            const request = new GBSectionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, departments, [], DepartmentTypeEnumForMasters.KNITTING);
            const response = await gbConfigHelperService.getAllSectionsByDepartmentsFromGbC(request);
            if (response.status) {
                setSections(response.data);
                getLocations(response.data.map(e => e.secCode));
            } else {
                AlertMessages.getErrorMessage(response.internalMessage);
            }
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
        }
    }
    const getLocations = async (sectionIds: string[]) => {
        try {
            const request = new GBLocationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, sectionIds);
            const response = await gbConfigHelperService.getAllLocationsByDeptAndSectionsFromGbC(request);
            if (response.status) {
                setLocations(response.data);
            } else {
                AlertMessages.getErrorMessage(response.internalMessage);
            }
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
        }
    }


    const fetchStyles = async () => {
        try {
            const request = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
            const response = await apiService.getKnitOrderCreatedStyles(request);
            if (!response.status) {
                AlertMessages.getErrorMessage(response.internalMessage);
            }
            setStyles(response.data || []);
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
            setStyles([]);
        }
    };


    const fetchProducts = async (styleCode: string) => {
        if (!styleCode) {
            setProducts([]);
            setProcessingOrders([]);
            return;
        }
        try {
            const request = new StyleCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode);
            const response = await apiService.getProductInfoForGivenStyle(request);
            if (!response.status) {
                AlertMessages.getErrorMessage(response.internalMessage);
            }
            setProducts(response.data || []);
            setProcessingOrders([]);
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
            setProducts([]);
            setProcessingOrders([]);
        }
    };


    const fetchProcessingOrders = async (productCode: string) => {
        if (!selectedStyleCode || !productCode) {
            setProcessingOrders([]);
            return;
        }
        try {
            const request = new StyleProductCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedStyleCode, productCode);
            const response = await apiService.getKnitOrderInfoByStyeAndProduct(request);
            if (!response.status) {
                AlertMessages.getErrorMessage(response.internalMessage);
            }
            setProcessingOrders(response.data || []);
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
            setProcessingOrders([]);
        }
    };



    const handleStyleChange = (value: string) => {
        setSelectedStyleCode(value);
        setSelectedProductCode(null);
        setSelectedProcessingSerial(null);
        fetchProducts(value);
    };

    const handleProductChange = (value: string) => {
        setSelectedProductCode(value);
        setSelectedProcessingSerial(null);
        fetchProcessingOrders(value)
    };

    const handleProcessingOrderChange = (value: number) => {
        setSelectedProcessingSerial(value);
    };

    const handleSearch = async () => {
        if (!selectedProcessingSerial || !selectedProductCode) {
            AlertMessages.getErrorMessage('Product Code and Processing Order are required.');
            return;
        }
        try {
            const request = new ProcessingSerialProdCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedProcessingSerial, ProcessTypeEnum.KNIT, selectedProductCode, undefined, true, false, false, false);
            const response = await knitService.getKnitJobsByPoAndProductCode(request);
            if (response.status) {
                const knitJobsData = response.data || [];
                setKnitJobs(knitJobsData);
                setDrawerVisible(true);
                const obj = processingOrders.find(e => e.processingSerial == selectedProcessingSerial);
                setSelectedProcessName(obj ? obj.prcOrdDescription : '');
            } else {
                AlertMessages.getErrorMessage(response.internalMessage)
            }
        } catch (error) {
            AlertMessages.getErrorMessage(error.message)
            setKnitJobs([]);
            setDrawerVisible(true);
        }
    };

    const onCloseDrawer = (isReload: boolean = false) => {
        setDrawerVisible(false);
        if (isReload) {
            setUpdateKey(pre => pre + 1);
        }
    };

    const onReset = () => {
        setSelectedStyleCode(null)
        setSelectedProductCode(null)
        setSelectedProcessingSerial(null)
    }


    return (
        <>
            <Card title="Knit Job Planning & Report" size="small" style={{ marginBottom: '20px' }}>
                <Form layout="horizontal" >
                    <Row gutter={[16, 16]} align={'stretch'} style={{marginTop: '20px'}}>
                       <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                            <Form.Item
                                label="Style"
                                name="style"
                                rules={[{ required: true, message: "Please select style code" }]}
                            >
                                <Select
                                    placeholder="Select Style"
                                    showSearch
                                    onChange={handleStyleChange}
                                    value={selectedStyleCode}
                                >
                                    {styles.map((style) => (
                                        <Option key={style.styleCode} value={style.styleCode}>
                                            {`${style.styleCode} - ${style.styleName}`}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                       <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                            <Form.Item
                                label="Product Code"
                                name="productCode"
                                rules={[{ required: true, message: "Please select product code" }]}
                            >
                                <Select
                                    placeholder="Select Product Code"
                                    showSearch
                                    onChange={handleProductChange}
                                    value={selectedProductCode}
                                >
                                    {products.map((product) => (
                                        <Option key={product.productCode} value={product.productCode}>
                                            {`${product.productCode} - ${product.productName}`}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                       <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                            <Form.Item
                                label="Processing Order"
                                name="processingOrder"
                                rules={[{ required: true, message: "Please select processing order" }]}
                            >
                                <Select
                                    placeholder="Select Processing Order"
                                    showSearch
                                    onChange={handleProcessingOrderChange}
                                    value={selectedProcessingSerial}
                                    filterOption={(input, option) => (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())}
                                >
                                    {processingOrders.map((order) => (
                                        <Option key={order.processingSerial} value={order.processingSerial}>
                                            {`${order.processingSerial} - ${order.prcOrdDescription}`}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                                    <Button type="primary" onClick={handleSearch} style={{ minWidth: 100 }}>
                                        Search
                                    </Button>
                                    <Button onClick={onReset} danger style={{ minWidth: 100 }}>
                                        Reset
                                    </Button>
                                </div>
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Card>


            <KnitJobLegend />
            <Row gutter={[12, 12]} style={{ marginBottom: '20px' }}>
                {
                    locations.map(locationObj => <KnitLocation updateKey={updateKey + 1} location={locationObj} />)
                }
            </Row>
            <FloatButton.BackTop />
            <Drawer
                title="Knit Jobs"
                placement="right"
                onClose={() => onCloseDrawer()}
                open={drawerVisible}
                width={2500}
            >
                {drawerVisible &&
                    <KnitJobPlanningGrid locations={locations} closeModal={onCloseDrawer} processingName={selectedProcessName} knitJobs={knitJobs} poSerial={selectedProcessingSerial} productCode={selectedProductCode} style={selectedStyleCode} />
                }
            </Drawer>
        </>
    );
};

export default KnitJobReporting;