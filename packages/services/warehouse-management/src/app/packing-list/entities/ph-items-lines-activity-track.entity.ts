import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PhItemLineActivityTrackEnum } from "@xpparel/shared-models";

@Entity('ph_item_lines_activity_track')
export class PhItemLinesActivityTrackEntity extends AbstractEntity{
    @Column({
        type:'enum',
        name:'activity',
        enum:PhItemLineActivityTrackEnum,
    })
    activity:PhItemLineActivityTrackEnum;
}