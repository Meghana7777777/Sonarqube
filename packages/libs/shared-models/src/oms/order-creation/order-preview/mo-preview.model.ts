export class ManufacturingOrderPreviewData {
  moNumber: string;
  uploadDate: string;
  styleName: string;
  buyer: string;
  poNo: string;
  styleCode: string;
  packMethod: string;
  isMoConfirmed: boolean;
  moLines: MoPreviewMoLine[];

  constructor(
    moNumber: string,
    uploadDate: string,
    styleName: string,
    buyer: string,
    poNo: string,
    styleCode: string,
    packMethod: string,
    isMoConfirmed: boolean, 
    moLines: MoPreviewMoLine[]
  ) {
    this.moNumber = moNumber;
    this.uploadDate = uploadDate;
    this.styleName = styleName;
    this.buyer = buyer;
    this.poNo = poNo;
    this.styleCode = styleCode;
    this.packMethod = packMethod;
    this.isMoConfirmed = isMoConfirmed;
    this.moLines = moLines;
  }
}

export class MoPreviewMoLine {
  moLineNumber: string;
  productCode: string;
  productType: string;
  destination: string;
  deliveryDate: string;
  zFeature: string;
  colorSizes: MoPreviewColorWiseSizes[];
  bomInfo: MoPreviewBomInfo[];

  constructor(
    moLineNumber: string,
    productCode: string,
    productType: string,
    destination: string,
    deliveryDate: string,
    zFeature: string,
    colorSizes: MoPreviewColorWiseSizes[],
    bomInfo: MoPreviewBomInfo[]
  ) {
    this.moLineNumber = moLineNumber;
    this.productCode = productCode;
    this.productType = productType;
    this.destination = destination;
    this.deliveryDate = deliveryDate;
    this.zFeature = zFeature;
    this.colorSizes = colorSizes;
    this.bomInfo = bomInfo;
  }
}

export class MoPreviewColorWiseSizes {
  color: string;
  sizeWiseQuantities: MoPreviewSizeWiseQuantities[];

  constructor(color: string, sizeWiseQuantities: MoPreviewSizeWiseQuantities[]) {
    this.color = color;
    this.sizeWiseQuantities = sizeWiseQuantities;
  }
}

export class MoPreviewSizeWiseQuantities {
  productCode:string;
  size: string;
  qty: string;

  constructor(productCode:string,size: string, qty: string) {
    this.productCode = productCode;
    this.size = size;
    this.qty = qty;
  }
}

export class MoPreviewBomInfo {
  routeProcess: string;
  itemCode: string;
  itemName: string;
  itemDesc: string;
  avgCons: number;
  wastage: string;
  requireQty: number;

  constructor(
    routeProcess: string,
    itemCode: string,
    itemName: string,
    itemDesc: string,
    avgCons: number,
    wastage: string,
    requireQty: number
  ) {
    this.routeProcess = routeProcess;
    this.itemCode = itemCode;
    this.itemName = itemName;
    this.itemDesc = itemDesc;
    this.avgCons = avgCons;
    this.wastage = wastage;
    this.requireQty = requireQty;
  }
}
