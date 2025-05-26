import { CommonRequestAttrs } from "../../../common";
import { PoRmUpdateModel } from "./po-rm-update.model";

export class PoRmUpdateRequest extends CommonRequestAttrs {
    poSerial: number;
    rmItems: PoRmUpdateModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        rmItems: PoRmUpdateModel[],
    )
    {
        super(username, unitCode, companyCode, userId);

        this.poSerial = poSerial;
        this.rmItems = rmItems;
    }
}