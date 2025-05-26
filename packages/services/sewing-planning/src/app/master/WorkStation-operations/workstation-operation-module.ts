import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { WorkstationOperationEntity } from "./workstation-operation-entity";
import { WorkstationOperationRepository } from "./workstation-operation-repository";
import { Module } from "@nestjs/common";
import { WorkstationOperationService } from "./workstation-operation-service";
import { WorkstationOperationController } from "./workstation-operation-controller";

@Module({
    imports: [TypeOrmModule.forFeature([WorkstationOperationEntity])],
    providers: [WorkstationOperationService,WorkstationOperationRepository],
    controllers: [WorkstationOperationController],
    exports: [WorkstationOperationService]
})
export class WorkstationOperationModule {}