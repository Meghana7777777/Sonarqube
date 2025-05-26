import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum, SewJoGenRefTypeEnum } from "@xpparel/shared-models";

@Entity('s_job_header')
export class SJobHeaderEntity extends AbstractEntity {

	@Column('bigint', { name: 'processing_serial', nullable: false })
	processingSerial: number;

	@Column('varchar', { name: 'process_type', length: 25, nullable: false })
	processType: ProcessTypeEnum;

	@Column('bigint', {
		name: 'job_header_no',
		nullable: false
	})
	jobHeaderNo: number;
	

	@Column('bigint', {
		name: 'job_pref_id',
		nullable: false
	})
	jobPrefId: number
}
