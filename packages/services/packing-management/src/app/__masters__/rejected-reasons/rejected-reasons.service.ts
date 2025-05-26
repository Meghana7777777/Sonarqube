import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { RejectedReasonsRepoInterface } from "./repositories/rejected-reaons-repo-interface";
import { ITransactionManager } from "../../../database/typeorm-transactions";
import { TransactionalBaseService } from "../../../base-services";
import { CommonRequestAttrs, CommonResponse, GlobalResponseObject } from "@xpparel/shared-models";
import { RejectedReasonsDto } from "./dto/rejected-reasons.dto";
import { RejectedReasonsEntity } from "./entities/rejected-reasons.entity";
import { RejectedReasonsToggleDto } from "./dto/rejectedreasons-toggle.dto";
import { Not } from "typeorm";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class RejectedReasonsService extends TransactionalBaseService {
    constructor(
        @Inject('RejectedReasonsRepoInterface')
        private readonly repo: RejectedReasonsRepoInterface,
        @Inject('LoggerService')
        logger: LoggerService,
        @Inject('TransactionManager')
        transactionManager: ITransactionManager,
    ) {
        super(transactionManager, logger)
    }

    async saveReasons(dto: RejectedReasonsDto) {

        if (dto.reasonCode) {
            const findRecord = await this.repo.findOne({ where: { reasonCode: dto.reasonCode} });
            if (findRecord && findRecord.id !== dto.id) {
                throw new ErrorResponse(36097, "Reason Code already exists.");
            }
        }
        const reasons = this.repo.create(dto);
        await this.repo.save(reasons);
        this.logMessage('Data Saved');
        return new GlobalResponseObject(true,dto?.id ? 922:923, dto.id ? 'Updated Successfully' : 'Created Successfully')
        }




    async getRejectedReasons(req: CommonRequestAttrs): Promise<CommonResponse> {
        const data = await this.repo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode }, order: { createdAt: 'DESC' } })
        if (data.length) {
            return new CommonResponse(true, 36098, '', data)
        } else {
            return new CommonResponse(false, 924, 'No Data Found', [])
        }
    }


    async toggleRejectedReasons(dto: RejectedReasonsToggleDto) {
        const togglePackType = await this.repo.findOneById(dto.id)
        if (togglePackType) {
            const entity = new RejectedReasonsEntity()
            entity.id = dto.id
            entity.isActive = !togglePackType.isActive
            await this.repo.save(entity)
            let message = togglePackType.isActive ? "Deactivated Successfully" : "Activated Successfully"
            return new CommonResponse(true,togglePackType.isActive ?  920 : 921, message)
        } else {
            return new CommonResponse(false, 924, "No Data Found")
        }
    }

    async rejectedReasonsDropDown(req: CommonRequestAttrs): Promise<CommonResponse> {
        const data = await this.repo.find({ select: ['id', 'reasonName'], where: { companyCode: req.companyCode, unitCode: req.unitCode, isActive: true } })
        if (data.length) {
            return new CommonResponse(true, 967, 'Data Retrieved Successfully', data)
        } else {
            return new CommonResponse(false, 924, 'No Data Found', [])
        }
    }

}