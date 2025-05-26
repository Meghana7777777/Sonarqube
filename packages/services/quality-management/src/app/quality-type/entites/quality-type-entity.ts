import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('quality_type')
export class QualityTypeEntity {

    @PrimaryGeneratedColumn('increment', {
        name: 'id',
    })
    id: number

    @Column('varchar', {
        nullable: true,
        name: "quality_type",
        length: 250
    })
    qualityType: string;

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: string;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: string;

    @Column("boolean", {
        default: true,
        nullable: true,
        name: "is_active"
    })
    isActive: boolean;

    @VersionColumn({
        default: 1,
        nullable: true,
        name: 'version_flag'
    })
    versionFlag: number;
}