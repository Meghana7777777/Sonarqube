import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FgCreationService } from './fg-creation.service';
import { FgCreationController } from './fg-creation.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        // forwardRef(()=>DispatchSetModule)
    ],
    controllers: [FgCreationController],
    providers: [
       
    ],
    exports: [FgCreationService]
})
export class FgCreationModule { }
