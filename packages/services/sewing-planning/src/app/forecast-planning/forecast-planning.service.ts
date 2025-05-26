import { Injectable, NotFoundException } from "@nestjs/common";
import { ForecastPlanningRepo } from "./forecast-planning.repository";
import { ForecastPlanDto } from "./forecast-planning.dto";
import { ActualPlannedMinutesResponse, ForecastPlanYearDataResponse, ForecastPlanYearModel, ForecastPlanYearMonthModel, ForecastPlanYearMonthResponse, ForecastPlanYearResponse, ForecastQtyUpdateRequest, ForecastYearDataRequest, ForecastYearMonthRequest, ForecastYearRequest, GlobalResponseObject, IModuleIdRequest, LocationDataByDateRequest, ModuleIdRequest, P_LocationCodeRequest } from "@xpparel/shared-models";
import { ForecastPlanEntity } from "./forecast-planning.entity";

@Injectable()
export class ForecastPlanningService {
  constructor(private forecastPlanningRepo: ForecastPlanningRepo) { }

  async saveForecastPlan(data: ForecastPlanDto[]): Promise<GlobalResponseObject> {
    try {
      if (!Array.isArray(data)) {
        throw new Error('Invalid data: Expected an array of ForecastPlanDto.');
      }

      const entityArray: ForecastPlanEntity[] = []
      const forecastPlanEntities = data.map((item) => {
        const forecastPlan = new ForecastPlanEntity();
        forecastPlan.companyCode = item.companyCode;
        forecastPlan.unitCode = item.unitCode;
        forecastPlan.module = item.module;
        forecastPlan.workstationCode = item.workstationCode;
        forecastPlan.styleOrMo = item.styleOrMo;
        forecastPlan.scheduleOrMoLine = item.scheduleOrMoLine;
        forecastPlan.color = item.color;
        forecastPlan.planCutDate = item.planCutDate ? new Date(item.planCutDate) : null;
        forecastPlan.planDelDate = item.planDelDate ? new Date(item.planDelDate) : null;
        forecastPlan.planPcs = item.planPcs;
        forecastPlan.planSah = item.planSah ?? null;
        forecastPlan.smv = item.smv ?? null;
        forecastPlan.planSmo = item.planSmo ?? null;
        forecastPlan.planEff = item.planEff ?? null;
        forecastPlan.planType = item.planType;
        forecastPlan.planDate = new Date(item.date);

        entityArray.push(forecastPlan)
      });

      await this.forecastPlanningRepo.save(entityArray);
      return new GlobalResponseObject(true, 26005, 'forecast data saved successfully');
    } catch (error) {
      console.error('Error saving forecast plan:', error);
      return new GlobalResponseObject(false, 0, error.message || error);
    }
  }

  async getForecastStatusByYearAndMonth(req: ForecastYearMonthRequest): Promise<ForecastPlanYearMonthResponse> {
    try {
      const { year, month } = req;

      if (!year || !month || isNaN(Number(year)) || isNaN(Number(month))) {
        throw new Error('Invalid year or month provided');
      }

      const startDate = new Date(Number(year), Number(month) - 1, 2);
      const endDate = new Date(Number(year), Number(month), 0);

      const forecastPlans = await this.forecastPlanningRepo.findForecastPlansByYearAndMonth(startDate, endDate, req.companyCode, req.unitCode);

      const uploadedDates = new Set(
        forecastPlans.map(forecast => new Date(forecast.planDate).toISOString().split('T')[0])
      );

      const allDates = Array.from({ length: endDate.getDate() }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return date;
      });

      const forecastStatus: ForecastPlanYearMonthModel[] = allDates.map(date => {
        const isUploaded = uploadedDates.has(new Date(date).toISOString().split('T')[0]);
        const forecast = forecastPlans.find(f => new Date(f.planDate).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]);

        if (forecast) {
          return new ForecastPlanYearMonthModel(
            date.toISOString().split('T')[0],
            isUploaded,
            forecast.companyCode,
            forecast.unitCode,
            forecast.module,
            forecast.workstationCode,
            forecast.styleOrMo,
            forecast.scheduleOrMoLine,
            forecast.color,
            forecast.planCutDate,
            forecast.planDelDate,
            forecast.planPcs,
            forecast.planSah,
            forecast.smv,
            forecast.planSmo,
            forecast.planEff,
            forecast.planType,
            forecast.forecastQty
          );
        }
        return null;
      }).filter(forecast => forecast !== null);
      return new ForecastPlanYearMonthResponse(true, 1, 'Forecast status fetched successfully', forecastStatus);
    } catch (error) {
      console.error('Error fetching forecast status:', error);
      return new ForecastPlanYearMonthResponse(false, 0, 'Error fetching forecast status', []);
    }
  }

  async updateForecastQty(requestData: ForecastQtyUpdateRequest | ForecastQtyUpdateRequest[]): Promise<GlobalResponseObject> {
    try {
      if (!Array.isArray(requestData)) {
        requestData = [requestData];
      }

      for (const request of requestData) {
        const { planDate, forecastQty, companyCode, unitCode } = request;
        const forecastRecord = await this.forecastPlanningRepo.findOne({ where: { planDate, companyCode, unitCode } });
        if (!forecastRecord) {
          throw new NotFoundException(
            `No forecast plan found for the date: ${planDate}`
          );
        }

        forecastRecord.forecastQty = forecastQty;
        await this.forecastPlanningRepo.save(forecastRecord);
      }

      return new GlobalResponseObject(true, 0, "Update successful");
    } catch (error) {
      console.error("Error updating forecast quantity:", error);
      return new GlobalResponseObject(false, 1, `Update failed: ${error.message}`);
    }
  }

  async getForecastDatesByYear(req: ForecastYearRequest): Promise<ForecastPlanYearResponse> {
    try {
      const { year, companyCode, unitCode } = req;

      if (!year || isNaN(Number(year))) {
        throw new Error('Invalid year provided');
      }

      const startDate = new Date(Number(year), 0, 1);
      const endDate = new Date(Number(year), 11, 31);

      const forecastPlans = await this.forecastPlanningRepo.findForecastPlansByYear(startDate, endDate, companyCode, unitCode);

      const uploadedDates = new Set(
        forecastPlans.map(forecast => new Date(forecast.planDate).toISOString().split('T')[0])
      );

      const allDates = Array.from({ length: 365 + (this.isLeapYear(Number(year)) ? 1 : 0) }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return date;
      });

      const forecastData: ForecastPlanYearModel[] = allDates.map(date => {
        const isUploaded = uploadedDates.has(new Date(date).toISOString().split('T')[0]);
        const forecast = forecastPlans.find(f => new Date(f.planDate).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]);

        if (forecast) {
          return new ForecastPlanYearModel(date.toISOString().split('T')[0], isUploaded, forecast.companyCode, forecast.unitCode);
        }
        return null;
      }).filter(forecast => forecast !== null);

      return new ForecastPlanYearResponse(true, 1, 'Forecast status fetched successfully', forecastData);
    } catch (error) {
      console.error('Error fetching forecast status:', error);
      return new ForecastPlanYearResponse(false, 0, 'Error fetching forecast status', []);
    }
  }

  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  async getForecastPlansByDate(req: ForecastYearDataRequest): Promise<ForecastPlanYearDataResponse> {
    try {
      const forecastPlans = await this.forecastPlanningRepo.getForecastPlansByDate(req.year, req.month, req.planDate, req.companyCode, req.unitCode);

      if (!forecastPlans || forecastPlans.length === 0) {
        throw new NotFoundException('No forecast plans found for the given criteria');
      }

      return new ForecastPlanYearDataResponse(true, 1, 'Forecast plans fetched successfully', forecastPlans);
    } catch (error) {
      console.error('Error fetching forecast plans by date:', error);
      throw new Error(`Error fetching forecast plans by date: ${error.message}`);
    }
  }

  async getForecastDataByLocationCode(req: LocationDataByDateRequest): Promise<ActualPlannedMinutesResponse> {
    try {
      const forecastData = await this.forecastPlanningRepo.getForecastDataByLocationCode(
        req.locationCode, req.plannedDate, req.unitCode, req.companyCode
      );
      if (!forecastData || forecastData.length === 0) {
        throw new NotFoundException(`No Actual Planning Minutes found for the given ${req.locationCode}`);
      }
      return new ActualPlannedMinutesResponse(true, 1, 'Actual Planning Minutes fetched successfully', forecastData);
    } catch (err) {
      console.error('Error fetching forecast plans by date:', err);
      throw err.message;
    }
  }
  

}
