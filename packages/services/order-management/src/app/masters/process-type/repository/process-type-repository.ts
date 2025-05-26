import { Injectable } from "@nestjs/common";
import { ProcessTypeEntity } from "../entity/process-type-entity";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class ProcessTypeRepository extends Repository<ProcessTypeEntity> {


    constructor(
        @InjectRepository(ProcessTypeEntity) 
        private repo: Repository<ProcessTypeEntity>,
        private datSource: DataSource) {
        super(repo.target, repo.manager, repo.queryRunner);
    }
 
		// async processTypeImages()  : Promise<ProcessTypeModel>{
        //     return await this.createQueryBuilder('processTypeData')
        //     .select([
        //         'sectionData.secCode',
        //         'sectionData.secName',
        //         'sectionData.secHeadName'
        //     ])
        //     .where('sectionData.secCode = :secCode')
        //     .getOne()
        // }

}

