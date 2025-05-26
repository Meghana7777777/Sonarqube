
export class EmbDispacthLineModel {
    docketNumber: string;
    components: string[];
    layNumber: number;
    cutNo: number;
    embJobNo: string;
    // operations: string[];
    totalBundles: number;
    quantity: number;
    docketGroup: string;
    cutSubNumber: number;

    constructor(
        docketNumber: string,
        components: string[],
        layNumber: number,
        cutNo: number,
        embJobNo: string,
        totalBundles: number,
        quantity: number,
        docketGroup: string,
        cutSubNumber: number
        // operations: string[]
    ) {
        this.docketNumber = docketNumber;
        this.components = components;
        this.layNumber = layNumber;
        this.cutNo = cutNo;
        this.embJobNo = embJobNo;
        // this.operations = operations;
        this.totalBundles = totalBundles;
        this.quantity = quantity;
        this.docketGroup = docketGroup;
        this.cutSubNumber = cutSubNumber;
    }
}