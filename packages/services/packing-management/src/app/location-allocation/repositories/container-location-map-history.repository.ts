import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FGContainerLocationMapHistoryEntity } from "../entities/container-location-map-history.entity";

@Injectable()
export class ContainerLocationMapHistoryRepo extends Repository<FGContainerLocationMapHistoryEntity>{

    constructor(dataSource: DataSource) {
        super(FGContainerLocationMapHistoryEntity, dataSource.createEntityManager());
    }
}