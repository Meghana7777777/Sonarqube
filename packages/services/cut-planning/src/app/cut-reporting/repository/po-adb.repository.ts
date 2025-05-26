import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import {  PoAdbEntity } from "../entity/po-adb.entity";

@Injectable()
export class PoAdbRepository extends Repository<PoAdbEntity> {
    constructor(private dataSource: DataSource) {
        super(PoAdbEntity, dataSource.createEntityManager());
    }


}

