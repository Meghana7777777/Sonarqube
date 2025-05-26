import { useState, useEffect } from 'react';
import { Tabs, Table, Descriptions, Tag, Typography, Divider } from 'antd';
import { StyleProductOpService } from '@xpparel/shared-services';
import { MOP_OpRoutingRetrievalRequest } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from '../../common';

const OpVersionPage = ({ style, productType }) => {
    const [versions, setVersions] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [versionData, setVersionData] = useState(null);
    const styleProductOpService = new StyleProductOpService();
    const { Text } = Typography;
    const user = useAppSelector((state) => state.user.user.user);

    useEffect(() => {
        const fetchVersions = async () => {
            try {
                const reqModel = new MOP_OpRoutingRetrievalRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, style, productType, undefined, false, false);
                const response = await styleProductOpService.getOpVersionsForStyleAndProductType(reqModel);
                if (response.status && response.data) {
                    setVersions(response.data);
                    setActiveTab(response.data[0]?.versionName);
                }
            } catch (error) {
                AlertMessages.getErrorMessage(error.internalMessage)
            }
        };
        fetchVersions();
    }, [style, productType]);

    useEffect(() => {
        const fetchVersionData = async () => {
            if (!activeTab) return;
            try {
                const reqModel = new MOP_OpRoutingRetrievalRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, style, productType, versions.find(v => v.versionName === activeTab)?.versionId, true, false);
                const response = await styleProductOpService.getOpVersionInfoForStyleAndProductType(reqModel);
                if (response.status && response.data) {
                    setVersionData(response.data);
                }
            } catch (error) {
                setVersionData(activeTab);
                AlertMessages.getErrorMessage(error.internalMessage)
            }
        };
        fetchVersionData();
    }, [activeTab, style, productType, versions]);

    // Prepare data for the table
    const prepareTableData = (processTypeList) => {
        return processTypeList?.subProcessList?.map((subProcess, index) => ({
            key: index,
            subProcessName: subProcess.subProcessName,
            dependentSubProcesses: subProcess.dependentSubProcesses,
            components: subProcess.components,
            operations: subProcess.operations,
            order: subProcess.order
        })) || [];
    };

    // Handle tab change
    const onTabChange = (key) => {
        setActiveTab(key);
    };

    // Table columns
    const columns = [
        {
            title: "Order",
            dataIndex: "order",
            key: "order",
        },
        {
            title: "Sub Process Name",
            dataIndex: "subProcessName",
            key: "subProcessName",
        },
        {
            title: "Dependent Sub Process",
            dataIndex: "dependentSubProcesses",
            key: "dependentSubProcesses",
            render: (dependentSubProcesses) => {
                const colors = ["blue", "green", "orange", "purple"];
                return dependentSubProcesses?.length ? (
                    dependentSubProcesses.map((process, index) => (
                        <Tag key={process} color={colors[index % colors.length]}>
                            {process}
                        </Tag>
                    ))
                ) : (
                    "-"
                );
            },
        },
        {
            title: "Components",
            dataIndex: "components",
            key: "components",
            render: (components) =>
                components?.length ? (
                    components.map((comp) => (
                        <Tag key={comp.compName} color="gold">
                            {comp.compName}
                        </Tag>
                    ))
                ) : (
                    "-"
                ),
        },
        {
            title: "Operations",
            dataIndex: "operations",
            key: "operations",
            render: (operations) => operations?.map((op) => (
                <span key={op.opCode}>
                    <Tag color="blue">{op.opCode} : {op.opName}</Tag>
                </span>
            ))
        }

    ];

    return (
        <div>
            <Tabs
                activeKey={activeTab}
                onChange={onTabChange}
                type="card"
                tabBarStyle={{
                    padding: "10px 16px",
                    borderRadius: "8px 8px 0 0",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                {versions.map((version) => (
                    <Tabs.TabPane
                        key={version.versionName}
                        tab={
                            <span
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                    padding: "8px 12px",
                                    color: activeTab === version.versionName ? "#0077b6" : "#333",
                                }}
                            >
                                {version.versionName}
                            </span>
                        }
                    >
                        <Descriptions
                            bordered
                            column={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4}}
                            size="middle"
                            style={{ background: "#fafafa", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                        >
                            <Descriptions.Item label={<Text strong style={{ color: "#1890ff" }}>Style</Text>}>
                                {versionData?.style || 'N/A'}
                            </Descriptions.Item>

                            <Descriptions.Item label={<Text strong style={{ color: "#52c41a" }}>Product Type</Text>}>
                                {versionData?.productType || 'N/A'}
                            </Descriptions.Item>

                            <Descriptions.Item label={<Text strong style={{ color: "#fa8c16" }}>Operation Version Code</Text>}>
                                <Text code>{versionData?.version || 'N/A'}</Text>
                            </Descriptions.Item>

                            <Descriptions.Item label={<Text strong style={{ color: "#eb2f96" }}>Description</Text>}>
                                <Text type="secondary">{versionData?.desc || '-'}</Text>
                            </Descriptions.Item>
                        </Descriptions>

                        {versionData?.processTypesList?.map((processTypeList, index) => (
                            <div key={index} style={{ marginBottom: 24 }}>
                                <Divider orientation="center">
                                    <span style={{ color: '#4A90E2', fontWeight: 'bold' }}>
                                        {processTypeList.processType}
                                    </span>
                                </Divider>

                                <Table
                                    columns={columns}
                                    dataSource={prepareTableData(processTypeList)}
                                    pagination={false}
                                    size="small"
                                    bordered
                                    scroll={{x: 'max-content'}}
                                    style={{minWidth: '100%'}}
                                />
                            </div>
                        ))}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    );
};

export default OpVersionPage;