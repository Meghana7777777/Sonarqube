import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import {  PoAdbEntity } from "../entity/po-adb.entity";
import { PoActualDocketPanelEntity } from "../entity/po-actual-docket-panel.entity";

@Injectable()
export class PoActualDocketPanelRepository extends Repository<PoActualDocketPanelEntity> {
    constructor(private dataSource: DataSource) {
        super(PoActualDocketPanelEntity, dataSource.createEntityManager());
    }


}

