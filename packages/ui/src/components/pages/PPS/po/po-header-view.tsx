import { PoSerialRequest, SoCustomerInfoHelperModel } from "@xpparel/shared-models";
import { Breadcrumb, Col, Collapse, Descriptions, Row, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { OrderManipulationServices } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
interface IPOHeaderProps {
    poSerial: number;
}
const PoHeaderView = (props: IPOHeaderProps) => {

    useEffect(() => {
        if (props.poSerial) {
            getPoHeaderInfo(props.poSerial);
        }
    }, [props.poSerial]);

    const omsManipulationService = new OrderManipulationServices();
    const user = useAppSelector((state) => state.user.user.user);
    const [poHeaderInfo, setPoHeaderInfo] = useState<SoCustomerInfoHelperModel[]>([]);

    const getPoHeaderInfo = (poSerial: number) => {
        const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, undefined, true, false);
        // omsManipulationService.getSoCustomerPoInfoForPoSerial(req).then((res) => {
        //     if (res.status) {
        //         setPoHeaderInfo(res.data);
        //     } else {

        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // }).catch((err) => {

        //     AlertMessages.getErrorMessage(err.message);
        // });

    }
    const renderItems = (poHeaderData: SoCustomerInfoHelperModel[]) => {
        let style = '';
        let soNum = '';
        let cutOrderDes = '';
        let customerNames = '';
        let buyerPo = '';
        let garmentPo = '';
        const soLines = new Set<string>();
        const productNames = new Set<string>();
        const productTypes = new Set<string>();
        poHeaderData.forEach(poObj => {
            const { styleCode, soNo, soLine, cutOrderDesc, customerName, productName, productType, buyerPoNumber , gmtVendorPo } = poObj;
            style = styleCode;
            soNum = soNo;
            cutOrderDes = cutOrderDesc;
            customerNames = customerName;
            buyerPo = buyerPoNumber;
            garmentPo = gmtVendorPo;
            customerNames = customerName;
            soLines.add(soLine);
            productNames.add(productName);
            productTypes.add(productType);
        });
        return {
            key: '1', label: <Row><Col span={24}><Space wrap><span className="f-600"><Tag color="#f50">Sale Order No : {soNum}</Tag></span>
                <span className="f-600"><Tag color="#0d9ab1">Style : {style}</Tag></span>
                <span className="f-600"><Tag color="#f50">Cut Order Desc: {cutOrderDes}</Tag></span>
                <span className="f-600"><Tag color="#f50">Buyer PO: {buyerPo}</Tag></span>
                <span className="f-600"><Tag color="#f50">Garment PO: {garmentPo}</Tag></span>
                <span className="f-600"><Tag color="#0d9ab1">Product Types : {[...productTypes].join()}</Tag></span>
                {/* <span className="f-600"><Tag color="#f50">Customer Name : {customerNames}</Tag></span> */}
            </Space></Col></Row>, children:
                <Descriptions style={{ fontWeight: 600 }} size="small">
                    <Descriptions.Item label="Sale Order No">{soNum}</Descriptions.Item>
                    <Descriptions.Item label="Sale Order Line No">{[...soLines].join()}</Descriptions.Item>
                    <Descriptions.Item label="Cut Order Desc">{cutOrderDes}</Descriptions.Item>
                    <Descriptions.Item label="Style">{style}</Descriptions.Item>
                    <Descriptions.Item label="Customer Name">{customerNames}</Descriptions.Item>
                    <Descriptions.Item label="Product Types">{[...productTypes].join()}</Descriptions.Item>
                    <Descriptions.Item label="Buyer PO">{buyerPo}</Descriptions.Item>
                    <Descriptions.Item label="Garment PO">{garmentPo}</Descriptions.Item>

                </Descriptions>
        }
    }
    const renderItemsForBreadcrumb = (poHeaderData: SoCustomerInfoHelperModel[]) => {
        let style = '';
        let soNum = '';
        let cutOrderDes = '';
        let customerNames = '';
        let buyerPo = '';
        let garmentPo = '';
        const soLines = new Set<string>();
        const productNames = new Set<string>();
        const productTypes = new Set<string>();
        poHeaderData.forEach(poObj => {
            const { styleCode, soNo, soLine, cutOrderDesc, customerName, productName, productType, buyerPoNumber , gmtVendorPo  } = poObj;
            style = styleCode;
            soNum = soNo;
            cutOrderDes = cutOrderDesc;
            customerNames = customerName;
            buyerPo = buyerPoNumber;
            garmentPo = gmtVendorPo;
            soLines.add(soLine);
            productNames.add(productName);
            productTypes.add(productType);
        });
        return [
            {
                title: `Sale Order No : ${soNum}`,
            },
            {
                title: `Sale Order Line No : ${[...soLines].join()}`,
            },
            {
                title: `Cut Order Desc : ${cutOrderDes}`,
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
export default PoHeaderView;