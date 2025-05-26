import { DownCircleFilled, QuestionCircleOutlined, UpCircleFilled } from "@ant-design/icons";
import { CommonRequestAttrs, SI_SaleOrderInfoModel, SI_SoLineInfoModel, SI_SoNumberRequest } from "@xpparel/shared-models";
import { SaleOrderCreationService } from "@xpparel/shared-services";
import { Button, Card, Popconfirm, Table } from "antd";
import { ColumnType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
interface IProps {
    updateSoNumber?: (soNumber: string) => void;
    reloadKey: number
}
const UnconfirmedSaleOrdersPage = (props: IProps) => {
    const [ordersData, setOrderData] = useState<SI_SaleOrderInfoModel[]>([])
    const saleOrderCreationService = new SaleOrderCreationService();
    const user = useAppSelector((state) => state.user.user.user);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        fetchUnconfirmedOrders();
    }, [props.reloadKey]);

    const fetchUnconfirmedOrders = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        saleOrderCreationService.getUnConfirmedSaleOrdersInfo(reqObj).then(res => {
            if (res.status) {
                setOrderData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };
    const deleteSaleOrder = (record: SI_SaleOrderInfoModel) => {
        const req = new SI_SoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, record.soNumber, null, false, false, false, false, false, false, false, null, null)
        saleOrderCreationService.deleteSaleOrders(req).then(res => {
            if (res.status) {
                props.updateSoNumber(undefined)
                AlertMessages.getSuccessMessage(res.internalMessage)
                fetchUnconfirmedOrders();

            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };
    const getProductsOfSo = (saleOrderData: SI_SaleOrderInfoModel) => {
        const prods = [];
        saleOrderData.soLineModel.map(line => line.soLineProducts.map(product => prods.push(product.productName)));
        return [...new Set(prods)];
    };

    const handleProceed = (record: SI_SaleOrderInfoModel) => {
        props?.updateSoNumber(record?.soNumber);
    };

    const columns: ColumnType<SI_SaleOrderInfoModel>[] = [
        {
            title: 'S No',
            dataIndex: 'serialNo',
            key: 'serialNo',
            align: 'center',
            render: (_, record, index) => index + 1,
        },
        {
            title: 'SO Number',
            dataIndex: 'soNumber',
            key: 'soNumber',
            align: 'center',
        },
        {
            title: 'SO Upload Date',
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
                const products = getProductsOfSo(record);
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
                        title="Delete Sale Numbers"
                        description="Are you sure to delete this SO?"
                        onConfirm={() => deleteSaleOrder(record)}
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

    const soLineComponent = (soLine: SI_SoLineInfoModel[]) => {
        const soLineColumns: ColumnType<SI_SoLineInfoModel>[] = [
            {
                title: 'S No',
                dataIndex: 'serialNo',
                key: 'serialNo',
                align: 'center',
                render: (_, record, index) => index + 1,
            },
            {
                title: 'SO Line',
                dataIndex: 'soLineNo',
                key: 'soLineNo',
                align: 'center',
            },
            {
                title: 'Product',
                dataIndex: 'productName',
                key: 'productName',
                align: 'center',
                render: (_, record) => {
                    return record.soLineProducts.map((product) => product.productName).join(', ');
                },
            },
            {
                title: 'Destination',
                dataIndex: 'destination',
                key: 'destination',
                align: 'center',
                render: (_, record) => {
                    return record.soLineAttrs?.destinations.join(', ');
                },
            },
            {
                title: 'Delivery Date',
                dataIndex: 'deliveryDate',
                key: 'deliveryDate',
                align: 'center',
                render: (_, record) => {
                    return record.soLineAttrs?.delDates
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
                    record.soLineProducts.map(prod =>
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
                columns={soLineColumns}
                dataSource={soLine}
                bordered
                rowKey={(record) => record.soLineNo}
                pagination={false}
            />
        );
    };

    const handleExpand = (expanded: boolean, record: SI_SaleOrderInfoModel) => {
        setExpandedRowKeys(expanded ?
            [...expandedRowKeys, record.soPk] :
            expandedRowKeys.filter(key => key !== record.soPk)
        );
    };
    const renderItems = (record: SI_SaleOrderInfoModel) => {
        return soLineComponent(record.soLineModel);
    };
    return (
        <Card size='small' title="Unconfirmed Orders" style={{ marginTop: '30px' }}>
            <Table
                size='small'
                columns={columns}
                dataSource={ordersData}
                bordered
                scroll={{ x: 'max-content' }}
                style={{minWidth: '100%'}}
                rowKey="soPk"
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

export default UnconfirmedSaleOrdersPage;
