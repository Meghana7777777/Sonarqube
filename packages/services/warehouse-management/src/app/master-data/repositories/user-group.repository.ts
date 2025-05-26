import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { UserGroupEntity } from "../entities/user-group.entity";


@Injectable()
export class UserGroupEntityRepo extends Repository<UserGroupEntity>{
    constructor(private dataSource: DataSource) {
        super(UserGroupEntity, dataSource.createEntityManager());
    }
}