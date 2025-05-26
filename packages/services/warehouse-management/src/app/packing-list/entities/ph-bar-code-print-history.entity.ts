import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities"
import { PhItemPrintStatus } from "@xpparel/shared-models";

@Entity('ph_barcode_print_history')
export class PhBarcodePrintHistoryEntity extends AbstractEntity{
    @Column('integer',{
        name:'ph_lines_id',
    })
    phLinesId: number;
    
    @Column({
        type:'enum',
        name:'action',
        enum:PhItemPrintStatus,
    })
    action:PhItemPrintStatus;
}