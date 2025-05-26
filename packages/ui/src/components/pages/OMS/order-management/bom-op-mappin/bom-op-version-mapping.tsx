import React, { useEffect, useState } from 'react';
import { Select, Card, Row, Col, Table, Tag, Form, Divider, Button } from 'antd';
import { BomItemTypeEnum, OpVersionAbstractModel, ProcessTypeEnum, SI_ManufacturingOrderInfoModel, SI_MoNumberRequest, SI_MoProductOpRmModel, MOP_OpRoutingCompsList, MOP_OpRoutingModel, MOP_OpRoutingOpsList, MOP_OpRoutingRetrievalRequest, MoConfigStatusEnum, StyleProductCodeFgColor, MOCProductFgColorVersionRequest, processTypeEnumDisplayValues } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { MoOpRoutingService, OrderCreationService, StyleProductOpService } from '@xpparel/shared-services';
import { AlertMessages } from 'packages/ui/src/components/common';
import './bom-style.css';
import { ArrowRightOutlined } from '@ant-design/icons';
interface IProcessTypeInfo {
    processType: ProcessTypeEnum;
    processOrder: number;
    depProcessType: string[];
    subProcessList: IMOP_OpRoutingSubProcessList[];
    allOperations: MOP_OpRoutingOpsList[];
    allBomInfo: IMOP_OpRoutingBomList[];
    outPut: string[];
    extraOperations: string[];
    extraProcessTypes: string[];
    isProcessTypeNotExist: boolean;

}
interface IMOP_OpRoutingSubProcessList {
    processType: ProcessTypeEnum;
    subProcessName: string;
    order: number;
    bomList: IMOP_OpRoutingBomList[];
    operations: MOP_OpRoutingOpsList[];
    dependentSubProcesses: string[];
    components?: MOP_OpRoutingCompsList[];
}
interface IMOP_OpRoutingBomList {
    bomItemCode: string;
    bomItemDesc: string;
    // itemType: RmItemTypeEnum;
    bomItemType: BomItemTypeEnum;
    isThisAPreOpOutput: boolean;
    avgCons?: number;
    seq?: number;
}

const { Option } = Select;

// Define Types for Data
interface TableData {
    itemCode: string;
    itemDesc: string;
    sequence: string;
    consumption: string;
    product: string;
}

interface SubProcessData {
    key: number;
    subProcess: string;
    components: string[];
    operations: string[];
}
interface IProps {
    productColors: StyleProductCodeFgColor;
    moNumber: string;
}


const BomOpVersionMapping: React.FC<IProps> = (props: IProps) => {

    useEffect(() => {
        getOpVersionsForStyleAndProductType(props.productColors);
        // getOrderInfoByManufacturingOrderProductCodeFgColor(props.productColors);
        getCurrentVersionForGivenProductDetail(props.moNumber, props.productColors)
    }, [props.productColors]);

    const orderService = new OrderCreationService();
    const moOpRoutingService = new MoOpRoutingService();
    const styleProductOpService = new StyleProductOpService();
    const user = useAppSelector((state) => state.user.user.user);
    const [operationVersion, setOperationVersion] = useState<OpVersionAbstractModel[]>([]);
    const [operationVersionInfo, setOperationVersionInfo] = useState<MOP_OpRoutingModel>(undefined);
    const [selectedOperationVersion, setSelectedOperationVersion] = useState<number>(null);
    const [moBom, setMoBom] = useState<SI_ManufacturingOrderInfoModel[]>([]);
    const [finalBomData, setFinalBomData] = useState<IProcessTypeInfo[]>([]);
    const [isOpVersionHavingError, setIsOpVersionHavingError] = useState<boolean>(false);
    const [form] = Form.useForm();

    // Handle select change
    const getCurrentVersionForGivenProductDetail = (moNumber: string, productInfo: StyleProductCodeFgColor) => {
        let versionId: number = undefined;
        const reqObj = new MOCProductFgColorVersionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, productInfo.styleCode, productInfo.productCode, productInfo.fgColor, productInfo.productType, moNumber);
        moOpRoutingService.getCurrentVersionForGivenProductDetail(reqObj).then(res => {
            if (res.status) {
                versionId = res.data[0]?.versionId;
            } else {
                // AlertMessages.getErrorMessage(res.internalMessage);
            }
            getOrderInfoByManufacturingOrderProductCodeFgColor(productInfo, versionId);
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };

    const getOrderInfoByManufacturingOrderProductCodeFgColor = (productColors: StyleProductCodeFgColor, versionId: number) => {
        const { productCode, fgColor } = productColors;
        const reqObj = new SI_MoNumberRequest(
            user?.userName,                  // Username of the person making the request
            user?.orgData?.unitCode,         // Unit code from the organization data
            user?.orgData?.companyCode,     // Company code from the organization data
            user?.userId,                   // User ID from the user data
            props.moNumber,                 // The Mo Number from the props (could also use moPk)
            undefined,                      // moPk is not passed in this case, as it's undefined (you can pass it instead of moNumber if needed)
            false,                          // iNeedMoAttrs: Whether MO attributes are needed (set to false here)
            false,                          // iNeedMoRm: Whether MO RM (Raw Materials) are needed (set to false here)
            true,                          // iNeedMoLines: Whether MO lines are needed (set to false here)
            false,                          // iNeedMoLineAttr: Whether MO line attributes are needed (set to false here)
            true,                          // iNeedMoProd: Whether MO product details are needed (set to false here)
            false,                           // iNeedProductRm: Whether product RM is needed (set to true here)
            true,                           // iNeedProductOps: Whether product operations are needed (set to true here)
            true,                          // iNeedProductOpRm: Whether product operation RM is needed (set to false here)
            false,                          // iNeedMoProdAttrs: Whether MO product attributes are needed (set to false here)
            true,                          // iNeedMoSubLines: Whether MO sub-lines are needed (set to false here)
            false,                          // iNeedMoSubLineAttrs: Whether MO sub-line attributes are needed (set to false here)
            productCode,                    // Optional product code (passed from elsewhere)
            fgColor                         // Optional finished goods color (passed from elsewhere)
        );
        orderService.getOrderInfoByManufacturingOrderProductCodeFgColor(reqObj).then(res => {
            if (res.status) {
                setMoBom(res.data);
                if (versionId) {
                    handleOpVersionChange(versionId, res.data);
                }
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };

    const getOpVersionsForStyleAndProductType = (productColors: StyleProductCodeFgColor) => {
        const { styleCode, productType } = productColors;
        const reqObj = new MOP_OpRoutingRetrievalRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode, productType, undefined, false, false);
        styleProductOpService.getOpVersionsForStyleAndProductType(reqObj).then(res => {
            if (res.status) {
                setOperationVersion(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };


    // Handle select change
    const handleOpVersionChange = (versionId: number, moBomInfo: SI_ManufacturingOrderInfoModel[]) => {
        setSelectedOperationVersion(versionId);
        form.setFieldsValue({ opVersion: Number(versionId) })
        const reqObj = new MOP_OpRoutingRetrievalRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.productColors.styleCode, props.productColors.productType, versionId, true, true);
        styleProductOpService.getOpVersionInfoForStyleAndProductType(reqObj).then(res => {
            if (res.status) {
                setOperationVersionInfo(res.data);
                constructData(res.data, moBomInfo);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };

    // Columns for the main data table
    const columns = [
        { title: 'Item Code', dataIndex: 'bomItemCode' },
        { title: 'Item Desc', dataIndex: 'bomItemDesc' },
        // { title: 'Sequence', dataIndex: 'seq' },
        { title: 'Consumption', dataIndex: 'avgCons' },
    ];

    // Columns for the subprocess table
    const subProcessColumns = [
        { title: 'Sub Process', dataIndex: 'subProcessName' },
        {
            title: 'Components', dataIndex: 'components',
            render: (components) => components?.map((componentObj) => <Tag key={componentObj.compName}>{componentObj.compName}</Tag>)
        },
        {
            title: 'Operations', dataIndex: 'operations',
            render: (operations) => operations.map((opn) => <Tag key={opn.opCode}>{opn.opCode}</Tag>)
        },
    ];
    const constructData = (styleBom: MOP_OpRoutingModel, moBom: SI_ManufacturingOrderInfoModel[]) => {
        let isError = false;
        const processTypesData: IProcessTypeInfo[] = [];
        const opRmInfoMap = new Map<ProcessTypeEnum, SI_MoProductOpRmModel[]>();
        const moProcessTypeOPMap = new Map<ProcessTypeEnum, string[]>();
        moBom.forEach(manufacturingOrObj => {
            manufacturingOrObj.moLineModel.forEach(moLineObj => {
                moLineObj.moLineProducts.forEach(lineProd => lineProd.opRmInfo.forEach(opRmInfoObj => {
                    if (!opRmInfoMap.has(opRmInfoObj.processType)) {
                        opRmInfoMap.set(opRmInfoObj.processType, []);
                    }
                    opRmInfoMap.get(opRmInfoObj.processType).push(opRmInfoObj);
                    if (!moProcessTypeOPMap.has(opRmInfoObj.processType)) {
                        moProcessTypeOPMap.set(opRmInfoObj.processType, []);
                    }
                    moProcessTypeOPMap.get(opRmInfoObj.processType).push(opRmInfoObj.opCode);
                }));
            });
        });

        const styleOpBomProcessTypes: string[] = [];
        // Style Product version data
        styleBom.processTypesList.forEach(processTypesObj => {
            styleOpBomProcessTypes.push(processTypesObj.processType);
            const allBomsMap = new Map<string, IMOP_OpRoutingBomList>();
            const allOperationsMap = new Map<string, MOP_OpRoutingOpsList>();

            (opRmInfoMap.has(processTypesObj.processType) ? opRmInfoMap.get(processTypesObj.processType) : []).forEach(bom => {
                const bomData: IMOP_OpRoutingBomList = {
                    bomItemCode: bom.bomInfo.itemCode,
                    bomItemDesc: bom.bomInfo.itemDesc,
                    bomItemType: BomItemTypeEnum.PANEL,
                    isThisAPreOpOutput: false,
                    avgCons: bom.bomInfo.avgCons,
                    seq: bom.bomInfo.seq
                }
                allBomsMap.set(bom.bomInfo.itemCode, bomData);
            });
            const outPutSkus: string[] = [];
            processTypesObj.subProcessList.forEach(s => {
                s.bomList.forEach(b => allBomsMap.set(b.bomItemCode, b))
                s.operations.forEach(opObj => {
                    allOperationsMap.set(opObj.opCode, opObj)
                });
                //Output Sku
                outPutSkus.push(s.outPutSku)
            });
            const extraOperationsSet = new Set<string>();
            (moProcessTypeOPMap.has(processTypesObj.processType) ? moProcessTypeOPMap.get(processTypesObj.processType) : []).forEach(opCode => {
                if (!allOperationsMap.has(opCode)) {
                    extraOperationsSet.add(opCode);
                }
            });

            const extraOperations = Array.from(extraOperationsSet.values());
            if (extraOperations.length > 0) {
                isError = true;
            }

            const processTypeObj: IProcessTypeInfo = {
                allOperations: Array.from(allOperationsMap.values()),
                depProcessType: processTypesObj.depProcessType,
                processOrder: processTypesObj.processOrder,
                processType: processTypesObj.processType,
                subProcessList: processTypesObj.subProcessList,
                allBomInfo: Array.from(allBomsMap.values()),
                outPut: outPutSkus,
                extraOperations: extraOperations,
                extraProcessTypes: [],
                isProcessTypeNotExist: false
            }
            processTypesData.push(processTypeObj);
        });

        // Validate the MO Process types available in Selected Style product Operation version
        Array.from(moProcessTypeOPMap.keys()).forEach(processType => {
            if (!styleOpBomProcessTypes.includes(processType)) {
                const moBomProcessTypeOperations = moProcessTypeOPMap.has(processType) ? moProcessTypeOPMap.get(processType) : [];
                const allBomsMap = new Map<string, IMOP_OpRoutingBomList>();

                (opRmInfoMap.has(processType) ? opRmInfoMap.get(processType) : []).forEach(bom => {
                    const bomData: IMOP_OpRoutingBomList = {
                        bomItemCode: bom.bomInfo?.itemCode,
                        bomItemDesc: bom.bomInfo?.itemDesc,
                        bomItemType: BomItemTypeEnum.PANEL,
                        isThisAPreOpOutput: false,
                        avgCons: bom.bomInfo?.avgCons,
                        seq: bom.bomInfo?.seq
                    }
                    allBomsMap.set(bomData.bomItemCode, bomData);
                });

                isError = true;
                // Process type available in MO bom but not available in Selected Operation version
                const processTypeObj: IProcessTypeInfo = {
                    allOperations: [],
                    depProcessType: null,
                    processOrder: null,
                    processType: processType,
                    subProcessList: null,
                    allBomInfo: Array.from(allBomsMap.values()),
                    outPut: [],
                    extraOperations: Array.from(new Set([...moBomProcessTypeOperations]).values()),
                    extraProcessTypes: [processType],
                    isProcessTypeNotExist: true
                }
                processTypesData.push(processTypeObj);
            }
        });
        setFinalBomData(processTypesData);
        setIsOpVersionHavingError(isError);
    }
    const mapVersion = () => {
        const reqObj = new MOCProductFgColorVersionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedOperationVersion, props.productColors.styleCode, props.productColors.productCode, props.productColors.fgColor, props.productColors.productType, props.moNumber);
        moOpRoutingService.saveOpVersionForMoProductFgColor(reqObj).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    }
    const renderErrorsElements = (isOperationsNotExist: boolean, isProcessTypeNotExist: boolean) => {
        return <>
            {isProcessTypeNotExist ? <span className='blinking-text color-white'>Process Type Not Exist</span>
                : isOperationsNotExist && <span className='blinking-text color-white'>Operations Not Exist</span>}
        </>
    }
    let isGreen = true;
    return (
        <div>
            <Form name="form" layout="inline" form={form}>
                <Form.Item name="opVersion" label="Select Operation Version" rules={[{ required: true }]}>
                    <Select
                        style={{ width: 200 }}
                        onChange={e => handleOpVersionChange(e, moBom)}
                        placeholder="Select Operation Version"
                        showSearch
                        filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                    >
                        {operationVersion.map((operationObj, index) => (
                            <Option key={operationObj.versionId} value={operationObj.versionId}>{operationObj.versionName + "-" + operationObj.versionDescription}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button onClick={mapVersion} type='primary' className='btn-green' disabled={!selectedOperationVersion || isOpVersionHavingError || props?.productColors?.isMoConfirmed}> Save </Button>
                </Form.Item>

            </Form>

            <Divider>Process Overview</Divider>
            <Row style={{ marginTop: 20, overflowX: 'auto' }}>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        padding: '10px 0',
                        overflowX: 'auto',
                        scrollbarWidth: 'thin',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {finalBomData.map((bomObj, index) => {
                        isGreen = !isGreen;
                        return (
                            <div
                                key={bomObj.processType}
                                style={{
                                    display: 'flex',
                                    alignItems: 'stretch',
                                    flexShrink: 0,
                                }}
                            >
                                <Card
                                    size="small"
                                    className={isGreen ? 'bom-card bom-bg-chocolate' : 'bom-card bom-bg-cadetblue'}
                                    title={processTypeEnumDisplayValues[bomObj.processType]}
                                    headStyle={{ textAlign: 'center', color: 'white' }}
                                    bordered={false}
                                    style={{
                                        width: 200,
                                        color: 'black',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1,
                                    }}
                                    extra={
                                        <div
                                            style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                backgroundColor: 'white',
                                                color: 'black',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 12,
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                    }
                                >
                                    <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <div>
                                            <strong>Operations:</strong> {bomObj.allOperations.map((op) => op.opCode).join(', ')}
                                        </div>
                                        <div>
                                            <strong>Sub Process:</strong> {bomObj.subProcessList.map((sp) => sp.subProcessName).join(', ')}
                                        </div>
                                        <div>
                                            <strong>InputSku Count:</strong> {bomObj.allBomInfo.length}
                                        </div>
                                        <div>
                                            <strong>OutputSku Count:</strong> {bomObj.outPut.length}
                                        </div>
                                    </div>
                                </Card>

                                {index < finalBomData.length - 1 && (
                                    <ArrowRightOutlined
                                        className="animated-arrow"
                                        style={{
                                            fontSize: 24,
                                            margin: '0 10px',
                                            color: '#999',
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </Row>

            {/* Cards based on selected operation */}
            <Row gutter={16} style={{ marginTop: 20 }}>

                {finalBomData.map((bomObj, index) => (
                    <Col xs={24} md={12} key={bomObj.processType}>
                        <Card size='small' className={(bomObj.extraOperations.length > 0 || bomObj.extraProcessTypes.length > 0) ? 'bom-card bom-bg-red' : 'bom-card bom-bg-green'}
                            title={processTypeEnumDisplayValues[bomObj.processType]} bordered={false} style={{ marginBottom: '10px' }} extra={<>{renderErrorsElements(bomObj.extraOperations.length > 0, bomObj.extraProcessTypes.length > 0)}

                                <div style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    color: 'black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 12,
                                }}>
                                    {index + 1}
                                </div></>}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                <span>Operations: </span>
                                {bomObj.allOperations.map(opObj => <Tag color="#87d068">{`${opObj.opCode}-${opObj.opName}`}</Tag>)}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <span>Extra Operations: </span>
                                {bomObj.extraOperations.map(opObj => <Tag color="red">{`${opObj}`}</Tag>)}
                            </div>
                            <Table
                                size='small' bordered
                                dataSource={bomObj.subProcessList}
                                pagination={false}
                                columns={subProcessColumns}
                                style={{ marginTop: 20 }}
                            />
                            <Divider>Input</Divider>
                            <Table className='bom-tbl'
                                size='small' bordered
                                dataSource={bomObj.allBomInfo}
                                pagination={false}
                                columns={columns}
                                style={{ marginTop: 20 }}
                            />
                            <Divider>Output</Divider>
                            {bomObj.outPut.map(oSku => <Tag>{oSku}</Tag>)}
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default BomOpVersionMapping;