import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { ComponentEntity } from "../entity/component.entity";

@Injectable()
export class ComponentRepository extends Repository<ComponentEntity> {
    constructor(private dataSource: DataSource) {
        super(ComponentEntity, dataSource.createEntityManager());
    }

}

