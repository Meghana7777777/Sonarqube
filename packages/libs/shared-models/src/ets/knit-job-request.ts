import { CommonRequestAttrs } from "../common";



export class KnitJobRequest extends CommonRequestAttrs {
    knitJobNumber: string;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, knitJobNumber: string) {
        super(username, unitCode, companyCode, userId); // calling the parent constructor
        this.knitJobNumber = knitJobNumber; // initializing the knitJobNumber specific to KnitJobRequest
    }
}
 