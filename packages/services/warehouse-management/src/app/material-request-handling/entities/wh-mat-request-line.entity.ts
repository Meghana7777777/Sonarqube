import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { MaterialDestinationTypeEnum, WhMatReqLineStatusEnum } from "@xpparel/shared-models";

@Entity('wh_mat_request_line')
export class WhMatRequestLineEntity extends AbstractEntity {

    // Ref key of the external entity whatsoever it is. Usually the po docket material request id
    @Column("bigint", { name: "ext_ref_line_id", nullable: true, comment: 'Ref key of the external entity whatsoever it is. Usually the po docket material request id' })
    extRefLineId: number;

    // Reference key of the external job number if any. i.e docket/sewing job
    @Column("text", {  name: "job_number", nullable: false, comment: 'Reference key of the external job number if any. i.e docket/sewing job' })
    jobNumber: string;

    @Column("varchar", { length: 15, name: "mat_destination_type", nullable: false, comment: 'Usually to where should the material go. The type of destination.' })
    matDestinationType: MaterialDestinationTypeEnum;

    @Column("varchar", { length: 30, name: "mat_destination_desc", nullable: true, comment: 'Usually to where should the material go. The type of destination.' })
    matDestinationDesc: string;

    @Column("varchar", { length: 10, name: "mat_destination_id", nullable: true, comment: 'The PK of the cut-table/sewing-table/packing-table' })
    matDestinationId: string;

    @Column("varchar", { length: 5, name: "req_line_status", nullable: false, default: WhMatReqLineStatusEnum.OPEN, comment: 'The material status of this entity' })
    reqLineStatus: WhMatReqLineStatusEnum;

    // Ref key. PK of the WH request header
    @Column("bigint", { name: "wh_mat_request_header_id", nullable: false, comment: 'PK of the WH request header' })
    whRequestHeaderId: number;
}