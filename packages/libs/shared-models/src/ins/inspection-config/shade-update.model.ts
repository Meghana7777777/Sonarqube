export class ShadeDetails {
    rollId: number;
    rollBarcode: string;
    shade: string;
    shadeGroup: string;
    constructor(rollId: number, rollBarcode: string, shade: string, shadeGroup: string) {
        this.rollId = rollId;
        this.rollBarcode = rollBarcode;
        this.shade = shade;
        this.shadeGroup = shadeGroup;
    }
}
