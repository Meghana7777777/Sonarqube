export class ForecastPlanYearMonthModel {
  date: string;
  isUploaded: boolean;
  companyCode: string;
  unitCode: string;
  module: string;
  workstationCode: string;
  styleOrMo: string;
  scheduleOrMoLine: string;
  color: string;
  planCutDate: Date | null;
  planDelDate: Date | null;
  planPcs: number;
  planSah: number | null;
  smv: number | null;
  planSmo: number | null;
  planEff: number | null;
  planType: string;
  forecastQty: number;

  constructor(
    date: string,
    isUploaded: boolean,
    companyCode: string,
    unitCode: string,
    module: string,
    workstationCode: string,
    styleOrMo: string,
    scheduleOrMoLine: string,
    color: string,
    planCutDate: Date | null,
    planDelDate: Date | null,
    planPcs: number,
    planSah: number | null,
    smv: number | null,
    planSmo: number | null,
    planEff: number | null,
    planType: string,
    forecastQty?: number
  ) {
    this.date = date;
    this.isUploaded = isUploaded;
    this.companyCode = companyCode;
    this.unitCode = unitCode;
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
    this.forecastQty = forecastQty;
  }
}

export class ForecastPlanYearModel {
  date: string;
  isUploaded: boolean;
  companyCode: string;
  unitCode: string;

  constructor(
    date: string,
    isUploaded: boolean,
    companyCode: string,
    unitCode: string,
  ) {
    this.date = date;
    this.isUploaded = isUploaded;
    this.companyCode = companyCode;
    this.unitCode = unitCode;
  }
}

export class ForecastPlanYearDataModel {
  date: string;
  companyCode: string;
  unitCode: string;
  module: string;
  workstationCode: string;
  styleOrMo: string;
  scheduleOrMoLine: string;
  color: string;
  planCutDate: Date | null;
  planDelDate: Date | null;
  planPcs: number;
  planSah: number | null;
  smv: number | null;
  planSmo: number | null;
  planEff: number | null;
  planType: string;
  forecastQty: number

  constructor(
    date: string,
    companyCode: string,
    unitCode: string,
    module: string,
    workstationCode: string,
    styleOrMo: string,
    scheduleOrMoLine: string,
    color: string,
    planCutDate: Date | null,
    planDelDate: Date | null,
    planPcs: number,
    planSah: number | null,
    smv: number | null,
    planSmo: number | null,
    planEff: number | null,
    planType: string,
    forecastQty?: number
  ) {
    this.date = date;
    this.companyCode = companyCode;
    this.unitCode = unitCode;
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
    this.forecastQty = forecastQty;
  }
}