import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

export enum SpsOrderProductBundleStateEnum {
    OPEN = 0,
    FORMED = 1,
    MOVED_TO_INV = 2,
}


@Entity('inventory_bundle')
export class InventoryBundleEntity extends AbstractEntity {
    
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column('varchar', { name: 'process_type', length: 5, nullable: false })
    processType: ProcessTypeEnum;
    
    @Column("bigint", { name: "psl_id", nullable: false, comment: 'PK of the psl table' })
    pslId: number;

    @Column("varchar", { length: 20, name: "ab_barcode", nullable: false,  comment: 'The actual barcode under a planned barcode. The barcode number is a split of the planned barcode'})
    abBarcode: string;
    
    @Column("smallint", { name: "p_qty", nullable: false, comment: 'QTY of the barcode' })
    pQty: number;

    @Column("smallint", { name: "a_qty", nullable: false, comment: 'QTY moved to inventory of this actual barcode i.e the final output qty' })
    aQty: number;

    @Column('bigint', { name: 'confirmation_id', default: 0, comment: 'The random ID generated while doing the inventory moving activity. Usually the timestamp' })
    confirmationId: number;

    @Column('tinyint', { name: 'bundle_state', default: SpsOrderProductBundleStateEnum.FORMED,  comment: 'Refer SpsOrderProductBundleStateEnum. 0 - initially, 1 - when the bundle is confirmed, 2 - when the bundle is moved to inventory' })
    bundleState: SpsOrderProductBundleStateEnum;
}


