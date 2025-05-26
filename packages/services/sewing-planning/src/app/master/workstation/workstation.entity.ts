import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities/abstract.entity";

@Entity('work_station')
export class WorkstationEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'ws_code',
        length: 15,
        nullable: false
    })
    wsCode:string;
 
    @Column('varchar', {
        name: 'ws_name',
        nullable: false
    })
    wsName:string;

    @Column('varchar', {
        name: 'ws_desc',
        length: 40,
        nullable: false
    })
    wsDesc:string;

    @Column('varchar', {
        name: 'module_code',
        nullable: false
    })
    moduleCode:string;


  
}