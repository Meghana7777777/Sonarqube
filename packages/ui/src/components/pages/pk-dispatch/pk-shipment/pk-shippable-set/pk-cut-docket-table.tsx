import { UpCircleFilled, DownCircleFilled } from '@ant-design/icons';
import { PKMSPackListIdsRequest, PKMSPackListInfoModel, PKMSPackingDispatchCartonInfoModel, PKMSPackingDispatchPackJobsInfoModel, PKMSPackingDispatchPackListInfoModel, PackListIdRequest } from '@xpparel/shared-models';
import { PackListService, PkDispatchSetService } from '@xpparel/shared-services';
import { Checkbox, Descriptions, Table, Tag } from 'antd';
import { SequenceUtils, useAppSelector } from 'packages/ui/src/common';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import PackingDispatchCartonsSelection from './pk-dispatch-cartons-seletion';
import moment from 'moment';
import { ColumnType } from 'antd/es/table';




interface CutViewChildProps {
  childData: PKMSPackListInfoModel; // Accepting childData as a prop;
  selectedGroupValues: (cartons: PKMSPackingDispatchCartonInfoModel[], index: number, packJobId: number, packListId: number, packOrderId: number) => void
  packListId: number;
  packOrderId: number;
  packListLevelCartonsSelection: Map<number, Map<number, Map<number, Map<number, number[]>>>>;
  setPackListLevelCartonsSelection: React.Dispatch<React.SetStateAction<Map<number, Map<number, Map<number, Map<number, number[]>>>>>>
  packListLevelChecked: Map<number, Map<number, boolean>>;
  setPackListLevelChecked: Dispatch<SetStateAction<Map<number, Map<number, boolean>>>>;
  expandedIndex: any[];
  setExpandedIndex: Dispatch<SetStateAction<any[]>>;
  summaryPreview: (expand: boolean, record: PKMSPackingDispatchPackJobsInfoModel) => void
  packJobHeaderCheckBoxOnChange: (selectedRows: PKMSPackingDispatchPackJobsInfoModel, checked: boolean, packListId: number, packOrderId: number) => void
  selectedCutOrders: PKMSPackListInfoModel[];
  setPackListDataFromDocketTable: Dispatch<SetStateAction<Map<number, PKMSPackingDispatchPackListInfoModel>>>;
  packListDataFromDocketTable: Map<number, PKMSPackingDispatchPackListInfoModel>;
  setCartonsDataFromDocketTable: Dispatch<SetStateAction<Map<number, number[]>>>;
  cartonsDataFromDocketTable: Map<number, number[]>
}



const PkCutDocketTable: React.FC<CutViewChildProps> = ({
  childData,
  selectedGroupValues,
  packListId,
  packOrderId,
  packListLevelCartonsSelection,
  setPackListLevelCartonsSelection,
  packListLevelChecked,
  setPackListLevelChecked,
  expandedIndex,
  setExpandedIndex,
  summaryPreview,
  packJobHeaderCheckBoxOnChange,
  selectedCutOrders,
  setPackListDataFromDocketTable,
  packListDataFromDocketTable,
  setCartonsDataFromDocketTable,
  cartonsDataFromDocketTable
}) => {


  const packListService = new PackListService()
  const data = childData?.packListAttrs;
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  // const [packingDispatchInfoData, setPackingDispatchInfoData] = useState<PKMSPackingDispatchPackListInfoModel[]>([])
  const pkDispatchSetService = new PkDispatchSetService();


  useEffect(() => {
    getPackingDispatchInfoByPackListId();
    getSubItemsListForDSetRefId()
  }, [childData?.packListId]);



  const getSubItemsListForDSetRefId = () => {
    const reqModel = new PackListIdRequest(userName, orgData?.unitCode, orgData?.companyCode, userId, packListId)
    pkDispatchSetService.getSubItemsListForDSetRefId(reqModel).then(res => {
      if (res.status) {
        const data = res.data.map(rec => rec.refId)
        setCartonsDataFromDocketTable((prev) => {
          const previous = new Map(prev);
          previous.set(packListId, data);
          return previous
        })
      } else {
        cartonsDataFromDocketTable.delete(packListId)
      }
    }).catch(err => console.log(err.message))
  }


  const getPackingDispatchInfoByPackListId = () => {
    const req = new PKMSPackListIdsRequest(userName, orgData?.unitCode, orgData?.companyCode, userId, [childData?.packListId], false, true, true, true, false)
    packListService.getPackingDispatchInfoByPackListId(req).then(res => {
      if (res.status) {
        const findPrevious = selectedCutOrders.find((rec) => rec.packListId === res.data[0].packListId)
        if (findPrevious) {
          res.data[0].packJobs.forEach((pj) => {
            pj.cartonsList.forEach((ct, index) => {
              selectedGroupValues([ct], 0, pj.packJobId, res.data[0].packListId, Number(pj.packOrderId));
            })
          })
        };
        setPackListDataFromDocketTable((prev) => {
          const previous = new Map(prev);
          previous.set(childData?.packListId, res.data[0])
          return previous
        })
      }
    }).catch(err => console.log(err.message));
  };



  const pjCartonsIncludesOrNot = (cartons: PKMSPackingDispatchCartonInfoModel[]) => {
    // console.log(cartons, '?/////////',childData?.packListId)
    const setIsExistOrNot = new Set<boolean>()
    cartons.map((rec) => {
      setIsExistOrNot.add(cartonsDataFromDocketTable?.get(childData?.packListId)?.includes(rec.cartonId))
    })
    return !setIsExistOrNot.has(false)
  }


  const columns: ColumnType<any>[] = [
    {
      title: "Pack Job Level Selection",
      dataIndex: "packJobId",
      align: 'center',
      render: (v, r: PKMSPackingDispatchPackJobsInfoModel, i) => {
        return <>
          <Checkbox
            disabled={pjCartonsIncludesOrNot(r.cartonsList)}
            // value={r.cartonsList.values()}
            checked={packListLevelCartonsSelection?.get(r.packOrderId)?.get(r.packListId)?.has(v)}
            onChange={(e) => {
              packJobHeaderCheckBoxOnChange(r, e.target.checked, r.packListId, r.packOrderId)
            }}
          >

          </Checkbox>
        </>

      }
    },
    {
      title: "Pack Job No",
      dataIndex: "packJobNo",
      align: 'center'
    },
    {
      title: "Destinations",
      dataIndex: "attrs",
      align: 'center',
      render: (v) => v.destinations
    },
    {
      title: "Product Names",
      dataIndex: "attrs",
      align: 'center',
      render: (v) => v.prodNames
    },

  ];



  const summaryTable = (record: PKMSPackingDispatchPackJobsInfoModel) => {
    return <PackingDispatchCartonsSelection
      setCartonsDataFromDocketTable={setCartonsDataFromDocketTable}
      cartons={record.cartonsList}
      packJobId={record.packJobId}
      packListLevelCartonsSelection={packListLevelCartonsSelection}
      setPackListLevelCartonsSelection={setPackListLevelCartonsSelection}
      selectedGroupValues={selectedGroupValues}
      packListId={packListId}
      packOrderId={packOrderId}
      cartonsDataFromDocketTable={cartonsDataFromDocketTable}
    />;
  };





  return (
    <>
      {/* <ScxCard size='small'> */}

      <Descriptions size='small' bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}>

        <Descriptions.Item label={<b>{'VPO Number'}</b>} className=''><span style={{ color: "black" }}>{data.vpos}</span></Descriptions.Item>

        {/* <Descriptions.Item label={<b>{'CO Number'}</b>} className=''><span style={{ color: "black" }}>{''}</span></Descriptions.Item> */}
        <Descriptions.Item label={<b>{'Buyer Names'}</b>} className=''><span style={{ color: "black" }}>{data.buyers?.join(', ')}</span></Descriptions.Item>
        <Descriptions.Item label={<b>{'Product Names'}</b>} className=''><span style={{ color: "black" }}>{data.prodNames?.join(', ')}</span></Descriptions.Item>
        <Descriptions.Item label={<b>{'Destination'}</b>} className=''><span style={{ color: "black" }}>{data.destinations?.join(', ')}</span></Descriptions.Item>
        <Descriptions.Item label={<b>{'Delivery date'}</b>} className=''><span style={{ color: "black" }}>{data?.delDates?.length ? SequenceUtils.deliveryDatesMethod(data.delDates[0]) : ''}</span></Descriptions.Item>
        <Descriptions.Item label={<b>{'Packing List Description'}</b>} className=''><span style={{ color: "black" }}>{childData.packListDesc}</span></Descriptions.Item>
        <Descriptions.Item label={<b>{'Style'}</b>} className=''><span style={{ color: "black" }}><span color="black">{data.styles?.join(', ')}</span></span></Descriptions.Item>
        <Descriptions.Item label={''}>{''}</Descriptions.Item>
        <Descriptions.Item label={<b>{'No of cartons'}</b>}><Tag color="green">{childData.totalCartons}</Tag></Descriptions.Item>
        <Descriptions.Item label={<b>{'No of Ready cartons'}</b>}><Tag color="green">{childData.totalCartons}</Tag></Descriptions.Item>
        {/* <Descriptions.Item label={<b>{'Total GMT quantity'}</b>} className=''><span style={{ color: "black" }}><Tag color="green">{childData[0].totalCartons}</Tag></span></Descriptions.Item> */}
      </Descriptions>
      <Table
        style={{ minWidth: '100%' }}
        rowKey={record => record?.packJobId}
        columns={columns}
        size='small'
        dataSource={packListDataFromDocketTable.get(childData?.packListId)?.packJobs}
        bordered={true}
        pagination={false}
        scroll={{x: 'max-content'}}
        expandable={{
          expandedRowRender: summaryTable,
          // columnTitle: <Checkbox
          //   onChange={(e) => {
          //     const newExpandedKeys = new Set(expandedIndex);
          //     const newCheckedState = new Map(packListLevelChecked);
          //     packingDispatchInfoData?.[0]?.packJobs.forEach((rec) => {
          //       if (!newCheckedState.has(rec.packListId)) {
          //         newCheckedState.set(rec.packListId, new Map());
          //       }
          //       newCheckedState.get(rec.packListId)?.set(rec.packJobId, e.target.checked);
          //       if (e.target.checked) {
          //         newExpandedKeys.add(rec.packJobId);
          //       } else {
          //         newExpandedKeys.delete(rec.packJobId);
          //       }
          //       packJobHeaderCheckBoxOnChange(rec, e.target.checked, rec.packListId, rec.packOrderId);
          //     });
          //     setPackListLevelChecked(newCheckedState);
          //     setExpandedIndex(Array.from(newExpandedKeys)); // Update state once
          //   }}
          // ></Checkbox>,
          expandedRowKeys: expandedIndex,
          onExpand: summaryPreview,
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <UpCircleFilled onClick={(e) => onExpand(record, e)} />
            ) : (
              <DownCircleFilled onClick={(e) => onExpand(record, e)} />
            ),
        }}

      >

      </Table>


      {/* </ScxCard> */}
    </>
  );
};

export default PkCutDocketTable;
