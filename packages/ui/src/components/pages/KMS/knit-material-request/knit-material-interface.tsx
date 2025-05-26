import { EyeOutlined } from "@ant-design/icons";
import { KJ_MaterialStatusEnum, kjMaterialStatusEnumDisplayValues } from "@xpparel/shared-models";
import { Button, TableColumnsType, Tag } from "antd";

interface SizeQty {
    size: string;
    qty: number;
}
export interface IKnitJobSummary {
    sno: number;
    productCode: string;
    mo: string[];
    knitGroup: string;
    component: string;
    itemCodes: string;
    knitJobNumber: string;
    sizeAndQty?: SizeQty[];
    totalQty?: number;
    materialStatus: KJ_MaterialStatusEnum
}

const materialStatusColor = {
    [KJ_MaterialStatusEnum.COMPLETELY_ISSUED]: 'Green',
    [KJ_MaterialStatusEnum.OPEN]: 'red',
    [KJ_MaterialStatusEnum.PARTIAL_ISSUED]: 'orange',
    [KJ_MaterialStatusEnum.REQUESTED]: 'yellow',
}
export const knitMaterialJobsColumns: TableColumnsType<IKnitJobSummary> = [
    {
        title: "S.No", dataIndex: "sno", key: "select",
    },
    {
        title: "Product Code",
        dataIndex: "productCode",
        key: "productCode",
        render: (text: string, record: any) =>
            Array.isArray(record.productCode) ? record.productCode.join(", ") : record.productCode || "N/A"
    },
    {
        title: "Mo", dataIndex: "mo", key: "mo", width: 100,
        render: (text: string, record: any) => { return record.mo ? record.mo.join(", ") : "N/A"; }
    },
    { title: "Knit Group", dataIndex: "knitGroup", key: "knitGroup", },
    { title: "Component", dataIndex: "component", key: "component", },
    { title: "Item Codes", dataIndex: "itemCodes", key: "itemCodes", },
    { title: "Knit Job Number", dataIndex: "knitJobNumber", key: "knitJobNumber", },
    // { title: "Size", dataIndex: "size", key: "size", width: 200 },
    // { title: "Qty", dataIndex: "qty", key: "qty", width: 200 },
    {
        title: "Size and Quantity",
        dataIndex: "sizeAndQty",
        render: (text: string, record: any) => {
            const sizeQtys = record.sizeAndQty || [];
            return sizeQtys.map((sizeInfo) => `${sizeInfo.size} - ${sizeInfo.qty}`).join(", ");
        }
    },
    {
        title: "Material Status",
        dataIndex: "materialStatus",
        render: (text: string, record: any) => {
            return <Tag color={materialStatusColor[text]}>{kjMaterialStatusEnumDisplayValues[text]}</Tag>;
        }
    },
    {
        title: "Total Qty",
        dataIndex: "totalQty",
        key: "totalQty",
        render: (text: string, record: any) => {
            const sizeQtys = record.sizeAndQty || [];
            const totalQty = sizeQtys.reduce((sum, sizeInfo) => sum + sizeInfo.qty, 0);
            return totalQty;
        }
    }
]

export const knitMaterialJobsSheetColumns = (handleView: (jobNumber: string) => void): TableColumnsType<IKnitJobSummary> => [
    {
        title: "S.No", dataIndex: "sno", key: "select",
    },
    {
        title: "Product Code",
        dataIndex: "productCode",
        key: "productCode",
        align: 'center',
        render: (text: string, record: any) =>
            Array.isArray(record.productCode) ? record.productCode.join(", ") : record.productCode || "N/A"
    },
    {
        title: "Mo", dataIndex: "mo", key: "mo", width: 100, align: 'center',
        render: (text: string, record: any) => { return record.mo ? record.mo.join(", ") : "N/A"; }
    },
    { title: "Knit Group", dataIndex: "knitGroup", key: "knitGroup", align: 'center',},
    { title: "Component", dataIndex: "component", key: "component", align: 'center', },
    { title: "Item Codes", dataIndex: "itemCodes", key: "itemCodes", align: 'center',},
    { title: "Knit Job Number", dataIndex: "knitJobNumber", key: "knitJobNumber", align: 'center',},
    {
        title: "Size and Quantity",
        dataIndex: "sizeAndQty",
        align: 'center',
        render: (text: string, record: any) => {
            const sizeQtys = record.sizeAndQty || [];
            return sizeQtys.map((sizeInfo) => `${sizeInfo.size} - ${sizeInfo.qty}`).join(", ");
        }
    },
    {
        title: "Material Status",
        dataIndex: "materialStatus",
        align: 'center',
        render: (text: string, record: any) => {
            return <Tag color={materialStatusColor[text]}>{kjMaterialStatusEnumDisplayValues[text]}</Tag>;
        }
    },
    {
        title: "Total Qty",
        dataIndex: "totalQty",
        key: "totalQty",
        align: 'center',
        render: (text: string, record: any) => {
            const sizeQtys = record.sizeAndQty || [];
            const totalQty = sizeQtys.reduce((sum, sizeInfo) => sum + sizeInfo.qty, 0);
            return totalQty;
        }
    },
    {
        title: 'Job Sheet', dataIndex: 'jobSheet', key: 'jobSheet', align: 'center', render: (_: any, record: any) => (
            <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleView(record.knitJobNumber)}
            />
        ),
    },
]