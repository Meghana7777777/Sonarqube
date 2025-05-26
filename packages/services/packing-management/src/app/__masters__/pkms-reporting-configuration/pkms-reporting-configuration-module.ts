import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PkmsReportingConfigurationEntity } from "./entites/pkms-reporting-configuration-entity";
import { PkmsReportingConfigurationController } from "./pkms-reporting-configuration-controller";
import { PkmsReportingConfigurationService } from "./pkms-reporting-configuration-service";
import { PkmsReportingConfigurationRepo } from "./repositories/pkms-reporting-configuration-repo";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { LoggerService } from "../../../logger";

@Module({
    imports: [
        TypeOrmModule.forFeature([PkmsReportingConfigurationEntity]),
    ],
    controllers: [PkmsReportingConfigurationController],
    providers: [
        PkmsReportingConfigurationService,
        {
            provide: 'PkmsReportingConfigurationRepoInterface',
            useClass: PkmsReportingConfigurationRepo,
        },
        {
            provide: 'TransactionManager',
            useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
            inject: [DataSource],
        },
        {
            provide: 'LoggerService',
            useClass: LoggerService,
        }
    ]
})
export class PkmsReportingConfigurationModule { }