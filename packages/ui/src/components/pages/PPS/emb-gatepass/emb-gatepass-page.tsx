import { PoEmbHeaderModel, PoSerialWithEmbPrefRequest, PoSummaryModel, RawOrderNoRequest, SoListModel, SoListRequest, SoStatusEnum } from "@xpparel/shared-models";
import { EmbRequestHandlingService, OrderManipulationServices, POService } from "@xpparel/shared-services";
import { Card, Form, Row, Col, Select, Button, Table, TabsProps, Tabs } from "antd"
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import EmbellishmentGatePassRequestsGrid from "./emb-gate-pass-requests-grid";
import EmbellishmentGatePassForm from "./gate-pass-form";
import { AppstoreAddOutlined, AppstoreOutlined } from "@ant-design/icons";
const { Option } = Select

const EmbellishmentGatePassPage = () => {
    useEffect(() => {

    }, [])
    const [currentHeaderTabKey, setCurrentHeaderTabKey] = useState<string>("1");
    const tabComponents: TabsProps['items'] = [
        {
            key: '1',
            label: <><AppstoreOutlined />All Gate Pass Requests</>,
            children: <EmbellishmentGatePassRequestsGrid />,
        },
        {
            key: '2',
            label: <><AppstoreAddOutlined />Create Gate Pass</>,
            children: <EmbellishmentGatePassForm />,
        },

    ];


    const changeHeaderTab = (key) => {
        setCurrentHeaderTabKey(key)
    }
    return (
        <Card size="small" className="card-title-bg-cyan1  po-process" bodyStyle={{ paddingTop: 0 }} >
            <Tabs centered size='small' className="dispatch-tab" onChange={changeHeaderTab} key={currentHeaderTabKey} defaultActiveKey={currentHeaderTabKey} items={tabComponents} />
        </Card>
    )
}
export default EmbellishmentGatePassPage;