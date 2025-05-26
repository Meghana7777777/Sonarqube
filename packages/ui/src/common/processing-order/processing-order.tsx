import { FileAddOutlined, FolderOpenOutlined, SyncOutlined } from '@ant-design/icons'
import { ProcessTypeEnum, ProcessingOrderCreationInfoModel, ProcessingOrderCreationRequest, ProcessingOrderStatusEnum, ProcessingOrderViewInfoModel, RoutingGroupDetail } from '@xpparel/shared-models'
import { Form, Select, Tabs } from 'antd'
import { TabsProps } from 'antd/lib'
import ProcessingOrderCreation from './processing-order-creation'
import ProcessingOrderView from './processing-order-view'
import { useState } from 'react'



interface IProcessingOrderProps {
  styleCode: string
  moInfo: ProcessingOrderCreationInfoModel[] // pass mo info of the selected style code and mo number along with balance qty
  openProcessingOrderInfo?: ProcessingOrderViewInfoModel[]; // pass open processing orders data
  inprogressProcessingOrderInfo?: ProcessingOrderViewInfoModel[];  // pass inprogress processing orders data
  onCreatePo: (values: ProcessingOrderCreationRequest) => void //  on Create PO button click
  setActiveTab?: (value: "create" | "open" | "inprogress") => void // sets current active tab
  onProceed?: (rec: any) => void; // on Proceed button click
  onDelete?: (rec: any) => void; // on Delete button click
  proceedText?: string // Text to display on proceed button , by default shows "Proceed"
  routingGroups?: RoutingGroupDetail[];
  updateKey: number;
  activeTab: string;
  setActiveRoutingGroupP?: (value: ProcessTypeEnum) => void
}
export default function ProcessingOrder(props: IProcessingOrderProps) {
  const { onCreatePo, moInfo, styleCode, setActiveTab, openProcessingOrderInfo, inprogressProcessingOrderInfo,activeTab, onProceed, onDelete, proceedText, routingGroups, updateKey ,setActiveRoutingGroupP} = props
  const distinctRoutingGroups = mapRoutingGroupsToProcessTypes(routingGroups)
  const [activeRoutingGroupTab,setActiveRoutingGroupTab] = useState<string>(distinctRoutingGroups[0])

  function mapRoutingGroupsToProcessTypes(routingGroups: RoutingGroupDetail[]): Map<string, ProcessTypeEnum[]> {
    const routingGroupMap = new Map<string, ProcessTypeEnum[]>();

    routingGroups?.forEach((group) => {
      if (!routingGroupMap.has(group.routingGroup)) {
        routingGroupMap.set(group.routingGroup, []);
      }
      routingGroupMap.get(group.routingGroup)?.push(group.procType);
    });

    return routingGroupMap;
  }

  function onTabChange(key: "create" | "open" | "inprogress") {
    setActiveTab(key)
  }

  function onRoutingGroupTabChange(key:ProcessTypeEnum){
    setActiveRoutingGroupTab(key)
    setActiveRoutingGroupP(key)
  }


  function renderRoutingGroupsTabs(updateKeyP:number, activeTabParam: string): TabsProps['items'] {
    return Array.from(distinctRoutingGroups).map(([routingGroup, processTypes]) => {
        return {
            label: `${routingGroup} (${processTypes.join(', ')})`, 
            key: processTypes[0],
            children: renderPOTabs(processTypes, updateKeyP,routingGroup, activeTabParam),
        };
    });
}

  function renderPOTabs(processType: ProcessTypeEnum[], updateKeyP:number,routingGroup:string, activeTabParam: string) {
    const poComponents: TabsProps['items'] = [
      {
        key: 'create',
        label: <><FileAddOutlined />Create</>,
        children: <ProcessingOrderCreation routingGroup={routingGroup} onCreatePo={onCreatePo} updateKey={updateKeyP} processType={processType} moInfo={moInfo} styleCode={styleCode} />,
      },
      {
        key: 'open',
        label: <><FolderOpenOutlined />Open</>,
        children: <ProcessingOrderView proceedText={proceedText} onProceed={onProceed} onDelete={onDelete} processingOrderInfo={openProcessingOrderInfo} processType={processType[0]} status={ProcessingOrderStatusEnum.OPEN} />
      },
      {
        key: 'inprogress',
        label: <><SyncOutlined />Inprogress</>,
        children: <ProcessingOrderView proceedText={proceedText} onProceed={onProceed} onDelete={onDelete} processingOrderInfo={inprogressProcessingOrderInfo} processType={processType[0]} status={ProcessingOrderStatusEnum.INPROGRESS} />,
      },
    ]
    return <Tabs onChange={onTabChange} centered size='small' className='po-tabs' items={poComponents} defaultActiveKey={activeTabParam} activeKey={activeTabParam} />
  }



  return (
    <>
      <Tabs onChange={onRoutingGroupTabChange} centered size='small' className='po-tabs' items={renderRoutingGroupsTabs(updateKey, activeTab)} defaultActiveKey={activeRoutingGroupTab} activeKey={activeRoutingGroupTab} />
    </>
  )
} 