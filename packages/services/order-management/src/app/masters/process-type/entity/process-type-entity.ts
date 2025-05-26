import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";

@Entity('process_type')
export class ProcessTypeEntity extends AbstractEntity {

    @Column('varchar',{
      name: 'process_type_name',
      length:50,
      nullable:false
    })
    processTypeName:string

    @Column('varchar',{
      name: 'process_type_code',
      length:50,
      nullable:true
    })
    processTypeCode:string

    @Column('varchar',{
      name: 'process_type_description',
      length:100,
      nullable:true
    })
    processTypeDescription:string

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
      name: 'remarks',
      length:255,
      nullable:true
    })
    remarks:string
}