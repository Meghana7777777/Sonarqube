import { Module } from "@nestjs/common";
import { FGContainerModule } from "./container/fg-container.module";
import { ItemsModule } from "./items/items.module";
import { MaterialTypeModule } from "./material-type/material-type.module";
import { PackTableModule } from "./pack-table/pack-table.module";
import { PackTypeModule } from "./pack-types/pack-type.module";
import { PackingSpecModule } from "./packing-spec/packing-spec.module";

import { RejectedReasonsModule } from "./rejected-reasons/rejected-reasons.module";
import { WareHouseModule } from "./warehouse-masters/warehouse.module";
import { FgRackModule } from "./racks/fg-rack-module";


@Module({
    imports: [
        MaterialTypeModule,
        ItemsModule,
        PackingSpecModule,
        PackTableModule,
        PackTypeModule,
        FgRackModule,
        FGContainerModule,
        WareHouseModule,
        RejectedReasonsModule
    ],
})
export class MastersModule { }