import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { FGContainerGroupItemsEntity } from "../entities/container-group/container-group-items.entity";

@Injectable()
export class ContainerGroupItemsRepo extends Repository<FGContainerGroupItemsEntity>{
    constructor(dataSource: DataSource) {
        super(FGContainerGroupItemsEntity, dataSource.createEntityManager());
    }
}