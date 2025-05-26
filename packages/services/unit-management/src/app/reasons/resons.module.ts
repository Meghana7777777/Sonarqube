import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReasonsRepository } from './repository/reasons.repository';
import { ReasonService } from './reasons.service';
import { ReasonController } from './reasons.controller';
import { ReasonsEntity } from './entity/reasons.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        ReasonsEntity
    ])],
    controllers: [ReasonController],
    providers: [ReasonService,ReasonsRepository],
    exports: [ReasonService]
})
export class ReasonsModule { }