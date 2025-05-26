import { CutRmModel, PoMarkerModel, PoRatioFabricModel, PoRatioSizeModel, PoSizeQtysModel } from "../../../oes";
import { MoCustomerInfoHelperModel } from "../../../oms-old";
import { DocRollsModel } from "../../docket-material";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum } from "../../enum";
import { DocketLayModel, LayRollInfoModel } from "../../lay-reporting";
import { DocketBasicInfoModel } from "./docket-basic-info.model";

export class DocketDetailedInfoModel {
    docketBasicInfo: DocketBasicInfoModel;
    moAndCustomerInfo: MoCustomerInfoHelperModel[];
    allocatedRolls: DocRollsModel[];
    fabricInfo: CutRmModel;
    layingInfo?: DocketLayModel[];

    constructor(
        docketBasicInfo: DocketBasicInfoModel,
        moAndCustomerInfo: MoCustomerInfoHelperModel[],
        allocatedRolls: DocRollsModel[],
        fabricInfo: CutRmModel,
        layingInfo?: DocketLayModel[]
    ) {
        this.docketBasicInfo = docketBasicInfo;
        this.moAndCustomerInfo = moAndCustomerInfo;
        this.allocatedRolls = allocatedRolls;
        this.layingInfo = layingInfo;
        this.fabricInfo = fabricInfo;
    }
}


