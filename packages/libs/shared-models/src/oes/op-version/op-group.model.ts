import { ProcessTypeEnum } from "../../oms";


export class OpGroupModel {
    group: string;
    sequence: number;
    depGroups: string[];
    operations: string[];
    components: string[];
    groupCategory: ProcessTypeEnum;
    itemCode?:string

    constructor(
        group: string,
        sequence: number,
        depGroups: string[],
        operations: string[],
        components: string[],
        groupCategory: ProcessTypeEnum,
        itemCode?:string
    ) {
        this.group = group;
        this.sequence = sequence;
        this.depGroups = depGroups;
        this.operations = operations;
        this.components = components;
        this.groupCategory = groupCategory;
        this.itemCode = itemCode
    }

}