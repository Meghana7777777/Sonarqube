import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoAdbShadeEntity } from "../entity/po-adb-shade.entity";

@Injectable()
export class PoAdbShadeRepository extends Repository<PoAdbShadeEntity> {
    constructor(private dataSource: DataSource) {
        super(PoAdbShadeEntity, dataSource.createEntityManager());
    }


}

