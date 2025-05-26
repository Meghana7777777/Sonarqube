import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { InsInspectionStatusEnum, GrnStatusEnum, PackingListUploadTypeEnum } from "@xpparel/shared-models";
import { PhLinesEntity } from "./ph-lines.entity";
@Entity('packing_list_header')
export class PackingListEntity extends AbstractEntity {

    // TODO
    @Column('varchar', {
        name: 'supplier_code',
        length: 50,
    })
    supplierCode: string;

    @Column('varchar', {
        name: 'supplier_name',
        length: 250,
    })
    supplierName: string;

    @Column('varchar', {
        name: 'description',
        length: 100,
    })
    description: string;


    @Column('varchar', {
        name: 'pack_list_code',
        length: 100,
    })
    packListCode: string

    @Column('timestamp', {
        name: 'confirmed_date',
        default: null,
    })
    confirmedDate: Date;


    @Column('date', {
        name: 'pack_list_date',
    })
    packListDate: Date;

    @Column('datetime', {
        name: 'delivery_date',
        default: null,
    })
    deliveryDate: Date;

    @Column('integer', {
        name: 'ph_code',
    })
    phCode: number;

    @Column('enum', {
        name: 'upload_type',
        enum: PackingListUploadTypeEnum
    })
    uploadType: PackingListUploadTypeEnum;

    @Column('enum', {
        name: 'grn_status',
        enum: GrnStatusEnum,
        default: GrnStatusEnum.OPEN
    })
    grnStatus: GrnStatusEnum;

    @Column('boolean', {
        name: 'arrived',
        default: false
    })
    arrived: boolean;

    @Column('varchar', {
        name: 'inspection_status',
        default: InsInspectionStatusEnum.OPEN

    })
    InspectionStatus: InsInspectionStatusEnum;


    @Column('varchar', {
        name: 'company_id',
        length: 50,
    })
    companyCode: string;


    @Column('integer', {
        name: 'ph_log_id',
    })
    packHeaderLogId: number;

    @OneToMany(type => PhLinesEntity, phLines => phLines.packHeaderId, { cascade: true })
    phLineInfo: PhLinesEntity[];


}
