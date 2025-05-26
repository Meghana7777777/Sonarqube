import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";


@Entity('po_bundling_dep_map')
export class PoBundlingDepMap extends AbstractEntity {

    @Column('varchar', { name: 'bundle_number', length: 25, nullable: false })
    depSerial: string;

    @Column('bigint', { name: 'psl_id', nullable: false })
    pslId: number;

    @Column('smallint', { name: 'qunatity', nullable: false })
    quantity: number;

    @Column('bigint', { name: 'proc_serial', nullable: false })
    procSerial: number;

    @Column('varchar', { name: 'job_number', length: 25, nullable: false })
    jobNumber: string;

    @Column('varchar', { name: 'sub_process_name', length: 25, nullable: false })
    subProcessName: string;
}