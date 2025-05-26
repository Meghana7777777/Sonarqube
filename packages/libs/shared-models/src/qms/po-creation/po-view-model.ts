export class PoViewModel {
    poId: number;
    poNumber: string;
    buyerName: string;
    colorName: string;
    styleName: string;
    estimatedClosedDate: any;
    status: string;
    quantity: number;
    isActive?: boolean;
    versionFlag?: number;
    qualityData?: {}


    constructor(poId: number, poNumber: string, buyerName: string, colorName: string, styleName: string, estimatedClosedDate: any, status: string, quantity: number, isActive?: boolean, versionFlag?: number,
        qualityData?: {}
    ) {
        this.poId = poId
        this.poNumber = poNumber
        this.estimatedClosedDate = estimatedClosedDate
        this.status = status
        this.isActive = isActive
        this.versionFlag = versionFlag
        this.quantity = quantity
        this.buyerName = buyerName
        this.colorName = colorName
        this.styleName = styleName
        this.qualityData = qualityData

    }
}