import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from "@xpparel/shared-models";

@Entity('operation')
export class OperationEntity extends AbstractEntity {
  
    @Column('varchar', { length: 10, name: 'i_op_Code', nullable: false })
    iOpCode: string;
  
    @Column('varchar', { length: 10, name: 'e_op_code', nullable: false })
    eOpCode: string;
  
    @Column('varchar', { length: 20, name: 'op_name', nullable: false })
    opName: string;

    @Column('varchar', { length: 10, name: 'op_category', nullable: false })
    opCategory: ProcessTypeEnum;

    @Column('varchar', { length: 20, name: 'op_form', nullable: false })
    opForm: OpFormEnum;

    @Column('varchar', { length: 255, name: 'machine_name', nullable: false })
    machineName: string;
}
