import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { RollAttrEntity } from "../entity/roll-attr.entity";

@Injectable()
export class RollAttrRepository extends Repository<RollAttrEntity> {
    constructor(private dataSource: DataSource) {
        super(RollAttrEntity, dataSource.createEntityManager());
    }


}

