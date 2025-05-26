import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ITransactionManager } from './itransaction-helper';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';


export class GenericTransactionManager implements ITransactionManager {
  constructor(private dataSource: DataSource) {}

  private queryRunner: QueryRunner;
  private transactionManager: EntityManager;

  async startTransaction(isolationLevel?: IsolationLevel) {
     // getting a connection from the connection pool;
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.startTransaction(isolationLevel || 'READ COMMITTED');
    this.transactionManager = this.queryRunner.manager;
  }

  getRepository<T>(entity: new () => T): Repository<T> {
    if (!this.transactionManager) {
      throw new Error('Transaction not started.');
    }
    return this.transactionManager.getRepository(entity);
  }

  async completeTransaction() {
    try {
      await this.queryRunner.commitTransaction();
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }

  async releaseTransaction() {
    if (this.queryRunner && this.queryRunner.isTransactionActive) {
      await this.queryRunner.rollbackTransaction();
    }
    if (this.queryRunner && !this.queryRunner.isReleased) {
      await this.queryRunner.release();
    }
  }
}
