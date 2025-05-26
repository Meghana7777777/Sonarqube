import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

export enum FgWhReqSecurityStatusEnum {
    SECURITY_IN = "SECURITY IN",
    SECURITY_Out = "SECURITY OUT",
}

export enum FgWhReqVehTypeEnum {
    MOVER = "MOVER",
    TRUCK = "TRUCK",
    TROLLY = "TROLLY"
}

@Entity('fg_wh_security_track')
export class FgWhSecurityTrackEntity extends AbstractEntity {

    @Column({ name: 'fg_wh_rh_id', type: 'int', nullable: false, comment: '' })
    fgWhRhId: number;

    @Column({ name: 'fg_wh_rl_id', type: 'int', nullable: false, comment: '' })
    fgWhRlId: number;

    @Column({ name: 'status', type: 'varchar', length: 50, nullable: false, comment: '' })
    status: FgWhReqSecurityStatusEnum;

    @Column({ name: 'security_name', type: 'varchar', length: 100, nullable: false, comment: '' })
    securityName: string;

    @Column({ name: 'in_at', type: 'timestamp', nullable: false, comment: '' })
    inAt: Date;

    @Column({ name: 'out_at', type: 'timestamp', nullable: true, comment: '' })
    outAt: Date;

    @Column({ name: 'vehicle_type', type: 'varchar', length: 50, nullable: false, comment: '' })
    vehicleType: FgWhReqVehTypeEnum;

    @Column({ name: 'vehicle_count', type: 'int', nullable: false, comment: '' })
    vehicleCount: number;

    @Column({ name: 'to_wh_code', type: 'varchar', length: 20, nullable: false, comment: 'Destination warehouse code' })
    toWhCode: string;

}
