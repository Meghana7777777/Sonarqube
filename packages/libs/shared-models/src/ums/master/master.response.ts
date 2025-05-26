import { GlobalResponseObject } from "../../common";
import {  MasterModelDto } from "./master.model-dto";


export class  MasterResponse extends GlobalResponseObject{
    data ?: MasterModelDto[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MasterModelDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}