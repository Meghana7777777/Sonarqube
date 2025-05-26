import { InsInspectionFinalInSpectionStatusEnum, InsTrimNamesEnum, InsTrimTypesEnum, InsUomEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('ins_trim')
export class InsTrimEntity extends AbstractEntity {

    @Column('integer', { name: 'ins_req_id' })
    insReqId: number;

    @Column('integer', { name: 'ins_req_items_id' })
    insReqItemsId: number;

    @Column('enum', { name: 'trim_name', enum: InsTrimNamesEnum })
    trimName: InsTrimNamesEnum;

    @Column('enum', { name: 'trim_type', enum: InsTrimTypesEnum })
    trimType: InsTrimTypesEnum;


    @Column('integer', { name: 'quantity_passed', nullable: true })
    qualityPassed: number;

    @Column('integer', { name: 'quantity_failed', nullable: true })
    qualityFailed: number;

    @Column('enum', { name: 'functional_checks', enum: InsInspectionFinalInSpectionStatusEnum })
    functionalChecks: InsInspectionFinalInSpectionStatusEnum;

    @Column('enum', { name: 'visual_checks', enum: InsInspectionFinalInSpectionStatusEnum })
    visualChecks: InsInspectionFinalInSpectionStatusEnum;

    @Column('enum', { name: 'color_checks', enum: InsInspectionFinalInSpectionStatusEnum })
    colorChecks: InsInspectionFinalInSpectionStatusEnum;

    @Column('enum', { name: 'strength_checks', enum: InsInspectionFinalInSpectionStatusEnum })
    strengthChecks: InsInspectionFinalInSpectionStatusEnum;

    @Column('varchar', { name: 'remarks', nullable: true })
    remarks: string;
}