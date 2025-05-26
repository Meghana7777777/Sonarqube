import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FgReportingService } from './fg-reporting.service';
import { FgReportingController } from './fg-reporting.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        // forwardRef(()=>DispatchSetModule)
    ],
    controllers: [FgReportingController],
    providers: [
       
    ],
    exports: [FgReportingService]
})
export class FgReportingnModule { }
