import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import {NotificationStatusEnum } from '@xpparel/shared-models';

@Entity('grn_notification')
export class GrnNotificationEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'template_id',
        length:20,
        nullable:false,
    })
    templateId: string

    @Column('varchar', {
        name: 'user_group',
        length:20,
        nullable:false,
    })
    userGroup: string

    @Column('enum', {
        name: 'notification_status',
        enum: NotificationStatusEnum
    })
    notificationStatus: NotificationStatusEnum
     
    @Column('varchar', {
        name: 'ph_id',
        length:20,
        nullable:false,
    })
    phId: string

    @Column('varchar', {
        name: 'batch_id',
        length:20,
        nullable:false,
    })
    batchId: string    
}
