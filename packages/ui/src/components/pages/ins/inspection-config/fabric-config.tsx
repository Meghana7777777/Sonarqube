import { CommonRequestAttrs, FGItemCategoryEnum, InsConfigFabValModel, InsFabInsConfigModel, InsFabInsConfigRequest, InsFabricInspectionRequestCategoryEnum, InsFabricInspectionRequestCategoryEnumDisplayValue, InsInspectionRollSelectionTypeEnum, InsSupplierCodeRequest, InsTypesEnumType, PhItemCategoryEnum, SupplierInfoModel } from "@xpparel/shared-models";
import { InspectionConfigService, SupplierServices } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Input, message, notification, Select, Table } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
const { Option } = Select;
interface InspectionItem {
    key: string;
    label: string;
    selected: boolean;
    perc: number | "";
    materialReady: boolean;
    insType: InsTypesEnumType
    insSelectionType: InsInspectionRollSelectionTypeEnum;
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum
}

const InspectionConfig: React.FC = () => {
    const [fabricData, setFabricData] = useState<InspectionItem[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<string>(null);
    const [pendingPosData, setPendingPosData] = useState<SupplierInfoModel[]>([]);
    const user = useAppSelector((state) => state.user.user.user);
    const [data, setData] = useState<InsFabInsConfigModel[]>([]);
    const [initialData, setInitialData] = useState<InspectionItem[]>([]);
    const service = new InspectionConfigService();
    const supplierServices: SupplierServices = new SupplierServices()

    useEffect(() => {
        // Mock Data (Replace with API Call)
        const initialData: InspectionItem[] = Object.entries(InsFabricInspectionRequestCategoryEnum).map(
            ([key, value]) => {
                const isShadeInspection = key === InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION;
                return {
                    key,
                    label: InsFabricInspectionRequestCategoryEnumDisplayValue[
                        value as keyof typeof InsFabricInspectionRequestCategoryEnumDisplayValue
                    ],
                    selected: isShadeInspection,
                    perc: isShadeInspection ? 100 : 0,
                    materialReady: isShadeInspection,
                    insType: value,
                    insSelectionType: isShadeInspection ? 'SYSTEMATIC' : InsInspectionRollSelectionTypeEnum[0],
                    itemCategory: PhItemCategoryEnum.FABRIC
                };
            }
        );
        setInitialData(initialData);
        setFabricData(initialData);
        getPendingSupplierPoData();

    }, []);

    const getPendingSupplierPoData = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        supplierServices
            .getAllSuppliersData(req)
            .then((res) => {
                if (res.status) {
                    setPendingPosData(res.data);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const getData = async (updatedSupplierCode?: string) => {
        const req = new InsSupplierCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, updatedSupplierCode?.toString(), undefined, PhItemCategoryEnum.FABRIC);
        console.log(req, selectedSupplier)
        const res = await service.getFabInsConfig(req);
        if (res.status) {
            // console.log(res.data);
            if (res.data.length) {
                setData(res.data);
                const data = transform(res.data);
                setFabricData(data);
            } else {
                setFabricData(initialData);
            }
        } else {
            setFabricData(initialData);
        }
        // console.log(res);
    }

    const transform = (data: InsFabInsConfigModel[]): InspectionItem[] => {
        return data[0].insConfigs.map(item => ({
            key: item.insType,
            label: item.insType,
            selected: item.selected,
            perc: item.pickPerc,
            materialReady: item.requiredForMaterialReady,
            insType: item.insType,
            insSelectionType: item.insSelectionType,
            itemCategory: item.itemCategory
        }))
    }

    const generateFabInsConfigRequest = (fabricData: InspectionItem[]): InsConfigFabValModel[] => {
        return fabricData.map(item => ({
            id: 0,
            insType: item.key as InsTypesEnumType,
            pickPerc: item.perc !== "" ? Number(item.perc) : 0,
            requiredForMaterialReady: item.materialReady,
            selected: item.selected,
            supplierCode: selectedSupplier ? selectedSupplier : '',
            buyerCode: '',
            insSelectionType: item.insSelectionType,
            insConfigItems: [],
            plRefId: undefined,
            itemCategory: item.itemCategory
        }));
    };





    const handleCheckboxChange = (key: string) => {
        setFabricData((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handleInputChange = (key: string, value: string) => {
        const parsedValue = parseFloat(value);
        setFabricData((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, perc: isNaN(parsedValue) ? "" : parsedValue } : item
            )
        );
    };

    const handleSupplierChange = (value: string) => {
        setSelectedSupplier(value);
        // console.log("vallue ",value)
        if (value) {
            getData(value);
        }

    };



    const handleMaterialReadyChange = (key: string) => {
        setFabricData((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, materialReady: !item.materialReady } : item
            )
        );
    };

    const handleInsTypeChange = (key: string, insSelectionType: InsInspectionRollSelectionTypeEnum) => {
        // console.log('instypeeeeeeeeeee', key, insSelectionType); // Debugging
        setFabricData((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, insSelectionType } : item
            )
        );
    };





    const onSave = async () => {
        console.log("from onSave", fabricData);
        const data = generateFabInsConfigRequest(fabricData);
        // console.log("data", data);
        const req = new InsFabInsConfigRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedSupplier ? selectedSupplier.toString() : "", data, undefined, PhItemCategoryEnum.FABRIC);
        console.log('reqqqqqqqqqq', req);
        const res = await service.saveFabInsConfig(req);
        if (res.status) {
            // console.log("Data Saved Successfully");
            notification.success({ message: "Data Saved Successfully" });
        }
        else {
            // console.log("Data Not Saved");
            notification.error({ message: res.internalMessage });
        }
        console.log(data);
    }

    return (
        <>
            <Card title="Fabric Inspection Configuration" style={{ width: "100%" }}>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ marginRight: 8 }}>Select Supplier Code:</label>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select Supplier"
                        onChange={handleSupplierChange}
                        value={selectedSupplier}
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) => (option!.children as unknown as string).toString().toLocaleLowerCase().includes(input.toLocaleLowerCase())}>
                        {pendingPosData.map((data) => {
                            return <Option value={data.supplierCode}>{data.supplierCode}-{data.supplierName}</Option>
                        })}
                    </Select>
                </div>
                <Table
                    dataSource={fabricData}
                    pagination={false}
                    rowKey="key"
                    size="small"
                    style={{ border: '10px' }}
                    onRow={(record) => {
                        const isShadeInspection = record.insType === InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION;;
                        return {
                            style: isShadeInspection
                                ? {
                                    pointerEvents: "none",
                                    opacity: 0.8,
                                    backgroundColor: "#e9f4ef",
                                    color: "black",
                                }
                                : {}

                        }
                    }}
                    columns={[
                        {
                            title: "Select",
                            dataIndex: "selected",
                            align: 'center',
                            render: (_, record) => {
                                const isShadeInspection = record.insType === InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION;

                                return (
                                    <Checkbox
                                        checked={record.selected || isShadeInspection} 
                                        onChange={() => handleCheckboxChange(record.key)}
                                    />
                                );
                            },
                        },
                        {
                            title: "Inspection Type",
                            dataIndex: "label",
                            align: 'center',
                        },
                        {
                            title: "Percentage",
                            dataIndex: "perc",
                            align: 'center',
                            width: '180px',
                            render: (_, record) => {
                                const isShadeInspection = record.insType === InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION;
                                return (

                                    <Input
                                        type="number"
                                        min={1}
                                        disabled={!record.selected || isShadeInspection}
                                        value={isShadeInspection ? 100 : record.perc}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const num = parseFloat(val);

                                            if (val === '') {
                                                handleInputChange(record.key, val);
                                            } else if (num > 0) {
                                                handleInputChange(record.key, val);
                                            } else {
                                                message.error('Negative numbers are not allowed');
                                            }
                                        }}
                                        placeholder="Enter percentage"
                                    />
                                );

                            },
                        },
                        {
                            title: "Material Ready",
                            dataIndex: "materialReady",
                            align: 'center',
                            render: (_, record) => {
                                const isShadeInspection = record.insType === InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION;
                                return (
                                    <Checkbox
                                        disabled={!record.selected || isShadeInspection}
                                        checked={record.materialReady || isShadeInspection}
                                        onChange={() => handleMaterialReadyChange(record.key)}
                                    />
                                )
                            },
                        },
                        {
                            title: "Inspection Selection",
                            dataIndex: 'insSelectionType',
                            align: 'center',
                            render: (value, record) => {
                                const isShadeInspection = record.insType === InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION;

                                return (
                                    <Select
                                        value={value}
                                        style={{ width: 120 }}
                                        placeholder="Select Selection"
                                        onChange={(selectedValue) => handleInsTypeChange(record.key, selectedValue)}
                                        allowClear
                                        disabled={!record.selected || isShadeInspection}
                                    >
                                        {Object?.values(InsInspectionRollSelectionTypeEnum)?.map((type) => (
                                            <Select.Option key={type} value={type}>
                                                {type}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                );
                            }
                        }


                    ]}
                />
                <Button
                    type="primary"
                    style={{ marginTop: 10, marginLeft: '90%' }}
                    disabled={!selectedSupplier}
                    onClick={onSave}
                >
                    Save
                </Button>
            </Card>
        </>
    );
};

export default InspectionConfig;
