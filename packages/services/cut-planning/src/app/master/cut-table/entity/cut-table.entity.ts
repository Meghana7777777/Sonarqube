import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';

@Entity('cut_table')
export class CutTableEntity extends AbstractEntity {

    @Column('varchar',{
      name: 'table_desc',
      length:20,
      nullable:false
    })
    tableDesc:string;
    
    @Column('varchar',{
      name: 'table_name',
      length:30,
      nullable:false
    })
    tableName:string;

    @Column('smallint',{
      name: 'capacity',
      nullable:false
    })
    capacity: number;

    @Column('varchar',{
      name: 'ext_ref_code',
      length: 30,
      nullable:false
    })
    extRefCode: string;
}
