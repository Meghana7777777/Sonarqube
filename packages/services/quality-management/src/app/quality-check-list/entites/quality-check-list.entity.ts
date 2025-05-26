import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
@Entity('quality_check_list')
export class QualityCheckListEntity {

    @PrimaryGeneratedColumn("increment", {
        name: 'quality_check_list_id'
    })
    qualityCheckListId: number

    @Column('int', {
        name: 'quality_type_id',
        nullable: true
    })
    qualityTypeId: number

    @Column('varchar', {
        name: 'parameter',
        nullable: true
    })
    parameter: string

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;

    @Column("boolean", {
        name: "is_active",
        default: true,
    })
    isActive: boolean;

    @Column("varchar", {
        name: "created_user",
        default: true,
    })
    createdUser: string;

    @Column("varchar", {
        name: "updated_user",
        default: true,
    })
    updatedUser: string;

    @VersionColumn({
        default: 1,
        name: "version_flag",
    })
    versionFlag: number;
}