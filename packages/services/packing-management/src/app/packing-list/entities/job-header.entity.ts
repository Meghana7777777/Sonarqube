import { PackJobStatusEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('pm_t_pl_job_header')
export class JobHeaderEntity extends AbstractEntity {

    @Column({ name: 'pk_mat_req_id', type: 'int', nullable: true })
    pkMatReqId: number;

    @Column({ name: 'pk_mat_req_no', type: 'varchar', nullable: true, length: 30  })
    pkMatReqNo: string;

    @Column('varchar', { name: 'job_number', length: 30 })
    jobNumber: string;

    @Column({ name: 'job_qty', type: 'int' })
    jobQty: number;

    @Column("int", { name: "priority", nullable: false, comment: '', default: 0 })
    priority: number;

    @Column({ name: 'status', type: 'enum', enum: PackJobStatusEnum, default: PackJobStatusEnum.OPEN })
    status: PackJobStatusEnum;

    @Column("datetime", { name: "planned_date_time", nullable: true, comment: '', default: null })
    plannedDateTime: string; // YYYY-MM-DD HH:MM:SS

    @Column("datetime", { name: "completed_date_time", nullable: true, comment: '', default: null })
    completedDateTime: string; // YYYY-MM-DD HH:MM:SS

    @Column('varchar', { name: 'work_station_desc', length: 20, nullable: true })
    workStationDesc: string;

    
    @Column('int', { name: 'work_station_id', nullable: true })
    workStationId: number;

    
    @Column('int', { name: 'pk_config_id', nullable: true })
    packList: number;

    @Column("int", { name: "po_id", nullable: false, comment: '' })
    poId: number;

    @Column("tinyint", { name: "print_status", nullable: false, comment: 'The Carton print status', default: false })
    printStatus: boolean;
}
