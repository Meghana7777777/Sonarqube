import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PKMSPoProductEntity } from "../../pkms-po-entities/pkms-po-product-entity";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PKMSPoProductRepoInterface } from "../interfaces/pkms-po-product-repo.interface";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PKMSPoProductRepository extends BaseAbstractRepository<PKMSPoProductEntity> implements PKMSPoProductRepoInterface {
    constructor(
        @InjectRepository(PKMSPoProductEntity)
        private readonly pkFgEntity: Repository<PKMSPoProductEntity>,
    ) {
        super(pkFgEntity);
    }

}