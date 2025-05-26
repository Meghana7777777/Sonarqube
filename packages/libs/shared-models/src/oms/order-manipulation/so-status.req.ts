import { CommonRequestAttrs } from "../../common";

export class SoStatusRequest extends CommonRequestAttrs {
    iNeedOnlyPlantStyleUpdatesSos: boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, iNeedOnlyPlantStyleUpdatesSos: boolean) {
        super(username, unitCode, companyCode, userId);
        this.iNeedOnlyPlantStyleUpdatesSos = iNeedOnlyPlantStyleUpdatesSos;
    }
}