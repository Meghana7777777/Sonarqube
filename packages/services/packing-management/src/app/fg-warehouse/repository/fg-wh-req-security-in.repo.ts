import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FgWhSecurityTrackEntity } from "../entity/fg-wh-security-in.entity";
import { FgWhReqSecurityInRepoInterface } from "./fg-wh-req-security-in-repo-interface";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";

@Injectable()
export class FgWhReqSecurityInRepo extends BaseAbstractRepository<FgWhSecurityTrackEntity> implements FgWhReqSecurityInRepoInterface {
    constructor(
        @InjectRepository(FgWhSecurityTrackEntity)
        private readonly securityEntity: Repository<FgWhSecurityTrackEntity>
    ) {
        super(securityEntity);
    }

}