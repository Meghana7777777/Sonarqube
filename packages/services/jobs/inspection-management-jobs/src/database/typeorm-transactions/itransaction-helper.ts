import { Repository } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';


export interface ITransactionHelper {
    startTransaction(): void;
    completeTransaction(work: () => void): Promise<void>;
    getRepository<T>(RandomEntity: new (transactionManager: any) => T): Repository<T>;
    // getCustomRepository<T extends Repository<any>>(RandomEntity: new (transactionManager: any) => T): T;
}

export interface ITransactionManager {
    startTransaction(isolationLevel?: IsolationLevel): Promise<void>;
    getRepository<T>(entity: new () => T): Repository<T>;
    completeTransaction(): Promise<void>;
    releaseTransaction(): Promise<void>;
  }