import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// const { Builder, Browser, By, Capabilities, until, ChromeDriver } = require('selenium-webdriver');
// const chrome = require('selenium-webdriver/chrome')

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

}
