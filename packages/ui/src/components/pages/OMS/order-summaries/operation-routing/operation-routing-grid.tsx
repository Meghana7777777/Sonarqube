import { EyeOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, ComponentModel, ProcessTypeEnum, OpFormEnum, OpVRawMaterial, OperationCategoryFormRequest, PoProdutNameRequest,  RawMaterialIdRequest, RmCompMapModel, ManufacturingOrderNumberRequest, SewVerIdRequest, SewVersionModel, SewVersionRequest, InsUomEnum, VendorCategoryEnum, VendorCategoryRequest, WarehouseIdRequest, processTypeEnumDisplayValues } from "@xpparel/shared-models";
import { OMSOperationMappingService, OperationService, PreIntegrationService, SewingMappingService, VendorService, WarehouseSharedService } from "@xpparel/shared-services";
import { Button, Col, Divider, Form, Input, Modal, Row, Select, Space, Switch, Table, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnProps } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import JobOrderFlow from "../../../SPS/components/operation-mapping/JobOrderFlowChart";
const { Option } = Select


interface OperationModel {
    opCode: string;
    opName: string;
    eOpCode: string;
    opCategory: ProcessTypeEnum;
    opForm: OpFormEnum;
    opSeq: number;
    group: string;
    smv?: number;
    rawMaterial?: string;
}

// enum OperationFormEnum{
//     PANEL ='PANEL',
//     SEMI_GARMENT ='SEMI_GARMENT',
//     GARMENT ='GARMENT'
// }





enum UOMEnum {
    CM = "CM",
    MTR = "MTR",
    YRD = "YRD",
    INCH = "INCH",
    MM = "MM",
    KG = "KG",
    TON = "TON"
}

// export enum SampleWarehouseEnum {
//     WAREHOUSE_1 = 'Warehouse_1',
//     WAREHOUSE_2 = 'Warehouse_2',
//     WAREHOUSE_3 = 'Warehouse_3',
//     WAREHOUSE_4 = 'Warehouse_4',
// }




// export enum SampleExtProcessEnum {
//     VENDOR_1 = 'Vendor_1',
//     VENDOR_2 = 'Vendor_2',
//     VENDOR_3 = 'Vendor_3',
//     VENDOR_4 = 'Vendor_4',
// }



interface OpGroupModel {
    group: string;
    sequence: number;
    depGroups: string[];
    operations: string[];
    components: string[];
    itemCode?: string;
    groupCategory: ProcessTypeEnum;
    jobtype?: string;
    warehouse?: string;
    extProcessing?: string;
    opForm?: OpFormEnum;
}


interface IProps {
    // poSerial: number;
    manufacturingOrderNo: string;
    productName: string
    components: string[]
    rmComps: RmCompMapModel[]
}

interface IProductComponentProps {
    orderIdPk: number;
    manufacturingOrderNo: string;
}


const OperationRoutingGrid = (props: IProps) => {
    const [form] = Form.useForm();
    const [opGroupsForm] = Form.useForm();
    const [pageForm] = Form.useForm();
    const [opVersionData, setOpVersionData] = useState<OperationModel[]>([]);
    const [opFormData, setOpFormData] = useState<OperationModel[]>([]);
    const [opCodesData, setOpCodesData] = useState<OperationModel[]>([]);
    const [opGroupsData, setOpGroupsData] = useState<OpGroupModel[]>([]);
    const [updateState, setUpdateState] = useState<number>(0);
    const [btnDisableFlag, setBtnDisableFlag] = useState<boolean>(false);
    const [confirmBtnFlag, setConfirmBtnflag] = useState<boolean>(false);
    const [componentsData, setComponentsData] = useState<string[]>([]);
    const [isOpSeqExists, setIsOpSeqExists] = useState<boolean>(false);
    const [opVersionId, setOpVersionId] = useState<number>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [opCodeData, setOpCode] = useState<any[]>([]);
    const [selectedOpCode, setSelectedOpCode] = useState<string>('');
    // const [selectedOperationForm, setSelectedOperationForm] = useState<OpFormEnum>();
    const [warehouses, setWarehouses] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
    const [flowChartData, setFlowchartData] = useState<SewVersionModel>();
    const [materialData,setMaterialdata] = useState<Map<string, string[]>>()


    const [isPopoverVisible, setIsPopoverVisible] = useState<Map<string, boolean>>(new Map());
    const [materials, setMaterials] = useState<Map<string, OpVRawMaterial[]>>(new Map());



    const user = useAppSelector((state) => state.user.user.user);

    const sewMappingService = new OMSOperationMappingService();
    const opService = new OperationService()
    const vendorService = new VendorService()
    const warehouseService = new WarehouseSharedService()
    const intService = new PreIntegrationService()

    const getSewDataOpCode = async (iOpCode: string, opVersionId: number) => {
        const req = new RawMaterialIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, iOpCode, opVersionId)
        const res = await sewMappingService.getSewDataOpCode(req)
        res.status ? setOpCode(res.data) : setOpCode([])
    }



    // useEffect(() => {
    //     const reqobj = new WarehouseIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
    //     warehouseService.getWarehouse(reqobj).then(
    //         (res) => {
    //             console.log(res.data, "warehouses")
    //             setWarehouses(res.data)
    //         }
    //     ).catch((err) => {
    //         throw err
    //     })
    // }, [])

    useEffect(() => {
        if (props) {
            setComponentsData(props.components)
            getSewVersionForPoProductName(0, props?.productName, props.manufacturingOrderNo);
        }
    }, [])

    useEffect(() => {
        const opversiondata = new SewVersionModel(null, "verisonname", "description", opVersionData, opGroupsData, props.productName, 0)

        console.log(opversiondata, "Trims required")
    }, [opVersionData, opGroupsData])
    const itemCategoriesMap = new Map<string, string[]>();


    useEffect(() => {
     const req= new ManufacturingOrderNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,[props.manufacturingOrderNo])
     intService.getManufacturingorderInfoForTrims(req).then(
                (res) => {
                    res.data?.manufacturingOrderItemsData?.forEach((item) => {
                        const { itemCategory, itemCode } = item;
                        
                        if (!itemCategoriesMap?.has(itemCategory)) {
                          itemCategoriesMap?.set(itemCategory, []);
                        }
                        
                        const existingItemCodes = itemCategoriesMap?.get(itemCategory);
                        if (existingItemCodes && !existingItemCodes?.includes(itemCode)) {
                          existingItemCodes.push(itemCode);
                        }
                      });
                      setMaterialdata(itemCategoriesMap)

                    
                }
            ).catch((err) => {
                AlertMessages.getErrorMessage(err)
            })
    }, [])
    

    const showModal = (opCode, opVersionId) => {
        console.log(opCode, "hjkjhb")
        if (isOpSeqExists) {
            getSewDataOpCode(opCode, opVersionId)

        }
        else {
            setSelectedOpCode(opCode)
        }
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };



    const handleToggle = (checked: boolean, opCode: string) => {
        if (!opCode) {
            AlertMessages.getErrorMessage('Please select OpCode');
            return;
        }

        const toggle = new Map(isPopoverVisible);

        if (checked) {
            toggle.set(opCode, true);

            const material = new Map(materials);
            material.set(opCode, [new OpVRawMaterial(undefined, undefined, undefined, undefined, opCode)]);
            setMaterials(material);
        } else {
            toggle.delete(opCode);
            const material = new Map(materials);
            material.delete(opCode);
            materials.delete(opCode);
            setMaterials(material);
        }

        setIsPopoverVisible(toggle);
    };



    const handleItemGroupChange = (index: number, value: string, opCode: string) => {
        setMaterials((prevMaterials) => {
            const mat = prevMaterials.has(opCode) ? [...prevMaterials.get(opCode)] : [];  // Create a new array

            mat[index] = { ...mat[index], product: value };  // Create a new object for the specific index
            prevMaterials.set(opCode, mat);

            return new Map(prevMaterials); // Ensure you return a new map
        });
    };

    const handleItemChange = (index: number, value: string, opCode: string) => {
        setMaterials((prevMaterials) => {
            const mat = prevMaterials.has(opCode) ? [...prevMaterials.get(opCode)] : [];

            mat[index] = { ...mat[index], productType: value };
            prevMaterials.set(opCode, mat);

            return new Map(prevMaterials);
        });
    };

    const handleQuantityChange = (index: number, value: string, opCode: string) => {
        setMaterials((prevMaterials) => {
            const mat = prevMaterials.has(opCode) ? [...prevMaterials.get(opCode)] : [];

            mat[index] = { ...mat[index], consumption: value };
            prevMaterials.set(opCode, mat);

            return new Map(prevMaterials);
        });
    };

    const handleUomChange = (index: number, value: InsUomEnum, opCode: string) => {
        setMaterials((prevMaterials) => {
            const mat = prevMaterials.has(opCode) ? [...prevMaterials.get(opCode)] : [];

            mat[index] = { ...mat[index], uom: value };
            prevMaterials.set(opCode, mat);

            return new Map(prevMaterials);
        });
    };


    const handleAddRow = (opCode: string) => {
        setMaterials((prevMaterials) => {
            const updatedMaterials = new Map(prevMaterials);
            const mat = updatedMaterials.get(opCode) || [];
            mat.push(new OpVRawMaterial(undefined, undefined, undefined, undefined, opCode));

            updatedMaterials.set(opCode, mat);

            return updatedMaterials;
        });
    };


    const handleDeleteRow = (index: number, opCode: string) => {
        setMaterials((prevMaterials) => {
            const updatedMaterials = new Map(prevMaterials);

            const mat = updatedMaterials.get(opCode) || [];

            const newMaterials = mat.filter((_, i) => i !== index);

            updatedMaterials.set(opCode, newMaterials);

            return updatedMaterials;
        });

        // setIsPopoverVisible((prevState) => {
        //     const updatedPopoverState = new Map(prevState);
        //     updatedPopoverState.set(opCode, false);
        //     return updatedPopoverState;
        // });

    };





    const handleSave = (opCode: string) => {
        const isValid = materials.get(opCode).every(
            (material) => material.productType && material.product && material.consumption && material.uom
        );

        if (!isValid) {
            AlertMessages.getErrorMessage('Please fill all fields before saving.');
            return;
        }
        const toggle = new Map(isPopoverVisible);
        toggle.set(opCode, false);
        setIsPopoverVisible(toggle);
        setIsModalOpen(false)
    };


    const AddPopoverContent = (opCode: string) => (
        <div style={{ width: '1000px' }}>
            {/* <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Raw Materials</h4>
            <hr></hr> */}
            {materials.get(opCode)?.map((material, index) => (
                <div key={index} style={{ marginBottom: '0px' }}>
                    <Row gutter={[16, 16]} align="middle" justify="start" style={{ marginBottom: "15px", marginLeft: '20px' }}>
                        <Col span={4}>
                            {index === 0 && (
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '14px' }} >
                                    Item Group:
                                </label>
                            )}
                            <Select
                                allowClear
                                placeholder="Select Item Group"
                                value={material.product || undefined}
                                onChange={(value) => handleItemGroupChange(index, value, opCode)}
                                style={{ width: '100%' }}
                            >
                                {Array.from(materialData.keys()).map((product) => (
                                    <Select.Option key={product} value={product}>
                                        {product}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>

                        <Col span={4}>
                            {index === 0 && (
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '14px' }} >
                                    Item Type:
                                </label>
                            )}
                            <Select
                                allowClear
                                placeholder="Select Material"
                                value={material.productType || undefined}
                                onChange={(value) => handleItemChange(index, value, opCode)}
                                style={{ width: '100%' }}
                            >
                                {materialData.get(materials.get(opCode)[index].product)?.map((materialType) => (
                                    <Select.Option key={materialType} value={materialType}>
                                        {materialType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>

                        <Col span={4}>
                            {index === 0 && (
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '14px' }} >
                                    Consumption:
                                </label>
                            )}
                            <Input
                                placeholder="Quantity"
                                type="number"
                                value={material.consumption}
                                onChange={(e) => handleQuantityChange(index, e.target.value, opCode)}
                                style={{ width: '100%' }}
                            />
                        </Col>

                        <Col span={4}>
                            {index === 0 && (
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '14px' }} >
                                    UOM :
                                </label>
                            )}
                            <Select
                                allowClear
                                placeholder="Select Unit of Measurement"
                                value={material.uom || undefined}
                                onChange={(value) => handleUomChange(index, value, opCode)}
                                style={{ width: '100%' }}
                            >
                                {Object.values(UOMEnum)?.map((productType) => (
                                    <Select.Option key={productType} value={productType}>
                                        {productType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8} style={{ textAlign: 'center' }}>

                            {index === 0 && (
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '14px' }} >
                                    Action:
                                </label>
                            )}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Button onClick={() => handleAddRow(opCode)} >+ Add Item</Button>

                                <Button disabled={index === 0} onClick={() => handleDeleteRow(index, opCode)} danger style={{ marginRight: '10px' }}>Delete</Button>

                            </div>
                        </Col>
                    </Row>
                </div>
            ))}
            <div style={{ paddingTop: '20px' }}>
                <Button type="primary" onClick={() => handleSave(opCode)} style={{ marginRight: '10px' }} >Save</Button>
                <Button onClick={() => handleClose(opCode)}>Close</Button>
            </div>
        </div>
    );

    const opsCodeColumns = [

        {
            title: 'OpCode',
            dataIndex: 'iOpCode',
            key: 'iOpCode',
        },
        {
            title: 'Item',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Item Type',
            dataIndex: 'productType',
            key: 'productType',
        },
        {
            title: 'Quantity',
            dataIndex: 'consumption',
            key: 'consumption',
        },
        {
            title: 'UOM',
            dataIndex: 'uom',
            key: 'uom',
        },
        {
            title: 'Op Version ID',
            dataIndex: 'opVersionId',
            key: 'opVersionId',
        },
    ];

    const ViewPopoverContent = (opCode: string) => {
        return (

            isOpSeqExists ? (
                <div style={{ margin: '10px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '20px', marginLeft: "-115px" }}>View Raw Materials</h4>
                    <Table
                        dataSource={opCodeData}
                        columns={opsCodeColumns}
                        rowKey="id"
                    />
                    <Button style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }} onClick={handleViewCardClose}>Close</Button>

                </div>)
                : (
                    <div style={{ width: '1000px' }}>
                        {/* <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Update  Raw Materials</h4>
                    <hr></hr> */}
                        {materials.get(selectedOpCode)?.map((material, index) => (
                            <div key={index} style={{ marginBottom: '0px' }}>
                                <Row gutter={[16, 16]} align="middle" justify="start" style={{ marginBottom: "15px", marginLeft: '20px' }}>
                                    <Col span={4}>
                                        {index === 0 && (
                                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '14px' }} >
                                                Item Group:
                                            </label>
                                        )}
                                        <Select
                                            allowClear
                                            placeholder="Select Item Group"
                                            value={material.product || undefined}
                                            onChange={(value) => handleItemGroupChange(index, value, opCode)}
                                            style={{ width: '100%' }}
                                        >
                                            {Array.from(materialData.keys()).map((product) => (
                                                <Select.Option key={product} value={product}>
                                                    {product}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Col>

                                    <Col span={4}>
                                        {index === 0 && (
                                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '14px' }} >
                                                Item Type:
                                            </label>
                                        )}
                                        <Select
                                            allowClear
                                            placeholder="Select Material"
                                            value={material.productType || undefined}
                                            onChange={(value) => handleItemChange(index, value, opCode)}
                                            style={{ width: '100%' }}
                                        >
                                            {materialData.get(materials.get(opCode)[index].product)?.map((materialType) => (
                                                <Select.Option key={materialType} value={materialType}>
                                                    {materialType}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Col>

                                    <Col span={4}>
                                        {index === 0 && (
                                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '14px' }} >
                                                Consumption:
                                            </label>
                                        )}
                                        <Input
                                            placeholder="Quantity"
                                            type="number"
                                            value={material.consumption}
                                            onChange={(e) => handleQuantityChange(index, e.target.value, opCode)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>

                                    <Col span={4}>
                                        {index === 0 && (
                                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '14px' }} >
                                                UOM :
                                            </label>
                                        )}
                                        <Select
                                            allowClear
                                            placeholder="Select Item Group"
                                            value={material.uom || undefined}
                                            onChange={(value) => handleUomChange(index, value, opCode)}
                                            style={{ width: '100%' }}
                                        >
                                            {Object.values(UOMEnum)?.map((productType) => (
                                                <Select.Option key={productType} value={productType}>
                                                    {productType}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col span={8} style={{ textAlign: 'left' }}>

                                        {index === 0 && (
                                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '14px' }} >
                                                Action:
                                            </label>
                                        )}
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Button onClick={() => handleAddRow(opCode)} >+ Add Item</Button>
                                            {/* {index>0 &&( */}
                                            <Button onClick={() => handleDeleteRow(index, opCode)} danger style={{ marginRight: '10px' }}>Delete</Button>

                                            {/* )} */}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                        <div style={{ paddingTop: '20px' }}>
                            <Button type="primary" onClick={() => handleSave(selectedOpCode)} style={{ marginRight: '10px' }} >Save</Button>
                            <Button onClick={() => handleClose(selectedOpCode)}>Close</Button>
                        </div>
                    </div>)




        )
    };

    const handleClose = (opCode: string) => {
        const updatedVisibility = new Map(isPopoverVisible);
        updatedVisibility.set(opCode, false);
        setIsPopoverVisible(updatedVisibility);
        setIsModalOpen(false)

    };


    const handleViewCardClose = () => {
        setIsModalOpen(false)

    }


    const getSewVersionForPoProductName = (poSerial: number, productName: string, manufacturingOrderNo: string) => {
        const req = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, productName, null, null, manufacturingOrderNo)
        sewMappingService.getSewVersionForPoProductName(req)
            .then((res) => {
                if (res.status) {
                    setOpVersionData(res.data[0].operations);
                    setOpGroupsData(res.data[0].opGroups);
                    setIsOpSeqExists(true)
                    pageForm.setFieldsValue({ version: res.data[0].version })
                    pageForm.setFieldsValue({ description: res.data[0].description })
                    setOpVersionId(res.data[0].id)
                } else {
                    setOpVersionId(undefined);
                    setIsOpSeqExists(false)
                    setOpGroupsData([])
                    setOpVersionData([{
                        opCode: null,
                        eOpCode: null,
                        opName: null,
                        opCategory: null,
                        opForm: null,
                        opSeq: null,
                        group: null,
                        smv: null,
                    }]);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });

    }


    const handleOperationFormChange = (value: OpFormEnum) => {
        // setSelectedOperationForm(value)
        const opreq = new OperationCategoryFormRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, value)
        opService.getOperationsByOperationForm(opreq)
            .then((res) => {
                if (res.status) {
                    setOpCodesData(res.data);
                } else {
                    setOpCodesData([]);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }
    const handleOpChange = (val, record, index) => {
        // const selOpcode = opVersionData.filter(item => item.opCode == val)
        // if (selOpcode.length > 0) {
        //     form.setFieldsValue({ [`opCode${index}`]: null })
        //     opVersionData[index].opCode = null
        //     setOpVersionData([...opVersionData])
        //     // AlertMessages.getWarningMessage('Same operation code existed')
        // } else {
        opVersionData[index].opCategory = record?.opData.opCategory
        opVersionData[index].opForm = record?.opData.opForm
        opVersionData[index].opName = record?.opData.opName
        opVersionData[index].smv = record?.opData.smv
        opVersionData[index].opCode = record?.opData.opCode
        opVersionData[index].opSeq = index + 1
        setOpVersionData([...opVersionData])
        setUpdateState(prev => prev + 1)
        // }

    }

    const handleGroupChange = (val, option, index, record) => {
        const selGroups = opVersionData.filter(item => item.group == val)
        if (selGroups.length == 2) {
            AlertMessages.getWarningMessage('Same group should not allowed for morethan 2 operation categories')
            opVersionData[index].group = null
            form.setFieldsValue({ [`group${index}`]: null })
            setOpVersionData([...opVersionData])
        } else if (selGroups.length == 1 && selGroups[0].opCategory != record.opCategory) {
            AlertMessages.getWarningMessage('Operation category must be same for all operation under a group')
            opVersionData[index].group = null
            form.setFieldsValue({ [`group${index}`]: null })
            setOpVersionData([...opVersionData])
        } else {
            opVersionData[index].group = val
            setOpVersionData([...opVersionData])
        }

    }

    const handleSmvChange = (e, index) => {
        const updatedOpVersionData = [...opVersionData];
        updatedOpVersionData[index].smv = e.target.value;
        setOpVersionData(updatedOpVersionData);
    }

    const handleDepGroupChange = (record, val, index, group) => {
        const isGreaterGroupSelected = record.some(value => { return value >= group })
        if (isGreaterGroupSelected) {
            AlertMessages.getWarningMessage('Next operation will not be the dependent group')
            opGroupsForm.setFieldsValue({ [`depGroups${index}`]: [] })
            setOpGroupsData([...opGroupsData])
        } else {
            opGroupsData[index].depGroups = record
            setOpGroupsData([...opGroupsData])
        }
    }

    const handleComponentChange = (record, val, index) => {
        opGroupsData[index].components = record
        setOpGroupsData([...opGroupsData])
    }

    const handleItemCodeChange = (record, val, index) => {
        if (record) {
            opGroupsData[index].itemCode = record; // Update the itemCode for the specific row
            console.log(getComponentsByItemCode(record).map((record1) => record1.compName), record, "gyhjkl")
            opGroupsData[index].components = getComponentsByItemCode(record).map((record1) => record1.compName)
            setOpGroupsData([...opGroupsData])
            console.log(opGroupsData, "hjh")
        }
        else {
            opGroupsData[index].itemCode = null; // Update the itemCode for the specific row
            // console.log(getComponentsByItemCode(record)?.map((record1)=>record1.compName),record,"gyhjkl")

            opGroupsData[index].components = null;
            setOpGroupsData([...opGroupsData])

        }
    };




    const operationColumns: ColumnProps<any>[] = [
        {
            key: 'opCode',
            title: 'Op Code',
            align: 'center',
            dataIndex: "opCode",
            render: (text, record, index) => (
                isOpSeqExists ? <>{text}</> :
                    <>

                        <div
                            style={{ display: 'flex', gap: '10px' }}
                        >

                            <Select
                                allowClear
                                placeholder="Select Operation Form"
                                defaultValue={record.opForm}

                                onChange={(value) => handleOperationFormChange(value)}
                            >
                                {Object.values(OpFormEnum)?.map((product) => (
                                    <Select.Option key={product} value={product}>
                                        {product}
                                    </Select.Option>
                                ))}
                            </Select>

                            <Select
                                allowClear
                                placeholder={'Select Op Code'}
                                defaultValue={record.opCode}
                                onChange={(record, value) => handleOpChange(record, value, index)}
                            >
                                {opCodesData?.map((opInfo) => (
                                    <Option key={opInfo.opCode} opData={opInfo} value={opInfo.opCode}>
                                        {opInfo.opCode}
                                    </Option>
                                ))}
                            </Select>
                        </div>


                    </>
            )
        },
        {
            key: 'opCategroy',
            title: 'Op Category',
            align: 'center',
            dataIndex: "opCategory",
            render: (value) => {
                if (opVersionData) {
                    return value
                }
                return processTypeEnumDisplayValues[value];
            }
        },
        ...(isOpSeqExists ? [{
            key: 'opForm',
            title: 'Op Form',
            dataIndex: "opForm",
        }] : []),

        {
            key: 'opName',
            title: 'Op Name',
            align: 'center',
            dataIndex: "opName",
        },
        {
            key: 'smv',
            title: 'SMV',
            align: 'center',
            dataIndex: 'smv',
            width: '10%',
            render: (text, record, index) => (
                <span>
                    {isOpSeqExists ? (
                        <>{text}</>
                    ) : record.opCode ? (
                        <Form.Item name={['smv', index]} className="mb-0">
                            <Input
                                placeholder="smv"
                                defaultValue={record.smv}
                                onChange={(value) => handleSmvChange(value, index)}
                            />
                        </Form.Item>
                    ) : null}
                </span>
            )
        },
        {
            key: 'opSeq',
            title: 'Op Sequence',
            align: 'center',
            dataIndex: "opSeq",
        },
        {
            key: 'group',
            title: 'Job Group',
            align: 'center',
            dataIndex: "group",
            render: (text, record, index) => {
                return <>
                    <span>{isOpSeqExists ? <>{text}</> :
                        record.opCode ?
                            <Form form={form}>
                                <Form.Item
                                    name={`group${index}`}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing Group',
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        placeholder={'Group'}
                                        style={{ width: '120px' }}
                                        defaultValue={record.group}
                                        onChange={(value, option) => handleGroupChange(value, option, index, record)}
                                    >
                                        {Array.from({ length: opVersionData.length }, (_, index) => index + 1)?.map((number) => (
                                            <Option key={number} value={String(number)}>
                                                {number}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Form>
                            : null}


                    </span>
                </>
            }
        },
        {
            key: 'rawMaterial',
            title: 'Trims Required',
            align: 'center',
            dataIndex: "rawMaterial",
            render: (text, record, index) => {
                return (
                    <div style={{ textAlign: 'center', position: 'relative', display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                        {isOpSeqExists ? null : (<div style={{ marginBottom: '10px' }}>
                            <Switch
                                checked={isPopoverVisible.has(record.opCode)}
                                onChange={(checked) => handleToggle(checked, record.opCode)}
                                checkedChildren="ADD"
                                unCheckedChildren="NO"
                            />
                        </div>)}

                        {isPopoverVisible.get(record.opCode) && (
                            <Modal
                                open={isPopoverVisible.get(record.opCode)}
                                title={
                                    <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                                        Add Raw Materials
                                        <hr></hr>
                                    </div>
                                }
                                onCancel={() => handleClose(record.opCode)}
                                footer={null}
                                width="1100px"
                                bodyStyle={{
                                    padding: '20px',
                                }}
                            >
                                {AddPopoverContent(record.opCode)}
                            </Modal>
                        )}
                        {/* jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj */}
                        <div>
                            {isOpSeqExists ? (
                                <div>
                                    <Button type='link' onClick={() => showModal(record.opCode, opVersionId)} icon={<EyeOutlined />}>View</Button>
                                    {isModalOpen && !isPopoverVisible.get(record.opCode) &&

                                        <div
                                            style={{
                                                position: 'fixed',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                zIndex: 1000,
                                                background: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                width: '46%'
                                            }}
                                        >
                                            {ViewPopoverContent(record.opCode)}
                                        </div>}
                                </div>

                            ) : (
                                <div>
                                    {isPopoverVisible.has(record.opCode) ? (
                                        <div>
                                            <Button type="primary" onClick={() => showModal(record.opCode, opVersionId)}  >   Edit </Button>

                                            {isModalOpen &&

                                                <Modal
                                                    open={isModalOpen}
                                                    title={
                                                        <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                                                            Edit Raw Materials
                                                            <hr></hr>
                                                        </div>
                                                    }
                                                    onCancel={() => handleClose(selectedOpCode)}
                                                    footer={null}
                                                    width="1100px"
                                                    bodyStyle={{
                                                        padding: '20px',
                                                    }}
                                                >
                                                    {ViewPopoverContent(selectedOpCode)}
                                                </Modal>}
                                        </div>

                                    ) : (<></>)}
                                </div>
                            )}


                        </div>
                    </div>
                );
            }
        },
        (isOpSeqExists) ? <></> :
            {
                key: 'action',
                title: 'Action',
                align: 'center',
                // dataIndex: "group",
                render: (text, rec, index) => {
                    return <>{
                        (opVersionData.length - 1) === (index) ?
                            <span>
                                <Row>
                                    <Space><Button disabled={btnDisableFlag} icon={<PlusOutlined />} className="btn-green" danger onClick={e => addRow(index)} type="primary" />
                                        <Button disabled={btnDisableFlag} danger icon={<MinusOutlined />} onClick={e => RemoveRow(index, rec)} type="primary" />
                                    </Space>
                                </Row>
                            </span>
                            : <></>}</>
                }

            }



    ]
    // return operationColumns

    // }


    const ItemCodeArray = [
        ...(props.rmComps)
    ]

    const itemCodeComponents = {
        I001: ["CMP1", "CMP2", "CMP3"],
        I002: ["CMP4", "CMP5", "CMP6"],
        I003: ["CMP7", "CMP8", "CMP9"]

    }

    const handleProcessTypeChange = async (value, index) => {
        try {
            const req = new VendorCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, value);



            const response = await vendorService.getAllVendorsByVendorCategory(req);

            if (response.status) {
                setOpGroupsData((prevState) =>
                    prevState?.map((item, idx) =>
                        idx === index
                            ? {
                                ...item,
                                processType: value,
                                vendorOptions: response.data,
                                extProcessing: null
                            }
                            : item
                    )
                );
            } else {
                AlertMessages.getErrorMessage(response.internalMessage);
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }
    };

    const getComponentsByItemCode = (itemCode): ComponentModel[] => {
        // Find the record that matches the given item code
        const item = props.rmComps.find(record => record.iCode === itemCode);

        if (item) {
            return item.components;
        } else {
            return null;
        }
    }
    const opGroupsColumns: ColumnProps<any>[] = [
        {
            key: 'opgroup',
            title: 'Job Group',
            align: 'center',
            dataIndex: "group",
        },
        {
            key: 'groupCategory',
            title: 'Job Type',
            align: 'center',
            dataIndex: "groupCategory",
        },
        {
            key: 'operations',
            title: 'Operations',
            align: 'center',
            dataIndex: "groupCategory",
            render: (text, record) => <>{record.operations?.toString()}</>,
        },
        {
            key: 'dependentGroup',
            title: 'Dependent Group',
            align: 'center',
            dataIndex: "depGroups",
            render: (text, item, index) => {
                return (
                    <>
                        {index !== 0 ? (
                            <>
                                {isOpSeqExists ? (
                                    <>{text?.map(c => <Tag color="orange">{c}</Tag>)}</>
                                ) : (
                                    <span>
                                        <Form form={opGroupsForm}>
                                            <Form.Item
                                                name={`depGroups${index}`}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Missing Dependent Group',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Select Dependent Group"
                                                    style={{ width: '200px' }}
                                                    mode="multiple"
                                                    allowClear
                                                    defaultValue={item.depGroups}
                                                    onChange={(record, value) => handleDepGroupChange(record, value, index, item.group)}
                                                >
                                                    {Array.from({ length: opGroupsData.length }, (_, index) => index + 1)?.map((number) => (
                                                        <Option key={number} value={String(number)}>
                                                            {number}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Form>
                                    </span>
                                )}
                            </>
                        ) : (
                            <>N/A</>
                        )}
                    </>
                );
            },
        },
        // {
        //     key: 'processType',
        //     title: 'Process Type',
        //     align: 'center',
        //     dataIndex: 'processType',
        //     render: (value, record, index) => (
        //         <>{isOpSeqExists ? (<div>{value ? value : '-'}</div>) :
        //             (
        //                 <Select
        //                     allowClear
        //                     value={value}
        //                     style={{ width: 130 }}
        //                     onChange={(val) => handleProcessTypeChange(val, index)}
        //                 >
        //                     {Object.values(ProcessTypeEnum)?.map((type) => (
        //                     {Object.values(ProcessTypeEnum)?.map((type) => (
        //                         <Option key={type} value={type}>
        //                             {type}
        //                         </Option>
        //                     ))}
        //                 </Select>)}
        //         </>
        //     ),
        // },
        {
            key: 'itemCode',
            title: 'Item Code',
            align: 'center',
            dataIndex: 'itemCode',
            render: (value, record, index) => (
                <>  {isOpSeqExists ? (
                    <>{value ? value : '-'}</>) : (<>
                        {record.groupCategory === ProcessTypeEnum.KNIT ? (
                            <Select
                                allowClear
                                placeholder="Select Item Code"
                                value={value}
                                onChange={(record, value) => handleItemCodeChange(record, value, index)}
                                style={{ width: 150 }}
                            // onChange={(val) => handleItemCodeChange(val, index)}
                            >
                                {ItemCodeArray.map((code) => (
                                    <Option key={code.iCode} value={code.iCode}>
                                        {code.iCode}
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            <div>{value ? value : '-'}</div>
                        )}</>)}
                </>
            ),
        },
        {
            key: 'components',
            title: 'Components',
            align: 'center',
            width: '30%',
            dataIndex: "components",
            render: (text, record, index) => (
                <>
                    {isOpSeqExists ? (
                        <>{text?.map(c => <Tag color="blue">{c}</Tag>)}</>
                    ) : (
                        <span>
                            {record.groupCategory === ProcessTypeEnum.KNIT ? (<>
                                {record.itemCode ? (
                                    <Form form={opGroupsForm}>
                                        <Form.Item
                                            name={`component${index}`}
                                            initialValue={getComponentsByItemCode(record.itemCode).map((record1) => record1.compName)}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Missing Components',
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Select Component"
                                                style={{ width: '450px' }}
                                                mode="multiple"
                                                value={getComponentsByItemCode(record.itemCode)?.map((record1) => record1.compName)} // Make sure components are selected by default
                                                disabled  // Disable the selection so the components are "frozen"
                                                onChange={(record, value) => handleComponentChange(record, value, index)}

                                            >
                                                {getComponentsByItemCode(record.itemCode)?.map((component) => (
                                                    <Option key={component.compName} value={component.compName}>
                                                        {component.compName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Form>) : (<></>)}</>
                            )
                                // :record.OpForm===OpFormEnum[OpFormEnum.GF]?(<></>)
                                : (

                                    <Form form={opGroupsForm}>
                                        <Form.Item
                                            name={`component${index}`}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Missing Components',
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Select Component"
                                                style={{ width: '450px' }}
                                                mode={opGroupsData[index].groupCategory !== ProcessTypeEnum.EMB ? 'multiple' : null}
                                                allowClear
                                                onChange={(record, value) => handleComponentChange(record, value, index)}
                                            >
                                                {componentsData?.map((info) => (
                                                    <Option key={info} value={info}>
                                                        {info}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Form>

                                )}
                        </span>
                    )}
                </>
            ),
        },

        // {
        //     key: 'warehouse',
        //     title: 'To Bank',
        //     align: 'center',
        //     dataIndex: 'warehouse',
        //     render: (value, record, index) => (
        //         <>
        //             {isOpSeqExists ? (<div>{value ? value : '-'}</div>) :
        //                 (
        //                     <div style={{ display: 'flex', alignItems: 'center' }}>
        //                         <Switch
        //                             checked={record.toWarehouse === true}
        //                             onChange={(checked) => handleSwitchChange('toWarehouse', index, checked)}
        //                             checkedChildren="YES"
        //                             unCheckedChildren="NO"
        //                         />
        //                         {record.toWarehouse === true && (
        //                             <Select
        //                                 allowClear
        //                                 value={record.warehouse || undefined}
        //                                 style={{ width: 130, marginLeft: 10 }}
        //                                 onChange={(val) => handleWarehouseChange(val, index)}
        //                             >
        //                                 {warehouses?.map((warehouse) => (
        //                                     <Option key={warehouse.id} value={warehouse.warehouseCode}>
        //                                         {warehouse.warehouseCode}
        //                                     </Option>
        //                                 ))}

        //                             </Select>
        //                         )}
        //                     </div>
        //                 )}</>)
        // },
        // {
        //     key: 'extProcessing',
        //     title: 'To External Processing',
        //     align: 'center',
        //     dataIndex: 'extProcessing',
        //     render: (value, record, index) => (
        //         <>
        //             {isOpSeqExists ? (<div>{value ? value : '-'}</div>) :

        //                 (<div style={{ display: 'flex', alignItems: 'center' }}>
        //                     <Switch
        //                         checked={record.toExtProcessing === true}
        //                         onChange={(checked) => handleSwitchChange('toExtProcessing', index, checked)}
        //                         checkedChildren="YES"
        //                         unCheckedChildren="NO"
        //                     />
        //                     {record.toExtProcessing === true && (
        //                         <Select
        //                             allowClear
        //                             value={record.extProcessing || undefined}
        //                             style={{ width: 130, marginLeft: 10 }}
        //                             onChange={(val) => handleExtProcessingChange(val, index)}
        //                             disabled={!record.processType}
        //                         >
        //                             {record.vendorOptions?.map((vendor) => (
        //                                 <Option key={vendor.id} value={vendor.vCode}>
        //                                     {vendor.vCode}
        //                                 </Option>
        //                             ))}
        //                         </Select>
        //                     )}
        //                 </div>
        //                 )}
        //         </>)
        // }
    ];


    const handleSwitchChange = (field, index, checked) => {
        // if(field==='toWarehouse'){}
        setOpGroupsData((prevState) =>
            prevState?.map((item, idx) =>
                idx === index
                    ? {
                        ...item,
                        [field]: checked,
                        [field.slice(2).toLowerCase()]: checked ? item[field.slice(2).toLowerCase()] || null : null,
                    }
                    : item
            )
        );
    };

    const handleWarehouseChange = (value, index) => {
        setOpGroupsData((prevState) =>
            prevState?.map((item, idx) =>
                idx === index
                    ? {
                        ...item,
                        warehouse: value,
                    }
                    : item
            )
        );
    };

    const handleExtProcessingChange = (value, index) => {
        setOpGroupsData((prevState) =>
            prevState?.map((item, idx) =>
                idx === index
                    ? {
                        ...item,
                        extProcessing: value,
                    }
                    : item
            )
        );
    };



    const addRow = (index) => {
        if (opVersionData[index].opSeq == null || opVersionData[index].opCode == null) {
            AlertMessages.getErrorMessage('Operation code should select to proceed')
        } else {
            setOpVersionData([...opVersionData, {
                opCode: null,
                eOpCode: null,
                opName: null,
                opCategory: null,
                opForm: null,
                opSeq: null,
                group: null,
                smv: null
            }]);
        }
        setUpdateState(prev => prev + 1)
    }
    const RemoveRow = (index, rowData) => {
        materials.delete(rowData.opCode)
        form.resetFields([`opCode${index}`, `group${index}`]);
        if (opVersionData.length > 1) {
            opVersionData.splice(index, 1);
            setOpVersionData([...opVersionData])
        }
        setUpdateState(prev => prev + 1)
    }

    const confirmOperation = () => {
        form.validateFields().then(() => {

            const hasEmptyData = (obj) => {
                return Object.values(obj).some(value => value === undefined || value === null);
            };

            materials.forEach((value, key) => {
                const allEmpty = value.some(item => hasEmptyData(item));

                if (allEmpty) {
                    materials.delete(key)
                    AlertMessages.getErrorMessage('There are some  operation codes without Materials ')

                }
            });
            setBtnDisableFlag(true)
            setConfirmBtnflag(true)
            let groupWiseOperations: OpGroupModel[] = []
            console.log(opVersionData, "Daataaaaa")
            opVersionData?.map((element, index) => {
                const findGroup = groupWiseOperations.find(i => i.group == element.group)
                if (!(findGroup)) {
                    console.log(element, "elemenjmkl")
                    const obj = {
                        group: element.group,
                        sequence: null,
                        depGroups: [],
                        operations: [element.opCode],
                        components: [],
                        groupCategory: element.opCategory,
                        opForm: element.opForm
                    }
                    if (index == 0) { // CHANGES BY SRI
                        obj.components = componentsData; // CHANGES BY SRI
                    }
                    groupWiseOperations.push(obj)
                } else {
                    groupWiseOperations.find(i => i.group == element.group).operations.push(element.opCode)
                }
            })
            setOpGroupsData(groupWiseOperations)
        }).catch((err) => {
            AlertMessages.getErrorMessage('some Info missing')
        })

    }
    const unConfirmOperation = () => {
        setBtnDisableFlag(false)
        setConfirmBtnflag(false)
        setOpGroupsData([])
        opGroupsForm.resetFields()
        pageForm.resetFields()

    }

    const saveSequence = (val) => {
        // createOpVersionForProduct
        opGroupsForm.validateFields().then(() => {
            pageForm.validateFields().then(() => {
                const verisonname = pageForm.getFieldValue('version')
                const description = pageForm.getFieldValue('description')
                const rawMaterials: OpVRawMaterial[] = [];
                materials.forEach(rec => {
                    rawMaterials.push(...rec)
                })
                const opversiondata = new SewVersionModel(null, verisonname, description, opVersionData, opGroupsData, props.productName, 0)

                const sewVersionReq = new SewVersionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.productName, 0, opversiondata, rawMaterials, props.manufacturingOrderNo);
                setFlowchartData(opversiondata)
                sewMappingService.createSewVersionForProduct(sewVersionReq)
                    .then((res) => {
                        if (res.status) {
                            AlertMessages.getSuccessMessage(res.internalMessage);
                            getSewVersionForPoProductName(0, props?.productName, props.manufacturingOrderNo);
                        } else {
                            AlertMessages.getErrorMessage(res.internalMessage);
                        }
                    })
                    .catch((err) => {
                        AlertMessages.getErrorMessage(err.message);
                    });
            }).catch((err) => {
                AlertMessages.getErrorMessage(err)

            })
        }).catch((err) => {
            AlertMessages.getErrorMessage(err)
        })
    }
    const resetAllData = () => {
        form.resetFields();
        unConfirmOperation();
        setOpVersionId(undefined);
        setIsOpSeqExists(false)
        setOpVersionData([{
            opCode: null,
            eOpCode: null,
            opName: null,
            opCategory: null,
            opForm: null,
            opSeq: null,
            group: null,
            smv: null
        }]);
    }
    const deleteSequence = () => {
        // deleteOpVersion
        const delOpReq = new SewVerIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, opVersionId)
        sewMappingService.deleteSewVersion(delOpReq)
            .then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    resetAllData();
                    //notify the response
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }

    const handlePreview = () => {
        
                const rawMaterials: OpVRawMaterial[] = [];
                materials.forEach(rec => {
                    rawMaterials.push(...rec)
                })
                const opversiondata = new SewVersionModel(null, "verisonname", "description", opVersionData, opGroupsData, props.productName, 0)

                // const sewVersionReq = new SewVersionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.productName, 0, opversiondata, rawMaterials, props.manufacturingOrderNo);
                setFlowchartData(opversiondata);
                setShowPreviewModal(true)
           
       
    }

    return (<>
        <Form form={form} >
            <Table
                rowKey={record => record.opCode}
                columns={operationColumns}
                dataSource={opVersionData}
                bordered
                scroll={{ x: true }}
                pagination={false}
                size='small'
            />
        </Form>
        {/* } */}
        <br />
        {isOpSeqExists ? <></> :
            <Row justify={"end"}>
                <Button disabled={confirmBtnFlag} onClick={e => confirmOperation()} type="primary" >
                    Confirm Operations
                </Button>
                <Divider type="vertical" />
                <Button danger disabled={!confirmBtnFlag} onClick={e => unConfirmOperation()} type="primary" >
                    Un Confirm
                </Button>
            </Row>
        }
        <br />
        {(opGroupsData.length > 0 || isOpSeqExists) ?
            <Table
                rowKey={record => record.group}
                columns={opGroupsColumns}
                dataSource={opGroupsData}
                bordered
                scroll={{ x: true }}
                pagination={false}
                size='small'
            />
            : <></>}
        <br />
        {opGroupsData.length > 0 ?
            <Form form={pageForm} >
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item name="version" label="Version" rules={[
                            {
                                required: true,
                                message: 'Missing Version',
                            },
                        ]}>
                            <Input placeholder="only 20 characters are accepted" disabled={isOpSeqExists ? true : false} maxLength={20} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="description" label="Version Description" rules={[
                            {
                                required: true,
                                message: 'Missing Description',
                            },
                        ]}>
                            <TextArea rows={1} disabled={isOpSeqExists ? true : false} placeholder="only 30 characters are accepted" maxLength={30} />
                        </Form.Item>
                    </Col>
                    {!isOpSeqExists ?
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button type="primary" onClick={handlePreview}>
                                Preview
                            </Button>

                            <Button className="btn-green"
                                // disabled={confirmbtnflag}
                                onClick={e => saveSequence(e)} type="primary" >
                                Save Sequence
                            </Button>
                            <Divider type="vertical" />
                        </div>
                        :
                        <div style={{ display: 'flex', gap: '10px' }}>

                            <Button type="primary" onClick={handlePreview}>
                                Preview
                            </Button>
                            <Button danger onClick={e => deleteSequence()} type="primary" >
                                Delete Sequence
                            </Button>
                        </div>
                    }
                </Row>
            </Form>
            : <></>}

        <Modal width={1200} open={showPreviewModal} onCancel={() => setShowPreviewModal(false)} onOk={() => setShowPreviewModal(false)}>
            <JobOrderFlow jobOrderFlowData={flowChartData}></JobOrderFlow>
        </Modal>

    </>)
}
export default OperationRoutingGrid;