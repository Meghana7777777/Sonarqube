import { CommonRequestAttrs } from "../../common";

export class OperatorEfficiencyReportModel extends CommonRequestAttrs {
    style: string;
    module: string; // module code/name 
    operator: string;
    machine: string; // workstation code/name
    operation: string;
    output: number;
    downtime: number; // in minutes
    numberOfDefects: number;
    smv: number;
    efficiency: number;
    
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        style: string,
        module: string,
        operator: string,
        machine: string,
        operation: string,
        output: number,
        downtime: number,
        numberOfDefects: number,
        smv: number,
        efficiency: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.style = style;
        this.module = module;
        this.operator = operator;
        this.machine = machine;
        this.operation = operation;
        this.output = output;
        this.downtime = downtime;
        this.numberOfDefects = numberOfDefects;
        this.smv = smv;
        this.efficiency = efficiency;
    }
}