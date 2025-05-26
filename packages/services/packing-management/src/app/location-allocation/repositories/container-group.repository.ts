import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { FGContainerGroupEntity } from "../entities/container-group/container-group.entity";

@Injectable()
export class ContainerGroupRepo extends Repository<FGContainerGroupEntity>{
    constructor(dataSource: DataSource) {
        super(FGContainerGroupEntity, dataSource.createEntityManager());
    }
}