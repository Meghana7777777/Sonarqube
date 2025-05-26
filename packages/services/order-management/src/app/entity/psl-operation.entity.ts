import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('psl_operation')
export class PslOperationEntity extends AbstractEntity {

    @Column({type: 'varchar', name: 'mo_number', length: 25, nullable: false})
    moNumber: string;

    @Column({type:'bigint',name: 'mo_product_sub_line_id',nullable: false})
    moProductSubLineId: number;

    @Column({type: 'varchar', name: 'op_form', length: 5, nullable: true})
    opForm: string;

    @Column({type: 'varchar', name: 'op_code', length: 5, nullable: false})
    opCode: string;

    @Column({type: 'varchar', name: 'i_op_code', length: 5, nullable: true})
    iOpCode: string;

    @Column({type: 'varchar', name: 'e_op_code', length: 5, nullable: true})
    eOpCode: string;

    @Column({type: 'varchar', name: 'op_name', length: 20, nullable: true})
    opName: string;

    @Column({type: 'varchar', name: 'process_type', length: 10, nullable: true})
    processType: string;

    @Column({type: 'decimal', name: 'op_smv', precision: 10, scale: 0, nullable: true})
    opSmv: number;

    @Column({type: 'varchar', name: 'op_wk_station', length: 20, nullable: true})
    opWkStation: string;
}
