import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities/abstract.entity";
import { DepartmentTypeEnumForMasters, ProcessTypeEnum } from "@xpparel/shared-models";


@Entity('section')
export class SectionEntity extends AbstractEntity {
    @Column('varchar', {
        name: 'sec_code',
        length: 15,
        nullable: false
    })
    secCode:string;

    @Column('varchar', {
        name: 'sec_name',
        length: 255,
        nullable: false
    })
    secName:string;

    @Column('varchar', {
        name: 'sec_desc',
        length: 40,
        nullable: false
    })
    secDesc:string;

    @Column('varchar',{
        name: 'dep_type',
        length: 40,
        nullable: false
    })
    depType:DepartmentTypeEnumForMasters;

    @Column('varchar', {
        name: 'sec_color',
        length: 12,
        nullable: false
    })
    secColor:string;

    @Column('varchar', {
        name: 'sec_head_name',
        length: 50,
        nullable: false
    })
    secHeadName:string;

    @Column('varchar', {
        name: 'sec_order',
        nullable: false
    })
    secOrder:string;

    @Column('varchar',{
        name: 'sec_type',
        nullable: false
    })
    secType:ProcessTypeEnum;
 

    
}