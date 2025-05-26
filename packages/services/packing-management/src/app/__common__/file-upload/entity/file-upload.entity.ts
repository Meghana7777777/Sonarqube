import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities"; 
import { ReferenceFeaturesEnum } from "@xpparel/shared-models";

@Entity('_common_file_upload')
export class FileUploadEntity extends AbstractEntity {

    @Column('varchar', {
        nullable: false,
        length: 250,
        name: 'file_description'
    })
    fileDescription: string;

    @Column('varchar', {
        nullable: false,
        name: 'features_ref_no'
    })
    featuresRefNo: any;

    @Column('varchar', {
        nullable: false,
        length: 250,
        name: 'file_name'
    })
    fileName: string;

    @Column('integer', {
        nullable: true,
        name: 'size',
        default: 1
    })
    size: string;

    @Column('varchar', {
        nullable: false,
        length: 250,
        name: 'original_name'
    })
    originalName: string;

    @Column('varchar', {
        nullable: true,
        length: 100,
        name: 'type'
    })
    type: string;

 

    @Column('varchar', {
        nullable: true,
        length: 60,
        name: 'last_modified'
    })
    lastModified: string;


    @Column('varchar', {
        nullable: true,
        length: 60,
        name: 'last_modified_date'
    })
    lastModifiedDate: string;

    @Column('integer', {
        nullable: true,
        name: 'percent',
        default: 1
    })
    percent: string;

    @Column('varchar', {
        nullable: false,
        length: 300,
        name: 'file_path'
    })
    filePath: string;
 
    @Column({
        type: 'enum',
        enum: ReferenceFeaturesEnum,
        nullable: false,
        name: 'features_ref_name'
    })
    featuresRefName: ReferenceFeaturesEnum;

}