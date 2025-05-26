class StockInfoQueryResp  {
    packListId: number;
    objectId: number;
    poNumber: string;
    inspectionPick: boolean;
    objectType: string;
    supplierObjectNo: string;
    supQuantity: number;
    iUom: string;
    intQuantity: number;
    supLength: number;
    supLengthUom: string;
    intWidth: number;
    supWidthUom: string;
    intLength: number;
    intLengthUom: string; // always 'METER'
    supWidth: string;
    intWidthUom: string;  // always 'CM'
    supNetWeight: string;
    supGrossWeight: string;
    supShade: string;
    supGsm: number;
    allocatedQuantity: number;
    returnQuantity: string;
    issuedQuantity: number;
    objectBarcode: string;
    measuredWidth: string;
    qrCode: string;
    lotNumber: string;
    batchNumber: string;
    objectSequenceNumber: number;
    objectGrnQuantity: number;
    objectJoins: number;
    actWidth: string;
    actLength: number;
    actShade: string;
    actShadeGroup: string;
    actGsm: string;
    actWeight: number;
    itemCode: string;
    itemName: string;
    itemDesc: string;
    supUOM: string;
    actUom: string;
    itemCategory: string;
    itemColor: string;
    itemStyle: string;
    itemSize: string;
    invoiceNumber: string;
    supplierCode: string;
    supplierName: string;
    description: string;
    packingListCode: string;
    phlineId: number;
  
  }