import { CommonRequestAttrs } from "../../common";

export class ShiftCreateRequest extends CommonRequestAttrs {
    id?:number;
    shift: string;
    startAt: string; // HH:MM
    endAt: string; // HH:MM

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id:number,
        shift: string,
        startAt: string, // HH:MM
        endAt: string // HH:MM
    ) {
        super(username, unitCode, companyCode, userId);
        this.id=id;
        this.shift = shift;
        this.startAt = startAt;
        this.endAt = endAt;
    }
}