import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SJobLineEntity } from "../s-job-line.entity";
import { BarcodeDetails, SewingJobPropsModel } from "@xpparel/shared-models";
import { ProductSubLineFeaturesEntity } from "../product-sub-line-features-entity";
import { PoSubLineEntity } from "../po-sub-line-entity";
import { SJobBundleEntity } from "../s-job-bundle.entity";
import { SJobPslEntity } from "../s-job-psl-entity";


@Injectable()
export class SJobLineRepo extends Repository<SJobLineEntity> {
  constructor(dataSource: DataSource) {
    super(SJobLineEntity, dataSource.createEntityManager());
  }

  async getBarcodeDetails(jobNo: string, unitCode: string, companyCode: string): Promise<BarcodeDetails[]> {
    const rawResults = await this.createQueryBuilder('sl')
      .select([
        "sb.id AS barcode",
        "psl.style_code AS style",
        "sl.job_number AS jobNo",
        "sb.bundle_number AS bundleNo",
        "psl.fg_color AS color",
        "psl.size AS size",
        "sb.qty AS qty",
        "psl.so_number AS soNo",
        "GROUP_CONCAT(DISTINCT psl.so_line_number) AS soLines",
        "null AS garmentPO",
        "sl.sub_process_name AS jobGroup",
        "psl.plan_prod_date AS plantProdDate",
        "GROUP_CONCAT(DISTINCT op.operation_codes) AS operationCode"
      ])
      .leftJoin(SJobBundleEntity, "sb", "sb.s_job_line_id = sl.id")
      .leftJoin(ProductSubLineFeaturesEntity, 'psl', 'psl.mo_product_sub_line_id = sb.mo_product_sub_line_id AND psl.processing_serial = sb.processing_serial AND psl.unit_code = sb.unit_code AND psl.company_code = psl.company_code')
      .leftJoin("s_job_line_operations", "op", "op.job_number = sl.job_number")
      .where("sl.job_number = :jobNo", { jobNo: jobNo })
      .andWhere("sl.unit_code = :unitCode", { unitCode: unitCode })
      .andWhere("sl.company_code = :companyCode", { companyCode: companyCode })
      .andWhere("sl.id is not null")
      .groupBy("sb.id, op.operation_group")
      .getRawMany();

    // Map raw results to BarcodeDetails instances
    const barcodeDetails = rawResults.map(result => {
      return new BarcodeDetails(
        result.bundleNo,
        result.style,
        result.jobNo,
        result.bundleNo,
        result.color,
        result.size,
        Number(result.qty),
        result.soNo,
        result.soLines ? result.soLines.split(",").map(Number) : [],
        result.operationCode,
        result.garmentPO,
        result.jobGroup,
        result.plantProdDate
      );
    });

    return barcodeDetails;
  }

  async getJobPropsByJobNumber(jobNumber: string, unitCode: string, companyCode: string): Promise<SewingJobPropsModel> {
    return await this.createQueryBuilder('sl')
      .select('GROUP_CONCAT(DISTINCT props.mo_line_number)as moLineNumbers, props.mo_number as moNumber, GROUP_CONCAT(DISTINCT props.co_number)as buyer, GROUP_CONCAT(DISTINCT props.destination)as destination, GROUP_CONCAT(DISTINCT props.delivery_date)as planProductionDate, GROUP_CONCAT(DISTINCT props.co_number)as coLine, GROUP_CONCAT(DISTINCT props.fg_color)as fgColors, GROUP_CONCAT(DISTINCT props.size)as sizes, SUM(sb.quantity)as jobQty, GROUP_CONCAT(DISTINCT style_code) as style,  GROUP_CONCAT(DISTINCT product_name) as productName')
      .leftJoin(SJobPslEntity, "sb", "sb.job_number = sl.job_number and sb.unit_code = sl.unit_code and sb.company_code = sl.company_code")
      .leftJoin(ProductSubLineFeaturesEntity, 'props', 'props.mo_product_sub_line_id = sb.mo_product_sub_line_id AND props.processing_serial = sb.processing_serial AND props.unit_code = sb.unit_code AND props.company_code = props.company_code')
      .andWhere(`sl.unit_code = '${unitCode}' AND sl.company_code = '${companyCode}' AND sl.is_active = true AND sl.job_number = '${jobNumber}'`)
      .groupBy(`sl.job_number`)
      .getRawOne();
  }
}

