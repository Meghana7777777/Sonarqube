import { Entity, Column } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

// The same proc order we create in knit and sps we create a ref here
@Entity('proc_order')
export class ProcOrderEntity extends AbstractEntity {

    @Column("bigint", { name: "proc_serial", nullable: false, comment: '' })
    procSerial: number;

    @Column("varchar", { name: "proc_type", length: 5, nullable: false, comment: '' })
    procType: ProcessTypeEnum;

    // @Column("boolean", { name: "job_mapped", nullable: true, comment: 'Will turn to true if the jobs for the proc serial are mapped. This cant be maintained at the OSl level' })
    // jobMapped: boolean;
}




