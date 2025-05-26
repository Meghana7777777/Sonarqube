import { Injectable } from '@nestjs/common';
import { GenericTransactionManager, ITransactionManager } from '../../../database/typeorm-transactions';
import { SequenceEntity } from './entities/sequence';
import { SequenceRepo } from './repositories/sequence.repo';

@Injectable()
export class SequenceHandlingService {
  constructor(private sequenceRepo: SequenceRepo) { }

  async getSequenceNumber(sequenceName: string, manager: ITransactionManager): Promise<number> {
    let currentValue = 1;
    if (manager) {
      const isRecordExists = await manager.getRepository(SequenceEntity).findOne({ where: { sequenceName } });
      if (isRecordExists) {
        currentValue += Number(isRecordExists.curValue);
        await manager.getRepository(SequenceEntity).update({ sequenceName }, { curValue: currentValue });
      } else {
        const entity = new SequenceEntity();
        entity.sequenceName = sequenceName;
        entity.curValue = currentValue;
        await manager.getRepository(SequenceEntity).save(entity);
      }
    } else {
      const isRecordExists = await this.sequenceRepo.findOne({ where: { sequenceName }, });
      if (isRecordExists) {
        currentValue += Number(isRecordExists.curValue);
        await this.sequenceRepo.update({ sequenceName }, { curValue: currentValue });
      } else {
        const entity = new SequenceEntity();
        entity.sequenceName = sequenceName;
        entity.curValue = currentValue;
        await this.sequenceRepo.save(entity);
      }
    }
    return currentValue;
  }
}
