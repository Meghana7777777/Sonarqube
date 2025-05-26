import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { EmbDispatchStatusEnum } from "@xpparel/shared-models";

// The dispacth request will be created against to the emb lines (i.e layings)
@Entity('emb_dispatch_progress')
export class EmbDispatchProgressEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    // PK of the emb dispatch request
    @Column("bigint", { name: "emb_dr_id", nullable: false, comment: 'The emb dispatch request id' })
    embDrId: number;

    @Column("varchar", { length: 5, name: "request_status", nullable: false, comment: 'The dispatch request status' })
    requestStatus: EmbDispatchStatusEnum;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}

