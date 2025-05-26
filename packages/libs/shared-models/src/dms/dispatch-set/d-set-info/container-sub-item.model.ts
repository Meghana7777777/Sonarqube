export class ContainerSubItemModel {
    subItemBarcode: string;
    subItemDisplayNo: string;
    constructor(
        subItemBarcode: string, subItemDisplayNo: string) {
        this.subItemBarcode = subItemBarcode
        this.subItemDisplayNo = subItemDisplayNo
    }
}