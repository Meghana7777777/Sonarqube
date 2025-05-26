import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BomItemTypeEnum, ProcessTypeEnum, PhItemCategoryEnum } from '@xpparel/shared-models';
import { AbstractEntity } from '../../database/common-entities';

@Entity('po_wh_request_line_history')
export class PoWhRequestLineHistoryEntity extends AbstractEntity {
    
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

    @Column('varchar', { name: 'item_code', length: 50, nullable: false, comment: "ITEM SKU FOR BOM ITEM / TRIM" })
    itemCode: string; // SKU

    @Column('varchar', { name: 'item_type', length: 50, nullable: false })
    itemType: PhItemCategoryEnum;

    @Column('varchar', { name: 'bom_item_type', length: 50, nullable: false })
    bomItemType: BomItemTypeEnum;

    @Column('varchar', { name: 'item_name', length: 50, nullable: false })
    itemName: string;

    @Column('varchar', { name: 'item_color', length: 50, nullable: false })
    itemColor: string;

    @Column('varchar', { name: 'item_description', length: 150, nullable: false })
    itemDescription: string;

    @Column('int', { name: 'required_qty', nullable: true })
    requiredQty: number;

    @Column('int', { name: 'allocated_qty', nullable: true })
    allocatedQty: number;

    @Column('int', { name: 'issued_qty', nullable: true })
    issuedQty: number;

    @Column('bigint', { name: 'po_wh_req_id', nullable: false })
    poWhRequestId: number;
}






