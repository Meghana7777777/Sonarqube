import { CommonRequestAttrs } from "../../common";

export class MoStatusRequest extends CommonRequestAttrs {
    iNeedOnlyPlantStyleUpdatesMos: boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, iNeedOnlyPlantStyleUpdatesMos: boolean) {
        super(username, unitCode, companyCode, userId);
        this.iNeedOnlyPlantStyleUpdatesMos = iNeedOnlyPlantStyleUpdatesMos;
    }
}