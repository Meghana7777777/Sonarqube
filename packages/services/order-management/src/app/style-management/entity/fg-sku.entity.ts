
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('fg_sku')
export class FgSkuEntity extends AbstractEntity {

    @Column({ type: 'varchar', length: 50, name: 'style_code', nullable: false })
    styleCode: string;

    @Column({ type: 'varchar', length: 50, name: 'product_code', nullable: false })
    productCode: string;

    @Column({ type: 'varchar', length: 50, name: 'fg_color', nullable: false })
    fgColor: string;
}
