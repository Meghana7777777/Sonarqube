import { Injectable } from '@nestjs/common';
import { SJobHeaderRepo } from '../entities/repository/s-job-header.repository';
import { SJobSubLineRepo } from '../entities/repository/s-job-sub-line.repository';
import { CGDetails, CutDetails, CutEligibilityInfoResp, CutInfo, DeleteSewingJobsRequest, DocketBundleInfo, DocketBundleWiseCutReportInfo, DocketDetails, FeatureGroupCutDetailsResp, FeatureGroupDetails, FgColorSizeCompRequest, FgFindingOptions, GlobalResponseObject, GroupedSewingJobFeatureResult, JobDetailQueryResponse, JobLine, JobSewSerialReq, JobWithDocBundlesResp, SewingJobBarcodeInfoResp, SewingJobBatchDetails, SewingJobBatchInfoResp, SewingJobConfirmedReqInfoForActualGenFeatureGroup, SewingJobFeatureGroupReq as SewingJobFeatureGroupReq, SewingJobInfoModel, SewingJobPlanStatusEnum, SewingJobPreviewForActualGenFeatureGroup, SewingJobSummaryForSewingOrder, SewingJobSummaryForSewOrderResp, SewingOrderDetailsForGivenFeatureGroup, SewingOrderLineInfo, SewingOrderReq, SewJobGenReqForActualAndFeatureGroup, SewJobPreviewForFeatureGroupResp, SewOrderDetailForFeatureGroupResponse, SewSerialRequest, SizeQtyDetails, SubLine, TransactionIdFgNumbersReq } from '@xpparel/shared-models';
import { DocketGenerationServices } from '@xpparel/shared-services';
import { ErrorResponse } from '@xpparel/backend-utils';
import { SJobHeaderEntity } from '../entities/s-job-header.entity';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { DataSource, In } from 'typeorm';
import { SJobLineEntity } from '../entities/s-job-line.entity';
import { SJobLineOperationsEntity } from '../entities/s-job-line-operations';
import { SJobLinePlanEntity } from '../entities/s-job-line-plan';
import { SJobPreferencesRepo } from '../entities/repository/s-job-preference.repository';
import { SJobLineOperationsRepo } from '../entities/repository/s-job-line-operations';
import { SJobLinePlanRepo } from '../entities/repository/s-job-line-plan.repository';
import moment from 'moment';
const util = require('util');
@Injectable()
export class SewingJobGenerationService {

  constructor(
    private dataSource: DataSource,
    private jobHeaderRepo: SJobHeaderRepo,
    private jobBundleRepo: SJobSubLineRepo,
    private jobPreferencesRepository: SJobPreferencesRepo,
    private jobOperationsRepo: SJobLineOperationsRepo,
    private jobPlanRepo: SJobLinePlanRepo,
    private sJobSubLineRepo: SJobSubLineRepo,
    private sjobLineOperationsRepo: SJobLineOperationsRepo,
    private sJobLinePlanRepo: SJobLinePlanRepo,
    private docGenService: DocketGenerationServices
  ) {

  }

  /**
   * Service to get sewing job summary details for the given sewing order
   * @param reqModel 
   * @returns 
  */
  // async getSewingJobSummaryForSewingOrder(reqModel: SewingOrderReq): Promise<SewingJobSummaryForSewOrderResp> {
  //   const { sewingOrderId, unitCode, companyCode } = reqModel;
  //   const sewingOrderInfo = await this.sewOrderRepo.findOne({ select: ['id', 'desc', 'orderRefNo', 'sewSerial'], where: { id: sewingOrderId, unitCode, companyCode, isActive: true } });
  //   if (!sewingOrderInfo) {
  //     throw new ErrorResponse(26048, `Sewing Order details not found for the given id please check and try again Id: ${sewingOrderId}`)
  //   }
  //   const sewingOrderLineInfoObj: SewingOrderLineInfo[] = [];
  //   const sewingOrderLineInfo = await this.sewOrderLineRepo.find({ where: { sOrderId: sewingOrderInfo.id, unitCode, companyCode }, select: ['id', 'orderLineRefNo', 'productType', 'productName'] });
  //   for (const eachSewingOrderLine of sewingOrderLineInfo) {
  //     const colorSizeQtyInfo = new Map<string, Map<string, number>>();
  //     const colorSizeOrderSubInfo = new Map<string, Map<string, number[]>>();
  //     const sewingOrderSubLineInfoObj: SizeQtyDetails[] = [];
  //     const sewingOrderSubLineInfo = await this.sewOrderSubLineRepo.find({ where: { sOrderLineGroupId: eachSewingOrderLine.id, unitCode, companyCode } });
  //     for (const eachSubLine of sewingOrderSubLineInfo) {
  //       // if (!colorSizeQtyInfo.has(eachSubLine.fgColor)) {
  //       //   colorSizeQtyInfo.set(eachSubLine.fgColor, new Map<string, number>());
  //       //   colorSizeOrderSubInfo.set(eachSubLine.fgColor, new Map<string, number[]>());
  //       // }
  //       // if (!colorSizeQtyInfo.get(eachSubLine.fgColor).has(eachSubLine.size)) {
  //       //   colorSizeQtyInfo.get(eachSubLine.fgColor).set(eachSubLine.size, 0);
  //       //   colorSizeOrderSubInfo.get(eachSubLine.fgColor).set(eachSubLine.size, []);
  //       // }
  //       // const preQty = colorSizeQtyInfo.get(eachSubLine.fgColor).get(eachSubLine.size);
  //       // colorSizeQtyInfo.get(eachSubLine.fgColor).set(eachSubLine.size, preQty + eachSubLine.quantity);
  //       // colorSizeOrderSubInfo.get(eachSubLine.fgColor).get(eachSubLine.size).push(eachSubLine.id);
  //     }
  //     for (const [fgColor, sizeQtyDetails] of colorSizeQtyInfo) {
  //       for (const [size, qtyDetails] of sizeQtyDetails) {
  //         const subLineIds = colorSizeOrderSubInfo.get(fgColor).get(size);
  //         const sewGeneratedQty = null;
  //         // await this.sewFgRepo.getSewGeneratedQtyBySubLineIds(subLineIds, unitCode, companyCode);
  //         const sizeQtyObj = new SizeQtyDetails(size, qtyDetails, sewGeneratedQty, (qtyDetails - sewGeneratedQty), [], []);
  //         sewingOrderSubLineInfoObj.push(sizeQtyObj);
  //       }
  //     }
  //     const lineInfoObj = new SewingOrderLineInfo(eachSewingOrderLine.id, eachSewingOrderLine.orderLineRefNo, eachSewingOrderLine.productType, eachSewingOrderLine.productName, null, sewingOrderSubLineInfoObj);
  //     sewingOrderLineInfoObj.push(lineInfoObj);
  //   }
  //   const sewingOrderInfoObj = new SewingJobSummaryForSewingOrder(sewingOrderInfo.id, sewingOrderInfo.desc, sewingOrderInfo.orderRefNo, sewingOrderInfo.sewSerial, sewingOrderLineInfoObj);

  //   return new SewingJobSummaryForSewOrderResp(true, 26049, 'Sewing order info retrieved successfully', sewingOrderInfoObj);
  // }

  /**
   * Service to get sewing order details for the feature group
   * @param reqModel 
   * @returns 
  */
  // async getSewingOrderDetailsForFeatureGroup(reqModel: SewingJobFeatureGroupReq): Promise<SewOrderDetailForFeatureGroupResponse> {
  //   try {
  //     const { sewSerial, unitCode, companyCode, isForEntireSewingOrder } = reqModel;
  //     const sewingOrderInfo = await this.sewOrderRepo.findOne({ select: ['id', 'desc', 'orderRefNo', 'sewSerial'], where: { sewSerial: sewSerial, unitCode, companyCode, isActive: true } });
  //     if (!sewingOrderInfo) {
  //       throw new ErrorResponse(26050, `Sewing Order details not found for the given id please check and try again sewSerial: ${sewSerial}`)
  //     }
  //     const groupedOptionsInfo: GroupedSewingJobFeatureResult[] = [];
  //     // await this.sewFgRepo.getGroupedSewingJobFeatures(reqModel);
  //     const allFeatureGroupDetail: FeatureGroupDetails[] = [];
  //     const promises = groupedOptionsInfo.map(async (eachGroupOptions) => {
  //       const oslRefIds = eachGroupOptions.osl_ref_id.split(',').map(res => Number(res));
  //       const reqObj = new FgFindingOptions(reqModel.username, unitCode, companyCode, reqModel.userId, sewSerial, eachGroupOptions, true);
  //       console.log(reqObj);
  //       const eligibleBundleInfo: FeatureGroupCutDetailsResp = await this.docGenService.getEligibleDocBundleInfoForSewJobGen(reqObj);
  //       if (!eligibleBundleInfo.status) {
  //         throw new ErrorResponse(eligibleBundleInfo.errorCode, eligibleBundleInfo.internalMessage);
  //       }
  //       const eligibleBundleInfoForFeature = eligibleBundleInfo.data; // Collect the results
  //       return this.convertJobWithDocBundlesToSewingJobPreview(eligibleBundleInfoForFeature, eachGroupOptions, false);
  //     });
  //     const results = await Promise.all(promises); // Execute all promises concurrently
  //     for (const eachDocBundleInfoForFeature of results) {
  //       allFeatureGroupDetail.push(eachDocBundleInfoForFeature)
  //     }
  //     const featureGroupWiseDetail = new SewingOrderDetailsForGivenFeatureGroup(sewingOrderInfo.id, allFeatureGroupDetail);
  //     return new SewOrderDetailForFeatureGroupResponse(true, 26051, 'Feature Group Details Retrieved successfully', featureGroupWiseDetail);
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  /**
   * Service to get sewing job preview for actual for a feature group
   * @param reqModel 
   * @returns 
  */
  // async getSewingJobPreviewForActualGenFeatureGroup(reqModel: SewJobGenReqForActualAndFeatureGroup): Promise<SewJobPreviewForFeatureGroupResp> {
  //   const { sewingOrderId, unitCode, companyCode } = reqModel;
  //   const sewingOrderInfo = await this.sewOrderRepo.findOne({ select: ['id', 'desc', 'orderRefNo', 'sewSerial'], where: { id: sewingOrderId, unitCode, companyCode, isActive: true } });
  //   if (!sewingOrderInfo) {
  //     throw new ErrorResponse(26052, `Sewing Order details not found for the given id please check and try again sewSerial: ${sewingOrderId}`);
  //   }
  //   if (reqModel.sewingJobQty < reqModel.logicalBundleQty) {
  //     throw new ErrorResponse(26053, 'Sewing job quantity should be more than logical bundle qty')
  //   }
  //   const sewSerial = sewingOrderInfo.sewSerial;
  //   const reqObj = new FgFindingOptions(reqModel.username, unitCode, companyCode, reqModel.userId, sewSerial, reqModel.groupInfo, true);
  //   const eligibleBundleInfo: FeatureGroupCutDetailsResp = await this.docGenService.getEligibleDocBundleInfoForSewJobGen(reqObj);
  //   if (!eligibleBundleInfo.status) {
  //     throw new ErrorResponse(eligibleBundleInfo.errorCode, eligibleBundleInfo.internalMessage);
  //   }
  //   const minBundleHight = eligibleBundleInfo.data[0].qty;
  //   if (reqModel.sewingJobQty < minBundleHight) {
  //     throw new ErrorResponse(26054, 'Sewing job qty should be min of bundle height : ' + minBundleHight)
  //   }
  //   const eligibleBundleInfoForFeature: DocketBundleWiseCutReportInfo[] = eligibleBundleInfo.data;
  //   const cutRelatedFgNumbers = new Map<number, number[]>();
  //   for (const fgInfo of eligibleBundleInfoForFeature) {
  //     if (!cutRelatedFgNumbers.has(fgInfo.poSerial)) {
  //       cutRelatedFgNumbers.set(fgInfo.poSerial, [])
  //     }
  //     for (const eachFg of fgInfo.cutFgNumbers.split(',')) {
  //       cutRelatedFgNumbers.get(fgInfo.poSerial).push(Number(eachFg));
  //     }
  //   }
  //   const mainCgBundles = eligibleBundleInfoForFeature.filter(bun => bun.mainDocket == true);
  //   const possibleSewJobInfo = this.generateJobs(mainCgBundles, reqModel.sewingJobQty, reqModel.multiColor, reqModel.multiSize, reqModel.groupInfo);
  //   const sewJobPreview = new SewingJobPreviewForActualGenFeatureGroup(reqModel.sewingOrderId, reqModel.groupInfo, possibleSewJobInfo, reqModel.sewingJobQty, reqModel.logicalBundleQty);
  //   await this.lockAndPreviewSewingJobInfo(reqModel, sewSerial, cutRelatedFgNumbers);
  //   return new SewJobPreviewForFeatureGroupResp(true, 26055, 'Sewing Job Preview Details Retrieved Successfully', sewJobPreview)
  // }


  /**
   * Service to generate sewing jobs for the given bundle info with other info job qty, multi color, multi size
   * @param bundleInfo 
   * @param jobQty 
   * @param multiColor 
   * @param multiSize 
   * @param groupInfo 
   * @returns 
  */
  generateJobs(bundleInfo: DocketBundleWiseCutReportInfo[], jobQty: number, multiColor: boolean, multiSize: boolean, groupInfo: GroupedSewingJobFeatureResult): SewingJobInfoModel[] {
    const jobs: JobWithDocBundlesResp[] = [];
    let currentJob = [];
    let currentQty = 0;
    const sewingJobPreviewDetails: SewingJobInfoModel[] = []
    // Group bundles based on the flags multiColor and multiSize
    for (const bundle of bundleInfo) {
      let groupKey = '';

      // Multi Color Multi Size -> No strict grouping, just add the bundle to the current job
      if (multiColor && multiSize) {
        // We just add bundles to the current job if it fits within the job quantity
        if (currentQty + bundle.qty <= jobQty) {
          currentJob.push(bundle);
          currentQty += bundle.qty;
        } else {
          // If the job exceeds the limit, push the current job and start a new one
          jobs.push({
            jobNumber: `SJ-${jobs.length + 1}`,
            docBundles: currentJob,
          });
          currentJob = [bundle];
          currentQty = bundle.qty;
        }
      } else if (!multiColor && multiSize) {
        // Single Color Multi Size -> Group by color only
        groupKey = bundle.color;
        // Process bundles grouped by color
        if (!currentJob.length || currentJob[0].color === bundle.color) {
          if (currentQty + bundle.qty <= jobQty) {
            currentJob.push(bundle);
            currentQty += bundle.qty;
          } else {
            jobs.push({
              jobNumber: `SJ-${jobs.length + 1}`,
              docBundles: currentJob,
            });
            currentJob = [bundle];
            currentQty = bundle.qty;
          }
        } else {
          // If color doesn't match, push the current job and start a new one
          jobs.push({
            jobNumber: `SJ-${jobs.length + 1}`,
            docBundles: currentJob,
          });
          currentJob = [bundle];
          currentQty = bundle.qty;
        }
      } else if (multiColor && !multiSize) {
        // Multi Color Single Size -> Group by size only
        groupKey = bundle.size;

        // Process docBundles grouped by size
        if (!currentJob.length || currentJob[0].size === bundle.size) {
          if (currentQty + bundle.qty <= jobQty) {
            currentJob.push(bundle);
            currentQty += bundle.qty;
          } else {
            jobs.push({
              jobNumber: `SJ-${jobs.length + 1}`,
              docBundles: currentJob,
            });
            currentJob = [bundle];
            currentQty = bundle.qty;
          }
        } else {
          // If size doesn't match, push the current job and start a new one
          jobs.push({
            jobNumber: `SJ-${jobs.length + 1}`,
            docBundles: currentJob,
          });
          currentJob = [bundle];
          currentQty = bundle.qty;
        }
      } else {
        // Single Color Single Size -> Group by both color and size
        groupKey = `${bundle.color}-${bundle.size}`;

        // Process docBundles grouped by color and size
        if (!currentJob.length || currentJob[0].color === bundle.color && currentJob[0].size === bundle.size) {
          if (currentQty + bundle.qty <= jobQty) {
            currentJob.push(bundle);
            currentQty += bundle.qty;
          } else {
            jobs.push({
              jobNumber: `SJ-${jobs.length + 1}`,
              docBundles: currentJob,
            });
            currentJob = [bundle];
            currentQty = bundle.qty;
          }
        } else {
          // If color and size don't match, push the current job and start a new one
          jobs.push({
            jobNumber: `SJ-${jobs.length + 1}`,
            docBundles: currentJob,
          });
          currentJob = [bundle];
          currentQty = bundle.qty;
        }
      }
    }
    // After processing all docBundles, add any remaining docBundles to a new job
    if (currentJob.length > 0) {
      jobs.push({
        jobNumber: `SJ-${jobs.length + 1}`,
        docBundles: currentJob,
      });
    }
    for (const eachJob of jobs) {
      const featureGroupDetails = this.convertJobWithDocBundlesToSewingJobPreview(eachJob.docBundles, groupInfo, true);
      const cutNumber = [];
      const poSerial = [];
      featureGroupDetails.cutInfo.forEach((cutDetail) => {
        {
          poSerial.push(cutDetail.cutSerial);
          cutDetail.cutDetails.forEach((cut) => {
            cutNumber.push(cut.cutNumber);
          })
        }
      })
      const jobPreviewObj = new SewingJobInfoModel(eachJob.jobNumber, featureGroupDetails, cutNumber.toString(), poSerial.toString());
      sewingJobPreviewDetails.push(jobPreviewObj);
    }
    return sewingJobPreviewDetails;
  }

  /**
   * Service to convert sewing job details to preview model
   * @param docBundles 
   * @param groupInfo 
   * @returns 
  */
  convertJobWithDocBundlesToSewingJobPreview(docBundles: DocketBundleWiseCutReportInfo[], groupInfo: GroupedSewingJobFeatureResult, forActGen: boolean): FeatureGroupDetails {
    const sewingJobInfo: { sewingJobNumber: string, featureGroupDetails: FeatureGroupDetails[] } = null;
    // cut serial -> cut -> cg -> doc -> doc bundle
    const jobDetailsMap = new Map<number, Map<number, Map<string, Map<string, DocketBundleWiseCutReportInfo[]>>>>();
    for (const eachBundle of docBundles) {
      if (!jobDetailsMap.has(eachBundle.poSerial)) {
        jobDetailsMap.set(eachBundle.poSerial, new Map<number, Map<string, Map<string, DocketBundleWiseCutReportInfo[]>>>())
      }
      if (!jobDetailsMap.get(eachBundle.poSerial).has(eachBundle.cutNumber)) {
        jobDetailsMap.get(eachBundle.poSerial).set(eachBundle.cutNumber, new Map<string, Map<string, DocketBundleWiseCutReportInfo[]>>())
      }
      if (!jobDetailsMap.get(eachBundle.poSerial).get(eachBundle.cutNumber).has(eachBundle.cgName)) {
        jobDetailsMap.get(eachBundle.poSerial).get(eachBundle.cutNumber).set(eachBundle.cgName, new Map<string, DocketBundleWiseCutReportInfo[]>())
      }
      if (!jobDetailsMap.get(eachBundle.poSerial).get(eachBundle.cutNumber).get(eachBundle.cgName).has(eachBundle.docketNumber)) {
        jobDetailsMap.get(eachBundle.poSerial).get(eachBundle.cutNumber).get(eachBundle.cgName).set(eachBundle.docketNumber, []);
      }
      jobDetailsMap.get(eachBundle.poSerial).get(eachBundle.cutNumber).get(eachBundle.cgName).get(eachBundle.docketNumber).push(eachBundle);
    }
    const sewJobCutInfo: CutInfo[] = [];
    for (const [cutSerial, cutSerialInfo] of jobDetailsMap) {
      const jobCutInfo = new CutInfo(groupInfo, cutSerial, []);
      const sewJobCutDetail: CutDetails[] = [];
      for (const [cut, cutInfo] of cutSerialInfo) {
        const cutDetailInfo = docBundles.find(bun => bun.cutNumber == cut);
        const jobCutDetail = new CutDetails(cut, [], cutDetailInfo.productName, cutDetailInfo.productType, cutDetailInfo.moLine, cutDetailInfo.deliveryDate, cutDetailInfo.destination, cutDetailInfo.planProductionDate, cutDetailInfo.planCutDate);
        const sewJobCgInfo: CGDetails[] = []
        for (const [cg, cgInfo] of cutInfo) {
          const jobCgDetail = new CGDetails(cg, false, []);
          const sewJobDocDetail: DocketDetails[] = []
          for (const [doc, docBundleInfo] of cgInfo) {
            const docInfo = docBundles.find(bun => bun.docketNumber == doc);
            if (docInfo.mainDocket) {
              jobCgDetail.isMainCg = true;
            }
            const jobDocDetail = new DocketDetails(doc, docInfo.color, [], []);
            const sewJobDocColorSizeDetail: SizeQtyDetails[] = [];
            const sewJobDocDocBundleDetail: DocketBundleInfo[] = [];
            const sizeQtyMap = new Map<string, number>();
            const sizeQtySewGenQty = new Map<string, number>();
            for (const eachBundle of docBundleInfo) {
              if (!sizeQtyMap.has(eachBundle.size)) {
                sizeQtyMap.set(eachBundle.size, 0)
                sizeQtySewGenQty.set(eachBundle.size, 0)
              }
              const preQty = sizeQtyMap.get(eachBundle.size);
              const preGenQty = sizeQtySewGenQty.get(eachBundle.size);
              sizeQtyMap.set(eachBundle.size, preQty + eachBundle.qty);
              sizeQtySewGenQty.set(eachBundle.size, preGenQty + (forActGen ? (eachBundle.qty - eachBundle.sewGeneratedQty) : eachBundle.sewGeneratedQty));
              // console.log(eachBundle);
              // console.log(eachBundle.cutFgNumbers);
              const cutFgNums = eachBundle.cutFgNumbers.split(',').map(fg => Number(fg));
              const jobBundleObj = new DocketBundleInfo(eachBundle.bundleNumber, new SizeQtyDetails(eachBundle.size, eachBundle.qty, forActGen ? (eachBundle.qty - eachBundle.sewGeneratedQty) : eachBundle.sewGeneratedQty, forActGen ? 0 : (eachBundle.qty - eachBundle.sewGeneratedQty), cutFgNums, []));
              sewJobDocDocBundleDetail.push(jobBundleObj);
            }
            for (const [size, qty] of sizeQtyMap) {
              const sewGenQty = sizeQtySewGenQty.get(size);
              sewJobDocColorSizeDetail.push(new SizeQtyDetails(size, qty, sewGenQty, forActGen ? 0 : (qty - sewGenQty), [], []))
            }
            jobDocDetail.sizeQtyDetails = sewJobDocColorSizeDetail;
            jobDocDetail.docketBundleInfo = sewJobDocDocBundleDetail;
            sewJobDocDetail.push(jobDocDetail);
          }
          jobCgDetail.docketDetails = sewJobDocDetail;
          sewJobCgInfo.push(jobCgDetail);
        }
        jobCutDetail.cgDetails = sewJobCgInfo
        sewJobCutDetail.push(jobCutDetail);
      }
      jobCutInfo.cutDetails = sewJobCutDetail;
      sewJobCutInfo.push(jobCutInfo);
    }
    console.log(sewJobCutInfo);
    return new FeatureGroupDetails(groupInfo, sewJobCutInfo)

  }

  /**
   * Service to save sewing job information by given confirmation result
   * @param reqModel 
   * @returns 
  */
  async confirmAndSubmitSewingJob(reqModel: SewingJobConfirmedReqInfoForActualGenFeatureGroup): Promise<GlobalResponseObject> {
    // const transManager = new GenericTransactionManager(this.dataSource);
    // try {
    //   const { sewingOrderId, unitCode, companyCode, logicalBundleQty, userId, username } = reqModel;
    //   const sewingOrderInfo = await this.sewOrderRepo.findOne({ select: ['id', 'desc', 'orderRefNo', 'sewSerial'], where: { id: sewingOrderId, unitCode, companyCode, isActive: true } });
    //   if (!sewingOrderInfo) {
    //     throw new ErrorResponse(26052, `Sewing Order details not found for the given id please check and try again sewSerial: ${sewingOrderId}`);
    //   }
    //   const sewSerial = sewingOrderInfo.sewSerial;
    //   //TODO: need to get last header no for sew serial and add
    //   //TODO: need to get the job groups info for the sew order serial, product type and product name 
    //   const sewSerialReq = new SewSerialRequest(username, unitCode, companyCode, userId, sewSerial, sewingOrderId, false, false);
    //   const sewSerialOpsInfoResp: JobGroupVersionInfoResp = await this.sewOpsInfo.getJobGroupVersionInfo(sewSerialReq);
    //   if (!sewSerialOpsInfoResp.status || !sewSerialOpsInfoResp.data.length) {
    //     throw new ErrorResponse(sewSerialOpsInfoResp.errorCode, sewSerialOpsInfoResp.internalMessage)
    //   }
    //   const sewSerialOpsInfo = sewSerialOpsInfoResp.data[0];
    //   let jobHeaderStartNo = 1;
    //   // Logic to assign cut fg numbers to sewing fg numbers for docket bundles
    //   // get the sew fg number for the given feature group
    //   const eligibleFgNumbersInfo: EligibleFgNumbersForSewJob[] = await this.sewFgRepo.getFgNumbersGroupedEligibleForSewJob(reqModel.groupInfo, unitCode, companyCode, sewSerial);

    //   // PRODUCT -> FG_COLOR, SIZE -> FG NUMS
    //   const utilizedFgNumbers = new Map<string, Map<string, Map<string, number[]>>>();
    //   console.log('****************')
    //   // product name -> color -> size -> fgNumbers[]
    //   const sewJobToProductColorSizeFgNumberMap = new Map<string, Map<string, Map<string, number[]>>>();
    //   for (const eachDetail of eligibleFgNumbersInfo) {
    //     if (!sewJobToProductColorSizeFgNumberMap.has(eachDetail.productName)) {
    //       sewJobToProductColorSizeFgNumberMap.set(eachDetail.productName, new Map<string, Map<string, number[]>>());
    //       utilizedFgNumbers.set(eachDetail.productName, new Map<string, Map<string, number[]>>());
    //     }
    //     if (!sewJobToProductColorSizeFgNumberMap.get(eachDetail.productName).has(eachDetail.fgColor)) {
    //       sewJobToProductColorSizeFgNumberMap.get(eachDetail.productName).set(eachDetail.fgColor, new Map<string, number[]>());
    //       utilizedFgNumbers.get(eachDetail.productName).set(eachDetail.fgColor, new Map<string, number[]>());
    //     }
    //     if (!sewJobToProductColorSizeFgNumberMap.get(eachDetail.productName).get(eachDetail.fgColor).has(eachDetail.size)) {
    //       sewJobToProductColorSizeFgNumberMap.get(eachDetail.productName).get(eachDetail.fgColor).set(eachDetail.size, []);
    //       utilizedFgNumbers.get(eachDetail.productName).get(eachDetail.fgColor).set(eachDetail.size, []);
    //     }
    //     sewJobToProductColorSizeFgNumberMap.get(eachDetail.productName).get(eachDetail.fgColor).get(eachDetail.size).push(...eachDetail.sewFgNumbers)
    //   }
    //   console.log(util.inspect(sewJobToProductColorSizeFgNumberMap, false, null, true));
    //   console.log('+++++++++++++++++')
    //   console.log('1')
    //   const allBundles: DocketBundleInfo[] = [];
    //   for (const sewJobInfo of reqModel.sewingJobInfo) {
    //     for (const cutInfo of sewJobInfo.featureGroupDetails.cutInfo) {
    //       for (const cgInfo of cutInfo.cutDetails) {
    //         for (const cgDetail of cgInfo.cgDetails) {
    //           for (const docInfo of cgDetail.docketDetails) {
    //             for (const bundleInfo of docInfo.docketBundleInfo) {
    //               const bundleSewJobFgs: number[] = [];
    //               const sizeQty = bundleInfo.sizeQtyDetails;
    //               console.log(cgInfo.productName + '-' + docInfo.color + '-' + sizeQty.size);
    //               const eligibleFgs = sewJobToProductColorSizeFgNumberMap?.get(cgInfo.productName)?.get(docInfo.color)?.get(sizeQty.size);
    //               if (!eligibleFgs.length) {
    //                 throw new ErrorResponse(0, `Eligible Fgs not found fot the given group in SPS ${cgInfo.productName} ${docInfo.color} ${sizeQty.size} ${sizeQty.sewGeneratedQty}`);
    //               }
    //               if (eligibleFgs.length < sizeQty.sewGeneratedQty) {
    //                 throw new ErrorResponse(0, `No Sufficient Fgs (${eligibleFgs.length}) not found fot the given group in SPS ${cgInfo.productName} ${docInfo.color} ${sizeQty.size} ${sizeQty.sewGeneratedQty} `);
    //               };
    //               const eligibleFgNumbers = eligibleFgs;
    //               let sewGenQty = sizeQty.sewGeneratedQty;
    //               while (sewGenQty--) {
    //                 bundleSewJobFgs.push(eligibleFgNumbers[0])
    //                 eligibleFgNumbers.shift();
    //               }
    //               sizeQty.sewFgNumber = bundleSewJobFgs;
    //               allBundles.push(bundleInfo);
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   console.log('2')
    //   await transManager.startTransaction();
    //   const jobPreferObj = new SJobPreferences();
    //   jobPreferObj.companyCode = companyCode;
    //   jobPreferObj.createdUser = reqModel.username;
    //   jobPreferObj.groupInfo = JSON.stringify(reqModel.groupInfo);
    //   jobPreferObj.logicalBundleQty = reqModel.logicalBundleQty;
    //   jobPreferObj.multiColor = reqModel.multiColor;
    //   jobPreferObj.multiSize = reqModel.multiSize;
    //   jobPreferObj.sOrderId = reqModel.sewingOrderId;
    //   jobPreferObj.sewSerial = sewSerial;
    //   jobPreferObj.unitCode = reqModel.unitCode;
    //   jobPreferObj.companyCode = reqModel.companyCode;
    //   jobPreferObj.sewingJobQty = reqModel.sewingJobQty;
    //   const jobPrefEntity = await transManager.getRepository(SJobPreferences).save(jobPreferObj);
    //   for (const eachSewJob of reqModel.sewingJobInfo) {
    //     let originalQty = 0;
    //     const planProdDate = new Set<string>();
    //     eachSewJob.featureGroupDetails.cutInfo.forEach((cutDetail) => {
    //       cutDetail.cutDetails.forEach((cut) => {
    //         planProdDate.add(cut.planProductionDate);
    //         cut.cgDetails.forEach((cg) => {
    //           cg.docketDetails.forEach((doc) => {
    //             doc.docketBundleInfo.forEach((docBun) => {
    //               originalQty += docBun.sizeQtyDetails.sewGeneratedQty;
    //             })

    //           })
    //         })
    //       })
    //     });
    //     // Job bundle detail saving part
    //     // Splitting logical bundles and assigning Fgs to bundles
    //     // Its same for all the job groups
    //     const logicalBundles: SJobSubLineEntity[] = [];
    //     const bundleWiseFgInfo = new Map<string, SJobFgEntity[]>();
    //     eachSewJob.featureGroupDetails.cutInfo.forEach((cutDetail) => {
    //       cutDetail.cutDetails.forEach((cut) => {
    //         planProdDate.add(cut.planProductionDate);
    //         cut.cgDetails.forEach((cg) => {
    //           cg.docketDetails.forEach((doc) => {
    //             doc.docketBundleInfo.forEach((docBundleInfo: DocketBundleInfo) => {
    //               let remainingQty = docBundleInfo.sizeQtyDetails.sewGeneratedQty;
    //               let subBundleNumber = 1;
    //               while (remainingQty > 0) {
    //                 const splitQty = Math.min(logicalBundleQty, remainingQty);
    //                 // Need to construct the logical bundles here
    //                 const docBunRef = `${cut.cutNumber}-${doc.docketNumber}-${docBundleInfo.bundleNumber}-${subBundleNumber}`;
    //                 const jobSubLineObj = new SJobSubLineEntity();
    //                 jobSubLineObj.companyCode = companyCode;
    //                 jobSubLineObj.color = doc.color;
    //                 jobSubLineObj.createdUser = reqModel.username;
    //                 jobSubLineObj.qty = splitQty;
    //                 jobSubLineObj.sJobLineId = null;
    //                 jobSubLineObj.size = docBundleInfo.sizeQtyDetails.size;
    //                 jobSubLineObj.unitCode = unitCode;
    //                 jobSubLineObj.productName = cut.productName;
    //                 jobSubLineObj.productType = cut.productType;
    //                 jobSubLineObj.bundleNumber = docBunRef;
    //                 remainingQty -= splitQty;
    //                 subBundleNumber++;
    //                 logicalBundles.push(jobSubLineObj);
    //                 for (let i = 0; i < splitQty; i++) {
    //                   const sFgObj = new SJobFgEntity();
    //                   sFgObj.bundleNo = jobSubLineObj.bundleNumber;
    //                   sFgObj.cartonNo = null;
    //                   sFgObj.companyCode = companyCode;
    //                   sFgObj.createdUser = reqModel.username;
    //                   sFgObj.cutBundleRef = docBunRef;
    //                   sFgObj.cutFgNumber = docBundleInfo.sizeQtyDetails.cutFgNumbers[0];
    //                   docBundleInfo.sizeQtyDetails.cutFgNumbers.shift();
    //                   sFgObj.cutJobRef = cut.cutNumber.toString();
    //                   sFgObj.jobNo = null;
    //                   sFgObj.poSerial = cutDetail.cutSerial;
    //                   sFgObj.sJobSubLineId = null;
    //                   sFgObj.sewFgNumber = docBundleInfo.sizeQtyDetails.sewFgNumber[0];
    //                   utilizedFgNumbers.get(cut.productName).get(doc.color).get(docBundleInfo.sizeQtyDetails.size).push(docBundleInfo.sizeQtyDetails.sewFgNumber[0]);
    //                   docBundleInfo.sizeQtyDetails.sewFgNumber.shift();
    //                   sFgObj.sewSerial = sewSerial;
    //                   sFgObj.trackingEntityType = TrackingEntityEnum.ACTUAL;
    //                   sFgObj.unitCode = unitCode;
    //                   sFgObj.productName = cut.productName;
    //                   sFgObj.fgColor = doc.color;
    //                   sFgObj.size = docBundleInfo.sizeQtyDetails.size;
    //                   if (!bundleWiseFgInfo.has(docBunRef)) {
    //                     bundleWiseFgInfo.set(docBunRef, []);
    //                   }
    //                   bundleWiseFgInfo.get(docBunRef).push(sFgObj);
    //                 }
    //               }
    //             })
    //           })
    //         })
    //       })
    //     });
    //     console.log('3')
    //     const jobHeaderInfo = new SJobHeaderEntity();
    //     jobHeaderInfo.companyCode = companyCode;
    //     jobHeaderInfo.createdUser = reqModel.username;
    //     jobHeaderInfo.jobHeaderNo = jobHeaderStartNo++;
    //     jobHeaderInfo.refId = `${eachSewJob.cutSerial}-${eachSewJob.cutNumber}`;
    //     jobHeaderInfo.refType = SewJoGenRefTypeEnum.CUT;
    //     jobHeaderInfo.sOrderId = sewingOrderId;
    //     jobHeaderInfo.sewSerial = sewSerial;
    //     jobHeaderInfo.unitCode = unitCode;
    //     jobHeaderInfo.jobPrefId = jobPrefEntity.id;
    //     const jobHeaderEntity = await transManager.getRepository(SJobHeaderEntity).save(jobHeaderInfo);
    //     // generating sewing jobs
    //     let jobQty = 0;
    //     for (const eachJobGroup of sewSerialOpsInfo.jobGroupInfo) {
    //       console.log('4')
    //       const sewingJobNumber = `SJ-${jobHeaderEntity.id}-${eachJobGroup.jobGroupId}`;
    //       const jobLineObj = new SJobLineEntity();
    //       jobLineObj.companyCode = companyCode;
    //       jobLineObj.createdUser = reqModel.username;
    //       jobLineObj.groupNo = eachJobGroup.jobGroupId;
    //       jobLineObj.jobNo = sewingJobNumber;
    //       // jobLineObj.jobType = eachJobGroup.jobGroupType;
    //       jobLineObj.planProductionDate = Array.from(planProdDate).toString();
    //       jobLineObj.sJobHeaderId = jobHeaderEntity.id;
    //       jobLineObj.unitCode = unitCode;
    //       jobLineObj.sewSerial = sewSerial;
    //       const jobGroupEntity = await transManager.getRepository(SJobLineEntity).save(jobLineObj);
    //       const jobPlanObj = new SJobLinePlanEntity();
    //       jobPlanObj.companyCode = companyCode;
    //       jobPlanObj.createdUser = reqModel.username;
    //       jobPlanObj.jobNo = sewingJobNumber;
    //       jobPlanObj.moduleNo = null;
    //       jobPlanObj.status = SewingJobPlanStatusEnum.OPEN;
    //       jobPlanObj.planInputDate = null;
    //       jobPlanObj.rawMaterialStatus = TrimStatusEnum.OPEN;
    //       jobPlanObj.sJobLineId = jobGroupEntity.id;
    //       jobPlanObj.unitCode = unitCode;
    //       jobPlanObj.companyCode = companyCode;
    //       jobPlanObj.sewSerial = sewSerial;
    //       jobPlanObj.smv = eachJobGroup.operations.reduce((acc, curr) => {
    //         return acc + curr.smv;
    //       }, 0);
    //       let logicalBundleNo = 1;
    //       console.log('job number ' + sewingJobNumber);
    //       await transManager.getRepository(SJobLinePlanEntity).save(jobPlanObj);
    //       // Need to assign fgs to each docket bundle
    //       for (const eachLogicalBundle of logicalBundles) {
    //         const bundleRef = eachLogicalBundle.bundleNumber;
    //         const clonedLogicalBundle: SJobSubLineEntity = JSON.parse(JSON.stringify(eachLogicalBundle));
    //         clonedLogicalBundle.sJobLineId = jobGroupEntity.id;
    //         clonedLogicalBundle.sewSerial = sewSerial;
    //         clonedLogicalBundle.bundleNumber = `LB-${jobHeaderEntity.id}-${logicalBundleNo++}`;
    //         jobQty += clonedLogicalBundle.qty;
    //         const jobSubLineEntity = await transManager.getRepository(SJobSubLineEntity).save(clonedLogicalBundle);
    //         const jobFgEntities: SJobFgEntity[] = [];
    //         for (const eachFg of bundleWiseFgInfo.get(bundleRef)) {
    //           const fgClone = JSON.parse(JSON.stringify(eachFg));
    //           fgClone.jobNo = sewingJobNumber;
    //           fgClone.sJobSubLineId = jobSubLineEntity.id;
    //           fgClone.cutBundleRef
    //           jobFgEntities.push(fgClone);
    //         }
    //         await transManager.getRepository(SJobFgEntity).save(jobFgEntities);
    //       }
    //       console.log('job Qty ' + jobQty);
    //       // job operations
    //       let opsSeq = 1;
    //       for (const eachOperation of eachJobGroup.operations) {
    //         const jobLineOps = new SJobLineOperationsEntity();
    //         jobLineOps.companyCode = companyCode;
    //         jobLineOps.inputQty = originalQty;
    //         jobLineOps.jobNo = sewingJobNumber;
    //         jobLineOps.operationCode = eachOperation.operationCode;
    //         jobLineOps.originalQty = originalQty;
    //         jobLineOps.sJobLineId = String(jobGroupEntity.id);
    //         jobLineOps.unitCode = unitCode;
    //         jobLineOps.smv = eachOperation.smv;
    //         jobLineOps.goodQty = 0;
    //         jobLineOps.rejectionQty = 0;
    //         jobLineOps.openRejections = 0;
    //         jobLineOps.operationSequence = opsSeq++;
    //         jobLineOps.sewSerial = sewSerial;
    //         const jobOperationEntity = await transManager.getRepository(SJobLineOperationsEntity).save(jobLineOps);
    //       }
    //       // job materials
    //       for (const eachMaterialInfo of eachJobGroup.materialInfo) {
    //         const jobMaterialObj = new SJobTrimGroupsEntity();
    //         jobMaterialObj.companyCode = companyCode;
    //         jobMaterialObj.createdUser = reqModel.username;
    //         jobMaterialObj.jobNo = sewingJobNumber;
    //         jobMaterialObj.sJobLineId = jobGroupEntity.id;
    //         jobMaterialObj.unitCode = unitCode;
    //         jobMaterialObj.trimGroup = eachMaterialInfo.trimGroup;
    //         jobMaterialObj.status = TrimStatusEnum.OPEN;
    //         jobMaterialObj.sewSerial = sewSerial;
    //         const trimGroupEntity = await transManager.getRepository(SJobTrimGroupsEntity).save(jobMaterialObj);
    //         for (const eachMaterial of eachMaterialInfo.trimGroupInfo) {
    //           const jobMaterialItemObj = new SJobTrimItemsEntity();
    //           jobMaterialItemObj.companyCode = companyCode;
    //           jobMaterialItemObj.createdUser = reqModel.username;
    //           jobMaterialItemObj.jobNo = sewingJobNumber;
    //           jobMaterialItemObj.sJobTrimGroupId = trimGroupEntity.id;
    //           jobMaterialItemObj.trimGroup = eachMaterialInfo.trimGroup;
    //           jobMaterialItemObj.unitCode = unitCode;
    //           jobMaterialItemObj.itemCode = eachMaterial.itemCode;
    //           jobMaterialItemObj.consumption = eachMaterial.consumption;
    //           jobMaterialItemObj.status = TrimStatusEnum.OPEN;
    //           jobMaterialItemObj.uom = eachMaterial.uom;
    //           jobMaterialItemObj.sJobLineId = jobGroupEntity.id;
    //           jobMaterialItemObj.sewSerial = sewSerial;
    //           jobMaterialItemObj.totalQuantity = eachMaterial.consumption * originalQty;
    //           jobMaterialItemObj.issuedQuantity = 0; ``
    //           const trimEntity = await transManager.getRepository(SJobTrimItemsEntity).save(jobMaterialItemObj);
    //         }
    //       }
    //     }
    //   }
    //   for (const [prodName, prodFgDetail] of utilizedFgNumbers) {
    //     for (const [color, colorInfo] of prodFgDetail) {
    //       for (const [size, fgInfo] of colorInfo) {
    //         // await transManager.getRepository(SewFinishedGood).update({ sewSerial: sewSerial, unitCode, companyCode, productName: prodName, fgColor: color, size, sewFgNumber: In(fgInfo) }, { sewJobFillStatus: true });
    //       }
    //     }
    //   }
    //   console.log('6')
    //   await transManager.completeTransaction();
    //   return new GlobalResponseObject(true, 0, 'Sewing jobs saved sucssfully');
    // } catch (err) {
    //   await transManager.releaseTransaction();
    //   throw err;
    // }
    return null;
  }

  // async deleteSewingJobs(req: DeleteSewingJobsRequest): Promise<GlobalResponseObject> {
  //   const transManager = new GenericTransactionManager(this.dataSource);
  //   const checkSJobPreference = await this.jobPreferencesRepository.findOne({ where: { id: req.jobPreferenceId, companyCode: req.companyCode, unitCode: req.unitCode } });
  //   if (!checkSJobPreference) {
  //     throw new ErrorResponse(26056, 'No sewing jobs found');
  //   }
  //   const getSJobHeaderIds = (await this.jobHeaderRepo.find({ where: { jobPrefId: checkSJobPreference.id }, select: ['id'] }))?.map(eachId => eachId.id);;
  //   const getSJobLineIds = (await this.jobGroupRepo.find({ where: { sJobHeaderId: In(getSJobHeaderIds) }, select: ['id'] }))?.map(eachId => eachId.id);
  //   const getInprogressJobs = (await this.sJobLinePlanRepo.find({ where: { sJobLineId: In(getSJobLineIds), status: In([SewingJobPlanStatusEnum.IN_PROGRESS, SewingJobPlanStatusEnum.COMPLETED]) }, select: ['id'] }))?.map(eachId => eachId.id)
  //   if (getInprogressJobs.length) {
  //     throw new ErrorResponse(26057, 'sewing jobs already planned');
  //   }
  //   const getSJobSubLineIds = (await this.sJobSubLineRepo.find({ where: { sJobLineId: In(getSJobLineIds) }, select: ['id'] }))
  //     ?.map(eachId => eachId.id);
  //   const getSJobLineOperationIds = (await this.sjobLineOperationsRepo.find({ where: { sJobLineId: In(getSJobLineIds) }, select: ['id'] }))
  //     ?.map(eachId => eachId.id);
  //   //const getSJobFgs = (await this.sJobFgRepo.find({ where: { sJobSubLineId: In(getSJobSubLineIds) }, select: ['id'] }))?.map(eachId => eachId.id);
  //   const getSJobTrimGroups = (await this.sJobTrimGroupsRepo.find({ where: { sJobLineId: In(getSJobLineIds) }, select: ['id'] }))?.map(eachId => eachId.id);
  //   const getSJobTrimItems = (await this.sJobTrimItems.find({ where: { sJobTrimGroupId: In(getSJobTrimGroups) }, select: ['id'] }))?.map(eachId => eachId.id);
  //   const getFgNumbers = await this.sJobFgRepo.getFgNumbers(getSJobSubLineIds);
  //   // serial -> product -> color -> size -> fgnumber[];



  //   await transManager.startTransaction();
  //   for (const jobInfo of getFgNumbers) {
  //     const deleteJobFgs = await transManager.getRepository(SJobFgEntity).delete({ id: In(jobInfo.ids) });
  //     // const deleteFinishedGoods = await transManager.getRepository(SewFinishedGood).update({ sewFgNumber: In(jobInfo.ids), fgColor: jobInfo.fgColor, size: jobInfo.size, productName: jobInfo.productName }, { sewJobFillStatus: false });
  //   }
  //   const deleteJobTrims = await transManager.getRepository(SJobTrimItemsEntity).delete({ id: In(getSJobTrimItems) });
  //   const deleteJobTrimGroups = await transManager.getRepository(SJobTrimGroupsEntity).delete({ id: In(getSJobTrimGroups) });
  //   // const deleteJobFgs = await transManager.getRepository(SJobFgEntity).delete({id : In(getSJobFgs)});
  //   const deleteJoboperations = await transManager.getRepository(SJobLineOperationsEntity).delete({ id: In(getSJobLineOperationIds) });
  //   const deleteJobLines = await transManager.getRepository(SJobLineEntity).delete({ id: In(getSJobLineIds) });
  //   const deleteJobHeader = await transManager.getRepository(SJobHeaderEntity).delete({ id: In(getSJobHeaderIds) });
  //   const deletePlannedSewingJobs = await transManager.getRepository(SJobLinePlanEntity).delete({ id: In(getInprogressJobs) });
  //   await transManager.completeTransaction();
  //   return new GlobalResponseObject(true, 26058, "Sewing Jobs Deleted Successfully");


  // }

  // async getCutPanelsInfoForJobNumber(jobNumber: string, unitCode: string, companyCode: string, isBundleWiseInfoNeed: boolean, sewSerial: number): Promise<CutEligibilityInfoResp> {
    
  //   // Retrieve job info
  //   const sewJobInfo = await this.jobGroupRepo.findOne({ where: { jobNo: jobNumber, unitCode, companyCode }, select: ['groupNo'] });
  //   if (!sewJobInfo) {
  //     throw new ErrorResponse(26059, 'Sewing job details not found for the given sewing job');
  //   }

  //   // Retrieve FG details of the job
  //   const fgNumbersOfJobNumber = await this.jobFg.getFColorSizeFgDetailsOfJobNumber(jobNumber, unitCode, companyCode);
  //   if (!fgNumbersOfJobNumber.length) {
  //     throw new ErrorResponse(26060, 'Job Details not found in the job fg');
  //   }

  //   const productCompMap = new Map<string, string[]>();

  //   // Create an array of promises for fetching job components
  //   const docBundleRequests = await Promise.all(fgNumbersOfJobNumber.map(async (eachColorSizeInfo) => {
  //     if (!productCompMap.has(eachColorSizeInfo.productName)) {
  //       const jobComponents = await this.sewOpsInfo.getDistinctComponentsOfSerialProduct(sewSerial, eachColorSizeInfo.productName, unitCode, companyCode, sewJobInfo.groupNo);
  //       if (!jobComponents) {
  //         throw new ErrorResponse(26061, `Components not found for the given details ${sewSerial}, ${eachColorSizeInfo}, ${eachColorSizeInfo.productName}, ${sewJobInfo.groupNo}}`);
  //       }
  //       productCompMap.set(eachColorSizeInfo.productName, jobComponents.split(','));
  //     }
  //     const jgComps = productCompMap.get(eachColorSizeInfo.productName);
  //     const colorSizeCompsReq = new FgColorSizeCompRequest(null, 0, unitCode, companyCode, eachColorSizeInfo.fgNumbers, eachColorSizeInfo.fgColor, eachColorSizeInfo.productName, eachColorSizeInfo.size, jgComps, true, isBundleWiseInfoNeed, 0);
  //     return colorSizeCompsReq;
  //   }));

  //   // Get doc panel info for all color size FG numbers
  //   const docPanelInfo = await this.docGenService.getDocPanelInfoForColorSizeFgNumbers(docBundleRequests);
  //   if (!docPanelInfo.status) {
  //     throw new ErrorResponse(docPanelInfo.errorCode, docPanelInfo.internalMessage);
  //   }
  //   for (const eachDocReq of docPanelInfo.data) {
  //     eachDocReq.jobNumber = jobNumber;
  //   }
  //   return docPanelInfo;
  // }


  // async getSewingJobBInfoBySewSerial(reqObj: SewSerialRequest): Promise<SewingJobBatchInfoResp> {
  //   const { poSerial, unitCode, companyCode } = reqObj;
  //   const jobPrefObj = await this.jobPreferencesRepository.find({ where: { sewSerial: reqObj.poSerial, unitCode, companyCode, isActive: true } });
  //   const batchInfo: SewingJobBatchDetails[] = [];
  //   for (const eachBatch of jobPrefObj) {
  //     const jobHeader = await this.jobHeaderRepo.find({ where: { jobPrefId: eachBatch.id, unitCode, companyCode, isActive: true }, select: ['id'] });
  //     const jobLineObjs: JobLine[] = [];
  //     for (const eachJobHeader of jobHeader) {
  //       const jobLines = await this.jobGroupRepo.find({ where: { sJobHeaderId: eachJobHeader.id, unitCode, companyCode, isActive: true } });
  //       for (const eachJob of jobLines) {
  //         const subLines: SubLine[] = [];
  //         const totalSmv = await this.jobOperationsRepo.getTotalSmvByJobNo(eachJob.jobNo, unitCode, companyCode);
  //         const moduleInfo = await this.jobPlanRepo.findOne({ where: { jobNo: eachJob.jobNo, unitCode, companyCode } });
  //         const subLineInfo = await this.sJobSubLineRepo.find({ where: { sJobLineId: eachJob.id, unitCode, companyCode, isActive: true } });
  //         const productColorSizeQty = new Map<string, Map<string, Map<string, number>>>();
  //         for (const eachSubLine of subLineInfo) {
  //           if (!productColorSizeQty.has(eachSubLine.productName)) {
  //             productColorSizeQty.set(eachSubLine.productName, new Map<string, Map<string, number>>())
  //           }
  //           if (!productColorSizeQty.get(eachSubLine.productName).has(eachSubLine.color)) {
  //             productColorSizeQty.get(eachSubLine.productName).set(eachSubLine.color, new Map<string, number>());
  //           }
  //           if (!productColorSizeQty.get(eachSubLine.productName).get(eachSubLine.color).has(eachSubLine.size)) {
  //             productColorSizeQty.get(eachSubLine.productName).get(eachSubLine.color).set(eachSubLine.size, 0)
  //           }
  //           const preQty = productColorSizeQty.get(eachSubLine.productName).get(eachSubLine.color).get(eachSubLine.size);
  //           productColorSizeQty.get(eachSubLine.productName).get(eachSubLine.color).set(eachSubLine.size, preQty + Number(eachSubLine.qty));
  //         }
  //         for (const [prodName, prodQty] of productColorSizeQty) {
  //           for (const [color, colorInfo] of prodQty) {
  //             for (const [size, qty] of colorInfo) {
  //               subLines.push(new SubLine(prodName, null, size, color, qty));
  //             }
  //           }
  //         }
  //         const jobLineEntity = new JobLine(eachJob.jobNo, eachJobHeader.jobHeaderNo, eachJob.jobType, totalSmv.smv, moduleInfo.moduleNo ? true : false, moduleInfo.moduleNo, totalSmv.original_qty, eachBatch.multiColor, eachBatch.multiSize, eachBatch.groupInfo, subLines);
  //         jobLineObjs.push(jobLineEntity);
  //       }
  //     }
  //     const jobBatch = new SewingJobBatchDetails(eachBatch.id, moment(eachBatch.createdAt).format('YYYY-MM-DD HH:MM'), eachBatch.groupInfo, eachBatch.multiColor, eachBatch.multiSize, eachBatch.sewingJobQty, eachBatch.logicalBundleQty, 0, jobLineObjs, null);
  //   }

  //   return new SewingJobBatchInfoResp(true, 26144, 'Sewing job Batch info retrieved successfully', batchInfo)
  // }


  async getSewingJobBInfoBySewSerialByQry(reqObj: SewSerialRequest): Promise<SewingJobBatchInfoResp> {
    const qryResp = await this.jobPreferencesRepository.getJobDetailsBySewSerial(reqObj.poSerial, reqObj.unitCode, reqObj.companyCode);
    const jobInfoResp = this.constructSewingJobBatchDetails(qryResp);
    return new SewingJobBatchInfoResp(true, 26144, 'Sewing job Batch info retrieved successfully', jobInfoResp)
  }

  constructSewingJobBatchDetails(queryResponse: JobDetailQueryResponse[]): SewingJobBatchDetails[] {
    // Group the query response by jobPrefId
    const groupedByJobPref = queryResponse.reduce((groups, row) => {
      if (!groups[row.jobPrefId]) {
        groups[row.jobPrefId] = [];
      }
      groups[row.jobPrefId].push(row);
      return groups;
    }, {} as { [key: number]: JobDetailQueryResponse[] });

    // Construct SewingJobBatchDetails for each jobPrefId
    const sewingJobBatchDetailsArray = Object.entries(groupedByJobPref).map(([jobPrefId, rows]) => {
      // Initialize an array to store job lines for this jobPrefId
      const jobLines = [];

      // Loop through the rows for this jobPrefId
      rows.forEach(row => {
        const subLine = new SubLine(
          row.productName,  // productName
          null,
          row.size,          // size
          row.color,         // fgColor (assuming color is used as the finished goods color)
          row.qty            // quantity
        );

        // Check if the job line already exists based on jobNo (we assume it's unique)
        let jobLine = jobLines.find(jl => jl.jobNo === row.jobNo);

        // If the job line doesn't exist, create a new one
        if (!jobLine) {
          jobLine = new JobLine(
            row.jobNo,         // jobNo
            row.jobHeaderId,    // jobHeaderNo
            row.jobType,       // jobType
            row.smv,            // totalSmv
            row.moduleNo ? true : false,               // isPlanned (this can be adjusted based on your data)
            row.moduleNo,      // moduleNo
            0,                  // Initialize with zero, quantity will be calculated later
            row.multiColor,    // multiColor
            row.multiSize,     // multiSize
            row.groupInfo,     // groupInfo
            []                  // subLines (initialized as an empty array)
          );
          jobLines.push(jobLine);
        }
        // Add the subLine to the corresponding jobLine
        jobLine.subLines.push(subLine);
      });

      

      for (const eachLine of jobLines) {
        console.log(eachLine.jobNo);
        const totalJobQty = eachLine.subLines.reduce((prev, curr) => {
          return prev + curr.quantity;
        }, 0);
        console.log(totalJobQty);
        eachLine.quantity = totalJobQty;
      }
      const totalHeadQty = jobLines.reduce((prev, curr) => {
        return prev + curr.quantity;
      }, 0);

      // Create SewingJobBatchDetails for this jobPrefId
      return new SewingJobBatchDetails(
        Number(jobPrefId),           // sewingJobBatchNo (use jobPrefId as batch number)
        moment(rows[0]?.createdAt).format('YYYY-MM-DD HH:MM'),    // jobsGeneratedAt (current timestamp)
        rows[0]?.groupInfo || '',    // groupInfo (assuming the first entry for batch grouping)
        rows[0]?.multiColor || false, // multiColor (assuming from the first row)
        rows[0]?.multiSize || false,  // multiSize (assuming from the first row)
        totalHeadQty || 0,   // sewingJobQty
        rows[0]?.logicalBundleQty || 0, // logicalBundleQty
        0,                            // progress (set to 0 for now, you can adjust this logic)
        jobLines,                     // jobDetails (array of job lines)
        rows[0]?.jobType
      );
    });

    // Return the array of SewingJobBatchDetails
    return sewingJobBatchDetailsArray;
  }


  // async getBarcodeDetailsByJobNumber(req: JobSewSerialReq): Promise<SewingJobBarcodeInfoResp> {
  //   const queryResp = await this.jobGroupRepo.getBarcodeDetails(req.jobNumber, req.unitCode, req.companyCode)
  //   return new SewingJobBarcodeInfoResp(true, 26062, 'Barcode details retrieved successfully', queryResp)
  // }


  async lockAndPreviewSewingJobInfo(jobPreviewReq: SewJobGenReqForActualAndFeatureGroup, sewSerial: number, allCutRelatedFgNumbers: Map<number, number[]>) {
    // const transManager = new GenericTransactionManager(this.dataSource);
    // try {
    //   const {unitCode, companyCode, userId, username} = jobPreviewReq;
    //   const transactionId = Date.now();
    //   for (const [eachCutSerial, cutRelatedFgNumbers] of allCutRelatedFgNumbers) {
    //     const cutFgReq = new TransactionIdFgNumbersReq(username, unitCode, companyCode, userId, transactionId, cutRelatedFgNumbers, eachCutSerial, TransactionLockStatusEnum.LOCKED);
    //     const cutFgUpdate = await this.docGenService.updateTransactionIdAndStatusForFgs(cutFgReq);
    //     if (!cutFgUpdate) {
    //       throw new ErrorResponse(cutFgUpdate.errorCode, cutFgUpdate.internalMessage);
    //     }
    //   }
    //   const jobPreviewLog = new SJobPreviewLog();
    //   jobPreviewLog.companyCode = companyCode;
    //   jobPreviewLog.createdUser = jobPreviewReq.username;
    //   jobPreviewLog.groupInfo = JSON.stringify(jobPreviewReq.groupInfo);
    //   jobPreviewLog.logicalBundleQty = jobPreviewReq.logicalBundleQty;
    //   jobPreviewLog.multiColor = jobPreviewReq.multiColor;
    //   jobPreviewLog.multiSize = jobPreviewReq.multiSize;
    //   jobPreviewLog.sewSerial = sewSerial;
    //   jobPreviewLog.unitCode = jobPreviewReq.unitCode;
    //   jobPreviewLog.companyCode = jobPreviewReq.companyCode;
    //   jobPreviewLog.sewingJobQty = jobPreviewReq.sewingJobQty;
    //   jobPreviewLog.status = TransactionLockStatusEnum.LOCKED;
    //   await transManager.getRepository(SJobPreviewLog).save(jobPreviewLog);
    //   const oslRefIds = jobPreviewReq.groupInfo.osl_ref_id.split(',').map(res => Number(res));
    //   const updateResult  = await transManager.getRepository(SewFinishedGood).update({sewSerial, oslRefId: In(oslRefIds), unitCode, companyCode}, {transactionId: transactionId, updatedUser: jobPreviewLog.createdUser});
    //   if (!updateResult.affected) {
    //     throw new ErrorResponse(0, 'Status update failed to fgs in cutting module for transaction Id' + transactionId);
    //   }
    //   await transManager.completeTransaction();
    //   return true;
    // } catch (err) {
    //   await transManager.releaseTransaction();
    //   throw err;
    // }
  }

  async unlockTheSewingPreviewTransaction(reqObj: TransactionIdFgNumbersReq) {
    
  }
}
