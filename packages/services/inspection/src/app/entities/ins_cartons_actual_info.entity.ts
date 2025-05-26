import { InsUomEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('ins_carton_actual_info')
export class InsCartonActualInfoEntity extends AbstractEntity {

    // @Column('integer',{ name: 'ph_items_id' })
    // phItemsId: number;

    @Column('integer', { name: 'carton_id',comment:'pk of carton' })
    CartonId: number;

    @Column('integer', { name: 'ins_req_id' })
    insReqId: number; 

    @Column('integer', { name: 'ins_req_items_id' })
    insReqItemsId: number;




    @Column({ name: 'gross_weight', type: 'int', nullable: true })
    grossWeight: number;

    @Column({ name: 'net_weight', type: 'int', nullable: true })
    netWeight: number;

    @Column({ name: 'uom', type: 'int', nullable: true })
    uom: number;



}