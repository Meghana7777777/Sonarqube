import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { typeOrmAsyncConfig } from "./type-orm-config/type-orm-config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      ...typeOrmAsyncConfig,
      inject: [ConfigService]
    }),
  ],
})
export class DatabaseModule { }