import { ActualRollInfoModel, PalletBinStatusEnum, PhItemCategoryEnum, PhItemLinesObjectTypeEnum, PhLinesGrnStatusEnum } from "@xpparel/shared-models";


export class RollInfoModel {
  id: number;
  rollNumber: number;
  barcode: string;
  externalRollNumber: string;
  objectType: PhItemLinesObjectTypeEnum;

  inputQuantity: number;
  inputQuantityUom: string;
  supplierQuantity: number;

  inputLength: number;
  inputLengthUom: string;
  supplierLength: number;
  measuredWidth: string;

  inputWidth: number;
  inputWidthUom: string;
  supplierWidth: number;

  netWeight: number;
  grossWeight: number;
  

  shade: string; 
  gsm: number;

  skLength: number;
  skWidth: number;
  skGroup: number;

  remarks: string;
  printStatus: boolean;
  printReleased: boolean;
  qrCodeInfo: string;
  pickForInspection: boolean;
  isOverRideSysAllocation: boolean; // false
  materialItemCode: string;
  materialItemName: string;
  materialItemDesc: string;
  // TODO
  itemCategory: PhItemCategoryEnum;
  itemColor: string;
  itemStyle: string;
  itemSize: string;
  batchNumber: string;
  lotNumber: string;
  status: PalletBinStatusEnum;
  packListId: number;
  poNumber: string;
  poLineItemNo: string;
  grnStatus: PhLinesGrnStatusEnum;

  measuredWeight: number;
  objectSeqNumber: number;
  packListCode: string;
  supplierCode: string;
  supplierName: string;
  inspCompleted: boolean;
  issuedQuantity: number;
  allocatedQuantity: number;

  actualRollInfo:ActualRollInfoModel;


  constructor(
    id: number,
    rollNumber: number,
    barcode: string,
    externalRollNumber: string,
    objectType: PhItemLinesObjectTypeEnum,

    inputQuantity: number,
    inputQuantityUom: string,
    supplierQuantity: number,
    inputLength: number,
    inputLengthUom: string,
    supplierLength: number,

    inputWidth: number,
    inputWidthUom: string,
    supplierWidth: number,

    netWeight: number,
    grossWeight: number,

    shade: string,
    gsm: number,

    skLength: number,
    skWidth: number,
    skGroup: number,

    remarks: string,
    printStatus: boolean,
    printReleased: boolean,
    qrCodeInfo: string,
    pickForInspection: boolean,
    isOverRideSysAllocation: boolean, // false
    materialItemCode: string,
    materialItemName: string,
    materialItemDesc: string,
    // TODO
    itemCategory: PhItemCategoryEnum,
    itemColor: string,
    itemStyle:string,
    itemSize: string,
    batchNumber: string,
    lotNumber: string,
    status: PalletBinStatusEnum,
    packListId: number,
    poNumber: string,
    poLineItemNo: string,
    measuredWidth: string,
    grnStatus: PhLinesGrnStatusEnum,
    measuredWeight: number,
    objectSeqNumber: number,
    packListCode: string,
    supplierCode: string,
    supplierName: string,
    inspCompleted: boolean,
    issuedQuantity: number,
    allocatedQuantity: number,
    actualRollInfo:ActualRollInfoModel,
  ) {
    this.id = id;
    this.rollNumber = rollNumber;
    this.barcode = barcode;
    this.externalRollNumber = externalRollNumber;
    this.objectType = objectType;

    this.inputQuantity = inputQuantity;
    this.inputQuantityUom = inputQuantityUom;
    this.supplierQuantity = supplierQuantity;

    this.inputLength = inputLength;
    this.inputLengthUom = inputLengthUom;
    this.supplierLength = supplierLength;

    this.inputWidth = inputWidth;
    this.inputWidthUom = inputWidthUom;
    this.supplierWidth = supplierWidth;

    this.netWeight = netWeight;
    this.grossWeight = grossWeight;

    this.shade = shade;
    this.gsm = gsm;

    this.skLength = skLength;
    this.skWidth = skWidth;
    this.skGroup = skGroup;

    this.remarks = remarks;
    this.printStatus = printStatus;
    this.printReleased = printReleased;
    this.qrCodeInfo = qrCodeInfo;
    this.pickForInspection = pickForInspection;
    this.isOverRideSysAllocation = isOverRideSysAllocation;
    this.materialItemCode = materialItemCode;
    this.materialItemName = materialItemName;
    this.materialItemDesc = materialItemDesc;
    // TODO
    this.itemCategory = itemCategory;
    this.itemColor = itemColor;
    this.itemStyle = itemStyle;
    this.itemSize = itemSize;
    this.batchNumber = batchNumber;
    this.lotNumber = lotNumber;
    this.status = status;
    this.packListId = packListId;
    this.poNumber = poNumber;
    this.poLineItemNo = poLineItemNo;
    this.measuredWidth = measuredWidth;
    this.grnStatus = grnStatus;
    this.measuredWeight = measuredWeight;
    this.objectSeqNumber = objectSeqNumber;
    this.packListCode = packListCode;
    this.supplierCode = supplierCode;
    this.supplierName = supplierName;
    this.inspCompleted = inspCompleted;
    this.issuedQuantity = issuedQuantity;
    this.allocatedQuantity = allocatedQuantity;
    this.actualRollInfo = actualRollInfo;
  }
}
