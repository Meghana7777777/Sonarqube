import { CommonRequestAttrs } from "../../../common-request-attr.model";

export class WorkstationModel {
    id?: number;
    wsCode: string;
    wsName: string;
    wsDesc:string;
    moduleCode:string;
    isActive:boolean;

    constructor(
       
        id: number, 
        wsCode: string, 
        wsName: string,
        wsDesc:string,
        moduleCode:string,
        isActive:boolean,

    ) {

        this.id = id;
        this.wsCode = wsCode;
        this.wsName = wsName;
        this.wsDesc = wsDesc;
        this.moduleCode = moduleCode;
        this.isActive=isActive

    }
}