import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { GrnNotificationEntity } from "../entities/grn-notification.entity";

@Injectable()
export class GrnNotificationRepo extends Repository<GrnNotificationEntity>{
    constructor(private dataSource: DataSource) {
        super(GrnNotificationEntity, dataSource.createEntityManager());
    }
}