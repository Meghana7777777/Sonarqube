import { CommonRequestAttrs } from "../../../common";


export class PoIdRequest extends CommonRequestAttrs {
    poID: number;
    constructor(poID: number, username: string, unitCode: string, companyCode: string, userId: number) {
        super(username, unitCode, companyCode, userId)

        this.poID = poID
    }
}