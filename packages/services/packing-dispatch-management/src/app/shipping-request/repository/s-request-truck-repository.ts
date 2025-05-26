
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SRequestTruckEntity } from "../entites/s-request-truck.entity";

@Injectable()
export class SRequestTruckRepository extends Repository<SRequestTruckEntity> {
    constructor(private dataSource: DataSource) {
        super(SRequestTruckEntity, dataSource.createEntityManager());
    }
}
