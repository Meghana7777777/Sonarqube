import { PoProdTypeAndFabModel, PoSerialRequest, PoSummaryModel } from "@xpparel/shared-models";
import { PoMaterialService } from "@xpparel/shared-services";
import { Button, Card, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { FabricProprietiesTable } from "./fabric-proprieties-table";
import { RedoOutlined } from "@ant-design/icons";
interface IProps {
    poObj: PoSummaryModel;
    onStepChange: (step: number, po: PoSummaryModel) => void
}
const FabricProprietiesPage = (props: IProps) => {
    useEffect(() => {
        if (props.poObj) {
            getPoProdTypeAndFabricsAndItsSizes(props.poObj.poSerial);
        }
    }, [])
    const user = useAppSelector((state) => state.user.user.user);
    const [getFabricPro, setGetFabricPro] = useState<PoProdTypeAndFabModel[]>([]);

    const poMaterialService = new PoMaterialService();
    /**
     * Get Product type and Fabric info
     * @param poSerial 
     */
    const getPoProdTypeAndFabricsAndItsSizes = (poSerial: number) => {
        const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, Number(props.poObj?.orderRefId), undefined, undefined)
        poMaterialService.getPoProdTypeAndFabricsAndItsSizes(req).then(res => {
            if (res.status) {
                setGetFabricPro(res.data ? res.data : []);
            } else {
                setGetFabricPro([]);
            }
        }).catch(err => {
            console.log(err)
        })
        constructTblData();
    }

    /**
     * Save Fabric Proprieties
     * @param poSerial 
     */
    const updateFabricData = (poSerial: number) => {
        // do validations
    }

    const constructTblData = () => {
        constructColumns()
    }
    const constructColumns = () => {

    }
    const changeConsumption = ()=> {
        
    }
    const changeWastage = ()=> {

    }
    const changeBindingConsumption = ()=> {

    }
    const changeMainFabric = ()=> {

    }
    const changeIsBinding = ()=> {

    }
    return <>
        <Card title='Fabric Proprieties' size="small" extra={ <Tooltip title="Reload">
            <Button disabled={!props.poObj.poSerial} type='primary' 
            icon={<RedoOutlined style={{ fontSize: '20px' }} />} 
            onClick={() =>   getPoProdTypeAndFabricsAndItsSizes(props.poObj.poSerial)} /></Tooltip>}>
            <FabricProprietiesTable
                getFabricPro={getFabricPro}
                poSerial={props.poObj.poSerial}
            />
        </Card></>
}

export default FabricProprietiesPage;