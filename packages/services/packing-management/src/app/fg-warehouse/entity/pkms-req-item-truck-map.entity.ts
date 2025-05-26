import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('pm_t_fg_ln_request_item_truck_map')
export class PkmsRequestItemTruckMapEntity extends AbstractEntity {

    @Column("bigint", { name: "wh_header_id", nullable: false, comment: 'The Fg In Request Id Or Wh Header Id' })
    whHeaderId: number;

    // This could be either PK of d_set or PK of d_set_item or PK of d_set_sub_item
    @Column("bigint", { name: "ref_id", nullable: false, comment: 'The attr value number for  dispatch' })
    refId: number;

    // this value will be the truck number that was defined in the s_request_truck
    @Column("varchar", { length: "15", name: "truck_no", nullable: false, comment: 'The truck number' })
    truckNo: string;

    @Column({ name: 'barcode', type: 'varchar', length: 20, nullable: false, comment: 'Carton barcode' })
    barcode: string;

    @Column('tinyint', { name: 'is_document_uploaded', default: false, comment: 'Carton box Have Document or Not' })
    isDocumentUploaded: boolean
}