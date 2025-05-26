import { ReloadOutlined } from "@ant-design/icons";
import { YarnTypeEnum, InsInspectionActivityStatusEnum, YarnInspectionBasicInfoModel, InsInspectionRequestsFilterRequest, InsInspectionTypeRequest, YarnInsInspectionRequestsFilterRequest, YarnInspectionTypeRequest } from "@xpparel/shared-models";
import { FabricInspectionInfoService, YarnInspectionInfoService } from "@xpparel/shared-services";
import { Button, Card, Row, Space, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../../../common";
import { AlertMessages } from "../../../../common";
import { InspectionInfoCard } from "./inspection-info-card";


interface InspectionColumnarCardProps {
	columnarHeading: string;
	inspectionCurrentActivity: InsInspectionActivityStatusEnum;
	typeOfInspection: YarnTypeEnum;
	refreshKey?: number;
	reloadDashboard: () => void;
	searchData: string;
}

const TOTAL_REC_COUNT = 40;
const scrollFieldRef: any = React.createRef();


export const InspectionColumnarCard = (props: InspectionColumnarCardProps) => {

	const [scrollableContainerRef] = useState<any>(useRef(null));
	const { searchData } = props;
	const user = useAppSelector((state) => state.user.user.user);
	const [irsInfo, setIrsInfo] = useState<YarnInspectionBasicInfoModel[]>([]);
	const [fromRecord] = useState<any>(useRef(0));
	const checkedBatchCodes = useRef(new Set<string>());
	const yarnInspectionInfoService = new YarnInspectionInfoService();
	const missingCountRef = useRef(0);
	const [color,setColor]=useState<boolean>(false);
	// const [checkedBatchCodes, setCheckedBatchCodes] = useState<Set<string>>(new Set());
	const [warningShown, setWarningShown] = useState(false);
	useEffect(() => {
		const container = scrollableContainerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll, true);
		} else {
			window.removeEventListener('scroll', handleScroll);

		}
		getIRBasicInfos(user?.orgData?.companyCode, user?.orgData?.unitCode, props.typeOfInspection, props.inspectionCurrentActivity, false);
	}, [props.refreshKey]);





	useEffect(() => {
		if (!searchData) {
			// "No batch code provided. Skipping.");
			return;
		}

		// Check if batch code is already in checkedBatchCodes
		// if (checkedBatchCodes.current.has(searchData)) {
		// //`Batch code ${searchData} has already been checked. Skipping API call.`);
		// return;
		// }

		// Check if batch code exists in irsInfo
		// const batchCodeExistsInIrsInfo = irsInfo.some(info => info.batches.includes(searchData));
		// if (batchCodeExistsInIrsInfo) {
		// // `Batch code ${searchData} is already present in irsInfo. Skipping API call.`);
		// checkedBatchCodes.current.add(searchData); // Add to checked to avoid further checks
		// return;
		// }

		// If batch code is not found, add to checkedBatchCodes and make API call
		// `Batch code ${searchData} not present in irsInfo. Making API call.`);
		checkedBatchCodes.current.add(searchData);
		fetchInspectionDataByBatchCode(user?.orgData?.companyCode, user?.orgData?.unitCode, props.typeOfInspection, props.inspectionCurrentActivity, searchData);


	}, [searchData]);


	function getIRBasicInfos(companyCode: string, unitCode: string, insType: YarnTypeEnum, insProgress: InsInspectionActivityStatusEnum, loadall: boolean) {

		let req: YarnInspectionTypeRequest;
		if (loadall) {
			req = new YarnInspectionTypeRequest(null, unitCode, companyCode, 0, insType, insProgress, 0, 0);

		}
		else {
			req = new YarnInspectionTypeRequest(null, unitCode, companyCode, 0, insType, insProgress, fromRecord.current, TOTAL_REC_COUNT);

		}

		yarnInspectionInfoService.getInspectionMaterialPendingData(req).then(res => {
			if (res.status) {
				setColor(false)
				//filtering data 
				setIrsInfo(prev => {
					const total = filterIrsInfo(res.data, prev);
					fromRecord.current = total.length;
					return total;
				});
			}
			else {
				AlertMessages.getErrorMessage(res.internalMessage);
			}
		}).catch(err => {
			AlertMessages.getErrorMessage(err.message);
		});
	}

	// function isBatchCodePresent(batchCode: string): boolean {
	// return irsInfo.some(inspection => inspection.batches.includes(batchCode));
	// }


	function fetchInspectionDataByBatchCode(companyCode: string, unitCode: string, insType: YarnTypeEnum, insProgress: InsInspectionActivityStatusEnum, searchData: string) {

		let req: YarnInsInspectionRequestsFilterRequest;

		req = new YarnInsInspectionRequestsFilterRequest(null, unitCode, companyCode, 0, insType, insProgress, searchData);

		yarnInspectionInfoService.getYarnInspectionRequestBasicInfoByLotCode(req).then(res => {
			if (res.status) {
				setIrsInfo([]);
				if(res.data.length>0)
				{
					setColor(true)
				}else{
					setColor(false)
				}
				
				
				// if (res.data.length <= 0 && !warningShown) { 
				// AlertMessages.getWarningMessage("Batch code not found");
				// setWarningShown(true); 
				// } else {
				// setWarningShown(false); 
				// } 

				//filtering data 
				setIrsInfo(prev => {
					const total = filterIrsInfo(res.data, prev);
					fromRecord.current = total.length;
					return total;
				});

			}
			else {
				AlertMessages.getErrorMessage(res.internalMessage);
			}
		}).catch(err => {
			AlertMessages.getErrorMessage(err.message);
		});
	}

	//for filtering data
	function filterIrsInfo(newData: YarnInspectionBasicInfoModel[], existingData: YarnInspectionBasicInfoModel[]) {
		const ids = existingData.map(rec => rec.irId);
		const nonExistData: YarnInspectionBasicInfoModel[] = [];

		newData.forEach(rec => {
			if (!ids.includes(rec.irId)) {
				nonExistData.push(rec);
			}
		});

		return [...existingData, ...nonExistData];
	}

	function renderIrCards(irs: YarnInspectionBasicInfoModel[]) {
		return (
			<>
				{
					irs.map(req => {
						return <InspectionInfoCard reloadDashboard={props.reloadDashboard} inspectionRollsInfo={req} typeOfInspection={props.typeOfInspection} insProgress={props.inspectionCurrentActivity} searchData={searchData} color={color} />
					})
				}
			</>
		);
	}

	// Declare lastscroll outside the handleScroll function
	let lastscroll = false;
	//function to handle scroll
	const handleScroll = (event) => {
		const container = scrollableContainerRef.current;
		if (container) {
			const { scrollTop, scrollHeight, clientHeight } = event.target;

			// Check if the user has scrolled to the end
			const threshold = clientHeight * 0.1;

			if (scrollTop + clientHeight > scrollHeight - threshold) {
				// Allow for a small tolerance
				if (!lastscroll) {
					//("Reached the end...", irsInfo);
					// Trigger data fetch or other actions here
					getIRBasicInfos(user?.orgData?.companyCode, user?.orgData?.unitCode, props.typeOfInspection, props.inspectionCurrentActivity, false);

					lastscroll = true; // Prevent multiple triggers
				}
			} else {
				lastscroll = false; // Reset when scrolling up or if not at the end
			}
		}
	};

	return (
		<div>
			<Card
				size="small" style={{ textAlign: "center" }}
				headStyle={{ background: "#eee" }}

				bodyStyle={{ height: "80vh", overflowY: "scroll" }}
				ref={scrollableContainerRef}

				title={
					<div style={{ display: "inline-flex", alignItems: "center" }}>
						<span>{props.columnarHeading}</span>
					</div>
				}
				extra={
					<Space>
						<Tooltip title="Load All Data">
							<Button
								onClick={() => getIRBasicInfos(user?.orgData?.companyCode, user?.orgData?.unitCode, props.typeOfInspection, props.inspectionCurrentActivity, true)}
								icon={<ReloadOutlined />}
								style={{ fontSize: '16px' }}
							/>
						</Tooltip>
					</Space>
				}
			>
				<Row gutter={4}>
					{renderIrCards(irsInfo)}
				</Row>
			</Card>
		</div>
	);
};

