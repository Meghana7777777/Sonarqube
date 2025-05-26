import { CommonRequestAttrs } from "../../../common";

export class ContainerGroupIdRequest extends CommonRequestAttrs {
    pgId: number;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, locationId: number, isOverRideSysAllocation: boolean, pgId: number) {
        super(username, unitCode, companyCode, userId)
        this.pgId = pgId;
    }
}