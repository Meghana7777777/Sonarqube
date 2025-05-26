import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { RejectedReasonsEntity } from "../entities/rejected-reasons.entity";
import { RejectedReasonsRepoInterface } from "./rejected-reaons-repo-interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class RejectedReasonsRepository extends BaseAbstractRepository<RejectedReasonsEntity> implements RejectedReasonsRepoInterface {
    constructor(
        @InjectRepository(RejectedReasonsEntity)
        private readonly RejectedEntity: Repository<RejectedReasonsEntity>,
    ) {
        super(RejectedEntity)
    }

}