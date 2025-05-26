import { LayingDowntimeModel } from "./laying-downtime.model";

export class LayingTimeModel {
    layId: number;
    layNumber: number;
    startedAt: string; // YYYY-MM-DD HH:MM:SS
    completedAt: string; // YYYY-MM-DD HH:MM:SS
    totalMinutes: number;
    layDowntimes: LayingDowntimeModel[];

    constructor() {

    }
}