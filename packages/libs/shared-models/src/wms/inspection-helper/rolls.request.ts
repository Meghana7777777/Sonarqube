import { CommonRequestAttrs } from "../../common";

export class RollNumberRequest extends CommonRequestAttrs {
    rollNumber:number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, rollNumber: number) {
        super(username, unitCode, companyCode, userId);
        this.rollNumber = rollNumber;
    }
}