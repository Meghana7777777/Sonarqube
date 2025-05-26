import { Injectable } from "@nestjs/common";
import { MoDataForSoSummaryResponse, SoSummaryRequest } from "@xpparel/shared-models";
import { MoInfoRepository } from "../repository/mo-info.repository";
@Injectable()
export class OrderManagementService {
    constructor(
        private moInfoRepository: MoInfoRepository,
    ) {

    }

    async getMoDataBySoForSoSummary(req: SoSummaryRequest): Promise<MoDataForSoSummaryResponse> {
        try {
            const soData = await this.moInfoRepository.getMoDataBySoForSoSummary(req.soNumber, req.companyCode, req.unitCode,);
            if (soData.length === 0) {
                return new MoDataForSoSummaryResponse(false, 404, 'No data found', []);
            }
            return new MoDataForSoSummaryResponse(true, 0, 'So Summary data retrived successfully', soData);
        } catch (error) {
            return new MoDataForSoSummaryResponse(false, 500, 'Error in getting So Summary data', []);
        }
    }
}
