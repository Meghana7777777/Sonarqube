import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities"
import { PhItemPrintStatus } from "@xpparel/shared-models";

@Entity('ph_lines_history')
export class PhLinesHistoryEntity extends AbstractEntity{
@Column('integer',{
    name:'ph_lines_id',
})
phLinesId: number;
}