import { Injectable } from "@nestjs/common";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PackInsRequestEntity } from "../../entites/request.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PackInsReqRepoInterface } from "./pack-ins-req-repo-interface";



@Injectable()
export class PackInsReqRepository extends BaseAbstractRepository<PackInsRequestEntity> implements PackInsReqRepoInterface {
    constructor(
        @InjectRepository(PackInsRequestEntity)
        private readonly ipReqEntity: Repository<PackInsRequestEntity>
    ) {
        super(ipReqEntity)
    }

}