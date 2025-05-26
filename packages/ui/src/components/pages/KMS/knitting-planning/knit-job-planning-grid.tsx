import { GbGetAllLocationsDto, KC_KnitJobModel, KC_KnitOrderJobsModel, KJ_KnitJobLocPlanRequest, KJ_LocationCodeQtyModel, KJ_LocationCodesRequest, ModuleModel, ProcessTypeEnum } from "@xpparel/shared-models";
import { KnittingJobPlanningService } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Col, Descriptions, Modal, Row, Table, TableColumnsType, Tag } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import KnitKobLocationCard from "./knit-job-location-card";
import { IKnitJobMap, IPlannedUnPlannedJobs, IKnitJob, ILocationCapacity, IPlannedLocation, ILocations, ILocationCapacityMap } from "./knit-planning.interface";



const backgroundColors = [
    "#5b6b51",  // Red-Orange
    "#dfae4e",  // Lime Green
    "#575345",  // Cornsilk
    "#1c678a",
    "#038703",  // Pale Green
    "#20B2AA",  // Light Sea Green
    "#8ca09c",  // Violet
    "#c36b57",  // Alice Blue
    "#4d2b1a",  // Deep Pink
    "#a17700",  // ---
    "#0f0075",  // Tomato
    "#87ad11",  // Gold   
    "#F4A300",  // Amber
    "#D2691E",  // Chocolate
    "#486cad",  // Cornflower Blue
    "#B22222",  // Firebrick
    "#8A2BE2",  // Blue Violet
    "#FF4500",  // Orange Red    
    "#faad14",  // Cornsilk
    "#e91e63",  // Cornsilk

];

const knitJobColumns: TableColumnsType<IKnitJob> = [
    { title: 'Knit Group', dataIndex: 'knitGroup', key: 'knitGroup' },
    { title: 'Job Number', dataIndex: 'jobNumber', key: 'jobNumber' },
    { title: 'Color', dataIndex: 'color' },
    { title: 'Size', dataIndex: 'size' },
    { title: 'Job Quantity', dataIndex: 'jobQty', },
    { title: 'Planned Status', dataIndex: 'isPlanned', render: (val) => val ? "Planned" : "Not Planned" },
];
const moduleColumns: TableColumnsType<ILocations> = [
    { title: 'Location Code', dataIndex: 'locationCode', key: 'moduleCode' },
    { title: 'Location Name', dataIndex: 'locationName' },
    { title: 'Description', dataIndex: 'locationDesc', width: 150 },
    { title: 'Type', dataIndex: 'locationType' },
    { title: 'Ext Ref', dataIndex: 'locationExtRef', key: 'moduleExtRef' },
    { title: 'Capacity', dataIndex: 'locationCapacity', width: 100 },
    { title: 'Available Capacity', dataIndex: 'allocatedQty', render: (v, r) => Number(r.locationCapacity) - v },
    { title: 'Max Input Jobs', dataIndex: 'maxInputJobs', key: 'maxInputJobs' },
    { title: 'Max Display Jobs', dataIndex: 'maxDisplayJobs', key: 'maxDisplayJobs', width: 100 },
    { title: 'Head Name', dataIndex: 'locationHeadName', width: 150 },
    { title: 'Head Count', dataIndex: 'locationHeadCount', },
    { title: 'Location Order', dataIndex: 'locationOrder' },
    // { title: 'Sec Code', dataIndex: 'secCode', width:150 },
];
interface IProps {
    style: string;
    productCode: string;
    poSerial: number;
    knitJobs: KC_KnitOrderJobsModel[];
    locations: GbGetAllLocationsDto[];
    processingName: string;
    closeModal: (isReload: boolean) => void
}

const KnitJobPlanningGrid = (props: IProps) => {
    const { knitJobs, poSerial, productCode, style, locations, processingName, closeModal } = props;
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [moduleData, setModuleData] = useState<ILocations[]>([]);
    const [knitJobsMap, setKnitJobsMap] = useState<IKnitJobMap>({});
    const [plannedUnPlannedJobs, setPlannedUnplannedJobs] = useState<IPlannedUnPlannedJobs>({ plannedJobs: {}, unplannedJobs: [] });
    const [locationCapacityMap, setLocationCapacityMap] = useState<ILocationCapacityMap>({});
    const knitJobPlanningService = new KnittingJobPlanningService();
    const user = useAppSelector((state) => state.user.user.user);

    useEffect(() => {
        getPlannedQtyForGivenLocation(locations);
        if (knitJobs) {
            constructKnitJobsMap(knitJobs)
        }

    }, [props]);
    const getPlannedQtyForGivenLocation = (locationsData: GbGetAllLocationsDto[]) => {
        const locationCodes = locationsData.map(e => e.locationCode);
        const req = new KJ_LocationCodesRequest(user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId, locationCodes);
        knitJobPlanningService.getPlannedQtyForGivenLocation(req).then(res => {
            if (res) {
                getWorkstations(locations, res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })
    }
    const constructKnitJobsMap = (knitJobsData: KC_KnitOrderJobsModel[]) => {
        let lastColorIndex = 0;
        const knitGroupBgColorMap = new Map<string, number>();
        const knitJobMapObj: IKnitJobMap = {};
        knitJobsData.forEach(knitGroupObj => {
            if (!knitGroupBgColorMap.has(knitGroupObj.knitGroup)) {
                knitGroupBgColorMap.set(knitGroupObj.knitGroup, lastColorIndex++)
            }

            const colorIndex = knitGroupBgColorMap.get(knitGroupObj.knitGroup);
            knitGroupObj.knitJobs.forEach(knitJobObj => {
                const obj: IKnitJob = {
                    color: knitJobObj.colorSizeInfo[0]?.fgColor,
                    jobNumber: knitJobObj.jobNumber,
                    jobQty: knitJobObj.jobQty,
                    knitGroup: knitJobObj.knitGroup,
                    productCode: knitJobObj.productSpecs.productCode,
                    productName: knitJobObj.productSpecs.productName,
                    productType: knitJobObj.productSpecs.productType,
                    size: knitJobObj.colorSizeInfo[0]?.sizeQtys[0]?.size,
                    bgColor: backgroundColors[colorIndex],
                    isPlanned: knitJobObj.isPlanned
                }
                knitJobMapObj[knitJobObj.jobNumber] = obj;
            })
        });

        setKnitJobsMap(knitJobMapObj);
    }
    const showModal = () => setIsModalVisible(true);
    const handleOk = () => setIsModalVisible(false);
    const handleCancel = () => setIsModalVisible(false);


    const getWorkstations = (locationsData: GbGetAllLocationsDto[], locCapacityData: KJ_LocationCodeQtyModel[]
    ) => {
        const usedCapacity = {};
        locCapacityData.forEach(e => usedCapacity[e.locationCode] = e.quantity);
        const locationDataWithUsedCapacity = locationsData.map(e => {
            return { ...e, allocatedQty: usedCapacity[e.locationCode] }
        })
        setModuleData(locationDataWithUsedCapacity);
        setSelectedRowKeys(locationsData.map((module) => module.locationId!));
    }
    const planJobs = () => {
        autoPlanLogic(moduleData, selectedRowKeys, knitJobs)
    }
    const sortOrderBYAvailableQty = (planLocations: ILocationCapacity[]) => {
        return planLocations.sort((a, b) => {
            if (b.availableCapacity !== a.availableCapacity) {
                return b.availableCapacity - a.availableCapacity; // Descending capacity
            }
            return a.locationCode.localeCompare(b.locationCode); // Ascending name
        });
    }
    const autoPlanLogic = (locations: ILocations[], selectedRowKeys: number[], knitGroupJobs: KC_KnitOrderJobsModel[]) => {
        const plannedTabLeLocations: ILocationCapacity[] = [];
        // const abc = [1500, 1300, 2900]
        locations.forEach((e, i) => {
            if (selectedRowKeys.includes(e.locationId)) {
                const obj: ILocationCapacity = {
                    availableCapacity: Number(e.locationCapacity) - e.allocatedQty,
                    locationId: e.locationId,
                    locationName: e.locationName,
                    locationCode: e.locationCode,
                    maxCapacity: Number(e.locationCapacity),
                    usedCapacity: 0
                }
                plannedTabLeLocations.push(obj);
            }
        }
        );

        const locationKnitJobs: IPlannedLocation = {};
        const noPlannedJobs: KC_KnitJobModel[] = [];

        const sortedKnitJobs = knitGroupJobs.flatMap(knitObj => knitObj.knitJobs).sort((a, b) => a.jobNumber.localeCompare(b.jobNumber));
        sortedKnitJobs.filter(e => !e.isPlanned).forEach(knitJobObj => { //sekhar
            const sortedLocations = sortOrderBYAvailableQty(plannedTabLeLocations);
            const knitJobQty = Number(knitJobObj.jobQty);
            const locationObj = sortedLocations.find(e => e.availableCapacity >= knitJobQty);
            if (locationObj) {
                if (!locationKnitJobs.hasOwnProperty(locationObj.locationId)) {
                    locationKnitJobs[locationObj.locationId] = [];
                }
                locationKnitJobs[locationObj.locationId].push(knitJobObj.jobNumber);
                locationObj.usedCapacity += knitJobQty;
                locationObj.availableCapacity -= knitJobQty;

            } else {
                noPlannedJobs.push(knitJobObj);
            }
        });

        const locationUsedCapacityObj: ILocationCapacityMap = {};
        plannedTabLeLocations.forEach(e => locationUsedCapacityObj[e.locationId] = e)
        setLocationCapacityMap(locationUsedCapacityObj)
        setPlannedUnplannedJobs({ plannedJobs: locationKnitJobs, unplannedJobs: noPlannedJobs })


    }
    const confirmPlanJobs = async () => {
        try {
            const locationObj = {};
            locations.forEach(loc => locationObj[loc.locationId] = loc.locationCode);
            const locationKnitJobs = plannedUnPlannedJobs.plannedJobs;
            if (Object.keys(locationKnitJobs).length < 1) {
                AlertMessages.getWarningMessage('No Jobs to plan ');
                return
            }
            const requests = Object.entries(locationKnitJobs).map(([locationId, jobNumbers]) => {
                const req = new KJ_KnitJobLocPlanRequest(
                    user?.userName,
                    user?.orgData?.unitCode,
                    user?.orgData?.companyCode,
                    user?.userId,
                    jobNumbers,
                    locationObj[locationId],
                    poSerial,
                    ProcessTypeEnum.KNIT
                );

                return knitJobPlanningService.planKnitJobsToLocation(req);
            });

            const responses = await Promise.all(requests);

            const failedRes = responses.find(res => !res.status)
            failedRes ? AlertMessages.getErrorMessage(failedRes.internalMessage) : AlertMessages.getSuccessMessage('Jobs are planned successfully');
            if (!failedRes) {
                closeModal(true)
            }

        } catch (error) {
            AlertMessages.getErrorMessage("Some jobs could not be planned.");
        }
    }
    const onSelectChange = (newSelectedRowKeys: number[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection: TableRowSelection<ILocations> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const renderPlannedJobs = (allJobs: IPlannedUnPlannedJobs, selectedLocations: number[], locations: ILocations[], knitJobsMap: IKnitJobMap, locationCapacityMapPa: ILocationCapacityMap) => {
        const locationsData = locations.filter(locationObj => selectedLocations.includes(locationObj.locationId));
        return locationsData.map(locObj => {
            const jobs = allJobs.plannedJobs[locObj.locationId] || [];
            const plannedKnitJobsData = jobs.map(jobNo => knitJobsMap[jobNo]);
            return <KnitKobLocationCard jobs={plannedKnitJobsData} locationData={locObj} locationCapacity={locationCapacityMapPa[locObj.locationId]} />
        })

    }
    return <>
        <Descriptions bordered size="small" column={3}>
            <Descriptions.Item label="Style">{style || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Product">{productCode || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Processing Name">{processingName || 'N/A'}</Descriptions.Item>
        </Descriptions>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
            <Button type="primary" onClick={showModal} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}>
                View Jobs
            </Button>
            <Button type="primary" onClick={planJobs} className="btn-yellow">
                Plan
            </Button>
        </div>

        <div style={{ marginBottom: '20px' }}>
            <Table
                columns={moduleColumns}
                size="small"
                bordered
                dataSource={moduleData}
                rowKey={record => record.locationId}
                pagination={false}
                scroll={{ x: 'max-content' }}
                style={{ minWidth: '100%' }}
                rowClassName={() => 'small-row'}
                rowSelection={rowSelection}
                components={{
                    header: { cell: (props: any) => <th {...props} style={{ padding: '4px', lineHeight: '25px', height: '25px' }} /> },
                    body: {
                        row: (props: any) => <tr {...props} style={{ height: '30px' }} />,
                        cell: (props: any) => <td {...props} style={{ padding: '4px' }} />,
                    },
                }}
            />
        </div>
        <Row gutter={[12, 12]} >

            <Col span={20}>
                {plannedUnPlannedJobs.unplannedJobs.length > 0 &&
                    <Card size='small' title='Unable to plant the jobs due to insufficient capacity'>
                        {plannedUnPlannedJobs.unplannedJobs.map(upJob => <Tag color='red'>{upJob.jobNumber} |  {upJob.jobQty}</Tag>)}
                    </Card>
                }
            </Col>

            <Col span={4}>
                <div className="confirm-block">
                    <Button type="primary" disabled={Object.keys(plannedUnPlannedJobs.plannedJobs).length < 1} className="btn-green" onClick={confirmPlanJobs}>Confirm</Button>
                </div>
            </Col>
        </Row>
        <Row gutter={[12, 12]} >

            {renderPlannedJobs(plannedUnPlannedJobs, selectedRowKeys, moduleData, knitJobsMap, locationCapacityMap)}
        </Row>
        <Modal
            title="View Knit Plan Details"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', padding: '16px' }}
        >
            <Descriptions bordered size="small" column={3} style={{ marginBottom: '30px' }}>
                <Descriptions.Item label="Style">{style || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Product">{productCode || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Processing Order">{poSerial || 'N/A'}</Descriptions.Item>
            </Descriptions>
            <Table
                columns={knitJobColumns}
                dataSource={Object.values(knitJobsMap)}
                rowKey="jobNumber"
                bordered
                pagination={false}
                size="small"
                scroll={{ y: 250 }}
                rowClassName={() => 'small-row'}
                components={{
                    header: { cell: (props: any) => <th {...props} style={{ padding: '6px', lineHeight: '20px', height: '30px' }} /> },
                    body: {
                        row: (props: any) => <tr {...props} style={{ height: '35px' }} />,
                        cell: (props: any) => <td {...props} style={{ padding: '6px' }} />,
                    },
                }}
            />
        </Modal>
    </>
}
export default KnitJobPlanningGrid;