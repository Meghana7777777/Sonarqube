import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { FabIssuingEntityEnum, RequestTypeEnum } from "@xpparel/shared-models";

@Entity('ph_item_issuance')
export class PhItemIssuanceEntity extends AbstractEntity {

    @Column('int', {
        nullable: false,
        name: 'ph_item_line_id',
    })
    phItemLineId: number;

    @Column('text', {
        name: 'remarks',
        default: null,
    })
    remarks: string;

    @Column('decimal', {
        name: 'issued_quantity',
        default: 0,
        nullable: false
    })
    issuedQuantity: number;

    @Column('enum', {
        name: 'issuing_entity',
        nullable: false,
        enum: FabIssuingEntityEnum,
        default: FabIssuingEntityEnum.MANUAL,
    })
    issuingEntity: FabIssuingEntityEnum;

    @Column('varchar', {
        length: 11,
        name: "ext_req_no",
        nullable: false,
        comment: 'The request Number'
    })
    extRequestNo: string;

    @Column('enum', {
        name: 'request_type',
        nullable: false,
        enum: RequestTypeEnum,
    })
    requestType: RequestTypeEnum;

    @Column('bigint', { nullable: false, name: 'issuance_id', comment: 'unique issuance id' })
    issuanceId: number;

    @Column('bigint', { nullable: false, name: 'wh_req_id' })
    whReqId: number

}