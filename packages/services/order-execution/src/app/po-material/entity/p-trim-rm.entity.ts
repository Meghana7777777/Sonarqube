import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { InsUomEnum } from "@xpparel/shared-models";

@Entity('p_trim_rm_entity')
export class PTrimRmEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 30, name: 'item_code', nullable: false  })
    itemCode: string;
  
    @Column({ type: 'varchar', length: 40, name: 'item_name' })
    itemName: string;

    @Column({ type: 'varchar', length: 200, name: 'item_desc' })
    itemDesc: string;
  
    @Column({ type: 'varchar', length: 10, name: 'uom' })
    uom: InsUomEnum; // Assuming UOM is an enumerated type in your database
  
    @Column({ type: 'decimal',  precision: 5, scale: 2, name: 'avg_cons' })
    avgConsumption: string;
  
    @Column({ type: 'bigint', name: 'po_serial', nullable: false })
    poSerial: number;

    // Reference key
    @Column({ type: 'bigint', name: 'p_order_line_id', nullable: false  })
    pOrderLineId: number;
    
    // Reference key
    @Column({ type: 'int', name: 'p_osl_id' })
    pOrderSubLineId: number;
}