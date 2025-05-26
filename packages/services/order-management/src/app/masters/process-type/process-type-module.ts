import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProcessTypeEntity } from "./entity/process-type-entity";
import { ProcessTypeController } from "./process-type-controller";
import { ProcessTypeService } from "./process-type-service";
import { ProcessTypeRepository } from "./repository/process-type-repository";

@Module({
    imports: [TypeOrmModule.forFeature([ProcessTypeEntity])],
    controllers: [ProcessTypeController],
    providers: [ProcessTypeService,ProcessTypeRepository],
    exports: [ProcessTypeService]
})
export class ProcessTypeModule { }