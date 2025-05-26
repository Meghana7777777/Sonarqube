import { FgWhHeaderIdReqDto, FgWhLinesResDto } from '@xpparel/shared-models';
import { PKMSFgWarehouseService } from '@xpparel/shared-services'
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { color } from 'highcharts';
import { useAppSelector } from 'packages/ui/src/common';
import React, { useEffect, useState } from 'react'


interface Props {
  requestId: number
}
export default function FGWhReqLinesTable({ requestId }: Props) {
  const fgWHService = new PKMSFgWarehouseService();
  const user = useAppSelector((state) => state.user.user.user);
  const [fgWhLines, setFgWhLines] = useState<FgWhLinesResDto[]>([])

  useEffect(() => {
    getFgWhReqLines(requestId)
  }, [requestId]);

  const getFgWhReqLines = (requestId: number) => {
    const req = new FgWhHeaderIdReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, requestId)
    fgWHService.getFgWhReqLines(req).then(res => {
      if (res.status) {
        setFgWhLines(res.data);
      } else {
        setFgWhLines([]);
      };
    }).catch(err => console.log(err.message));
  }

  const columns: ColumnsType<FgWhLinesResDto> = [
    {
      title: 'Pack List No',
      dataIndex: "packListNo"
    },
    {
      title: 'Pack Order No',
      dataIndex: "packOrderNo"
    },
    {
      title: 'Floor',
      dataIndex: "floor"
    },
    {
      title: 'Mo No',
      dataIndex: "moNo"
    },
    {
      title:'Carton Barcode',
      dataIndex:"barcode"
    },
    {
      title:"Quantity",
      dataIndex:"qty",
      render:(qty)=><Tag style={{border:"#91caff",background:"#e6f4ff",color:"#0958d9"}} color="#91caff">{qty}</Tag>
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => <Tag color='green'>{status}</Tag>,
    }
  ];

  return <>
    <Table
      columns={columns}
      dataSource={fgWhLines}
      size='small'
      bordered
      scroll={{x: 'max-content'}}
    >

    </Table>

  </>
}
