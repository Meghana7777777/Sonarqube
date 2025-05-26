import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FGContainerSubGroupEntity } from "../entities/container-group/container-sub-group.entity";

@Injectable()
export class ContainerSubGroupRepo extends Repository<FGContainerSubGroupEntity>{
    constructor(dataSource: DataSource) {
        super(FGContainerSubGroupEntity, dataSource.createEntityManager());
    }
}