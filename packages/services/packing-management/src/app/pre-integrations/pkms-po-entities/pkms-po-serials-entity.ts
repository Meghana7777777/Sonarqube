import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('pkms_po_serials')
export class PKMSPoSerialsEntity extends AbstractEntity {

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: string;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;


}