import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QualityTypeEntity } from "../quality-type/entites/quality-type-entity";
import { QualityTypeRepository } from "../quality-type/quality-type-repo";
import { PoCreationEntity } from "./entites/po-creation.entity";
import { PoCreationController } from "./po-creation.controller";
import { PoCreationRepository } from "./repo/po-creation-repo";
import { PoCreationService } from "./po-creation.service";

@Module({
    imports: [TypeOrmModule.forFeature([PoCreationEntity, QualityTypeEntity])],
    providers: [PoCreationService, PoCreationRepository, QualityTypeRepository],
    controllers: [PoCreationController],
})

export class PoCreationModule { }

