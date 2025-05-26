import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ShippingRequestProceedingEnum } from "@xpparel/shared-models";

@Entity('s_request_proceeding')
export class SRequestProceedingEntity extends AbstractEntity {

    @Column("bigint", { name: "s_request_id", nullable: false, comment: 'pk of the s-request table' })
    sRequestId: number;

    @Column("varchar", { length: "5", name: "current_stage", nullable: false, comment: 'The current stage for  dispatch' })
    currentStage: ShippingRequestProceedingEnum;

    @Column("varchar", { length: "15", name: "spoc", nullable: false, comment: 'The person who changed the status' })
    spoc: string;

    @Column("text", { name: "remarks", nullable: true, comment: 'The shipping request proceeding remarks' })
    remarks: string;
}
