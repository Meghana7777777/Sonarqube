export class StatusInfo {
    status: string;// INSP GRN check in, wms
    refIds: string[]//ph id's
    remarks: string;

    constructor(status:string,refIds:string[],remarks:string){

        this.status = status;
        this.refIds = refIds;
        this.remarks= remarks

    }
};