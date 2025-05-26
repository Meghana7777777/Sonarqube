import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('approver')
export class ApproverEntity {

    @PrimaryGeneratedColumn('increment', {
        name: 'id',
    })
    id: number

    @Column('varchar', {
        nullable: true,
        name: "approver_name",
        length: 250
    })
    approverName: string;

    @Column('varchar', {
        nullable: true,
        name: "email_id",
        length: 250
    })
    emailId: string;

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