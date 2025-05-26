import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { LTrayEntity } from "../entities/l-tray.entity";
import { CommonRequestAttrs } from "@xpparel/shared-models";
import { LTrolleyEntity } from "../entities/l-trolly.entity";


@Injectable()
export class LTrayRepo extends Repository<LTrayEntity> {
    constructor(private dataSource: DataSource) {
        super(LTrayEntity, dataSource.createEntityManager());
    }

}