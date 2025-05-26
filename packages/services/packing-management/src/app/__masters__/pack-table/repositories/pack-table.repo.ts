import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../../database/common-repositories";
import { PackTableEntity } from "../entities/pack-table.entity";
import { PackTableRepoInterface } from "./pack-table.repo.interface";

@Injectable()
export class PackTableRepo extends BaseAbstractRepository<PackTableEntity> implements PackTableRepoInterface {
    constructor(
        @InjectRepository(PackTableEntity)
        private readonly PTEntity: Repository<PackTableEntity>,
    ) {
        super(PTEntity);
    }
    
}