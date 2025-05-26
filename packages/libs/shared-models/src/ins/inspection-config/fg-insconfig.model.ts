import { InsConfigThreadValModel, InsConfigTrimValModel, InsConfigValModel, InsConfigYarnValModel } from "./ins-config.model";

export class InsFgInsConfigModel {
    buyerCode: string; // this is set if the ask if buyer wise
    buyerName: string;
    insConfigs: InsConfigValModel[];
    plRefId?:number;
    constructor(buyerCode: string, buyerName: string, insConfigs: InsConfigValModel[],plRefId?:number) {
        this.buyerCode = buyerCode;
        this.buyerName = buyerName;
        this.insConfigs = insConfigs;
        this.plRefId=plRefId;
    }
} 

// export class InsThreadInsConfigModel {
//     buyerCode: string; // this is set if the ask if buyer wise
//     buyerName: string;
//     insConfigs: InsConfigThreadValModel[];
//     constructor(buyerCode: string, buyerName: string, insConfigs: InsConfigThreadValModel[]) {
//         this.buyerCode = buyerCode;
//         this.buyerName = buyerName;
//         this.insConfigs = insConfigs;
//     }
// } 


export class InsYarnInsConfigModel {
    buyerCode: string; // this is set if the ask if buyer wise
    buyerName: string;
    insConfigs: InsConfigYarnValModel[];
    constructor(buyerCode: string, buyerName: string, insConfigs: InsConfigYarnValModel[]) {
        this.buyerCode = buyerCode;
        this.buyerName = buyerName;
        this.insConfigs = insConfigs;
    }
} 

export class InsTrimInsConfigModel {
    buyerCode: string; 
    buyerName: string;
    insConfigs: InsConfigTrimValModel[];
    constructor(buyerCode: string, buyerName: string, insConfigs: InsConfigTrimValModel[]) {
        this.buyerCode = buyerCode;
        this.buyerName = buyerName;
        this.insConfigs = insConfigs;
    }
} 



