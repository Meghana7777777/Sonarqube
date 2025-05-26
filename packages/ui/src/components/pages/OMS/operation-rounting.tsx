import React, { useEffect, useState } from 'react';
import { Select, Checkbox, Button, Modal, Tag, message, Collapse, Input, Form } from 'antd';
import './operation-rounting.css'
import OperationRoutingTable from './operation-rounting-table';

import OperationRoutingSortTable from './operation-rounting-sorting-table';
import OperatingRoutingFlow from './operating-rounting-flow';
import { CommonRequestAttrs, ComponentModel, ProcessTypeEnum, MOP_OpRoutingCompsList, MOP_OpRoutingOpsList, MOP_OpRoutingProcessTypeList, MOP_OpRoutingSubProcessList, MOP_OpRoutingVersionRequest, processTypeEnumDisplayValues, StyleModel, ProductsModel, ProductTypeModel, PanelEmbDetailsModel } from '@xpparel/shared-models';
import { ComponentServices, ProductSharedService, ProductTypeServices, StyleProductOpService, StyleSharedService } from '@xpparel/shared-services';
import { AlertMessages } from '../../common';
import { useAppSelector } from 'packages/ui/src/common';
import { IProcessDetails, IProcessTypeData, ISavedProcessData, ITblBasicData } from './order-summaries/op-routing-interface';

const processTypes = Object.keys(processTypeEnumDisplayValues).map(key => ({
    value: key,
    label: processTypeEnumDisplayValues[key]
}));

interface IOpVersion {
    style: string;
    productType: string;
    processes: string[];
    operations: IProcessTypeData
    versionNumber: string;
    versionDescription: string
}

interface IProps {
    style?: string;
    productType?: string;
    closeModal?: (reload: true, vCode: string, vDesc: string) => void;
    uniqueKey?: number;
}

const OperationRouting = (props: IProps) => {
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
    const [selectedProcesses, setSelectedProcesses] = useState<string[]>([ProcessTypeEnum.KNIT]);
    const [savedData, setSavedData] = useState<IProcessTypeData>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [finalizedOperations, setFinalizedOperations] = useState<IOpVersion[]>([]);
    const [isFinalModalVisible, setIsFinalModalVisible] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [confirmedSequence, setConfirmedSequence] = useState<string[]>([]);
    const [isSaved, setIsSaved] = useState(false);
    const [viewFlow, setViewFlow] = useState(false);
    const [versionNo, setVersionNo] = useState<string>(null);
    const [versionDes, setVersionDes] = useState<string>('');
    const componentServices = new ComponentServices();
    const styleProductOpService = new StyleProductOpService();
    const styleSharedService = new StyleSharedService();
    const productTypeServices = new ProductTypeServices();
    const user = useAppSelector((state) => state.user.user.user);
    const [components, setComponents] = useState<ComponentModel[]>([]);
    const [stylesData, setStylesData] = useState<StyleModel[]>([]);
    const [productTypesData, setProductTypesData] = useState<ProductTypeModel[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (props) {
            setSelectedStyle(props?.style);
            setSelectedProductType(props?.productType);
        }

        getAllComponents();
        // getAllStyles();
        getAllProducts();
        setSelectedProcesses([ProcessTypeEnum.KNIT]);
        setSavedData({});
        setVersionNo(null);
        setVersionDes('');
        setIsConfirmed(false);
        setIsFinalModalVisible(false);
        setViewFlow(false);
        setConfirmedSequence([]);
        setFinalizedOperations([])
    }, [props?.uniqueKey]);

    const getAllStyles = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        styleSharedService.getAllStyles(reqObj).then(res => {
            if (res.status) {
                setStylesData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };
    const getAllProducts = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        productTypeServices.getAllProductTypes(reqObj).then(res => {
            if (res.status) {
                setProductTypesData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };
    const getAllComponents = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        componentServices.getAllComponents(reqObj).then(res => {
            if (res.status) {
                setComponents(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };

    const handleStyleChange = (value: string) => {
        setSelectedStyle(value);
    };

    const handleProductTypeChange = (value: string) => {
        setSelectedProductType(value);
    };

    const handleProcessChange = (checkedValues: string[]) => {
        setSelectedProcesses(checkedValues);
    };

    const showConfirmationModal = () => {
        if (!selectedStyle) {
            AlertMessages.getErrorMessage("Please select a style.");
            return;
        }
        if (selectedProcesses.length === 0) {
            AlertMessages.getErrorMessage("Please select at least one process type.");
            return;
        }
        setIsModalVisible(true);
    };

    const handleConfirm = () => {
        setIsConfirmed(true);
        setIsModalVisible(false);

        const initialData: IProcessTypeData = selectedProcesses.reduce((acc, process) => {
            acc[process] = { bundleQty: 0, isBundleGroup: false, isInventory: false, processType: process, isOperatorLevelTracking: false, tblData: [], isConfirmed: false, updateKey: 0 };
            return acc;
        }, {} as IProcessTypeData);
        setSavedData(initialData);
    };

    const handleModify = () => {
        setIsConfirmed(false);
    };

    const handleSaveTableData = (processType: string, data: IProcessDetails) => {
        const cloneData: IProcessDetails = JSON.parse(JSON.stringify(data));
        setSavedData(prevData => ({
            ...prevData,
            [processType]: cloneData
        }));
    };

    const handleFinalConfirm = () => {
        if (!selectedStyle || selectedProcesses.length === 0 || Object.values(savedData).some(data => data.tblData.length === 0)) {
            AlertMessages.getErrorMessage("Please complete all process sections before confirming.");
            return;
        }
        form.validateFields()
            .then(values => {
                setIsFinalModalVisible(true);
            })
            .catch(errorInfo => {

            });

    };

    const confirmFinalOperation = () => {

        if (!versionNo || !versionDes) {
            AlertMessages.getErrorMessage("Please enter both version number and version description.");
            return;
        }

        const finalData: IOpVersion = {
            style: selectedStyle,
            productType: selectedProductType,
            processes: selectedProcesses,
            operations: savedData,
            versionNumber: versionNo,
            versionDescription: versionDes,
        };
        let opVersionData: IOpVersion[] = [];
        if (editingIndex !== null) {
            setFinalizedOperations(prev => {
                const updatedOperations = [...prev];
                updatedOperations[editingIndex] = finalData;
                return updatedOperations;
            });
            const updatedOperations = [...finalizedOperations];
            updatedOperations[editingIndex] = finalData;
            opVersionData = updatedOperations;
            setEditingIndex(null);
        } else {
            // opVersionData = [...finalizedOperations, finalData];
            // setFinalizedOperations(prev => [...prev, finalData]);
            opVersionData = [finalData];
            setFinalizedOperations(prev => [finalData]);
        }
        // message.success("Final operation confirmed successfully!");


        saveOperationVersion(opVersionData)
    };

    const handleConfirmedSequence = (sequence: string[]) => {
        setConfirmedSequence(sequence);
        setIsConfirmed(true);
        setIsModalVisible(false);

        const initialData: IProcessTypeData = sequence.reduce((acc, process) => {
            acc[process] = { bundleQty: 0, isBundleGroup: false, isInventory: false, processType: process, isOperatorLevelTracking: false, tblData: [], isConfirmed: false, updateKey: 0 };
            return acc;
        }, {} as IProcessTypeData);
        setSavedData(initialData);
    };

    const handleIsSaved = (isSaved: boolean) => {
        setIsSaved(isSaved);
    }

    const handleVersionNo = ({ target: { value } }) => {
        setVersionNo(value || null);
    };

    const handleVersionDescription = ({ target: { value } }) => {
        setVersionDes(value);
    };

    const handlePreviewFlow = () => {
        setViewFlow(true);
    }

    let finalData = [];
    if (Array.isArray(savedData)) {
        finalData = [...savedData, versionNo, versionDes];
    }



    const saveOperationVersion = (data: IOpVersion[]) => {
        const opVersionData = data[0];
        const processLitsData: MOP_OpRoutingProcessTypeList[] = [];
        let routingGroupNo = 1;
        let isLastBundleQty = 0;
        opVersionData.processes.forEach((processType: ProcessTypeEnum, index) => {
            const processTypeInfo = opVersionData.operations[processType];
            if (processTypeInfo) {
                const { bundleQty, isBundleGroup } = processTypeInfo;
                if (index === 0) {
                    isLastBundleQty = bundleQty;
                }
                const rountingGroupText = `RG-${routingGroupNo}`;
                const dependentProcessTypesSet = new Set<string>();
                const subProcessListData: MOP_OpRoutingSubProcessList[] = [];  // Sub Process Data
                processTypeInfo?.tblData.forEach((spObj, spIndex) => {
                    const dependentProcessTypes = typeof (spObj.selectedDependentProcessType) == 'string' ? [] : spObj.selectedDependentProcessType;
                    dependentProcessTypes.forEach(dependentProcessTye => dependentProcessTypesSet.add(dependentProcessTye));
                    const dependentSubProcess = typeof (spObj.selectedDependentSubProcess) == 'string' ? [] : spObj.selectedDependentSubProcess;
                    const selectedOperations: MOP_OpRoutingOpsList[] = [];
                    // OP Group
                    const opGroupObj = new Object();
                    spObj.opGroupData.forEach(opGroup => opGroupObj[opGroup.operation] = opGroup.opGroup);

                    spObj.selectedOperations.forEach((op, i) => {
                        const opObj = new MOP_OpRoutingOpsList(op, '', i + 1, undefined, processType, opGroupObj[op]);
                        selectedOperations.push(opObj);
                    });
                    const compEmbObj: { [key: string]: PanelEmbDetailsModel[] } = {};
                    spObj.compEmb.forEach(c => compEmbObj[c.componentName] = c.operationCodes.map(op => new PanelEmbDetailsModel(op)))
                    const components: MOP_OpRoutingCompsList[] = spObj.selectedComponents.map(component => new MOP_OpRoutingCompsList(component, '', compEmbObj[component] || []))
                    const subProcessObj = new MOP_OpRoutingSubProcessList(processType, spObj.subProcess, [], dependentSubProcess, selectedOperations, spIndex + 1, undefined, components);

                    subProcessListData.push(subProcessObj);
                });

                //processTypesList
                const processTypeData = new MOP_OpRoutingProcessTypeList(processType, index + 1, Array.from(dependentProcessTypesSet.values()), rountingGroupText, isLastBundleQty, subProcessListData, isBundleGroup, true, true, bundleQty);
                processLitsData.push(processTypeData);
                if (isBundleGroup) {
                    if (index) {
                        routingGroupNo++;
                    }
                    isLastBundleQty = bundleQty;
                }
            }
        });

        const reqObj = new MOP_OpRoutingVersionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, opVersionData.versionNumber, opVersionData.versionDescription, opVersionData.style, opVersionData.productType
            , processLitsData);
        styleProductOpService.createOpVersionForStyleAndProductType(reqObj).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                setSelectedStyle(null);
                setSelectedProductType(null);
                setSelectedProcesses([]);
                setSavedData({});
                setVersionNo(null);
                setVersionDes('');
                setIsConfirmed(false);
                setIsFinalModalVisible(false);
                setViewFlow(false);
                props.closeModal(true, opVersionData.versionNumber, opVersionData.versionDescription);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };
    return (
        <div style={{ textAlign: 'center', borderRadius: '10px' }}>
            <div style={{ display: 'flex', flex: 1, padding: '5px 0px', alignItems: 'center', borderRadius: '10px', justifyContent: 'space-evenly' }}>
                <div style={{ width: '165px', background: '#e1e1e1', borderRadius: '10px', padding: '5px', display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: '14px', marginBottom: "4px" }}> Style : </span>
                    <Select
                        style={{ width: 150 }}
                        placeholder="Select a Style"
                        onChange={handleStyleChange}
                        value={selectedStyle}
                        showSearch
                        disabled={true}
                        filterOption={(input, option) => (option!.children as unknown as string).toString().toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                    >
                        {stylesData.map((style) => (
                            <Select.Option key={style.styleCode} value={style.styleCode}>
                                {style.styleCode}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <div style={{ width: '165px', background: '#e1e1e1', borderRadius: '10px', padding: '5px', display: "flex", flexDirection: "column", alignItems: "center", }}>
                    <span style={{ fontSize: '14px', marginBottom: "4px" }}> Product Type : </span>
                    <Select
                        style={{ width: 150 }}
                        placeholder="Select a Type"
                        showSearch
                        onChange={handleProductTypeChange}
                        value={selectedProductType}
                        disabled={!selectedStyle || true}
                        filterOption={(input, option) => (option!.children as unknown as string).toString().toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                    >
                        {productTypesData.map((productTypeObj) => (
                            <Select.Option key={productTypeObj.productType} value={productTypeObj.productType}>
                                {productTypeObj.productType}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <div style={{ background: '#e1e1e1', borderRadius: '10px', padding: '10px', width: "846px" }}>
                    {/* <Checkbox.Group
                        options={Object.values(ProcessType)}
                        value={selectedProcesses}
                        onChange={handleProcessChange}
                        disabled={!selectedProductType || isConfirmed}
                    /> */}
                    <Checkbox.Group
                        style={{ width: '100%' }}
                        onChange={handleProcessChange}
                        value={selectedProcesses}
                        disabled={!selectedProductType || isConfirmed}
                    >
                        {processTypes.map((process) => (
                            <Checkbox key={process.value} value={process.value} disabled={process.value == ProcessTypeEnum.KNIT}>
                                {process.label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </div>

                <div>
                    {/* {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '10px' }} />} */}
                    {/* {!isConfirmed && <Button type="primary" onClick={handleConfirm} disabled={confirmedSequence.length === 0}> Confirm </Button>} */}
                </div>
            </div>

            <div>
                <OperationRoutingSortTable selectedProcesses={selectedProcesses} isModified={isConfirmed} onConfirmSequence={handleConfirmedSequence} />
            </div>

            <Modal
                title="Confirm Operation"
                visible={isModalVisible}
                onOk={handleConfirm}
                onCancel={() => setIsModalVisible(false)}
                okText="Confirm"
                cancelText="Cancel"
            >
                <p className='confirm-mdl-p'>Are you sure you want to confirm the following selection?</p>
                <p className='confirm-mdl-p'> Style : <Tag bordered={false} color='#2c8bb1'> {selectedStyle} </Tag> </p>
                <p className='confirm-mdl-p'> Process Types :
                    {selectedProcesses.map(process => (
                        <Tag color='#2c8bb1' bordered={false} key={process} style={{ margin: '2px' }}> {process} </Tag>
                    ))}
                </p>
            </Modal>

            {isConfirmed && (
                <>
                    <Button type="primary" style={{ background: "white", color: "#2c8bb1", margin: "10px" }} onClick={handleModify}>
                        Modify Selection
                    </Button>

                    <div style={{ padding: "0px 10px" }} >
                        <Collapse size="small"
                        // accordion
                        >
                            {confirmedSequence.map((process, index) => {
                                const savedProcessesData: ISavedProcessData[] = confirmedSequence.slice(0, index).map(prevProcess => {
                                    const objData: ISavedProcessData = {
                                        processType: prevProcess,
                                        data: savedData[prevProcess]?.tblData || [],
                                        updateKey: savedData[prevProcess]?.updateKey || 0,
                                    }
                                    return objData;
                                });

                                const isDisabled = index > 0 && (!savedData[confirmedSequence[index - 1]] || savedData[confirmedSequence[index - 1]]?.tblData.length === 0);

                                return (
                                    <Collapse.Panel
                                        header={
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>{index + 1}. {processTypeEnumDisplayValues[process]}</span>
                                                {savedData[process] && savedData[process]?.tblData.length > 0 && <Tag color="green">Saved</Tag>}
                                            </div>
                                        }
                                        key={process}
                                        // disabled={isDisabled}
                                        collapsible={isDisabled ? "disabled" : "header"}
                                    >
                                        <OperationRoutingTable
                                            processIndex={index}
                                            processType={process}
                                            savedTableData={savedData}
                                            previousTableData={savedProcessesData.length > 0 ? savedProcessesData : []}
                                            onSave={(data) => handleSaveTableData(process, data)}
                                            onConfirmSequence={handleIsSaved}
                                            componentsData={components}
                                            updateKey={savedProcessesData.length > 0 ? savedProcessesData[savedProcessesData.length - 1]?.updateKey + 1 : 0}
                                        />
                                    </Collapse.Panel>
                                );
                            })}
                        </Collapse>
                    </div>
                    <br />
                    <Form layout="inline" form={form}>
                        {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}  > */}
                        {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", width: "290px" }} > */}
                        {/* <p> Version Code : </p> */}
                        <Form.Item
                            label="Version Code"
                            name="versionCode"
                            rules={[
                                { required: true, message: 'Version Code is required' },
                                { max: 20, message: 'Maximum 20 characters allowed' },
                            ]}
                        >
                            <Input placeholder="Enter Version Code." value={versionNo !== null ? versionNo : ''} onChange={handleVersionNo} style={{ width: "200px" }} />
                        </Form.Item>
                        {/* </div> */}

                        {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", width: "540px" }} > */}
                        {/* <p> Version Description : </p> */}
                        <Form.Item
                            label="Version Description"
                            name="versionDescription"
                            rules={[
                                { required: true, message: 'Version Description is required' },
                                { max: 30, message: 'Maximum 30 characters allowed' },
                            ]}
                        >
                            <Input type='text' placeholder="Enter Description" onChange={handleVersionDescription} style={{ width: "400px" }} />
                        </Form.Item>
                        {/* </div> */}
                        {/* </div> */}

                        <div style={{ display: "flex", justifyContent: "center", }}>

                            {!viewFlow === true ? <Button type="primary" onClick={handlePreviewFlow} style={{ background: "white", color: "#2c8bb1", marginRight: "10px" }}> Preview </Button>
                                : <Button type="primary" value={versionDes} onClick={() => setViewFlow(false)} style={{ background: "white", color: "#2c8bb1", marginRight: "10px" }}> Hide Preview </Button>}

                            <Button
                                type="primary"
                                className='btn-green'
                                onClick={handleFinalConfirm}
                                disabled={selectedProcesses.some(process => (savedData[process]?.tblData || []).length === 0)}
                            >
                                Add Operation
                            </Button>
                        </div>
                    </Form>
                </>
            )}

            <Modal
                title="Confirm Final Operation"
                open={isFinalModalVisible}
                onOk={confirmFinalOperation}
                onCancel={() => setIsFinalModalVisible(false)}
                okText="Yes, Confirm"
                cancelText="Cancel"
            >
                <p>Are you sure you want to confirm this operation?</p>
            </Modal>

            {viewFlow && (
                <div style={{ margin: "15px 10px 10px" }}>
                    <OperatingRoutingFlow processData={savedData} />
                </div>
            )}

            {/* {Object.keys(savedData).length > 0 && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                    <h3>Saved Data:</h3>
                    <pre>{JSON.stringify(savedData, null, 2)}</pre>
                </div>
            )} */}

            {/* {Object.keys(finalizedOperations).length > 0 && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                    <h3>Final Data:</h3>
                    <pre>{JSON.stringify(finalizedOperations, null, 2)}</pre>
                </div>
            )} */}
        </div>
    );
};



export default OperationRouting;
