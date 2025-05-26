
export class DocRollsRequest {
    rollId: number;
    rollBarcode: string;
    allocatedQauntity: number;
    constructor(rollId: number, rollBarcode: string, allocatedQauntity: number) {
        this.rollId = rollId;
        this.rollBarcode = rollBarcode;
        this.allocatedQauntity = allocatedQauntity;
    }
}