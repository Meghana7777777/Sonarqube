import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('s_job_transfer_history')
export class SJobTransferHistoryEntity extends AbstractEntity {
  
    @Column({ type: 'varchar', length: 30, name: 'job_no' })
    jobNo: string;
  
    @Column({ type: 'varchar', length: 10, name: 's_job_line_id' })
    sJobLineId: string;
  
    @Column({ type: 'varchar', length: 10, name: 'from_module' })
    fromModule: string;
  
    @Column({ type: 'tinyint', name: 'to_module', default: 0 })
    toModule: number;
  
    @Column({ type: 'varchar', length: 30, name: 'status' })
    status: string;

    @Column({ type: 'varchar', length: 30, name: 'raw_material_status' })
    rawMaterialStatus: string;

    @Column('int', {
		name: 'sew_serial',
		nullable: false
	})
	sewSerial: number
  
   
}