import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { CommonResponse, ErrorResponse } from "@xpparel/backend-utils";
import { TransactionalBaseService } from "../../base-services";
import { GenericTransactionManager, ITransactionManager } from "../../database/typeorm-transactions";

import { BarcodePrefixEnum, CartonBarcodeRequest, CartonDataForEachPl, CartonDataModel, CartonDataResponse, CartonFillingModel, CartonFillingResponse, CartonHeadInfoModel, CartonHeadInfoResponse, CartonPrintModel, CartonPrintReqDto, CartonPrototypeModel, CartonPrototypeWeightModel, CartonScanReqNoDto, CartonStatusEnum, CartonStatusTrackingEnum, CartonTrackInfoModel, CartonTrackInfoResp, CartonUpcBarCodeReqDto, CartonWeightModel, CommonIdReqModal, CommonRequestAttrs, ExtFgBarCodeReqDto, FgsInfoDto, GlobalResponseObject, JobsGenStatusEnum, MC_ProductSubLineProcessTypeRequest, MOC_OpRoutingBomList, MOC_OpRoutingModel, MOC_OpRoutingResponse, MOC_OpRoutingSubProcessList, MoNumberResDto, PKMSCartonAttrsModel, PKMSCartonIdsRequest, PKMSCartonInfoModel, PKMSCartonInfoResponse, PKMSFgConsumptionStatus, PKMSInspectionHeaderAttributesEnum, PKMSManufacturingOrderIdRequest, PKMSPackDispatchInfoResponse, PKMSPackJobAttrsModel, PKMSPackJobsInfoModel, PKMSPackListIdReqDto, PKMSPackListIdsRequest, PKMSPackListInfoModel, PKMSPackListInfoResponse, PKMSPackListViewResponseDto, PKMSPackOrderIdRequest, PKMSPackOrderInfoModel, PKMSPackOrderInfoResponse, PKMSPackingDispatchCartonInfoModel, PKMSPackingDispatchPackJobsInfoModel, PKMSPackingDispatchPackListInfoModel, PLAndPackJobBarCodeRequest, PONoRequest, PackIdRequest, PackJobModel, PackJobStatusEnum, PackJobsResponse, PackListCreateModel, PackListIdRequest, PackListResponseModel, PackMatReqStatusEnum, PackingListIdRequest, PackingMethodsEnum, PackingStatusEnum, PkRatioModel, PlCartonWeightModel, PlCartonWeightResponse, PoIdRequest, PolyBagPrototypeModel, PolyBagSizeRatio, ProcessTypeEnum, ScanToPackRequest, StatusEnums, UpcBarCodeReqDto } from "@xpparel/shared-models";
import { MoOpRoutingService, PKMSBullQueueService, PkShippingRequestService } from "@xpparel/shared-services";
import dayjs from 'dayjs';
import { FgWhRequestStatusEnum } from "packages/libs/shared-models/src/pkms/enum/fg-wh-reqstatus.enum";
import { PKMSPackListAttrsModel } from "packages/libs/shared-models/src/pkms/pkms-pack-list-order-info/pkms-pack-list-attribute-dto";
import { DataSource, In, Not } from "typeorm";
import { SequenceHandlingService } from "../__common__/sequence-handling/sequence-handling.service";
import { PackInsRequestItemEntity } from "../__masters__/entites/ins-request-items.entity";
import { ItemDimensionsEntity } from "../__masters__/items/entities/item-dimensions.entity";
import { ItemsEntity } from "../__masters__/items/entities/items.entity";
import { ItemsRepoInterface } from "../__masters__/items/repositories/items-repo-interface";
import { FgWhReqLinesEntity } from "../fg-warehouse/entity/fg-wh-req-lines.entity";
import { FgWhReqSubLinesEntity } from "../fg-warehouse/entity/fg-wh-req-sub-lines.entity";
import { FGContainerCartonMapEntity } from "../location-allocation/entities/container-carton-map.entity";
import { FGContainerLocationMapEntity } from "../location-allocation/entities/container-location-map.entity";
import { PackMaterialRequestEntity } from "../packing-material-request/entities/material-request.entity";
import { FgEntity } from "../pre-integrations/entities/fg.entity";
import { OslInfoEntity } from "../pre-integrations/entities/osl-info.entity";
import { PKMSPoLineEntity } from "../pre-integrations/pkms-po-entities/pkms-po-line-entity";
import { PKMSPoSubLineEntity } from "../pre-integrations/pkms-po-entities/pkms-po-sub-line-entity";
import { PKMSProcessingOrderEntity } from "../pre-integrations/pkms-po-entities/pkms-processing-order-entity";
import { PKMSProductSubLineFeaturesEntity } from "../pre-integrations/pkms-po-entities/pkms-product-sub-line-features-entity";
import { PKMSPoSubLineRepoInterface } from "../pre-integrations/pkms-po-repositories/interfaces/pkms-po-subline.repo.interface";
import { PKMSProcessingOrderRepoInterface } from "../pre-integrations/pkms-po-repositories/interfaces/pkms-processing-order.repo.interface";
import { PKMSProcessingOrderRepository } from "../pre-integrations/pkms-po-repositories/repos/pkms-processing-order.repo";
import { CartonParentHierarchyEntity } from "./entities/carton-config-parent-hierarchy.entity";
import { CartonTemplateAttributesEntity } from "./entities/carton-template-attributes.entity";
import { ConfigLeastAggregatorEntity } from "./entities/config-least-aggregator.entity";
import { ConfigLeastChildEntity } from "./entities/config-least-child.entity";
import { CrtnEntity } from "./entities/crtns.entity";
import { JobHeaderEntity } from "./entities/job-header.entity";
import { PackOrderBomEntity } from "./entities/pack-bom.entity";
import { PackJobRequestAttributesEntity } from "./entities/pack-job-attributes.entity";
import { PLConfigEntity } from "./entities/pack-list.entity";
import { PackListRequestAttributesEntity } from "./entities/packlist-attributes.entity";
import { CartonJobReqAttributeRepoInterFace } from "./repositories/carton-attribute-repo-interface";
import { CartonConfigParentHierarchyRepoInterface } from "./repositories/carton-config-parent-hierarchy-repo.interface";
import { CrtnItemsRepoInterface } from "./repositories/carton-item-repo-interface";
import { CartonRepoInterFace } from "./repositories/carton-repo-interface";
import { ConfigLeastAggregatorRepoInterface } from "./repositories/config-least-aggregator.repo.interface";
import { ConfigLeastChildRepoInterface } from "./repositories/config-least-child.repo.interface";
import { PLConfigRepoInterface } from "./repositories/config-repo.interface";
import { JobHeaderRepoInterface } from "./repositories/job-header-repo.interface";
import { PackJobReqAttributeRepoInterFace } from "./repositories/pack-job-attribute-repo-interface";
import { PackListReqAttributeRepoInterFace } from "./repositories/pack-list-attribute-repo-interface";
import { TempOSLRefToCartonMapEntity } from "../pre-integrations/entities/temp-osl-ref-to-crt-map.entity";
import { CrtnItemsEntity } from "./entities/crtn-item.entity";
import { TempFGToCartonItemsMapEntity } from "../pre-integrations/entities/temp-fg-to-carton-items-map.entity";
import { PKMSPoProductEntity } from "../pre-integrations/pkms-po-entities/pkms-po-product-entity";

const sequenceNumberLength = 3;
@Injectable()
export class PackListService extends TransactionalBaseService {
  constructor(
    @Inject('PKMSProcessingOrderRepoInterface')
    private readonly pkmsProcessingRepo: PKMSProcessingOrderRepoInterface,
    @Inject('PKMSPoSubLineRepoInterface')
    private readonly poSubLineLineRepo: PKMSPoSubLineRepoInterface,
    @Inject('ConfigRepoInterface')
    private readonly configRepo: PLConfigRepoInterface,
    @Inject('JobHeaderRepoInterface')
    private readonly jobHeader: JobHeaderRepoInterface,
    @Inject('CartonRepoInterFace')
    private readonly cartonRepo: CartonRepoInterFace,
    @Inject('ConfigLeastAggregatorRepoInterface')
    private readonly polyBagRepo: ConfigLeastAggregatorRepoInterface,
    @Inject('ItemsRepoInterface')
    private readonly itemsRepo: ItemsRepoInterface,
    @Inject('ConfigLeastChildRepoInterface')
    private readonly configChild: ConfigLeastChildRepoInterface,
    @Inject('CartonConfigParentHierarchyRepoInterface')
    private readonly cartonProto: CartonConfigParentHierarchyRepoInterface,
    @Inject('CrtnItemsRepoInterface')
    private readonly cartonItemsRepo: CrtnItemsRepoInterface,
    @Inject('PackJobReqAttributeRepoInterFace')
    private readonly packJobReqAttributeRepo: PackJobReqAttributeRepoInterFace,
    @Inject('PackListReqAttributeRepoInterFace')
    private readonly packListReqAttributeRepo: PackListReqAttributeRepoInterFace,
    @Inject('CartonJobReqAttributeRepoInterFace')
    private readonly cartonReqAttributeRepo: CartonJobReqAttributeRepoInterFace,
    @Inject('TransactionManager')
    transactionManager: ITransactionManager,
    @Inject('LoggerService')
    logger: LoggerService,
    public sequenceHandlingService: SequenceHandlingService,
    public dataSource: DataSource,
    public pkShippingRequestService: PkShippingRequestService,
    private moRoutingService: MoOpRoutingService,
    private pkmsBullQueueService: PKMSBullQueueService,
    private pKMSProcessingOrderRepository: PKMSProcessingOrderRepository,

  ) {
    super(transactionManager, logger)
  }

  async savePackListInfo(req: PackListCreateModel): Promise<GlobalResponseObject> {
    const packListTable = new PLConfigEntity();
    packListTable.pkSpecId = req.specId;
    packListTable.pkTypeId = req.packType;
    packListTable.packSerial = req.packSerial;
    packListTable.noOfCartons = req.noOfCartons;
    packListTable.packJobQty = req.packJobQty;
    packListTable.plConfigDesc = req.plConfigDesc;
    packListTable.quantity = req.qty;
    packListTable.companyCode = req.companyCode;
    packListTable.createdUser = req.username;
    packListTable.unitCode = req.unitCode;
    packListTable.poId = req.poId;
    let savedPackListTableId = null;
    const result = await this.executeWithTransaction(async (transactionManager) => {
      const countData = await this.sequenceHandlingService.getSequenceNumber(`${req.packSerial}-PL-`, transactionManager);
      packListTable.plConfigNo = `${req.packSerial}-PL-${String(countData).padStart(sequenceNumberLength, '0')}`;
      const savedPackListTable = await transactionManager.getRepository(PLConfigEntity).save(packListTable);
      savedPackListTableId = savedPackListTable.id;
      const savedCartons = [];

      //packlist
      const productNamePLSet = new Set<string>();
      const moNoPLSet = new Set<string>();
      const poNoPLSet = new Set<string>();
      const destinationsPLSet = new Set<string>();
      const stylesPLSet = new Set<string>();
      const buyerPLSet = new Set<string>();
      const moLinePLSet = new Set<string>();
      const plannedPLDate = new Set<string>();


      const productNamesCTMap = new Map<number, Set<string>>();
      const moNoCTMap = new Map<number, Set<string>>();
      const poNoCTMap = new Map<number, Set<string>>();
      const destinationCTMap = new Map<number, Set<string>>();
      const styleCTMap = new Map<number, Set<string>>();
      const buyerCTMap = new Map<number, Set<string>>();
      const moLineCTMap = new Map<number, Set<string>>();
      const plannedDLDateCTMap = new Map<number, Set<string>>();


      const itemsMap = new Map<number, ItemDimensionsEntity>();

      for (const carton of req.cartons) {
        const moNoSetCartons = new Set<string>();
        const moLineSetCartons = new Set<string>();
        const buyerPoSetCartons = new Set<string>();
        const customerNameSetCartons = new Set<string>();
        const stylesSetCartons = new Set<string>();
        const plannedDeliveryDateSetCartons = new Set<string>();
        const colSetCartons = new Set<string>();
        const sizeSetCartons = new Set<string>();
        const pNameSetCartons = new Set<string>();

        let qtySetCartons = 0;

        const widthSetCartons = new Set<string>()
        const heightSetCartons = new Set<string>()
        const lengthSetCartons = new Set<string>()
        const sizeWiseQtySetCartons = new Set<string>()
        const cartonTable = new CartonParentHierarchyEntity();

        if (!itemsMap.has(carton.itemId)) {
          const findDimensions = await this.dataSource.getRepository(ItemsEntity).findOne({ where: { id: carton.itemId } })
          const dimensions = await this.dataSource.getRepository(ItemDimensionsEntity).findOne({ where: { id: findDimensions.dimensionsId } })
          itemsMap.set(carton.itemId, dimensions)
        }
        const getDimensions = itemsMap.get(carton.itemId);
        widthSetCartons.add(String(getDimensions.width));
        heightSetCartons.add(String(getDimensions.height));
        lengthSetCartons.add(String(getDimensions.length));
        const packOrderSubLineFeatures = await transactionManager.getRepository(PKMSProductSubLineFeaturesEntity).findOne({ select: ['exFactoryDate', 'deliveryDate'], where: { processingSerial: req.packSerial, companyCode: req.companyCode, unitCode: req.unitCode } });

        cartonTable.pkSpecId = req.specId;
        cartonTable.itemId = carton.itemId;
        cartonTable.boxMapId = carton.boxMapId;
        cartonTable.noOfPBags = carton.noOfPBags;
        cartonTable.quantity = carton.qty;
        cartonTable.count = carton.count;
        cartonTable.companyCode = req.companyCode;
        cartonTable.createdUser = req.username;
        cartonTable.unitCode = req.unitCode;
        cartonTable.pkConfigId = savedPackListTable.id;
        cartonTable.exfactory = packOrderSubLineFeatures.exFactoryDate;
        cartonTable.deliveryDate = packOrderSubLineFeatures.deliveryDate;
        cartonTable.buyerAddress = '';
        qtySetCartons += carton.qty
        const savedCartonTable = await transactionManager.getRepository(CartonParentHierarchyEntity).save(cartonTable);
        savedCartons.push(savedCartonTable);
        if (!productNamesCTMap.has(savedCartonTable.id)) {
          productNamesCTMap.set(savedCartonTable.id, new Set());
        }
        if (!moNoCTMap.has(savedCartonTable.id)) {
          moNoCTMap.set(savedCartonTable.id, new Set());
        }
        if (!poNoCTMap.has(savedCartonTable.id)) {
          poNoCTMap.set(savedCartonTable.id, new Set());
        }
        if (!destinationCTMap.has(savedCartonTable.id)) {
          destinationCTMap.set(savedCartonTable.id, new Set());
        }
        if (!styleCTMap.has(savedCartonTable.id)) {
          styleCTMap.set(savedCartonTable.id, new Set());
        }
        if (!buyerCTMap.has(savedCartonTable.id)) {
          buyerCTMap.set(savedCartonTable.id, new Set());
        }
        if (!moLineCTMap.has(savedCartonTable.id)) {
          moLineCTMap.set(savedCartonTable.id, new Set());
        }
        if (!plannedDLDateCTMap.has(savedCartonTable.id)) {
          plannedDLDateCTMap.set(savedCartonTable.id, new Set());
        }

        for (const polyBag of carton.polyBags) {
          const polyBagEntity = new ConfigLeastAggregatorEntity();
          polyBagEntity.pkConfigId = savedPackListTable.id;
          polyBagEntity.pkSpecId = req.specId;
          polyBagEntity.itemId = polyBag.itemId;
          polyBagEntity.boxMapId = polyBag.boxMapId;
          polyBagEntity.count = polyBag.count;
          polyBagEntity.quantity = polyBag.qty;
          polyBagEntity.companyCode = req.companyCode;
          polyBagEntity.createdUser = req.username;
          polyBagEntity.unitCode = req.unitCode;
          polyBagEntity.parentHierarchyId = savedCartonTable.id;
          const savedPolyBagTable = await transactionManager.getRepository(ConfigLeastAggregatorEntity).save(polyBagEntity);
          for (const size of polyBag.sizeRatios) {
            const sizeRatio = new ConfigLeastChildEntity();
            sizeRatio.color = size.fgColor;
            sizeRatio.productRef = size.productRef;
            sizeRatio.productCode = size.productCode;
            sizeRatio.productName = size.productName;
            sizeRatio.productType = size.productType;
            sizeRatio.size = size.size;
            sizeSetCartons.add(size.size)
            sizeWiseQtySetCartons.add(`${size.size}-${size.ratio}`)
            sizeRatio.ratio = size.ratio;
            sizeRatio.pkSpecId = req.specId;
            // const subLineId = new PackOrderSubLineEntity();
            // subLineId.id = size.poSubLId;
            sizeRatio.poOrderSubLineId = size.poSubLId;
            // const lineId = new PackOrderLineEntity();
            // lineId.id = size.lineId;
            // sizeRatio.poLine = lineId;
            sizeRatio.poLineId = size.lineId;

            // const po = new PackOrderEntity();
            // po.id = size.poId;
            sizeRatio.poId = size.poId;
            sizeRatio.parentHierarchyId = savedCartonTable.id;
            sizeRatio.leastAggregator = savedPolyBagTable.id;
            sizeRatio.pkConfigId = savedPackListTable.id;
            sizeRatio.companyCode = req.companyCode;
            sizeRatio.createdUser = req.username;
            sizeRatio.unitCode = req.unitCode;
            const packOrderSubLine = await transactionManager.getRepository(PKMSPoSubLineEntity).findOne({ where: { id: size.poSubLId } });
            const packOrderSubLineFeatures = await transactionManager.getRepository(PKMSProductSubLineFeaturesEntity).findOne({ where: { moProductSubLineId: packOrderSubLine.moProductSubLineId } });
            const lineData = await transactionManager.getRepository(PKMSPoLineEntity).findOne({ where: { id: size.lineId } });

            //TODO: need to change based on business logic
            sizeRatio.upcBarcode = String(packOrderSubLine.id);
            await transactionManager.getRepository(ConfigLeastChildEntity).save(sizeRatio);
            colSetCartons.add(packOrderSubLine.fgColor);
            //product name
            pNameSetCartons.add(packOrderSubLine.productName);
            productNamePLSet.add(packOrderSubLine.productName);
            productNamesCTMap.get(savedCartonTable.id).add(packOrderSubLine.productRef)
            //moLine
            moLineSetCartons.add(packOrderSubLineFeatures.moLineNumber);
            moLinePLSet.add(packOrderSubLineFeatures.moLineNumber);
            moLineCTMap.get(savedCartonTable.id).add(packOrderSubLineFeatures.moLineNumber)
            //MO No
            moNoSetCartons.add(lineData.moNumber);
            moNoPLSet.add(lineData.moNumber);
            moNoCTMap.get(savedCartonTable.id).add(lineData.moNumber)

            buyerPoSetCartons.add(lineData.coNumber);
            poNoPLSet.add(lineData.coNumber);
            poNoCTMap.get(savedCartonTable.id).add(lineData.coNumber)

            destinationsPLSet.add(packOrderSubLineFeatures.destination);
            destinationCTMap.get(savedCartonTable.id).add(packOrderSubLineFeatures.destination)


            customerNameSetCartons.add(packOrderSubLineFeatures.customerCode);
            buyerPLSet.add(packOrderSubLineFeatures.customerCode);
            buyerCTMap.get(savedCartonTable.id).add(packOrderSubLineFeatures.customerCode)


            stylesSetCartons.add(packOrderSubLineFeatures.styleCode);
            stylesPLSet.add(packOrderSubLineFeatures.styleCode);
            styleCTMap.get(savedCartonTable.id).add(packOrderSubLineFeatures.styleCode)


            plannedDeliveryDateSetCartons.add(packOrderSubLineFeatures.deliveryDate);
            plannedPLDate.add(packOrderSubLineFeatures.deliveryDate);
            plannedDLDateCTMap.get(savedCartonTable.id).add(packOrderSubLineFeatures.deliveryDate)
          }
        }


        const attributes: CartonTemplateAttributesEntity[] = [];
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.MO_NO, Array.from(moNoSetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.PO_NO, Array.from(buyerPoSetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.BUYER, Array.from(customerNameSetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.PLANNED_DELIVERY_DATE, Array.from(plannedDeliveryDateSetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.STYLE_NO, Array.from(stylesSetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.COLOR, Array.from(colSetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.SIZE, Array.from(sizeSetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.PRODUCT_NAME, Array.from(pNameSetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.QTY, String(qtySetCartons), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.SIZE_WISE_QTY, Array.from(sizeWiseQtySetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.WIDTH, Array.from(widthSetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.HEIGHT, Array.from(heightSetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        attributes.push(this.getPackCartonAttributesEntity(PKMSInspectionHeaderAttributesEnum.LENGTH, Array.from(lengthSetCartons).toString(), req.unitCode, req.companyCode, req.username, savedCartonTable.id))
        await transactionManager.getRepository(CartonTemplateAttributesEntity).save(attributes);
      }
      const poListAttributes: PackListRequestAttributesEntity[] = [];
      poListAttributes.push(this.getPackListReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.PRODUCT_NAME, Array.from(productNamePLSet).toString(), req.unitCode, req.companyCode, req.username, savedPackListTable.id))
      poListAttributes.push(this.getPackListReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.MO_NO, Array.from(moNoPLSet).toString(), req.unitCode, req.companyCode, req.username, savedPackListTable.id))
      poListAttributes.push(this.getPackListReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.PO_NO, Array.from(poNoPLSet).toString(), req.unitCode, req.companyCode, req.username, savedPackListTable.id))
      poListAttributes.push(this.getPackListReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.STYLE_NO, Array.from(stylesPLSet).toString(), req.unitCode, req.companyCode, req.username, savedPackListTable.id))
      poListAttributes.push(this.getPackListReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.BUYER, Array.from(buyerPLSet).toString(), req.unitCode, req.companyCode, req.username, savedPackListTable.id))
      poListAttributes.push(this.getPackListReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.DESTINATIONS, Array.from(destinationsPLSet).toString(), req.unitCode, req.companyCode, req.username, savedPackListTable.id))
      poListAttributes.push(this.getPackListReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.PLANNED_DELIVERY_DATE, Array.from(plannedPLDate).toString(), req.unitCode, req.companyCode, req.username, savedPackListTable.id))
      poListAttributes.push(this.getPackListReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.MANUFACTURING_LINE_NO, Array.from(moLinePLSet).toString(), req.unitCode, req.companyCode, req.username, savedPackListTable.id))

      await transactionManager.getRepository(PackListRequestAttributesEntity).save(poListAttributes);
      return new GlobalResponseObject(true, 36070, 'Pack List saved successfully');
    });
    if (savedPackListTableId) {
      //if redis
      await this.pkmsBullQueueService.addJobsToGeneratePackJobs(new PackingListIdRequest(savedPackListTableId, req.username, req.userId, req.unitCode, req.companyCode));
    }
    return result;



    //if no redis and only by shared services
    // await this.processJOBsGeneration(new PackingListIdRequest(savedPackListTableId, req.username, req.userId, req.unitCode, req.companyCode));

  };

  async processJOBsGeneration(req: PackingListIdRequest): Promise<GlobalResponseObject> {
    const userReq = { companyCode: req.companyCode, unitCode: req.unitCode };
    const packListTable = await this.configRepo.findOne({ select: ['id', 'packJobQty', 'poId', 'plConfigNo'], where: { id: req.packListId, ...userReq } });
    if (!packListTable) {
      throw new ErrorResponse(36071, 'Pack List not found');
    }
    const poDetails = await this.pkmsProcessingRepo.findOne({ where: { id: packListTable.poId } })
    const pLConfigParents = await this.cartonProto.getCartonProto(req.packListId);
    const packJobToCartonsMap = new Map<number, Map<number, number>>();
    const cartonParentAttribute = new Map<number, Map<PKMSInspectionHeaderAttributesEnum, string>>()
    let currentKey = 0;
    const mergeCartons: boolean = true;
    for (const carton of pLConfigParents) {
      let cartonsPerPackJob = 0;
      if (carton.count >= packListTable.packJobQty) {
        let noOfPackJobs = Math.ceil(carton.count / packListTable.packJobQty);
        let cartonsCount = Number(carton.count);
        let completedQty = 0;
        for (let packJob = 1; packJob <= noOfPackJobs; packJob++) {
          if (!packJobToCartonsMap.has(currentKey)) {
            const savedCartonIdMap = new Map();
            cartonsPerPackJob = Math.min(packListTable.packJobQty, Number(cartonsCount));
            savedCartonIdMap.set(carton.carton_parent_hierarchy_id, cartonsPerPackJob);
            packJobToCartonsMap.set(currentKey, savedCartonIdMap);
            cartonsCount = cartonsCount - cartonsPerPackJob;
            packJobToCartonsMap.get(currentKey).forEach((val, savedCartonId) => {
              if (savedCartonId === carton.carton_parent_hierarchy_id) {
                completedQty += val;
              }
            })
          } else {
            let remaining = packListTable.packJobQty;
            if (!mergeCartons) {
              currentKey += 1;
            } else {
              let sum = 0
              packJobToCartonsMap.get(currentKey).forEach((val, savedCartonId) => {
                if (savedCartonId === carton.carton_parent_hierarchy_id) {
                  completedQty += val;
                }
                sum += val;
              })
              remaining = packListTable.packJobQty - sum;
            }
            const savedCartonIdMap = new Map(packJobToCartonsMap.get(currentKey));
            cartonsPerPackJob = Math.min(packListTable.packJobQty, Number(cartonsCount), remaining)
            savedCartonIdMap.set(carton.carton_parent_hierarchy_id, cartonsPerPackJob);
            packJobToCartonsMap.set(currentKey, savedCartonIdMap);
            cartonsCount = cartonsCount - cartonsPerPackJob;
          }
          if ((cartonsPerPackJob === packListTable.packJobQty) || (completedQty === carton.count)) {
            currentKey += 1;
          }
        }
      } else {
        let cartonsCount = Number(carton.count);
        const savedCartonIdMap = new Map();
        cartonsPerPackJob = Math.min(packListTable.packJobQty, cartonsCount);
        savedCartonIdMap.set(carton.carton_parent_hierarchy_id, cartonsPerPackJob);
        packJobToCartonsMap.set(currentKey, savedCartonIdMap);
        cartonsCount = cartonsCount - cartonsPerPackJob;
        currentKey += 1;
      };
      //attributes
      const attributesData = await this.cartonReqAttributeRepo.find({ select: ['attributeName', 'attributeValue'], where: { cartonRequestId: carton.carton_parent_hierarchy_id, ...userReq } });
      cartonParentAttribute.set(carton.carton_parent_hierarchy_id, new Map<PKMSInspectionHeaderAttributesEnum, string>());
      for (const attribute of attributesData) {
        cartonParentAttribute.get(carton.carton_parent_hierarchy_id).set(attribute.attributeName, attribute.attributeValue);
      }
    }
    return await this.executeWithTransaction(async (transactionManager) => {
      await transactionManager.getRepository(PLConfigEntity).update({ id: req.packListId }, { pjGenStatus: JobsGenStatusEnum.IN_PROGRESS });
      for (const [packJobKey, savedCartonMap] of packJobToCartonsMap.entries()) {
        const countData = await this.sequenceHandlingService.getSequenceNumber(`${packListTable.plConfigNo}-PJ-`, transactionManager);
        const packJob = new JobHeaderEntity();
        packJob.jobQty = packListTable.packJobQty;
        packJob.jobNumber = `${packListTable.plConfigNo}-PJ-${String(countData).padStart(sequenceNumberLength, '0')}`;
        packJob.companyCode = req.companyCode;
        packJob.createdUser = req.username;
        packJob.unitCode = req.unitCode;
        packJob.poId = packListTable.poId;
        packJob.packList = packListTable.id;
        const savedPackJob = await transactionManager.getRepository(JobHeaderEntity).save(packJob);

        //packJob
        let productNameSetPackJob = new Set<string>();
        let moNoSetPackJob = new Set<string>();
        let poNoSetPackJob = new Set<string>();
        let destinationsSetPackJob = new Set<string>();
        let stylesSetPackJob = new Set<string>();
        let buyerSetPackJob = new Set<string>();
        let deliveryDatesSetPackJob = new Set<string>();
        let moLinesSetPackJob = new Set<string>();

        for (const [savedCartonId, noOfCartons] of savedCartonMap.entries()) {

          productNameSetPackJob = new Set([...Array.from(productNameSetPackJob), ...Array.from(new Set(cartonParentAttribute.get(savedCartonId).get(PKMSInspectionHeaderAttributesEnum.PRODUCT_NAME)?.split(',')))]);
          moNoSetPackJob = new Set([...Array.from(moNoSetPackJob), ...Array.from(new Set(cartonParentAttribute.get(savedCartonId).get(PKMSInspectionHeaderAttributesEnum.MO_NO)?.split(',')))]);
          poNoSetPackJob = new Set([...Array.from(poNoSetPackJob), ...Array.from(new Set(cartonParentAttribute.get(savedCartonId).get(PKMSInspectionHeaderAttributesEnum.PO_NO)?.split(',')))]);
          destinationsSetPackJob = new Set([...Array.from(destinationsSetPackJob), ...Array.from(new Set(cartonParentAttribute.get(savedCartonId).get(PKMSInspectionHeaderAttributesEnum.DESTINATIONS)?.split(',')))]);
          stylesSetPackJob = new Set([...Array.from(stylesSetPackJob), ...Array.from(new Set(cartonParentAttribute.get(savedCartonId).get(PKMSInspectionHeaderAttributesEnum.STYLE_NO)?.split(',')))]);
          buyerSetPackJob = new Set([...Array.from(buyerSetPackJob), ...Array.from(new Set(cartonParentAttribute.get(savedCartonId).get(PKMSInspectionHeaderAttributesEnum.BUYER)?.split(',')))]);
          deliveryDatesSetPackJob = new Set([...Array.from(deliveryDatesSetPackJob), ...Array.from(new Set(cartonParentAttribute.get(savedCartonId).get(PKMSInspectionHeaderAttributesEnum.DEL_DATES)?.split(',')))]);
          moLinesSetPackJob = new Set([...Array.from(moLinesSetPackJob), ...Array.from(new Set(cartonParentAttribute.get(savedCartonId).get(PKMSInspectionHeaderAttributesEnum.MANUFACTURING_LINE_NO)?.split(',')))]);
          const cartonData = await transactionManager.getRepository(CartonParentHierarchyEntity).findOne({ where: { id: savedCartonId } });
          for (let i = 1; i <= noOfCartons; i++) {
            const carton = new CrtnEntity();
            carton.cartonProtoId = savedCartonId;
            carton.pkConfigId = packListTable.id;
            carton.pkJobId = savedPackJob.id;
            carton.requiredQty = cartonData.quantity;
            carton.pkSpecId = cartonData.pkSpecId;
            carton.itemId = cartonData.itemId;
            const preFix = this.getCartonBarcode(packListTable.poId, packListTable.id);
            const countData = await this.sequenceHandlingService.getSequenceNumber(preFix, transactionManager);
            carton.barcode = `${preFix}-${countData}`;
            carton.companyCode = req.companyCode;
            carton.createdUser = req.username;
            carton.unitCode = req.unitCode;
            carton.style = poDetails.styleCode
            carton.exfactory = cartonData.exfactory
            carton.deliveryDate = cartonData.deliveryDate;
            carton.poId = packListTable.poId;
            await transactionManager.getRepository(CrtnEntity).save(carton)
          };

        }

        const attributes: PackJobRequestAttributesEntity[] = [];
        attributes.push(this.getPackJobReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.PRODUCT_NAME, Array.from(productNameSetPackJob).toString(), req.unitCode, req.companyCode, req.username, savedPackJob.id))
        attributes.push(this.getPackJobReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.MO_NO, Array.from(moNoSetPackJob).toString(), req.unitCode, req.companyCode, req.username, savedPackJob.id))
        attributes.push(this.getPackJobReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.PO_NO, Array.from(poNoSetPackJob).toString(), req.unitCode, req.companyCode, req.username, savedPackJob.id))
        attributes.push(this.getPackJobReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.STYLE_NO, Array.from(stylesSetPackJob).toString(), req.unitCode, req.companyCode, req.username, savedPackJob.id))
        attributes.push(this.getPackJobReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.BUYER, Array.from(buyerSetPackJob).toString(), req.unitCode, req.companyCode, req.username, savedPackJob.id))
        attributes.push(this.getPackJobReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.DESTINATIONS, Array.from(destinationsSetPackJob).toString(), req.unitCode, req.companyCode, req.username, savedPackJob.id))
        attributes.push(this.getPackJobReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.PLANNED_DELIVERY_DATE, Array.from(deliveryDatesSetPackJob).toString(), req.unitCode, req.companyCode, req.username, savedPackJob.id))
        attributes.push(this.getPackJobReqAttributesEntity(PKMSInspectionHeaderAttributesEnum.MANUFACTURING_LINE_NO, Array.from(moLinesSetPackJob).toString(), req.unitCode, req.companyCode, req.username, savedPackJob.id))
        await transactionManager.getRepository(PackJobRequestAttributesEntity).save(attributes);
      }
      await transactionManager.getRepository(PLConfigEntity).update({ id: req.packListId }, { pjGenStatus: JobsGenStatusEnum.COMPLETED })
      return new GlobalResponseObject(true, 36070, 'Pack List saved successfully');
    });

  }

  async getRoutingInfoForMOSubLineIds(processType: ProcessTypeEnum, moProductSubLineId: number[], unitCode: string, companyCode: string): Promise<Map<string, Map<string, MOC_OpRoutingModel>>> { //, productCode: string, fgColor: string): Promise<MOC_OpRoutingModel> {
    // need to get the Operation routing information including BOM + OPERATION against o moProductSubLine Ids 
    // should return the SOC_OpRoutingModel for given product code and fg color
    const routingReq = new MC_ProductSubLineProcessTypeRequest(null, unitCode, companyCode, null, moProductSubLineId, processType);

    const opRoutingDetails: MOC_OpRoutingResponse = await this.moRoutingService.getRoutingGroupInfoForMOProductSubLineDetails(routingReq);
    if (!opRoutingDetails.status) {
      throw new ErrorResponse(opRoutingDetails.errorCode, opRoutingDetails.internalMessage);
    }
    const opRoutingMap = new Map<string, Map<string, MOC_OpRoutingModel>>();//ProductCode, FgColor, MOC_OpRoutingModel
    for (const opRoute of opRoutingDetails.data) {
      if (!opRoutingMap.has(opRoute.prodName)) {
        opRoutingMap.set(opRoute.prodName, new Map<string, MOC_OpRoutingModel>());
      }
      opRoutingMap.get(opRoute.prodName).set(opRoute.fgColor, opRoute);
    }

    if (opRoutingMap.size == 0) {
      throw new ErrorResponse(0, 'Routing details not found for the given mo Product sub line Ids')
    }
    return opRoutingMap;
  }

  async deletePackList(req: CommonIdReqModal): Promise<GlobalResponseObject> {
    return this.executeWithTransaction(async (transactionManager) => {
      await transactionManager.getRepository(PackListRequestAttributesEntity).delete({ packListId: req.id });
      const packJobs = await transactionManager.getRepository(JobHeaderEntity).find({ select: ['id'], where: { packList: req.id } });
      for (const packJob of packJobs) {
        await transactionManager.getRepository(PackJobRequestAttributesEntity).delete({ packJobId: packJob.id })
        await transactionManager.getRepository(CrtnEntity).delete({ pkJobId: packJob.id })
        await transactionManager.getRepository(JobHeaderEntity).delete({ id: packJob.id })
      }
      const cartonTemplates = await transactionManager.getRepository(CartonParentHierarchyEntity).find({
        where: {
          pkConfigId: req.id
        }
      });
      for (const cartonProto of cartonTemplates) {
        await transactionManager.getRepository(ConfigLeastChildEntity).delete({ parentHierarchyId: cartonProto.id })
        await transactionManager.getRepository(ConfigLeastAggregatorEntity).delete({ parentHierarchyId: cartonProto.id })
        await transactionManager.getRepository(CartonTemplateAttributesEntity).delete({ cartonRequestId: cartonProto.id })
        await transactionManager.getRepository(CartonParentHierarchyEntity).delete({ id: cartonProto.id })
      }
      await transactionManager.getRepository(PLConfigEntity).delete({ id: req.id })
      return new GlobalResponseObject(true, 36072, 'Pack Order deleted successfully')
    })
  }

  //TODO: need to change based on business logic
  getCartonBarcode(poId: number, packListId: number): string {
    return BarcodePrefixEnum.CARTON + ':' + Number(poId).toString(16) + '-' + Number(packListId);
  };

  getPackJobReqAttributesEntity(attName: PKMSInspectionHeaderAttributesEnum, attValue: string, unitCode: string, companyCode: string, userName: string, packJobRequestId: number) {
    const inspReqAttributes = new PackJobRequestAttributesEntity();
    inspReqAttributes.attributeName = attName;
    inspReqAttributes.attributeValue = attValue;
    inspReqAttributes.companyCode = companyCode;
    inspReqAttributes.createdUser = userName;
    inspReqAttributes.packJobId = packJobRequestId;
    inspReqAttributes.unitCode = unitCode;
    return inspReqAttributes;
  };

  getPackListReqAttributesEntity(attName: PKMSInspectionHeaderAttributesEnum, attValue: string, unitCode: string, companyCode: string, userName: string, packListRequestId: number) {
    const inspReqAttributes = new PackListRequestAttributesEntity();
    inspReqAttributes.attributeName = attName;
    inspReqAttributes.attributeValue = attValue;
    inspReqAttributes.companyCode = companyCode;
    inspReqAttributes.createdUser = userName;
    inspReqAttributes.packListId = packListRequestId;
    inspReqAttributes.unitCode = unitCode;
    return inspReqAttributes;
  }

  getPackCartonAttributesEntity(attName: PKMSInspectionHeaderAttributesEnum, attValue: string, unitCode: string, companyCode: string, userName: string, cartonRequestId: number) {
    const inspReqAttributes = new CartonTemplateAttributesEntity();
    inspReqAttributes.attributeName = attName;
    inspReqAttributes.attributeValue = attValue;
    inspReqAttributes.companyCode = companyCode;
    inspReqAttributes.createdUser = userName;
    inspReqAttributes.cartonRequestId = cartonRequestId;
    inspReqAttributes.unitCode = unitCode;
    return inspReqAttributes;
  }

  async getPackListsForPo(req: PONoRequest): Promise<CommonResponse> {
    const poEntityData = await this.configRepo.getPackListsForPo(req.companyCode, req.unitCode, req.packSerial, req.poLine, req.subLineId);

    if (poEntityData.length == 0) {
      throw new ErrorResponse(36073, 'Data not available')
    }
    const poData = [];
    for (const rec of poEntityData) {
      // const pl = new PLConfigEntity();
      // pl.id = rec.configId;
      const packJobPrintStatus = await this.jobHeader.count({ where: { packList: rec.configId, printStatus: true } })
      const poModel = new PackListCreateModel(rec.configId, rec.pl_config_no, rec.pl_config_desc, rec.poId, rec.processing_serial, rec.delivery_date as any, rec.quantity, rec.specId, rec.ptId, undefined, rec.no_of_cartons, rec.pack_job_qty, rec.no_of_cartons / rec.pack_job_qty, [], req.companyCode, req.unitCode, undefined, '');
      poModel.printStatus = packJobPrintStatus ? true : false;
      poData.push(poModel);
    }
    return new CommonResponse(true, 967, ' Data retrieved successfully', poData);
  }

  async getPackJobsForPackListId(req: PackingListIdRequest): Promise<PackJobsResponse> {
    const PackListData: PackJobModel[] = []
    const listId = new PLConfigEntity()
    listId.id = req.packListId;
    const jobHeaderData = await this.jobHeader.getPackJobData(req)
    for (const packJob of jobHeaderData) {
      const cartons = await this.cartonRepo.find({ where: { pkJobId: packJob.pack_job_id } });
      let cartonPrintStatus = false;
      let pjQty = 0;
      cartons.forEach(rec => {
        if (rec.printStatus) cartonPrintStatus = rec.printStatus;
        pjQty += Number(rec.requiredQty ? rec.requiredQty : 0);
      });
      const finalRes = new PackJobModel(packJob.pack_job_id, packJob.job_number, packJob.po_id, packJob.cartons, packJob.priority, packJob.request_no, packJob.request_id, packJob.mat_request_on, packJob.planned_date_time, packJob.mat_status);
      finalRes.printStatus = cartonPrintStatus ? true : false;
      finalRes.totalFgQty = pjQty;
      PackListData.push(finalRes);
    }
    if (PackListData.length == 0) {
      throw new ErrorResponse(36073, 'Data not available');
    }
    return new PackJobsResponse(true, 967, 'Data retrieved successfully', PackListData);
  }

  async printBarcodesForPackListId(req: PLAndPackJobBarCodeRequest): Promise<CommonResponse> {
    const configId = await this.configRepo.findOne({ where: { id: req.packListId, companyCode: req.companyCode, unitCode: req.unitCode } })
    // const listId = new PLConfigEntity()
    // listId.id = configId.id
    const jobId = await this.jobHeader.findOne({ where: { id: req.packJobId, packList: configId.id, companyCode: req.companyCode, unitCode: req.unitCode } })

    if (!configId) {
      throw new ErrorResponse(36074, ' request is not found');
    }
    if (configId.status == StatusEnums.Approved) {
      throw new ErrorResponse(36075, 'pack list already approved.');
    }

    await this.cartonRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, pkConfigId: configId.id, pkJobId: jobId.id }, { printStatus: true })

    return new CommonResponse(true, 36076, 'Print status updated successfully');

  }

  async releaseBarcodesPrintForPackListId(req: PLAndPackJobBarCodeRequest): Promise<CommonResponse> {
    const configId = await this.configRepo.findOne({ where: { id: req.packListId, companyCode: req.companyCode, unitCode: req.unitCode } })
    // const listId = new PLConfigEntity()
    // listId.id = configId.id
    const jobId = await this.jobHeader.findOne({ where: { id: req.packJobId, packList: configId.id, companyCode: req.companyCode, unitCode: req.unitCode } })

    if (!configId) {
      throw new ErrorResponse(36074, ' request is not found');
    }
    if (configId.status == StatusEnums.Approved) {
      throw new ErrorResponse(36075, 'pack list already approved.');
    }

    await this.cartonRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, pkConfigId: configId.id, pkJobId: jobId.id }, { printStatus: false })

    return new CommonResponse(false, 36077, 'released status updated successfully');

  }


  async printBarcodesForPackJob(req: PLAndPackJobBarCodeRequest): Promise<CommonResponse> {

    const configId = await this.configRepo.findOne({ where: { id: req.packListId, companyCode: req.companyCode, unitCode: req.unitCode } })
    // const listId = new PLConfigEntity()
    // listId.id = configId.id
    const jobId = await this.jobHeader.findOne({ where: { id: req.packJobId, packList: configId.id, companyCode: req.companyCode, unitCode: req.unitCode } })
    if (!jobId) {
      throw new ErrorResponse(36074, 'request is not found');
    }
    if (configId.status == StatusEnums.Approved) {
      throw new ErrorResponse(36075, 'pack list already approved.');
    }
    await this.cartonRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, pkConfigId: configId.id, pkJobId: jobId.id }, { printStatus: true })
    await this.jobHeader.update({ companyCode: req.companyCode, unitCode: req.unitCode, id: jobId.id }, { printStatus: true })
    return new CommonResponse(true, 36076, 'Print status updated successfully');

  }

  async releaseBarcodesPrintForPackJob(req: PLAndPackJobBarCodeRequest): Promise<CommonResponse> {
    const jobId = await this.jobHeader.findOne({ where: { id: req.packJobId, companyCode: req.companyCode, unitCode: req.unitCode } })

    if (!jobId) {
      throw new ErrorResponse(36078, 'There is no Pack job exist with given details');
    }

    await this.cartonRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, pkJobId: jobId.id }, { printStatus: false });
    await this.jobHeader.update({ companyCode: req.companyCode, unitCode: req.unitCode, id: jobId.id }, { printStatus: false })

    return new CommonResponse(true, 36077, 'released status updated successfully');

  }


  async getPackingListDataById(
    req: CommonIdReqModal
  ): Promise<PackListResponseModel> {
    const packListDetails = await this.configRepo.getPackingListDataById(req.id);
    if (!packListDetails) {
      throw new ErrorResponse(36073, 'Data not available',);
    }
    const plCreModel: PackListCreateModel = new PackListCreateModel(packListDetails.configId, packListDetails.pl_config_no, packListDetails.pl_config_desc, packListDetails.PoId, packListDetails.processing_serial, packListDetails.delivery_date, packListDetails.quantity, packListDetails.SpecId, packListDetails.pk_type_id, packListDetails.
      pack_method, packListDetails.no_of_cartons, packListDetails.pack_job_qty, packListDetails.no_of_cartons / packListDetails.pack_job_qty, [], packListDetails.company_code, packListDetails.unit_code, req.userId, packListDetails.created_user);
    const pLConfigParents = await this.cartonProto.getCartonProto(packListDetails.configId)
    for (const cartons of pLConfigParents) {
      // const cartonParent: CartonParentHierarchyEntity = new CartonParentHierarchyEntity();
      // cartonParent.id = cartons.Carton_Parent_Hierarchy_ID;
      const itemData = await this.itemsRepo.findOne({ where: { id: cartons.item_id } })
      const carton = new CartonPrototypeModel(undefined, cartons.item_id, cartons.box_map_id, itemData.code, cartons.no_of_p_bags, cartons.count, []);
      carton.qty = cartons.quantity;
      const polyBags = await this.polyBagRepo.find({ where: { parentHierarchyId: cartons.carton_parent_hierarchy_id } });
      for (const polyBag of polyBags) {
        const itemData = await this.itemsRepo.findOne({ where: { id: polyBag.itemId } });
        const polyBagProto = new PolyBagPrototypeModel(polyBag.id, polyBag.itemId, polyBag.boxMapId, itemData.code, polyBag.quantity, polyBag.count, []);
        const polyBagEntity = new ConfigLeastChildEntity();
        polyBagEntity.id = polyBag.id;
        const sizeRatios = await this.configChild.find({ where: { leastAggregator: polyBag.id } });
        for (const sizeRatio of sizeRatios) {
          polyBagProto.sizeRatios.push(new PolyBagSizeRatio(
            sizeRatio.id,
            sizeRatio.poLineId,
            sizeRatio.productRef,
            sizeRatio.color,
            sizeRatio.productCode,
            sizeRatio.productName,
            sizeRatio.productType,
            sizeRatio.poOrderSubLineId,
            sizeRatio.size,
            sizeRatio.ratio,
            packListDetails.PoId
          ));
          if (!carton.cartonUniqueKey) {
            carton.cartonUniqueKey = this.getMapKey(plCreModel.packMethod, sizeRatio.poLineId, sizeRatio.poOrderSubLineId)
          }
        }
        carton.polyBags.push(polyBagProto)
      }
      plCreModel.cartons.push(carton)
    }
    return new PackListResponseModel(true, 967, 'Data Retrieved Successfully', plCreModel)
  }

  getMapKey = (packMethod: PackingMethodsEnum, pol: number, poSubL: number) => {
    let mapKey = '';
    if (packMethod === PackingMethodsEnum.SCSS) {
      mapKey = ` ${pol}$@$${poSubL}`;
    }
    if (packMethod === PackingMethodsEnum.SCMS) {
      mapKey = `${pol}`;
    }
    if (packMethod === PackingMethodsEnum.MCSS) {
      mapKey = ` ${poSubL}`;
    }
    if (packMethod === PackingMethodsEnum.MCMS) {
      mapKey = 'poNumber';
    }
    return mapKey;
  }

  async getCartonPrintData(req: CartonPrintReqDto): Promise<CommonResponse> {
    let data: CartonPrintModel[] = [];
    let findCartons: CrtnEntity[] = [];
    const whereClause: any = {}
    whereClause.pkConfigId = req.packListId;
    whereClause.companyCode = req.companyCode;
    whereClause.unitCode = req.unitCode;
    if (req.packJobId) {
      whereClause.pkJobId = req.packJobId;
    }

    if (req.cartonIds?.length) {
      whereClause.id = In(req.cartonIds);
    }

    findCartons = await this.cartonRepo.find({ select: ['barcode', 'cartonProtoId', 'requiredQty', 'exfactory', 'deliveryDate', 'style', 'packingStatus'], where: whereClause });
    const packListData = await this.configRepo.findOne({ where: { id: req.packListId, companyCode: req.companyCode, unitCode: req.unitCode } })
    const findPoNo = await this.dataSource.getRepository(PKMSProcessingOrderEntity).findOne({ select: ['prcOrdDescription', 'processingSerial'], where: { id: packListData.poId, companyCode: req.companyCode, unitCode: req.unitCode } })
    const findPoProperties = await this.dataSource.getRepository(PKMSProductSubLineFeaturesEntity).findOne({ select: ['destination', 'fgColor', 'styleCode', 'moNumber', 'customerName'], where: { processingSerial: findPoNo.processingSerial, companyCode: req.companyCode, unitCode: req.unitCode } })
    for (const carton of findCartons) {
      const cLeastChild = await this.configChild.find({
        select: ['ratio', 'size', 'leastAggregator', 'color'],
        where: {
          // todo
          poId: req.poId,
          parentHierarchyId: carton.cartonProtoId,
          companyCode: req.companyCode,
          unitCode: req.unitCode
        }
      });
      const colors = [];
      const mapForCLeastChild = new Map<string, PkRatioModel>();
      for (const rec of cLeastChild) {
        const clp = await this.dataSource.getRepository(ConfigLeastAggregatorEntity).findOne({ select: ['count'], where: { id: rec.leastAggregator } })
        if (!mapForCLeastChild.get(rec.size + rec.color)) {
          mapForCLeastChild.set(rec.size + rec.color, new PkRatioModel(rec.size, (rec.ratio * clp?.count)))
        } else {
          mapForCLeastChild.get(rec.size + rec.color).ratio += (rec.ratio * clp?.count);
        }
        colors.push(rec.color);
      }

      const removeDuplicates = [...new Set(colors)]
      //TODO: need to add poNumber,address,orderRefNo,destination
      const result = new CartonPrintModel(carton.barcode, findPoNo.prcOrdDescription, carton.style, removeDuplicates.join(','), Array.from(mapForCLeastChild.values()), carton.requiredQty, findPoProperties.destination, carton.exfactory, packListData.plConfigNo, undefined, findPoProperties.moNumber, findPoProperties.customerName, 1, carton?.packingStatus)
      data.push(result);

    }
    return new CommonResponse(true, 967000, "Data Retrieved Successfully", data);
  }



  async getFgCartonFillingData(req: CartonScanReqNoDto): Promise<CartonFillingResponse> {
    const savedOslRefIds: TempOSLRefToCartonMapEntity[] = [];
    try {
      const carton = await this.cartonRepo.findOne({ where: { barcode: req.cartonBarcode, companyCode: req.companyCode, unitCode: req.unitCode, } });
      if (!carton) {
        throw new ErrorResponse(36079, 'Carton not found with given barcode')
      }

      const findPackJobData = await this.jobHeader.findOne({ select: ['status', 'jobNumber', 'pkMatReqId'], where: { id: carton.pkJobId, companyCode: req.companyCode, unitCode: req.unitCode } });
      if (findPackJobData.status === PackJobStatusEnum.OPEN) {
        throw new ErrorResponse(54165, `Given Job number ${findPackJobData.jobNumber} is  not planned , please plane to proceed`)
      }
      if (findPackJobData.status === PackJobStatusEnum.COMPLETED) {
        if (carton.packingStatus !== PackingStatusEnum.COMPLETED) {
          throw new ErrorResponse(54165, `Given Job number ${findPackJobData.jobNumber} is already completed `)
        }
      }
      if (findPackJobData.pkMatReqId === null) {
        throw new ErrorResponse(4546, `Material not requested for the given pack job number ${findPackJobData.jobNumber}`)
      }
      const findMaterialReqStatus = await this.dataSource.getRepository(PackMaterialRequestEntity).findOne({ select: ['matStatus'], where: { id: findPackJobData.pkMatReqId, companyCode: req.companyCode, unitCode: req.unitCode } })
      if (findMaterialReqStatus?.matStatus === PackMatReqStatusEnum.OPEN) {
        throw new ErrorResponse(232286, `Material is Not ready you cant proceed for given job number ${findPackJobData.jobNumber}`)
      }
      if (findMaterialReqStatus?.matStatus !== PackMatReqStatusEnum.MATERIAL_ISSUED) {
        throw new ErrorResponse(232286, `Material is Not ready you cant proceed ${findPackJobData.jobNumber}`)
      }

      const cartonProto = await this.cartonProto.findOne({ where: { id: carton.cartonProtoId } });
      const itemData = await this.itemsRepo.findOne({ where: { id: cartonProto.itemId } });
      const dimenlen = await this.dataSource.getRepository(ItemDimensionsEntity).findOne({ select: ['length', 'width', 'height'], where: { id: itemData.dimensionsId } })
      const configId = await this.configRepo.findOne({ where: { id: cartonProto.pkConfigId, companyCode: req.companyCode, unitCode: req.unitCode } });
      //TODO: need to add poNumber
      const cartonFillModel: CartonFillingModel = new CartonFillingModel(carton.id, cartonProto.id, carton.barcode, cartonProto.quantity, 0, cartonProto.noOfPBags, cartonProto.count, cartonProto.grossWeight, cartonProto.netWeight, `${dimenlen.length}*${dimenlen.width}*${dimenlen.height}`, undefined, configId.poId, [], carton.exfactory, carton.packingStatus, [], []);
      const polyBags = await this.polyBagRepo.find({ where: { parentHierarchyId: carton.cartonProtoId } });
      const colors = new Set<string>()
      for (const polyBag of polyBags) {
        const itemData = await this.itemsRepo.findOne({ where: { id: polyBag.itemId } });
        const polyBagProto = new PolyBagPrototypeModel(polyBag.id, polyBag.itemId, polyBag.boxMapId, itemData.code, polyBag.quantity, polyBag.count, []);
        const actualPolyBagProto = new PolyBagPrototypeModel(polyBag.id, polyBag.itemId, polyBag.boxMapId, itemData.code, polyBag.quantity, polyBag.count, []);
        const polyBagEntity = new ConfigLeastChildEntity();
        polyBagEntity.id = polyBag.id;
        const sizeRatios = await this.configChild.find({ where: { leastAggregator: polyBag.id } });
        for (const sizeRatio of sizeRatios) {
          const size = new PolyBagSizeRatio(sizeRatio.id, sizeRatio.poLineId, sizeRatio.productRef, sizeRatio.color, sizeRatio.productCode, sizeRatio.productName, sizeRatio.productType, sizeRatio.poOrderSubLineId, sizeRatio.size, sizeRatio.ratio, sizeRatio.poId);
          size.upcBarCode = sizeRatio.upcBarcode
          polyBagProto.sizeRatios.push(size);
          colors.add(sizeRatio.color);
          if (req.isExternal) {
            await this.getAllFgsForToScannedCarton(carton.companyCode, carton.unitCode, polyBag.count * sizeRatio.ratio, sizeRatio.poOrderSubLineId, carton.id, polyBag.id, savedOslRefIds);
          }
        }
        const actualSizeRatios = await this.cartonItemsRepo.find({ where: { pmTCrtnId: carton.id, leastAggregator: polyBag.id, } });
        for (const sizeRatio of actualSizeRatios) {
          const size = new PolyBagSizeRatio(sizeRatio.id, sizeRatio.poLineId, sizeRatio.productRef, sizeRatio.color, sizeRatio.productCode, sizeRatio.productName, sizeRatio.productType, sizeRatio.poOrderSubLineId, sizeRatio.size, sizeRatio.completedQty, sizeRatio.poId);
          cartonFillModel.scannedQy += sizeRatio.completedQty;
          actualPolyBagProto.qty += sizeRatio.completedQty;
          size.upcBarCode = sizeRatio.upcBarcode;
          actualPolyBagProto.sizeRatios.push(size);
        }
        cartonFillModel.plannedPolyBagDetails.push(polyBagProto);
        cartonFillModel.scannedPolyBagDetails.push(actualPolyBagProto);
      }
      cartonFillModel.color = Array.from(colors);
      return new CartonFillingResponse(true, 967, "Data Retrieved Successfully", cartonFillModel)
    } catch (error) {
      console.log(error)
      for (const savedOslRefId of savedOslRefIds) {
        await this.dataSource.getRepository(TempOSLRefToCartonMapEntity).delete({ id: savedOslRefId.id });
        await this.dataSource.getRepository(OslInfoEntity).update({ oslId: savedOslRefId.oslId }, { consumedQty: () => `consumedQty - ${savedOslRefId.allocatedFgQty}` });
      }
      throw error;
    }
  }
  //is all fgs are Ready for Carton packing
  async getAllFgsForToScannedCarton(companyCode: string, unitCode: string, qty: number, poOrderSubLineId: number, cartonId: number, polyBagId: number, savedOslRefs: TempOSLRefToCartonMapEntity[]): Promise<boolean> {
    const poOrderSubLineData = await this.dataSource.getRepository(PKMSPoSubLineEntity).findOne({ select: ['moProductSubLineId'], where: { id: poOrderSubLineId, companyCode, unitCode } })
    const cartonProperties = await this.dataSource.getRepository(PKMSProductSubLineFeaturesEntity).findOne({ select: ['fgColor', 'size', 'moNumber', 'styleCode', 'moLineNumber', 'productCode'], where: { moProductSubLineId: poOrderSubLineData.moProductSubLineId, companyCode, unitCode } });
    const oslIdToQtyMap = new Map<number, { originalQty: number, consumedQty: number }>();
    const oslInfoData = await this.dataSource.getRepository(OslInfoEntity).find({ select: ['oslId', 'quantity', 'consumedQty'], where: { color: cartonProperties.fgColor, style: cartonProperties.styleCode, size: cartonProperties.size, moNo: cartonProperties.moNumber, moLineNo: cartonProperties.moLineNumber, productCode: cartonProperties.productCode, companyCode, unitCode } });
    let alreadyConsumedQty = 0;
    oslInfoData.forEach(rec => {
      if (oslIdToQtyMap.has(rec.oslId)) {
        oslIdToQtyMap.set(rec.oslId, { originalQty: oslIdToQtyMap.get(rec.oslId).originalQty + rec.quantity, consumedQty: oslIdToQtyMap.get(rec.oslId).consumedQty + rec.consumedQty });
        alreadyConsumedQty += rec.consumedQty;
      } else {
        alreadyConsumedQty += rec.consumedQty;
        oslIdToQtyMap.set(rec.oslId, { originalQty: rec.quantity, consumedQty: rec.consumedQty })
      }
    }
    );
    const oslIds = Array.from(oslIdToQtyMap.keys());
    console.log(oslIds, 'oslIds')
    const availableFgs = await this.dataSource.getRepository(FgEntity).count({ where: { oslId: In(oslIds) } });
    if ((availableFgs - alreadyConsumedQty) >= Number(qty)) {
      let requiredQty = Number(qty);
      for (const [oslId, { originalQty, consumedQty }] of oslIdToQtyMap) {
        const remainingQty = originalQty - consumedQty;
        let allocatedQty = 0;
        if (remainingQty <= 0) {
          continue; //skip
        }
        while (requiredQty > 0) {
          allocatedQty = Math.min(requiredQty, remainingQty);
          await this.dataSource.getRepository(OslInfoEntity).update({ oslId }, { consumedQty: () => `consumedQty + ${allocatedQty}` });
          requiredQty -= allocatedQty;
          const tempOSLRefEntity = new TempOSLRefToCartonMapEntity();
          tempOSLRefEntity.oslId = oslId;
          tempOSLRefEntity.allocatedFgQty = allocatedQty;
          tempOSLRefEntity.crtId = cartonId;
          tempOSLRefEntity.pslId = poOrderSubLineId;
          tempOSLRefEntity.polyBagId = polyBagId;
          const tempOslRefData = await this.dataSource.getRepository(TempOSLRefToCartonMapEntity).save(tempOSLRefEntity);
          savedOslRefs.push(tempOslRefData);
        }
      }
      return true;
    } else {
      throw new ErrorResponse(56123, 'All fgs are not ready for pack')
    }
  }

  //carton scanning in cartons level
  async cartonsFillingInCartonsLevel(reqModel: CartonScanReqNoDto): Promise<CommonResponse> {
    const scannedCartons = (await this.getFgCartonFillingData(reqModel)).data;
    //polybag id => pslId(upc)=>quantity

    const upcBarcodeAndQuantityMap = new Map<number, Map<number, number>>();
    const upcSet = new Set<number>();
    for (const rec of scannedCartons.plannedPolyBagDetails) {
      if (!upcBarcodeAndQuantityMap.has(rec.id)) {
        upcBarcodeAndQuantityMap.set(rec.id, new Map())
      }
      for (const s of rec.sizeRatios) {
        if (!upcBarcodeAndQuantityMap.get(rec.id).has(s.poSubLId)) {
          upcBarcodeAndQuantityMap.get(rec.id).set(s.poSubLId, s.ratio * rec.count)
        }
        upcSet.add(s.poSubLId)
      };
    };
    const userData = { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, }
    const leastChilds = await this.configChild.find({ where: { upcBarcode: In(Array.from(upcSet)), parentHierarchyId: scannedCartons.cartonProtoId, ...userData } });
    const leastChildsMap = new Map<number, ConfigLeastChildEntity>();
    leastChilds.forEach(rec => {
      leastChildsMap.set(rec.poOrderSubLineId, rec)
    })
    return this.executeWithTransaction(async (transactionManager) => {
      const crtnItems = [];
      let crtnCompletedQty = 0;
      for (const [polyBagId, polyBagMap] of upcBarcodeAndQuantityMap) {
        for (const [size, qty] of polyBagMap) {
          const leastChild = leastChildsMap.get(size)
          if (!leastChild) {
            throw new ErrorResponse(36085, "Please Enter valid FG")
          }
          const ctnItemsE = new CrtnItemsEntity();
          ctnItemsE.leastAggregator = leastChild.leastAggregator;
          ctnItemsE.pmTCrtnId = scannedCartons.cartonId;
          ctnItemsE.leastChildId = leastChild.id;
          ctnItemsE.parentHierarchyId = scannedCartons.cartonProtoId;
          ctnItemsE.requiredQty = qty;
          ctnItemsE.color = leastChild.color ? leastChild.color : '';
          ctnItemsE.size = leastChild.size;
          ctnItemsE.productRef = leastChild.productRef;
          ctnItemsE.productCode = leastChild.productCode;
          ctnItemsE.productName = leastChild.productName;
          ctnItemsE.productType = leastChild.productType;
          ctnItemsE.upcBarcode = leastChildsMap.get(size).upcBarcode;
          ctnItemsE.ratio = leastChild.ratio;
          ctnItemsE.poLineId = leastChild.poLineId;
          ctnItemsE.poId = leastChild.poId;
          ctnItemsE.poOrderSubLineId = leastChild.poOrderSubLineId;
          ctnItemsE.createdUser = reqModel.username;
          ctnItemsE.unitCode = reqModel.unitCode;
          ctnItemsE.companyCode = reqModel.companyCode;
          ctnItemsE.completedQty = qty;
          crtnCompletedQty += qty;
          crtnItems.push(ctnItemsE)
        }
      };
      if (crtnCompletedQty !== scannedCartons.qty) {
        throw new ErrorResponse(52615, "Quantity Is Not Matched")
      }
      await transactionManager.getRepository(CrtnItemsEntity).save(crtnItems, { reload: false });
      const ctUp = new CrtnEntity();
      const scanEndTime = dayjs().format('YYYY-MM-DD H:mm:ss');
      ctUp['scanEndTime'] = scanEndTime;
      ctUp['packingStatus'] = PackingStatusEnum.COMPLETED;
      ctUp.completedQty = crtnCompletedQty;
      ctUp.id = scannedCartons.cartonId;
      ctUp.isScanned = true;
      await transactionManager.getRepository(CrtnEntity).save(ctUp)
      return new CommonResponse(true, 36088, "Scan Completed")
    })

  }


  async scanBarCodeToCartonPack(req: ScanToPackRequest): Promise<CommonResponse> {
    try {
      const leastChild = await this.configChild.findOne({ select: ['leastAggregator', 'poOrderSubLineId'], where: { id: req.leastChildId, companyCode: req.companyCode, unitCode: req.unitCode, upcBarcode: req.barcode } });
      if (leastChild) {
        throw new ErrorResponse(36080, "Please Provide Valid UPC");
      }
      const clp = await this.dataSource.getRepository(ConfigLeastAggregatorEntity).findOne({ select: ['count'], where: { id: leastChild.leastAggregator } })
      const cartonsItems = await this.cartonItemsRepo.findOne({ where: { pmTCrtnId: req.cartonId, leastChildId: req.leastChildId, companyCode: req.companyCode, unitCode: req.unitCode } });
      if (cartonsItems?.completedQty === (leastChild?.ratio * clp?.count)) {
        throw new ErrorResponse(2564, "This Fg Qty Already Mapped");
      };
      const itemsEn = new CrtnItemsEntity();
      itemsEn.companyCode = req.companyCode;
      itemsEn.unitCode = req.unitCode;
      itemsEn.pmTCrtnId = req.cartonId;
      itemsEn.requiredQty = leastChild.ratio * clp.count;
      itemsEn.leastChildId = req.leastChildId;
      itemsEn.completedQty = leastChild.ratio;
      itemsEn.color = leastChild.color;
      itemsEn.productRef = leastChild.productRef;
      itemsEn.productCode = leastChild.productCode;
      itemsEn.productName = leastChild.productName;
      itemsEn.productType = leastChild.productType;
      // const poSub = new PackOrderSubLineEntity();
      // poSub.id = req.sizeId
      itemsEn.poOrderSubLineId = req.sizeId;
      if (cartonsItems) {
        itemsEn.id = cartonsItems.id;
        itemsEn.completedQty = cartonsItems.completedQty + leastChild.ratio;
      };
      await this.cartonItemsRepo.save(itemsEn);
      return new CommonResponse(true, 36082, "Items Updated Successfully");
    } catch (error) {
      return new CommonResponse(false, error.errorCode, error.message);
    }

  }


  // Packing Inspection screen Api
  async getCartonDataForInspection(req: PoIdRequest): Promise<CartonDataResponse> {
    const data: CartonDataForEachPl[] = [];
    const packList = await this.configRepo.find({ where: { poId: req.poID, companyCode: req.companyCode, unitCode: req.unitCode } });

    for (const rec of packList) {
      const crtnData: CartonDataModel[] = []
      const cartonData = await this.cartonRepo.getCartonDataForInspection(rec.id)
      for (const rec of cartonData) {
        const cartonSummary = new CartonDataModel(rec.pack_job_no, rec.barcode, rec.item_code, rec.item_desc, rec.required_qty, rec.length, rec.width, rec.height, rec.buyer_address, rec.deliver_date, rec.ex_factory, undefined, rec.style, rec.inspection_pick)
        crtnData.push(cartonSummary)
      }
      const finalData = new CartonDataForEachPl(rec.plConfigNo, crtnData, rec.id)
      data.push(finalData);
    }
    return new CartonDataResponse(true, 36083, 'Data Retrieved Successfully', data)
  }


  async scanGarmentBarcode(req: UpcBarCodeReqDto): Promise<CommonResponse> {
    const transactionManager = new GenericTransactionManager(this.dataSource)
    try {
      const userData = { companyCode: req.companyCode, unitCode: req.unitCode, }
      const findCartons = await this.cartonRepo.findOne({ where: { id: req.cartonId, ...userData } });
      const findItems = await this.cartonItemsRepo.findOne({ where: { pmTCrtnId: req.cartonId, upcBarcode: req.upcBarCode, ...userData, leastAggregator: req.polyBagId } });
      await transactionManager.startTransaction()
      const ctnItemsE = new CrtnItemsEntity();
      if (findItems) {
        ctnItemsE.completedQty = findItems.completedQty + 1;
        ctnItemsE.requiredQty = findItems.requiredQty;
        ctnItemsE.id = findItems.id;
        ctnItemsE.updatedUser = req.username;
      } else {
        const leastChild = await this.configChild.findOne({ where: { upcBarcode: req.upcBarCode, parentHierarchyId: req.cartonProtoId, leastAggregator: req.polyBagId, ...userData } });
        if (!leastChild) {
          throw new ErrorResponse(36085, "Please Enter valid FG")
        }
        const clp = await this.dataSource.getRepository(ConfigLeastAggregatorEntity).findOne({ select: ['count'], where: { id: leastChild.leastAggregator } })
        ctnItemsE.leastAggregator = leastChild.leastAggregator;
        ctnItemsE.pmTCrtnId = findCartons.id;
        ctnItemsE.leastChildId = leastChild.id;
        ctnItemsE.parentHierarchyId = req.cartonProtoId;
        ctnItemsE.requiredQty = leastChild.ratio * clp.count;
        ctnItemsE.color = leastChild.color ? leastChild.color : '';
        ctnItemsE.productRef = leastChild.productRef ? leastChild.productRef : '';
        ctnItemsE.productCode = leastChild.productCode ? leastChild.productCode : '';
        ctnItemsE.productName = leastChild.productName ? leastChild.productName : '';
        ctnItemsE.productType = leastChild.productType ? leastChild.productType : '';
        ctnItemsE.size = leastChild.size;
        ctnItemsE.upcBarcode = req.upcBarCode;
        ctnItemsE.ratio = leastChild.ratio;
        ctnItemsE.poLineId = leastChild.poLineId;
        ctnItemsE.poId = leastChild.poId;
        ctnItemsE.poOrderSubLineId = leastChild.poOrderSubLineId;
        ctnItemsE.createdUser = req.username;
        ctnItemsE.unitCode = req.unitCode;
        ctnItemsE.companyCode = req.companyCode;
        ctnItemsE.completedQty = 1;
      }
      if (ctnItemsE.completedQty > ctnItemsE.requiredQty) {
        throw new ErrorResponse(36086, "You can not scan more than required quantity")
      }
      await transactionManager.getRepository(CrtnItemsEntity).save(ctnItemsE, { reload: false });
      const ctUp = new CrtnEntity();
      if (findCartons.packingStatus == PackingStatusEnum.OPEN) {
        const scanStartTime = dayjs().format('YYYY-MM-DD H:mm:ss');
        ctUp.scanStartTime = scanStartTime;
        ctUp['packingStatus'] = PackingStatusEnum.INPROGRESS;
      }
      if ((findCartons.requiredQty - (findCartons.completedQty + 1)) === 0) {
        const scanEndTime = dayjs().format('YYYY-MM-DD H:mm:ss');
        ctUp['scanEndTime'] = scanEndTime;
        ctUp['packingStatus'] = PackingStatusEnum.COMPLETED;
      }
      const cmtQty = findCartons.completedQty ? findCartons.completedQty + 1 : 1;
      ctUp.completedQty = cmtQty;
      ctUp.id = req.cartonId
      await transactionManager.getRepository(CrtnEntity).save(ctUp);
      await transactionManager.completeTransaction()
      return new CommonResponse(true, 36088, "Scan Completed")
    } catch (error) {
      console.log(error)
      await transactionManager.releaseTransaction()
      throw new Error(error)
    }

  }
  async scanGarmentBarcodeWithManger(req: UpcBarCodeReqDto, transactionManager: GenericTransactionManager): Promise<CommonResponse> {
    const userData = { companyCode: req.companyCode, unitCode: req.unitCode, }
    const findCartons = await transactionManager.getRepository(CrtnEntity).findOne({ where: { id: req.cartonId, ...userData } });
    const findItems = await transactionManager.getRepository(CrtnItemsEntity).findOne({ where: { pmTCrtnId: req.cartonId, upcBarcode: req.upcBarCode, ...userData, leastAggregator: req.polyBagId } });
    const ctnItemsE = new CrtnItemsEntity();
    if (findItems) {
      ctnItemsE.completedQty = findItems.completedQty + 1;
      ctnItemsE.requiredQty = findItems.requiredQty;
      ctnItemsE.id = findItems.id;
      ctnItemsE.updatedUser = req.username;
    } else {
      const leastChild = await this.configChild.findOne({ where: { upcBarcode: req.upcBarCode, parentHierarchyId: req.cartonProtoId, leastAggregator: req.polyBagId, ...userData } });
      if (!leastChild) {
        throw new ErrorResponse(36085, "Please Enter valid FG")
      }
      const clp = await transactionManager.getRepository(ConfigLeastAggregatorEntity).findOne({ select: ['count'], where: { id: leastChild.leastAggregator } })
      ctnItemsE.leastAggregator = leastChild.leastAggregator;
      ctnItemsE.pmTCrtnId = findCartons.id;
      ctnItemsE.leastChildId = leastChild.id;
      ctnItemsE.parentHierarchyId = req.cartonProtoId;
      ctnItemsE.requiredQty = leastChild.ratio * clp.count;
      ctnItemsE.color = leastChild.color ? leastChild.color : '';
      ctnItemsE.productRef = leastChild.productRef ? leastChild.productRef : '';
      ctnItemsE.productCode = leastChild.productCode ? leastChild.productCode : '';
      ctnItemsE.productName = leastChild.productName ? leastChild.productName : '';
      ctnItemsE.productType = leastChild.productType ? leastChild.productType : '';
      ctnItemsE.size = leastChild.size;
      ctnItemsE.upcBarcode = req.upcBarCode;
      ctnItemsE.ratio = leastChild.ratio;
      ctnItemsE.poLineId = leastChild.poLineId;
      ctnItemsE.poId = leastChild.poId;
      ctnItemsE.poOrderSubLineId = leastChild.poOrderSubLineId;
      ctnItemsE.createdUser = req.username;
      ctnItemsE.unitCode = req.unitCode;
      ctnItemsE.companyCode = req.companyCode;
      ctnItemsE.completedQty = 1;
    }
    if (ctnItemsE.completedQty > ctnItemsE.requiredQty) {
      throw new ErrorResponse(36086, "You can not scan more than required quantity")
    }
    const cartonItem = await transactionManager.getRepository(CrtnItemsEntity).save(ctnItemsE);
    console.log(cartonItem, 'kkkkkkkkkkkkkkkkkkk')
    if (req.externalFgBarcode && transactionManager) {
      const tempFgToItemMap = new TempFGToCartonItemsMapEntity();
      tempFgToItemMap.cartonItemId = cartonItem.id;
      tempFgToItemMap.fgBarcode = req.externalFgBarcode;
      tempFgToItemMap.crtId = req.cartonId;
      tempFgToItemMap.pslId = Number(req.upcBarCode);
      tempFgToItemMap.oslId = req.oslId;
      await transactionManager.getRepository(TempFGToCartonItemsMapEntity).save(tempFgToItemMap, { reload: false });
      await transactionManager.getRepository(FgEntity).update({ fgBarcode: req.externalFgBarcode }, { fgConsumptionStatus: PKMSFgConsumptionStatus.consumed })
    }
    const ctUp = new CrtnEntity();
    if (findCartons.packingStatus == PackingStatusEnum.OPEN) {
      const scanStartTime = dayjs().format('YYYY-MM-DD H:mm:ss');
      ctUp.scanStartTime = scanStartTime;
      ctUp['packingStatus'] = PackingStatusEnum.INPROGRESS;
    }
    if ((findCartons.requiredQty - (findCartons.completedQty + 1)) === 0) {
      const scanEndTime = dayjs().format('YYYY-MM-DD H:mm:ss');
      ctUp['scanEndTime'] = scanEndTime;
      ctUp['packingStatus'] = PackingStatusEnum.COMPLETED;
    }
    const cmtQty = findCartons.completedQty ? findCartons.completedQty + 1 : 1;
    ctUp.completedQty = cmtQty;
    ctUp.id = req.cartonId
    await transactionManager.getRepository(CrtnEntity).save(ctUp);
    return new CommonResponse(true, 36088, "Scan Completed")
  }

  async scanExtGarmentBarcode(req: ExtFgBarCodeReqDto): Promise<CommonResponse> {
    const transactionManager = new GenericTransactionManager(this.dataSource)
    try {
      const isFgExist = await this.dataSource.getRepository(FgEntity).findOne({ where: { fgBarcode: req.extFgBarCode } });
      if (!isFgExist) {
        throw new ErrorResponse(36085, "Please Enter valid FG")
      }
      if (isFgExist.fgConsumptionStatus != PKMSFgConsumptionStatus.open) {
        throw new ErrorResponse(36085, "FG is already consumed")
      }
      const pslId = await this.dataSource.getRepository(TempOSLRefToCartonMapEntity).find({ where: { crtId: req.cartonId, oslId: isFgExist.oslId, polyBagId: req.polyBagId } });
      if (pslId.length === 0) {
        throw new ErrorResponse(36085, "FG allocations are not done at for this carton");
      }
      console.log(pslId, 'llllllllllllllllll')
      let upcBarCode: string = null;
      await transactionManager.startTransaction();
      if (pslId.length == 1) {
        const upcBarCodeReq = new UpcBarCodeReqDto(String(pslId[0].pslId), req.cartonId, req.cartonProtoId, req.polyBagId, req.username, req.unitCode, req.companyCode, req.userId);
        upcBarCodeReq.oslId = isFgExist.oslId
        upcBarCodeReq.externalFgBarcode = req.extFgBarCode;
        console.log(upcBarCodeReq, 'upcBarCodeReq')
        await this.scanGarmentBarcodeWithManger(upcBarCodeReq, transactionManager);
        upcBarCode = String(pslId[0].pslId);
      } else {
        for (const psl of pslId) {
          const count = await transactionManager.getRepository(TempFGToCartonItemsMapEntity).count({ where: { crtId: req.cartonId, oslId: isFgExist.oslId } });
          if (count >= psl.allocatedFgQty) {
            continue;
          }
          const upcBarCodeReq = new UpcBarCodeReqDto(String(psl.pslId), req.cartonId, req.cartonProtoId, req.polyBagId, req.username, req.unitCode, req.companyCode, req.userId);
          upcBarCodeReq.oslId = isFgExist.oslId
          upcBarCodeReq.externalFgBarcode = req.extFgBarCode;
          await this.scanGarmentBarcodeWithManger(upcBarCodeReq, transactionManager);
          upcBarCode = String(psl.pslId);
          break;
        }
      }
      await transactionManager.completeTransaction();
      return new CommonResponse(true, 36088, "Scan Completed", { upcBarCode })
    } catch (error) {
      await transactionManager.releaseTransaction()
      throw new Error(error)
    }
  }


  async getPackListDropDown(req: CommonRequestAttrs): Promise<CommonResponse> {
    const data = await this.configRepo.find({ select: ['id', 'plConfigNo'], where: { companyCode: req.companyCode, unitCode: req.unitCode } })
    return new CommonResponse(true, 554, '', data)
  }


  async getPackListDetails(req: PackListIdRequest): Promise<CommonResponse> {
    const data = await this.configRepo.getPackListDetails(req)
    return new CommonResponse(true, 257, '', data)
  }

  async getPackListData(req: PackIdRequest): Promise<CommonResponse> {
    const data = [];
    const sizes = await this.configChild.getSizes(req);
    const reportData = await this.configChild.getReportData(req);
    const subLineQtyMap = new Map();
    for (const rec of reportData) {
      if (!subLineQtyMap.has(rec.po_order_sub_line_id)) {
        const subLineQty = await this.dataSource.createQueryBuilder(PKMSPoSubLineEntity, 'subLine').select(`SUM(subLine.qty) as orderQty`).where('subLine.id = :id', { id: rec.po_order_sub_line_id }).getRawOne();
        subLineQtyMap.set(rec.po_order_sub_line_id, subLineQty.orderQty ? Number(subLineQty.orderQty) : subLineQty.orderQty);
      }
      const obj = new PKMSPackListViewResponseDto(rec.sizeRatio, rec.ratio, rec.colorCode, rec.color, rec.block, rec.po_order_sub_line_id, subLineQtyMap.get(rec.po_order_sub_line_id), rec.no_of_cartons, rec.parent_hierarchy_id, rec.net_weight, rec.gross_weight, rec.length, rec.width, rec.height, (rec.ctn * rec.ratio), 0, rec.plId, rec.size, rec.country, rec.product_name)
      data.push(obj);
    }
    return new CommonResponse(true, 967, 'Data Retrieved Successfully', { data, columns: sizes });
  }

  async getPackListByPoId(req: PoIdRequest): Promise<CommonResponse> {
    const packListData = await this.configRepo.find({ select: ['id', 'plConfigNo'], where: { companyCode: req.companyCode, unitCode: req.unitCode, poId: req.poID } });
    return new CommonResponse(true, 56846, "Data Retrieved Successfully", packListData)
  };


  async getPackingDispatchInfoByPackListId(req: PKMSPackListIdsRequest): Promise<PKMSPackDispatchInfoResponse> {
    const userReq = { companyCode: req.companyCode, unitCode: req.unitCode };
    const packListData = (await this.getPackListInfoByPackListId(req)).data;
    const data: PKMSPackingDispatchPackListInfoModel[] = []
    for (const pkList of packListData) {
      const packJobsData: PKMSPackingDispatchPackJobsInfoModel[] = []
      for (const packJobs of pkList.packJobs) {
        const cartons = await this.dataSource.getRepository(CrtnEntity).find({ select: ['id', 'barcode', 'requiredQty'], where: { pkJobId: packJobs.packJobId, ...userReq } });
        const cartonsData: PKMSPackingDispatchCartonInfoModel[] = [];
        for (const carton of cartons) {
          const findIsFgInReqCartonsOrNot = await this.dataSource.getRepository(FgWhReqSubLinesEntity).findOne({ select: ['id'], where: { barcode: carton.barcode, ...userReq, status: FgWhRequestStatusEnum.LOCATION_IN } })
          if (findIsFgInReqCartonsOrNot) {
            cartonsData.push(new PKMSPackingDispatchCartonInfoModel(carton.requiredQty, carton.id, carton.barcode));
          }
        }
        if (!cartonsData?.length) {
          continue;
        }
        packJobsData.push(new PKMSPackingDispatchPackJobsInfoModel(packJobs.packListId, packJobs.packOrderId, cartonsData, packJobs.packJobNo, packJobs.packJobId, packJobs.attrs))
      }

      if (!packJobsData?.length) {
        continue;
      }
      data.push(new PKMSPackingDispatchPackListInfoModel(packJobsData, pkList.moId, pkList.packListId, pkList.packOrderId, pkList.packListDesc, pkList.plType, pkList.packListAttrs, pkList.totalCartons, pkList.isInFgWhLines))
    }

    return new PKMSPackDispatchInfoResponse(true, 967, "Data Retrieved Successfully", data)
  }




  async getPackOrderInfoByManufacturingOrderIds(req: PKMSManufacturingOrderIdRequest): Promise<PKMSPackOrderInfoResponse> {
    const findPackOrderIdRes = await this.pkmsProcessingRepo.getPackOrderIds(req.manufacturingOrderIds, req.unitCode, req.companyCode);
    if (!findPackOrderIdRes.id) {
      throw new ErrorResponse(36084, 'No pack orders exist for the selected Manufacturing Orders');
    }
    const packOrderIds = findPackOrderIdRes?.id?.split(',').map((rec) => Number(rec));
    const packOrderReq = new PKMSPackOrderIdRequest(req.username, req.unitCode, req.companyCode, req.userId, packOrderIds,
      req.iNeedPackLists,
      req.iNeedPackListAttrs,
      req.iNeedPackJobs,
      req.iNeedPackJobAttrs,
      req.iNeedCartons,
      req.iNeedCartonAttrs,
    );
    return await this.getPackOrderInfoByPackOrderId(packOrderReq)
  };



  async getPackOrderInfoByPackOrderId(req: PKMSPackOrderIdRequest): Promise<PKMSPackOrderInfoResponse> {
    const userReq = { companyCode: req.companyCode, unitCode: req.unitCode };
    const data: PKMSPackOrderInfoModel[] = [];
    const findPackOrders = await this.pkmsProcessingRepo.getPoOrderDes(req.packOrderIds, req.unitCode, req.companyCode);
    for (const packOrder of findPackOrders) {
      let packListInfo: PKMSPackListInfoModel[] = [];
      let packListIds = []
      if (req.iNeedPackLists) {
        if (req.iNeedFgWhOpenPackLists) {
          const findPackListIds = await this.configRepo.find({ select: ['id'], where: { poId: packOrder.id, ...userReq } });
          const modifiedPackListIds = findPackListIds.map(rec => rec.id);
          const findPackListIdsFromWh = await this.dataSource.getRepository(FgWhReqLinesEntity).find({ select: ['packListId'], where: { fgCompletedStatus: true, ...userReq } })
          const pklIdsOfWh = new Set<number>();
          findPackListIdsFromWh.map(rec => {
            pklIdsOfWh.add(rec.packListId)
          });
          for (const pkLId of modifiedPackListIds) {
            if (!pklIdsOfWh.has(pkLId)) {
              packListIds.push(pkLId)
            }
          }

        } else if (req.iNeedFgWhCompletedPackLists) {
          const findPackListIdsFromWh = await this.dataSource.getRepository(FgWhReqLinesEntity).find({ select: ['packListId'], where: { fgCompletedStatus: true, ...userReq } })
          packListIds = findPackListIdsFromWh.map(rec => rec.packListId);
        } else {
          const findPackListIds = await this.configRepo.find({ select: ['id'], where: { poId: packOrder.id, ...userReq } });
          packListIds = findPackListIds.map((rec) => rec.id);
        }
        if (packListIds.length) {
          const packListReq = new PKMSPackListIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, packListIds, req.iNeedPackListAttrs, req.iNeedPackJobs, req.iNeedPackJobAttrs, req.iNeedCartons, req.iNeedCartonAttrs, req?.iNeedScannedCartonsOnly);
          packListInfo = (await this.getPackListInfoByPackListId(packListReq)).data;
        }
      }
      data.push(new PKMSPackOrderInfoModel(packListInfo, packOrder.id, packOrder.description));
    }
    return new PKMSPackOrderInfoResponse(true, 967, "Data Retrieved Successfully", data);
  }

  async getPackListInfoByPackListId(req: PKMSPackListIdsRequest): Promise<PKMSPackListInfoResponse> {
    const userReq = { companyCode: req.companyCode, unitCode: req.unitCode };
    const data: PKMSPackListInfoModel[] = [];
    const packListData = await this.configRepo.getPackListInfoByPackList(req.packListIds, req.companyCode, req.unitCode);
    for (const packList of packListData) {
      const packJobs: PKMSPackJobsInfoModel[] = [];
      let packListAttrs;
      if (req.iNeedPackListAttrs) {
        const plProductNameAttrs = await this.packListReqAttributeRepo.find({ select: ['attributeValue'], where: { packListId: packList.id, attributeName: PKMSInspectionHeaderAttributesEnum.PRODUCT_NAME, ...userReq } })
        const moNosAttrs = await this.packListReqAttributeRepo.find({ select: ['attributeValue'], where: { packListId: packList.id, attributeName: PKMSInspectionHeaderAttributesEnum.MO_NO, ...userReq } })
        const vposAttrs = await this.packListReqAttributeRepo.find({ select: ['attributeValue'], where: { packListId: packList.id, attributeName: PKMSInspectionHeaderAttributesEnum.PO_NO, ...userReq } })
        const destinationsAttrs = await this.packListReqAttributeRepo.find({ select: ['attributeValue'], where: { packListId: packList.id, attributeName: PKMSInspectionHeaderAttributesEnum.DESTINATIONS, ...userReq } })
        const delDatesAttrs = await this.packListReqAttributeRepo.find({ select: ['attributeValue'], where: { packListId: packList.id, attributeName: PKMSInspectionHeaderAttributesEnum.PLANNED_DELIVERY_DATE, ...userReq } })
        const stylesAttrs = await this.packListReqAttributeRepo.find({ select: ['attributeValue'], where: { packListId: packList.id, attributeName: PKMSInspectionHeaderAttributesEnum.STYLE_NO, ...userReq } })
        const buyersAttrs = await this.packListReqAttributeRepo.find({ select: ['attributeValue'], where: { packListId: packList.id, attributeName: PKMSInspectionHeaderAttributesEnum.BUYER, ...userReq } })
        const plannedDeliveryDate = await this.packListReqAttributeRepo.find({ select: ['attributeValue'], where: { packListId: packList.id, attributeName: PKMSInspectionHeaderAttributesEnum.PLANNED_DELIVERY_DATE, ...userReq } })
        const slNo = await this.packListReqAttributeRepo.find({ select: ['attributeValue'], where: { packListId: packList.id, attributeName: PKMSInspectionHeaderAttributesEnum.MANUFACTURING_LINE_NO, ...userReq } })
        const plProductsSet = new Set<string>();
        const moNosSet = new Set<string>();
        const vposSet = new Set<string>();
        const destinationsSet = new Set<string>();
        const delDatesSet = new Set<string>();
        const stylesSet = new Set<string>();
        const buyersSet = new Set<string>();
        plProductNameAttrs.forEach((rec) => rec.attributeValue.split(',').forEach(rec => plProductsSet.add(rec)));
        moNosAttrs.forEach((rec) => rec.attributeValue.split(',').forEach(rec => moNosSet.add(rec)));
        vposAttrs.forEach((rec) => rec.attributeValue.split(',').forEach(rec => vposSet.add(rec)));
        destinationsAttrs.forEach((rec) => rec.attributeValue.split(',').forEach(rec => destinationsSet.add(rec)));
        delDatesAttrs.forEach((rec) => rec.attributeValue.split(',').forEach(rec => delDatesSet.add(rec)));
        stylesAttrs.forEach((rec) => rec.attributeValue.split(',').forEach(rec => stylesSet.add(rec)));
        buyersAttrs.forEach((rec) => rec.attributeValue.split(',').forEach(rec => buyersSet.add(rec)));
        packListAttrs = new PKMSPackListAttrsModel([...plProductsSet], [...moNosSet], [...vposSet], [...destinationsSet], [...delDatesSet], [...stylesSet], [...buyersSet],)
      };
      if (req.iNeedPackJobs) {
        let cartons;
        // const plConfigEnt = new PLConfigEntity();
        // plConfigEnt.id = packList.id;
        const packJobsData = await this.jobHeader.find({ select: ['id', 'jobNumber'], where: { packList: packList.id, ...userReq } });
        for (const packJob of packJobsData) {
          let packJobAttributes;
          if (req.iNeedPackJobAttrs) {
            const plProductNameAttrs = await this.packJobReqAttributeRepo.find({ select: ['attributeValue'], where: { packJobId: packJob.id, attributeName: PKMSInspectionHeaderAttributesEnum.PRODUCT_NAME, ...userReq } })
            const moNosAttrs = await this.packJobReqAttributeRepo.find({ select: ['attributeValue'], where: { packJobId: packJob.id, attributeName: PKMSInspectionHeaderAttributesEnum.MO_NO, ...userReq } })
            const vposAttrs = await this.packJobReqAttributeRepo.find({ select: ['attributeValue'], where: { packJobId: packJob.id, attributeName: PKMSInspectionHeaderAttributesEnum.PO_NO, ...userReq } })
            const destinationsAttrs = await this.packJobReqAttributeRepo.find({ select: ['attributeValue'], where: { packJobId: packJob.id, attributeName: PKMSInspectionHeaderAttributesEnum.DESTINATIONS, ...userReq } })
            const delDatesAttrs = await this.packJobReqAttributeRepo.find({ select: ['attributeValue'], where: { packJobId: packJob.id, attributeName: PKMSInspectionHeaderAttributesEnum.PLANNED_DELIVERY_DATE, ...userReq } })
            const stylesAttrs = await this.packJobReqAttributeRepo.find({ select: ['attributeValue'], where: { packJobId: packJob.id, attributeName: PKMSInspectionHeaderAttributesEnum.STYLE_NO, ...userReq } })
            const buyersAttrs = await this.packJobReqAttributeRepo.find({ select: ['attributeValue'], where: { packJobId: packJob.id, attributeName: PKMSInspectionHeaderAttributesEnum.BUYER, ...userReq } })
            const plannedDeliveryDate = await this.packJobReqAttributeRepo.find({ select: ['attributeValue'], where: { packJobId: packJob.id, attributeName: PKMSInspectionHeaderAttributesEnum.PLANNED_DELIVERY_DATE, ...userReq } })
            const manufactringNo = await this.packJobReqAttributeRepo.find({ select: ['attributeValue'], where: { packJobId: packJob.id, attributeName: PKMSInspectionHeaderAttributesEnum.MANUFACTURING_LINE_NO, ...userReq } })
            const plProductsSet = new Set<string>();
            const moNosSet = new Set<string>();
            const vposSet = new Set<string>();
            const destinationsSet = new Set<string>();
            const delDatesSet = new Set<string>();
            const stylesSet = new Set<string>();
            const buyersSet = new Set<string>();
            plProductNameAttrs.forEach((rec) => plProductsSet.add(rec.attributeValue));
            moNosAttrs.forEach((rec) => moNosSet.add(rec.attributeValue));
            vposAttrs.forEach((rec) => vposSet.add(rec.attributeValue));
            destinationsAttrs.forEach((rec) => destinationsSet.add(rec.attributeValue));
            delDatesAttrs.forEach((rec) => delDatesSet.add(rec.attributeValue));
            stylesAttrs.forEach((rec) => stylesSet.add(rec.attributeValue));
            buyersAttrs.forEach((rec) => buyersSet.add(rec.attributeValue));
            packJobAttributes = new PKMSPackJobAttrsModel([...plProductsSet], [...moNosSet], [...vposSet], [...destinationsSet], [...delDatesSet], [...stylesSet], [...buyersSet],)
          };
          if (req.iNeedCartons) {
            const protoTypeIds = await this.dataSource.getRepository(CrtnEntity).find({ select: ['id'], where: { pkJobId: packJob.id, ...userReq } });
            const cartonIds = protoTypeIds.map((rec) => rec.id);
            const cartonReq = new PKMSCartonIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, cartonIds, req.iNeedCartonAttrs, req?.iNeedScannedCartonsOnly);
            cartons = (await this.getCartonsByCartonId(cartonReq)).data
          }
          const findPackListNo = await this.configRepo.findOne({ select: ['plConfigNo'], where: { id: req.packListIds[0] } })
          const findPackOrderNo = await this.pKMSProcessingOrderRepository.findOne({ select: ['prcOrdDescription'], where: { id: Number(packList.po_id) } })

          packJobs.push(new PKMSPackJobsInfoModel(packList.id, Number(packList.po_id), cartons, packJob.jobNumber, packJob.id, packJobAttributes, findPackListNo.plConfigNo, findPackOrderNo.prcOrdDescription));
        }
      }
      const isExistedPkOrNot = await this.dataSource.getRepository(FgWhReqLinesEntity).findOne({ select: ['fgCompletedStatus'], where: { packListId: packList.id, ...userReq } });
      // const plType = await this.plTypeRepo.findOne({select:['packMethod'], where: { id: packList.pk_type_id }});
      const moNumber = await this.dataSource.getRepository(PKMSPoLineEntity).findOne({ select: ['moId'], where: { poId: packList.po_id, ...userReq } })
      data.push(new PKMSPackListInfoModel(packJobs, moNumber.moId, packList.id, Number(packList.po_id), packList.plConfigNo, PackingMethodsEnum.MCMS, packListAttrs, packList.noOfCartons, Boolean(isExistedPkOrNot?.fgCompletedStatus)))
    }
    return new PKMSPackListInfoResponse(true, 967, "Data Retrieved Successfully", data)
  };


  async getCartonsByCartonId(req: PKMSCartonIdsRequest): Promise<PKMSCartonInfoResponse> {
    const userReq = { companyCode: req.companyCode, unitCode: req.unitCode };
    const data: PKMSCartonInfoModel[] = [];
    const whereClause: any = { id: In(req.cartonIds), ...userReq }
    if (req.iNeedScannedCartonsOnly) {
      whereClause.packingStatus = String(PackingStatusEnum.COMPLETED)
    }
    const findCartonsData = await this.dataSource.getRepository(CrtnEntity).find({ select: ['id', 'barcode', 'cartonProtoId', 'pkConfigId', 'pkJobId', 'poId', 'requiredQty', 'style', 'netWeight', 'grossWeight'], where: whereClause });
    const attributeMAp = new Map<number, PKMSCartonAttrsModel>();
    if (req.iNeedCartonAttrs) {
      const protoTypeIds = await this.cartonRepo.getGroupedProtoTypeIds(req.cartonIds, req.companyCode, req.unitCode);
      for (const protoId of protoTypeIds) {
        const attributeObj = new PKMSCartonAttrsModel(undefined, undefined, undefined, undefined, undefined)
        const attributes = await this.cartonReqAttributeRepo.find({ select: ['attributeName', 'attributeValue'], where: { cartonRequestId: protoId, ...userReq } });
        for (const attribute of attributes) {
          let attributeValue = attribute.attributeValue;
          switch (attribute.attributeName) {
            case PKMSInspectionHeaderAttributesEnum.COLOR:
              attributeObj.col = attributeValue;
              break;
            case PKMSInspectionHeaderAttributesEnum.SIZE:
              attributeObj.sz = attributeValue;
              break;
            case PKMSInspectionHeaderAttributesEnum.QTY:
              attributeObj.qty = Number(attributeValue);
              break;
            case PKMSInspectionHeaderAttributesEnum.PRODUCT_NAME:
              attributeObj.pName = attributeValue;
              break;
            case PKMSInspectionHeaderAttributesEnum.MANUFACTURING_ORDER_NO:
              attributeObj.moLine = attributeValue as any;
              break;
            default:
              // Optional: Handle cases where the attributeName doesn't match any expected value
              break;
          }

        }
        if (!attributeMAp.has(Number(protoId))) {
          attributeMAp.set(Number(protoId), attributeObj)
        }
      }
    }
    for (const carton of findCartonsData) {
      let cartonAttrs: PKMSCartonAttrsModel;
      if (req.iNeedCartonAttrs) {
        cartonAttrs = attributeMAp.get(carton.cartonProtoId)
      }
      const isFgWhCartonId = await this.dataSource.getRepository(FgWhReqSubLinesEntity).exist({ where: { ...userReq, barcode: carton.barcode } })
      data.push(new PKMSCartonInfoModel(carton.pkConfigId, carton.poId, carton.requiredQty, carton.id, carton.barcode, [cartonAttrs], isFgWhCartonId, carton.style, carton.netWeight, carton.grossWeight))
    }

    return new PKMSCartonInfoResponse(true, 967, "Data Retrieved Successfully", data)
  }

  async getBarcodeHeadInfo(req: CartonBarcodeRequest): Promise<CartonHeadInfoResponse> {
    const userReq = { companyCode: req.companyCode, unitCode: req.unitCode };
    const protoId = await this.dataSource.getRepository(CrtnEntity).findOne({ select: ['barcode', 'packingStatus'], where: { ...userReq, barcode: req.barcode } })
    const attributeObj = new CartonHeadInfoModel(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, req.barcode)
    const attributesData = await this.cartonReqAttributeRepo.find({ select: ['attributeName', 'attributeValue'], where: { cartonRequestId: protoId.cartonProtoId, ...userReq } });
    for (const attributeData of attributesData) {
      this.assignObjectKeyValues(attributeObj, attributeData.attributeName, attributeData.attributeValue);
    }
    // attributeObj.status = String(protoId.packingStatus)
    attributeObj.pendingCartonsForFgIn = 0
    attributeObj.pendingCartonsForFgOut = 0

    const data = {}
    return new CartonHeadInfoResponse(true, 967, "Data Retrieved Successfully", attributeObj)
  }
  assignObjectKeyValues(attributeObj: CartonHeadInfoModel, attributeName, attributeValue) {
    switch (attributeName) {
      case PKMSInspectionHeaderAttributesEnum.MO_NO:
        attributeObj.mo = attributeValue;
        break;
      case PKMSInspectionHeaderAttributesEnum.MANUFACTURING_ORDER_NO:
        attributeObj.moLine = attributeValue as any;
        break;
      case PKMSInspectionHeaderAttributesEnum.PO_NO:
        attributeObj.buyerPo = attributeValue;
        break;
      case PKMSInspectionHeaderAttributesEnum.CUSTOMER_STYLE:
        attributeObj.customerName = attributeValue;
        break;
      case PKMSInspectionHeaderAttributesEnum.STYLE_NO:
        attributeObj.style = attributeValue;
        break;
      case PKMSInspectionHeaderAttributesEnum.QTY:
        attributeObj.cartonQty = Number(attributeValue);
        break;
      case PKMSInspectionHeaderAttributesEnum.PLANNED_DELIVERY_DATE:
        attributeObj.plannedDeliveryDate = attributeValue;
        break;
      case PKMSInspectionHeaderAttributesEnum.DESTINATIONS:
        attributeObj.destination = attributeValue;
        break;
      default:
        break;
    }
    return attributeObj;
  };

  async getCartonTrackInfo(req: CartonBarcodeRequest): Promise<CartonTrackInfoResp> {
    const userReq = { unitCode: req.unitCode, companyCode: req.companyCode }
    const data: CartonTrackInfoModel[] = [];

    //CARTON_REPORTING;
    const cartons = await this.dataSource.getRepository(CrtnEntity).findOne({ select: ['scanStartTime', 'scanEndTime', 'remarks', 'id', 'pkConfigId'], where: { barcode: req.barcode, ...userReq } })
    if (cartons) {
      const cartonStatus = this.statusBasedOnStartTimeAndEndTime(cartons?.scanStartTime, cartons?.scanEndTime)
      data.push(new CartonTrackInfoModel(CartonStatusTrackingEnum.CARTON_REPORTING, cartons?.remarks, cartonStatus, cartons?.scanStartTime, cartons?.scanEndTime))
      //INSPECTION
      const inspections = await this.dataSource.getRepository(PackInsRequestItemEntity).findOne({ select: ['insStartedAt', 'insCompletedAt', 'remarks'], where: { phItemLinesId: cartons.id, ...userReq } });
      const insStatus = this.statusBasedOnStartTimeAndEndTime(inspections?.insStartedAt, inspections?.insCompletedAt)
      data.push(new CartonTrackInfoModel(CartonStatusTrackingEnum.INSPECTION, inspections?.remarks, insStatus, dayjs(inspections?.insStartedAt).format('YYYY-MM-DD H:mm:ss'), dayjs(inspections?.insCompletedAt).format('YYYY-MM-DD H:mm:ss')));

      //FG_WAREHOUSE_IN 
      const fgWareHouseIn = await this.dataSource.getRepository(FgWhReqSubLinesEntity).findOne({ select: ['scanStartTime', 'scanEndTime', 'remarks'], where: { barcode: req.barcode, ...userReq, status: FgWhRequestStatusEnum.FG_IN } });
      const fgWhStatus = this.statusBasedOnStartTimeAndEndTime(fgWareHouseIn?.scanStartTime, fgWareHouseIn?.scanEndTime)
      data.push(new CartonTrackInfoModel(CartonStatusTrackingEnum.FG_WAREHOUSE_IN, inspections?.remarks, fgWhStatus, String(fgWareHouseIn?.scanStartTime), String(fgWareHouseIn?.scanEndTime)));

      // PALLETIZATION======>
      const palletization = await this.dataSource.getRepository(FGContainerCartonMapEntity).findOne({ select: ['createdAt', 'remarks', 'confirmedContainerId'], where: { itemLinesId: cartons.id, ...userReq } })
      data.push(new CartonTrackInfoModel(CartonStatusTrackingEnum.PALLETIZATION, palletization?.remarks, palletization ? CartonStatusEnum.COMPLETED : CartonStatusEnum.OPEN, palletization?.createdAt ? dayjs(palletization?.createdAt).format('YYYY-MM-DD H:mm:ss') : '', ''));

      // LOCATION_MAPPING======>
      const cartonMapping = await this.dataSource.getRepository(FGContainerLocationMapEntity).findOne({ select: ['createdAt', 'remarks', 'confirmedLocationId'], where: { containerId: palletization?.confirmedContainerId } })
      data.push(new CartonTrackInfoModel(CartonStatusTrackingEnum.LOCATION_MAPPING, cartonMapping?.remarks, cartonMapping?.confirmedLocationId ? CartonStatusEnum.COMPLETED : CartonStatusEnum.OPEN, cartonMapping?.createdAt ? dayjs(cartonMapping?.createdAt).format('YYYY-MM-DD H:mm:ss') : '', ''));

      // FG_WAREHOUSE_OUT
      const fgWareHouseOut = await this.dataSource.getRepository(FgWhReqSubLinesEntity).findOne({ select: ['scanStartTime', 'scanEndTime', 'remarks'], where: { barcode: req.barcode, ...userReq, status: FgWhRequestStatusEnum.FG_Out } });
      const fgWhOutStatus = this.statusBasedOnStartTimeAndEndTime(fgWareHouseOut?.scanStartTime, fgWareHouseOut?.scanEndTime)
      data.push(new CartonTrackInfoModel(CartonStatusTrackingEnum.FG_WAREHOUSE_OUT, fgWareHouseOut?.remarks, fgWhOutStatus, fgWareHouseOut?.scanStartTime, fgWareHouseOut?.scanEndTime));

      // DISPATCH======>
      const dispatch = await this.pkShippingRequestService.getShippingDispatchStatus(new PKMSPackListIdReqDto(req.username, req.unitCode, req.companyCode, req.userId, cartons.pkConfigId))
      if (dispatch.status) {
        const dis = dispatch.data
        data.push(new CartonTrackInfoModel(CartonStatusTrackingEnum.DISPATCH, dis?.remarks, CartonStatusEnum.COMPLETED, dis?.inTime, ''));
      } else {
        data.push(new CartonTrackInfoModel(CartonStatusTrackingEnum.DISPATCH, '', CartonStatusEnum.OPEN, '', ''));
      }
      return new CartonTrackInfoResp(true, 967, "Data Retrieved Successfully", data);
    } else {
      throw new ErrorResponse(36088, "There Is Cartons Against To This Barcode");
    }


  }

  statusBasedOnStartTimeAndEndTime(scanStartTime, scanEndTime): CartonStatusEnum {
    let cartonStatus: CartonStatusEnum;
    if (scanStartTime === null && scanEndTime === null) {
      cartonStatus = CartonStatusEnum.OPEN
    } else if (scanStartTime && scanEndTime === null) {
      cartonStatus = CartonStatusEnum.INPROGRESS
    } else if (scanStartTime && scanEndTime) {
      cartonStatus = CartonStatusEnum.COMPLETED
    } else {
      cartonStatus = CartonStatusEnum.NA
    }
    return cartonStatus
  }

  async getCartonWeightDetails(pkListReq: PackingListIdRequest): Promise<PlCartonWeightResponse> {
    const packListDetails = await this.configRepo.getPackingListDataById(
      pkListReq.packListId
    );
    if (!packListDetails) {
      throw new ErrorResponse(36073, 'Data not available',);
    }
    const plCreModel: PlCartonWeightModel = new PlCartonWeightModel(packListDetails.configId, packListDetails.pl_config_no, packListDetails.pl_config_desc, packListDetails.PoId, packListDetails.processing_serial, packListDetails.delivery_date, packListDetails.quantity, packListDetails.SpecId, packListDetails.pk_type_id, packListDetails.pack_method, packListDetails.no_of_cartons, packListDetails.pack_job_qty, packListDetails.no_of_cartons / packListDetails.pack_job_qty, [], packListDetails.company_code, packListDetails.unit_code, pkListReq.userId, packListDetails.created_user);
    const pLConfigParents = await this.cartonProto.getCartonProto(packListDetails.configId)
    for (const cartonProto of pLConfigParents) {
      const itemData = await this.itemsRepo.findOne({ where: { id: cartonProto.item_id } })
      const cartonProtoModel = new CartonPrototypeWeightModel(cartonProto.carton_parent_hierarchy_id, cartonProto.item_id, cartonProto.box_map_id, itemData.code, cartonProto.no_of_p_bags, cartonProto.count, cartonProto.net_weight, cartonProto.gross_weight, []);
      const cartons = await this.cartonRepo.find({ where: { cartonProtoId: cartonProto.carton_parent_hierarchy_id } });
      for (const carton of cartons) {
        cartonProtoModel.cartons.push(new CartonWeightModel(carton.id, carton.barcode, carton.netWeight, carton.grossWeight));
      }
      plCreModel.cartonProtoModels.push(cartonProtoModel);
    }
    return new PlCartonWeightResponse(true, 36089, 'Carton information retrieved successfully', plCreModel);
  }

  async upDateCartonWeightDetails(plCartonWeightModel: PlCartonWeightModel): Promise<CommonResponse> {
    return this.executeWithTransaction(async (transactionManager) => {
      for (const cartonProto of plCartonWeightModel.cartonProtoModels) {
        await transactionManager.getRepository(CartonParentHierarchyEntity).update({ id: cartonProto.id }, { netWeight: cartonProto.netWeight, grossWeight: cartonProto.grossWeight });
        for (const carton of cartonProto.cartons) {
          await transactionManager.getRepository(CrtnEntity).update({ id: carton.id }, { netWeight: carton.netWeight, grossWeight: carton.grossWeight });
        }
      }
      return new CommonResponse(true, 36090, 'Carton weight details successfully');
    })
  }

  getNonIntersectingElements(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(element => !set2.has(element));
  }



  async getOMSItemsForPKMS(req: MoNumberResDto): Promise<CommonResponse> {
    const processingSubLineRecords = await this.dataSource.getRepository(PKMSProductSubLineFeaturesEntity).findOne({ select: ['processingSerial'], where: { moNumber: req.moNumber } })
    const moSubLines = await this.poSubLineLineRepo.find({ where: { processingSerial: processingSubLineRecords.processingSerial }, select: ['moProductSubLineId', 'productCode', 'fgColor'] });
    const moSubLineIds = new Set<number>();
    const productCodes = new Set<string>();
    const fgColors = new Set<string>();
    for (const moSubLine of moSubLines) {
      moSubLineIds.add(moSubLine.moProductSubLineId);
      productCodes.add(moSubLine.productCode);
      fgColors.add(moSubLine.fgColor);
    }
    const routingDetails = await this.getRoutingInfoForMOSubLineIds(ProcessTypeEnum.PACK, Array.from(moSubLineIds), req.companyCode, req.unitCode);
    const bomItemMap = new Map<string, MOC_OpRoutingBomList>();
    for (const productCode of productCodes) {
      for (const fgColor of fgColors) {
        const opRouting = routingDetails.get(productCode).get(fgColor);
        for (const eachProcessType of opRouting.processTypesList) {
          for (const eachProcessJobGroup of eachProcessType.subProcessList) {
            for (const eachBom of eachProcessJobGroup.bomList) {
              if (!bomItemMap.has(eachBom.bomItemCode)) {
                bomItemMap.set(eachBom.bomItemCode, eachBom);
              }
            }
          }
        }
      }
    }

    const items = [];
    const packBpm = [];
    for (const [bomItemCode, eachBom] of bomItemMap.entries()) {
      const findExistedItem = await this.dataSource.getRepository(ItemsEntity).findOne({ where: { code: eachBom.bomItemCode, companyCode: req.companyCode, unitCode: req.unitCode } });
      if (!findExistedItem) {
        items.push({ code: eachBom.bomItemCode, desc: eachBom.bomItemDesc });
      } else {
        const packOrderId = await this.dataSource.getRepository(PKMSProcessingOrderEntity).findOne({ where: { processingSerial: Number(req.packSerial) } });
        const findExistedBom = await this.dataSource.getRepository(PackOrderBomEntity).count({ where: { packOrderId: packOrderId.id, bomId: findExistedItem.id } });
        if (!findExistedBom) {
          const pkBom = new PackOrderBomEntity();
          pkBom.packOrderId = packOrderId.id;
          pkBom.bomId = findExistedItem.id;
          pkBom.companyCode = req.companyCode;
          pkBom.unitCode = req.unitCode;
          pkBom.createdUser = req.username;
          packBpm.push(pkBom);
        }
      }
    };
    if (packBpm.length) {
      await this.dataSource.getRepository(PackOrderBomEntity).save(packBpm);
    }
    return new CommonResponse(true, 6541, 'Items Retrieved Successfully', items);
  }

};