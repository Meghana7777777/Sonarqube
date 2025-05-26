import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { typeOrmAsyncConfig } from "./type-orm-config/typeorm.config";
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      ...typeOrmAsyncConfig,
      inject: [ConfigService]
    }),
  ],
})
export class DatabaseModule { }