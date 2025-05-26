import { Injectable } from "@nestjs/common";
import {  Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import { PkmsRequestItemTruckMapEntity } from "../entity/pkms-req-item-truck-map.entity";
import { PkmsRequestTruckEntity } from "../entity/pkms-req-truck.entity";
import { PkmsRequestTruckRepoInterface } from "./pkms-req-truck.repo-interface";

@Injectable()
export class PkmsRequestTruckRepo extends BaseAbstractRepository<PkmsRequestTruckEntity> implements PkmsRequestTruckRepoInterface {
    constructor(
        @InjectRepository(PkmsRequestTruckEntity)
        private readonly securityEntity: Repository<PkmsRequestTruckEntity>
    ) {
        super(securityEntity);
    }

}