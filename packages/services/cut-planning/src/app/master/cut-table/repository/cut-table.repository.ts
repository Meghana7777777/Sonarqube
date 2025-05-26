import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { CutTableEntity } from "../entity/cut-table.entity";

@Injectable()
export class CutTableRepository extends Repository<CutTableEntity> {
    constructor(private dataSource: DataSource) {
        super(CutTableEntity, dataSource.createEntityManager());
    }

}

