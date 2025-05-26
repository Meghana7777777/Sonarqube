import { ReloadOutlined } from "@ant-design/icons";
import { MaterialReqStatusEnum, WhReqByObjectEnum } from "@xpparel/shared-models";
import { Button, Card, Col, Row, Space, Tooltip } from "antd";
import { MaterialStatusCard } from "./material-status-card";
import { useState } from "react";

interface IMaterialIssuanceStepContentProps {
    activeMainTab: WhReqByObjectEnum
}
export const MaterialIssuanceStepContent = (props: IMaterialIssuanceStepContentProps) => {
    const [searchData, setSearchData] = useState("");
    const [refreshKey, setRefreshKey] = useState(1);

    const refreshWholeState = () => {
        setRefreshKey(prev => prev + 1);
    }

    return <Card title={"Material Issuance"} size='small'
        extra={
            <Space>
                <Tooltip title="Reload & Clear">
                    <Button onClick={() => { setRefreshKey(prev => prev + 1); }} icon={<ReloadOutlined />} />
                </Tooltip>
            </Space>
        }
    >
        <Row gutter={16} key={refreshKey}>
            {Object.keys(MaterialReqStatusEnum).map((subTab) => (<Col xl={6} lg={8} md={8} sm={12} xs={12}>
                <MaterialStatusCard activeMainTab={props.activeMainTab} subTab={MaterialReqStatusEnum[subTab]} searchData={searchData} refreshWholeState={refreshWholeState}/>
            </Col>))}
        </Row>
    </Card>;
};

export default MaterialIssuanceStepContent;
