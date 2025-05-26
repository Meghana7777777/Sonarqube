import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";


@Entity('rm_info')
export class RmInfoEntity extends AbstractEntity {

    @Column({ type:'varchar',length:25,name: 'so_number',nullable:false })
    soNumber: string;

    @Column({ type: 'varchar', length: 50, name: 'item_code', nullable:false })
    itemCode: string;

    @Column({ type: 'varchar', length: 50, name: 'item_name', nullable: false })
    itemName: string;

    @Column({ type: 'varchar', length: 100, name: 'item_desc', nullable: true })
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

    @Column({ type: 'int', name: 'consumption', nullable: true })
    consumption: number;

    @Column({ type: 'int', name: 'wastage', nullable: true })
    wastage: number;
}