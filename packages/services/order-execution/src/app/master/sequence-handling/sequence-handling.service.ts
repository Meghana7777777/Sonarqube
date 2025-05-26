
import { Injectable } from "@nestjs/common";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { Sequence } from "./entity/sequence";
import { SequenceRepo } from "./repository/sequence.repo";

@Injectable()
export class SequenceHandlingService {
    constructor(private sequenceRepo: SequenceRepo) {
    }

    async getSequenceNumber(sequenceName: string, manager?: GenericTransactionManager): Promise<number> {
        let currentValue = 1;
        if (manager) {
            const isRecordExists = await manager.getRepository(Sequence).findOne({ where: { sequenceName } });
            if (isRecordExists) {
                currentValue += Number(isRecordExists.curValue);
                await manager.getRepository(Sequence).update({ sequenceName }, { curValue: currentValue })
            } else {
                const entity = new Sequence();
                entity.sequenceName = sequenceName;
                entity.curValue = currentValue;
                await manager.getRepository(Sequence).save(entity);
            }
        } else {
            const isRecordExists = await this.sequenceRepo.findOne({ where: { sequenceName } });
            if (isRecordExists) {
                currentValue += Number(isRecordExists.curValue);
                await this.sequenceRepo.update({ sequenceName }, { curValue: currentValue })
            } else {
                const entity = new Sequence();
                entity.sequenceName = sequenceName;
                entity.curValue = currentValue;
                await this.sequenceRepo.save(entity);
            }
        }
        return currentValue;
    }

}
