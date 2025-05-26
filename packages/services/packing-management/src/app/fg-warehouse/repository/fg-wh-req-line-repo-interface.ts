import { PKMSPackJobIdReqDto, PKMSFgWhReqNoResponseDto } from "@xpparel/shared-models";
import { BaseInterfaceRepository } from "../../../database/common-repositories";
import { FgWhReqLinesEntity } from "../entity/fg-wh-req-lines.entity";

export interface FgWhReqLineRepoInterface extends BaseInterfaceRepository<FgWhReqLinesEntity> {
    getFgReqNoAgainstToPackJobNo(req: PKMSPackJobIdReqDto): Promise<PKMSFgWhReqNoResponseDto[]>
}