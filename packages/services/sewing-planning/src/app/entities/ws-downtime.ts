import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { WsDowntimeStatusEnum } from "@xpparel/shared-models";

@Entity('ws_downtime')
export class WsDowntimeEntity extends AbstractEntity {

    @Column({ type: 'varchar', length: 10, name: 'ws_id' })
    wsId: string;

    @Column({ type: 'varchar', length: 10, name: 'ws_code' })
    wsCode: string;

    @Column({type:'varchar',length:10,name:'module_code'})
    moduleCode: string;

    @Column({ type: 'varchar', length: 40, name: 'd_reason' })
    dReason: string;

    @Column({ type: 'datetime', name: 'start_time' })
    startTime: string;
  
    @Column({ type: 'datetime',  name: 'end_time' ,nullable: true })
    endTime: string | null;

    @Column({ type: 'varchar', length: 10, name: 'ops_code' ,nullable: true })
    opsCode: string |null;

   
    @Column({ type: 'enum', enum: WsDowntimeStatusEnum, name: 'status', default: WsDowntimeStatusEnum.IN_ACTIVE, })
    status: WsDowntimeStatusEnum;
  
   
}
