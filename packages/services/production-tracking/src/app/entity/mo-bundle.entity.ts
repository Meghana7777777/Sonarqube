import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('mo_bundle')
export class MoBundleEntity extends AbstractEntity {

    @Column("bigint", { name: "proc_serial", default: 0, comment: 'Initially 0. This will be updated after the proc serial creation for the specific processing type' })
    procSerial: number;

    @Column("bigint", { name: "osl_id", nullable: true, comment: 'Created during persistence' })
    oslId: number;

    @Column("varchar", { length: "20", name: "barcode", nullable: true, comment: 'Created during persistence' })
    bundleBarcode: string;

    @Column("smallint", { name: "quantity", comment: 'The bundle quantity' })
    quantity: number;

    @Column("varchar", { length: "5", name: "proc_type", nullable: true, comment: 'Created during persistence' })
    procType: ProcessTypeEnum;
}
