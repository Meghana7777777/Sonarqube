
import { notification } from 'antd';
import { IconType, NotificationPlacement } from 'antd/es/notification/interface';
//import type { NotificationPlacement } from 'antd/lib/notification';
// This method is used to display multiple Alert messages with maximum number of 3 
notification.config({ maxCount: 3, duration: 5, placement: 'top' });
export class AlertMessages {

  static getErrorMessage = (content: string, placement:NotificationPlacement = 'topRight') => {
    // notification.destroy();
    notification.error(
      {
        message: `Error : ${content}`,
        // description: content,
        placement,
      }
    );
    return false;
  }

  static getSuccessMessage = (content: string, placement:NotificationPlacement = 'topRight') => {
    // notification.destroy();
    notification.success({
      message: `Success : ${content}`,
      // description: content,
      placement,
    });
    return false;
  }

  static getWarningMessage = (content: string, placement:NotificationPlacement = 'topRight') => {
    // notification.destroy();
    notification.warning({
      message: `Warning : ${content}`,
      // description: content,
      placement,
    });
    return false;
  }

  static getInfoMessage = (content: string, placement:NotificationPlacement = 'topRight') => {
    // notification.destroy();
    notification.info({
      message: `Inform : '${content}`,
      // description: content,
      placement,
    });
    return false;
  }

  static getCustomMessage = (icon: IconType, content: string, placement:NotificationPlacement = 'topRight') => {
    // notification.destroy();
    notification.open({
      type: icon,
      message: content,
      placement,
    });
    return false;
  }

  render() {
    return;
  }
}

export default AlertMessages;
