import { CommonRequestAttrs } from "../../../common";
import { InsTypeEnum } from "../../enum";

export class InsTypesRequest extends CommonRequestAttrs {
    id: number;
    insActivityStatus: InsTypeEnum;
    insTypeI1: string;
    insTypeI2: string;
    requiredForAlloc: boolean;
    requiredForDis: boolean;
    defaultPerc: number;
    constructor(
        username: string, unitCode: string, companyCode: string, userId: number,
        id: number, insActivityStatus: InsTypeEnum, insTypeI1: string,insTypeI2: string, requiredForAlloc: boolean, requiredForDis: boolean, defaultPerc: number) {

        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.insActivityStatus = insActivityStatus;
        this.insTypeI1 = insTypeI1;
        this.insTypeI2=insTypeI2;
        this.requiredForAlloc = requiredForAlloc;
        this.requiredForDis = requiredForDis;
        this.defaultPerc = defaultPerc;



    }
}

export class InsTypesRequestById extends CommonRequestAttrs {
    ids: number[];
    constructor(
        username: string, unitCode: string, companyCode: string, userId: number,
        ids: number[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.ids = ids;
    }
}