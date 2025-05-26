import React from "react";
import { Card, Tabs } from "antd";
import type { TabsProps } from "antd";
import InspectionConfig from "./fabric-config";
import FGInspection from "./fg-config";
import YarnInspection from "./yarn-config";
import ThreadInspection from "./thread-config";
import TrimInspection from "./trim-config";

const onChange = (key: string) => {
  console.log("Selected Tab:", key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "🧵 Fabric",
    children: <InspectionConfig />,
  },
  {
    key: "2",
    label: "📦 FG",
    children: <FGInspection />,
  },
  {
    key: "3",
    label: "🪡 Thread",
    children: <ThreadInspection />,
  },
  {
    key: "4",
    label: "🧶 Yarn",
    children: <YarnInspection />,
  },
  {
    key: "5",
    label: "✂️ Trim",
    children: <TrimInspection />,
  },
];

const InspectionConfigMain: React.FC = () => {
  return (
    <div>
      <Card
        title={<span style={{ fontSize: "20px", fontWeight: 600 }}>🔍 Inspection Configuration</span>}
      >
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          tabBarGutter={30}
          animated
          size="large"
        />
      </Card>
    </div>
  );
};

export default InspectionConfigMain;
