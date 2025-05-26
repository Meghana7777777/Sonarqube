import { KC_KnitJobConfStatusEnum } from "@xpparel/shared-models"

export class ProdColorSizeConStatus {
    jobs_confirm_status: KC_KnitJobConfStatusEnum;
    quantity: number;
    product_code: string;
    size: string;
    fg_color: string;
}