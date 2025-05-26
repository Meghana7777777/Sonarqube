import { KMS_R_KnitBundlingProductColorBundlingSummaryModel, KMS_R_KnitBundlingProductColorBundlingSummaryRequest, ProcessingOrderSerialRequest, ProcessTypeEnum, StyleProductCodeFgColor } from "@xpparel/shared-models";
import { KnitOrderService, KnittingReportingService } from "@xpparel/shared-services";
import { Card, Space, Tabs, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { KnitBundlingSummary } from "./knit-bundling-summary";
import { KnitInventryCreation } from "./knit-inventry-creation";
import { AlertMessages } from "packages/ui/src/components/common";


interface Iprops {
    processingSerial: number;
}

export const KnitBundlePoPage = (props: Iprops) => {
    const KosService = new KnitOrderService()
    const knitReportingService = new KnittingReportingService()
    const [productCodeData, setProductCodeData] = useState<StyleProductCodeFgColor[]>();
    const user = useAppSelector((state) => state.user.user.user);
    const [activeProduct, setActiveProduct] = useState<StyleProductCodeFgColor>(undefined);
    const [activeTabKey, setActiveTabKey] = useState<string>(undefined);
    const [bundleSummary, setBundleSummary] = useState<KMS_R_KnitBundlingProductColorBundlingSummaryModel>()
    useEffect(() => {
        getStyleProductCodeFgColorForPo();
    }, []);

    useEffect(() => {
        if (activeProduct) {
            getKnitOrderBundlingSummaryForProductCodeAndColor()
        }
    }, [activeProduct])

    const getStyleProductCodeFgColorForPo = () => {
        try {
            const req = new ProcessingOrderSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [props.processingSerial], ProcessTypeEnum.KNIT);
            KosService.getStyleProductCodeFgColorForPo(req).then(res => {
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

    const getKnitOrderBundlingSummaryForProductCodeAndColor = () => {
        try {
            if (!activeProduct) {
                return
            }
            const req = new KMS_R_KnitBundlingProductColorBundlingSummaryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.processingSerial, activeProduct?.productCode, activeProduct?.fgColor, true, false, false)
            knitReportingService.getKnitOrderBundlingSummaryForProductCodeAndColor(req).then(res => {
                if (res.status) {
                    setBundleSummary(res.data)
                } else {
                    setBundleSummary(undefined)
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
        } catch (err) {
            setBundleSummary(undefined)
            AlertMessages.getErrorMessage(err.message);
        }
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
            <Tag color="#257d82">Order Qty</Tag>
            <Tag color="#da8d00">Bundle Qty</Tag>
            <Tag color="#ff0000">Pending Qty</Tag>
        </Space>
    }
    return (
        <Card>
            <Tabs size='small' className='knit-job-ratio-tabs' items={renderProductTabItems()} defaultActiveKey={activeTabKey} onChange={(key) => onTabChange(key)} tabBarExtraContent={renderKnitgroupsTabextra()} />
            <KnitBundlingSummary bundlingSummary={bundleSummary} processingSerial={props.processingSerial} productCode={activeProduct?.productCode}
                fgColor={activeProduct?.fgColor}
                refreshComponent={getKnitOrderBundlingSummaryForProductCodeAndColor} />
        </Card>
    );
}