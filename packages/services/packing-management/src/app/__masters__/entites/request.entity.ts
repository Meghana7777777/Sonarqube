import { InsCartonSelectLevelEnum, PackActivityStatusEnum, PackFinalInspectionStatusEnum, PackInsMaterialEnum, PackInsMaterialTypeEnum, PackFabricInspectionRequestCategoryEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('pm_t_ins_request')
export class PackInsRequestEntity extends AbstractEntity {

    @Column({ name: 'id', type: 'int' })
    id: number;

    @Column('varchar', { name: 'ins_code', length: 50 })
    insCode: string;

    @Column('enum', {
        name: 'ins_material_type',
        enum: PackInsMaterialTypeEnum
    })
    insMaterialType: PackInsMaterialTypeEnum;

    @Column('enum', {
        name: 'ins_material',
        enum: PackInsMaterialEnum
    })
    insMaterial: PackInsMaterialEnum;

    @Column('integer', {
        name: 'pick_percentage',
        nullable: false,
    })
    pickPercentage: number

    @Column('integer', { name: 'sla' })
    sla: number;

    @Column('integer', { name: 'po_id' })
    poId: number;

    @Column('integer', {
        name: 'pack_list_id',
    })
    packListId: number;

    @Column('timestamp', { name: 'ins_creation_time' })
    insCreationTime: Date;

    @Column('varchar', { name: 'material_receive_at', length: 40, nullable: true })
    materialReceiveAt: string;

    @Column({ name: 'ins_started_at', type: 'varchar', nullable: true })
    insStartedAt: string;

    @Column({ name: 'ins_completed_at', type: 'varchar', nullable: true })
    insCompletedAt: string;

    @Column({ name: 'ins_activity_status', type: 'enum', enum: PackActivityStatusEnum })
    insActivityStatus: PackActivityStatusEnum;

    @Column({ name: 'final_inspection_status', type: 'enum', enum: PackFinalInspectionStatusEnum })
    finalInspectionStatus: PackFinalInspectionStatusEnum;

    @Column('integer', { name: 'priority' })
    priority: number;

    @Column('boolean', {
        name: 'create_re_request',
        default: false,
    })
    createReRequest: boolean


    @Column('int', { name: 'parent_request_id', default: null })
    parentRequestId: number;

    @Column('int', { name: 'ins_request_revision', default: null })
    insRequestRevision: number;

    @Column('enum', {
        name: 'request_category',
        enum: PackFabricInspectionRequestCategoryEnum,
        nullable: false
    })
    requestCategory: PackFabricInspectionRequestCategoryEnum;

    @Column('varchar', {
        name: 'insp_level',
    })
    inspectionLevel: InsCartonSelectLevelEnum;

    @Column('varchar', {
        name: 'refNumber',
    })
    refNumber: string;

    @Column({ name: 'area', type: 'varchar', nullable: true })
    area: string;

}