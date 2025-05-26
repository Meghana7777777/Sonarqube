import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('mo_line')
export class MoLineEntity extends AbstractEntity {


    @Column({ type: 'varchar', name: 'mo_number', length: 25, nullable: false })
    moNumber: string;

    @Column({ type: 'bigint', name: 'mo_id', nullable: false })
    moId: number;

    @Column({ type: 'varchar', name: 'mo_line_number', length: 25, nullable: false })
    moLineNumber: string;
    
    @Column({ type: 'varchar', name: 'so_number', length: 25, nullable: false })
    soNumber: string;

    @Column({ type: 'varchar', name: 'so_line_number', length: 25, nullable: false })
    soLineNumber: string;
}
