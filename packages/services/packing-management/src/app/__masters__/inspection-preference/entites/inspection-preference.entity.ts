import { InsCartonSelectLevelEnum, InsInspectionRollSelectionTypeEnum, InspectionTypeEnum, InsStatusEnum, PackFabricInspectionRequestCategoryEnum } from "@xpparel/shared-models";
import { Column, CreateDateColumn, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";

@Entity('pm_t_ins_preference')
export class InspectionPreferenceEntity extends AbstractEntity {

    @Column('integer', {
        name: 'po',
        nullable: false
    })
    po: number

    @Column('varchar', {
        name: 'ip_number',
        length: 20,
        nullable: true,
    })
    ipNumber: string

    @CreateDateColumn({
        name: "ip_date",
        default: null,
    })
    ipDate: Date

    @Column({
        name: 'ip_status',
        type: 'enum',
        enum: InsStatusEnum,
        nullable: false
    })
    ipStatus: InsStatusEnum


    @Column('varchar', {
        name: 'pack_job_id',
        length: 20,
        nullable: true,
    })
    packJobId: string


    @Column('integer', {
        name: 'pick_percentage',
        nullable: false,
    })
    pickPercentage: number

    @Column('enum', {
        name: 'ins_selection_type',
        enum: InsInspectionRollSelectionTypeEnum,
        nullable: false
    })
    insSelectionType: InsInspectionRollSelectionTypeEnum

    @Column('enum', {
        name: 'carton_selection_level',
        enum: InsCartonSelectLevelEnum,
        nullable: false
    })
    rollSelectionType: InsCartonSelectLevelEnum


    @Column('text', {
        name: 'inspections',
        comment: 'PackFabricInspectionRequestCategoryEnum',
        nullable: false
    })
    inspections: string;


}