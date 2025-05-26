import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutDispatchStatusEnum, EmbDispatchStatusEnum } from "@xpparel/shared-models";

// The dispacth request will be created against to the emb lines (i.e layings)
@Entity('cut_dispatch_progress')
export class CutDispatchProgressEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    // PK of the emb dispatch request
    @Column("bigint", { name: "cut_dr_id", nullable: false, comment: 'The PK of the cut dispatch header entity' })
    cutDrId: number;

    @Column("varchar", { length: 5, name: "request_status", nullable: false, comment: 'The dispatch request status' })
    requestStatus: CutDispatchStatusEnum;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}

