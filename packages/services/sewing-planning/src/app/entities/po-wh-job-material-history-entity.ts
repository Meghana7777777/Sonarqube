import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BomItemTypeEnum, ProcessTypeEnum, PhItemCategoryEnum } from '@xpparel/shared-models';
import { AbstractEntity } from '../../database/common-entities';

@Entity('po_wh_job_material_history')
export class PoWhJobMaterialHistoryEntity extends AbstractEntity {
    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum; 

    @Column('varchar', { name: 'job_number', length: 50, nullable: false })
    jobNumber: string;

    @Column('varchar', { name: 'product_ref', length: 15, nullable: false })
    productRef: string;

    @Column('varchar', { name: 'fg_color', length: 20, nullable: false })
    fgColor: string;

    @Column('varchar', { name: 'size', length: 20, nullable: false })
    size: string;

    @Column('varchar', { name: 'sub_process_name', length: 15, nullable: false })
    subProcessName: string;  

    @Column('varchar', { name: 'item_code', length: 50, nullable: false })
    itemCode: string; 

    @Column('varchar', { name: 'item_type', length: 50, nullable: false })
    itemType: PhItemCategoryEnum;

    @Column('varchar', { name: 'bom_item_type', length: 50, nullable: false })
    bomItemType: BomItemTypeEnum;

    @Column('varchar', { name: 'item_name', length: 50, nullable: false })
    itemName: string;

    @Column('varchar', { name: 'item_color', length: 50, nullable: false })
    itemColor: string;
    
    @Column('varchar', { name: 'uom', length: 50, nullable: false })
    uom: string;

    @Column('varchar', { name: 'item_description', length: 150, nullable: false })
    itemDescription: string;

    @Column('decimal', { name: 'consumption', precision: 10, scale: 2, nullable: false, comment:"Its per piece consumption of that item code color + product + size" })
    consumption: number; // 

    @Column('decimal', { name: 'required_qty', precision: 10, scale: 2, nullable: false })
    requiredQty: number; // 

    @Column('decimal', { name: 'allocated_qty', precision: 10, scale: 2, nullable: false })
    allocatedQty: number;

    @Column('decimal', { name: 'issued_qty', precision: 10, scale: 2, nullable: false })
    issuedQty: number;

    @Column('varchar', { name: 'dep_process_type', length: 25, nullable: false })
    depProcessType: ProcessTypeEnum;

    @Column('varchar', { name: 'dep_sub_process_name', length: 15, nullable: false })
    depSubProcessName: string;  


    @Column('boolean', {
        nullable: false,
        default: false,
        name: 'is_request_needed',
    })
    isRequestNeeded: boolean;
}
 // TRIM 
 // BUNDLE 