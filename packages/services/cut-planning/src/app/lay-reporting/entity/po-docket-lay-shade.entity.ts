import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";


@Entity('po_docket_lay_shade')
export class PoDocketLayShadeEntity extends AbstractEntity {

    @Column("varchar", { length: 20, name: "docket_group", nullable: false, comment: 'This is docket group' })
    docket_group: string;

    @Column("varchar", {length: 5, name: 'shade', nullable: false, comment: 'This is Shade name'})
    shade: string;

    @Column("smallint", {name: 'plies', nullable: false, comment: 'This is Plies Total'})
    plies: string;

    @Column("bigint", { name: "po_docket_lay_id", nullable: false, comment: 'The reference key of po_docket_lay' })
    poDocketLayId: number; 
}