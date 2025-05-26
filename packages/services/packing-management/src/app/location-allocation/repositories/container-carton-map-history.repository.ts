import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FGContainerCartonMapHistoryEntity } from "../entities/container-carton-map-history.entity";

@Injectable()
export class ContainerCartonMapHistoryRepo extends Repository<FGContainerCartonMapHistoryEntity>{
    constructor(dataSource: DataSource) {
        super(FGContainerCartonMapHistoryEntity, dataSource.createEntityManager());
    }
}