import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigGcIdModelDto, DepartmentTypeEnumForMasters, GbDepartmentReqDto, ProcessTypeEnum, processTypeEnumDisplayValues } from "@xpparel/shared-models";
import { Repository } from "typeorm";
import { ConfigMasterEntity } from "../entity/config-master-entity";
import { GlobalConfigEntity } from "../entity/global-config-entity";
import { AttributesQueryResDto } from "../dto/attributes-query-res-dto";

@Injectable()
export class ConfigMasterRepository extends Repository<ConfigMasterEntity> {
    constructor(
        @InjectRepository(ConfigMasterEntity)
        private repo: Repository<ConfigMasterEntity>,
    ) {
        super(repo.target, repo.manager, repo.queryRunner);
    }


    async getParentIdDropDownAgainstGcID(req: ConfigGcIdModelDto) {
        const query = await this.repo.createQueryBuilder('cm')
            .select(`cm.id, cm.code ,gc.master_label as masterLabel`)
            .leftJoin(GlobalConfigEntity, 'gc', 'gc.id = cm.global_config_id')
            .where(`cm.globalConfigId = :globalConfigId`, { globalConfigId: req.globalConfigId })
            .andWhere(`cm.unit_code = "${req.unitCode}" AND cm.company_code = '${req.companyCode}'`)
            .andWhere(`cm.code IS NOT NULL`)
            .getRawMany();
        return query;
    };

    async getGroupedConfigMastersData(req: ConfigGcIdModelDto, departmentType: DepartmentTypeEnumForMasters, processType: ProcessTypeEnum): Promise<AttributesQueryResDto[]> {
        const query = this.createQueryBuilder('cm')
            .select(`cm.id as cmId ,cm.code,cm.name,cm.config_master_id,cm.parent_id,cm.attribute_name,cm.attribute_value,cm.attributes_id,cm.is_active`)
            .where(`cm.globalConfigId = :globalConfigId`, { globalConfigId: req.globalConfigId })
            .andWhere(`cm.unit_code = "${req.unitCode}" AND cm.company_code = '${req.companyCode}'`)
        if (departmentType) {
            query.andWhere(`cm.attribute_name = 'departmentType' and cm.attribute_value  = "${departmentType}"`)
        }
        if (processType) {
            query.andWhere(`cm.attribute_name = 'secType' and cm.attribute_value  = "${processTypeEnumDisplayValues[processType]}"`)
        }
        const result: AttributesQueryResDto[] = await query.getRawMany()
        for (const rec of result) {
            if (!rec.name) {
                const innerQuery = await this.findOne({ select: ['name', 'code'], where: { companyCode: req.companyCode, unitCode: req.unitCode, id: rec.config_master_id } })
                rec.name = innerQuery.name
                rec.code = innerQuery.code
            }
        }
        return result;

    }

    async getConfigMasterDataByConfigId(req: ConfigGcIdModelDto, configMasterIds: number[], departmentType?: DepartmentTypeEnumForMasters, processType?: ProcessTypeEnum): Promise<AttributesQueryResDto[]> {
        const query = this.createQueryBuilder('cm')
            .select(`cm.id as cmId ,cm.code,cm.name,cm.config_master_id,cm.parent_id,cm.attribute_name,cm.attribute_value,cm.attributes_id,cm.is_active`)
            .where(`cm.globalConfigId = :globalConfigId`, { globalConfigId: req.globalConfigId })
            .andWhere(`cm.company_code = '${req.companyCode}'`)
            .andWhere('cm.config_master_id IN (:configMasterIds)', { configMasterIds: configMasterIds })
        if (req.unitCode) {
            query.andWhere(`cm.unit_code = "${req.unitCode}" `)
        }
        if (departmentType) {
            query.andWhere(`cm.attribute_name = 'departmentType' and cm.attribute_value  = "${departmentType}"`)
        }
        if (processType) {
            query.andWhere(`cm.attribute_name = 'secType' and cm.attribute_value  = "${processTypeEnumDisplayValues[processType]}"`)
        }
        const result = await query.getRawMany()
        for (const rec of result) {
            if (!rec.name) {
                const innerQuery = await this.findOne({ select: ['name', 'code'], where: { companyCode: req.companyCode, unitCode: req.unitCode, id: rec.config_master_id } })
                rec.name = innerQuery.name
                rec.code = innerQuery.code
            }
        }
        return result;
    }


    async getDistinctGlobalConfigIds(req: GbDepartmentReqDto): Promise<{ globalConfigId: number }[]> {
        const query = await this.createQueryBuilder()
            .select('DISTINCT global_config_id as globalConfigId')
            .where(`config_master_id IN (:configMasterIds)'`, { configMasterIds: req.departments })
            .andWhere(`unit_code = "${req.unitCode}" AND company_code = '${req.companyCode}'`)
            .getRawMany()
        return query;
    }
    //parentIds means sectionIds,moduleIds like 
    async getDistinctConfigIdsByParentIds(req: { parentIds: number[], companyCode: string, unitCode: string }): Promise<{ configMasterId: number }[]> {
        const query = await this.createQueryBuilder()
            .select('DISTINCT config_master_id as configMasterId')
            .where(`parent_id IN (:parentIds)`, { parentIds: req.parentIds })
            .andWhere(`unit_code = "${req.unitCode}" AND company_code = '${req.companyCode}'`)
            .getRawMany()
        return query;
    }
}
