import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('so_line_product')
export class SoLineProductEntity extends AbstractEntity {


    @Column({ type: 'varchar', name: 'so_number', length: 25, nullable: false })
    soNumber: string;

    @Column({ type: 'bigint', name: 'so_line_id', nullable: false })
    soLineId: number;

    @Column({ type: 'varchar', name: 'product_code', length: 25, nullable: false })
    productCode: string;

    @Column({ type: 'varchar', name: 'product_type', length: 25, nullable: false })
    productType: string;

    @Column({ type: 'varchar', name: 'product_name', length: 25, nullable: false })
    productName: string;

    @Column({ type: 'smallint', name: 'sequence', nullable: false })
    sequence: number;

   
}
