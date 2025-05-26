import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PTrimRmEntity } from "../entity/p-trim-rm.entity";

@Injectable()
export class PTrimRmRepository extends Repository<PTrimRmEntity> {
    constructor(private dataSource: DataSource) {
        super(PTrimRmEntity, dataSource.createEntityManager());
    }

}

