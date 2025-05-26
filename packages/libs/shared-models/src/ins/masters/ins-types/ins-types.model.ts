import { FGItemCategoryEnum, PhItemCategoryEnum } from "../../../common";

export class InsTypesModel {
    itemCategoryType: PhItemCategoryEnum | FGItemCategoryEnum;
    insTypeI1: string;
    insTypeI2: string;
    requiredForAlloc: boolean;
    requiredForDis: boolean;
    defaultPerc: number;
    constructor(itemCategoryType: PhItemCategoryEnum | FGItemCategoryEnum, insTypeI1: string,insTypeI2: string, requiredForAlloc: boolean, requiredForDis: boolean, defaultPerc: number) {
        this.itemCategoryType = itemCategoryType;
        this.insTypeI1 = insTypeI1;
        this.insTypeI2=insTypeI2;
        this.requiredForAlloc = requiredForAlloc;
        this.requiredForDis = requiredForDis;
        this.defaultPerc = defaultPerc;
    }
}