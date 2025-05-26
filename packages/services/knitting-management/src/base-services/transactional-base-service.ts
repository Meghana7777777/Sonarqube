import { Inject } from "@nestjs/common";
import { CommonResponse } from "@xpparel/shared-models";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";
import { ITransactionManager } from "../database/typeorm-transactions";
import { LoggerService } from "../logger";
import { BaseService } from "./base-service";


export class TransactionalBaseService extends BaseService {
  constructor(
    @Inject('TransactionManager')
    private readonly transactionalManager: ITransactionManager,
    logger: LoggerService
  ) {
    super(logger);
  }

  async executeWithTransaction(
    operation: (transactionManager: ITransactionManager) => Promise<CommonResponse>,
    isolationLevel?: IsolationLevel
  ): Promise<CommonResponse> {
    try {
      await this.transactionalManager.startTransaction(isolationLevel);
      this.logMessage('Transaction started');

      const result = await operation(this.transactionalManager);

      await this.transactionalManager.completeTransaction();
      this.logMessage('Transaction completed successfully');

      return result;
    } catch (error) {
      this.logError('Transaction failed, rolling back', error);
      await this.transactionalManager.releaseTransaction();
      throw error;
    } finally {
      this.logMessage('Transaction completed, releasing');
      await this.transactionalManager.releaseTransaction();
    }
  }
}
