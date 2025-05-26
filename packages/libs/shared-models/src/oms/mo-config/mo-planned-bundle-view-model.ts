import { ProcessTypeEnum } from "../enum";

export class PlannedBundleModel {
  bundle_numbers: string[];
  product_name: string;
  fg_color: string;
  size: string;
  quantity: number;
  no_of_bundles: number;
  processTypeEnum: ProcessTypeEnum;
  mo_code: string;
  style_code: string;
  destination: string;
  delivery_date: string; 
  plan_prod_date: string; 

  constructor(
    bundle_numbers: string[],
    product_name: string,
    fg_color: string,
    size: string,
    quantity: number,
    no_of_bundles: number,
    processTypeEnum: ProcessTypeEnum,
    mo_code: string,
    style_code: string,
    destination: string,
    delivery_date: string,
    plan_prod_date: string
  ) {
    this.bundle_numbers = bundle_numbers;
    this.product_name = product_name;
    this.fg_color = fg_color;
    this.size = size;
    this.quantity = quantity;
    this.no_of_bundles = no_of_bundles;
    this.processTypeEnum = processTypeEnum;
    this.mo_code = mo_code;
    this.style_code = style_code;
    this.destination = destination;
    this.delivery_date = delivery_date;
    this.plan_prod_date = plan_prod_date;
  }
}
