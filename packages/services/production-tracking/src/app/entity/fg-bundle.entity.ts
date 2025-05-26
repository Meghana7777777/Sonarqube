import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('fg_bundle')
export class FgBundleEntity {

    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;
    
    @Column('boolean', { default: true, name: 'is_active' })
    isActive: boolean;
    
    @Column("bigint", { name: "fg_number", nullable: true, comment: '' })
    fgNumber: number;

    @Column("bigint", { name: "osl_id", nullable: true, comment: '' })
    oslId: number;

    @Column("varchar", { length: "20", name: "barcode", nullable: true, comment: '' })
    bundleBarcode: string;

    @Column("varchar", { length: "20", name: "ab_barcode", nullable: true, default: '', comment: 'Will be updated later after sewing jobs panels allocation. If this is a planned order then this is same as the barcode column' })
    abBarcode: string;

    @Column("bigint", { name: "proc_serial", nullable: true, comment: '' })
    procSerial: number;

    @Column("varchar", { length: "5", name: "proc_type", nullable: true, comment: '' })
    procType: ProcessTypeEnum;
}
