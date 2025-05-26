import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('inv_receiving_psl')
export class InvReceivingPslEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column("bigint", { name: "ext_alloc_id", nullable: false, comment: 'The allocation id of the external system. Currently PK of inv_out_allocation' })
    extAllocationId: number;

    @Column("bigint", { name: "psl_id", nullable: false, comment: 'The PSL id' })
    pslId: number;

    @Column("mediumtext", { name: "inv_mapped_fgs", nullable: true, comment: 'These FGs will be updated here after we process a inv receiving request and update the rFromInv in the FG Op Dep against for a PSL id' })
    invMappedFgs: string; // CSV of fgs considered for this allocation request
}

