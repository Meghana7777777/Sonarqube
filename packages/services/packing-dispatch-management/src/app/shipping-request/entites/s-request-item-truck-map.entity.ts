import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PkShippingRequestItemLevelEnum } from "@xpparel/shared-models";

@Entity('s_request_item_truck_map')
export class SRequestItemTruckMapEntity extends AbstractEntity {

    @Column("bigint", { name: "s_request_truck_id", nullable: false, comment: 'The PK of shipping request truck' })
    @Column("bigint", { name: "s_request_truck_id", nullable: false, comment: 'The PK of shipping request truck' })
    sRequestTruckId: number;

    // new column
    @Column("bigint", { name: "s_request_id", nullable: false, comment: 'The PK of shipping request' })
    srId: number;

    // NOTE: We can either put set / set item / set sub item in the truck
    // Mo based on this field, we have to query the data from the respective table 
    @Column("varchar", { length: "5", name: "item_level", nullable: false, comment: 'The attr value number for  dispatch' })
    itemLevel: PkShippingRequestItemLevelEnum;

    // This could be either PK of d_set or PK of d_set_item or PK of d_set_sub_item
    @Column("bigint", {  name: "ref_id", nullable: false, comment: 'The carton id' })
    refId: number;

    // new column
    @Column("varchar", {  name: "ref_no", nullable: false, comment: 'The carton barcode' })
    refNo: string;

    // this value will be the truck number that was defined in the s_request_truck
    @Column("varchar", { length: "15", name: "truck_no", nullable: false, comment: 'The truck number' })
    truckNo: string;
}