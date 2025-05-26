import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";


@Entity('rm_info')
export class RmInfoEntity extends AbstractEntity {

    @Column({ type:'varchar',length:25,name: 'mo_number',nullable:false })
    moNumber: string;

    @Column({ type: 'varchar', length: 50, name: 'item_code', nullable:false })
    itemCode: string;

    @Column({ type: 'varchar', length: 200, name: 'item_name', nullable: false })
    itemName: string;

    @Column({ type: 'varchar', length: 200, name: 'item_desc', nullable: true })
    itemDesc: string;

    @Column({ type: 'varchar', length:15, name: 'item_type', nullable:false})
    itemType: string;

    @Column({ type: 'varchar', length: 15, name: 'item_sub_type', nullable: true })
    itemSubType: string;

    @Column({ type: 'varchar', length: 20, name: 'item_color', nullable: true })
    itemColor: string;

    @Column({ type: 'varchar', length: 10, name: 'item_uom', nullable: true })
    itemUom: string;

    @Column({ type: 'int', name: 'sequence', nullable: true })
    sequence: number;

    @Column({ type: 'decimal', name: 'consumption', nullable: true, precision: 5, scale: 2, })
    consumption: number;

    @Column({ type: 'decimal', name: 'wastage', nullable: true,precision: 5, scale: 2, })
    wastage: number;
}