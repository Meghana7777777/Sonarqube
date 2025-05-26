import { PackListMrnStatusEnum, PackMatReqStatusEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('pm_t_pack_material_request')
export class PackMaterialRequestEntity extends AbstractEntity {

    @Column({ name: 'request_no', type: 'varchar', length: 30 })
    requestNo: string;

    @Column("varchar", { name: "request_status", nullable: false, comment: '', default: `${PackListMrnStatusEnum.OPEN}` })
    requestStatus: PackListMrnStatusEnum;

    @Column("varchar", { name: "mat_status", nullable: false, comment: '', default: `${PackMatReqStatusEnum.OPEN}` })
    matStatus: PackMatReqStatusEnum;

    @Column("datetime", { name: "mat_request_on", nullable: true, comment: 'The material requested datetime', default: null })
    matReqOn: string; // YYYY-MM-DD HH:MM:SS

    @Column("varchar", { length: "25", name: "mat_request_by", nullable: true, comment: 'The material requested person', default: null })
    matReqBy: string; 

         
    @Column({ name: 'pk_config_id', type: 'int' })
    packList: number;

    @Column("datetime", { name: "mat_fulfill_date_time", nullable: true, comment: 'The material fulfillment date time for the request' })
    matFulfillmentDateTime: Date; // YYYY-MM-DD HH:MM:SS

  
}