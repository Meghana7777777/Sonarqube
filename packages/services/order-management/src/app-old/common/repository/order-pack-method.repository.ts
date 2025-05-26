import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { OrderSizesEntity } from "../entity/order-sizes.entity";
import { OrderPackMethodEntity } from "../entity/order-pack-method.entity";

@Injectable()
export class OrderPackMethodRepository extends Repository<OrderPackMethodEntity> {
    constructor(private dataSource: DataSource) {
        super(OrderPackMethodEntity, dataSource.createEntityManager());
    }

}
