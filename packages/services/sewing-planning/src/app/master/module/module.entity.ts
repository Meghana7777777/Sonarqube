import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities/abstract.entity";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('module')
export class ModuleEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'module_code',
        length: 15,
        nullable: false
    })
    moduleCode: string;

    @Column('varchar', {
        name: 'module_name',
        length: 15,
        nullable: false
    })
    moduleName: string;

    @Column('varchar', {
        name: 'module_desc',
        length: 40,
        nullable: false
    })
    moduleDesc: string;

    @Column('varchar', {
        name: 'module_type',
        nullable: false
    })
    moduleType: ProcessTypeEnum;

    // @Column('enum',{
    //     name: 'ws_category',
    //     enum: WsCategoryEnum,
    //     nullable: false
    // })
    // wsCategory:WsCategoryEnum;

    @Column('varchar', {
        name: 'module_ext_ref',
        nullable: false
    })
    moduleExtRef: string;

    @Column('varchar', {
        name: 'module_capacity',
        nullable: false
    })
    moduleCapacity: string;

    @Column('varchar', {
        name: 'max_input_jobs',
        nullable: false
    })
    maxInputJobs: string;

    @Column('varchar', {
        name: 'max_display_jobs',
        nullable: false
    })
    maxDisplayJobs: string;

    @Column('varchar', {
        name: 'module_head_name',
        nullable: false
    })
    moduleHeadName: string;

    @Column('varchar', {
        name: 'module_head_count',
        nullable: false
    })
    moduleHeadCount: string;

    @Column('varchar', {
        name: 'module_order',
        nullable: false
    })
    moduleOrder: string;

    @Column('varchar', {
        name: 'module_color',
        nullable: false
    })
    moduleColor: string;

    @Column('varchar', {
        name: 'sec_code',
        nullable: false
    })
    secCode: string;

    @Column('date', {
        name: 'next_avil_dates',
        nullable: true
    })
    nextAvailableDates: Date;


}