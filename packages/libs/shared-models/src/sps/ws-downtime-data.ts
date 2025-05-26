export class DowntimeData {
    wsId: string;
    wsCode: string;
    dReason: string;
    startTime: string;
    endTime: string;
    opsCode: string;
    status: string;
    id:number;
    moduleCode:string;


    constructor(
        wsId: string,
        wsCode: string,
        dReason: string ,
        startTime: string,
        endTime: string,
        opsCode: string ,
        status: string,
        id: number,
        moduleCode: string


    ) {

        this.wsId = wsId;
        this.wsCode = wsCode;
        this.dReason = dReason ;
        this.startTime = startTime ;
        this.endTime = endTime ;
        this.opsCode = opsCode ;
        this.status = status ;
        this.id = id ;
        this.moduleCode = moduleCode ;
    }
}