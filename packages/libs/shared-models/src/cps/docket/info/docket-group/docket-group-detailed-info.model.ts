
import { CutRmModel } from "packages/libs/shared-models/src/oes";
import { DocRollsModel } from "../../../docket-material";
import { DocketLayModel } from "../../../lay-reporting";
import { DocketGroupBasicInfoModel } from "./docket-group-basic-info.model";
import { MoCustomerInfoHelperModel } from "packages/libs/shared-models/src/oms-old";

export class DocketGroupDetailedInfoModel {
    docketGroupBasicInfo: DocketGroupBasicInfoModel;
    moAndCustomerInfo: MoCustomerInfoHelperModel[];
    allocatedRolls: DocRollsModel[];
    fabricInfo: CutRmModel[];
    layingInfo?: DocketLayModel[];

    constructor(
        docketGroupBasicInfo: DocketGroupBasicInfoModel,
        moAndCustomerInfo: MoCustomerInfoHelperModel[],
        allocatedRolls: DocRollsModel[],
        fabricInfo: CutRmModel[],
        layingInfo?: DocketLayModel[]
    ) {
        this.docketGroupBasicInfo = docketGroupBasicInfo;
        this.moAndCustomerInfo = moAndCustomerInfo;
        this.allocatedRolls = allocatedRolls;
        this.layingInfo = layingInfo;
        this.fabricInfo = fabricInfo;
    }
}


