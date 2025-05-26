import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('psl_operation_rm')
export class PslOperationRmEntity extends AbstractEntity{

    @Column({ type: 'varchar', name: 'mo_number', length: 25, nullable: false })
    moNumber: string;

    @Column({ type: 'bigint', name: 'psl_operation_id', nullable: false })
    pslOperationId: number;

    @Column({ type: 'varchar', name: 'item_code', length: 50, nullable: false })
    itemCode: string;

    @Column({ type: 'varchar', name: 'op_code', length: 30, nullable: false })
    opCode: string;
}
