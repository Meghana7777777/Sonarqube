import { CommonResponse, FgWhReportResponseDto, FgWhReqHeaderDetailsModel, FgWhReqHeaderFilterReq, PKMSWhCodeReqDto } from "@xpparel/shared-models";
import { BaseInterfaceRepository } from "../../../database/common-repositories";
import { FgWhReqHeaderEntity } from "../entity/fg-wh-req-header.entity";

export interface FgWhReqHeaderRepoInterface extends BaseInterfaceRepository<FgWhReqHeaderEntity> {

     getFgWhHeaderReqDetails(req: FgWhReqHeaderFilterReq): Promise<FgWhReqHeaderDetailsModel[]>
     getCountAgainstCurrentStage(req: FgWhReqHeaderFilterReq): Promise<CommonResponse[]>
     getFgWhLocationReport(req: PKMSWhCodeReqDto): Promise<FgWhReportResponseDto[]>

}