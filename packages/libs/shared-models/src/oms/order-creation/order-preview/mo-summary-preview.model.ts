export class MoSummaryPreviewData {
    uploadDate: string;
    moNumber: string;
    styleName: string;
    poNo: string;
    yarnType: string;
    productType: string;
    buyerName: string;
    season: string;
    cpo: string;
    deliveryDate: string;
    garmentUnit: string;
    specialRemarks: string;
    productImage: string;
    isMoProceeded: number;
    colorSizes: MOSummaryColorSizes[];
    productCodes?: string;

    constructor(
        uploadDate: string,
        moNumber: string,
        styleName: string,
        poNo: string,
        yarnType: string,
        productType: string,
        buyerName: string,
        season: string,
        cpo: string,
        deliveryDate: string,
        garmentUnit: string,
        specialRemarks: string,
        productImage: string,
        isMoProceeded: number,
        colorSizes: MOSummaryColorSizes[],
        productCodes?: string
    ) {
        this.uploadDate = uploadDate;
        this.moNumber = moNumber;
        this.styleName = styleName;
        this.poNo = poNo;
        this.yarnType = yarnType;
        this.productType = productType;
        this.buyerName = buyerName;
        this.season = season;
        this.cpo = cpo;
        this.deliveryDate = deliveryDate;
        this.garmentUnit = garmentUnit;
        this.specialRemarks = specialRemarks;
        this.productImage = productImage;
        this.isMoProceeded = isMoProceeded
        this.colorSizes = colorSizes;
        this.productCodes = productCodes;
    }
}

export class MOSummarySizeWiseQuantities {
    productCode: string;
    size: string;
    qty: string;

    constructor(size: string, qty: string, productCode) {
        this.productCode = productCode
        this.size = size;
        this.qty = qty;
    }
}

export class MOSummaryColorSizes {
    color: string;
    sizeWiseQuantities: MOSummarySizeWiseQuantities[];
    bom: MOSummaryBomInfo[];
    routingOperations: MOSummaryRoutingOperations[];

    constructor(
        color: string,
        sizeWiseQuantities: MOSummarySizeWiseQuantities[],
        bom: MOSummaryBomInfo[],
        routingOperations: MOSummaryRoutingOperations[]
    ) {
        this.color = color;
        this.sizeWiseQuantities = sizeWiseQuantities;
        this.bom = bom;
        this.routingOperations = routingOperations;
    }
}

export class MOSummaryBomInfo {
    routeProcess: string;
    itemCode: string;
    itemName: string;
    itemDesc: string;
    avgCons: number;
    wastage: string;
    requireQty: number;
    fgColor: string;

    constructor(
        routeProcess: string,
        itemCode: string,
        itemName: string,
        itemDesc: string,
        avgCons: number,
        wastage: string,
        requireQty: number,
        fgColor: string
    ) {
        this.routeProcess = routeProcess;
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.itemDesc = itemDesc;
        this.avgCons = avgCons;
        this.wastage = wastage;
        this.requireQty = requireQty;
        this.fgColor = fgColor;
    }
}

export class MOSummaryRoutingOperations {
    routeProcess: string;
    subProcess: string;
    operationName: string;
    smv: string;
    machineType: string;
    numberOfOperators: number;
    remarks: string;

    constructor(
        routeProcess: string,
        subProcess: string,
        operationName: string,
        smv: string,
        machineType: string,
        numberOfOperators: number,
        remarks: string
    ) {
        this.routeProcess = routeProcess;
        this.subProcess = subProcess;
        this.operationName = operationName;
        this.smv = smv;
        this.machineType = machineType;
        this.numberOfOperators = numberOfOperators;
        this.remarks = remarks;
    }
}
