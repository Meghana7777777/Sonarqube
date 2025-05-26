import { rollLocationInfoModel } from "./roll-location-model";


export class StockRollInfoModel {
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
    // rollLocationInfo?: rollLocationInfoModel
    palletCode?: string;
    trayCode?: string;
    trolleyCode?: string;


    constructor(rollId: number, inspectionPick: boolean, barcode: string, packListId: number, originalQty: number, leftOverQuantity: number, phLinesId: number, batch: string, lot: string, width: string, issuedQuantity: number, inputQuantity: number, shrinkage: string, measuredWidth: string, actualWidth: string, actualGsm: string, returnQuntity: string, netWeight: string, grossWeight: string, shade: string, shadeGroup: string, itemCode: string, itemName: string, itemDesc: string, itemStyle: string, itemColor: string, itemSize: string, itemInvoice: string, supplierCode: string, supplierName: string, packListDesc: string, packListCode: string, supplierROllNo: string, manualIssuedQty: number, docketsIssuedQty: number,palletCode?: string, trayCode?: string, trolleyCode?: string) {
        this.rollId = rollId;
        this.barcode = barcode;
        this.packListId = packListId;
        this.originalQty = originalQty;
        this.leftOverQuantity = leftOverQuantity;
        this.phLinesId = phLinesId;
        this.batch = batch;
        this.lot = lot;
        this.width = width;
        this.inspectionPick = inspectionPick;
        this.issuedQuantity = issuedQuantity;
        this.inputQuantity = inputQuantity;
        this.shrinkage = shrinkage;
        this.measuredWidth = measuredWidth;
        this.actualWidth = actualWidth
        this.actualGsm = actualGsm,
        this.returnQuntity = returnQuntity,
        this.netWeight = netWeight,
        this.grossWeight = grossWeight,
        this.shade = shade,
        this.shadeGroup = shadeGroup,
        this.itemCode = itemCode,
        this.itemName = itemName,
        this.itemDesc = itemDesc,
        this.itemStyle = itemStyle,
        this.itemColor = itemColor,
        this.itemSize = itemSize,
        this.itemInvoice = itemInvoice,
        this.supplierCode = supplierCode,
        this.supplierName = supplierName,
        this.packListDesc = packListDesc,
        this.packListCode = packListCode,
        this.supplierROllNo = supplierROllNo,
        this.manualIssuedQty = manualIssuedQty,
        this.docketsIssuedQty = docketsIssuedQty,
        this.palletCode = palletCode,
        this.trayCode = trayCode,
        this.trolleyCode = trolleyCode
    }
}
