import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('mo_actual_bundle_sproc')
export class MoActualBundleSProcEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column("bigint", { name: "psl_id", nullable: false, comment: 'Created during persistence' })
    pslId: number;
    
    @Column("varchar", { length: "20", name: "ab_barcode", nullable: false, comment: 'Created during persistence' })
    abBarcode: string;

    @Column("varchar", { length: "20", name: "job_number", nullable: true, comment: 'This will be updated after the Jobs creation for the proc serial creation' })
    jobNumber: string;

    @Column("varchar", { length: "15", name: "sub_proc", nullable: false, comment: 'Sub process under the processing type' })
    subProc: string;

    @Column("varchar", { length: "5", name: "proc_type", nullable: false, comment: 'Created during persistence' })
    procType: ProcessTypeEnum;
}
