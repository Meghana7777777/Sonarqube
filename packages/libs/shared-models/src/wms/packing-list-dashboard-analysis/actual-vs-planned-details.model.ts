export class PackingListActualVsPlanned {
    packingListId: number;
    checkInActualDate: Date;
    checkInScheduledDate: string;
    unloadingActualDate: Date;
    unloadingScheduledDate: string;
    grnActualDate: string;
    grnScheduledDate: string;
    inspectionActualDate: Date;
    inspectionScheduledDate: Date;
    cuttingActualDate: string;
    cuttingScheduledDate: string;

    constructor(
        packingListId: number,
        checkInActualDate: Date,
        checkInScheduledDate: string,
        unloadingActualDate: Date,
        unloadingScheduledDate: string,
        grnActualDate: string,
        grnScheduledDate: string,
        inspectionActualDate: Date,
        inspectionScheduledDate: Date,
        cuttingActualDate: string,
        cuttingScheduledDate: string
    ){
        this.packingListId= packingListId;
        this.checkInActualDate= checkInActualDate;
        this.checkInScheduledDate= checkInScheduledDate;
        this.unloadingActualDate= unloadingActualDate;
        this.unloadingScheduledDate= unloadingScheduledDate;
        this.grnActualDate= grnActualDate;
        this.grnScheduledDate= grnScheduledDate;
        this.inspectionActualDate= inspectionActualDate;
        this.inspectionScheduledDate= inspectionScheduledDate;
        this.cuttingActualDate= cuttingActualDate;
        this.cuttingScheduledDate= cuttingScheduledDate;
    }
}