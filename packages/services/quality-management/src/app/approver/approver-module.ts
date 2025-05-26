import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApproverAdapter } from './adapter/approver-adapter';
import { ApproverController } from './approver-controller';
import { ApproverRepository } from './approver-repo';
import { ApproverService } from './approver-services';
import { ApproverEntity } from './entites/approver.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([ApproverEntity])],
  providers: [ApproverAdapter, ApproverRepository, ApproverService],
  controllers: [ApproverController]
})
export class ApproverModule { }
