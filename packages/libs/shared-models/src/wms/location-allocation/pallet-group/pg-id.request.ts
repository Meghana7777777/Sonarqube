import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";

export class PgIdRequest extends CommonRequestAttrs {
    pgId: number;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, binId: number, isOverRideSysAllocation: boolean, pgId: number) {
        super(username, unitCode, companyCode, userId)
        this.pgId = pgId;
    }
}