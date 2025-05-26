import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { MaterialReqStatusEnum, PhItemCategoryEnum, TaskStatusEnum, WhReqByObjectEnum } from "@xpparel/shared-models";

@Entity('wh_mat_request_header')
export class WhMatRequestHeaderEntity extends AbstractEntity {

    // Ref key of the external entity whatsoever it is. Currenlty this is the po-material-request PK
    @Column("bigint", { name: "ext_ref_id", nullable: false, comment: 'The PK of the external requesting table' })
    extRefId: number;

    // for current NL this will always be the DOCKET
    @Column("varchar", { length: 20, name: "ext_ref_entity_type", nullable: false, comment: 'Docket/sewing job/carton', default: WhReqByObjectEnum.DOCKET })
    extRefEntityType: WhReqByObjectEnum;
    
    // Fabric/buttons/thread/etc
    @Column("varchar", { length: 15, name: "req_material_type", nullable: false, comment: 'Fabric/buttons/thread/etc', default: PhItemCategoryEnum.FABRIC })
    reqMaterialType: PhItemCategoryEnum;

    // currently both extReqNo and whReqNo both will be the same value
    // Reference key of the external request number if any. i.e Req no of the CPS module as of now
    @Column("varchar", { length: 20, name: "ext_req_no", nullable: false, comment: 'po_serial + auto inc number under a PO' })
    extReqNo: string;

    // the unique request key for the warehouse
    @Column("varchar", { length: 20, name: "wh_req_no", nullable: false, comment: 'the unique request key for the warehouse' })
    whReqNo: string;

    @Column({ type: 'varchar', name: 'mo_number', length: 25, nullable: false })
    moNumber: string;

    @Column("datetime", { name: "fulfill_within", comment: 'the datetime by which the req has to be fulfilled' })
    fulfillWithin: string;

    @Column("datetime", { name: "material_req_on", comment: 'the datetime at which the material was requested by the ext system' })
    materialReqOn: string;

    @Column("varchar", { length: 25, name: "material_req_by", nullable: false, comment: 'the person who requested the material' })
    materialReqBy: string;

    @Column("varchar", { length: 5, name: "req_progress_status", nullable: false, comment: 'the unique request key for the warehouse', default: TaskStatusEnum.OPEN })
    reqProgressStatus: TaskStatusEnum;

    @Column("varchar", { length: 5, name: "mat_req_status", nullable: false, default: MaterialReqStatusEnum.OPEN })
    matRequestStatus: MaterialReqStatusEnum;
}