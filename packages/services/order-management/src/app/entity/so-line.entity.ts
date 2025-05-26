import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('so_line')
export class SoLineEntity extends AbstractEntity {


    @Column({ type: 'varchar', name: 'so_number', length: 25, nullable: false })
    soNumber: string;

    @Column({ type: 'bigint', name: 'so_id', nullable: false })
    soId: number;
    
    @Column({ type: 'varchar', name: 'so_line_number', length: 25, nullable: false })
    soLineNumber: string;
}
