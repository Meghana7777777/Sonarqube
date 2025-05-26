import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { ReasonCategoryEnum } from '@xpparel/shared-models';
import { AbstractEntity } from "../../../database/common-entities";

@Entity('reasons')
export class ReasonsEntity extends AbstractEntity {

    @Column('varchar',{
      name: 'reason_name',
      length:20,
      nullable:false
    })
    reasonName:string;
    
    @Column('varchar',{
      length: 15,
      name: 'reason_code',
      nullable:false
    })
    reasonCode:string;

    @Column('varchar',{
      length: 40,
      name: 'reason_desc',
      nullable:false
    })
    reasonDesc: string;

    @Column('varchar',{
      length: 20,
      name: 'reason_category',
      nullable:false
    })
    reasonCategory: ReasonCategoryEnum;
}
