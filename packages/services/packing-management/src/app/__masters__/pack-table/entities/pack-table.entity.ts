import { Column, Entity, OneToMany, Unique } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { JobHeaderEntity } from "../../../packing-list/entities/job-header.entity";

@Entity('pm_m_pack_table')
export class PackTableEntity extends AbstractEntity {
  
  @Column('varchar', {
    name: 'table_desc',
    length: 40,
    nullable: false
  })
  tableDesc: string;   

  @Column('varchar', {
    name: 'table_name',
    length: 40,
    nullable: false,
    unique: true
  })
  tableName: string;

  @Column('smallint', {
    name: 'capacity',
    nullable: false
  })
  capacity: number;

  @Column('varchar', {
    name: 'ext_ref_code',
    length: 30,
    nullable: false
  })
  extRefCode: string
 
  // @OneToMany(type => JobHeaderEntity,workStationId =>  workStationId.workStationId, { cascade: true })
  // workStationId: JobHeaderEntity[];
}

