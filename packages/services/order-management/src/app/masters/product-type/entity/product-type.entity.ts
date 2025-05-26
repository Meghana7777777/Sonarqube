import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';

@Entity('product_type')
export class ProductTypeEntity extends AbstractEntity {

   @Column('varchar', {
      name: 'product_type',
      length: 40,
      nullable: false
   })
   productType: string

   @Column('varchar', {
      name: 'product_desc',
      length: 50,
      nullable: false
   })
   productDesc: string
}
