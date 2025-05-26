import { GbGetAllLocationsDto, GBLocationRequest, GetAllSectionsResDto, IPS_C_LocationCodeRequest, IPS_R_LocationJobsModel, processTypeEnumDisplayValues } from '@xpparel/shared-models';
import { Button, Card, Col, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import TrimsJobShape from './trims-job-details';
import { useAppSelector } from 'packages/ui/src/common';
import { GbConfigHelperService, ProcessingJobsService } from '@xpparel/shared-services';
import { AlertMessages } from 'packages/ui/src/components/common';
import { ReloadOutlined } from '@ant-design/icons';

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
const TrimsSectionCard: React.FC<SectionCardProps> = ({ sectionObj, selectedJobNo }) => {
	const user = useAppSelector((state) => state.user.user.user);
	const [locationsData, setLocationsData] = useState<GbGetAllLocationsDto[]>([]);
	const [jobsData, setJobsData] = useState<IPS_R_LocationJobsModel[]>([]);
	const [locationJobsData, setLocationsJobsData] = useState<ILocationJobsMap>({});
	const gbcService = new GbConfigHelperService();
	const jobService = new ProcessingJobsService();

	useEffect(() => {
		if (sectionObj) {
			getAllLocationsByDeptAndSectionsFromGbC(sectionObj.secCode);
		}
	}, [sectionObj]);

	const refreshUI = () => {
		getRMInProgressJobsForLocation(locationsData);
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
				getRMInProgressJobsForLocation(res.data);
			}
		} catch (err) {
			AlertMessages.getErrorMessage(err.message);
		}
	}

	const getRMInProgressJobsForLocation = async (locations: GbGetAllLocationsDto[]) => {
		try {
			const locationCodes: string[] = locations.map(e => e.locationCode);

			if (!locationCodes.length) {
				return
			}
			const req = new IPS_C_LocationCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, locationCodes, true, true, true, true, true);
			const response = await jobService.getRMInProgressJobsForLocation(req);
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

		} catch (error) {
			AlertMessages.getErrorMessage(error.message)
		}
	};

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
					{Object.values(locationJobsData).map((locJobObj, index) => (
						<div key={index} className="module-row">
							<span className="module-name" style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: `${locJobObj.locationObj.locationColor}` }}>
								{locJobObj.locationObj.locationCode}
							</span>
							<div className="status-row">
								<div key={index} className="status-item">
									<TrimsJobShape
										key={locJobObj.locationObj.locationCode}
										job={locJobObj.jobsDetails}
										selectedJobNo={selectedJobNo}
										refreshUI={refreshUI}
									/>
								</div>
							</div>
						</div>
					))}
				</Card>
			</Col>
		</>
	);
};

export default TrimsSectionCard;
