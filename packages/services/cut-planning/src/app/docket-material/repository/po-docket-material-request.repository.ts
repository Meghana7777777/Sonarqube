import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoDocketMaterialRequestEntity } from "../entity/po-docket-material-request.entity";

@Injectable()
export class PoDocketMaterialRequestRepository extends Repository<PoDocketMaterialRequestEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketMaterialRequestEntity, dataSource.createEntityManager());
    }


}

