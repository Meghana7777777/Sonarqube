import { CommonRequestAttrs } from "../../common";

export class DeleteSewingJobsRequest extends CommonRequestAttrs{
    jobPreferenceId : number;
    constructor(username: string,unitCode: string,companyCode: string,userId: number,jobPreferenceId : number){
        super(username, unitCode, companyCode, userId)
        this.jobPreferenceId = jobPreferenceId;
    }

    
}