import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('mo_actual_bundle_parent')
export class MoActualBundleParentEntity extends AbstractEntity {

    @Column("bigint", { name: "proc_serial", default: 0, comment: '' })
    procSerial: number;

    @Column("bigint", { name: "confirmation_id", nullable: true, comment: 'The confirmation ID of knit / cut' })
    confirmationId: number;

    @Column("varchar", { length: "5", name: "proc_type", nullable: true, comment: 'Created during persistence' })
    procType: ProcessTypeEnum;

    @Column("boolean", { name: "fg_mapped", nullable: true, comment: 'Updates to true after the FGs are mapped for these actual bundles' })
    fgsMapped: boolean;

}
