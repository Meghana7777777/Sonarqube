// this model is to just keep track of size specific RM properties. 
// The common RM attributes will be maintained under the sub line and this model will have the iCode as a JOIN witht complete item info + size specific RM attrs
export class RawOrderSubLineRmModel {
    iCode: string;
    consumption: number; // this is size specific consumption
    wastage: number; // this is size specific wastage

    constructor(
        iCode: string,
        consumption: number, 
        wastage: number,

    ){
        this.iCode = iCode;
        this.consumption = consumption;
        this.wastage = wastage;

    }
}
