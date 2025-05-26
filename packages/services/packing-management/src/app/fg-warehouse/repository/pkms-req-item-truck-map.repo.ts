import { Injectable } from "@nestjs/common";
import {  Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import { PkmsRequestItemTruckMapEntity } from "../entity/pkms-req-item-truck-map.entity";
import { PkmsRequestItemTruckMapRepoInterface } from "./pkms-req-item-truck-map.repo-interface";

@Injectable()
export class PkmsReqItemTruckMapRepo extends BaseAbstractRepository<PkmsRequestItemTruckMapEntity> implements PkmsRequestItemTruckMapRepoInterface {
    constructor(
        @InjectRepository(PkmsRequestItemTruckMapEntity)
        private readonly securityEntity: Repository<PkmsRequestItemTruckMapEntity>
    ) {
        super(securityEntity);
    }

}