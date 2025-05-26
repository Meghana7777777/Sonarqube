import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbRejectionController } from './emb-rejection.controller';
import { EmbRejectionService } from './emb-rejection.service';
import { EmbRejectionHelperService } from './emb-rejection-helper.service';
import { EmbRejectionInfoService } from './emb-rejection-info.service';
import { EmbRejectionHeaderEntity } from './entity/emb-rejection-header.entity';
import { EmbRejectionLineEntity } from './entity/emb-rejection-line.entity.';
import { EmbRejectionHeaderRepository } from './repository/emb-rejection-header.repository';
import { EmbRejectionLineRepository } from './repository/emb-rejection-line.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmbRejectionHeaderEntity, EmbRejectionLineEntity
        ]),
    ],
    controllers: [EmbRejectionController],
    providers: [
        EmbRejectionService, EmbRejectionHelperService, EmbRejectionInfoService,
        EmbRejectionHeaderRepository, EmbRejectionLineRepository
    ],
    exports: [EmbRejectionService, EmbRejectionHelperService, EmbRejectionInfoService]
})
export class EmbRejectionModule { }