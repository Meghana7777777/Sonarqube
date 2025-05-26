import { message } from "antd";

export const copyToCliBoard = (text: any, alertMessage: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            message.success(alertMessage);
        })
        .catch(() => {
            message.error('Failed to copy.');
        });
}