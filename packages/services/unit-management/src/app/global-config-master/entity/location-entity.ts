import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities/abstract.entity";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('location')
export class LocationEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'location_code',
        length: 15,
        nullable: false
    })
    locationCode: string;

    @Column('varchar', {
        name: 'location_name',
        length: 15,
        nullable: false
    })
    locationName: string;

    @Column('varchar', {
        name: 'location_desc',
        length: 40,
        nullable: false
    })
    locationDesc: string;

    @Column('varchar', {
        name: 'location_type',
        nullable: false
    })
    locationType: ProcessTypeEnum;

    
    // @Column('enum',{
    //     name: 'ws_category',
    //     enum: WsCategoryEnum,
    //     nullable: false
    // })
    // wsCategory:WsCategoryEnum;

    @Column('varchar', {
        name: 'location_ext_ref',
        nullable: false
    })
    locationExtRef: string;

    @Column('varchar', {
        name: 'location_capacity',
        nullable: false
    })
    locationCapacity: string;

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
        name: 'location_head_name',
        nullable: false
    })
    locationHeadName: string;

    @Column('varchar', {
        name: 'location_head_count',
        nullable: false
    })
    locationHeadCount: string;

    @Column('varchar', {
        name: 'location_order',
        nullable: false
    })
    locationOrder: string;

    @Column('varchar', {
        name: 'location_color',
        nullable: false
    })
    locationColor: string;

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