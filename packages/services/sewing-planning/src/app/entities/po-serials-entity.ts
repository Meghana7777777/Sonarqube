import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('po_serials')
export class PoSerialsEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('varchar', { name: 'routing_group', length: 25, nullable: false })
    routingGroup: string;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;


}