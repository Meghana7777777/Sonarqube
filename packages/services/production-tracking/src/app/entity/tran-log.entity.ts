import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { OpOrderTypeEnum, ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('tran_log')
export class TranLogEntity extends AbstractEntity {

    @Column("bigint", { name: "proc_serial", nullable: false, comment: '' })
    procSerial: number;

    @Column("bigint", { name: "osl_id", nullable: false, comment: '' })
    oslId: number;

    @Column("varchar", { length: "20", name: "bundle_barcode", nullable: false, comment: '' })
    bundleBarcode: string;

    @Column("varchar", { length: "20", name: "job_number", nullable: false, comment: '' })
    jobNumber: string;

    @Column("varchar", { length: 15, name: "module_code", nullable: false, default: 0, comment: 'the unique module code' })
    moduleCode: string;

    @Column("varchar", { length: 15, name: "workstation_code", nullable: false,  default: 0, comment: 'the unique workstation code' })
    workstationCode: string;

    @Column("smallint", { name: "reason_id", nullable: false,  default: 0, comment: 'PK of the reason' })
    reasonId: number;

    @Column("varchar", { length: "5", name: "op_code", nullable: true, comment: '' })
    opCode: string;

    @Column("varchar", { length: "4", name: "proc_type", nullable: true, comment: '' })
    procType: ProcessTypeEnum;

    @Column("char", { length: 1, name: "op_order_type", default: '', comment: 'The op order type i.e intermediate / input / ouput' })
    opOrderType: OpOrderTypeEnum;

    @Column("smallint", { name: "g_qty", default: 0, comment: '' })
    gQty: number;

    @Column("smallint", { name: "r_qty", default: 0, comment: '' })
    rQty: number;

    @Column("date", { name: "trans_date", nullable: false, comment: 'The date on which the transaction is performed' })
    transDate: string;
}

