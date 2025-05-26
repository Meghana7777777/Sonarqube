import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BundleGenStatusEnum, JobsGenStatusEnum, ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('po_routing_group')
export class PoRoutingGroupEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { length: 10, name: 'routing_group', nullable: false })
    routingGroup: string;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('tinyint', { name: 'jobs_gen_status', nullable: false, default: JobsGenStatusEnum.OPEN })
    jobsGenStatus: JobsGenStatusEnum;
    
    @Column('tinyint', { name: 'bundle_gen_status', nullable: false, default: BundleGenStatusEnum.OPEN })
    bundleGenStatus: BundleGenStatusEnum;

}
