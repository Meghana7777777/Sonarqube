import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PCutRmSizePropsEntity } from "../entity/p-cut-rm-size-prop.entity";

@Injectable()
export class PCutRmSizePropRepository extends Repository<PCutRmSizePropsEntity> {
    constructor(private dataSource: DataSource) {
        super(PCutRmSizePropsEntity, dataSource.createEntityManager());
    }

}

