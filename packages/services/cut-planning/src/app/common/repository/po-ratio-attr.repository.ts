import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoRatioAttrEntity } from "../entity/po-ratio-attr.entity";

@Injectable()
export class PoRatioAttrRepository extends Repository<PoRatioAttrEntity> {
    constructor(private dataSource: DataSource) {
        super(PoRatioAttrEntity, dataSource.createEntityManager());
    }


}

