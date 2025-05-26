import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('mo_actual_bundle')
export class MoActualBundleEntity extends AbstractEntity {

    @Column("bigint", { name: "proc_serial", default: 0, comment: 'Initially 0. This will be updated after the proc serial creation for the specific processing type' })
    procSerial: number;

    @Column("bigint", { name: "psl_id", nullable: false, comment: 'Created during persistence' })
    pslId: number;

    @Column("varchar", { length: "20", name: "pb_barcode", nullable: false, comment: 'Created during persistence' })
    pbBarcode: string;

    @Column("varchar", { length: "20", name: "ab_barcode", nullable: false, comment: 'Created during persistence' })
    abBarcode: string;

    @Column("smallint", { name: "quantity", comment: 'The bundle quantity' })
    quantity: number;

    @Column("varchar", { length: "5", name: "proc_type", nullable: false, comment: 'Created during persistence' })
    procType: ProcessTypeEnum;

    @Column("bigint", { name: "confirmation_id", nullable: false, comment: 'The confirmation ID of knit / cut' })
    confirmationId: number;
}
