import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { InvOutRequestAllocationStatusEnum, InvOutRequestIssuanceStatusEnum } from "./inv.out.req.entity";

@Entity('inv_out_req_item')
export class InvOutRequestItemEntity extends AbstractEntity {
    
    @Column({ name: 'inv_out_request_id', type: 'bigint', comment: 'PK of the inv out request' })
    invOutRequestId: number;

    @Column({ name: 'processing_serial', type: 'int', nullable: false, comment: 'Processing serial number' })
    processingSerial: number;

    @Column({ name: 'process_type', type: 'varchar', length: 10, nullable: false, comment: 'Processing type: KNIT / LINK / FIN / WASH' })
    processType: ProcessTypeEnum;

    @Column({ name: 'item_sku', type: 'varchar', length: 30, nullable: false, comment: 'Item SKU as per the STYLE operation routing' })
    itemSku: string;

    @Column({ name: 'dep_proc_type', type: 'varchar', length: 10, nullable: false, comment: 'Dependent processing type' })
    depProcType: ProcessTypeEnum;
}
