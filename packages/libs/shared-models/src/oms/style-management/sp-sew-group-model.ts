import { ProcessTypeEnum, OpFormEnum } from "../../oms";


export class SpSewGroupModel {
    group: string;
    sequence: number;
    depGroups: string[];
    operations: string[];
    components: string[];
    groupCategory: ProcessTypeEnum;
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
        this.jobtype = jobtype;
        this.warehouse = warehouse;
        this.extProcessing = extProcessing;
        this.itemCode = itemCode
    }

}