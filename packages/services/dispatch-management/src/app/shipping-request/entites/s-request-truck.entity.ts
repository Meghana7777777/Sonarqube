import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { TruckTypeEnum } from "@xpparel/shared-models";

@Entity('s_request_truck')
export class SRequestTruckEntity extends AbstractEntity {

    // NOTE:
    // Trucks can be either assigned for a shipping request or even for a item under a shipping request
    @Column("bigint", { name: "s_request_id", nullable: false, comment: 'The pk of the s_request table' })
    sRequestId: number;

    @Column("bigint", { name: "s_request_item_id", nullable: true, comment: 'The pk of the s_request_item table' })
    sRequestItemId: number;

    @Column("varchar", { length: "15", name: "truck_no", nullable: false, comment: 'The allocated truck number against to this request' })
    truckNo: string;

    @Column("varchar", { length: "13", name: "contact", nullable: false, comment: 'The contact number of the truck' })
    contact: string;

    @Column("varchar", { name: "truck_type", length: 5, nullable: false, comment: 'type of the truck' })
    truckType: TruckTypeEnum;

    @Column("datetime", { name: "load_start_at", nullable: true, comment: 'Time at which the truck loading started' })
    loadStartAt: string;

    @Column("datetime", { name: "load_end_at", nullable: true, comment: 'Time at which the truck loading end' })
    loadEndAt: string;

    @Column("datetime", { name: "in_at", nullable: true, comment: 'Time at which the truck arrived' })
    inAt: string;

    @Column("datetime", { name: "out_At", nullable: true, comment: 'Time at which the truck departed' })
    outAt: string;

    @Column("varchar", { length: "20", name: "driver_name", nullable: false, comment: 'Driver Name' })
    driverName: string;

    @Column("varchar", { length: "20", name: "license_number", nullable: false, comment: 'License Number' })
    licenseNumber: string;
}