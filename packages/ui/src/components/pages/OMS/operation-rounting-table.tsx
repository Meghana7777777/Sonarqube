import React, { useEffect, useState } from 'react';
import './operation-rounting.css'
import { Table, Button, Select, Tag, Checkbox, InputNumber, Row, Form, Col, Popconfirm } from 'antd';
import { ComponentModel, OpFormEnum, OperationCategoryFormRequest, OperationModel, ProcessTypeEnum, processTypeEnumDisplayValues } from '@xpparel/shared-models';
import { OperationService } from '@xpparel/shared-services';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from '../../common';
import { IProcessDetails, IProcessTypeData, ISavedProcessData, ITblBasicData, ITblData, OperationRoutingTableProps, OperationRow } from './order-summaries/op-routing-interface';
import OperationsTable from './op-group-mapping-grid';
import { IComponentEmb } from './cut-op-version/op-routing-interface';
import ComponentEmbMapping from './cut-op-version/component-emb-mapping';

const { Option } = Select;



// const componentsList = Object.values(ApparelComponent);

const OperationRoutingTable: React.FC<OperationRoutingTableProps> = ({ onSave, onConfirmSequence, savedTableData, processIndex, previousTableData, componentsData, processType, updateKey }) => {

    const operationService = new OperationService();
    const user = useAppSelector((state) => state.user.user.user);
    const [operationsList, setOperationsList] = useState<OperationModel[]>([]);
    const [tableData, setTableData] = useState<ITblData[]>([]);
    const [savedData, setSavedData] = useState<ITblBasicData[]>([]);
    const [isEditable, setIsEditable] = useState(true);
    const [lastAddedSps, setLastAddedSps] = useState<string[]>([]);
    const [lastSubProcessNumber, setLastSubProcessNumber] = useState<number>(undefined);
    const [dependentProcessTypeList, setDependentProcessTypeList] = useState<string[]>([]);
    const [dependentSubProcessList, setDependentSubProcessList] = useState<string[]>([]);
    const [subProcessCount, setSubProcessCount] = useState<number>(1);
    const [isBundlingGroup, setIsBundlingGroup] = useState<boolean>(false);
    const [isInventory, setIsInventory] = useState<boolean>(true);
    const [isOperatorLevelTracking, setIsOperatorLevelTracking] = useState<boolean>(false);
    const [bundleQty, setBundleQty] = useState<number>();


    useEffect(() => {
        let isPreviousProcessTypeSaved = true;

        for (const [processTypeKey, data] of Object.entries(savedTableData)) {
            if (processTypeKey === processType) { // validate previous process types
                break
            }
            if (!data.isConfirmed) {
                isPreviousProcessTypeSaved = false;
                break
            }
        }
        if (isPreviousProcessTypeSaved || processIndex === 0) {
            resetDefaultTblData()
        } else {
            setTableData([]);
        }
    }, [updateKey]);

    const resetDefaultTblData = () => {
        const lastSubProcessNo = getLastSubProcessNumber(previousTableData);
        const dependentProcessTypeData = getDependentProcessType(previousTableData);
        const dependentSubProcessData = getDependentSubProcess(previousTableData);
        setLastSubProcessNumber(lastSubProcessNo);
        setDependentProcessTypeList(dependentProcessTypeData);
        setDependentSubProcessList(dependentSubProcessData);
        const defaultTblData = getDefaultData(lastSubProcessNo, dependentProcessTypeData, dependentSubProcessData);
        setTableData(defaultTblData);

        if (processType) {
            getOperationsByProcessType();
        }
        if (processIndex === 0) {
            setIsBundlingGroup(true);
        }
    }
    const getDefaultData = (lastSubProcessNo: number, dependentProcessTypeData: string[], dependentSubProcessData: string[]) => {
        const tableDefaultData: ITblData[] = processIndex === 0 ? [
            {
                key: 1,
                order: [1],
                subProcess: `${processType}1`,
                dependentProcessType: ['N/A'],
                dependentSubProcess: ['N/A'],
                components: componentsData,
                selectedComponents: [],
                operations: operationsList,
                selectedOperations: [],
                selectedDependentSubProcess: ['N/A'],
                selectedDependentProcessType: ['N/A'],
                opGroupData: [],
                compEmb: []
            }
        ] : [
            {
                key: 1,
                order: [1],
                subProcess: `${processType}${lastSubProcessNo + 1}`,
                dependentProcessType: dependentProcessTypeData,
                selectedDependentProcessType: [],
                dependentSubProcess: dependentSubProcessData.length > 0 ? dependentSubProcessData : ["No Sub Process"],
                selectedDependentSubProcess: [],
                components: componentsData,
                selectedComponents: [],
                operations: operationsList,
                selectedOperations: [],
                opGroupData: [],
                compEmb: []
            }
        ]
        return tableDefaultData;
    }


    const getOperationsByProcessType = () => {

        const reqObj = new OperationCategoryFormRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, processType as ProcessTypeEnum);
        operationService.getOperationsByCategory(reqObj).then(res => {
            if (res.status) {
                setOperationsList(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };
    const getLastSubProcessNumber = (prevData: ISavedProcessData[]) => {
        if (!Array.isArray(prevData) || prevData.length === 0) return 0;

        const allSubProcesses = prevData.flatMap(entry => entry.data || []);

        if (allSubProcesses.length === 0) return 0;

        const lastSubProcess = Math.max(
            ...allSubProcesses
                .filter(row => row.subProcess)
                .map(row => parseInt(row.subProcess.replace('SP', ''), 0) || 0)
        );

        return isFinite(lastSubProcess) ? lastSubProcess : 0;
    };

    const getDependentProcessType = (prevData: ISavedProcessData[]) => {
        if (!Array.isArray(prevData) || prevData.length === 0) return [];

        const depProcessTypes: string[] = prevData.flatMap(dpt => dpt.processType).filter(Boolean);

        return depProcessTypes.length === 0 ? [] : depProcessTypes;
    };

    const getDependentSubProcess = (prevData: ISavedProcessData[]): string[] => {
        if (!Array.isArray(prevData) || prevData.length === 0) return [];

        return prevData.flatMap(dsp =>
            dsp.data ? dsp.data.map(row => row.subProcess) : []
        ).filter(Boolean);
    };



    const getDepSP_BasedOn_DepProcessType = (process: string[]) => {
        if (!Array.isArray(previousTableData) || previousTableData.length === 0) return [];

        const previousSPs = previousTableData.flatMap(dpt =>
            Array.isArray(dpt.data)
                ? dpt.data
                    .filter(row => process.includes(dpt.processType))
                    .map(row => row.subProcess)
                : []
        ).filter(Boolean);
        return Array.from(new Set([...previousSPs, ...lastAddedSps]));
    };


    const getUsedComponents = () => new Set(tableData.flatMap(row => row.selectedComponents));
    const getUsedOperations = () => new Set(tableData.flatMap(row => row.selectedOperations));

    const handleAddRow = () => {
        if (!isEditable) return;
        const newLastAddedSps = [...lastAddedSps, tableData[tableData.length - 1]?.subProcess].filter(Boolean);
        setLastAddedSps(newLastAddedSps);

        const lastSubProcess = getLastSubProcessNumber(previousTableData) + subProcessCount;
        const depProcessType = getDependentProcessType(previousTableData);
        const depSubProcess = tableData.map(row => row.subProcess);
        const newKey = lastSubProcess + 1;
        const orderOptions = Array.from({ length: newKey }, (_, i) => i + 1);
        const newRow: ITblData = {
            key: newKey,
            order: orderOptions,
            subProcess: `${processType}${lastSubProcess + 1}`,
            dependentProcessType: depProcessType,
            selectedDependentProcessType: processIndex == 0 ? ['N/A'] : [],
            dependentSubProcess: depSubProcess.length > 0 ? depSubProcess : ["No Sub Process"],
            selectedDependentSubProcess: processIndex == 0 ? ['N/A'] : [],
            components: componentsData,
            selectedComponents: [],
            operations: operationsList,
            selectedOperations: [],
            opGroupData: [],
            compEmb: []
        };

        setTableData([...tableData, newRow]);
        setSubProcessCount(pre => pre + 1)
    };

    const handleDeleteRow = (key: number) => {
        if (!isEditable) return;
        setTableData(prevData => prevData.filter(row => row.key !== key));
    };

    const handleSelectComponents = (value: string, key: number) => {
        if (!isEditable) return;
        const compEmbData = constructCpmEmbTblData([value]);
        setTableData(prevData =>
            prevData.map(row => row.key === key ? { ...row, selectedComponents: [value], compEmb: compEmbData } : row)
        );
    };
   
    const constructCpmEmbTblData = (components: string[]) => {

        return [...components].map((component, i) => {
            const newRow: IComponentEmb = {
                key: component,
                componentName: component,
                operationCodes: []
            };
            return newRow
        })
    }

    const handleSelectOperations = (value: string[], key: number, subProcessName: string) => {
        if (!isEditable) return;
        const opGroupData = constructTblData(value, subProcessName);
        setTableData(prevData =>
            prevData.map(row => row.key === key ? { ...row, selectedOperations: value, opGroupData: opGroupData } : row)
        );
    };
    const constructTblData = (operationCodes: string[], subProcessName: string) => {
        const opGroupOptions = operationCodes.map((_, index) => `${subProcessName}-OPG-${index + 1}`);
        return operationCodes.map((opCode, i) => {
            const newRow: OperationRow = {
                key: i + 1,
                operation: opCode,
                opGroup: opGroupOptions[0], // Default to first OP Group
                opGroupOptions: opGroupOptions[i],
                opGroupOrder: i + 1
            };
            return newRow
        })
    }
    const updateOpGroups = (value: OperationRow[], key: number) => {
        if (!isEditable) return;
        setTableData(prevData =>
            prevData.map(row => row.key === key ? { ...row, opGroupData: value } : row)
        );
    };

    const updateIsEmb = (value: IComponentEmb[], key: number) => {
        if (!isEditable) return;
        setTableData(prevData =>
            prevData.map(row => row.key === key ? { ...row, compEmb: value } : row)
        );
    };

    const handleSelectDependentProcessType = (value: string[], key: number) => {
        if (!isEditable) return;

        const updatedDependentSubProcesses = getDepSP_BasedOn_DepProcessType(value);

        setTableData(prevData =>
            prevData.map(row =>
                row.key === key
                    ? {
                        ...row,
                        selectedDependentProcessType: value,
                        dependentSubProcess: updatedDependentSubProcesses.length > 0 ? updatedDependentSubProcesses : ["No Sub Process"],
                        selectedDependentSubProcess: []
                    }
                    : row
            )
        );
    };

    const handleSelectDependentSubProcess = (value: string[], key: number) => {
        if (!isEditable) return;

        const selectedComponents = value.flatMap(sp => {
            const foundProcess = previousTableData.find(proc =>
                proc.data.some(row => row.subProcess === sp)
            );
            return foundProcess
                ? foundProcess.data
                    .filter(row => row.subProcess === sp)
                    .flatMap(row => row.selectedComponents || [])
                : [];
        });

        const lastAddedSps = tableData.flatMap(row => row.subProcess);

        const lastRowComponents = value.flatMap(sp =>
            lastAddedSps.includes(sp)
                ? tableData.filter(row => row.subProcess === sp).flatMap(row => row.selectedComponents || [])
                : []
        );

        setTableData(prevData =>
            prevData.map(row =>
                row.key === key
                    ? {
                        ...row,
                        selectedDependentSubProcess: value,
                        selectedComponents: [...new Set([...selectedComponents, ...lastRowComponents])]
                    }
                    : row
            )
        );
    };


    const handleConfirmOperation = () => {
        let isError = false;
        tableData.forEach(e => {
            if (e.selectedOperations.length < 1) {
                isError = true;
                AlertMessages.getErrorMessage(`Please Select Operations for ${e.subProcess}`)
            }

            if (e.selectedDependentSubProcess.length < 1) {
                isError = true;
                AlertMessages.getErrorMessage(`Please Select Dependent Sub Process for ${e.subProcess}`)
            } else {
                if (e.selectedComponents.length < 1) {
                    isError = true;
                    AlertMessages.getErrorMessage(`Please Select components for ${e.subProcess}`)
                }
            }
        });


        if (isBundlingGroup && !bundleQty) {
            isError = true;
            AlertMessages.getErrorMessage(`Bundle Quantity should not be ZERO`)
        }
        if (isError) {
            return
        }
        const formattedData: ITblBasicData[] = tableData.map(({ components, operations, order, ...rest }) => rest);
        const processTypeHeader: IProcessDetails = {
            bundleQty: bundleQty,
            isBundleGroup: isBundlingGroup,
            isInventory: isInventory,
            processType: processType,
            isOperatorLevelTracking: isOperatorLevelTracking,
            tblData: formattedData,
            isConfirmed: true,
            updateKey: savedTableData[processType]?.updateKey + 1
        }
        setSavedData(formattedData);
        onSave(processTypeHeader);
        setIsEditable(false);
        onConfirmSequence(true);
    };

    const handleSelectOrder = (value: number, key: number) => {
        if (!isEditable) return;
        setTableData(prevData =>
            prevData.map(row => row.key === key ? { ...row, selectedOrder: value } : row)
        );
    };

    const handleDeleteTable = () => {
        let isNextProcessTypeSaved = false;
        let nextProcessType = '';
        let isNexProcess = false;
        for (const [processTypeKey, data] of Object.entries(savedTableData)) {
            if (processTypeKey === processType) { // infinity next process type 
                isNexProcess = true;
            }
            if (isNexProcess) {
                if (processTypeKey !== processType) {
                    if (data?.tblData?.length > 0) {
                        isNextProcessTypeSaved = true;
                        nextProcessType = processTypeKey;
                        break
                    }
                }
            }
        }
        if (isNextProcessTypeSaved) {
            AlertMessages.getErrorMessage(`You can not delete , ${processTypeEnumDisplayValues[nextProcessType]} already confirmed`)
            return
        }
        setSubProcessCount(1)
        const defaultTblData = getDefaultData(lastSubProcessNumber + 0, dependentProcessTypeList, dependentSubProcessList);
        setTableData(defaultTblData);
        setSavedData([]);
        setIsEditable(true);        
        setIsBundlingGroup(processIndex === 0 ? true : false);
        setBundleQty(null);
        const processTypeHeader: IProcessDetails = {
            bundleQty: 0,
            isBundleGroup: false,
            isInventory: false,
            processType: processType,
            isOperatorLevelTracking: isOperatorLevelTracking,
            tblData: [],
            isConfirmed: false,
            updateKey: savedTableData[processType]?.updateKey + 1
        }
        onSave(processTypeHeader);
    };

    const getAllUsedSubProcesses = () => {
        const prevUsedSubProcesses = previousTableData.flatMap(dsp =>
            dsp.data ? dsp.data.flatMap(row => row.selectedDependentSubProcess || []) : []
        );

        const currentUsedSubProcesses = tableData.flatMap(row => row.selectedDependentSubProcess || []);

        return new Set([...prevUsedSubProcesses, ...currentUsedSubProcesses]);
    };



    const columns = [
        // {
        //     title: 'Order',
        //     dataIndex: 'order',
        //     key: 'order',
        //     render: (_: any, record: any) => (
        //         <Select
        //             style={{ width: 80 }}
        //             value={record.selectedOrder}
        //             onChange={value => handleSelectOrder(value, record.key)}
        //             disabled={!isEditable}
        //         >
        //             {record.order.map(opt => (
        //                 <Option key={opt} value={opt}>{opt}</Option>
        //             ))}
        //         </Select>
        //     )
        // },
        {
            title: 'Sub Process',
            dataIndex: 'subProcess',
            key: 'subProcess',
        },

        ...(processIndex === 0
            ? [
                {
                    title: 'Dependent Process Type',
                    dataIndex: 'dependentProcessType',
                    key: 'dependentProcessType',
                    render: (_: any, record: ITblData) => (
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={record.selectedDependentProcessType}
                            onChange={value => {
                                const updatedData = tableData.map(row =>
                                    row.key === record.key ? { ...row, selectedDependentProcessType: value } : row
                                );
                                setTableData(updatedData);
                            }}
                            disabled={!isEditable}
                        >
                            {Array.isArray(dependentProcessTypeList) && dependentProcessTypeList.length > 0 ? (
                                dependentProcessTypeList.map(dpt => (
                                    <Option key={dpt} value={dpt}>
                                        {dpt}
                                    </Option>
                                ))
                            ) : (
                                <Option key="N/A" disabled value="N/A">
                                    N/A
                                </Option>
                            )}
                        </Select>
                    ),
                },
            ]
            : [
                {
                    title: 'Dependent Process Type',
                    dataIndex: 'dependentProcessType',
                    key: 'dependentProcessType',
                    render: (_: any, record: ITblData) => (
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={record.selectedDependentProcessType}
                            onChange={value => handleSelectDependentProcessType(value, record.key)}
                            disabled={!isEditable}
                        >
                            {Array.isArray(dependentProcessTypeList) && dependentProcessTypeList.length > 0 ? (
                                dependentProcessTypeList.map(dpt => (
                                    <Option key={dpt} value={dpt}>
                                        {dpt}
                                    </Option>
                                ))
                            ) : (
                                <Option key="N/A" value="N/A">
                                    N/A
                                </Option>
                            )}
                        </Select>
                    ),
                },
            ]),

        ...(processIndex === 0
            ? [
                {
                    title: 'Dependent Sub Process',
                    dataIndex: 'dependentSubProcess',
                    key: 'dependentSubProcess',
                    render: (_: any, record: ITblData) => {
                        const dependentSubProcesses = getDependentSubProcess(previousTableData);

                        return (
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                value={record.selectedDependentSubProcess}
                                onChange={value => {
                                    const updatedData = tableData.map(row =>
                                        row.key === record.key ? { ...row, selectedDependentSubProcess: value } : row
                                    );
                                    setTableData(updatedData);
                                }}
                                disabled={!isEditable}
                            >
                                {dependentSubProcesses.length > 0
                                    ? dependentSubProcesses.map(dsp => (
                                        <Option key={dsp} value={dsp}>
                                            {dsp}
                                        </Option>
                                    ))
                                    : (
                                        <Option key="N/A" disabled value="N/A">
                                            N/A
                                        </Option>
                                    )
                                }
                            </Select>
                        );
                    }
                }
            ]
            : [
                {
                    title: 'Dependent Sub Process',
                    dataIndex: 'dependentSubProcess',
                    key: 'dependentSubProcess',
                    render: (_: any, record: ITblData) => {

                        const allUsedSubProcesses = getAllUsedSubProcesses();
                        return (
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                value={record.selectedDependentSubProcess || []}
                                onChange={value => handleSelectDependentSubProcess(value, record.key)}
                                disabled={!isEditable}
                            >
                                {(Array.isArray(record.dependentSubProcess)
                                    ? record.dependentSubProcess
                                    : record.dependentSubProcess !== "N/A"
                                        ? [record.dependentSubProcess]
                                        : []
                                ).map(dsp => (
                                    <Option
                                        key={dsp}
                                        value={dsp}
                                        disabled={allUsedSubProcesses.has(dsp) &&
                                            // !record.selectedDependentSubProcess.includes(dsp)}
                                            !(record.selectedDependentSubProcess || []).includes(dsp)}
                                    >
                                        {dsp}
                                    </Option>
                                ))}
                            </Select>
                        );
                    }
                }

            ]),
        ...(processIndex === 0
            ? [
                {
                    title: 'Components',
                    dataIndex: 'components',
                    key: 'components',
                    render: (_: any, record: ITblData) => {
                        const usedComponents = getUsedComponents();
                        return (
                            <Select
                                // mode="multiple"
                                style={{ width: '100%' }}
                                value={record.selectedComponents[0] || undefined}
                                onChange={value => handleSelectComponents(value, record.key)}
                                disabled={!isEditable}
                            >
                                {componentsData.map(c => (
                                    <Option key={c.compName} value={c.compName} disabled={usedComponents.has(c.compName) && !record.selectedComponents.includes(c.compName)}>
                                        {c.compName}
                                    </Option>
                                ))}
                            </Select>
                        );
                    }
                },
            ] : [
                {
                    title: 'Components',
                    dataIndex: 'components',
                    key: 'components',
                    render: (_: any, record: ITblData) => (
                        <Select
                            mode="multiple"
                            value={record.selectedComponents}
                            style={{ width: '100%' }}
                            open={false}
                            bordered={true}
                            disabled
                        />
                    )
                }
            ]),
        {
            title: 'Operations',
            dataIndex: 'operations',
            key: 'operations',
            width: '200px',
            render: (_: any, record: ITblData) => {
                const usedOperations = getUsedOperations();
                return (
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        value={record.selectedOperations}
                        onChange={value => handleSelectOperations(value, record.key, record.subProcess)}
                        disabled={!isEditable}
                    >
                        {operationsList.map(op => (
                            // <Option key={op.opCode} value={op.opCode} disabled={usedOperations.has(op.opCode) && !record.selectedOperations.includes(op.opCode)}>
                            <Option key={op.opCode} value={op.opCode}>
                                {op.opCode} - {op.opName}
                            </Option>
                        ))}
                    </Select>
                );
            }
        },
        {
            title: 'Selected Operations',
            dataIndex: 'selectedOperations',
            key: 'selectedOperations',
            render: (selectedOps: string[], record: ITblData) =>
                // selectedOps.length > 0 ? selectedOps.map((op, i) => <>{op} {selectedOps.length == i + 1 ? '' : '→'}  </>) : 'N/A'
                <OperationsTable key={selectedOps.length} isEditable={isEditable} operations={selectedOps} opGroupData={record?.opGroupData} updateOpGroup={e => updateOpGroups(e, record.key)} />
        },
        //Panel Level Embellishment
        // ...(processIndex === 0 ? [{
        //     title: 'Is Embellishment',
        //     dataIndex: 'compEmb',
        //     render: (compEmb: IComponentEmb[], record: ITblData) => {
        //         console.log(compEmb)
        //         return <ComponentEmbMapping isEditable={isEditable} compEmbData={compEmb} updateOpGroup={e => updateIsEmb(e, record.key)} />
        //     }
        // }] : []),
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: ITblData, index: number) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    {!(index === 0 && tableData.length === 1) &&
                        <Button type="primary" style={{ background: "#ff3c2a", color: "white" }} disabled={!isEditable} onClick={() => handleDeleteRow(record.key)}>
                            Delete
                        </Button>
                    }

                    {index === tableData.length - 1 && (
                        <Button type="primary" disabled={!isEditable} onClick={handleAddRow}>
                            Add Row
                        </Button>
                    )}
                </div>
            )
        }
    ];


    const handleCheckboxChange = (e) => {
        setIsBundlingGroup(e.target.checked);
    };

    return (
        <div style={{ marginTop: "0px" }}>
            <div >
                <Table size="small" bordered dataSource={tableData} columns={columns} pagination={false} style={{ overflow: 'auto' }} />
            </div>

            <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
                <Form layout="inline">
                    <Row gutter={16}>
                        {/* <Col>
                            <Form.Item>
                                <Checkbox checked={isOperatorLevelTracking} disabled={!isEditable} onChange={e => setIsOperatorLevelTracking(e.target.checked)}>
                                    Is Operator Level Tracking
                                </Checkbox>
                            </Form.Item>
                        </Col> */}
                        <Col>
                            <Form.Item>
                                <Checkbox checked={isBundlingGroup} disabled={processIndex === 0 ? true : !isEditable} onChange={handleCheckboxChange}>
                                    Is Bundling Group
                                </Checkbox>
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item label="Bundle Qty" style={{ marginBottom: 0 }}>
                                <InputNumber
                                    readOnly={isEditable ? !isBundlingGroup : true}
                                    // disabled={ isEditable ? !isBundlingGroup  : true  }
                                    min={1}
                                    onChange={e => setBundleQty(e)}
                                    value={bundleQty}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                {isEditable &&
                    <Col>
                        <Form.Item>
                            <Button type="primary" disabled={tableData.length < 1} onClick={handleConfirmOperation} className='btn-green'> Confirm Operation </Button>
                        </Form.Item>
                    </Col>}
            </div>
            {!isEditable &&
                <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
                    <Popconfirm
                        title={`Reset the ${processTypeEnumDisplayValues[processType]}`}
                        description="Are you sure to reset this ?"
                        onConfirm={handleDeleteTable}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger > Reset </Button>
                    </Popconfirm>
                </div>
            }


            {/* {previousTableData.length > 0 && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                    <h3>Saved Data:</h3>
                    <pre>{JSON.stringify(previousTableData, null, 2)}</pre>
                </div>
            )} */}
        </div>
    );
};


export default OperationRoutingTable;
