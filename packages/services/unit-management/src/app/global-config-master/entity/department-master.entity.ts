import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities/abstract.entity";
import { DepartmentTypeEnumForMasters } from "@xpparel/shared-models";

@Entity('department')
export class DepartmentEntity extends AbstractEntity {


    @Column('varchar', {
        name: 'dep_unit',
        nullable: false
    })
    unit: string;

    @Column('varchar', {
        name: 'dep_name',
        nullable: false
    })
    name: string;

    @Column('varchar', {
        name: 'dep_code',
        nullable: false
    })
    code: string;

    @Column('varchar', {
        name: 'dep_type',
        nullable: true
    })
    type: DepartmentTypeEnumForMasters;

}