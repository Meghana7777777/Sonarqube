export class SaleOrderPreviewData {
    soNumber: string;
    uploadDate: string;
    styleName: string;
    coNumber: string;
    buyerName: string;
    poNo: string;
    styleCode: string;
    packMethod: string;
    soLines: SoPreviewSoLine[];
    isSoConfirmed: number;

    constructor(
        soNumber: string,
        uploadDate: string,
        styleName: string,
        coNumber: string,
        buyerName: string,
        poNo: string,
        styleCode: string,
        packMethod: string,
        soLines: SoPreviewSoLine[],
        isSoConfirmed: number
    ) {
        this.soNumber = soNumber;
        this.uploadDate = uploadDate;
        this.styleName = styleName;
        this.coNumber = coNumber;
        this.buyerName = buyerName;
        this.poNo = poNo;
        this.styleCode = styleCode;
        this.packMethod = packMethod;
        this.soLines = soLines;
        this.isSoConfirmed = isSoConfirmed;
    }
}

export class SoPreviewSoLine {
    soLineNumber: string;
    productCode: string[];
    productType: string[];
    destination: string[];
    deliveryDate: string[];
    buyerPo: string[];
    zFeature: string;
    colorSizes: SoPreviewColorWiseSizes[];

    constructor(
        soLineNumber: string,
        productCode: string[],
        productType: string[],
        destination: string[],
        deliveryDate: string[],
        zFeature: string,
        buyerPo: string[],
        colorSizes: SoPreviewColorWiseSizes[]
    ) {
        this.soLineNumber = soLineNumber;
        this.productCode = productCode;
        this.productType = productType;
        this.destination = destination;
        this.deliveryDate = deliveryDate;
        this.zFeature = zFeature;
        this.buyerPo = buyerPo;
        this.colorSizes = colorSizes;
    }
}

export class SoPreviewColorWiseSizes {
    color: string;
    sizeWiseQuantities: SoPreviewSizeWiseQuantities[];

    constructor(
        color: string,
        sizeWiseQuantities: SoPreviewSizeWiseQuantities[]
    ) {
        this.color = color;
        this.sizeWiseQuantities = sizeWiseQuantities;
    }
}

export class SoPreviewSizeWiseQuantities {
    size: string;
    qty: string;
    productCode:string;
    constructor(
        size: string,
        qty: string,
        productCode:string,
    ) {
        this.size = size;
        this.qty = qty;
        this.productCode=productCode;
    }
}
