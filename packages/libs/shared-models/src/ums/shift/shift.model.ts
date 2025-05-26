import { CommonRequestAttrs } from "../../common";

export class ShiftModel {
    shift: string;
    startAt: string; // HH:MM
    endAt: string; // HH:MM
    
    constructor(
        shift: string,
        startAt: string, // HH:MM
        endAt: string // HH:MM
    ) {
        this.shift = shift;
        this.startAt = startAt;
        this.endAt = endAt;
    }
}