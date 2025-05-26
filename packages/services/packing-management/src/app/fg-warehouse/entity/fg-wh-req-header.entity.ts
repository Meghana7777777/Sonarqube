import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PkmsFgWhReqApprovalEnum, PkmsFgWhCurrStageEnum, PkmsFgWhReqTypeEnum } from "@xpparel/shared-models";



@Entity('fg_wh_req_header')
export class FgWhReqHeaderEntity extends AbstractEntity {
  @Column({ name: 'request_no', type: 'varchar', length: 20, nullable: false, comment: 'Unique identifier for the warehouse request' })
  requestNo: string;//fg-in-00001  if in else is out fg-out-00001

  @Column("varchar", { name: "request_approval_status", nullable: false, comment: 'Status of the request approval', default: `${PkmsFgWhReqApprovalEnum.OPEN}` })
  requestApprovalStatus: PkmsFgWhReqApprovalEnum;

  @Column({ name: 'approved_by', type: 'varchar', length: 30, nullable: true, comment: 'User who approved the request' })
  approvedBy: string;

  @Column("varchar", { name: "current_stage", nullable: false, comment: 'Current stage of the request', default: `${PkmsFgWhCurrStageEnum.OPEN}` })
  currentStage: PkmsFgWhCurrStageEnum;

  @Column({ name: 'to_wh_code', type: 'varchar', length: 20, nullable: false, comment: 'Destination warehouse code' })
  toWhCode: string;

  @Column({ name: 'from_wh_code', type: 'varchar', length: 20, nullable: true, comment: 'Source warehouse code' })
  fromWhCode: string;//unitCode

  @Column("varchar", { name: "req_type", nullable: false, comment: 'Type of the request (IN or OUT)' })
  reqType: PkmsFgWhReqTypeEnum;

  @Column({ name: 'requested_date', type: 'varchar', length: 50, nullable: false, comment: 'Request date (YYYY-MM-DD HH:MM)' })
  requestedDate: string;

  @Column("varchar", { length: 100, name: "scan_start_time", nullable: true, comment: '' })
  scanStartTime: string;

  @Column("varchar", { length: 100, name: "scan_end_time", nullable: true, comment: '' })
  scanEndTime: string;


}
