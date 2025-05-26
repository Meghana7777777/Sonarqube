import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('mo_line_product')
export class MoLineProductEntity extends AbstractEntity {


    @Column({ type: 'varchar', name: 'mo_number', length: 25, nullable: false })
    moNumber: string;

    @Column({ type: 'varchar', name: 'mo_line_number', length: 25, nullable: false })
    moLineNumber: string;
    
    @Column({ type: 'bigint', name: 'mo_line_id', nullable: false })
    moLineId: number;

    @Column({ type: 'varchar', name: 'product_code', length: 25, nullable: false })
    productCode: string;

    @Column({ type: 'varchar', name: 'product_type', length: 25, nullable: false })
    productType: string;

    @Column({ type: 'varchar', name: 'product_name', length: 25, nullable: false })
    productName: string;

    @Column({ type: 'smallint', name: 'sequence', nullable: true })
    sequence: number;
   
}
