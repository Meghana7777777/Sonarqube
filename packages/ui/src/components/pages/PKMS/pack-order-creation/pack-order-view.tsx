import { QuestionCircleOutlined, RedoOutlined } from "@ant-design/icons";
import { PackOrderCreationModel, PackOrderCreationRequest, PackSerialRequest, MoListModel, MoListRequest, MoStatusEnum } from "@xpparel/shared-models";
import { OrderManipulationServices, PreIntegrationServicePKMS } from "@xpparel/shared-services";
import { Button, Col, Popconfirm, Row, Select, Space, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../common";
import { AlertMessages } from "../../../common";
interface PackOrderViewProps {
    onStepChange: (step: number, selectedRecord: PackSerialRequest) => void;
}

const { Option } = Select;

export const PackOrderView = (props: PackOrderViewProps) => {
    const { onStepChange } = props;
    const [moList, setMoList] = useState<MoListModel[]>([]);
    const [SewingOrderData, setSewingOrderData] = useState<PackOrderCreationModel[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const user = useAppSelector((state) => state.user.user.user);



    const OMSService = new OrderManipulationServices();
    const PKMSService = new PreIntegrationServicePKMS();

    useEffect(() => {
        const reqObject = new MoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, MoStatusEnum.IN_PROGRESS)
        OMSService.getListOfMo(reqObject).then((response) => {
            if (response.status) {
                setMoList(response?.data);
            } else {
                setMoList([]);
                AlertMessages.getErrorMessage(response.internalMessage);
            }
        }).catch(err => {
            setMoList([]);
            AlertMessages.getErrorMessage(err.message);
        })

    }, [])

    useEffect(() => {
        getPackOrderCreatedData();
    }, [selectedOrderId])


    const getPackOrderCreatedData = () => {
        if (selectedOrderId) {
            // const reqObj = new PackOrderCreationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, selectedOrderId)
            // PKMSService.getPackOrderCreatedData(reqObj).then((response) => {
            //     if (response.status) {
            //         setSewingOrderData(response?.data)
            //     } else {
            //         setSewingOrderData([])
            //         AlertMessages.getErrorMessage(response.internalMessage)
            //     }
            // }).catch((error) => {
            //     setSewingOrderData([])
            //     AlertMessages.getErrorMessage(error.message)
            // })
        }
    }

    const handleOrderChange = (orderId: number) => {
        setSelectedOrderId(orderId);

    };

    const handleReload = () => {
        getPackOrderCreatedData();

    };

    const deleteMo = (record: PackOrderCreationModel) => {
        const reqObj = new PackSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, record.pkSerial, record.pkOrderId, false, false)
        PKMSService.deletePackOrder(reqObj).then((response) => {
            if (response.status) {
                getPackOrderCreatedData()
            } else {
                AlertMessages.getErrorMessage(response.internalMessage)
            }
        }).catch((error) => {
            AlertMessages.getErrorMessage(error.message)
        })
    }


    const actionButtonHandler = (): any => {


        return [
            {
                title: "Activity",
                key: "actions",
                fixed: "right",
                align: "center",
                width: 80,
                render: (text, record: PackOrderCreationModel) => (

                    <Space>
                        <Button size='small' type='primary' onClick={() => {
                            const req = new PackSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, record.pkSerial, record.pkOrderId, true, true);
                            onStepChange(1, req);

                        }}>Proceed</Button>
                        <Popconfirm
                            title="Delete Product type Sku Mapping"
                            description="Are you sure to delete this ?"
                            onConfirm={() => deleteMo(record)}
                            okText="Yes"
                            cancelText="No"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                            <Button type="primary" size={'small'} danger>Delete</Button>
                        </Popconfirm>
                    </Space>

                ),
            },
        ];
    };

    const expandedRowRender1 = (record: PackOrderCreationModel) => {
        const expandedRowRender = (record: any) => {
            console.log("Record:", record);

            const filteredFeatureGrouping = record?.featureGrouping?.flatMap((fg: any) =>
                fg.subLineInfo?.map((subLine: any) => ({
                    ...subLine,
                    sizes: {
                        [subLine.size]: subLine.quantity,
                    },
                })) || []
            );

            const innerColumns = [
                { title: "Destination", dataIndex: "destination", key: "destination" },
                { title: "Delivery Date", dataIndex: "deliveryDate", key: "deliveryDate" },
                { title: "CO Line", dataIndex: "coLine", key: "coLine" },
                { title: "Buyer PO", dataIndex: "buyerPo", key: "buyerPo" },
                { title: "Product Type", dataIndex: "productType", key: "productType" },
                { title: "Product Name", dataIndex: "productName", key: "productName" },
                { title: "Color", dataIndex: "color", key: "color" },
                { title: "Size", dataIndex: "size", key: "size" },
                { title: "Quantity", dataIndex: "quantity", key: "quantity" },
            ];

            console.log("Inner Columns:", innerColumns);

            return (
                <Table
                    size="small"
                    rowKey="sSubLineId"
                    dataSource={filteredFeatureGrouping}
                    columns={innerColumns}
                    pagination={false}
                    bordered
                />
            );
        };
        const parentColumns: ColumnsType<any> = [
            { title: "MO Line", dataIndex: "moLine", key: "moLine" },
            { title: "Product Type", dataIndex: "productType", key: "productType" },
            { title: "Product Name", dataIndex: "productName", key: "productName" },
            { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        ];

        return (
            <Table
                size="small"
                rowKey={(row) => row.pkLineId}
                dataSource={record.moLineInfo}
                columns={[...parentColumns]}
                pagination={false}
                bordered
                expandable={{
                    expandedRowRender,
                }}
            />);


    }

    const mainColumns: ColumnsType<any> = [
        { title: "Packing Order Serial", dataIndex: "pkSerial", key: "pkSerial" },
        { title: "Manufacturing Order", dataIndex: "orderNumber", key: "orderNumber" },
        { title: "Style", dataIndex: "style", key: "style" },
        { title: "Po No", dataIndex: "orderNumber", key: "orderNumber" },
        { title: "Buyer Name", dataIndex: "customerName", key: "customerName" },


        { title: "Packing Order Description", dataIndex: "description", key: "description" },
        { title: "Destination", dataIndex: "destination", key: "destination" },
        { title: "Delivery Date", dataIndex: "deliveryDate", key: "deliveryDate" },

        // { title: "Product Type", dataIndex: "productType", key: "productType" },
    ]
    return (
        <>
            <Row gutter={[16, 16]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Col>
                    MO/Plant Style Ref :
                    <Select showSearch={true}
                        style={{ width: '200px' }}
                        placeholder='Select Manufacturing Order'
                        optionFilterProp="label"
                        onChange={(value) => handleOrderChange(value)}
                        allowClear={true}
                        filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                    >
                        {moList.map(moList => {
                            return <Option value={moList.orderId} key={`${moList.orderId}`}>{moList.plantStyle ? moList.orderNo + ' - ' + moList.plantStyle : moList.orderNo}</Option>
                        })}
                    </Select>
                </Col>
                <Col>
                    <Tooltip title="Reload">
                        <Button
                            disabled={!selectedOrderId}
                            type="primary"
                            icon={<RedoOutlined style={{ fontSize: "20px" }} />}
                            onClick={handleReload}
                        />
                    </Tooltip>
                </Col>
            </Row>

            <br />
            <Row>
                <Col span={24}>
                    <Table
                        size="small"
                        rowKey={(row) => row.pkOrderId}
                        dataSource={SewingOrderData || null}
                        columns={[...mainColumns, ...actionButtonHandler()]}
                        pagination={false}
                        bordered
                        expandable={{
                            expandedRowRender: expandedRowRender1,

                        }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default PackOrderView;
