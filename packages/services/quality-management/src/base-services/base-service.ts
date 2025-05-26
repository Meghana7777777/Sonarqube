import { LoggerService } from "../logger";

export class BaseService {
  constructor(private readonly logger: LoggerService) {}

  logMessage(message: string) {
    this.logger.log(message);
  }

  logError(message: string, error: any) {
    this.logger.error(message, error);
  }
}
