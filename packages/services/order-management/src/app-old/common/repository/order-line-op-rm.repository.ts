import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { OrderLineOpRmEntity } from "../entity/order-line-op-rm.entity";

@Injectable()
export class OrderLineOpRmRepository extends Repository<OrderLineOpRmEntity> {
    constructor(private dataSource: DataSource) {
        super(OrderLineOpRmEntity, dataSource.createEntityManager());
    }

}

