import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';

@Entity('product_type_component')
export class ProductTypeComponentEntity extends AbstractEntity {

   @Column('varchar', {
      name: 'product_type',
      length: 40,
      nullable: false
   })
   productType: string

   @Column('varchar', {
      name: 'component_name',
      length: 30,
      nullable: false
   })
   componetName: string

   @Column('int', {
      name: 'component_id',

   })
   componetId: number

   @Column('int', {
      name: 'product_type_id',
      
   })
   productTypeId: number
}
