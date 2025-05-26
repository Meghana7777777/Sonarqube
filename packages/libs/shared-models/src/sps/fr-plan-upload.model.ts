import { CommonRequestAttrs } from "../common";

export class ForecastPlanModel extends CommonRequestAttrs {
  module: string;
  workstationCode: string;
  styleOrMo: string;
  scheduleOrMoLine: string;
  color: string;
  planCutDate: string;
  planDelDate: string;
  planPcs: number;
  planSah: number;
  smv: number;
  planSmo: number;
  planEff: number;
  planType: string;
  date: string;

  constructor(
    username: string, unitCode: string, companyCode: string, userId: number,
    module: string,
    workstationCode: string,
    styleOrMo: string,
    scheduleOrMoLine: string,
    color: string,
    planCutDate: string,
    planDelDate: string,
    planPcs: number,
    planSah: number,
    smv: number,
    planSmo: number,
    planEff: number,
    planType: string,
    date: string
  ) {
    super(username, unitCode, companyCode, userId);
    this.module = module;
    this.workstationCode = workstationCode;
    this.styleOrMo = styleOrMo;
    this.scheduleOrMoLine = scheduleOrMoLine;
    this.color = color;
    this.planCutDate = planCutDate;
    this.planDelDate = planDelDate;
    this.planPcs = planPcs;
    this.planSah = planSah;
    this.smv = smv;
    this.planSmo = planSmo;
    this.planEff = planEff;
    this.planType = planType;
    this.date = date;
  }
}
