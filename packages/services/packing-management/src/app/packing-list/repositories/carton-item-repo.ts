

import { Injectable } from "@nestjs/common";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CrtnItemsRepoInterface } from "./carton-item-repo-interface";
import { CrtnItemsEntity } from "../entities/crtn-item.entity";


@Injectable()
export class CrtnItemsRepo extends BaseAbstractRepository<CrtnItemsEntity> implements CrtnItemsRepoInterface {
    constructor(
        @InjectRepository(CrtnItemsEntity)
        private readonly cartonItemEntity: Repository<CrtnItemsEntity>,
    ) {
        super(cartonItemEntity);
    }

}