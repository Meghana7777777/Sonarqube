import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { MrnItemEntity } from "../entity/mrn-item.entity";
import { MrnStatusHistoryEntity } from "../entity/mrn-status-history.entity";

@Injectable()
export class MrnStatusHistoryRepository extends Repository<MrnStatusHistoryEntity> {
    constructor(private dataSource: DataSource) {
        super(MrnStatusHistoryEntity, dataSource.createEntityManager());
    }


}

