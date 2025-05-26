import { CommonRequestAttrs } from "../common";
import { WsDowntimeStatusEnum } from "./enum";

export class DowntimeRequest extends CommonRequestAttrs {
    wsId: string;
    wsCode: string;
    moduleCode:string;
    dReason: string;
    startTime: string;
    endTime: string;
    opsCode: string;
    status: WsDowntimeStatusEnum;
    remarks:string


    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        wsId: string,
        wsCode: string,
        moduleCode: string,
        dReason: string ,
        startTime: string,
        endTime: string,
        opsCode: string ,
        status: WsDowntimeStatusEnum,
        remarks:string

    ) {
        super(username, unitCode, companyCode, userId);

        this.wsId = wsId;
        this.wsCode = wsCode;
        this.moduleCode=moduleCode;
        this.dReason = dReason ;
        this.startTime = startTime ;
        this.endTime = endTime ;
        this.opsCode = opsCode ;
        this.status = status ;
        this.remarks=remarks;
    }
}