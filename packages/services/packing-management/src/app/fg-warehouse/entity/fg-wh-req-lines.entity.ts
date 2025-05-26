import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PkmsFgWhCurrStageEnum } from "@xpparel/shared-models";

@Entity('fg_wh_req_lines')
export class FgWhReqLinesEntity extends AbstractEntity {

  @Column({ name: 'fg_wh_rh_id', type: 'int', nullable: false, comment: '' })
  fgWhRhId: number;

  @Column({ name: 'pack_list', type: 'varchar', length: 50, nullable: false, default: 'ref type', comment: '' })
  packList: string;//packListNo

  @Column({ name: 'pack_list_id', type: 'int', nullable: false, comment: 'ref Id' })
  packListId: number;

  @Column({ name: 'pack_list_no', type: 'varchar', length: 50, nullable: false, comment: 'ref no 1' })
  packListNo: string;

  @Column({ name: 'pack_order_no', type: 'varchar', length: 50, nullable: false, comment: 'ref no 2' })
  packOrderNo: string;

  @Column({ name: 'pack_order_id', type: 'int', nullable: false, comment: 'ref no 2' })
  packOrderId: number;

  @Column({ name: 'mo_no', type: 'varchar', length: 50, nullable: false, comment: 'ref no 3' })
  moNo: string;

  @Column({ name: 'floor', type: 'varchar', length: 20, nullable: false, comment: '' })
  floor: string;

  @Column({ name: 'to_wh_code', type: 'varchar', length: 20, nullable: false, comment: 'Destination warehouse code' })
  toWhCode: string;

  @Column("varchar", { name: "current_stage", nullable: false, comment: '', default: `${PkmsFgWhCurrStageEnum.OPEN}` })
  currentStage: PkmsFgWhCurrStageEnum;

  @Column({ name: 'print_status', type: 'boolean', nullable: false, default: false, comment: '' })
  printStatus: boolean;

  @Column({ name: 'print_at', type: 'varchar', length: 50, nullable: true, comment: '' })
  printAt: string;

  @Column({ name: 'fg_completed_status', type: 'boolean', nullable: false, default: false, comment: '' })
  fgCompletedStatus: boolean;


}
