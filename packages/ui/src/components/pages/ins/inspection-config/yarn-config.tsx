import {
  CommonRequestAttrs,
  FGItemCategoryEnum,
  InsConfigYarnValModel,
  InsInspectionRollSelectionTypeEnum,
  InsSupplierCodeRequest,
  InsYarnInsConfigModel,
  InsYarnInsConfigRequest,
  PhItemCategoryEnum,
  YarnTypeEnum,
  YarnTypeEnumDisplayValue
} from "@xpparel/shared-models";
import {
  InspectionConfigService,
  SupplierServices,
} from "@xpparel/shared-services";
import { Button, Card, Checkbox, Input, Select, Table, message, notification } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
const { Option } = Select;



interface InspectionItem {
  key: string;
  label: string;
  selected: boolean;
  perc: number | "";
  materialReady: boolean;
  insType: YarnTypeEnum;
  insSelectionType: InsInspectionRollSelectionTypeEnum;
  itemCategory: PhItemCategoryEnum | FGItemCategoryEnum
}

const YarnInspection: React.FC = () => {
  const [yarnData, setYarnData] = useState<InspectionItem[]>([]);
  useState<InspectionItem[]>([]);
  const [supllierCode, setSupplierCode] = useState<string>(null);
  const user = useAppSelector((state) => state.user.user.user);
  const [data, setData] = useState<InsYarnInsConfigModel[]>([]);
  const [initialData, setInitialData] = useState<InspectionItem[]>([]);
  const supplierCodes: number[] = [101, 102, 103, 104, 105];
  const service = new InspectionConfigService();
  const supplierServices = new SupplierServices();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  const getSuppliersData = () => {
    const req = new CommonRequestAttrs(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId
    );
    supplierServices
      .getAllSuppliersData(req)
      .then((res) => {
        if (res.status) {
          setSuppliers(res.data);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    // Mock Data (Replace with API Call)
    const initialData: InspectionItem[] = Object.entries(YarnTypeEnum).map(
      ([key, value]) => ({
        key,
        label: YarnTypeEnumDisplayValue[value as keyof typeof YarnTypeEnumDisplayValue],
        selected: false,
        perc: "",
        materialReady: false,
        insType: YarnTypeEnum[0],
        insSelectionType: InsInspectionRollSelectionTypeEnum[0],
        itemCategory: PhItemCategoryEnum.YARN
      })
    );
    setInitialData(initialData);
    setYarnData(initialData);
  }, []);

  const getData = async (updatedSupplierCode?: string, plRefId?: number) => {
    const req = new InsSupplierCodeRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      updatedSupplierCode,
      plRefId,
      PhItemCategoryEnum.YARN
    );
    console.log(req, updatedSupplierCode);

    const res = await service.getYarnInsConfig(req);
    if (res.status) {
      // console.log(res.data);
      if (res.data.length) {
        const data = transform(res?.data);
        setYarnData(data);
        setData(res.data);
      } else {
        console.log("inisde the else");
        setYarnData(initialData);
      }
    } else {
      setYarnData(initialData);
    }
    // console.log(res);
  };

  const transform = (data: InsYarnInsConfigModel[]): InspectionItem[] => {
    return data[0]?.insConfigs?.map((item) => ({
      key: item.insType,
      label: item.insType,
      selected: item.selected,
      perc: item.pickPerc,
      materialReady: item.requiredForMaterialReady,
      insType: item.insType,
      insSelectionType: item.insSelectionType,
      itemCategory: item.itemCategory
    }));
  };

  const generateFabInsConfigRequest = (
    fabricData: InspectionItem[]
  ): InsConfigYarnValModel[] => {
    return fabricData.map((item) => ({
      id: 0,
      insType: item.key as YarnTypeEnum,
      pickPerc: item.perc !== "" ? Number(item.perc) : 0,
      requiredForMaterialReady: item.materialReady,
      selected: item.selected,
      supplierCode: supllierCode ? supllierCode : "",
      buyerCode: '',
      insSelectionType: item.insSelectionType,
      itemCategory: item.itemCategory
    }));
  };

  const handleCheckboxChange = (key: string) => {
    setYarnData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleInputChange = (key: string, value: string) => {
    const parsedValue = parseFloat(value);
    setYarnData((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, perc: isNaN(parsedValue) ? "" : parsedValue }
          : item
      )
    );
  };

  const handleMaterialReadyChange = (key: string) => {
    setYarnData((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, materialReady: !item.materialReady }
          : item
      )
    );
  };

  const handleSupplierChange = (value: string) => {
    setSelectedSupplier(value);
    if (value) {
      getData(value);
    }
  };

  const onSave = async () => {
    console.log("from onSave", yarnData);
    const data = generateFabInsConfigRequest(yarnData);
    // console.log("data", data);
    const req = new InsYarnInsConfigRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      supllierCode ? supllierCode.toString() : selectedSupplier || "",
      data,
      undefined,
      PhItemCategoryEnum.YARN
    );
    const res = await service.saveYarnInsConfig(req);
    if (res.status) {
      notification.success({ message: "Data Saved Successfully" });
    } else {
      notification.error({ message: res.internalMessage });
    }
  };

  const handleInsTypeChange = (
    key: string,
    insSelectionType: InsInspectionRollSelectionTypeEnum
  ) => {
    setYarnData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, insSelectionType } : item
      )
    );
  };

  return (
    <>
      <Card title="Yarn Inspection Configuration" style={{ width: "100%" }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ marginRight: 8 }}>Select Supplier Code:</label>
          <Select
            style={{ width: 200 }}
            placeholder="Select Supplier"
            onChange={handleSupplierChange}
            value={selectedSupplier}
            allowClear
            optionFilterProp="children"
            onDropdownVisibleChange={(open) => {
              if (open) {
                getSuppliersData();
              }
            }}
            filterOption={(input, option) =>
              (option!.children as unknown as string)
                .toString()
                .toLocaleLowerCase()
                .includes(input.toLocaleLowerCase())
            }
          >
            {suppliers.map((data) => {
              return (
                <Option value={data.supplierCode}>
                  {data.supplierCode}-{data.supplierName}
                </Option>
              );
            })}
          </Select>
        </div>
        <Table
          dataSource={yarnData}
          pagination={false}
          rowKey="key"
          size="small"
          columns={[
            {
              title: "Select",
              dataIndex: "selected",
              align: "center",
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
              align: "center",
              // width:'200px',
            },
            {
              title: "Percentage",
              dataIndex: "perc",
              width: "180px",
              align: "center",
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
              align: "center",
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
              dataIndex: "insspectionSelectionType",
              align: "center",
              render: (value, record) => (
                <Select
                  value={value}
                  style={{ width: 120 }}
                  placeholder="Select Rolls Selection"
                  onChange={(selectedValue) =>
                    handleInsTypeChange(record.key, selectedValue)
                  }
                  allowClear
                >
                  {Object?.values(InsInspectionRollSelectionTypeEnum)?.map(
                    (type) => (
                      <Select.Option key={type} value={type}>
                        {type}
                      </Select.Option>
                    )
                  )}
                </Select>
              ),
            },
          ]}
        />
        <Button
          type="primary"
          style={{ marginTop: 10, marginLeft: "90%" }}
          disabled={!selectedSupplier}
          onClick={onSave}
        >
          Save
        </Button>
      </Card>
    </>
  );
};

export default YarnInspection;
