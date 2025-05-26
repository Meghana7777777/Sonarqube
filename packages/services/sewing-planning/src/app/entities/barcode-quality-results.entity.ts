import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum, TrackingEntityEnum } from "@xpparel/shared-models";

@Entity('barcode_quality_results')
export class BarcodeQualityResultsEntity extends AbstractEntity {

  @Column('varchar', { name: 'barcode', nullable: false })
  barcode: string

  @Column('varchar', { name: 'barcode_type', nullable: false })
  barcodeType: string

  @Column('varchar', { name: 'operation_code', nullable: false })
  operationCode: string

  @Column('varchar', { name: 'process_type', length: 30, nullable: true })
  processType: ProcessTypeEnum

  @Column({ name: 'fail_count', type: 'int', nullable: false,})
  failCount: number;
  
  @Column('varchar', { name: 'resource_code', nullable: false })
  resourceCode: string;

}
