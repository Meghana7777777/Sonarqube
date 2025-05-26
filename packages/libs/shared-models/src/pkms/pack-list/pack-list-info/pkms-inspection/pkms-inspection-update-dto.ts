import { PackFinalInspectionStatusEnum } from "packages/libs/shared-models/src/pkms";
import { PKMSInsSummeryCartonsDto } from "./get-insp-details-dto";
import { CommonRequestAttrs } from "packages/libs/shared-models/src/common";

export class PKMSInspectionHeaderDto extends CommonRequestAttrs {
    inspector: string;
    area: string;
    insStartedAt: string;
    insCompletedAt: string;
    finalInspectionStatus: PackFinalInspectionStatusEnum;
    insCartons: PKMSInsSummeryCartonsDto[];
    constructor(
        inspector: string,
        area: string,
        insStartedAt: string,
        insCompletedAt: string,
        finalInspectionStatus: PackFinalInspectionStatusEnum,
        insCartons: PKMSInsSummeryCartonsDto[],
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.inspector = inspector;
        this.area = area;
        this.insStartedAt = insStartedAt;
        this.insCompletedAt = insCompletedAt;
        this.finalInspectionStatus = finalInspectionStatus;
        this.insCartons = insCartons;
    }
}

