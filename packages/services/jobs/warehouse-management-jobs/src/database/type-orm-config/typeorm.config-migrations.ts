import { DataSource } from 'typeorm';
import { typeOrmConfig } from './type-orm-config';

export const dataSource = new DataSource(typeOrmConfig);
