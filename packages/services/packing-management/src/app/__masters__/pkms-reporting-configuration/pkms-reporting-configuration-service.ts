import { Inject, Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CommonResponse, GlobalResponseObject, PkmsReportingConfigurationRequestModel, PkmsReportingConfigurationResponse, PkmsReportingConfigurationResponseDto } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { TransactionalBaseService } from "../../../base-services";
import { ITransactionManager } from "../../../database/typeorm-transactions";
import { LoggerService } from "../../../logger";
import { ReportingConfigurationCreateDto } from "./dto/reporting-configuration-create-dto";
import { ReportingConfigurationToggleDto } from "./dto/reporting-configuration-toggle-dto";
import { PkmsReportingConfigurationEntity } from "./entites/pkms-reporting-configuration-entity";
import { PkmsReportingConfigurationRepoInterface } from "./repositories/pkms-reporting-configuration-repo-interface";
@Injectable()
export class PkmsReportingConfigurationService extends TransactionalBaseService {
    constructor(
        @Inject('PkmsReportingConfigurationRepoInterface')
        private readonly reportingConfigurationRepo: PkmsReportingConfigurationRepoInterface,
        @Inject('TransactionManager')

        transactionManager: ITransactionManager,
        @Inject('LoggerService')
        logger: LoggerService,
        private dataSource: DataSource
    ) {
        super(transactionManager, logger)
    }
    async saveWithTransaction(dto: ReportingConfigurationCreateDto) {
        return this.executeWithTransaction(async (transactionManager) => {
            const newReportingConfiguration = this.reportingConfigurationRepo.create(dto);
            await this.reportingConfigurationRepo.save(newReportingConfiguration);
            this.logMessage('reporting Configuration saved successfully');
            return new CommonResponse(true, 36001, 'reporting Configuration saved successfully');
        });
    }

    async createReportingConfiguration(dto: ReportingConfigurationCreateDto) {
        if (dto.feature) {
            const findRecord = await this.reportingConfigurationRepo.findOne({ where: { feature: dto.feature } });
            if (findRecord && findRecord.id !== dto.id) {
                throw new ErrorResponse(36002, "Feature already exists");
            }
        }
        const reportingConfiguration = this.reportingConfigurationRepo.create(dto);
        await this.reportingConfigurationRepo.save(reportingConfiguration);
        return new GlobalResponseObject(true, dto?.id ? 922 : 923, dto.id ? 'Updated Successfully' : 'Created Successfully');
    }

    async getAllReportingConfigurations(dto: PkmsReportingConfigurationRequestModel) {
        const getReportingConfigurations = await this.reportingConfigurationRepo.findOne({ select: ['reportingLevels', 'id', 'isExternal'], where: { companyCode: dto.companyCode, unitCode: dto.unitCode, feature: dto.feature }, order: { createdAt: 'desc' } })
        if (getReportingConfigurations) {
            const data = new PkmsReportingConfigurationResponseDto(getReportingConfigurations.id, getReportingConfigurations.reportingLevels, getReportingConfigurations.isExternal);
            return new PkmsReportingConfigurationResponse(true, 36003, 'Reporting Configurations data retrieved successfully', data)
        } else {
            return new PkmsReportingConfigurationResponse(false, 924, 'Please Map Feature')
        }
    }



    async toggleReportingConfigurations(dto: ReportingConfigurationToggleDto) {
        const toggleReportingConfigurations = await this.reportingConfigurationRepo.findOneById(dto.id)
        if (toggleReportingConfigurations) {
            const entity = new PkmsReportingConfigurationEntity();
            entity.id = dto.id
            entity.isActive = !toggleReportingConfigurations.isActive
            await this.reportingConfigurationRepo.save(entity)
            let message = toggleReportingConfigurations.isActive ? "Deactivated Successfully" : " Activated Successfully"
            return new CommonResponse(true, toggleReportingConfigurations.isActive ? 920 : 921, message);
        } else {
            return new CommonResponse(false, 924, "No Data Found");
        }
    }

}












