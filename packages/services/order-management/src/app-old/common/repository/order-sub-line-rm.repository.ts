import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { OrderSubLineRmEntity } from "../entity/order-sub-line-rm.entity";

@Injectable()
export class OrderSubLineRmRepository extends Repository<OrderSubLineRmEntity> {
    constructor(private dataSource: DataSource) {
        super(OrderSubLineRmEntity, dataSource.createEntityManager());
    }

}
