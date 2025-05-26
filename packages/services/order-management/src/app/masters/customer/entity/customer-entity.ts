import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";

@Entity('customer')
export class CustomerEntity extends AbstractEntity {

    @Column('varchar',{
      name: 'customer_name',
      length:50,
      nullable:false
    })
    customerName:string

    @Column('varchar',{
      name: 'customer_code',
      length:20,
      nullable:false
    })
    customerCode:string

    @Column('varchar',{
      name: 'customer_description',
      length:100,
      nullable:true
    })
    customerDescription:string

    @Column('varchar',{
      name: 'image_name',
      length:255,
      nullable:true
    })
    imageName:string

    @Column('varchar',{
      name: 'image_path',
      length:255,
      nullable:true
    })
    imagePath:string

    @Column('varchar',{
      name: 'customer_location',
      length:255,
      nullable:true
    })
    customerLocation:string
}