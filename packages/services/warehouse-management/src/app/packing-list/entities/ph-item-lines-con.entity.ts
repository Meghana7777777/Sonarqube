
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('ph_item_lines_con')
export class PhItemLinesConEntity extends AbstractEntity {

    @Column("decimal", { precision: 8, scale: 2, name: "consumed_quantity", default: 0 })
    consumedQty: number;

    @Column("varchar", { length: 10, name: "ref_transaction_id", nullable: false, comment: 'The PK of the on_floor_rolls for this case' })
    refTransactionId: string;

    @Column("varchar", { length: 15, name: "job_ref", nullable: false, comment: 'The job ref id the docket number. Since fab is utilized only by a docket' })
    jobRef: string;

    @Column("varchar", { length: 15, name: "job_actual_ref", nullable: false, comment: 'The laying id of the docket number' })
    jobActualRef: string;

    @Column("datetime", { name: "consumed_on", nullable: false, comment: 'The date on which the fab is comsumed by the docket' })
    consumedOn: string;

    @Column('varchar', { length: 20, name: "barcode", nullable: false, comment: 'The roll barcode' })
    barcode: string;

    @Column('bigint', { name: "ph_items_id", nullable: false, comment: 'The roll PK' })
    phItemId: number;
}