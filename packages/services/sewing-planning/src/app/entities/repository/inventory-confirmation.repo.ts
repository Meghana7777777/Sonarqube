import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InventoryConfirmationEntity } from "../inventory-confirmation.entity";

@Injectable()
export class InventoryConfirmationRepository extends Repository<InventoryConfirmationEntity> {
    constructor(private dataSource: DataSource) {
        super(InventoryConfirmationEntity, dataSource.createEntityManager());
    }

}