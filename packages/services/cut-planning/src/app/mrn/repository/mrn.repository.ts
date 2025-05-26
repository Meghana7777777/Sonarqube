import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { MrnEntity } from "../entity/mrn.entity";

@Injectable()
export class MrnRepository extends Repository<MrnEntity> {
    constructor(private dataSource: DataSource) {
        super(MrnEntity, dataSource.createEntityManager());
    }

}

