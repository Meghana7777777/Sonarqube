
export class PoProdNameModel {
    poSerial: number;
    productType: string;
    productName: string;
    color: string;
    components: string[];
    opsVersionId: number;

    constructor(
        poSerial: number,
        productType: string,
        productName: string,
        color: string,
        components: string[],
        opsVersionId: number
    ) {
        this.poSerial = poSerial;
        this.productName = productName;
        this.productType = productType;
        this.color = color;
        this.components = components;
        this.opsVersionId = opsVersionId;
    }
}