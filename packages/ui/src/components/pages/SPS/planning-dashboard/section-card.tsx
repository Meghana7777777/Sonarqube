import { GBLocationRequest, GbGetAllLocationsDto, GetAllSectionsResDto, IPS_C_LocationCodeRequest, IPS_R_LocationJobsModel, IpsBarcodeQualityResultsModel, LocationCodesRequest, MmsAssetLocationsDataModel, P_LocationCodeRequest, processTypeEnumDisplayValues } from '@xpparel/shared-models';
import { GbConfigHelperService, MmsAssetLocationsService, OpReportingService, ProcessingJobsService, SewingJobPlanningService } from '@xpparel/shared-services';
import { Button, Card, Col, Popover, Tag } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import React, { useEffect, useState } from 'react';
import JobShape from './job-details-popover';
import DowntimeIcon from '../../../../assets/icons/downtime.png';
import Rejection from '../../../../assets/icons/rejection.png';
import { AlertMessages } from '../../../common';
import { AppstoreOutlined, BarcodeOutlined, ClusterOutlined, ReloadOutlined, SettingOutlined, WarningOutlined } from '@ant-design/icons';

interface SectionCardProps {
	sectionObj: GetAllSectionsResDto;
	selectedJobNo: string;

}
interface ILocationsJobs {
	jobsDetails: IPS_R_LocationJobsModel;
	locationObj: GbGetAllLocationsDto;
}
interface ILocationJobsMap {
	[key: string]: ILocationsJobs
}
const SectionCard: React.FC<SectionCardProps> = ({ sectionObj, selectedJobNo }) => {
	const user = useAppSelector((state) => state.user.user.user);
	const [locationsData, setLocationsData] = useState<GbGetAllLocationsDto[]>([]);
	const [jobsData, setJobsData] = useState<IPS_R_LocationJobsModel[]>([]);
	const [locationJobsData, setLocationsJobsData] = useState<ILocationJobsMap>({});
	const mmsService = new MmsAssetLocationsService();
	const gbcService = new GbConfigHelperService();
	const qmsService = new OpReportingService();
	const jobService = new ProcessingJobsService();
	const [mmsAssetLocationsData, setMmsAssetLocationsData] = useState<MmsAssetLocationsDataModel[]>();
	const [qmsLocationsData, setQmsLocationsData] = useState<IpsBarcodeQualityResultsModel[]>();

	useEffect(() => {
		if (sectionObj) {
			getAllLocationsByDeptAndSectionsFromGbC(sectionObj.secCode);
		}
	}, [sectionObj]);

	const refreshUI = () => {
		getJobsForSections(locationsData);
	}
	const getAllLocationsByDeptAndSectionsFromGbC = async (secCode: string) => {
		if (!secCode) {
			return;
		}
		try {
			const req = new GBLocationRequest(user.user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [secCode])
			const res = await gbcService.getAllLocationsByDeptAndSectionsFromGbC(req)
			if (res.status) {
				setLocationsData(res.data);
				getJobsForSections(res.data);
			}
		} catch (err) {
			AlertMessages.getErrorMessage(err.message);
		}
	}

	const getJobsForSections = async (locations: GbGetAllLocationsDto[]) => {
		try {
			const locationCodes: string[] = locations.map(e => e.locationCode);

			if (!locationCodes.length) {
				return
			}
			const req = new IPS_C_LocationCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, locationCodes, true, true, true, true, true);
			const response = await jobService.getJobsInfoByLocation(req);
			const jobs: IPS_R_LocationJobsModel[] = response.status ? response.data : [];
			setJobsData(jobs);
			const locationJobsObj = {}; // Jobs Data for each location
			jobs.forEach(loc => locationJobsObj[loc.locationCode] = loc);

			const locationsJobsDataMap: ILocationJobsMap = {};
			locations.forEach(loc => {
				locationsJobsDataMap[loc.locationCode] = {
					jobsDetails: locationJobsObj[loc.locationCode] || { jobs: [], locationCode: loc.locationCode, totalJobs: 0 },
					locationObj: loc
				}
			})
			setLocationsJobsData(locationsJobsDataMap);
			const locationCodesForMES = locations.map(loc => loc.locationCode);
			// getDataforMES(locationCodesForMES);
			getQualityInfoForGivenLocationCode(locationCodesForMES);

		} catch (error) {
			AlertMessages.getErrorMessage(error.message)
		}
	};

	const getDataforMES = async (locationCodes: string[]) => {
		try {
			const req = new LocationCodesRequest(user.userName, user.orgData.unitCode, user.orgData.companyCode, user.userId, locationCodes);
			const res = await mmsService.getDataforMES(req);
			if (res.status) {
				setMmsAssetLocationsData(res.data);
			}
		} catch (error) {
			AlertMessages.getErrorMessage(error.message);
			setMmsAssetLocationsData([]);
		}
	}

	const getQualityInfoForGivenLocationCode = async (locationCode: string[]) => {
		try {
			const req = new P_LocationCodeRequest(user.userName, user.orgData.unitCode, user.orgData.companyCode, user.userId, locationCode);
			const res = await qmsService.getQualityInfoForGivenLocationCode(req);
			if (res.status) {
				setQmsLocationsData(res.data);
			}
		} catch (error) {
			AlertMessages.getErrorMessage(error.message);
			setQmsLocationsData([]);
		}
	}

	const getWIPAndTotalJobs = (jobsArray: IPS_R_LocationJobsModel[]) => {
		if (!jobsArray || jobsArray.length === 0) return { totalJobs: 0, totalWIP: 0 };

		let totalWIP = 0;
		let totalJobs = 0;

		jobsArray.forEach((jobGroup) => {
			if (Array.isArray(jobGroup?.jobs)) {
				totalJobs += jobGroup.jobs.length;
				jobGroup.jobs.forEach((job) => {
					totalWIP += job?.status?.wip || 0;
				});
			}
		});

		return { totalJobs, totalWIP };
	};

	const { totalWIP, totalJobs } = getWIPAndTotalJobs(jobsData);

	const handleRefresh = (sectionCode: string) => {
		getAllLocationsByDeptAndSectionsFromGbC(sectionCode)
	};

	return (
		<>
			<Col xs={24} sm={24} md={9} lg={7} xl={6}>
				<Card
					className="custom-section-card"
					title={
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
							<span>{sectionObj.secCode}</span>
							<Tag style={{ alignContent: "center", marginLeft: '35px' }} color="orange">
								{processTypeEnumDisplayValues[sectionObj.processType]}
							</Tag>
						</div>
					}
					bordered={true}
					style={{ overflow: 'hidden', margin: '2px 20px 0px 10px' }}
					headStyle={{ backgroundColor: `${sectionObj.secColor}` }}
					extra={<div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
						<Button
							icon={<ReloadOutlined />}
							onClick={() => handleRefresh(sectionObj.secCode)}
							type="text"
							title="Refresh All"
						/>
					</div>
					}
				>
					{Object.values(locationJobsData).map((locJobObj, ind) => {
						const locationCode = locJobObj.locationObj.locationCode;
						const hasRejection = qmsLocationsData?.some((qms) => qms.locationCode === locationCode);
						return (
							<div key={ind} className="module-row">
								{hasRejection && (() => {
									const rejectionData = qmsLocationsData?.find(
										qms => qms.locationCode === locationCode
									);

									const popoverContent = (
										<div style={{ lineHeight: 2, minWidth: 220 }}>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<BarcodeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
												<strong style={{ width: 120 }}>Barcode:</strong> {rejectionData?.barcode || 'N/A'}
											</div>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<WarningOutlined style={{ marginRight: 8, color: '#fa541c' }} />
												<strong style={{ width: 120 }}>Fail Count:</strong> {rejectionData?.failCount ?? 'N/A'}
											</div>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												{/* <BarcodeTwoTone style={{ marginRight: 8 }} /> */}
												<strong style={{ width: 120 }}>Barcode Type:</strong> {rejectionData?.barcodeType || 'N/A'}
											</div>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<SettingOutlined style={{ marginRight: 8, color: '#722ed1' }} />
												<strong style={{ width: 120 }}>Operation Code:</strong> {rejectionData?.operationCode || 'N/A'}
											</div>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<AppstoreOutlined style={{ marginRight: 8, color: '#eb2f96' }} />
												<strong style={{ width: 120 }}>Process Type:</strong> {rejectionData?.processType || 'N/A'}
											</div>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<ClusterOutlined style={{ marginRight: 8, color: '#52c41a' }} />
												<strong style={{ width: 120 }}>Location Code:</strong> {rejectionData?.locationCode || 'N/A'}
											</div>
										</div>
									);
									return (
										<Popover content={popoverContent} title="Rejection Info" trigger="hover">
											<img
												src={Rejection}
												alt="Rejection"
												style={{ width: 20, height: 20, cursor: 'pointer', marginLeft: 8 }}
											/>
										</Popover>
									);
								})()}
								<span className="module-name" style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: `${locJobObj.locationObj.locationColor}` }}>
									{locJobObj.locationObj.locationCode}
								</span>
								<div className="status-row">
									{
										<div key={ind} className="status-item">
											<JobShape
												key={locJobObj.locationObj.locationCode}
												job={locJobObj.jobsDetails}
												selectedJobNo={selectedJobNo}
												refreshUI={refreshUI}
											/>
										</div>
									}
								</div>
								{(() => {
									const jobs = locJobObj.jobsDetails?.jobs || [];
									const totalJobs = jobs.length;
									const totalWIP = jobs.reduce((sum, job) => sum + (job?.status?.wip || 0), 0);
									return (
										<span style={{
											color: 'darkblue',
											fontWeight: 'bold',
											display: 'inline-block',
											textAlign: 'center',
											fontSize: '16px',
										}}>{`${totalJobs}/${totalWIP}`}</span>
									);
								})()}
							</div>
						)
					})}
				</Card>
			</Col>
		</>
	);
};

export default SectionCard;
