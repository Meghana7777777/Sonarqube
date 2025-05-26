import { ProcessTypeEnum } from "../../../oms";

export class QMS_ReporitngStatsInfoModel{
    totalQalityChecks : number
    totalPassQty : number;
    totalPassPercent : number //pass perecentage 
    totalFailQty : number;
    totalFailPerecnt : number // fail percentage
    defectiveRate : number // defective percentage i.e fail count per 100 pcs

    constructor(totalQalityChecks : number, totalPassQty : number, totalPassPercent : number, totalFailQty : number, totalFailPerecnt : number, defectiveRate : number){
        this.totalQalityChecks = totalQalityChecks;
        this.totalPassQty = totalPassQty;
        this.totalPassPercent = totalPassPercent;
        this.totalFailQty = totalFailQty;
        this.totalFailPerecnt = totalFailPerecnt;
        this.defectiveRate = defectiveRate;
    }
}

