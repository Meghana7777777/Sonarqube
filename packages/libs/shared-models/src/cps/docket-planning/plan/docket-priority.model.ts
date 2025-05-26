
export class DocketPriorityModel {
    id?: number; 
    matReqNo: string;
    docketGroup: string;
    priority: number;
    constructor(
        matReqNo: string,
        docketGroup: string,
        priority: number,
        id?:number
    ) {
        this.matReqNo = matReqNo;
        this.docketGroup = docketGroup;
        this.priority = priority;
        this.id = id;
    }
}