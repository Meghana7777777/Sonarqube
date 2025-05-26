import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QualityCheckListEntity } from "./entites/quality-check-list.entity";

@Injectable()
export class QualityCheckListRepository extends Repository<QualityCheckListEntity> {
    constructor(
        @InjectRepository(QualityCheckListEntity)
        private repo: Repository<QualityCheckListEntity>,
    ) {
        super(repo.target, repo.manager, repo.queryRunner);
    }

    async getAllQualityCheckListParameter(): Promise<any> {
        try {
            let query = `
           SELECT qcl.quality_check_list_id AS qualityCheckListId ,qcl.parameter AS parameter,qcl.is_active AS isActive,qcl.version_flag AS versionFlag,
           qt.quality_type AS qualityType 
           FROM quality_check_list qcl
           LEFT JOIN quality_type qt ON qt.id=qcl.quality_type_id 
           `
            const result = await this.repo.query(query)
            return result
        } catch (err) {
            console.log(err);
        }
    }

    async getAllActiveQualityCheckListParameter(): Promise<any> {
        try {
            let query = `
           SELECT qcl.quality_check_list_id AS qualityCheckListId ,qcl.parameter AS parameter,qcl.is_active AS isActive,qcl.version_flag AS versionFlag,
           qt.quality_type AS qualityType,
           qt.id as qualityTypeId
           FROM quality_check_list qcl
           LEFT JOIN quality_type qt ON qt.id=qcl.quality_type_id 
           WHERE qcl.is_active = 1
           `
            const result = await this.repo.query(query)
            return result
        } catch (err) {
            console.log(err);
        }
    }

    async getAllQualityCheckListParamsMapping(): Promise<any> {
        try {
            let query = `
                SELECT 
                qcl.quality_check_list_id AS qualityParamterId,
                qt.quality_type AS qualityType,
                GROUP_CONCAT(qcl.parameter) AS parameters
                FROM quality_check_list qcl
                LEFT JOIN quality_type qt ON qt.id = qcl.quality_type_id
                WHERE qcl.is_active=1
                GROUP BY qt.quality_type
           `
            const result = await this.repo.query(query)
            return result
        } catch (err) {
            console.log(err);
        }
    }

}