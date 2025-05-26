import { ProcessTypeEnum, OpFormEnum } from "../../oms";


export class SewGroupModel {
    group: string; // sub process
    sequence: number; // sub process sequence // (1)KNIT -  1, 2, 3, 4 // (2)LINKING -> 1, 2
    depGroups: string[]; // It will not come for first group with in the process type
    operations: string[];
    components: string[];
    groupCategory: ProcessTypeEnum; // Process type
    processTypeSequence: number;
    jobtype?:string;
    warehouse?:string;
    extProcessing?:string;
    itemCode?:string;
    opForm?:OpFormEnum;

    constructor(
        group: string,
        sequence: number,
        depGroups: string[],
        operations: string[],
        components: string[],
        groupCategory: ProcessTypeEnum,
        processTypeSequence: number,
        jobtype?: string,
        warehouse?:string,
        extProcessing?:string,
        itemCode?:string
    ) {
        this.group = group;
        this.sequence = sequence;
        this.depGroups = depGroups;
        this.operations = operations;
        this.components = components;
        this.groupCategory = groupCategory;
        this.processTypeSequence = processTypeSequence;
        this.jobtype = jobtype;
        this.warehouse = warehouse;
        this.extProcessing = extProcessing;
        this.itemCode = itemCode
    }

}