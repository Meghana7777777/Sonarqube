
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SRequestItemTruckMapEntity } from "../entites/s-request-item-truck-map.entity";

@Injectable()
export class SRequestItemTruckMapRepository extends Repository<SRequestItemTruckMapEntity> {
    constructor(private dataSource: DataSource) {
        super(SRequestItemTruckMapEntity, dataSource.createEntityManager());
    }
}
