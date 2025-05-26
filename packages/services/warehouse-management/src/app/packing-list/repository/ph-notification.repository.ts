import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhNotificationEntity } from "../entities/ph-notification.entity";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";

@Injectable()
export class PhNotificationRepo extends Repository<PhNotificationEntity>{
    constructor(dataSource: DataSource) {
        super(PhNotificationEntity, dataSource.createEntityManager());
    }
}

