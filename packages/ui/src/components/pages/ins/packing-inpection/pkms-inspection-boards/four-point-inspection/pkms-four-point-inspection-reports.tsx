import { InsInspectionFinalInSpectionStatusEnum, InsInspectionHeaderAttributes, InsPKMSInsCartonsResModel, PKMSInsCartonsDto, PKMSInsReqIdDto, PackFabricInspectionRequestCategoryEnum, PackFinalInspectionStatusEnum } from "@xpparel/shared-models"
import { FgInspectionInfoService, InspectionPreferenceService, configVariables } from "@xpparel/shared-services"
import { Card, Descriptions, Tag } from "antd"
import { useAppSelector } from "packages/ui/src/common"
import { ImagesFilesAccepts } from "packages/ui/src/components/common"
import { ScxCard } from "packages/ui/src/schemax-component-lib"
import { useEffect, useState } from "react"

interface IProps {
    irId: number,
    inspectionType: PackFabricInspectionRequestCategoryEnum,
}


export const PKMSFourPointInspectionReports = (props: IProps) => {
    console.log('inside the PKMSFourPointInspectionReports')
    const { irId } = props
    const user = useAppSelector((state) => state.user.user.user);
    const unitCode = user?.orgData?.unitCode;
    const companyCode = user?.orgData?.companyCode;
    const userId = user?.userId;
    const userName = user?.userName;
    const inspectionPreferenceService = new InspectionPreferenceService()
    const fgInspectionInfoService = new FgInspectionInfoService();
    const [insCartons, setInsCartons] = useState<InsPKMSInsCartonsResModel[]>()
    const configVariable = configVariables.APP_IMS_SERVICE_URL;

    useEffect(() => {
        getPKMSInsCartonsData()
    }, [irId])

    const getPKMSInsCartonsData = () => {
        const req = new PKMSInsReqIdDto(userName, unitCode, companyCode, userId, irId);
        fgInspectionInfoService.getPKMSInsCartonsData(req).then(res => {
            if (res.status) {
                setInsCartons(res.data)
            } else {
                setInsCartons([])
            }
        }).catch(err => console.log(err.message))
    }





    return (
        <>
            <ScxCard>
                <div >
                    <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 600 }}>{props.inspectionType === PackFabricInspectionRequestCategoryEnum.PRE_INSPECTION
                        ? "PRE INSPECTION"
                        : "POST INSPECTION"}</h1>
                    <Descriptions bordered >
                        {insCartons?.[0].attributes.map((data, index) => (
                            <Descriptions.Item key={index} label={<b>{data.attributeName}</b>}>
                                {data.attributeValue}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </div>
            </ScxCard>

            <br />


            <div>
                {insCartons?.map((data, index) => {
                    let target = ''
                    if (data?.files?.fileName) {
                        const extension = data?.files?.fileName.split('.').pop().toLowerCase();
                        if (ImagesFilesAccepts.includes(extension)) {
                            target = 'blank'
                        }
                    }
                    return <div key={index}>
                        <ScxCard
                            title={data?.ctnNo}
                            extra={<>
                                <Tag
                                    color={data.inspectionResult === InsInspectionFinalInSpectionStatusEnum.FAIL ?
                                        "error" :
                                        data.inspectionResult === InsInspectionFinalInSpectionStatusEnum.PASS ? 'success' : 'warning'
                                    }
                                >{data.inspectionResult}</Tag>
                            </>}
                        >
                            <Descriptions bordered>
                                <Descriptions.Item label={<b>Carton No</b>}>{data.ctnNo}</Descriptions.Item>
                                <Descriptions.Item label={<b>Carton Qty</b>}> {data.attributes.find(attr => attr.attributeName === InsInspectionHeaderAttributes.QUANTITY)?.attributeValue}</Descriptions.Item>
                                <Descriptions.Item label={<b>Document</b>}>{
                                    <a target={target} href={configVariable + '/' + data?.files?.fileName}>{data?.files?.fileName}</a>
                                }</Descriptions.Item>
                                <Descriptions.Item label={<b>exFactory</b>}>{data.attributes.find(attr => attr.attributeName === InsInspectionHeaderAttributes.DELIVARYDATE)?.attributeValue}</Descriptions.Item>
                                <Descriptions.Item label={<b>Po Number</b>}>{data.packOrderId}</Descriptions.Item>
                                <Descriptions.Item label={<b>Destination</b>}>{data.attributes.find(attr => attr.attributeName === InsInspectionHeaderAttributes.DESTINATION)?.attributeValue}</Descriptions.Item>
                                <Descriptions.Item label={<b>Style</b>}>{data.attributes.find(attr => attr.attributeName === InsInspectionHeaderAttributes.STYLE_NO)?.attributeValue}</Descriptions.Item>
                                <Descriptions.Item label={<b>Pack List Number</b>}>{data.packListNo}</Descriptions.Item>
                                <Descriptions.Item label={<b>Pack Job Number</b>}>{data.packJobNumber}</Descriptions.Item>
                                {/* <Descriptions.Item label={<b>Buyer Address</b>}>{data.buyerAddress}</Descriptions.Item> */}
                                <Descriptions.Item label={<b>Gross Weight</b>}>{data.insGrossWeight}</Descriptions.Item>
                                <Descriptions.Item label={<b>Net Weight</b>}>{data.insNetWeight}</Descriptions.Item>
                                <Descriptions.Item label={<b>Color</b>}>
                                    {data.attributes.find(attr => attr.attributeName === InsInspectionHeaderAttributes.COLOR)?.attributeValue}
                                </Descriptions.Item>
                                <Descriptions.Item label={<b>Size And Ratio</b>}>
                                    {data.attributes.find(attr => attr.attributeName === InsInspectionHeaderAttributes.SIZE)?.attributeValue}
                                    {/* {data.sizeRatio?.map((rec) => <Tag>{rec.size + "-" + rec.ratio}</Tag>)} */}
                                </Descriptions.Item>
                            </Descriptions>
                        </ScxCard>
                        <br />


                    </div>
                })}
            </div>
        </>
    )
}


