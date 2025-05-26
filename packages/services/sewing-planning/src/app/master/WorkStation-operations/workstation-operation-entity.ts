import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('workstation_operation')
export class WorkstationOperationEntity extends AbstractEntity {

    @Column('int', {
        name: 'id',
        nullable: false
    })
    id: number;


    @Column('varchar', {
        name: 'ws_code',
        length: 15,
        nullable: false
    })
    wsCode: string;

    @Column('varchar', {
        name: 'op_Code',
        length: 15,
        nullable: false
    })
    iOpCode: number;

    @Column('varchar', {
        name: 'op_name',
        length: 15,
        nullable: false
    })
    opName: string;

    @Column('varchar', {
        name: 'external_ref_code',
        nullable: false
    })
    externalRefCode: string;

}



