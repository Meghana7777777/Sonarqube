import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FgBankService } from './fg-bank.service';
import { FgBankController } from './fg-bank.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        // forwardRef(()=>DispatchSetModule)
    ],
    controllers: [FgBankController],
    providers: [
       
    ],
    exports: [FgBankService]
})
export class FgBankModule { }
