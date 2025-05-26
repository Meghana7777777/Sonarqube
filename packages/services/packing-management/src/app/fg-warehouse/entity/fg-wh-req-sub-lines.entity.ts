import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { FgWhRequestStatusEnum } from "packages/libs/shared-models/src/pkms/enum/fg-wh-reqstatus.enum";


@Entity('fg_wh_req_sub_lines')
export class FgWhReqSubLinesEntity extends AbstractEntity {

  @Column({ name: 'fg_wh_rh_id', type: 'int', nullable: false, comment: '' })
  fgWhRhId: number;

  @Column({ name: 'fg_wh_rl_id', type: 'int', nullable: false, comment: '' })
  fgWhRlId: number;

  @Column({ name: 'barcode', type: 'varchar', length: 100, nullable: false, comment: 'Carton barcode' })
  barcode: string;

  @Column({ name: 'ref_no', type: 'int', nullable: false, comment: 'Carton Id' })
  refNo: number;

  @Column({ name: 'qty', type: 'int', nullable: false, comment: 'Carton qty' })
  qty: number;

  @Column({ name: 'location', type: 'varchar', length: 20, nullable: true, comment: 'Warehouse location' })
  location: string;

  @Column({ name: 'pallet', type: 'varchar', length: 20, nullable: true, comment: 'Pallet' })
  pallet: string;

  @Column({ name: 'status', type: 'varchar', length: 50, nullable: false, default: FgWhRequestStatusEnum.OPEN, comment: '' })
  status: FgWhRequestStatusEnum;

  @Column({ name: 'to_wh_code', type: 'varchar', length: 20, nullable: false, comment: 'Destination warehouse code' })
  toWhCode: string;

  @Column("varchar", { length: 100, name: "scan_start_time", nullable: true, comment: '' })
  scanStartTime: string;

  @Column("varchar", { length: 100, name: "scan_end_time", nullable: true, comment: '' })
  scanEndTime: string;


}
