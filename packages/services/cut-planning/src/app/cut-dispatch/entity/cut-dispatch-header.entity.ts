import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutDispatchStatusEnum } from "@xpparel/shared-models";

@Entity('cut_dispatch_header')
export class CutDispatchHeaderEntity extends AbstractEntity {

    @Column("varchar", { length: 20, name: "mo_no", nullable: false, comment: 'The mo no of the supplier order' })
    moNo: string;

    // Under a Unit, an auto inc number
    @Column("varchar", { length: 20, name: "request_number", nullable: false, comment: 'The generated dispatch request number' })
    requestNumber: string;

    @Column("varchar", { length: 5, name: "request_status", nullable: false, comment: 'The dispatch request status' })
    requestStatus: CutDispatchStatusEnum;

    @Column("boolean", { name: "print_status", nullable: false, comment: 'The print status' })
    printStatus: boolean;

    @Column("varchar", { length: 5, name: "vendor_id", nullable: false, comment: 'The vendor id' })
    vendorId: number;
}

