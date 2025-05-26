import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { OrderListEntity } from "../entity/order-list.entity";
import { OrderCreationLogEntity } from "../entity/order-creation-log.entity";

@Injectable()
export class OrderCreationLogRepository extends Repository<OrderCreationLogEntity> {
    constructor(private dataSource: DataSource) {
        super(OrderCreationLogEntity, dataSource.createEntityManager());
    }

}
