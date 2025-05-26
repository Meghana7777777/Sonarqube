import { MessageParameters, MessageResponse } from "@xpparel/shared-models";
import axios from "axios";
import { WMSCommonAxiosService } from "../common-axios-service";

export class WhatsAppNotificationService extends WMSCommonAxiosService{
    private getURLwithMainEndPoint(childUrl: string) {
        return 'http://206.189.138.212:3232/api/bi-message' + childUrl;
    }

    async sendMessageThroughFbApi(message:MessageParameters ): Promise<MessageResponse> {
        return await axios.post(`https://graph.facebook.com/v16.0/107287678965552/messages`, {
            "messaging_product": "whatsapp",
            "to": message.recepient,
            "type": "template",
            "template": {
                "name": message.template,
                "language": {
                    "code": message.languageCode ? message.languageCode : "en_us"
                },
                "components": [
                    {
                        "type": "body",
                        "parameters": message.parameters,

                    }
                ]
            }
        }, {
            "headers": {
                'Authorization': `Bearer EAABtPfqQEJ0BAGLwjcos2nyZAaptYdOdPAoZBig7xgkZC82x10w72Fzw7xna1TAJ7YCG86ZAg9Vf083i2eSpSRBtlp4cZBZB1bvrZBEEhBNbe4GoMc6YHiHZAlivhzOkZAIv8c8bjHZAszqdZBIIGuGM9smQ6MZCZAtvbUUNKGqrlK6GWMSqFyfH3iLA0ZAPHlMfxTGYJJb41bPkbmwAZDZD`,
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            return res.data;
        }).catch(err => { return err });
    }

}