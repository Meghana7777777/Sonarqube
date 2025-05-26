import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GlobalConfigEntity } from "../entity/global-config-entity";
import { AttributesMasterModelDto, ConfigGcIdModelDto, GenericOptionsTypeEnum, GetAttributesByGcId } from "@xpparel/shared-models";
import { AttributesMasterEntity } from "../entity/attributes-master-entity";
import { ConfigMasterAttributesMappingEntity } from "../entity/config-master-attributes-entity";

@Injectable()
export class GlobalConfigMasterRepository extends Repository<GlobalConfigEntity> {
    constructor(
        @InjectRepository(GlobalConfigEntity)
        private repo: Repository<GlobalConfigEntity>,
    ) {
        super(repo.target, repo.manager, repo.queryRunner);
    }

    async getAttributesByGcId(req: ConfigGcIdModelDto): Promise<GetAttributesByGcId[]> {
        const query = this.createQueryBuilder('gc')
            .select(`gc.id as gcId,gc.master_name`)
            .addSelect(`at.id as attributeId,at.name as attributeName,at.label_name,at.input_type,at.required_field,at.place_holder,at.validation_message,at.max_length,at.min_length,at.is_active,at.hidden,at.disabled,at.options_type as optionsType,at.options_source as optionsSource`)
            .leftJoin(ConfigMasterAttributesMappingEntity, 'cat', 'cat.global_config_id = gc.id')
            .leftJoin(AttributesMasterEntity, 'at', 'at.id = cat.attributes_id')
            .where(`gc.company_code = '${req.companyCode}'`)
            .orderBy('gc.created_at', 'DESC')
        if (req.globalConfigId) {
            query.andWhere(`gc.id = '${req.globalConfigId}'`)
        }
        if (req.unitCode) {
            query.andWhere(`gc.unit_code = '${req.unitCode}'`)

        }
        const result = await query.getRawMany()
        const mapValues = new Map<number, GetAttributesByGcId>()
        for (const rec of result) {
            const optionsResource: string[] = rec.optionsType === GenericOptionsTypeEnum.API ? [rec.optionsSource] : rec.optionsSource?.split(',');
            const attributeProperties = new AttributesMasterModelDto(rec.attributeId, rec.attributeName, rec.label_name, rec.input_type, rec.required_field, rec.place_holder, rec.validation_message, rec.max_length, rec.minLength, rec.is_active, [], Boolean(rec.hidden), Boolean(rec.disabled), rec.optionsType, optionsResource)
            if (!mapValues.has(rec.gcId)) {
                mapValues.set(rec.gcId, new GetAttributesByGcId(rec.gcId, rec.master_name, []))
            }
            mapValues.get(rec.gcId).attributeProperties.push(attributeProperties)
        }
        const data = Array.from(mapValues.values())
        return data;
    }


}  