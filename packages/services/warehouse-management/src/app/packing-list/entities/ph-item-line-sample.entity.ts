import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { InsInspectionStatusEnum, PhItemLinesSampleTypeEnum, PhItemPrintStatus } from "@xpparel/shared-models";

@Entity('ph_item_line_sample')
export class PhItemLineSampleEntity extends AbstractEntity{
    @Column('varchar',{
        name: 'ph_items_id'
    })
    phItemsId: number;

    @Column('integer', {
        name: 'ph_item_lines_id',
    })
    phItemLinesId: string;

    @Column({
        type:'enum',
        name:'type',
        enum:PhItemLinesSampleTypeEnum,
    })
    type:PhItemLinesSampleTypeEnum;

    @Column('integer',{
        name:'sample_no',
    })
    sampleNo:number;

    @Column({
        type:'enum',
        name:'inspection_status',
        enum:InsInspectionStatusEnum,
    })
    inspectionStatus:InsInspectionStatusEnum;

    @Column('varchar', {
        name: 'bar_code',
    })
    barCode: string;

    @Column({
        type:'enum',
        name:'print_status',
        enum:PhItemPrintStatus,
    })
    printStatus:PhItemPrintStatus;

    @Column('varchar', {
        name: 'qr_code',
    })
    qrCode: string;
}