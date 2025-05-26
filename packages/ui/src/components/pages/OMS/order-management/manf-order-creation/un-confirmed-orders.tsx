import { AppstoreAddOutlined, DownCircleFilled, QuestionCircleOutlined, UpCircleFilled } from "@ant-design/icons"
import { CommonRequestAttrs, ManufacturingOrderDumpModel, SI_ManufacturingOrderInfoModel, SI_MoLineInfoModel, SI_MoNumberRequest, SI_SoNumberRequest } from "@xpparel/shared-models";
import { OrderCreationService } from "@xpparel/shared-services";
import { Button, Card, Popconfirm, Table } from "antd"
import { ColumnType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
interface IProps {
    updateMoNumber?: (moNumber: string) => void;
    reloadKey: number
}
const UnconfirmedOrdersPage = (props: IProps) => {
    const [ordersData, setOrderData] = useState<SI_ManufacturingOrderInfoModel[]>([])
    const orderService = new OrderCreationService();
    const user = useAppSelector((state) => state.user.user.user);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        fetchUnconfirmedOrders();
    }, [props.reloadKey]);

    const fetchUnconfirmedOrders = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        orderService.getUnConfirmedManufacturingOrdersInfo(reqObj).then(res => {
            if (res.status) {
                setOrderData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };

    const deleteManufacturingOrder = (record: SI_ManufacturingOrderInfoModel) => {
        const req = new SI_MoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, record.moNumber, null, false, false, false, false, false, false, false, false, false, false, false, null, null)
        orderService.deleteOrders(req).then(res => {
            if (res.status) {
                 props.updateMoNumber(undefined)
                AlertMessages.getSuccessMessage(res.internalMessage)
                fetchUnconfirmedOrders();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };

    const getProductsOfMo = (manufacturingOrderData: SI_ManufacturingOrderInfoModel) => {
        const prods = [];
        manufacturingOrderData.moLineModel.map(line => line.moLineProducts.map(product => prods.push(product.productName)));
        return [...new Set(prods)];
    };

    const handleProceed = (record: SI_ManufacturingOrderInfoModel) => {
        props.updateMoNumber(record.moNumber);
    };

    const columns: ColumnType<SI_ManufacturingOrderInfoModel>[] = [
        {
            title: 'S No',
            dataIndex: 'serialNo',
            key: 'serialNo',
            align: 'center',
            render: (_, record, index) => index + 1,
        },
        {
            title: 'MO Number',
            dataIndex: 'moNumber',
            key: 'moNumber',
            align: 'center',
        },
        {
            title: 'MO Upload Date',
            dataIndex: 'uploadedDate',
            key: 'uploadedDate',
            align: 'center',
            render: (text) => {
                const date = new Date(text);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            }
        },
        {
            title: 'Style',
            dataIndex: 'style',
            key: 'style',
            align: 'center',
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            align: 'center',
            render: (_, record) => {
                const products = getProductsOfMo(record);
                return products.join(', ');
            },
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            width: 200,
            render: (_, record) => (
                <div>
                    <Button
                        type="primary"
                        onClick={() => handleProceed(record)}
                    >
                        Proceed
                    </Button>
                    <Popconfirm
                        title="Delete Manufacturing Numbers"
                        description="Are you sure to delete this MO?"
                        onConfirm={() => deleteManufacturingOrder(record)}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    ><Button
                        type="primary"
                        style={{ marginLeft: '10px', backgroundColor: '#cc2b39', color: 'white' }}
                    >
                            Delete
                        </Button>
                    </Popconfirm>

                </div>
            ),
        },
    ];

    const moLineComponent = (moLine: SI_MoLineInfoModel[]) => {
        const moLineColumns: ColumnType<SI_MoLineInfoModel>[] = [
            {
                title: 'S No',
                dataIndex: 'serialNo',
                key: 'serialNo',
                align: 'center',
                render: (_, record, index) => index + 1,
            },
            {
                title: 'MO Line',
                dataIndex: 'moLineNo',
                key: 'moLineNo',
                align: 'center',
            },
            {
                title: 'Product',
                dataIndex: 'productName',
                key: 'productName',
                align: 'center',
                render: (_, record) => {
                    return record.moLineProducts.map((product) => product.productName).join(', ');
                },
            },
            {
                title: 'Destination',
                dataIndex: 'destination',
                key: 'destination',
                align: 'center',
                render: (_, record) => {
                    return record.moLineAttrs.destinations.join(', ');
                },
            },
            {
                title: 'Delivery Date',
                dataIndex: 'deliveryDate',
                key: 'deliveryDate',
                align: 'center',
                render: (_, record) => {
                    return record.moLineAttrs.delDates
                        .map(dateStr => {
                            const date = new Date(dateStr);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}-${month}-${year}`;
                        })
                        .join(', ');
                },
            },
            {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
                align: 'center',
                render: (_, record) => {
                    let quant = 0;
                    record.moLineProducts.map(prod =>
                        prod.subLines.map(subLine => {
                            quant += subLine.qty;
                        })
                    );
                    return quant;
                },
            },
            // {
            //     title: 'Action',
            //     key: 'action',
            //     align: 'center',
            //     width: 200,
            //     render: (_, record) => (
            //         <div>
            //             <Button
            //                 // type="primary"
            //                 style={{backgroundColor:'green',color:'white'}}
            //                 // onClick={() => handleProceed(record)}
            //             >
            //                 <AppstoreAddOutlined /> Sizes Info
            //             </Button>

            //         </div>
            //     ),
            // },
        ];

        return (
            <Table
                columns={moLineColumns}
                dataSource={moLine}
                bordered
                rowKey={(record) => record.moLineNo}
                pagination={false}
            />
        );
    };

    const handleExpand = (expanded: boolean, record: SI_ManufacturingOrderInfoModel) => {
        setExpandedRowKeys(expanded ?
            [...expandedRowKeys, record.moPk] :
            expandedRowKeys.filter(key => key !== record.moPk)
        );
    };
    const renderItems = (record: SI_ManufacturingOrderInfoModel) => {
        return moLineComponent(record.moLineModel);
    };
    return (
        <Card size='small' title="Unconfirmed Orders" style={{ marginTop: '30px' }}>
            <Table
                size='small'
                columns={columns}
                dataSource={ordersData}
                bordered
                scroll={{ x: 'max-content' }}
                rowKey="moPk"
                pagination={false}
                expandable={{
                    expandedRowRender: record => renderItems(record),
                    onExpand: handleExpand,
                    expandedRowKeys: expandedRowKeys,
                    expandIcon: ({ expanded, onExpand, record }) =>
                        expanded ? (
                            <UpCircleFilled onClick={e => onExpand(record, e)} />
                        ) : (
                            <DownCircleFilled onClick={e => onExpand(record, e)} />
                        )
                }}
            />
        </Card>
    );
};

export default UnconfirmedOrdersPage;
