import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { OrderTypeEnum } from "@xpparel/shared-models";

@Entity('fg')
export class FgEntity {
    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;
    
    @Column('boolean', { default: true, name: 'is_active' })
    isActive: boolean;
    
    @Column("bigint", { name: "fg_number", nullable: false, comment: '' })
    fgNumber: number;

    @Column("char", { name: "oq_type", length: 2, nullable: false, comment: '' })
    oqType: OrderTypeEnum;

    @Column("bigint", { name: "osl_id", nullable: false, comment: '' })
    oslId: number;
}