
export class DocketNumberModel {
    docketNumber: string;
    components: string[];
    itemCode: string;
    itemDesc: string;
    hasEmbOperation: boolean;
    embOperations: string[]; // the emb op codes if any component in this docket is undergoing the embellishment
    cutReported: boolean;
    layConfirmed: boolean;
    cutNumbers: number[];
    isMainDocket: boolean;
    productName: string;
    docketGroup: string;
    fgColor: string;

    constructor(
        docketNumber: string,
        components: string[],
        itemCode: string,
        itemDesc: string,
        hasEmbOperation: boolean,
        embOperations: string[], // the emb op codes if any component in this docket is undergoing the embellishment
        cutReported: boolean,
        layConfirmed: boolean,
        cutNumbers: number[],
        isMainDocket: boolean,
        productName: string,
        docketGroup: string,
        fgColor: string,
    ) {
        this.docketNumber = docketNumber;
        this.components = components;
        this.itemCode = itemCode;
        this.itemDesc = itemDesc;
        this.hasEmbOperation = hasEmbOperation;
        this.embOperations = embOperations;
        this.cutReported = cutReported;
        this.layConfirmed = layConfirmed;
        this.cutNumbers = cutNumbers;
        this.isMainDocket = isMainDocket;
        this.productName = productName;
        this.docketGroup = docketGroup;
        this.fgColor = fgColor;
    }
}