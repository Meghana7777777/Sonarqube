import { useState, useEffect } from 'react';
import { Table, Typography, Input, Button, message, Tag, Flex, Tooltip, Card } from 'antd';
import { SI_MoNumberRequest, MOC_MoProdCodeRequest, MOC_MoProductFabConsumptionRequest, MOC_MoProductFabSizeCons, ItemModel, ItemCodesRequest } from '@xpparel/shared-models';
import { OrderCreationService, MOConfigService, ItemSharedService } from '@xpparel/shared-services';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from '../../common';

const { Title } = Typography;

interface IProductFgColorInfo {
    productType: string;
    productCode: string;
    fgColor: string;
    allSizes: string[];
    tblData: TableRow[]
}
interface TableRow {
    key: string;
    component: string;
    itemColor: string;
    itemCode: string;
    setCons: string;
    rowSpan: number;
    sizes: {
        [key: string]: number;
    };
}

const FabConsumptionPage = ({ moNumber }: { moNumber: string }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [tableData, setTableData] = useState<IProductFgColorInfo[]>([]);
    const [itemsData, setItemsData] = useState<ItemModel[]>()
    const orderService = new OrderCreationService();
    const configService = new MOConfigService();
    const user = useAppSelector((state) => state.user.user.user);
    const itemSharedService = new ItemSharedService();

    useEffect(() => {
        fetchProducts();
    }, [moNumber]);

    useEffect(() => {
        fetchFabricConsumption();
    }, [products]);

    const fetchProducts = async () => {
        try {
            const requestModel = new SI_MoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moNumber, undefined, false, false, false, false, false, false, false, false, false, false, undefined, undefined);
            const response = await orderService.getDistinctProductFgColorInfoForMO(requestModel);
            if (response.status) {
                setProducts(response.data);
            } else {
                AlertMessages.getErrorMessage(response.internalMessage);
            }
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
        }
    };

    const getItemNamesOfItemCodes = (itemCodes: string[]) => {
        const req = new ItemCodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, itemCodes);
        console.log(req)
        itemSharedService.getItemNamesOfItemCodes(req).then(
            (res) => {
                if (res.status) {
                    setItemsData(res?.data)
                }
                else {
                    console.log(res.internalMessage)
                }
            }).catch((err) => {
                console.log(err)
            })
    }
    const fetchFabricConsumption = async () => {
        try {
            if (!products.length) return;
            const productColorTblData: IProductFgColorInfo[] = [];

            for (const product of products) {
                const key = `${product.productType}_${product.fgColor}`;
                const productFgColorObj: IProductFgColorInfo = {
                    allSizes: [],
                    fgColor: product.fgColor,
                    productType: product.productType,
                    productCode: product.productCode,
                    tblData: []
                }
                const request = new MOC_MoProdCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, moNumber, product.productCode, product.styleCode, product.fgColor);
                const response = await configService.getFabConsumptionForMoProduct(request);
                if (response.status) {
                    let uniqueSizes = [];
                    const componentRowSpanObj = new Object()
                    const tblData = response.data.flatMap((item, index: number) => {
                        // Map the fabric consumption data properly from response
                        return item?.fabCons.map((fabItem, itemIndex) => {
                            const sizeConsumptionObj = Object();
                            if (item?.fabCons.length > 0) {
                                item?.fabCons.forEach(itemObj => {
                                    itemObj.sizeCons.forEach(sizeObj => {
                                        sizeConsumptionObj[sizeObj.size] = Number(sizeObj.cons);
                                    });
                                });
                            } else {
                                item.sizesList.forEach(size => {
                                    sizeConsumptionObj[size] = 0;
                                })
                            }
                            uniqueSizes = item.sizesList;
                            if (fabItem?.component in componentRowSpanObj) {
                                componentRowSpanObj[fabItem?.component] += 1;
                            } else {
                                componentRowSpanObj[fabItem?.component] = 1;
                            }

                            const tblRow: TableRow = {
                                key: `${key}_${index}_${itemIndex}`,
                                component: fabItem?.component || '',
                                itemColor: fabItem?.itemCode || '',
                                itemCode: fabItem?.itemCode || '',
                                setCons: '', // Initial empty value
                                sizes: sizeConsumptionObj,
                                rowSpan: 1
                            }
                            return tblRow;
                        })
                    });
                    const sortedData = tblData.sort((a, b) => a.component.localeCompare(b.component));
                    const rowSpanUsedComponent = new Set<string>();
                    const rowSpanTlData = sortedData.map((r, sIndex) => {
                        const rowObj = {
                            ...r,
                            rowSpan: rowSpanUsedComponent?.has(r.component) ? 0 : componentRowSpanObj[r.component]
                        }
                        rowSpanUsedComponent.add(r.component);
                        return rowObj;
                    })
                    productFgColorObj.tblData = rowSpanTlData
                    productFgColorObj.allSizes = uniqueSizes;
                    productColorTblData.push(productFgColorObj);
                }
            }
            const uniqueCodes = [...new Set(productColorTblData.flatMap((data) => data.tblData.map((item) => item.itemCode))),];
            getItemNamesOfItemCodes(uniqueCodes);
            setTableData(productColorTblData);
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
        }
    };

    const handleSave = async (productColorData: IProductFgColorInfo) => {
        const { productCode, fgColor, tblData, allSizes } = productColorData;

        const fabConsData = tblData.map(row => {
            const sizeCons = allSizes.map(size => ({
                size,
                cons: row.sizes[size] || 0,
            }));
            return new MOC_MoProductFabSizeCons(row.itemCode, row.component, sizeCons);
        });
        const saveRequest = new MOC_MoProductFabConsumptionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, moNumber, productCode, fgColor, fabConsData);
        try {
            configService.saveFabConsumptionForMoProduct(saveRequest).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }).catch(err => {
                AlertMessages.getErrorMessage(err.message)
            })

        } catch (error) {
            AlertMessages.getErrorMessage(error.internalMessage)
        }
    };



    const updateTableData = (productIndex: number, rowKey: string, field: keyof TableRow, value: any) => {
        setTableData(prev =>
            prev.map((product, i) => {
                if (productIndex === i) {
                    return {
                        ...product,
                        tblData: product.tblData.map(row =>
                            row.key == rowKey ? { ...row, [field]: value } : row
                        )
                    }
                }
                return product
            }

            ));
    };

    const handleSetConsChange = (productIndex: number, rowKey: string, value: string, sizes: string[]) => {
        const sizeObj: { [key: string]: number } = {};
        sizes.forEach(size => {
            sizeObj[size] = Number(value);
        })
        setTableData(prev =>
            prev.map((product, i) => {
                if (i === productIndex) {
                    return {
                        ...product,
                        tblData: product.tblData.map(row =>
                            row.key === rowKey
                                ? {
                                    ...row,
                                    setCons: value,
                                    sizes: sizeObj // sizes should be a { [key: string]: number }
                                }
                                : row
                        )
                    };
                }
                return product;
            })
        );
    };

    const columns = (productKey: string, fgColor: string, productIndex: number, sizes: string[]) => [
        {
            title: 'Component', dataIndex: 'component', key: 'component', width: 120,
            onCell: (r) => {

                return { rowSpan: r.rowSpan };

            },
        },
        {
            title: 'Item Color',
            dataIndex: 'itemColor',
            key: 'itemColor',
            width: 120,
            render: (_, record) => {
                console.log(itemsData)
                const filteredItem = itemsData?.find((item) => item?.itemCode === record?.itemCode);
                return filteredItem ? filteredItem.itemColor : 'N/A';
            }
        },
        { title: 'Item Code', dataIndex: 'itemCode', key: 'itemCode', width: 120 },
        {
            title: 'Set Cons',
            dataIndex: 'setCons',
            key: 'setCons',
            width: 100,
            render: (text: string, record: TableRow) => (
                <Input
                    value={text}
                    onChange={e => handleSetConsChange(productIndex, record.key, e.target.value, sizes)}
                    style={{ width: '70px' }}
                />
            ),
        },
        ...sizes.map(size => ({
            title: size,
            key: size.toLowerCase(),
            width: 100,
            render: (_: any, record: TableRow) => (
                <Input
                    value={record.sizes[size as keyof TableRow['sizes']] || ''}
                    onChange={e =>
                        updateTableData(productIndex, record.key, 'sizes', {
                            ...record.sizes,
                            [size]: e.target.value,
                        })
                    }
                    style={{ width: '70px' }}
                />
            ),
        })),
    ];

    return (
        <div style={{ paddingTop: '16px' }}>
            {tableData.map((e, productIndex) => {
                const isDisabled = products[0]?.isMoProceeded;

                return (
                    <Card
                        key={e.productCode + e.fgColor}
                        style={{ marginBottom: '24px' }}
                        bordered
                        size='small'
                        title={
                            <>
                                <span>
                                    Product Type: <Tag color="#2db7f5">{e.productCode}</Tag>
                                </span>
                                <span style={{ marginLeft: '16px' }}>
                                    Color: <Tag color="#87d068">{e.fgColor}</Tag>
                                </span>
                            </>
                        }
                        extra={
                            <Tooltip title={isDisabled ? "This MO has already been Proceeded" : "Click to Save Consumption Details"}>
                                <Button type="primary" disabled={products[0]?.isMoProceeded} className='btn-green' size="small" onClick={() => handleSave(e)}>
                                    Save
                                </Button>
                            </Tooltip>
                        }
                    >
                        <Table
                            columns={columns(e.productCode, e.fgColor, productIndex, e.allSizes)}
                            dataSource={e.tblData}
                            pagination={false}
                            bordered
                            size="small"
                            scroll={{ x: 'max-content' }}
                        />
                    </Card>
                );
            })}
        </div>
    );
};

export default FabConsumptionPage;