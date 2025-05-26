import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// const { Builder, Browser, By, Capabilities, until, ChromeDriver } = require('selenium-webdriver');
// const chrome = require('selenium-webdriver/chrome')

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/app')
  getData() {
    return this.appService.getData();
  }

  @Get('/test')
  async test() {
    // const chromeOptions = new chrome.Options();
    // chromeOptions.addArguments('--ignore--certificate-errors');
    // chromeOptions.addArguments('--auto-select-certificate-for-urls=https://spl.fastretailing.com');
    // chromeOptions.addArguments('--disable-popup-blocking');
    // chromeOptions.addArguments('--disable-notifications');
    // chromeOptions.setUserPreferences({ 'profile.default_content_setting_values.notifications': 2 });
    // const driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();


    // let chromeCapabilities = Capabilities.chrome();
    // chromeCapabilities.set("goog:chromeOptions", {
    //   args: [
    //       "--lang=en",
    //       "--disable-infobars",
    //       "--disable-popup-blocking",
    //       "--ignore--certificate-errors"
    //   ]
    // });

  //   const chromeOptions = new chrome.Options();
  //   chromeOptions.addArguments('--ignore--certificate-errors');
  //   const capabilities = {
  //     browserName: 'chrome', acceptInsecureCerts: true
  //   }
  //   const driver = await new Builder().forBrowser("chrome").setChromeOptions(chromeOptions).withCapabilities(capabilities).build();
  
  //   try {
  //       await driver.get('http://localhost:4201');
  //       // await driver.get('https://sfcs-cloud-v2.live.brandixlk.org/pps/poPlanning');
  //       // Switch to the alert and accept it (click "OK")
  //       // const alert = await driver.switchTo().alert();
  //       // alert.accept();
  //       console.log(Capabilities);
  //       return "DONE";
  //   } catch (err) {
  //     return err;
  //   }
  }
}
