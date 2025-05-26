
export class LayingDowntimeModel {
    reasonId: number;
    downtimeReason: string;
    downtimeStartAt: string; // YYYY-MM-DD HH:MM:SS
    downtimeEndAt: string; // YYYY-MM-DD HH:MM:SS
    totalMinutes: number;

    constructor() {

    }
}