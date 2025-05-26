import { PoFabricRatioModel, PoItemCodeRequest, PoSummaryModel } from "@xpparel/shared-models";
import { useEffect, useState } from "react";
import RatioSummaryTable from "./ratio-summary-grid";
import { Button, Card, Collapse, CollapseProps, Divider, Drawer, Space, Tag, Tooltip } from "antd";
import { MinusOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import FabricRatioTable from "./rmsku-ratio-grid";
import { useAppSelector } from "packages/ui/src/common";
import { PoRatioService } from "@xpparel/shared-services";
import { AlertMessages } from "packages/ui/src/components/common";
import { RatioCreation } from "../creation";

interface IProps {
    poObj: PoSummaryModel;
    onStepChange: (step: number, po: PoSummaryModel) => void
}

const RatioSummaryPage = (props: IProps) => {
    useEffect(() => {
        if (props.poObj) {
            getCumRatioQtyFabricWiseForPo(props.poObj.poSerial);
        }
    }, [])
    const user = useAppSelector((state) => state.user.user.user);
    const [ratioData, setRatioData] = useState<PoFabricRatioModel[]>([]);
    const [stateKey, setStateKey] = useState<number>(0);
    const [openRatioCreate, setOpenRatioCreate] = useState(false);



    const poRatioService = new PoRatioService();
    const getCumRatioQtyFabricWiseForPo = (poSerialNo: number) => {
        const req = new PoItemCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerialNo, undefined);
        poRatioService.getCumRatioQtyFabricWiseForPo(req).then((res => {
            if (res.status) {
                setRatioData(res.data);
                setStateKey(preState => preState + 1);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const convertSetToString = (value:Set<string>) => {
       return Array.from(value).join(', ');
    }
    const constructItems = (ratioDataP: PoFabricRatioModel[]) => {
        const componentsMap = new Map<string, Set<string>>();
        const rmSkuProductTypeMap = new Map<string, Set<string>>();
        const rmSkuProductName = new Map<string, Set<string>>();
        ratioDataP.forEach(fabricRmsku => {
            if (!componentsMap.has(fabricRmsku.iCode)) {
                componentsMap.set(fabricRmsku.iCode, new Set())
                rmSkuProductTypeMap.set(fabricRmsku.iCode, new Set())
                rmSkuProductName.set(fabricRmsku.iCode, new Set())
            }
            componentsMap.get(fabricRmsku.iCode).add(fabricRmsku.component);
            rmSkuProductTypeMap.get(fabricRmsku.iCode).add(fabricRmsku.prodcutTypes);
            rmSkuProductName.get(fabricRmsku.iCode).add(fabricRmsku.productNames);
        }
        )
        let index = 0;
        const items: CollapseProps['items'] = [];
         componentsMap.forEach((componentsSet, fabricRmskuCode) => {
            const productTypes =  convertSetToString(rmSkuProductTypeMap.get(fabricRmskuCode));
            const productNames =  convertSetToString(rmSkuProductName.get(fabricRmskuCode));
            const components =  convertSetToString(componentsSet);
            items.push({
                key: index,
                label: <Space align="baseline"> <span>RMSKU : <Tag color="black">{fabricRmskuCode}</Tag></span> | <span>Product Names: <Tag color="black">{productNames}</Tag></span>| <span>Product Types: <Tag color="black">{productTypes}</Tag></span>| <span>Components: <Tag color="black">{components}</Tag></span></Space>,
                children: <FabricRatioTable poSerial={props.poObj.poSerial} key={stateKey + 1 + 'it' + index} itemCode={fabricRmskuCode} />
            })
            index++;
        });
        return items;
    }
    const changeCollapse = (val) => {
        
    }
    const refresh = () => {
        setOpenRatioCreate(true);
        setStateKey(preState => preState + 1);
    }
    const closeRatioCreate = () => {
        setOpenRatioCreate(false);
        setStateKey(preState => preState + 1);
        getCumRatioQtyFabricWiseForPo(props.poObj.poSerial);
    };
    return (<Card  title='Ratio Summary' size="small" extra={
    <>
     <Button  type="primary" onClick={refresh}>Create Ratio</Button>,<Tooltip title="Reload">
        <Button disabled={!props.poObj.poSerial} type='primary' 
        icon={<RedoOutlined style={{ fontSize: '20px' }} />} 
        onClick={() =>  getCumRatioQtyFabricWiseForPo(props.poObj.poSerial)} /></Tooltip>
    </>
   }>
        <RatioSummaryTable key={stateKey + 1 + 'sum'} ratioData={ratioData} />
        <Divider />
        <Collapse
            expandIconPosition='end'
            size="small"
            key={stateKey + 1 + 'r'}
            onChange={changeCollapse}
            style={{ fontWeight: '500' }}
            expandIcon={({ isActive }) => isActive ? < MinusOutlined style={{ fontSize: '20px' }} /> : <  PlusOutlined style={{ fontSize: '20px' }} />} defaultActiveKey={[]} bordered items={constructItems(ratioData)} />
        <Drawer
            title={`Ratios Creation`}
            placement="right"
            size={'large'}
            onClose={closeRatioCreate}
            open={openRatioCreate}
            width='100%'
            extra={
                <Button type="primary" onClick={closeRatioCreate}>
                    Close
                </Button>
            }
        >
            <>
                <RatioCreation po={props.poObj} closeRatioCreate={closeRatioCreate} key={stateKey} />
            </>

        </Drawer>
    </Card>)
}

export default RatioSummaryPage;