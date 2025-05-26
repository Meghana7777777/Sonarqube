export class PackJobResModel{
    packJobId: number;
    packJobNumber: string;
    constructor(
        packJobId: number,
        packJobNumber: string,
    ){
        this.packJobId = packJobId;
        this.packJobNumber = packJobNumber
    }
}