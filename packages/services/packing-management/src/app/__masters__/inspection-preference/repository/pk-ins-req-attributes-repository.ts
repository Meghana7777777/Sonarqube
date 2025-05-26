import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { Repository } from "typeorm";
import { PackInsReqRepoInterface } from "./pack-ins-req-repo-interface";
import { PkReqItemsRepoInterface } from "./pk-req-items-repo-interface";
import { PackInsRequestAttributeEntity } from "../../entites/pkms-ins-request-attributes.entity";
import { PkReqAttributesRepoInterface } from "./pk-ins-req-attributes-repo-interface";



@Injectable()
export class PKReqAttributesRepository extends BaseAbstractRepository<PackInsRequestAttributeEntity> implements PkReqAttributesRepoInterface {
    constructor(
        @InjectRepository(PackInsRequestAttributeEntity)
        private readonly ipReqEntity: Repository<PackInsRequestAttributeEntity>
    ) {
        super(ipReqEntity)
    }

}