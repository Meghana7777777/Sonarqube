import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { OrderSizesEntity } from "../entity/order-sizes.entity";

@Injectable()
export class OrderSizesRepository extends Repository<OrderSizesEntity> {
    constructor(private dataSource: DataSource) {
        super(OrderSizesEntity, dataSource.createEntityManager());
    }

}
