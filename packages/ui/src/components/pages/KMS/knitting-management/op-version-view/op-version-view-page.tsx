import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Tag, Divider } from 'antd';
import { BomItemTypeEnum, ProcessTypeEnum, SI_ManufacturingOrderInfoModel, SI_MoNumberRequest, SI_MoProductOpRmModel, MOP_OpRoutingOpsList, StyleProductCodeFgColor, processTypeEnumDisplayValues, MOC_OpRoutingRetrievalRequest, MOC_OpRoutingModel } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { OrderCreationService, MOConfigService, StyleProductOpService, MoOpRoutingService } from '@xpparel/shared-services';
import { AlertMessages } from 'packages/ui/src/components/common';
import './bom-style.css';
import { TableProps } from 'antd/es/table';

import { IProcessTypeInfo, IMOP_OpRoutingSubProcessList, IMOP_OpRoutingBomList } from './op-view-interface';

interface IProps {
    productColors: StyleProductCodeFgColor;
    moNumber: string;
}


const OpVersionViewPage: React.FC<IProps> = (props: IProps) => {
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

    const [moBom, setMoBom] = useState<SI_ManufacturingOrderInfoModel[]>([]);
    const [finalBomData, setFinalBomData] = useState<IProcessTypeInfo[]>([]);



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
            title: 'BOM', dataIndex: 'selectedBom', render: (v: IMOP_OpRoutingBomList[]) => <ul>{v.map(b => <li>{b.bomItemCode}</li>)}</ul>
        },

    ];

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
            const extraProcessTypes: string[] = [];
            const subProcessList = processTypesObj.subProcessList.map(subProcessListObj => {
                const subProcesses = subProcessListObj.dependentSubProcesses.map(dep => dep.subProcessName);
                const updatedObj: IMOP_OpRoutingSubProcessList = { ...subProcessListObj, dependentSubProcesses: subProcesses, selectedBom: subProcessListObj.bomList }
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
                isProcessTypeNotExist: false
            }
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
                        seq: bom.bomInfo?.seq
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
                    isProcessTypeNotExist: true
                }
                processTypesData.push(processTypeObj);
            }
        });
        setFinalBomData(processTypesData);

    }


    let isGreen = true;
    return (
        <div>
            {/* Cards based on selected operation */}
            <Row gutter={16} style={{ marginTop: 20 }}>
                {finalBomData.map((bomObj) => {
                    isGreen = !isGreen;
                    return <Col xs={24} md={12} key={bomObj.processType}>
                        <Card size='small' className={(isGreen) ? 'bom-card bom-bg-chocolate' : 'bom-card bom-bg-cadetblue'} title={processTypeEnumDisplayValues[bomObj.processType]} bordered={false} style={{ marginBottom: '20px' }} extra={<></>}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ marginRight: '10px' }}>Operations: </span>
                                     {bomObj.allOperations.map((opObj) => (<Tag key={opObj.opCode} style={{ margin: '2px' }} color="#87d068"> {`${opObj.opCode}-${opObj.opName}`}</Tag>))}
                            </div>
                            <Table
                                size='small' bordered
                                dataSource={bomObj.subProcessList}
                                pagination={false}
                                columns={subProcessColumns}
                                style={{ marginTop: 20 }}
                                scroll={{ x: 'max-content' }}
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
                            <Divider>Output</Divider>
                            {bomObj.outPut.map(oSku => <Tag>{oSku}</Tag>)}
                        </Card>
                    </Col>
                })}
            </Row>


        </div>
    );
};

export default OpVersionViewPage;