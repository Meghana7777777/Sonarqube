export class SjobQueryResponse {
    ids: number[];
    fgNumbers: number[];
    fgColor: string;
    productName: string;
    size: string;
    
    constructor(ids: number[], fgNumbers: number[],fgColor: string, productName: string, size: string) {
        this.ids = ids;
        this.fgNumbers = fgNumbers;
        this.fgColor = fgColor;
        this.size = size;
        this.productName = productName;

    }
}