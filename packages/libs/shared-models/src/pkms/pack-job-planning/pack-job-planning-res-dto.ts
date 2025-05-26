import { PackJobModel } from "../pack-list"

export class PackingTableJobsDto {
    tableId: number
    tableDesc: string
    tableName: string
    jobInfo: PackJobModel[];
    cartonsPerPackJob: number;
    constructor(
        tableId: number,
        tableDesc: string,
        tableName: string,
        jobInfo: PackJobModel[],
        cartonsPerPackJob: number

    ) {
        this.tableId = tableId
        this.tableDesc = tableDesc
        this.tableName = tableName
        this.jobInfo = jobInfo;
        this.cartonsPerPackJob = cartonsPerPackJob;
    }
}