import { ReloadOutlined } from "@ant-design/icons";
import { CartonBasicInfoUIModel, ContainerCartonsUIModel, FGContainerGroupTypeEnum, PackListIdRequest, PgCartonsModel } from "@xpparel/shared-models";
import { Button, Card, Descriptions, Divider, Drawer, Empty, Modal, Select, Space, Table, Tag } from "antd";
import ContainerCartonNameBox from "./container-carton-name";
import { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { AlertMessages } from "../../../common";
import { FGLocationAllocationService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
interface IContainerGroupSuggestionsProps {
  packListId: number
}
export const ContainerGroupSuggestions = (props: IContainerGroupSuggestionsProps) => {
  const { packListId } = props;
  const user = useAppSelector((state) => state.user.user.user);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [selectedContainerInfo, setSelectedContainerInfo] = useState<ContainerCartonsUIModel>();
  const [selectedContainerId, setSelectedContainerId] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setOpen] = useState(false);
  const [changedContainerId, setChangedContainerId] = useState<string>('');
  const [containersHead, setContainerHead] = useState<PgCartonsModel[]>([]);

  const locationService = new FGLocationAllocationService();
  useEffect(() => {
    if (packListId) {
      getContainersForPackingContainers(packListId);
    }
  }, [reloadKey])

  const getContainersForPackingContainers = (phId: number) => {
    const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId);
    locationService.getPgIdsForPackListId(phIdReq).then((res => {
      if (res.status) {
        setContainerHead(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
        setContainerHead([]);
      }
    })).catch(error => {
      setContainerHead([]);
      AlertMessages.getErrorMessage(error.message)
    })
  }


  const clsoeModel = () => {
    setModalOpen(false);
    setSelectedContainerId(0);
  }
  const selectContainer = (containerInfo: ContainerCartonsUIModel) => {
    setSelectedContainerId(containerInfo?.containerId);
    setSelectedContainerInfo(containerInfo);
    setModalOpen(true)
  }
  const renderTitle = (containerInfoParam: ContainerCartonsUIModel) => {
    let containerGroup = containerInfoParam.pgName;
    let noOfcartons = containerInfoParam.cartonsInfo.length;
    return <Descriptions bordered size={'small'} title={<Space size='middle'><>Container Group : {containerGroup} </>No Of Cartons : {noOfcartons} </Space>}
    // extra={<Button type="primary">Print</Button>}
    >
      {/* <Descriptions.Item label="Container Code">{containerCode}</Descriptions.Item>
        <Descriptions.Item label="No Of Cartons">{noOfcartons}</Descriptions.Item> */}
    </Descriptions>
  }
  const getCssFromComponent = (fromDoc, toDoc) => {
    Array.from(fromDoc.styleSheets).forEach((styleSheet: any) => {
      if (styleSheet.cssRules) { // true for inline styles
        const newStyleElement = toDoc.createElement('style');
        Array.from(styleSheet.cssRules).forEach((cssRule: any) => {
          newStyleElement.appendChild(toDoc.createTextNode(cssRule.cssText));
        });
        toDoc.head.appendChild(newStyleElement);
      }
    });
  }
  const getContainersCount = (pgs: PgCartonsModel[], type: FGContainerGroupTypeEnum) => {
    let count = 0;
    pgs.forEach(container => {
      if (container.pgType == type) {
        count++;
      }
    });
    return count;
  }
  const print = () => {
    const printAreaElement = document.getElementById('printArea') as HTMLElement | null;
    const divContents = printAreaElement?.innerHTML ?? '';
    const element = window.open('', '', 'height=700, width=1024');
    element?.document.write(divContents);
    getCssFromComponent(document, element?.document);
    element?.document.close();
    // Loading image lazy
    setTimeout(() => {
      element?.print();
      element?.close()
    }, 1000);
    // clsoeModel();
  }
  const closeDrawer = () => {
    setOpen(false);
  };
  const showLargeDrawer = (containerId: number) => {
    setSelectedContainerId(containerId);
    setOpen(true);
  };
  const changeContainerName = (containerId: string) => {
    setChangedContainerId(containerId);
  }
  // const columns: ColumnsType<CartonBasicInfoUIModel> = [

  //   {
  //     title: 'Carton No',
  //     dataIndex: 'externalCartonNumber',
  //   },
  //   {
  //     title: 'Carton Barcode ',
  //     dataIndex: 'barcode',
  //   },
  //   {
  //     title: 'Carton Type',
  //     dataIndex: 'objectType',
  //     key: 'objectType',
  //   },
  //   {
  //     title: 'Lot No',
  //     dataIndex: 'lotNo',
  //   },
  //   {
  //     title: 'Batch No',
  //     dataIndex: 'batchNo',
  //   },
  //   // {
  //   //     title: 'Type',
  //   //     dataIndex: 'objectType',
  //   // },
  //   {
  //     title: 'Length (Meters)',
  //     dataIndex: 'supplierQuantity',
  //     key: 'supplierLength',
  //   },
  //   {
  //     title: 'PL Length',
  //     dataIndex: 'inputLength',
  //     key: 'inputLength',
  //     render: (text, record) => { return text + '(' + record.width + ')' }
  //   },
  //   {
  //     title: 'Width (CM)',
  //     dataIndex: 'supplierWidth',
  //     key: 'supplierWidth',
  //   },
  //   {
  //     title: 'PL Width',
  //     dataIndex: 'inputWidth',
  //     key: 'inputWidth',
  //     render: (text, record) => { return text + '(' + record.width + ')' }
  //   },
  //   {
  //     title: 'Shade',
  //     dataIndex: 'shade',
  //     key: 'shade',
  //   }
  //   // {
  //   //     title: 'Shrinkage Width',
  //   //     dataIndex: 'skWidth',
  //   // },
  //   // {
  //   //     title: 'Shrinkage Length',
  //   //     dataIndex: 'skLength',
  //   // },
  //   // {
  //   //     title: 'Shrinkage Group',
  //   //     dataIndex: 'skGroup',
  //   // },
  //   // {
  //   //     title: 'GSM',
  //   //     dataIndex: 'gsm',
  //   // },
  //   // {
  //   //     title: 'Remarks',
  //   //     dataIndex: 'remarks',
  //   // },
  // ]


  const columns: ColumnsType<CartonBasicInfoUIModel> = [
    {
        title: 'Carton No',
        dataIndex: 'cartonNo',
    },
    {
        title: 'Barcode ',
        dataIndex: 'barcode',
    },
    {
        title: 'Qty',
        dataIndex: 'qty',
    },

    {
        title: 'Width',
        dataIndex: 'width',
    },
    {
        title: 'Length',
        dataIndex: 'length',
    },
    {
        title: 'Height',
        dataIndex: 'height',
    }
]

  const reload = () => {
    setReloadKey(preState => preState + 1)
  }
  return <Card title={`${containersHead?.[0]?.packListCode} - ${containersHead?.[0]?.packListDesc}`}>
    <Card size="small" className="card-title-bg-cyan" title="System Suggested Carton Container Allocation For Inspection"
      extra={
        <>
          <Tag color="magenta">
            Total Containers : <b>{containersHead ? getContainersCount(containersHead, FGContainerGroupTypeEnum.INSPECTION) : 0}</b>
          </Tag>
          <Button onClick={reload} icon={<ReloadOutlined />} />
        </>
      }
    >

      {containersHead.filter(container => container.pgType == FGContainerGroupTypeEnum.INSPECTION).map((containerObj, index) => {
        return <><ContainerCartonNameBox key={`ins-${index}`} selectContainer={selectContainer} selectContainerToUpdate={showLargeDrawer} phId={packListId} pgObj={containerObj} /></>
      })}
      {containersHead.filter(container => container.pgType == FGContainerGroupTypeEnum.INSPECTION).length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </Card>
    <Divider />
    <Card size="small" className="card-title-bg-cyan" title="System Suggested Carton Container Allocation For Warehouse"
      extra={
        <>
          <Tag color="magenta">
            Total Containers : <b>{containersHead ? getContainersCount(containersHead, FGContainerGroupTypeEnum.WAREHOUSE) : 0}</b>
          </Tag>
          <Button onClick={reload} icon={<ReloadOutlined />} />
        </>
      }

    >
      {containersHead.filter(container => container.pgType == FGContainerGroupTypeEnum.WAREHOUSE).map((containerObj, index) => {
        return <><ContainerCartonNameBox key={`ins-${index}`} selectContainer={selectContainer} selectContainerToUpdate={showLargeDrawer} phId={packListId} pgObj={containerObj} /></>
      })}
      {containersHead.filter(container => container.pgType == FGContainerGroupTypeEnum.WAREHOUSE).length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </Card>
    <Modal
      // title={<Button type="primary">Print</Button>}
      style={{ top: 20 }}
      width={'100%'}
      open={modalOpen}
      onOk={clsoeModel}
      onCancel={clsoeModel}
      footer={[<Button key="back" type="primary" onClick={print}>Print</Button>, <Button onClick={clsoeModel} >Close</Button>]}
    >
      <div id='printArea'>
        {selectedContainerInfo && renderTitle(selectedContainerInfo)}
        <Table columns={columns} pagination={false} scroll={{ x: true, }} bordered dataSource={selectedContainerInfo ? selectedContainerInfo.cartonsInfo : []} size="small" />
      </div>
    </Modal>
    <Drawer
      title={`Update Container for`}
      placement="right"
      size={'large'}
      onClose={closeDrawer}
      open={drawerOpen}
      // width='70%'
      extra={

        <Space>
          <Button onClick={closeDrawer}>Cancel</Button>
          <Button type="primary" onClick={closeDrawer}>
            OK
          </Button>
        </Space>
      }
    >

      <>
        {selectedContainerInfo && renderTitle(selectedContainerInfo)}
        <br />
        <Space size={'large'}>
          <Select
            showSearch
            placeholder="Select a Container"
            optionFilterProp="children"
            style={{ width: '300px' }}
            onChange={changeContainerName}
            value={`${selectedContainerId}`}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: '20',
                label: 'Container 1',
              },
              {
                value: '2',
                label: 'Container 2',
              },
              {
                value: '3',
                label: 'Container 3',
              },
            ]}
          />
          <Button type="primary" onClick={closeDrawer}>Update</Button>
        </Space>
      </>
    </Drawer>
  </Card>;
};

export default ContainerGroupSuggestions;
