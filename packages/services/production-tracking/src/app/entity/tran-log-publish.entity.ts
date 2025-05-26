import { PtsExtSystemNamesEnum } from "@xpparel/shared-models";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// A table that holds the tran log ids that has to sent to other systems
@Entity('tran_log_publish')
export class TranLogPublishEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;
    
    @Column("bigint", { name: "tran_log_id", nullable: false, comment: 'PK of the tran log' })
    tranLogId: number;

    @Column("varchar", { name: "ext_system", length: 5, nullable: false, comment: 'Ext system description' })
    extSystem: PtsExtSystemNamesEnum;

    @Column("boolean", { name: "ack", default: false, comment: 'Will be set to true after this is sent to ext system' })
    ack: boolean;
}


