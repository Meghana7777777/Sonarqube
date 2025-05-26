import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhItemLinesActivityTrackEntity } from "../entities/ph-items-lines-activity-track.entity";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";

@Injectable()
export class PhItemslinesActivitytrackRepo extends Repository<PhItemLinesActivityTrackEntity>{
    constructor(dataSource: DataSource) {
        super(PhItemLinesActivityTrackEntity, dataSource.createEntityManager());
    }

}