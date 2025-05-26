import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, DocketAttrEnum } from "@xpparel/shared-models";

@Entity('po_docket_attr')
export class PoDocketAttrEntity {
    @PrimaryGeneratedColumn({
        name: 'id'
    })
    public id: number;

    // this will be same as the ID
    @Column("varchar", { name: "docket_number", nullable: false, comment: '' })
    docketNumber: string;
  
    @Column("varchar", { name: "name", length: 20, nullable: false,  comment: ''})
    name: DocketAttrEnum;
  
    @Column("text", {  name: "value", nullable: false, comment: '' })
    value: string;
}