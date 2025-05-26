import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService {
    log(message: string) {
        console.log(`[LOG]: ${message}`);
    }

    error(message: string, error: any) {
        console.error(`[ERROR]: ${message}`, error);
    }
}
