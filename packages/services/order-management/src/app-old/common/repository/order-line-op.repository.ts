
import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { OrderLineOpEntity } from "../entity/order-line-op.entity";

@Injectable()
export class OrderLineOpRepository extends Repository<OrderLineOpEntity> {
    constructor(private dataSource: DataSource) {
        super(OrderLineOpEntity, dataSource.createEntityManager());
    }

}

