import { PoSerialRequest, MoCustomerInfoHelperModel } from "@xpparel/shared-models";
import { Breadcrumb, Col, Collapse, Descriptions, Row, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { OrderManipulationServices, SewingJobPlanningService, SewingOrderCreationService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { EyeInvisibleOutlined } from "@ant-design/icons";
interface IPOHeaderProps {
    poSerial: number;
}
const SewPoHeaderView = (props: IPOHeaderProps) => {

    useEffect(() => {
        if (props.poSerial) {
            getPoHeaderInfo(props.poSerial);
        }
    }, [props.poSerial]);

    const sewOrderCreationService = new SewingOrderCreationService();
    const user = useAppSelector((state) => state.user.user.user);
    const [poHeaderInfo, setPoHeaderInfo] = useState<MoCustomerInfoHelperModel[]>([]);

    const getPoHeaderInfo = (poSerial: number) => {
        const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, undefined, true, false);
        sewOrderCreationService.getMoCustomerPoInfoForSewSerial(req).then((res) => {
            if (res.status) {
                setPoHeaderInfo(res.data);
            } else {

                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch((err) => {

            AlertMessages.getErrorMessage(err.message);
        });

    }
    const renderItems = (poHeaderData: MoCustomerInfoHelperModel[]) => {
        let style = '';
        let moNum = '';
        let cutOrderDes = '';
        let customerNames = '';
        let buyerPo = '';
        let garmentPo = '';
        const moLines = new Set<string>();
        const productNames = new Set<string>();
        const productTypes = new Set<string>();
        poHeaderData.forEach(poObj => {
            const { plantStyle, moNo, moLine, cutOrderDesc, customerName, productName, productType, gmtVendorPo } = poObj;
            style = plantStyle;
            moNum = moNo;
            cutOrderDes = cutOrderDesc;
            customerNames = customerName;
            buyerPo = gmtVendorPo;
            garmentPo = gmtVendorPo;
            customerNames = customerName;
            moLines.add(moLine);
            productNames.add(productName);
            productTypes.add(productType);
        });
        return {
            key: '1', label: <Row><Col span={24}><Space wrap><span className="f-600"><Tag color="#f50">Manufacturing Order No : {moNum}</Tag></span>
                <span className="f-600"><Tag color="#0d9ab1">Style : {style}</Tag></span>
                <span className="f-600"><Tag color="#f50">Routing Order Desc: {cutOrderDes}</Tag></span>
                <span className="f-600"><Tag color="#f50">Buyer PO: {buyerPo}</Tag></span>
                {/* <span className="f-600"><Tag color="#f50">Garment PO: {garmentPo}</Tag></span> */}
                <span className="f-600"><Tag color="#0d9ab1">Product Types : {[...productTypes].join()}</Tag></span>
                {/* <span className="f-600"><Tag color="#f50">Customer Name : {customerNames}</Tag></span> */}
            </Space></Col></Row>,
            children:
                <Descriptions style={{ fontWeight: 600 }} size="small">
                    <Descriptions.Item label="Manufacturing Order No">{moNum}</Descriptions.Item>
                    <Descriptions.Item label="Manufacturing Order Line No">{[...moLines].join()}</Descriptions.Item>
                    <Descriptions.Item label="Routing Order Desc">{cutOrderDes}</Descriptions.Item>
                    <Descriptions.Item label="Style">{style}</Descriptions.Item>
                    <Descriptions.Item label="Customer Name">{customerNames}</Descriptions.Item>
                    <Descriptions.Item label="Product Types">{[...productTypes].join()}</Descriptions.Item>
                    <Descriptions.Item label="Buyer PO">{buyerPo}</Descriptions.Item>
                    {/* <Descriptions.Item label="Garment PO">{garmentPo}</Descriptions.Item> */}

                </Descriptions>
        }
    }
    const renderItemsForBreadcrumb = (poHeaderData: MoCustomerInfoHelperModel[]) => {
        let style = '';
        let moNum = '';
        let cutOrderDes = '';
        let customerNames = '';
        let buyerPo = '';
        let garmentPo = '';
        const moLines = new Set<string>();
        const productNames = new Set<string>();
        const productTypes = new Set<string>();
        poHeaderData.forEach(poObj => {
            const { styleCode, moNo, moLine, cutOrderDesc, customerName, productName, productType, buyerPoNumber, gmtVendorPo } = poObj;
            style = styleCode;
            moNum = moNo;
            cutOrderDes = cutOrderDesc;
            customerNames = customerName;
            buyerPo = buyerPoNumber;
            garmentPo = gmtVendorPo;
            moLines.add(moLine);
            productNames.add(productName);
            productTypes.add(productType);
        });
        return [
            {
                title: `Manufacturing Order No : ${moNum}`,
            },
            {
                title: `Manufacturing Order Line No : ${[...moLines].join()}`,
            },
            {
                title: `Knit Order Desc : ${cutOrderDes}`,
            },
            {
                title: `Style : ${style}`,
            },
            {
                title: `Customer Name : ${customerNames}`,
            },
            {
                title: `Product Types : ${[...productTypes].join()}`,
            },
            {
                title: `Buyer PO : ${buyerPo}`,
            },
            {
                title: `Garment Po: ${garmentPo}`,
            },
        ]
    }
    return (<>
        <Collapse
            style={{ margin: '10px 0' }}
            size="small"
            className="header-collapse"
            items={[renderItems(poHeaderInfo)]}
        />
        {/* <Breadcrumb
            items={renderItemsForBreadcrumb(poHeaderInfo)}
        /> */}
    </>)

}
export default SewPoHeaderView;