import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { ShiftHelperService } from './shift-helper.service';
import { ShiftEntity } from './entity/shift.entity';
import { ShiftInfoService } from './shift-info.service';
import { ShiftRepository } from './repository/shift.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ShiftEntity
        ]),
    ],
    controllers: [ShiftController],
    providers: [ShiftService, ShiftHelperService, ShiftInfoService, ShiftRepository],
    exports: [ShiftService, ShiftHelperService, ShiftInfoService]
})
export class ShiftModule { }