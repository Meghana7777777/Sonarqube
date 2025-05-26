export class PslOpRmModel {

    itemCode: string;
    opCode: string;
    
    constructor(
        itemCode: string,
        opCode: string
    ) {
        this.itemCode = itemCode;
        this.opCode = opCode;
    }
}
