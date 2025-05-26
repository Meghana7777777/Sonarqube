import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CutTableController } from './cut-table.controller';
import { CutTableService } from './cut-table.service';
import { CutTableRepository } from './repository/cut-table.repository';
import { CutTableEntity } from './entity/cut-table.entity';
import { CutTableHelperService } from './cut-table-helper.service';
import { DocketPlanningServices } from '@xpparel/shared-services';

@Module({
    imports: [TypeOrmModule.forFeature([
        CutTableEntity
    ])],
    controllers: [CutTableController],
    providers: [CutTableService,CutTableRepository,CutTableHelperService,DocketPlanningServices],
    exports: [CutTableService,CutTableHelperService]
})
export class CutTableModule { }