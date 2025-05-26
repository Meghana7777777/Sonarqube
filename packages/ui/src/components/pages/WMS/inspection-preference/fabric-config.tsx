import { InsConfigFabValModel, InsFabInsConfigRequest, InsFabricInspectionRequestCategoryEnum, InsFabricInspectionRequestCategoryEnumDisplayValue, InsInspectionRollSelectionTypeEnum, InsTypesEnumType, PackingListSummaryModel, PhItemCategoryEnum, SystemPreferenceModel } from "@xpparel/shared-models";
import { GrnServices, WMSInspectionConfigService } from "@xpparel/shared-services";
import { Button, Checkbox, Input, message, notification, Select, Table } from "antd";
import React from "react";
import { useAppSelector } from '../../../../common';
import { InspectionFabItem } from "./inspection-preference";
import { AlertMessages } from "../../../common";

interface IFABInspectionProps {
    summeryDataRecord: PackingListSummaryModel;
    setFabricData: React.Dispatch<React.SetStateAction<InspectionFabItem[]>>
    fabricData: InspectionFabItem[];
    inspectionPickSaveFlag: boolean;
    getInsConfigData: () => Promise<void>
    itemCategory: PhItemCategoryEnum;
    insTypeForSuggestion: InsTypesEnumType;
    setDefaultInsTypeForSuggestion: (selectedInsTypes: InsTypesEnumType[]) => InsTypesEnumType;
}

const FABInspectionConfigWMS = (props: IFABInspectionProps) => {
    const { summeryDataRecord, setFabricData, fabricData, inspectionPickSaveFlag, getInsConfigData, insTypeForSuggestion, setDefaultInsTypeForSuggestion } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const service = new WMSInspectionConfigService();
    const grnServices = new GrnServices();






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
                item.key === key ? { ...item, perc: isNaN(parsedValue) ? 0 : parsedValue } : item
            )
        );
    };




    const handleMaterialReadyChange = (key: string) => {
        setFabricData((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, materialReady: !item.materialReady } : item
            )
        );
    };

    const handleInsTypeChange = (key: string, insSelectionType: InsInspectionRollSelectionTypeEnum) => {
        setFabricData((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, insSelectionType } : item
            )
        );
    };



    const generateFabInsConfigRequest = (fabricData: InspectionFabItem[]): InsConfigFabValModel[] => {
        return fabricData.map(item => ({
            id: 0,
            insType: item.key as InsTypesEnumType,
            pickPerc: item.perc !== 0 ? Number(item.perc) : 0,
            requiredForMaterialReady: item.materialReady,
            selected: item.selected,
            supplierCode: summeryDataRecord.supplierCode,
            buyerCode: null,
            insSelectionType: item.insSelectionType,
            insConfigItems: [],
            plRefId: summeryDataRecord.id,
            itemCategory: item.itemCategory
        }));
    };


    const saveSystemPreferences = (rollSelectionType, rollsPickPercentage, remarks) => {
        const reqModel: SystemPreferenceModel = new SystemPreferenceModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.id, rollSelectionType, rollsPickPercentage, remarks)
        grnServices.saveSystemPreferences(reqModel).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        })
    }


    const onSave = async () => {
        try {
            const data = generateFabInsConfigRequest(fabricData);
            // console.log("data", data);
            const req = new InsFabInsConfigRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.supplierCode, data, summeryDataRecord.id, undefined);
            const res = await service.saveFabInsConfigPLLevel(req);
            if (res.status) {
                let insTypeForSuggestionLocal: InsTypesEnumType = insTypeForSuggestion;
                if (!insTypeForSuggestionLocal) {
                    const selectedInsTypes = fabricData.map(rec => rec.insType);
                    insTypeForSuggestionLocal = setDefaultInsTypeForSuggestion(selectedInsTypes);
                }
                const insConfig = fabricData.find(rec => rec.insType === insTypeForSuggestionLocal);
                if (insConfig)
                    saveSystemPreferences(insConfig.insSelectionType, insConfig.perc, 'NA')
                getInsConfigData();
            }
            else {
                // console.log("Data Not Saved");
                notification.error({ message: res.internalMessage });
            }
        } catch (error) {
            notification.error({ message: error.message });
        }

    }



    return (
        <>
            <Table
                dataSource={fabricData}
                pagination={false}
                rowKey="key"
                size="small"
                style={{ border: '10px' }}
                scroll={{ x: 'max-content' }}
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
                                    disabled={inspectionPickSaveFlag}
                                    checked={record.selected}
                                    onChange={() => handleCheckboxChange(record.key)}
                                />
                            );
                        },
                    },
                    {
                        title: "Inspection Type",
                        dataIndex: "label",
                        align: 'center',
                        render: (label: string) => InsFabricInspectionRequestCategoryEnumDisplayValue[label] || label,
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
                                    disabled={inspectionPickSaveFlag || isShadeInspection}
                                    value={isShadeInspection ? 100 : record.perc}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const num = parseFloat(val);
                                        if (val === '') {
                                            handleInputChange(record.key, val)
                                        } else if (num > 0) {
                                            handleInputChange(record.key, val)
                                        } else {
                                            message.error('Negative numbers are not allowed');
                                        }
                                    }}
                                    placeholder="Enter percentage"
                                />
                            )
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
                                    disabled={inspectionPickSaveFlag || isShadeInspection}
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
                                    defaultValue={value}
                                    style={{ width: 120 }}
                                    placeholder="Select Rolls Selection"
                                    onChange={(selectedValue) => handleInsTypeChange(record.key, selectedValue)}
                                    allowClear
                                    disabled={inspectionPickSaveFlag || isShadeInspection}
                                >
                                    {Object?.values(InsInspectionRollSelectionTypeEnum)?.map((type) => (
                                        <Select.Option key={type} value={type} >
                                            {type}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )
                        }
                    }

                ]}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <Button
                    type="primary"
                    disabled={inspectionPickSaveFlag}
                    onClick={onSave}
                >
                    Save Preference
                </Button>
            </div>

        </>
    );
};

export default FABInspectionConfigWMS;
