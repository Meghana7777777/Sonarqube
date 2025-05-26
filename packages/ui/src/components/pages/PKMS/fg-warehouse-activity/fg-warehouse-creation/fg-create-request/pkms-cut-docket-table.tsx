import { PKMSPackListInfoModel } from '@xpparel/shared-models';
import { Descriptions, Tag } from 'antd';
import React from 'react';


interface CutViewChildProps {
  childData: PKMSPackListInfoModel; // Accepting childData as a prop
}


const PkCutDocketTable = (props: CutViewChildProps) => {
  const { childData } = props;
  const data = childData?.packListAttrs;



  return (
    <>
      {/* <ScxCard size='small'> */}
      <Descriptions size='small' bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}>
        {/* <Descriptions.Item label={<b>{'PO Number'}</b>} className=''><span style={{ color: "black" }}>{data.vpos}</span></Descriptions.Item> */}
        {/* <Descriptions.Item label={<b>{'CO Number'}</b>} className=''><span style={{ color: "black" }}>{''}</span></Descriptions.Item> */}
        <Descriptions.Item label={<b>{'Buyer Names'}</b>} className=''><span style={{ color: "black" }}>{data.buyers?.join(', ')}</span></Descriptions.Item>
        <Descriptions.Item label={<b>{'Product Names'}</b>} className=''><span style={{ color: "black" }}>{data.prodNames?.join(', ')}</span></Descriptions.Item>
        <Descriptions.Item label={<b>{'Destination'}</b>} className=''><span style={{ color: "black" }}>{data.destinations?.join(', ')}</span></Descriptions.Item>
        <Descriptions.Item label={<b>{'Delivary date'}</b>} className=''><span style={{ color: "black" }}>{data.delDates}</span></Descriptions.Item>
        <Descriptions.Item label={<b>{'Packing List Description'}</b>} className=''><span style={{ color: "black" }}>{childData.packListDesc}</span></Descriptions.Item>
        <Descriptions.Item label={<b>{'Style'}</b>} className=''><span style={{ color: "black" }}><span color="black">{data.styles?.join(', ')}</span></span></Descriptions.Item>
        <Descriptions.Item label={''}>{''}</Descriptions.Item>
        <Descriptions.Item label={<b>{'No of cartons'}</b>}><Tag color="green">{childData.totalCartons}</Tag></Descriptions.Item>
        <Descriptions.Item label={<b>{'No of Ready cartons'}</b>}><Tag color="green">{childData.totalCartons}</Tag></Descriptions.Item>
        {/* <Descriptions.Item label={<b>{'Total GMT quantity'}</b>} className=''><span style={{ color: "black" }}><Tag color="green">{childData[0].totalCartons}</Tag></span></Descriptions.Item> */}
      </Descriptions>
      {/* </ScxCard> */}
    </>
  );
};

export default PkCutDocketTable;
