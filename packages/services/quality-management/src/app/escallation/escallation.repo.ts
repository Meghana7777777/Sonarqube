import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EscallationEntity } from "./entites/escallation.entity";

@Injectable()
export class EscallationRepo extends Repository<EscallationEntity> {
    constructor(@InjectRepository(EscallationEntity) private repo: Repository<EscallationEntity>) {
        super(repo.target, repo.manager, repo.queryRunner)
    }
}