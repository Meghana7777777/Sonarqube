import { PKMSPackListInfoModel } from '@xpparel/shared-models';
import { Descriptions } from 'antd';
import React from 'react';




interface CutviewChildProps {
  childData: PKMSPackListInfoModel[]; // Accepting childData as a prop
}



const PkCutDocketTable: React.FC<CutviewChildProps> = ({ childData }) => {
const data=childData[0]?.packListAttrs;
  return (
    <>
      {/* <ScxCard size='small'> */}

        <Descriptions size='small' bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}>

          <Descriptions.Item label={<b>{'PO Number'}</b>} className=''><span style={{ color: "black" }}>{data.vpos}</span></Descriptions.Item>

          <Descriptions.Item label={<b>{'CO Number'}</b>} className=''><span style={{ color: "black" }}>{''}</span></Descriptions.Item>

          <Descriptions.Item label={<b>{'Product Names'}</b>} className=''><span style={{ color: "black" }}>{data.prodNames.join(', ')}</span></Descriptions.Item>

          <Descriptions.Item label={<b>{'Destination'}</b>} className=''><span style={{ color: "black" }}>{data.destinations.join(', ')}</span></Descriptions.Item>

          <Descriptions.Item label={<b>{'Delivary date'}</b>} className=''><span style={{ color: "black" }}>{data.delDates}</span></Descriptions.Item>

          <Descriptions.Item label={<b>{'Pack order'}</b>} className=''><span style={{ color: "black" }}>{' '}</span></Descriptions.Item>

          <Descriptions.Item label={<b>{'No of cartons'}</b>} className=''><span style={{ color: "black" }}>{''}</span></Descriptions.Item>

          <Descriptions.Item label={<b>{'No of Ready cartons'}</b>} className=''><span style={{ color: "black" }}>{''}</span></Descriptions.Item>

          <Descriptions.Item label={<b>{'Total GMT quantity'}</b>}><span>{''}</span></Descriptions.Item>

          <Descriptions.Item label={<b>{'style'}</b>}><span>{data.styles.join(', ')}</span></Descriptions.Item>

        </Descriptions>
      {/* </ScxCard> */}
    </>
  );
};

export default PkCutDocketTable;
