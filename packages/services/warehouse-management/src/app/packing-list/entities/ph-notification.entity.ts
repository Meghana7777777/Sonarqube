import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PhNotificationStatusEnum } from "@xpparel/shared-models";

@Entity('ph_notification')
export class PhNotificationEntity extends AbstractEntity{
    @Column('integer',{name:'template_id',})
    templateId:number;

    @Column('varchar',{
        name:'user_group',
    })
    userGroup: string;
 
   @Column('enum',{
    name:'notification_status',
    enum:PhNotificationStatusEnum,
   })
   notificationStatus:PhNotificationStatusEnum;


}