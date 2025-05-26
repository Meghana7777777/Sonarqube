import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PKMSInspectionHeaderAttributesEnum } from "@xpparel/shared-models";

@Entity('pm_t_pack_job__attributes')
export class PackJobRequestAttributesEntity extends AbstractEntity {
    @Column('int', { name: 'pack_job_id' })
    packJobId: number;
  
    @Column('varchar', { name: 'attribute_name', length: 100 })
    attributeName: PKMSInspectionHeaderAttributesEnum;
  
    @Column('text', { name: 'attribute_value' })
    attributeValue: string;
}