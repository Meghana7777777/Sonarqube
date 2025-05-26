import { EscallationTypeEnum } from "@xpparel/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('escallation') 
export class EscallationEntity{

    @PrimaryGeneratedColumn('increment', {
        name: 'id',
    })
    id: number

    @Column('enum', {
        name: "escalation_type",
        enum: EscallationTypeEnum
    })
    escalationType: string;

    @Column('varchar', {
        nullable: true,
        name: "style",
        length: 250
    })
    style: string;

    @Column('varchar', {
        nullable: true,
        name: "buyer",
        length: 250
    })
    buyer: string;

    @Column('varchar', {
        nullable: true,
        name: "work_order",
        length: 250
    })
    workOrder: string;

    @Column('varchar', {
        nullable: true,
        name: "quality_type",
        length: 250
    })
    qualityType: string;

    @Column('varchar', {
        nullable: true,
        name: "escalation_percentage",
        length: 250
    })
    escalationPercentage: string;

    @Column('varchar', {
        nullable: true,
        name: "escalation_person",
        length: 250
    })
    escalationPerson: string;


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