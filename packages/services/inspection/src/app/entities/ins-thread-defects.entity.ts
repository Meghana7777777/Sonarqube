import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";


@Entity('ins_thread_defects')
export class InsThreadDefects extends AbstractEntity {
    @Column('integer', { name: 'slubs', nullable: true })
    slubs: number;

    @Column('integer', { name: 'neps', nullable: true })
    neps: number;

    @Column('integer', { name: 'yarnBreaks', nullable: true })
    yarnBreaks: number;

    @Column('integer', { name: 'items_id', nullable: true })
    ItemsId: number;

    @Column('integer', { name: 'contamination', nullable: true })
    contamination: string;



}


// slubs: number;
//     neps: number;
//     yarnBreaks: number;
//     contamination: string;
//     remarks: string;