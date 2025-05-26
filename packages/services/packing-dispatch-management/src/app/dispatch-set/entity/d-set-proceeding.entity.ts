import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PkDSetItemProceedingEnum } from "@xpparel/shared-models";


@Entity('d_set_proceeding')
export class DSetProceedingEntity extends AbstractEntity {

    @Column("bigint", { name: "d_set_id", nullable: false, comment: 'pk of the d_set table  ' })
    dSetId: number;

    @Column("varchar", { length: "5", name: "current_stage", nullable: false, comment: 'The current stage for  dispatch' })
    currentStage: PkDSetItemProceedingEnum;

    @Column("varchar", { length: "20", name: "spoc", nullable: false, comment: 'The item number for  dispatch' })
    spoc: string;

    @Column("text", { name: "remarks", nullable: true, comment: 'The remarks number for  dispatch' })
    remarks: string; 
}