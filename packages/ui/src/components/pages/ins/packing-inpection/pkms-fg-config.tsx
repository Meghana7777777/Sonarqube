import { FGItemCategoryEnum, InsBuyerCodeRequest, InsConfigValModel, InsFgInsConfigModel, InsFgInsConfigRequest, InsInspectionRollSelectionTypeEnum, InsTypesEnumType, PackFabricInspectionRequestCategoryEnum, PhItemCategoryEnum } from "@xpparel/shared-models";
import { InspectionConfigService, PKMSInspectionConfigService } from "@xpparel/shared-services";
import { Button, Checkbox, Input, Select, Table, notification, FormInstance } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { SaveOutlined } from "@ant-design/icons";
const { Option } = Select;



interface FgProps {
    data: InspectionItem[];
    formRef: FormInstance<any>;
    getInsConfigData: () => Promise<void>
}

class InspectionItem {
    key: string;
    label: string;
    selected: boolean;
    perc: number | "";
    materialReady: boolean;
    insType: InsTypesEnumType;
    insSelectionType: InsInspectionRollSelectionTypeEnum;
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum;
    isCreatedInSelfModule: boolean;

}



const FGInspectionConfigPKMS = (props: FgProps) => {
    const { formRef, getInsConfigData } = props
    const [fgData, setFgData] = useState<InspectionItem[]>([]);
    const user = useAppSelector((state) => state.user.user.user);
    const pKMSInspectionConfigService = new PKMSInspectionConfigService();


    useEffect(() => {
        setFgData(props?.data)
    }, [props.data])


    const generateFabInsConfigRequest = (fabricData: InspectionItem[], buyer: string): InsConfigValModel[] => {
        return fabricData.map(item => ({
            id: 0,
            insType: item.key as PackFabricInspectionRequestCategoryEnum,
            pickPerc: item.perc !== "" ? Number(item.perc) : 0,
            requiredForMaterialReady: item.materialReady,
            selected: item.selected,
            supplierCode: '',
            buyerCode: buyer,
            insSelectionType: item.insSelectionType,
            insConfigItems: [],
            plRefId: null,
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



    const onSave = async () => {
        try {
            const data = generateFabInsConfigRequest(fgData, formRef.getFieldValue('customerName'));
            const req = new InsFgInsConfigRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, formRef.getFieldValue('customerName'), data, formRef.getFieldValue('poId'), FGItemCategoryEnum.FG);
            const res = await pKMSInspectionConfigService.savePKMSFgInsConfigPLLevel(req);
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getInsConfigData();
            }
            else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
            console.log(error.message)
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
            {/* <div style={{ marginBottom: 16 }}>
                <label style={{ marginRight: 8 }}>Select Buyer Code:</label>
                <Select
                    style={{ width: 200 }}
                    placeholder="Select Buyer"
                    onChange={handleSupplierChange}
                    value={buyerCode}
                    allowClear
                >
                    {buyerCodes.map((code) => (
                        <Option key={code} value={code}>
                            {code}
                        </Option>
                    ))}
                </Select>
            </div> */}
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
                                disabled={record.isCreatedInSelfModule}
                                checked={record.selected}
                                onChange={() => handleCheckboxChange(record.key)}
                            />
                        ),
                    },
                    {
                        title: "Type",
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
                                disabled={!record.selected || record.isCreatedInSelfModule}
                                value={record.perc}
                                onChange={(e) => handleInputChange(record.key, e.target.value)}
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
                                disabled={!record.selected || record.isCreatedInSelfModule}
                                checked={record.materialReady}
                                onChange={() => handleMaterialReadyChange(record.key)}
                            />
                        ),
                    },
                    {
                        title: "Inspection Selection",
                        dataIndex: 'insSelectionType',
                        align: 'center',
                        render: (value, record) => (
                            <Select
                                defaultValue={value}
                                style={{ width: 120 }}
                                placeholder="Select cartons Selection"
                                onChange={(selectedValue) => handleInsTypeChange(record.key, selectedValue)}
                                allowClear
                                disabled={record.isCreatedInSelfModule}
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <Button
                    type="primary"
                    style={{ marginTop: 10, marginLeft: '90%' }}
                    disabled={!fgData.some((rec) => !rec.isCreatedInSelfModule)}
                    onClick={onSave}
                    icon={<SaveOutlined />}
                >
                    Save
                </Button>
            </div>
        </>
    )

};

export default FGInspectionConfigPKMS;
