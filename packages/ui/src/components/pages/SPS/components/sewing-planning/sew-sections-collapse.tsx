import { GbGetAllLocationsDto, GbSectionReqDto, GetAllSectionsResDto, PJP_LocationCodesRequest, PJP_LocationWiseJobsModel, ProcessTypeEnum } from "@xpparel/shared-models";
import { GbConfigHelperService, ProcessingJobsPlanningService } from "@xpparel/shared-services";
import { Col, Collapse, DatePicker, Row, Select, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import SewLocationSection from "./sew-section";

interface ISectionUpdateKey {
    [key: string]: number;
}
interface IProps {
    sections: GetAllSectionsResDto[];

    onDrop: (e: React.DragEvent, moduleId: string, moduleType: string, selectedDate: any, sectionId: number) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragStart: (e: React.DragEvent, job: string, moduleId: string, sectionId: number) => void;
    refreshSections: number[];

}
const { Option } = Select;

const SewSectionCollapse = (props: IProps) => {
    const { onDragOver, onDragStart, onDrop, sections, refreshSections } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const globalService = new GbConfigHelperService();
    const planningService = new ProcessingJobsPlanningService();

    const [selectedSection, setSelectedSection] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string[]>([]);
    const [sectionRefreshCount, setSectionRefreshCount] = useState<ISectionUpdateKey>({});

    useEffect(() => {
        const secRefCount = {};
        props.sections.forEach(({ id: SectionId }) => {
            const existingCnt = sectionRefreshCount[SectionId] || 0;
            const newCnt = refreshSections.includes(SectionId);
            secRefCount[SectionId] = existingCnt + (newCnt ? 1 : 0);
        });
        setSectionRefreshCount(secRefCount);

    }, [props.sections, props.refreshSections])

    const renderCollapseItems = (sectionsData: GetAllSectionsResDto[], secRefreshCountObj: ISectionUpdateKey) => {
        const filteredSections = selectedSection
            ? sectionsData.filter((section) => section.id === selectedSection)
            : sectionsData;
        return filteredSections.map(secObj => {
            return {
                key: secObj.id,
                label: `${secObj.secCode} - ${secObj.secDesc}`,
                children: <SewLocationSection key={secObj.id} refreshCount={secRefreshCountObj[secObj.id] || 0} onDragOver={onDragOver} onDragStart={onDragStart} onDrop={onDrop} section={secObj} selectedDate={selectedDate} />,
            }
        })
    }
    const handleDateChange = (date: any, dateString: string) => {
        setSelectedDate([dateString]);
    };
    return (
        <>
            <div style={{ width: '100%' }}>
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '10px' }}>
                    {/* Section Select */}
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            placeholder="Select Section ID"
                            allowClear
                            showSearch
                            style={{ width: '100%' }}
                            onChange={(value) => setSelectedSection(value || null)}
                        >
                            {sections.map((sec) => (
                                <Option key={sec.id} value={sec.id}>
                                    {sec.secCode}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    {/* Plan Input Date */}
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ whiteSpace: 'nowrap' }}>Plan Input Date:</span>
                            <DatePicker onChange={handleDateChange} style={{ flex: 1 }} />
                        </div>
                    </Col>
                    {/* Tags */}
                    <Col xs={24} md={8} lg={12}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            <Tag color="blue">Forecast Actual Mins</Tag>
                            <Tag color="red">Already Planned Mins</Tag>
                            <Tag color="orange">Available Mins</Tag>
                            <Tag color="green">Utilization Percentage</Tag>
                        </div>
                    </Col>
                </Row>
                <Collapse items={renderCollapseItems(props.sections, sectionRefreshCount)} size="small" />
            </div>
        </>
    );
}

export default SewSectionCollapse;