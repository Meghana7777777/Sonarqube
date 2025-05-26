import { PKMSFgConsumptionStatus } from "@xpparel/shared-models";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('fg_entity')
export class FgEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column('varchar', { default: PKMSFgConsumptionStatus.open, name: 'fg_consumption_status', comment: JSON.stringify(PKMSFgConsumptionStatus) })
    fgConsumptionStatus: PKMSFgConsumptionStatus;

    @Column("bigint", { name: "fg_number", nullable: false, comment: '' })
    fgNumber: number;

    @Column("varchar", { name: "fg_barcode", length: 20, nullable: false, comment: '' })
    fgBarcode: string;

    @Column("bigint", { name: "osl_id", nullable: false, comment: '' })
    oslId: number;

    @Column("bigint", { name: "tran_id", nullable: false, comment: '' })
    tranId: number;
}