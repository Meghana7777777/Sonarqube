import { PackMatReqStatusEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('pm_t_pack_material_req_lines')
export class PackMatReqLinesEntity extends AbstractEntity {

    @Column({ name: 'required_qty', type: 'int' })
    requiredQty: number;

    @Column({ name: 'allocated_qty', type: 'int', default: 0 })
    allocatedQty: number;

    @Column({ name: 'issued_qty', type: 'int', default: 0 })
    issuedQty: number;


    @Column("varchar", { name: "request_status", nullable: false, comment: '', default: `${PackMatReqStatusEnum.OPEN}` })
    requestStatus: PackMatReqStatusEnum;

    @Column({ name: 'pk_config_id', type: 'int' })
    packList: number;


    @Column({ name: 'pm_m_items_id', type: 'int' })
    items: number;

    @Column({ name: 'pk_mat_req_id', type: 'int' })
    pkMatReqId: number;

    @Column({ name: 'pk_job_id', type: 'int' })
    pkJobId: number;

    @Column('tinyint', { name: 'is_non_carton_item', default: false })
    isNonCartonItem: boolean;//for items not belongs Carton Spec

}