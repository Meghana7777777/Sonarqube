import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SupplierEntity } from "../entities/supplier.entity";





@Injectable()
export class SupplierRepo extends Repository<SupplierEntity>{
    constructor(private dataSource: DataSource) {
        super(SupplierEntity, dataSource.createEntityManager());
    }
}