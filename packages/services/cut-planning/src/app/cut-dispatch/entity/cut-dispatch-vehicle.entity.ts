
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutDispatchStatusEnum, EmbDispatchStatusEnum } from "@xpparel/shared-models";

// The dispacth request will be created against to the emb lines (i.e layings)
@Entity('cut_dispatch_vehicle')
export class CutDispatchVehicleEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    // PK of the emb dispatch request
    @Column("bigint", { name: "cut_dr_id", nullable: false, comment: 'The PK of the cut dispatch header entity' })
    cutDrId: number;

    @Column("varchar", { length: 20, name: "vehicle_no", nullable: false, comment: 'The vehicle number' })
    vehicleNo: string;

    @Column("varchar", { length: 20, name: "remarks", nullable: false, comment: 'The remarks' })
    remarks: string;

    @Column("varchar", { length: 20, name: "contact", nullable: false, comment: 'The contact number' })
    contact: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}

