import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { OrderLineRmEntity } from "../entity/order-line-rm.entity";

@Injectable()
export class OrderLineRmRepository extends Repository<OrderLineRmEntity> {
    constructor(private dataSource: DataSource) {
        super(OrderLineRmEntity, dataSource.createEntityManager());
    }

}
