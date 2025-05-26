import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkerTypService } from './marker-type.service';
import { MarkerTypeController } from './marker-type.controller';
import { MarkerTypeEntity } from './entity/marker-type.entity';
import { MarkerTypeRepository } from './repository/marker-type.repository';

@Module({
    imports: [TypeOrmModule.forFeature([
       MarkerTypeEntity
    ])],
    controllers: [MarkerTypeController],
    providers: [MarkerTypService, MarkerTypeRepository],
    exports: [MarkerTypService]
})
export class MarkerTypeModule { }