import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { InsMasterdataCategoryEnum, InsTypesEnum, InsTypesEnumType, InsTypesForMasterEnum } from "@xpparel/shared-models";

@Entity('i_reason')
export class IReasonEntity extends AbstractEntity {
  @Column('varchar', {
    name: 'name',
    length: 100,
  })
  name: string;

  @Column('varchar', {
    name: 'code',
    length: 50,
  })
  code: string;

  @Column('varchar', {
    name: 'ext_code',
    length: 50,
    nullable: true
  })
  extCode: string;

  @Column('varchar', {
    name: 'point_value',
    length: 50,
    nullable: true
  })
  pointValue: string;

  @Column('varchar', { name: 'reason_name', nullable: true })
  reasonName: string;

  @Column('varchar', { name: 'reason_desc', nullable: true })
  reasonDesc: string;

  @Column('enum', { name: 'category', enum: InsMasterdataCategoryEnum, nullable: true })
  category: InsMasterdataCategoryEnum;

  @Column('enum', { name: 'ins_type', enum: InsTypesForMasterEnum })
  insType: InsTypesForMasterEnum;

}



