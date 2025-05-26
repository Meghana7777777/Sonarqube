import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoDocketCutTableEntity } from "../entity/po-docket-cut-table.entity";
import { PoDocketCutTableHistoryEntity } from "../entity/po-docket-cut-table-history.entity";

@Injectable()
export class PoDocketCutTableHistroyRepository extends Repository<PoDocketCutTableHistoryEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketCutTableHistoryEntity, dataSource.createEntityManager());
    }


}

