import { CommonRequestAttrs } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('config_master_attributes_mapping')
export class ConfigMasterAttributesMappingEntity extends AbstractEntity {

    @Column('int', { name: 'attributes_id', comment: 'attributes Table id', nullable: false })
    attributesId: number;


    @Column('int', { name: 'global_config_id', nullable: false ,comment:'Global Config Id '})
    globalConfigId?: number;


}