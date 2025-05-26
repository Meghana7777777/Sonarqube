import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';

@Entity('component')
export class ComponentEntity extends AbstractEntity {

    @Column('varchar',{
      name: 'component_name',
      length:20,
      nullable:false
    })
    componentName:string
    
    @Column('varchar',{
      name: 'component_desc',
      length:30,
      nullable:false
    })
    componentDesc:string
}
