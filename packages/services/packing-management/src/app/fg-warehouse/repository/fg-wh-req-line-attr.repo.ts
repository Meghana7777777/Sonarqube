import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FgWhReqLineAttrsEntity } from "../entity/fg-wh_req_line_attr.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import { FgWhReqLineAttrRepoInterface } from "./fg-wh-req-line-attr.repo.interface";
import { FgWhSrIdPlIdsRequest } from "@xpparel/shared-models";

@Injectable()
export class FgWhReqLineAttrRepo extends BaseAbstractRepository<FgWhReqLineAttrsEntity> implements FgWhReqLineAttrRepoInterface {
    constructor(
        @InjectRepository(FgWhReqLineAttrsEntity) private readonly attentity: Repository<FgWhReqLineAttrsEntity>
    ) {
        super(attentity);
    }



}