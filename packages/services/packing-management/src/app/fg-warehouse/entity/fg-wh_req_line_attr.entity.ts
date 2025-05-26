import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('fg_wh_req_line_attrs')
export class FgWhReqLineAttrsEntity extends AbstractEntity {
  @Column({ name: 'fg_wh_rh_id', type: 'int', nullable: false, comment: '' })
  fgWhRhId: number;

  @Column({ name: 'fg_wh_rl_id', type: 'int', nullable: false, comment: '' })
  fgWhRlId: number;

  @Column({ name: 'mo_no', type: 'varchar', length: 20, nullable: false, comment: '' })
  moNo: string;

  @Column({ name: 'po', type: 'varchar', length: 30, nullable: false, comment: '' })
  po: string;

  @Column({ name: 'destination', type: 'varchar', length: 100, nullable: false, comment: '' })
  destination: string;

  @Column({ name: 'buyer', type: 'varchar', length: 100, nullable: false, comment: '' })
  buyer: string;

  @Column({ name: 'del_date', type: 'text', nullable: false, comment: '' })
  delDate: string;

  @Column({ name: 'product_name', type: 'varchar', length: 100, nullable: false, comment: '' })
  productName: string;

  @Column({ name: 'style', type: 'varchar', length: 100, nullable: false, comment: '' })
  style: string;
}