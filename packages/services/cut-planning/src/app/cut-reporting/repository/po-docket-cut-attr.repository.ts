import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoDocketCutAttrEntity } from "../entity/po-docket-cut-attr.entity";

@Injectable()
export class PoDocketCutAttrRepository extends Repository<PoDocketCutAttrEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketCutAttrEntity, dataSource.createEntityManager());
    }


}

