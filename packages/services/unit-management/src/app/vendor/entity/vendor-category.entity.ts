
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { VendorCategoryEnum } from "@xpparel/shared-models";

@Entity('vendor_category')
export class VendorCategoryEntity {
    
    @PrimaryGeneratedColumn({ name: 'id'})
    id: number;

    @Column('smallint', { name: 'vendor_id', nullable: false })
    vendorId: number;

    @Column('text', { name: 'v_category', nullable: false })
    vCategory: VendorCategoryEnum;

}
