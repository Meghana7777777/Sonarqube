import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DepartmentEntity } from "../entity/department-master.entity";

@Injectable()
export class DepartmentMasterRepo extends Repository<DepartmentEntity> {
    constructor(
        @InjectRepository(DepartmentEntity)
        private repo: Repository<DepartmentEntity>,
    ) {
        super(repo.target, repo.manager, repo.queryRunner);
    }




}