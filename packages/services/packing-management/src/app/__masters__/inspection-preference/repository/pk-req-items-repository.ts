import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { Repository } from "typeorm";
import { PackInsRequestItemEntity } from "../../entites/ins-request-items.entity";
import { PackInsReqRepoInterface } from "./pack-ins-req-repo-interface";
import { PkReqItemsRepoInterface } from "./pk-req-items-repo-interface";

 

@Injectable()
export class PKReqItemsRepository extends BaseAbstractRepository<PackInsRequestItemEntity> implements PkReqItemsRepoInterface {
    constructor(
        @InjectRepository(PackInsRequestItemEntity)
        private readonly ipReqEntity: Repository<PackInsRequestItemEntity>
    ) {
        super(ipReqEntity)
    }

}