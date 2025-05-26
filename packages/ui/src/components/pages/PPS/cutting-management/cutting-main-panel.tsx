import { CPS_R_CutBundlingProductColoCgInfoModel, CPS_R_CutBundlingProductColorBundlingSummaryModel, CPS_R_CutBundlingSummaryRequest, PoSummaryModel, ProcessingOrderSerialRequest, ProcessTypeEnum, StyleProductCodeFgColor } from "@xpparel/shared-models";
import { CutBundlingService, CutOrderService, KnitOrderService } from "@xpparel/shared-services";
import { Card, Space, Tabs, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import { CuttBundlingSummary } from "./cut-bundling-summary";



interface IProps {
    poObj: PoSummaryModel;
    onStepChange: (step: number, po: PoSummaryModel) => void
}

interface Ipropsss {
    processingSerial: number;
} 

export interface BundlingTableRow {
    key: number;
    itemCode: string;
    components: string;
    [size: string]: string | number; // Allow dynamic size keys
}



export const CutBundlePoPage = (props: IProps) => {
    const poSerial:number=props.poObj?.poSerial;
    // const poSerial:number=props?.processingSerial;
    const cutOrderService = new CutOrderService();
    const cutBundlingService = new CutBundlingService()
    const [productCodeData, setProductCodeData] = useState<StyleProductCodeFgColor[]>();
    const user = useAppSelector((state) => state.user.user.user);
    const [activeProduct, setActiveProduct] = useState<StyleProductCodeFgColor>(undefined);
    const [activeTabKey, setActiveTabKey] = useState<string>(undefined);
    const [bundleSummary, setBundleSummary] = useState<CPS_R_CutBundlingProductColorBundlingSummaryModel>()
    const [tableData, setTableData] = useState<BundlingTableRow[]>()
    const [sizes,setSizes]=useState<string[]>([]);
    useEffect(() => {
        getStyleProductCodeFgColorForPo();
    }, []);

    useEffect(() => {
        if (activeProduct) {
            getBundlingSummaryForPoProdCodeAndColor()
        }
    }, [activeProduct])

    const getStyleProductCodeFgColorForPo = () => {
        try {
            const req = new ProcessingOrderSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [poSerial], ProcessTypeEnum.CUT);
            cutOrderService.getStyleProductCodeFgColorForPo(req).then(res => {
                if (res.status) {
                    setProductCodeData(res.data)
                    setActiveProduct(res.data[0])
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }
    }

    const getBundlingSummaryForPoProdCodeAndColor = () => {
        try {
            if (!activeProduct) {
                return
            }
            const req = new CPS_R_CutBundlingSummaryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, activeProduct?.productCode, activeProduct?.fgColor, true, true);
            cutBundlingService.getBundlingSummaryForPoProdCodeAndColor(req).then(res => {
                if (res.status) {
                    setBundleSummary(res.data)
                    const tableData = transformData(res.data?.cgWiseQtys);
                    setTableData(tableData);
                } else {
                    setBundleSummary(undefined)
                    setTableData([])
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
        } catch (err) {
            setBundleSummary(undefined)
            AlertMessages.getErrorMessage(err.message);
        }
    }

    function transformData(cgWiseQtys: CPS_R_CutBundlingProductColoCgInfoModel[]): BundlingTableRow[] {
        const sizesSet = new Set<string>();

        cgWiseQtys.forEach(item => {
            ['cutRepQtys', 'docGenQtys', 'orderQtys'].forEach(key => {
                item[key].forEach((qty: any) => {
                    sizesSet.add(qty.size);
                });
            });
        });

        const sizes: string[] = Array.from(sizesSet);
        setSizes(sizes);
        return cgWiseQtys?.map((item, index) => {
            const row: BundlingTableRow = {
                key: index + 1,
                itemCode: item.rmSku,
                components: item.components.join(', ')
            };

            sizes.forEach(size => {
                const doc = item.docGenQtys.find((q: any) => q.size === size)?.docGenQty ?? '-';
                const cut = item.cutRepQtys.find((q: any) => q.size === size)?.cutRepQty ?? '-';
                const order = item.orderQtys.find((q: any) => q.size === size)?.orderQty ?? '-';
                row[size] = `${doc},${cut},${order}`;
            });

            return row;
        });
    }




    function onTabChange(key) {
        setActiveTabKey(key);
        const [productCode, fgColor] = key.split('@');
        const selectedProduct = productCodeData?.find(product => product.productCode === productCode && product.fgColor === fgColor);
        setActiveProduct(selectedProduct);
    }

    function renderProductTabItems(): any {
        if (productCodeData && productCodeData.length > 0) {
            return productCodeData.map((v) => ({
                key: v.productCode.toString() + '@' + v.fgColor, // do not change the @
                label: v.productName + '/' + v.fgColor,
                children: ''
            }));
        }
        return []
    }

    function renderKnitgroupsTabextra() {
        return <Space>
            <Tag color="#257d82">doc Qty</Tag>
            <Tag color="#da8d00">cut Qty</Tag>
            <Tag color="#ff0000">order Qty</Tag>
        </Space>
    }
    return (
        <Card>
            <Tabs size='small' className='knit-job-ratio-tabs' items={renderProductTabItems()} defaultActiveKey={activeTabKey} onChange={(key) => onTabChange(key)} tabBarExtraContent={renderKnitgroupsTabextra()} />
            <CuttBundlingSummary bundlingSummary={tableData} processingSerial={poSerial} productCode={activeProduct?.productCode}
            fgColor={activeProduct?.fgColor}
            refreshComponent={getBundlingSummaryForPoProdCodeAndColor} productName={activeProduct?.productName} sizes={sizes} activeTabKey={activeTabKey} />
        </Card>
    );
}