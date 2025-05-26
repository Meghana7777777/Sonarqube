import { CommonRequestAttrs, KG_KnitGroupMaterialRequirementModel, KG_MaterialRequirementForKitGroupRequest, KJ_MaterialStatusEnum, PO_StyleInfoModel, ProcessingOrderInfoModel, ProcessingSerialProdCodeRequest, ProductInfoModel, StyleCodeRequest, StyleProductCodeRequest } from '@xpparel/shared-models';
import { KnittingJobMaterialAllocationService, KnittingJobsService } from '@xpparel/shared-services';
import { Button, Card, Col, Form, Modal, Row, Select, Space } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import {
    KC_KnitOrderJobsModel
} from 'packages/libs/shared-models/src/kms/knit-job.models';
import { ProcessTypeEnum } from 'packages/libs/shared-models/src/oms/enum';
import { KnitOrderService } from 'packages/libs/shared-services/src/kms/knitting-management/knit-order.service';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import { getCssFromComponent } from '../../WMS';
import { KnitJobSheet } from '../knit-job-sheet';
import { IKnitJobSummary } from './knit-material-interface';
import KnitTabsMain from './knit-material-tabs';
import MaterialSelectionTab from './material-selection-grid';





const { Option } = Select;

const MaterialAllocationForKnitJob = () => {
    const [styles, setStyles] = useState<PO_StyleInfoModel[]>([]);
    const [products, setProducts] = useState<ProductInfoModel[]>([]);
    const [processingOrders, setProcessingOrders] = useState<ProcessingOrderInfoModel[]>([]);
    const [selectedStyleCode, setSelectedStyleCode] = useState<string>(undefined);
    const [selectedProductCode, setSelectedProductCode] = useState<string | null>(null);
    const [selectedProcessingSerial, setSelectedProcessingSerial] = useState<number | null>(null);

    const [knitTableData, setKnitTableData] = useState<IKnitJobSummary[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [selectedKnitGroupsForModal, setSelectedKnitGroupsForModal] = useState<string[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRowData, setSelectedRowData] = useState<IKnitJobSummary[]>([]);
    const [selectedPoName, setSelectedPoName] = useState<string>('');
    const [materialsData, setMaterialsData] = useState<KG_KnitGroupMaterialRequirementModel[]>([]);
    const knitOrderService = new KnitOrderService();
    const knitJobService = new KnittingJobsService();
    const knitMaterialService = new KnittingJobMaterialAllocationService();
    const user = useAppSelector((state) => state.user.user.user);
    const [selectedJobNumber, setSelectedJobNumber] = useState<string | null>(null);
    const [isJobSheetModalVisible, setIsJobSheetModalModalVisible] = useState(false);
    const [searchTrigger, setSearchTrigger] = useState<number>(0);
    const [resetTrigger, setResetTrigger] = useState<number>(0);
    const [activeKey, setActiveKey] = useState('1');


    useEffect(() => {
        fetchStyles();
    }, [])

    useEffect(()=>{
        onReset()        
    },[activeKey])

    const fetchStyles = async () => {
        try {
            const request = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
            const response = await knitOrderService.getKnitOrderCreatedStyles(request);
            if (!response.status) {
                AlertMessages.getErrorMessage(response.internalMessage);
            }
            setStyles(response.data || []);
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
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
            const response = await knitOrderService.getProductInfoForGivenStyle(request);
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

    const handleKeyChange = (newKey) => {
        setActiveKey(newKey);
    };

    const fetchProcessingOrders = async (productCode: string) => {
        if (!selectedStyleCode || !productCode) {
            setProcessingOrders([]);
            return;
        }
        try {
            const request = new StyleProductCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedStyleCode, productCode);
            const response = await knitOrderService.getKnitOrderInfoByStyeAndProduct(request);
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
    }
    const handleProductChange = (value: string) => {
        setSelectedProductCode(value);
        setSelectedProcessingSerial(null);
        fetchProcessingOrders(value)
    };

    const handleProcessingOrderChange = (value: number, obj) => {
        setSelectedProcessingSerial(value);
        setSelectedPoName(obj.children)
    }




    const handleRequest = () => {
        if (selectedRowKeys.length < 1) {
            AlertMessages.getErrorMessage("Please select Job Numbers")
            return
        }
        const req = new KG_MaterialRequirementForKitGroupRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedProcessingSerial, ProcessTypeEnum.KNIT, undefined, selectedRowKeys, true);
        knitMaterialService.getMaterialRequirementForGivenKnitGroup(req).then(res => {
            if (res.status) {
                setIsModalVisible(true);
                setMaterialsData(res.data);
                setSelectedKnitGroupsForModal(res.data.map(e => e.knitGroup))
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })


    };



    const getKnitData = async () => {
        try {
            setSearchTrigger(prev => prev + 1);
            if (activeKey === '1') {
                setKnitTableData([]);
                if (!selectedProcessingSerial || !selectedProductCode) {
                    AlertMessages.getInfoMessage("Please select style, product and processing serial");
                    return
                }
                const request = new ProcessingSerialProdCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedProcessingSerial, ProcessTypeEnum.KNIT, selectedProductCode, undefined, true, true, false, true);
                const response = await knitJobService.getKnitJobsByPoAndProductCode(request);
                if (!response.status) {
                    AlertMessages.getErrorMessage(response.internalMessage);
                    return
                }
                constructData(response.data);
            }
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
        }


    }
    const constructData = (jobsData: KC_KnitOrderJobsModel[]) => {
        if (jobsData.length === 0) {
            setKnitTableData([]);
            return
        }
        let sno = 1;
        const newData = jobsData.flatMap((group, index) =>
            group.knitJobs.map((job, jobIndex) => {
                const row: IKnitJobSummary = {
                    sno: sno++,
                    productCode: selectedProductCode,
                    mo: job.jobFeatures.moNumber,
                    knitGroup: group.knitGroup,
                    component: Array.from(
                        new Set(
                            job.jobRm?.flatMap(rm => rm.componentNames || [])
                        )
                    ).join(", ") || "-",
                    itemCodes: job.jobRm.map((rm) => rm.itemCode).join(", "),
                    knitJobNumber: job.jobNumber,
                    sizeAndQty: job.colorSizeInfo?.[0].sizeQtys,
                    totalQty: job.colorSizeInfo?.[0].sizeQtys.reduce((sum, sizeInfo) => sum + sizeInfo.qty, 0),
                    materialStatus: job.materialStatus
                }
                return row;
            })
        );

        setKnitTableData(newData);
    };


    const onSelectChange = (newSelectedRowKeys: string[], selectedRows: IKnitJobSummary[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRowData(selectedRows);
    };
    const rowSelection: TableRowSelection<IKnitJobSummary> = {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record: IKnitJobSummary) => ({
            disabled: record.materialStatus != KJ_MaterialStatusEnum.OPEN
        }),

    };

    const onReset = () => {
        setSelectedStyleCode(null);
        setSelectedProductCode(null);
        setSelectedProcessingSerial(null);
        setKnitTableData([]);
        setResetTrigger(prev => prev + 1);

    }
    const closeModal = (isReload: boolean = false) => {
        setIsModalVisible(false);
        if (isReload) {
            setSelectedRowKeys([]);
            setSelectedRowData([]);
            getKnitData();
        }
    }

    const handleView = (jobNumber: string) => {
        setSelectedJobNumber(jobNumber);
        setIsJobSheetModalModalVisible(true);
    };

    const closeJobSheetModal = () => {
        setSelectedJobNumber(null);
        setIsJobSheetModalModalVisible(false);
    }

    const printJobSheet = () => {
        const divContents = document.getElementById('printArea').innerHTML;
        const element = window.open('', '', 'height=700, width=1024');
        element.document.write(divContents);
        getCssFromComponent(document, element.document);
        element.document.close();
        // Loading image lazy
        setTimeout(() => {
            element.print();
            element.close();
        }, 1000);
    }




    return (
        <div>
            <Card size='small' title='Knit Job RM Request'>
                <Form layout="horizontal" >
                    <Row gutter={[16, 16]} align={'stretch'} style={{marginTop: '20px'}}>
                        <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                            <Form.Item
                                label="Style"
                                required
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
                                required
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
                                required
                                rules={[{ required: true, message: "Please select processing order" }]}
                            >
                                <Select
                                    placeholder="Select Processing Order"
                                    showSearch
                                    onChange={handleProcessingOrderChange}
                                    value={selectedProcessingSerial}
                                >
                                    {processingOrders.map((order) => (
                                        <Option key={order.processingSerial} value={order.processingSerial}>
                                            {order.prcOrdDescription}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                         <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                            <Form.Item>
                                <Space>
                                    <Button type="primary" onClick={getKnitData}>
                                        Search
                                    </Button>
                                    <Button onClick={onReset} danger>
                                        Reset
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>


                {/* <Table size="small" columns={knitMaterialJobsSheetColumns(handleView)} dataSource={knitTableData} bordered rowKey={record => record.knitJobNumber} pagination={false} scroll={{ x: true, y: 300 }} rowSelection={rowSelection} /> */}

                <KnitTabsMain knitTableData={knitTableData} handleView={handleView} rowSelection={rowSelection} handleRequest={handleRequest} selectedProcessingSerial={selectedProcessingSerial} searchTrigger={searchTrigger} handleKeyChange={handleKeyChange} resetTrigger={resetTrigger} />


                {/* <div style={{ display: "flex", justifyContent: "center", marginTop: "8px", }} >
                    <Button type='primary' className='btn-orange' onClick={handleRequest} > Request </Button>
                </div> */}
            </Card>
            <Modal
                title={`Request Materials`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={'100%'}
                style={{ top: '0' }}
                destroyOnClose
                maskClosable={false}
            >
                <MaterialSelectionTab closeModal={e => closeModal(e)} knitGroups={selectedKnitGroupsForModal} materialsData={materialsData} poName={selectedPoName} poSerial={selectedProcessingSerial} productCode={selectedProductCode} selectedJobs={selectedRowKeys} style={selectedStyleCode} knitTableData={selectedRowData} />
            </Modal>

            {/* {submittedData && (
                    <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
                        <h3>Submitted Data:</h3>
                        <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                    </div>
                )} */}
            <Modal
                title={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Job Sheet Details</span>
                    <Button style={{ marginRight: '20px' }} type='primary' size='small' onClick={printJobSheet}>Print</Button>
                </div>}
                open={isJobSheetModalVisible}
                onCancel={() => setIsJobSheetModalModalVisible(false)}
                footer={null}
                width={'100%'}
                style={{ top: '0' }}
                destroyOnClose
                maskClosable={false}>
                <KnitJobSheet jobNumber={selectedJobNumber} />
            </Modal>
        </div>
    )
}

export default MaterialAllocationForKnitJob
