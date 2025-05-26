import React, { useEffect, useState } from 'react';
import { Select, Card, Row, Col, Table, Tag, Form, Divider, Button, Modal, Typography, Tooltip } from 'antd';
import { BomItemTypeEnum, OpVersionAbstractModel, ProcessTypeEnum, SI_ManufacturingOrderInfoModel, SI_MoNumberRequest, SI_MoProductOpRmModel, MOC_MoBOMCreationRequest, MOC_MoProcessTypeBomModel, MOC_MoProcessTypesBomModel, MOC_MoSubProcessTypesBomModel, MOP_OpRoutingCompsList, MOP_OpRoutingModel, MOP_OpRoutingOpsList, MOP_OpRoutingRetrievalRequest, MoConfigStatusEnum, StyleProductCodeFgColor, processTypeEnumDisplayValues, MOCProductFgColorVersionRequest, MOC_OpRoutingRetrievalRequest, MOC_OpRoutingModel, PhItemCategoryEnum } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { OrderCreationService, MOConfigService, StyleProductOpService, MoOpRoutingService } from '@xpparel/shared-services';
import { AlertMessages } from 'packages/ui/src/components/common';
import './bom-style.css';
import { ColumnProps, TableProps } from 'antd/es/table';
import BomSelectionModal from './bom-selection-modal';
import { IProcessTypeInfo, ISelectedSubProcess, IMOP_OpRoutingSubProcessList, IMOP_OpRoutingBomList } from './bom-op-interface';
import { ArrowRightOutlined } from '@ant-design/icons';

interface IProps {
    productColors: StyleProductCodeFgColor;
    moNumber: string;
}

const { Title } = Typography;
const BomSpVersionMapping: React.FC<IProps> = (props: IProps) => {
    const { productColors, moNumber } = props;
    useEffect(() => {
        getOpVersionForMoProductFgColor(productColors, moNumber)
    }, [props.productColors]);

    const orderService = new OrderCreationService();
    const styleProductOpService = new StyleProductOpService();
    const moOpRoutingService = new MoOpRoutingService();
    const moConfigService = new MOConfigService();
    const user = useAppSelector((state) => state.user.user.user);
    const [operationVersionInfo, setOperationVersionInfo] = useState<MOC_OpRoutingModel>(undefined);
    const [selectedOperation, setSelectedOperation] = useState<number | null>(null);
    const [moBom, setMoBom] = useState<SI_ManufacturingOrderInfoModel[]>([]);
    const [finalBomData, setFinalBomData] = useState<IProcessTypeInfo[]>([]);
    const [visible, setVisible] = useState(false);
    const [selectedSubProcessData, setSelectedSubProcessData] = useState<ISelectedSubProcess>(undefined);

    const getOpVersionForMoProductFgColor = (productInfo: StyleProductCodeFgColor, moNumber: string) => {
        const { productCode, fgColor, styleCode, productType } = productInfo;
        const reqObj = new MOC_OpRoutingRetrievalRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moNumber, styleCode, productCode, fgColor, true, true);
        moOpRoutingService.getOpVersionForMoProductFgColor(reqObj).then(res => {
            if (res.status) {
                setOperationVersionInfo(res.data[0]);
                getOrderInfoByManufacturingOrderProductCodeFgColor(props.productColors, res.data[0]);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };

    const getOrderInfoByManufacturingOrderProductCodeFgColor = (productColors: StyleProductCodeFgColor, opVersionData: MOC_OpRoutingModel) => {
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
                constructData(opVersionData, res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };


    const handleCancel = () => {
        setVisible(false);
    };



    // Columns for the main data table
    const columns = [
        { title: 'Item Code', dataIndex: 'bomItemCode' },
        { title: 'Item Desc', dataIndex: 'bomItemDesc' },
        { title: 'Sequence', dataIndex: 'sequence' },
        { title: 'Consumption', dataIndex: 'consumption' },
    ];

    // Columns for the subprocess table
    const subProcessColumns: TableProps<IMOP_OpRoutingSubProcessList>['columns'] = [
        { title: 'Sub Process', dataIndex: 'subProcessName' },
        {
            title: 'Components', dataIndex: 'components',
            render: (components) => components?.map((componentObj) => <Tag key={componentObj.compName}>{componentObj.compName}</Tag>)
        },
        {
            title: 'Operations', dataIndex: 'operations',
            render: (operations) => operations.map((opn) => <Tag key={opn.opCode}>{opn.opCode}</Tag>)
        },
        {
            title: 'Selected BOM', dataIndex: 'selectedBom', render: (v: IMOP_OpRoutingBomList[]) => <ul>{v.map(b => <li>{b.bomItemCode}</li>)}</ul>
        },
        {
            title: 'Update BOM', render: (_, record, index) => <Button size='small' className='btn-orange'
                type='primary' onClick={() => updateBomInfo(record.processType, record.subProcessName, index)} >Update Bom</Button>
        }
    ];
    const updateBomInfo = (processType: ProcessTypeEnum, selectedSubProcess: string, index: number) => {
        const { allBomInfo, subProcessList } = finalBomData.find(e => e.processType == processType);
        const subProcessInfo = subProcessList.find(e => e.subProcessName == selectedSubProcess);
        console.log(allBomInfo.filter(e => (e.subProcessName === selectedSubProcess && e.isThisAPreOpOutput) || (!e.isThisAPreOpOutput)))
        const selectedSubProcessInfo: ISelectedSubProcess = {
            bomList: allBomInfo.filter(e => (e.subProcessName === selectedSubProcess && e.isThisAPreOpOutput) || (!e.isThisAPreOpOutput)),
            index,
            processType,
            processTypeName: processTypeEnumDisplayValues[processType],
            subProcessList: subProcessInfo
        }
        setSelectedSubProcessData(selectedSubProcessInfo);
        setVisible(true);
    }
    const constructData = (styleBom: MOC_OpRoutingModel, moBom: SI_ManufacturingOrderInfoModel[]) => {
        const processTypesData: IProcessTypeInfo[] = [];
        const opRmInfoMap = new Map<ProcessTypeEnum, SI_MoProductOpRmModel[]>();
        const moProcessTypeOPMap = new Map<ProcessTypeEnum, string[]>();
        // manufacturing order Bom Info
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

            // Get manufacturing order Bom Info
            (opRmInfoMap.has(processTypesObj.processType) ? opRmInfoMap.get(processTypesObj.processType) : []).forEach(bom => {
                const bomData: IMOP_OpRoutingBomList = {
                    bomItemCode: bom.bomInfo.itemCode,
                    bomItemDesc: bom.bomInfo.itemDesc,
                    bomItemType: BomItemTypeEnum.RM,
                    isThisAPreOpOutput: false,
                    itemType: bom.bomInfo.itemType,
                    avgCons: bom.bomInfo.avgCons,
                    seq: bom.bomInfo.seq,
                    subProcessName: undefined
                }
                console.log(bomData)
                allBomsMap.set(bom.bomInfo.itemCode, bomData);
            });
            const outPutSkus: string[] = [];
            processTypesObj.subProcessList.forEach(s => {
                s.bomList.forEach(b => allBomsMap.set(b.bomItemCode, { ...b, subProcessName: s.subProcessName }))
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
            const extraProcessTypes: string[] = [];
            const subProcessList = processTypesObj.subProcessList.map(subProcessListObj => {
                const bomList: IMOP_OpRoutingBomList[] = subProcessListObj.bomList.map(e => ({ ...e, subProcessName: subProcessListObj.subProcessName }))
                const subProcesses = subProcessListObj.dependentSubProcesses.map(dep => dep.subProcessName);
                const updatedObj: IMOP_OpRoutingSubProcessList = { ...subProcessListObj, dependentSubProcesses: subProcesses, selectedBom: bomList }
                return updatedObj;
            })
            const processTypeObj: IProcessTypeInfo = {
                allOperations: Array.from(allOperationsMap.values()),
                depProcessType: processTypesObj.depProcessType,
                processOrder: processTypesObj.procesMorder,
                processType: processTypesObj.processType,
                subProcessList: subProcessList,
                allBomInfo: Array.from(allBomsMap.values()),
                outPut: outPutSkus,
                extraOperations: Array.from(extraOperationsSet.values()),
                extraProcessTypes: extraProcessTypes,
                isProcessTypeNotExist: false,
                outputFgSku: processTypesObj.outputFgSku

            }
            console.log(Array.from(allBomsMap.values()))
            processTypesData.push(processTypeObj);
        });
        // Validate the mo Process types available in Selected Style product Operation version
        Array.from(moProcessTypeOPMap.keys()).forEach(processType => {
            if (!styleOpBomProcessTypes.includes(processType)) {
                // Process type available in mo bom but not available in Selected Operation version
                const moBomProcessTypeOperations = moProcessTypeOPMap.has(processType) ? moProcessTypeOPMap.get(processType) : [];
                const allBomsMap = new Map<string, IMOP_OpRoutingBomList>();
                (opRmInfoMap.has(processType) ? opRmInfoMap.get(processType) : []).forEach(bom => {
                    const bomData: IMOP_OpRoutingBomList = {
                        bomItemCode: bom.bomInfo?.itemCode,
                        bomItemDesc: bom.bomInfo?.itemDesc,
                        bomItemType: BomItemTypeEnum.PANEL,
                        isThisAPreOpOutput: false,
                        avgCons: bom.bomInfo?.avgCons,
                        seq: bom.bomInfo?.seq,
                        subProcessName: undefined,
                        itemType: PhItemCategoryEnum.DEFAULT
                    }
                    allBomsMap.set(bomData.bomItemCode, bomData);
                });
                const processTypeObj: IProcessTypeInfo = {
                    allOperations: [],
                    depProcessType: null,
                    processOrder: null,
                    processType: processType,
                    subProcessList: null,
                    allBomInfo: Array.from(allBomsMap.values()),
                    outPut: [],
                    extraOperations: Array.from(new Set([...moBomProcessTypeOperations]).values()),
                    extraProcessTypes: [],
                    isProcessTypeNotExist: true,
                    outputFgSku: null
                }
                processTypesData.push(processTypeObj);
            }
        });
        setFinalBomData(processTypesData);

    }

    const updateBomToSubProcess = (selectedBomData: IMOP_OpRoutingBomList[]) => {
        const { processType, subProcessList, index } = selectedSubProcessData;

        setFinalBomData((prevState) => {
            // Find the selected processType in the previous state
            const selectedProcessType = prevState.find((e) => e.processType === processType);

            if (!selectedProcessType) {
                // Handle the case where processType is not found (optional)
                return prevState;
            }

            // Find the specific subProcess using index
            const updatedSubProcessList = selectedProcessType.subProcessList.map((subProcess, idx) => {
                if (idx === index) {
                    // Return a new subProcess object with the updated selectedBom
                    return { ...subProcess, selectedBom: selectedBomData };
                }
                return subProcess;
            });

            // Return a new state with the updated subProcessList
            return prevState.map((e) =>
                e.processType === processType
                    ? { ...e, subProcessList: updatedSubProcessList }
                    : e
            );
        });
        setSelectedSubProcessData(undefined);
        setVisible(false);
    };
    const updateBom = () => {
        const mocMoBomCreationRequests = convertToMOC_MoBOMCreationRequest(finalBomData);
        moConfigService.updateBomForOpVersionMoProductFgColor(mocMoBomCreationRequests).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        })
    }
    const convertToMOC_MoBOMCreationRequest = (processTypeInfo: IProcessTypeInfo[]): MOC_MoBOMCreationRequest => {
        // Accumulate all the sub-processes into a single bomInfo array
        const bomInfo: MOC_MoProcessTypesBomModel[] = processTypeInfo.map(processInfo => {
            const { processType, subProcessList } = processInfo;

            // Map each sub-process in the subProcessList to MOC_MoSubProcessTypesBomModel
            const subProcessBomInfo: MOC_MoSubProcessTypesBomModel[] = subProcessList?.map(subProcess => {
                // Map each selectedBom (from subProcess) to MOC_MoProcessTypeBomModel
                return new MOC_MoSubProcessTypesBomModel(
                    subProcess.processType,
                    subProcess.subProcessName,
                    subProcess.selectedBom.map(bom => {
                        return new MOC_MoProcessTypeBomModel(
                            bom.bomItemCode,
                            bom.bomItemDesc, // itemName is not required in create
                            bom.bomItemDesc, // itemDesc is required
                            bom.avgCons, // avgCons is optional
                            bom.itemType, // itemType, use default as placeholder
                            bom.bomItemType // bomItemType from IMOP_OpRoutingBomList
                        );
                    })
                );
            });

            return new MOC_MoProcessTypesBomModel(
                processType,
                productColors.productCode,
                productColors.fgColor, // fgColor, you should pass the actual fgColor
                subProcessBomInfo
            );
        });

        // Create a single mOC_moBOMCreationRequest with all the bomInfo from all process types
        return new MOC_MoBOMCreationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, moNumber, productColors.productCode, productColors.fgColor, undefined, undefined,
            bomInfo // Accumulated BOM info from all process types
        );
    };






    let isGreen = true;
    return (
        <div>
            {/* Cards based on selected operation */}
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
                                        {/* <div>
                                            <strong>InputSku Count:</strong> {bomObj.allBomInfo.length}
                                        </div> */}
                                        <div>
                                            <strong>OutputSku :</strong> {bomObj.outputFgSku}
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
            <Divider>Process Details</Divider>
            <Row gutter={16} style={{ marginTop: 20 }}>
                {finalBomData.map((bomObj) => {
                    isGreen = !isGreen;
                    return <Col xs={24} md={12} key={bomObj.processType}>
                        <Card size='small' className={(isGreen) ? 'bom-card bom-bg-chocolate' : 'bom-card bom-bg-cadetblue'} title={processTypeEnumDisplayValues[bomObj.processType]} bordered={false} style={{ marginBottom: '20px' }} extra={
                            <div style={{ display: "flex", gap: '10px' }}>
                                <div>
                                    <Tag color='green'>{bomObj.outputFgSku}</Tag>
                                </div>
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
                                    {finalBomData.indexOf(bomObj) + 1}
                                </div>
                            </div>
                        }
                        >
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                <span>Operations: </span>
                                {bomObj.allOperations.map(opObj => <Tag color="#87d068">{`${opObj.opCode}-${opObj.opName}`}</Tag>)}
                            </div>
                            <Table
                                size='small' bordered
                                dataSource={bomObj.subProcessList}
                                pagination={false}
                                columns={subProcessColumns}
                                style={{ marginTop: 20, minWidth: '100%'}}
                                scroll={{x: 'max-content'}}
                            />
                            {/* <Divider>Input</Divider>
                            <Table className='bom-tbl'
                                size='small' bordered
                                dataSource={bomObj.allBomInfo}
                                pagination={false}
                                columns={columns}
                                style={{ marginTop: 20 }}
                            />
                            <Divider>Output</Divider> */}
                            <Divider>Process Output</Divider>
                            {bomObj.outPut.map(oSku => <Tag>{oSku}</Tag>)}
                        </Card>
                    </Col>
                })}
            </Row>
            <Row>
                <Col>
                    <Tooltip title={props.productColors.isMoProceeded ? "This MO  has already been Proceeded" : "Click to Save Updated BOM"}>
                        <Button onClick={updateBom} disabled={props.productColors.isMoProceeded} type='primary' className='btn-green'>Save</Button>
                    </Tooltip>
                </Col>
            </Row>

            <Modal
                title="Select Bom"
                open={visible}
                onCancel={handleCancel}
                width={'90%'}
                style={{ top: 0 }}
                footer={[

                ]}
            >

                <BomSelectionModal selectedSubProcessData={selectedSubProcessData} saveBom={updateBomToSubProcess} />
            </Modal>
        </div>
    );
};

export default BomSpVersionMapping;