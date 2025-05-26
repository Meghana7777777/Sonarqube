import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('item')
export class ItemEntity extends AbstractEntity {

    @Column('varchar', {
      name: 'item_name',
      nullable: false
    })
    itemName: string;

    @Column('varchar', {
      name: 'item_code',
      nullable: false
    })
    itemCode: string;

    @Column('varchar', {
      name: 'item_description',
      nullable: true
    })
    itemDescription: string;

    @Column('varchar', {
      name: 'item_sku',
      nullable: false
    })
    itemSku: string;

    @Column('varchar', {
      name: 'rm_item_type',
      nullable: false
    })
    rmItemType: string;


    @Column('varchar', {
        name: 'bom_item_type',
        nullable: false
    })
    bomItemType: string;
  
    @Column('varchar', {
      name: 'item_color',
      nullable: false
    })
    itemColor: string;

}