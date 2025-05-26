import { CommonRequestAttrs, GlobalResponseObject } from "../../common";

export class ActualMarkerCreateRequest extends CommonRequestAttrs {
    markerName:string;
    markerLength: string;
    markerWidth: string;
    docketGroup: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, markerName: string, markerLength: string,markerWidth: string, docketGroup: string){ 
        super(username,unitCode,companyCode,userId);
        this.docketGroup=docketGroup;
        this.markerName=markerName;
        this.markerLength=markerLength;
        this.markerWidth=markerWidth;        
    }
}


export class GetActualMarkerRequest extends CommonRequestAttrs {
    docketGroup: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,docketGroup: string){ 
        super(username,unitCode,companyCode,userId);
        this.docketGroup=docketGroup;        
    }
}

export class ActualMarkerResponse extends GlobalResponseObject {
    data?: ActualMarkerModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: ActualMarkerModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}


export class ActualMarkerModel extends CommonRequestAttrs {
    markerName:string;
    markerLength: string;
    markerWidth: string;
    docketGroup: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, markerName: string, markerLength: string,markerWidth: string, docketGroup: string){ 
        super(username,unitCode,companyCode,userId);
        this.docketGroup=docketGroup;
        this.markerName=markerName;
        this.markerLength=markerLength;
        this.markerWidth=markerWidth;        
    }
}
