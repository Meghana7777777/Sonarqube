import { BarChartOutlined } from "@ant-design/icons";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { Card, Row, Col, Progress, Divider, Tag, Select, Modal, Collapse } from "antd";
import { Button } from "antd/lib";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import { useState } from "react";
import './module-tracking-dashboard.css';
import DowntimeIcon from '../../../../../assets/icons/downtime.png';

interface Module {
  name: string;
  moduleType: string;
  status: "Running" | "Idle" | "Breakdown";
  oee: number; // Overall Equipment Effectiveness is a key performance metric used in manufacturing to measure how efficiently a production line is operating
  available: number;
  utilized: number;
  availability: number;
  planned: number;
  produced: number;
  performance: number;
  accepted: number;
  rejected: number;
  quality: number;
  startTime: string;
}

const modules: Module[] = [
  {
    name: "1.1",
    moduleType: "SEW",
    status: "Idle",
    oee: 79.8,
    available: 4.3,
    utilized: 4,
    availability: 94.4,
    planned: 11,
    produced: 9,
    performance: 84.5,
    accepted: 9,
    rejected: 0,
    quality: 100,
    startTime: "25/06/2025 14:08:19",
  },
  {
    name: "2.1",
    moduleType: "WASH",
    status: "Idle",
    oee: 91.9,
    available: 11.2,
    utilized: 10.3,
    availability: 91.9,
    planned: 175,
    produced: 123,
    performance: 100,
    accepted: 123,
    rejected: 0,
    quality: 100,
    startTime: "25/06/2025 07:00:00",
  },
  {
    name: "3.1",
    moduleType: "SEW",
    status: "Idle",
    oee: 91.0,
    available: 11.4,
    utilized: 10.9,
    availability: 95.1,
    planned: 61,
    produced: 56,
    performance: 96.1,
    accepted: 56,
    rejected: 0,
    quality: 100,
    startTime: "25/06/2025 07:00:00",
  },
  {
    name: "4.1",
    moduleType: "IRON",
    status: "Running",
    oee: 91.8,
    available: 11.4,
    utilized: 10.9,
    availability: 95.8,
    planned: 69,
    produced: 52,
    performance: 95.8,
    accepted: 52,
    rejected: 0,
    quality: 100,
    startTime: "25/06/2025 07:00:00",
  },
  {
    name: "5.1",
    moduleType: "WASH",
    status: "Idle",
    oee: 0,
    available: 0,
    utilized: 0,
    availability: 100,
    planned: 0,
    produced: 0,
    performance: 0,
    accepted: 0,
    rejected: 0,
    quality: 0,
    startTime: "25/06/2025 18:30:00",
  },
  {
    name: "6.1",
    moduleType: "SEW",
    status: "Idle",
    oee: 79.8,
    available: 4.3,
    utilized: 4,
    availability: 94.4,
    planned: 11,
    produced: 9,
    performance: 84.5,
    accepted: 9,
    rejected: 0,
    quality: 100,
    startTime: "25/06/2025 14:08:19",
  },
  {
    name: "7.1",
    moduleType: "IRON",
    status: "Idle",
    oee: 79.8,
    available: 4.3,
    utilized: 4,
    availability: 94.4,
    planned: 11,
    produced: 9,
    performance: 84.5,
    accepted: 9,
    rejected: 0,
    quality: 100,
    startTime: "25/06/2025 14:08:19",
  },
];

const ModuleTrackingDashboard = (module) => {
  const { Panel } = Collapse
  const { Option } = Select;
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [timeFilter, setTimeFilter] = useState("week");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const handleMouseEnter = () => setActiveKey(module.name);
  const handleMouseLeave = () => setActiveKey(null);


  const getHeaderColor = (oee: number) => {
    if (oee < 60) return "#ff4d4f";
    if (oee < 80) return "#faad14";
    return "#52c41a";
  };

  const getAPQColor = (apq: number) => {
    if (apq < 60) return "#ff4d4f";
    if (apq < 80) return "#faad14";
    return "#52c41a";
  };

  const filteredModules = selectedCategory ? modules.filter((module) => module.moduleType === selectedCategory) : modules;

  const getChartData = () => {
    switch (timeFilter) {
      case "day":
        return { categories: ["Monday", "Tuesday", "Wednesday", "Thursday"], plan: [120, 130, 140, 150], actual: [110, 125, 135, 145] };
      case "hour":
        return { categories: ["9 AM", "12 PM", "3 PM", "6 PM"], plan: [30, 40, 50, 60], actual: [28, 38, 48, 58] };
      default:
        return { categories: ["Week 1", "Week 2", "Week 3", "Week 4"], plan: [500, 550, 600, 650], actual: [450, 530, 580, 620] };
    }
  };

  const { categories, plan, actual } = getChartData();

  const chartOptions = {
    chart: { type: "column" },
    title: { text: `Plan vs Actual Minutes - ${selectedModule?.name}`, style: { fontSize: "16px" } },
    xAxis: { categories },
    yAxis: { title: { text: "Minutes" } },
    series: [
      { name: "Plan Minutes", data: plan, color: "#01576f" },
      { name: "Actual Minutes", data: actual, color: "#faad14" },
    ],
    plotOptions: {
      column: {
        borderRadius: 5,
        dataLabels: { enabled: true, style: { fontSize: "12px" } },
      },
    },
  };

  const handleIconClick = (module: Module) => {
    setSelectedModule(module);
    setIsModalVisible(true);
  };

  return (
    <Card title={<span style={{ display: 'flex', justifyContent: 'center', color: 'white' }}>Module Tracking Dashboard</span>} size="small" headStyle={{ backgroundColor: '#01576f' }} style={{ minHeight: '100vh' }}
      extra={
        <Select
          style={{ width: 200 }}
          placeholder="Select Operation Category"
          value={selectedCategory}
          showSearch
          allowClear
          onChange={(value) => setSelectedCategory(value)}
        >
          {Object.values(ProcessTypeEnum).map((category) => (
            <Select.Option key={category} value={category}>
              {category}
            </Select.Option>
          ))}
        </Select>
      }>
      <Row gutter={[16, 16]}>
        {filteredModules.map((module, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Collapse
              bordered={false}
              style={{ backgroundColor: getHeaderColor(module.oee), boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"}}
              expandIcon={() => null}
            >
              <Panel
                key={index}
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{module.name}</p>
                    {/* <Tag style={{ margin: '0 8px' }}>{module.moduleType}</Tag> */}
                    <img src={DowntimeIcon} height={20} width={20} />
                    <BarChartOutlined onClick={() => handleIconClick(module)} />
                  </div>
                }
                showArrow={false}
                className="custom-collapse-panel"
              >
                <div style={{ backgroundColor:'transparent' }}>
                  <Row>
                    <Col span={6}><span className='module-tracking-data'>OEE</span></Col>
                    <Col span={18}><Progress type="line" percent={module.oee} format={() => <span style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>{module.oee}%</span>} /></Col>
                  </Row>
                  <p style={{ fontSize: '11px', fontWeight: '500', textAlign: 'left' }}>Possible Next Plan Date: <span className='module-tracking-data'>{module.startTime ? moment(module.startTime, "DD/MM/YYYY HH:mm:ss").format("DD-MM-YYYY HH:mm") : "N/A"}</span></p>
                  <Divider style={{ borderWidth: '2px', borderColor: '#bfbfbf', margin: '4px' }} />
                  <Row justify="center" gutter={[8, 8]}>
                    <Col span={8}><p className="module-tracking-heading">Available <br /><span className='module-tracking-data'>{module.available}h</span></p></Col>
                    <Col span={8}><p className="module-tracking-heading">Utilized <br /><span className='module-tracking-data'>{module.utilized}h</span></p></Col>
                    <Col span={8}><p className="module-tracking-heading">Availability <br /><span style={{ fontSize: '14px', fontWeight: '600', color: getHeaderColor(module.availability) }}>{module.availability}</span></p></Col>
                  </Row>
                  <Divider style={{ borderWidth: '2px', borderColor: '#bfbfbf', margin: '4px' }} />
                  <Row justify="center" gutter={[8, 8]}>
                    <Col span={8}><p className="module-tracking-heading">Planned <br /><span className='module-tracking-data'>{module.planned}</span></p></Col>
                    <Col span={8}><p className="module-tracking-heading">Actual <br /><span className='module-tracking-data'>{module.produced}</span></p></Col>
                    <Col span={8}><p className="module-tracking-heading">Performance <br /><span style={{ fontSize: '14px', fontWeight: '600', color: getAPQColor(module.performance) }}>{module.performance}</span></p></Col>
                  </Row>
                  <Divider style={{ borderWidth: '2px', borderColor: '#bfbfbf', margin: '4px' }} />
                  <Row justify="center" gutter={[8, 8]}>
                    <Col span={8}><p className="module-tracking-heading">Accepted <br /><span className='module-tracking-data'>{module.accepted}</span></p></Col>
                    <Col span={8}><p className="module-tracking-heading">Rejected <br /><span className='module-tracking-data'>{module.rejected}</span></p></Col>
                    <Col span={8}><p className="module-tracking-heading">Quality <br /><span style={{ fontSize: '14px', fontWeight: '600', color: getAPQColor(module.quality) }}>{module.quality}</span></p></Col>
                  </Row>
                </div>
              </Panel>
            </Collapse>
          </Col>
        ))}
      </Row>
      <Modal
        title={`Plan vs Actual Minutes - ${selectedModule?.name}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" type="primary" danger onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Select value={timeFilter} onChange={setTimeFilter} style={{ width: 200 }}>
            <Option value="day">Day Wise</Option>
            <Option value="week">Week Wise</Option>
            <Option value="hour">Hour Wise</Option>
          </Select>
          {/* <Button type="primary" onClick={() => alert("Data Exported")}>
            Export Data
          </Button> */}
        </div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Modal>
    </Card>
  );
};

export default ModuleTrackingDashboard;
