
import { Entity, Column } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('bundle_trans')
export class BundleTransEntity extends AbstractEntity {

    @Column("bigint", { name: "proc_serial", nullable: false, comment: '' })
    procSerial: number;

    @Column("varchar", { name: "proc_type", length: 6, nullable: false, comment: '' })
    procType: ProcessTypeEnum;

    @Column("varchar", { length: 30, name: "bundle_barcode", nullable: false, comment: '' })
    bundleBarcode: string;

    @Column("bigint", { name: "psl_id", nullable: false, comment: '' })
    pslId: number;

    @Column("smallint", { name: "operator_id", nullable: false, comment: '' })
    operatorId: number;

    @Column("varchar", { name: "location_code", length: "10", nullable: false, default: 0, comment: 'Location code' })
    locationCode: string;
 
    @Column("smallint", { name: "op_code", nullable: false, comment: '' })
    opCode: number;

    @Column("varchar", { length: 4, name: "random_op", nullable: false, comment: 'the random op of the operation group' })
    randomOp: string;
    
    @Column("smallint", { name: "g_qty", default: 0, comment: '' })
    gQty: number;

    @Column("smallint", { name: "r_qty", default: 0, comment: '' })
    rQty: number;

    @Column("decimal", { name: "smv", scale: 2, precision: 4, default: 0.00, comment: '' })
    smv: number;

    @Column("varchar", { name: "op_group", length: 12, nullable: false, comment: '' })
    opGroup: string;

    @Column("tinyint", { name: "opg_order", nullable: false, comment: '' })
    opGroupOrder: number;

    @Column("varchar", { length: "20", name: "curr_job", nullable: false, comment: '' })
    currJob: string;

    @Column("varchar", { length: "5", name: "shift", nullable: false, comment: '' })
    shift: string;

    @Column("datetime", { name: "scan_at", nullable: false, comment: 'The time at which the bundle was scanned' })
    scannedAt: string;

    // Need to change to opg_id
    @Column("bigint", { name: "sp_fg_sku", default: 0, comment: 'PK of the op sequence opg table' })
    opgId: number
    // @Column("boolean", { name: "sps_ack_status", default: false, comment: 'This status gets updated after this tran log id is handled in SPS' })
    // spsAckStatus: boolean;
}

