import { GbGetAllLocationsDto, ModuleModel } from "@xpparel/shared-models";
import { Card, Col, Descriptions, Flex, Popover, Space, Tag, Tooltip } from "antd"
import { IKnitJob, ILocationCapacity, ILocations } from "./knit-planning.interface";
interface IProps {
    locationData: ILocations;
    jobs: IKnitJob[];
    locationCapacity: ILocationCapacity
}
const KnitKobLocationCard = (props: IProps) => {
    const { jobs, locationData, locationCapacity } = props;
    const renderTooltipTitle = (job: IKnitJob) => {
        const { color, jobNumber, jobQty, knitGroup, productCode, size, productType } = job;
        return <>
            <Descriptions
                // title={rollInfo.rollNumber}
                bordered
                size='small'
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Product Code">{productCode}</Descriptions.Item>
                <Descriptions.Item label="Knit Group">{knitGroup}</Descriptions.Item>
                <Descriptions.Item label="Color"><Tag color="blue">{color}</Tag></Descriptions.Item>
                <Descriptions.Item label="Size">{size}</Descriptions.Item>
                <Descriptions.Item label="Quantity">{jobQty}</Descriptions.Item>
            </Descriptions>
        </>

    }
    console.log(locationData,locationCapacity,'location details')
    return <>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}  key={locationData.locationId}>
            <Card size="small" title={locationData.locationCode}
                extra={<Space>
                    <Tooltip title={'Max Capacity '}>  <Tag color="">{locationData.locationCapacity}</Tag></Tooltip>
                    <Tooltip title={'Available Capacity '}>  <Tag color="#ca8300">{Number(locationData.locationCapacity) - locationData.allocatedQty}</Tag></Tooltip>
                    <Tooltip title={'Currently Planned Capacity '}>  <Tag color="#27da27">{locationCapacity ? locationCapacity?.usedCapacity : 0}</Tag></Tooltip>
                </Space>}>
                <div style={{ display: 'grid', gap: '8px' }}>
                    {jobs.map((job, index) => (
                        <Popover content={renderTooltipTitle(job)} title={job.jobNumber} mouseEnterDelay={0} mouseLeaveDelay={0}>
                            <div key={job.jobNumber} style={{ backgroundColor: job.bgColor, color: '#fff' }} className="job-block bg-gray">
                                {job.jobNumber} |  {job.jobQty}
                            </div>
                        </Popover>
                    ))}
                </div>


            </Card>
        </Col>
    </>
}

export default KnitKobLocationCard;