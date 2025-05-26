import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PKMSPoSerialsEntity } from "../../pkms-po-entities/pkms-po-serials-entity";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PKMSPoSerialsRepoInterface } from "../interfaces/pkms-po-serials.repo.interface";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PKMSPoSerialsRepository extends BaseAbstractRepository<PKMSPoSerialsEntity> implements PKMSPoSerialsRepoInterface {

    constructor(
        @InjectRepository(PKMSPoSerialsEntity)
        private readonly pkFgEntity: Repository<PKMSPoSerialsEntity>,
    ) {
        super(pkFgEntity);
    }

}