import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { MarkerTypeEntity } from "../entity/marker-type.entity";

@Injectable()
export class MarkerTypeRepository extends Repository<MarkerTypeEntity> {
    constructor(private dataSource: DataSource) {
        super(MarkerTypeEntity, dataSource.createEntityManager());
    }

}

