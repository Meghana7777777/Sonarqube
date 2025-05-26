import { GbGetAllLocationsDto, KC_LocationKnitJobModel, KJ_LocationKnitJobsModel, KJ_MaterialStatusEnum, KJ_locationCodeRequest, kjMaterialStatusEnumDisplayValues } from "@xpparel/shared-models";
import { KnittingJobPlanningService } from "@xpparel/shared-services";
import { Badge, Button, Card, Col, Descriptions, Popover, Row, Tag, Tooltip } from "antd"
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "../../../common";
import { useEffect, useState } from "react";
import KnittingLocationJobInfo from "./knitting-location-full-info";
import './knit-job-planning.css';
import { kjMaterialStatusEnumClassNames } from "./knit-planning.interface";

interface IProps {
    location: GbGetAllLocationsDto;
    updateKey: number;
}
const KnitLocation = (props: IProps) => {
    const knittingJobPlanningService = new KnittingJobPlanningService();
    const user = useAppSelector((state) => state.user.user.user);
    const [knitJobs, setKnitJobs] = useState<KJ_LocationKnitJobsModel[]>([]);
    const [isKnittingModalVisible, setIsKnittingModalVisible] = useState(false);

    const { location } = props;
    useEffect(() => {
        if (props) {
            fetchLocationKnitJobs(props.location.locationCode)
        }
    }, [props.location.locationCode, props.updateKey]);

    const fetchLocationKnitJobs = async (locationCode: string) => {
        try {
            const request = new KJ_locationCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, locationCode, true, true, false, false, false);
            const response = await knittingJobPlanningService.getKnitJobsForGivenLocation(request);
            if (response.status) {
                setKnitJobs(response.data)
            }

        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
        }
    };

    const handleOpenModal = (location: GbGetAllLocationsDto) => {

        setIsKnittingModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsKnittingModalVisible(false);

    };
    const renderTooltipTitle = (job: KC_LocationKnitJobModel) => {
        const { materialStatus, jobNumber, jobQty, knitGroup, jobFeatures, colorSizeInfo, jobRm } = job;
        const sizeList = colorSizeInfo[0]?.sizeQtys.map(sq => sq.size).join(', ');
        const componentList = jobRm?.flatMap(rm => rm.componentNames)?.filter(Boolean);
        const componentDisplay = componentList?.length ? componentList.join(', ') : '-';
        return <>
            <Descriptions
                // title={rollInfo.rollNumber}
                bordered
                size='small'
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Style">{jobFeatures?.styleName}</Descriptions.Item>
                <Descriptions.Item label="Material Status">{kjMaterialStatusEnumDisplayValues[materialStatus]}</Descriptions.Item>
                <Descriptions.Item label="Knit Group">{knitGroup}</Descriptions.Item>
                <Descriptions.Item label="Color"><Tag color="blue">{colorSizeInfo[0].fgColor}</Tag></Descriptions.Item>
                <Descriptions.Item label="Components">{componentDisplay}</Descriptions.Item>
                <Descriptions.Item label="Size">{sizeList}</Descriptions.Item>
                <Descriptions.Item label="Quantity">{jobQty}</Descriptions.Item>
            </Descriptions>
        </>

    }
    return <>


        <Col key={location.locationName} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card size="small"
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{location.locationCode}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Tooltip title="Total Knit Jobs">
                                <Tag color="#52c41a" style={{ fontSize: 12 }}>
                                    {knitJobs.reduce((total, e) => total + e.knitJobs.length, 0)}
                                </Tag>
                            </Tooltip>

                            <Button
                                type="primary"
                                size="small"
                                onClick={() => handleOpenModal(location)}
                                className="btn-blue"
                            >
                                View
                            </Button>
                        </div>
                    </div>
                }
                bordered={true}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                    {knitJobs.flatMap(e => e.knitJobs.map((job, index) => (
                        <Popover 
                        trigger="click"
                        content={renderTooltipTitle(job)} 
                        title={job.jobNumber} 
                        mouseEnterDelay={0} 
                        mouseLeaveDelay={0}>
                            <div key={job.jobNumber} className={`job-block ${kjMaterialStatusEnumClassNames[job.materialStatus]}`}>
                                {job.jobNumber}
                            </div>
                        </Popover>
                    )))}
                </div>
            </Card>
        </Col>
        <KnittingLocationJobInfo
            visible={isKnittingModalVisible}
            location={location}
            onClose={handleCloseModal}
        />

    </>
}
export default KnitLocation;