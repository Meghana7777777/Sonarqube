import { DocBundleGenerationStatusEnum, DocMaterialAllocationModel, DocketBasicInfoModel, DocketGroupBasicInfoModel, MrnStatusEnum, PoMarkerModel, RollLockEnum, StockRollInfoModel, WhMatReqLineStatusDisplayValue, WhMatReqLineStatusEnum, mrnStatusEnumDiplayValues } from "@xpparel/shared-models";
import { CustomColumn } from "../../../../schemax-component-lib";
import { Button, Space, Tag, Tooltip } from "antd";
import { convertBackendDateToLocalTimeZone } from "packages/ui/src/common";
import { IDisplayDocketInfo } from "./interface";
import { calculateMaterialRequirement } from "../../../common/helper-functions";

export const docketBasicInfoModelColumns: CustomColumn<IDisplayDocketInfo>[] = [
    // {
    //     title: 'S.No',
    //     dataIndex: 'poSerial',
    //     key: 'poSerial',
    //     render:(_,__,i)=> i+1
    // },
    {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName',
        isDefaultSelect: true,
        fixed:'left',
    },
    {
        title: 'Docket Number',
        dataIndex: 'docketGroup',
        align: 'center',
        key: 'docketGroup',
        isDefaultSelect: true,
    },
    {
        title: 'Cut Number',
        dataIndex: 'cutNumber',
        align: 'center',
        key: 'cutNumber',
        isDefaultSelect: true,
    },
    {
        title: 'Sub Docket',
        dataIndex: 'docketNumber',
        key: 'docketNumber',
        isDefaultSelect: true,
    },
    {
        title: 'Docket Requirement',
        dataIndex: 'materialRequirement',
        key: 'materialRequirement',
        render: (val: number, row: IDisplayDocketInfo, index: number) => {
            return <Space size={0}>
                <Tooltip title='Docket Requirement'>
                    <Tag style={{ minWidth: '60px', textAlign: 'center',fontSize:'10px' }} color="blue">
                        {row.actualMarkerInfo?.markerLength ?
                            calculateMaterialRequirement(Number(row.plies), Number(row.cutWastage), Number(row.actualMarkerInfo.markerLength), Number(row.bindReqWithOutWastage)) :
                            Number(val).toFixed(2)}
                    </Tag>
                </Tooltip>
                <Tooltip title='Allocated Quantity' color="green" mouseEnterDelay={0} mouseLeaveDelay={0}><Tag style={{ minWidth: '60px', textAlign: 'center',fontSize:'10px' }} color="green">{Number(row.allocatedQty).toFixed(2)}</Tag></Tooltip>
                <Tooltip title='Pending To Allocate' color="red" mouseEnterDelay={0} mouseLeaveDelay={0}><Tag style={{ minWidth: '60px', textAlign: 'center',fontSize:'10px' }} color="red">{((row.actualMarkerInfo?.markerLength ?
                            calculateMaterialRequirement(Number(row.plies), Number(row.cutWastage), Number(row.actualMarkerInfo.markerLength), Number(row.bindReqWithOutWastage)) :
                            Number(val)) - Number(row.allocatedQty)).toFixed(2)}</Tag></Tooltip>
            </Space>
        },
        isDefaultSelect: true,
    },
    {
        title: 'Fabric Code',
        dataIndex: 'itemCode',
        key: 'itemCode',
        isDefaultSelect: true,
    },
    {
        title: 'Marker Version',
        dataIndex: 'mVersion',
        key: 'markerVersion',
        isDefaultSelect: true,
    },
    {
        title: 'Marker Length',
        dataIndex: 'mLength',
        key: 'markerLength',
        isDefaultSelect: true,
        render: (text: any) => <span style={{ fontSize: '0' }}>{text}</span>,
        
    },    
    {
        title: 'Plies',
        dataIndex: 'plies',
        key: 'plies',
        isDefaultSelect: true,
    },
    {
        title: 'Total Quantity',
        dataIndex: 'originalDocQuantity',
        key: 'originalDocQuantity',
        isDefaultSelect: true,
    }
];

export interface IDocMaterialAllocationColumns {
    docketGroup: string;
    requestNumber: string;
    rollId: number;
    rollBarcode: string;
    rollQty: number;
    allocatedQuantity: number;
    rollLocked: RollLockEnum;
    shade: string;
    shrinkageGroup: string;
    lotNo: string;
    itemDesc: string;
    batch: string;
    mWidth: number;
    aWidth: string;
    rowSpan: number;
    status: WhMatReqLineStatusEnum | MrnStatusEnum;
    mrnId: number;
    allocatedDate: string;
    externalRollNumber: string;
    iWidth: number;
}

export interface StockRollInfoModelColumn {
    rollId: number;
    barcode: string;
    packListId: number;
    originalQty: number;
    leftOverQuantity: number;
    phLinesId: number; // Batch or lot table id
    batch: string;
    lot: string;
    width: string;
    inspectionPick: boolean;
    issuedQuantity: number;
    inputQuantity: number;
    shrinkage: string;
    measuredWidth: string;
    actualWidth: string;
    actualGsm: string;
    returnQuntity: string;
    netWeight: string;
    grossWeight: string;
    shade: string;
    shadeGroup: string;
    itemCode: string;
    itemName: string;
    itemDesc: string;
    itemStyle: string;
    itemColor: string;
    itemSize: string;
    itemInvoice: string;
    supplierCode: string;
    supplierName: string;
    packListDesc: string;
    packListCode: string;
    supplierROllNo: string;
    manualIssuedQty: number;
    docketsIssuedQty: number;
    palletCode: string;
    trayCode: string;
    trolleyCode: string;
}

export const docketMaterialColumns: CustomColumn<IDocMaterialAllocationColumns>[] = [
    {
        title: 'Lot No',
        dataIndex: 'lotNo',
        key: 'lotNo',
        isDefaultSelect: true,
    },
    // {
    //     title: 'Batch',
    //     dataIndex: 'batch',
    //     key: 'batch',
    //     isDefaultSelect: true,
    // },
    // {
    //     title: 'Roll Barcode',
    //     dataIndex: 'rollBarcode',
    //     key: 'rollBarcode',
    //     isDefaultSelect: true,
    // },
    {
        title: 'Roll No',
        dataIndex: 'externalRollNumber',
        key: 'externalRollNumber',
        isDefaultSelect: true,
    },
    {
        title: 'Shade',
        dataIndex: 'shade',
        key: 'shade',
        isDefaultSelect: true,
    },
    // {
    //     title: 'Shrinkage',
    //     dataIndex: 'shrinkageGroup',
    //     key: 'shrinkageGroup',
    //     isDefaultSelect: true,
    // },
    {
        title: 'Measured Width',
        dataIndex: 'mWidth',
        key: 'mWidth',
        isDefaultSelect: true,
    },
    {
        title: 'Supplier Width',
        dataIndex: 'iWidth',
        key: 'iWidth',
        isDefaultSelect: true,
    },
    {
        title: 'Roll Quantity',
        dataIndex: 'rollQty',
        key: 'rollQty',
        isDefaultSelect: true,
        render: (value, record: IDocMaterialAllocationColumns) => {
            return <Tag color="blue">{value}</Tag>
        }
    },
    {
        title: 'Allocated Qty',
        dataIndex: 'allocatedQuantity',
        key: 'allocatedQuantity',
        isDefaultSelect: true,
        render: (value, record: IDocMaterialAllocationColumns) => {
            return <Tag color="green">{value}</Tag>
        }
    },
    {
        title: 'Allocated Date',
        dataIndex: 'allocatedDate',
        key: 'allocatedDate',
        isDefaultSelect: true,
        render: (value, record: IDocMaterialAllocationColumns) => {
            return convertBackendDateToLocalTimeZone(value);
        }
    },
    // {
    //     title: 'Avl Roll Qty',
    //     dataIndex: 'allocatedQuantity',
    //     key: 'pendingQuantity',
    //     render: (allocatedQuantity, record: IDocMaterialAllocationColumns) => {
    //         return <Tag color="orange">{(Number(record.rollQty) - Number(allocatedQuantity)).toFixed(2)}</Tag>
    //     },
    //     isDefaultSelect: true,
    // },
    {
        title: 'Request No',
        dataIndex: 'requestNumber',
        key: 'requestNumber',
        isDefaultSelect: true,
    },
    {
        title: 'MRN',
        dataIndex: 'mrnId',
        key: 'mrnId',
        isDefaultSelect: true,
        render: ((mrnId, record) => {
            return <>{mrnId ? <span style={{ color: "green", fontWeight: "bold" }}>Yes</span> : <span style={{ color: "red", fontWeight: "bold" }} >No</span>}</>
        })
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        isDefaultSelect: true,
        render: (status) => {
            return <>{WhMatReqLineStatusDisplayValue[status] ?? mrnStatusEnumDiplayValues[status]}</>
        }
    },
];

export const stockRollInfoModelColumns: CustomColumn<StockRollInfoModel>[] = [
    {
        title: 'Supplier Roll No',
        dataIndex: 'barcode',
        key: 'barcode',
        isDefaultSelect: true,
    },
    {
        title: 'Lot No',
        dataIndex: 'lot',
        key: 'lot',
        isDefaultSelect: true,
    },
    {
        title: 'Pallet Code',
        dataIndex: 'palletCode',
        key: 'palletCode',
        isDefaultSelect: true,
        // render: (_: any, record: rollLocationInfo.palletCode) => {
        //     const palletCode = record.rollLocationInfo?.palletCode || 'N/A';
        //     return palletCode.trim() ? palletCode : 'N/A';
        // },
    },
    {
        title: 'Tray Code',
        dataIndex: 'trayCode',
        key: 'trayCode',
        isDefaultSelect: true,
        // render: (_: any, record: StockRollInfoModel) => {
        //     const trayCode = record.rollLocationInfo?.trayCode || 'N/A';
        //     return trayCode.trim() ? trayCode : 'N/A';
        // },
    },
    {
        title: 'Trolley Code',
        dataIndex: 'trolleyCode',
        key: 'trolleyCode',
        isDefaultSelect: true,
        // render: (_: any, record: StockRollInfoModel) => {
        //     const trolleyCode = record.rollLocationInfo?.trolleyCode || 'N/A';
        //     return trolleyCode.trim() ? trolleyCode : 'N/A';
        // },
    },
    // {
    //     title: 'Batch',
    //     dataIndex: 'batch',
    //     key: 'batch',
    //     isDefaultSelect: true,
    // },
    // {
    //     title: 'Roll Barcode',
    //     dataIndex: 'barcode',
    //     key: 'barcode',
    //     isDefaultSelect: true,
    // },
    {
        title: 'Shade',
        dataIndex: 'shade',
        key: 'shade',
        isDefaultSelect: true,
    },
    // {
    //     title: 'Shrinkage',
    //     dataIndex: 'shrinkage',
    //     key: 'shrinkage',
    //     isDefaultSelect: true,
    // },
    {
        title: 'Measured Width',
        dataIndex: 'measuredWidth',
        key: 'measuredWidth',
        isDefaultSelect: true,
    },
    {
        title: 'Actual Width',
        dataIndex: 'actualWidth',
        key: 'actualWidth',
        isDefaultSelect: true,
    },
    {
        title: 'Supplier Width',
        dataIndex: 'width',
        key: 'width',
        isDefaultSelect: true,
    },
    {
        title: 'Roll Quantity',
        dataIndex: 'originalQty',
        key: 'originalQty',
        isDefaultSelect: true,
    },
    {
        title: 'Balance Qty',
        dataIndex: 'leftOverQuantity',
        key: 'leftOverQuantity',
        isDefaultSelect: true,
    }
]





