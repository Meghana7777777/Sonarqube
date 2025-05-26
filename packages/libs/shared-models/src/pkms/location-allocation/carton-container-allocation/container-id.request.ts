import { CommonRequestAttrs } from "../../../common";

export class ContainerIdRequest extends CommonRequestAttrs{
    containerId: number;
    containerCode: string;
    iNeedCartonActualInfoAlso?: boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,containerId: number,containerCode: string, iNeedCartonActualInfoAlso?: boolean) {
        super(username, unitCode, companyCode, userId);
        this.containerId = containerId;
        this.containerCode = containerCode;
        this.iNeedCartonActualInfoAlso = iNeedCartonActualInfoAlso;
    }
}   