import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities/abstract.entity";

@Unique(['code','name','parentId']) 
@Entity('config_master')
export class ConfigMasterEntity extends AbstractEntity {
    @Column('varchar', {
        name: 'code',
        nullable: true
    })
    code: string;

    @Column('varchar', {
        name: 'name',
        nullable: true
    })
    name: string;

    @Column('int', {
        name: 'global_config_id',
        nullable: false
    })
    globalConfigId?: number;

    @Column('int', {
        name: 'parent_id',
        nullable: true
    })
    // same table Id for Parent of thi record
    parentId: number;

    @Column('int', {
        name: 'config_master_id',
        nullable: true,
        comment: 'Same Table Id For Unique Record'
    })
    // the Id for Every Record
    configMasterId: number;

    @Column('int', { name: 'attributes_id', comment: 'attributes Table id', nullable: true })
    attributesId: number;


    @Column('varchar', {
        name: 'attribute_name',
        nullable: true
    })
    attributeName: string;

    @Column('varchar', {
        name: 'attribute_value',
        nullable: true
    })
    attributeValue: string;


}