import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { OrderListEntity } from "../entity/order-list.entity";

@Injectable()
export class OrderListRepository extends Repository<OrderListEntity> {
    constructor(private dataSource: DataSource) {
        super(OrderListEntity, dataSource.createEntityManager());
    }

}
