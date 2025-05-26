import { Injectable } from "@nestjs/common";
import { QualityConfigurationEntity } from "../entities/quality-configuration.entity";
import { DataSource, Repository } from "typeorm";
import { QualityTypeEntity } from "../../quality-type/entites/quality-type-entity";
import { CommonRequestAttrs, StyleProcessTypeReq } from "@xpparel/shared-models";
import { QualityConfigInfoQueryRes } from "./query-response/quality-configuration-info.qry.res";

@Injectable()
export class QualityConfigurationRepository extends Repository<QualityConfigurationEntity> {
    constructor(private dataSource: DataSource) {
        super(QualityConfigurationEntity, dataSource.createEntityManager());
    }

    async getQualityConfigurationInfo(companyCode: string, unitCode: string, qualityConfigId?: number): Promise<QualityConfigInfoQueryRes[]> {
        const query = await this.createQueryBuilder('qc')
            .select('qc.style_code as styleCode, qc.process_type as processType, qc.quality_percentage as qualityPercentage, qc.is_mandatory as isMandatory, qc.quality_type_id as qualityTypeId,qc.id as qualityConfigId')
            .leftJoin(QualityTypeEntity, 'qt', 'qc.quality_type_id = qt.id')
            .addSelect('qt.quality_type as qualityType')
            .where('qc.company_code = :companyCode', { companyCode })
            .andWhere('qc.unit_code = :unitCode', { unitCode })
        if (qualityConfigId) {
            query.andWhere('qc.id = :qualityConfigId', { qualityConfigId })
        }
        return await query.getRawMany();
    }

    async getAllEsclationsRepo(req: CommonRequestAttrs): Promise<any> {

        const queryBuilder = this.dataSource
            .getRepository('esclations_log')
            .createQueryBuilder('el')
            .select([
                'e.quality_type AS qualityType',
                'el.action_status AS actionStatus',
                'el.quantity AS quantity',
                'qc.style_code AS styleCode',
                'qc.process_type AS processType',
                'qec.name AS name',
            ])
            .leftJoin('escallation', 'e', 'e.id = el.escaltion_id')
            .leftJoin('quality_config', 'qc', 'qc.quality_type_id = e.quality_type')
            .leftJoin('quality_esclations_config', 'qec', 'qec.quality_config_id = qc.id')
            .where('el.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('el.company_code = :companyCode', { companyCode: req.companyCode })
        const result = await queryBuilder.getRawMany();
        return result;

    }

    async getQualityConfigInfoForStyleAndProcessType(req: StyleProcessTypeReq): 
    Promise<QualityConfigInfoQueryRes[]> {
        const {companyCode,unitCode,styleCode,processType} = req
        const query = await this.createQueryBuilder('qc')
            .select('qc.style_code as styleCode, qc.process_type as processType, qc.quality_percentage as qualityPercentage, qc.is_mandatory as isMandatory, qc.quality_type_id as qualityTypeId,qc.id as qualityConfigId')
            .leftJoin(QualityTypeEntity, 'qt', 'qc.quality_type_id = qt.id')
            .addSelect('qt.quality_type as qualityType')
            .where('qc.company_code = :companyCode', { companyCode })
            .andWhere('qc.unit_code = :unitCode', { unitCode })
            .andWhere('qc.style_code = :styleCode', { styleCode })
            if(req.processType){
                query.andWhere('qc.process_type IN (:...processType)', { processType })
            }
        
        return await query.getRawMany();
    }

}