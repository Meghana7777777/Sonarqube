import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FgBankService } from './fg-retrieving.service';
import { FgRetrievingController } from './fg-retrieving.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        // forwardRef(()=>DispatchSetModule)
    ],
    controllers: [FgRetrievingController],
    providers: [
       
    ],
    exports: [FgBankService]
})
export class FgRetrievingModule { }
