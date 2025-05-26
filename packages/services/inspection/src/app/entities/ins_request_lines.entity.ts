import { InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, InsInspectionItemEnum, InsInspectionMaterialEnum, InsInspectionMaterialTypeEnum, InsTypesEnum, InsTypesEnumType } from '@xpparel/shared-models';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../database/common-entities';
@Entity('ins_request_lines')
export class InsRequestLinesEntity extends AbstractEntity {

    @Column('int', { name: 'ins_request_id' })
    insRequestId: number;

    @Column('enum', { name: 'ins_material_type', enum: InsInspectionMaterialTypeEnum })
    insMaterialType: InsInspectionMaterialTypeEnum;

    @Column('enum', { name: 'ins_material', enum: InsInspectionMaterialEnum })
    insMaterial: InsInspectionMaterialEnum;

    @Column('enum', { name: 'ins_type', enum: InsTypesEnum })
    insType: InsTypesEnumType;

    @Column('varchar', { name: 'ref_id_L1', nullable: true, comment: 'packlist id IN WMS' })
    refIdL1: string;

    @Column('varchar', { name: 'ref_id_L2', nullable: true, comment: 'packlist id IN wms / pack job id IN PKMS' })
    refIdL2: string;

    @Column('varchar', { name: 'ref_id_L3', nullable: true, comment: 'ANY other LEAST id IF EXISTS' })
    refIdL3: string;

    @Column('varchar', { name: 'ref_job_L1', nullable: true, comment: 'batch number/mo number' })
    refJobL1: string;

    @Column('varchar', { name: 'ref_job_L2', nullable: true, comment: 'lot number / pack job readable number' })
    refJobL2: string;

    @Column('varchar', { name: 'ref_job_L3', nullable: true, comment: 'ANY other LEAST number IF EXISTS' })
    refJobL3: string;

    @Column('enum', { name: 'ins_activity_status', enum: InsInspectionActivityStatusEnum })
    insActivityStatus: InsInspectionActivityStatusEnum;

    @Column('enum', { name: 'final_inspection_status', enum: InsInspectionFinalInSpectionStatusEnum })
    finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum;

    @Column('varchar', { name: 'inspection_owner', length: 100 })
    inspectionOwner: string;

    @Column('varchar', { name: 'inspection_area_I1', length: 100 })
    inspectionAreaI1: string;

    @Column('varchar', { name: 'inspection_area_I2', length: 100 })
    inspectionAreaI2: string;







    // @Column('int', { name: 'parent_request_id', default: null })
    // parentRequestId: number;

    // @Column('boolean', {
    //     name: 'create_re_request',
    //     default: false,
    // })
    // createReRequest: boolean

    // @Column('int', { nullable: true, comment: 'Priority' })
    // priority: number;

    // @Column('varchar', { name: 'ins_code', length: 50, comment: 'auto gen based ont he ins item' })
    // insCode: string;

    // @Column('enum', {
    //     name: 'insp_level',
    //     enum: InspectionLevelEnum
    // })
    // inspectionLevelEnum: InspectionLevelEnum;

}
