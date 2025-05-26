import { InsInspectionBasicInfoModel, ThreadInspectionBasicInfoModel, TrimInspectionBasicInfoModel, YarnInspectionBasicInfoModel } from "./dashboard";
import { InsIrRollModel } from "./ir-roll.model";


export class InsIrRollsModel {
    irInfo: InsInspectionBasicInfoModel;
    irRolls: InsIrRollModel[];

    constructor(irInfo: InsInspectionBasicInfoModel, irRolls: InsIrRollModel[]) {
        this.irInfo = irInfo;
        this.irRolls = irRolls;
    }
} 


export class YarnInsIrRollsModel {
    irInfo: YarnInspectionBasicInfoModel;
    irRolls: InsIrRollModel[];

    constructor(irInfo: YarnInspectionBasicInfoModel, irRolls: InsIrRollModel[]) {
        this.irInfo = irInfo;
        this.irRolls = irRolls;
    }
}


export class ThreadInsIrRollsModel {
    irInfo: ThreadInspectionBasicInfoModel;
    irRolls: InsIrRollModel[];

    constructor(irInfo: ThreadInspectionBasicInfoModel, irRolls: InsIrRollModel[]) {
        this.irInfo = irInfo;
        this.irRolls = irRolls;
    }
}


export class TrimInsIrRollsModel {
    irInfo: TrimInspectionBasicInfoModel;
    irRolls: InsIrRollModel[];

    constructor(irInfo: TrimInspectionBasicInfoModel, irRolls: InsIrRollModel[]) {
        this.irInfo = irInfo;
        this.irRolls = irRolls;
    }
}