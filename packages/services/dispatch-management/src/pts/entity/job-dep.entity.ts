
import { Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from "@xpparel/shared-models";


@Entity('job_dep')
export class JobDepEntity extends AbstractEntity {
    sewSerial: number;
    opCode: string; // will be same value for all records in the job
    opCategory: ProcessTypeEnum; // always the category 
    jobGroup: number;
    jobNumber: string;
    preJobGroup: number;
    preJgLastOp: string;
    depJobGroupType: OpFormEnum;
    componentName: string; //  this will have a value only if the form is Panel
    issuedQty: number;
    reqQty: number;
    orgQty: number;
}



