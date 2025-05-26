import { useEffect, useState } from "react";
import { Table, Tabs } from "antd";
import { MaterialReqStatusEnum, MaterialReqStatusEnumDisplayValue, MRStatusRequest, WhDashMaterialRequesHeaderModel, WhMatReqLineStatusEnum, WhReqByObjectEnum } from "@xpparel/shared-models";
import { FabricRequestCreationService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { CheckCircleOutlined, FolderOpenOutlined, HourglassOutlined, PictureOutlined, InboxOutlined, ScissorOutlined, FileTextOutlined, SkinOutlined } from "@ant-design/icons";
import { AlertMessages } from "../../../common";

interface ITabContentProps {
    mainTab: WhReqByObjectEnum;
    subTab: MaterialReqStatusEnum;
}

const TabContent = (props: ITabContentProps) => {
    const { mainTab, subTab } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<WhDashMaterialRequesHeaderModel[]>([]);
    const user = useAppSelector((state) => state.user.user.user);
    const fabricRequestCreationService = new FabricRequestCreationService();

    useEffect(() => {
        if (subTab) {
            fetchStatus();
        }
    }, [mainTab, subTab]);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const req = new MRStatusRequest(
                user.userName,
                user.unitCode,
                user.companyCode,
                user.userId,
                [subTab],
                mainTab
            );
            const response = await fabricRequestCreationService.getWhMaterialRequests(req);
            if (response.status) {
                setData(response.data);
            } else {
                AlertMessages.getErrorMessage(response.internalMessage);
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Request No",
            dataIndex: "requestNo",
            key: "requestNo",
        },
        {
            title: "Requested Material Type",
            dataIndex: "reqMaterialType",
            key: "reqMaterialType",
        },

    ];

    return (
        <div style={{ padding: 20 }}>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="requestNo"
            />
        </div>
    );
};


const getMainTabIcon = (tab: WhReqByObjectEnum) => {
    switch (tab) {
        case WhReqByObjectEnum.KNITTING:
            return <ScissorOutlined />;
        case WhReqByObjectEnum.PACKING:
            return <InboxOutlined />;
        case WhReqByObjectEnum.SEWING:
            return <SkinOutlined />;
        case WhReqByObjectEnum.DOCKET:
            return <FileTextOutlined />;
        default:
            return <FolderOpenOutlined />;
    }
};

const getSubTabIcon = (tab: MaterialReqStatusEnum) => {
    switch (tab) {
        case MaterialReqStatusEnum.OPEN:
            return <ScissorOutlined />;
        case MaterialReqStatusEnum.PREPARING_MATERIAL:
            return <InboxOutlined />;
        case MaterialReqStatusEnum.MATERIAL_NOT_AVL:
            return <SkinOutlined />;
        case MaterialReqStatusEnum.MATERIAL_ISSUED:
            return <FileTextOutlined />;
        default:
            return <FolderOpenOutlined />;
    }
};

const WarehouseRequestTabs = () => {
    const [activeMainTab, setActiveMainTab] = useState<string>(WhReqByObjectEnum.KNITTING);
    const [activeSubTab, setActiveSubTab] = useState<{ [key: string]: string }>(
        Object.keys(WhReqByObjectEnum).reduce((acc, key) => {
            acc[key] = WhMatReqLineStatusEnum.OPEN;
            return acc;
        }, {} as { [key: string]: string })
    );

    const handleMainTabChange = (key: string) => setActiveMainTab(key);
    const handleSubTabChange = (key: string, parentKey: string) => {
        setActiveSubTab((prev) => ({ ...prev, [parentKey]: key }));
    };

    return (
        <Tabs
            size="small"
            activeKey={activeMainTab}
            onChange={handleMainTabChange}
            centered
            items={Object.values(WhReqByObjectEnum).map((mainTab) => ({
                label: (
                    <>
                        {getMainTabIcon(mainTab)} {mainTab}
                    </>
                ),
                key: mainTab,
                children: (
                    <Tabs
                        size="small"
                        centered
                        activeKey={activeSubTab[mainTab]}
                        onChange={(key) => handleSubTabChange(key, mainTab)}
                        items={Object.keys(MaterialReqStatusEnum).map((subTab) => ({
                            label: (
                                <>
                                    {getSubTabIcon(MaterialReqStatusEnum[subTab])} {MaterialReqStatusEnumDisplayValue[subTab]}
                                </>
                            ),
                            key: MaterialReqStatusEnum[subTab],
                            children: (
                                <TabContent mainTab={mainTab} subTab={MaterialReqStatusEnum[subTab]} />
                            ),
                        }))
                        }
                    />
                ),
            }))}
        />
    );
};

export default WarehouseRequestTabs;
