import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// A table that holds the map of FGs under this specific transaction
@Entity('tran_log_fg')
export class TranLogFgEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column("bigint", { name: "tran_log_id", nullable: false, comment: 'PK of the tran log' })
    tranLogId: number;

    @Column("bigint", { name: "fg_number", nullable: false, comment: '' })
    fgNumber: number;

    @Column("boolean", { name: "is_rej", nullable: false, comment: '' })
    isRej: boolean;
}
