import { InsRelaxationInfoModel } from "./ins-relaxation.model";


export class InsRollsAndBalesDataModel {
    numberOfRolls : number;
    numberOfBales : number;
    passPercent : number

    constructor(numberOfRolls : number,
        numberOfBales : number,
        passPercent?: number) {
        this.numberOfBales = numberOfBales;
        this.numberOfRolls = numberOfRolls;
        this.passPercent = passPercent
    }
}

export class InsKpiCardForInspectionModel {
    shade: InsRollsAndBalesDataModel;
    shrinkage: InsRollsAndBalesDataModel;
    fourPoint: InsRollsAndBalesDataModel;
    gsm: InsRollsAndBalesDataModel;
    itemRelaxationToday: InsRelaxationInfoModel;
   

    constructor(
        shade: InsRollsAndBalesDataModel,
        shrinkage: InsRollsAndBalesDataModel,
        fourPoint: InsRollsAndBalesDataModel,
        gsm: InsRollsAndBalesDataModel,
        itemRelaxationToday: InsRelaxationInfoModel,

    ) {
        this.shade   = shade
        this.gsm = gsm;
        this.shrinkage = shrinkage
        this.fourPoint = fourPoint
        this.itemRelaxationToday = itemRelaxationToday
    }
}