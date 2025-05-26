import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity("forecast_plan")
export class ForecastPlanEntity extends AbstractEntity {
  
  @Column("varchar", { name: "module", length: 50, nullable: false })
  module: string;

  @Column("varchar", { name: "workstation_code", length: 50, nullable: false })
  workstationCode: string;

  @Column("varchar", { name: "style_or_mo", length: 50, nullable: false })
  styleOrMo: string;

  @Column("varchar", { name: "schedule_or_mo_line", length: 50, nullable: false })
  scheduleOrMoLine: string;

  @Column("varchar", { name: "color", length: 30, nullable: true })
  color: string;

  @Column("date", { name: "plan_cut_date", nullable: true })
  planCutDate: Date;

  @Column("date", { name: "plan_del_date", nullable: true })
  planDelDate: Date;

  @Column("int", { name: "plan_pcs", nullable: false })
  planPcs: number;

  @Column("float", { name: "plan_sah", nullable: true })
  planSah: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'smv' })
  smv: number;

  @Column("float", { name: "plan_smo", nullable: true })
  planSmo: number;

  @Column("float", { name: "plan_eff", nullable: true })
  planEff: number;

  @Column("varchar", { name: "plan_type", length: 30, nullable: false })
  planType: string;

  @Column("date", { name: "date", nullable: false })
  planDate: Date;

  @Column("int", { name: "forecast_qty", nullable: true })
  forecastQty: number;
}
