import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoAdbComponentEntity } from "../entity/po-adb-component.entity";

@Injectable()
export class PoAdbComponentRepository extends Repository<PoAdbComponentEntity> {
    constructor(private dataSource: DataSource) {
        super(PoAdbComponentEntity, dataSource.createEntityManager());
    }


}

