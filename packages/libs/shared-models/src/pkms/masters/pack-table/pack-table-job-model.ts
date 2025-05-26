import { PackJobStatusEnum } from "../../enum";

export class PackTableJobModel{
    pkConfigId: number;
    jobNumber: string;
    jobQty: number;
    status: PackJobStatusEnum;
    workStationDesc: string;

constructor(pkConfigId: number,jobNumber: string,jobQty: number,status: PackJobStatusEnum,workStationDesc: string,){
    
    this.pkConfigId= pkConfigId;
    this.jobNumber=jobNumber;
    this.jobQty= jobQty;
    this.status= status;
    this. workStationDesc= workStationDesc;
}

}