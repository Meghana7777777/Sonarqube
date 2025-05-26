import { TotalLayedCutsModel } from "../../cut-generation";

export class LayReportingCuttingModel {
    totalLayedMeterageToday: number;
    totalLayedCutsToday: number;
    totalLayedMeterageTodayPlan: number;
    totalLayedCutsTodayPlan: number;
    totalEndBitsToday: number; 
    totalAMRNToday: number;

    constructor(
        totalLayedMeterageToday: number,
        totalLayedCutsToday: number,
        totalLayedMeterageTodayPlan: number,
        totalLayedCutsTodayPlan: number,
        totalEndBitsToday: number,
        totalAMRNToday: number
    ) {
        this.totalLayedMeterageToday = totalLayedMeterageToday;
        this.totalLayedCutsToday = totalLayedCutsToday;
        this.totalLayedMeterageTodayPlan = totalLayedMeterageTodayPlan;
        this.totalLayedCutsTodayPlan = totalLayedCutsTodayPlan;
        this.totalEndBitsToday = totalEndBitsToday;
        this.totalAMRNToday = totalAMRNToday
    }

}