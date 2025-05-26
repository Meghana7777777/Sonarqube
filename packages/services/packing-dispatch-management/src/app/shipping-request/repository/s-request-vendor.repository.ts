
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SRequestTruckEntity } from "../entites/s-request-truck.entity";
import { SRequestVendorEntity } from "../entites/s-request-vendor.entity";

@Injectable()
export class SRequestVendorRepository extends Repository<SRequestVendorEntity> {
    constructor(private dataSource: DataSource) {
        super(SRequestVendorEntity, dataSource.createEntityManager());
    }
}
