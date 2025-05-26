import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('style')
export class StyleEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'style_name',
        length: 50,
        nullable: false
    })
    styleName: string;

    @Column('varchar', {
        name: 'code',
        length: 20,
        nullable: false
    })
    styleCode: string;

    @Column('varchar', {
        name: 'description',
        length: 100,
        nullable: true
    })
    description: string;

    @Column('varchar', {
        name: 'image_name',
        length: 255,
        nullable: true
    })
    imageName: string;

    @Column('varchar', {
        name: 'image_path',
        length: 255,
        nullable: true
    })
    imagePath: string;

    @Column("enum", { enum: ProcessTypeEnum, name: "process_type", nullable: true, comment: '' })
    processType: ProcessTypeEnum;
}