import { CommonRequestAttrs, CustomerDropDownModel, CustomerDropDownResponse, FGItemCategoryEnum, InsBuyerCodeRequest, InsConfigValModel, InsFgInsConfigModel, InsFgInsConfigRequest, InsInspectionRollSelectionTypeEnum, InsTypesEnumType, PackFabricInspectionRequestCategoryEnum, PackFabricInspectionRequestCategoryEnumDisplayValue, PhItemCategoryEnum } from "@xpparel/shared-models";
import { CustomerSharedService, InspectionConfigService } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Input, Select, Table, message, notification } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
const { Option } = Select;



interface InspectionItem {
    key: string;
    label: string;
    selected: boolean;
    perc: number | "";
    materialReady: boolean;
    insType: InsTypesEnumType,
    insSelectionType: InsInspectionRollSelectionTypeEnum;
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum
}



const FGInspection: React.FC = () => {
    const [fgData, setFgData] = useState<InspectionItem[]>([]);
    useState<InspectionItem[]>([]);
    const [selectedBuyerCode, setSelectedBuyerCode] = useState<string>(null);
    const user = useAppSelector((state) => state.user.user.user);
    const [data, setData] = useState<InsFgInsConfigModel[]>([]);
    const [initialData, setInitialData] = useState<InspectionItem[]>([]);
    const service = new InspectionConfigService();
    const customerSharedService = new CustomerSharedService();
    const [customerCodes, setCustomerCodes] = useState<CustomerDropDownModel[]>([]);


    useEffect(() => {
        // Mock Data (Replace with API Call)
        const initialData: InspectionItem[] = Object.entries(PackFabricInspectionRequestCategoryEnum).map(([key, value]) => ({
            key,
            label: PackFabricInspectionRequestCategoryEnumDisplayValue[value as keyof typeof PackFabricInspectionRequestCategoryEnumDisplayValue],
            selected: false,
            perc: "",
            materialReady: false,
            insType: PackFabricInspectionRequestCategoryEnum[0],
            insSelectionType: InsInspectionRollSelectionTypeEnum[0],
            itemCategory: FGItemCategoryEnum.FG
        }));
        setInitialData(initialData);
        setFgData(initialData);
        getCustomerCodes();

    }, []);

    const getData = async (updatedBuyerCode?: string) => {
        const req = new InsBuyerCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, updatedBuyerCode, undefined, FGItemCategoryEnum.FG);
        console.log(req, updatedBuyerCode);

        const res = await service.getFgInsConfig(req);
        if (res.status) {
            if (res.data.length) {
                const data = transform(res?.data);
                setFgData(data)
                setData(res.data);
            } else {
                setFgData(initialData);
            }
        } else {
            setFgData(initialData);
        }
        // console.log(res);
    }

    const transform = (data: InsFgInsConfigModel[]): InspectionItem[] => {
        return data[0]?.insConfigs?.map(item => ({
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

    const generateFabInsConfigRequest = (fabricData: InspectionItem[]): InsConfigValModel[] => {
        return fabricData.map(item => ({
            id: 0,
            insType: item.key as InsTypesEnumType,
            pickPerc: item.perc !== "" ? Number(item.perc) : 0,
            requiredForMaterialReady: item.materialReady,
            selected: item.selected,
            supplierCode: '',
            buyerCode: selectedBuyerCode || '',
            insSelectionType: item.insSelectionType,
            insConfigItems: [], // Add appropriate value for insConfigItems
            plRefId: null, // Add appropriate value for plRefId
            itemCategory: item.itemCategory
        }));
    };

    const handleCheckboxChange = (key: string) => {
        setFgData((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handleInputChange = (key: string, value: string) => {
        const parsedValue = parseFloat(value);
        setFgData((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, perc: isNaN(parsedValue) ? "" : parsedValue } : item
            )
        );
    };


    const handleMaterialReadyChange = (key: string) => {
        setFgData((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, materialReady: !item.materialReady } : item
            )
        );
    };

    const getCustomerCodes = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        customerSharedService
            .getAllCustomersForDropDown(req)
            .then((res) => {
                if (res.status) {
                    setCustomerCodes(res.data);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };


    const handleSupplierChange = (value: string) => {
        setSelectedBuyerCode(value);
        if (value) {
            getData(value)
        }

    };

    const onSave = async () => {
        const data = generateFabInsConfigRequest(fgData);
        const req = new InsFgInsConfigRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedBuyerCode ? selectedBuyerCode.toString() : "", data, undefined, FGItemCategoryEnum.FG);
        // console.log('reqqqqqqqqqq', req);
        const res = await service.saveFgInsConfig(req);
        if (res.status) {
            // console.log("Data Saved Successfully");
            AlertMessages.getSuccessMessage(res.internalMessage);
        }
        else {
            // console.log("Data Not Saved");
            notification.error({ message: res.internalMessage });
        }
    }

    const handleInsTypeChange = (key: string, insSelectionType: InsInspectionRollSelectionTypeEnum) => {

        setFgData((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, insSelectionType } : item
            )
        );
    };

    return (
        <>
            <Card title="FG Inspection Configuration" style={{ width: "100%" }}>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ marginRight: 8 }}>Select Buyer Code:</label>
                    <Select
                        style={{ width: 200 }}
                        placeholder="Select Buyer"
                        onChange={handleSupplierChange}
                        value={selectedBuyerCode}
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) => (option!.children as unknown as string).toString().toLocaleLowerCase().includes(input.toLocaleLowerCase())}>
                        {customerCodes.map((data) => {
                            return <Option value={data.customerCode}>{data.customerCode}-{data.customerName}</Option>
                        })}


                    </Select>
                </div>
                <Table
                    dataSource={fgData}
                    pagination={false}
                    rowKey="key"
                    size="small"
                    columns={[
                        {
                            title: "Select",
                            dataIndex: "selected",
                            align: 'center',
                            render: (_, record) => (
                                <Checkbox
                                    checked={record.selected}
                                    onChange={() => handleCheckboxChange(record.key)}
                                />
                            ),
                        },
                        {
                            title: "Inspection Type",
                            dataIndex: "label",
                            align: 'center',
                            // width:'200px',
                        },
                        {
                            title: "Percentage",
                            dataIndex: "perc",
                            width: '180px',
                            align: 'center',
                            render: (_, record) => (
                                <Input
                                    type="number"
                                    min={1}
                                    disabled={!record.selected}
                                    value={record.perc}
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
                            ),
                        },
                        {
                            title: "Material Ready",
                            dataIndex: "materialReady",
                            align: 'center',
                            render: (_, record) => (
                                <Checkbox
                                    disabled={!record.selected}
                                    checked={record.materialReady}
                                    onChange={() => handleMaterialReadyChange(record.key)}
                                />
                            ),
                        },
                        {
                            title: "Inspection Selection",
                            dataIndex: 'insspectionSelectionType',
                            align: 'center',
                            render: (value, record) => (
                                <Select
                                    value={value}
                                    style={{ width: 120 }}
                                    placeholder="Select Rolls Selection"
                                    onChange={(selectedValue) => handleInsTypeChange(record.key, selectedValue)}
                                    allowClear
                                >
                                    {Object?.values(InsInspectionRollSelectionTypeEnum)?.map((type) => (
                                        <Select.Option key={type} value={type}>
                                            {type}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )
                        }
                    ]}
                />
                <Button
                    type="primary"
                    style={{ marginTop: 10, marginLeft: '90%' }}
                    disabled={!selectedBuyerCode}
                    onClick={onSave}
                >
                    Save
                </Button>
            </Card>
        </>
    )

};

export default FGInspection;
