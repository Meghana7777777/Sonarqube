import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('w_pick_list')
export class WPickListEntity extends AbstractEntity {
    @Column('varchar', { name: 'item_name', length: 100 })
    itemName: string;

    @Column('varchar', { name: 'item_desc', length: 200 })
    itemDesc: string;

    @Column('varchar', { name: 'item_code', length: 50 })
    itemCode: string;

    @Column('int', { name: 'batch_no' })
    batchNo: number;
    
    @Column('int', { name: 'lot_no'})
    lotNo: number;

    @Column('int', { name: 'tot_qty' })
    totQty: number;

    @Column('varchar', { name: 'supplier_name', length: 100 })
    supplierName: string;

    @Column('varchar', { name: 'style', length: 50 })
    style: string;
}
