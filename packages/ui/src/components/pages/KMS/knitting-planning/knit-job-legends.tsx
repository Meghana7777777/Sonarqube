import { Card, Flex, List } from "antd";
import { kjMaterialStatusEnumClassNames } from "./knit-planning.interface";
import { KJ_MaterialStatusEnum } from "@xpparel/shared-models";
const data = [
    {className: kjMaterialStatusEnumClassNames[KJ_MaterialStatusEnum.OPEN], title:"Not Requested"},
    {className: kjMaterialStatusEnumClassNames[KJ_MaterialStatusEnum.REQUESTED], title:"Requested"},
    {className: kjMaterialStatusEnumClassNames[KJ_MaterialStatusEnum.PARTIAL_ISSUED], title:"Partially Issued"},
    {className: kjMaterialStatusEnumClassNames[KJ_MaterialStatusEnum.COMPLETELY_ISSUED], title:"Issued"},
]
const KnitJobLegend = () => {


    return <>
        {/* <Flex gap={10}>
            
            <div className={`knit-legend ${kjMaterialStatusEnumClassNames[KJ_MaterialStatusEnum.REQUESTED]}`}>Requested</div>
            <div className={`knit-legend ${kjMaterialStatusEnumClassNames[KJ_MaterialStatusEnum.PARTIAL_ISSUED]}`}>Partially Issued</div>
            <div className={`knit-legend ${kjMaterialStatusEnumClassNames[KJ_MaterialStatusEnum.COMPLETELY_ISSUED]}`}>Issued</div>
        </Flex> */}
        <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    <Card bodyStyle={{padding:'3px'}} size="small"><div className={`knit-legend ${item.className}`}>{item.title}</div></Card>
                </List.Item>
            )}
        />
    </>
}

export default KnitJobLegend;