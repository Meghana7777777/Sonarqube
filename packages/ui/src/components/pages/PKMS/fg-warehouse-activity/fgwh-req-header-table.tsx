import { FgWhInActivityActionsEnum, FgWhReqHeaderDetailsModel, FgWhReqHeaderFilterReq, PkmsFgWhCurrStageEnum, PkmsFgWhReqApprovalEnum, PkmsFgWhReqTypeEnum } from '@xpparel/shared-models'
import { PKMSFgWarehouseService } from '@xpparel/shared-services'
import { Card, Input, Table } from 'antd'
import moment from 'moment'
import { SequenceUtils, useAppSelector } from 'packages/ui/src/common'
import { useEffect, useState } from 'react'
import FGWhReqLinesTable from './fgwh-req-lines-table'

interface Props {
  reqType: PkmsFgWhReqTypeEnum
  currentStage: PkmsFgWhCurrStageEnum[];
  approvalStatus: PkmsFgWhReqApprovalEnum;
  actionColumns?: any[]
  tab?: FgWhInActivityActionsEnum
  stateUpdateKey?: number
}
export default function FGWAReqHeaderTable({ reqType, currentStage, actionColumns, approvalStatus, tab, stateUpdateKey }: Props) {

  const user = useAppSelector((state) => state.user.user.user);
  const [data, setData] = useState<FgWhReqHeaderDetailsModel[]>()
  const fgWHService = new PKMSFgWarehouseService()
  const [searchedText, setSearchedText] = useState("");

  useEffect(() => {
    getFgWhHeaderReqDetails()
  }, [currentStage, stateUpdateKey])

  const getFgWhHeaderReqDetails = () => {
    const req = new FgWhReqHeaderFilterReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, reqType, currentStage, approvalStatus)
    fgWHService.getFgWhHeaderReqDetails(req).then((res) => {
      if (res.status) {
        setData(res.data)
      } else (
        setData([])
      )
    }).catch(err => console.log(err.message))
  }

  const columns = [
    {
      title: 'Request No',
      dataIndex: 'requestNo',
      key: 'requestNo',
      sorter: (a, b) => { return a.requestNo.localeCompare(b.requestNo) },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record)
      }
    },
    {
      title: 'Warehouse',
      dataIndex: 'toWhCode',
      key: 'toWhCode',
      sorter: (a, b) => { return a.toWhCode.localeCompare(b.toWhCode) },
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'MO number',
      dataIndex: 'moNumber',
      key: 'moNumber',
      sorter: (a, b) => { return a.moNumber.localeCompare(b.moNumber) },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Buyer',
      dataIndex: 'buyer',
      key: 'buyer',
      sorter: (a, b) => { return a.buyer.localeCompare(b.buyer) },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Buyer PO',
      dataIndex: 'buyerPo',
      key: 'buyerPo',
      sorter: (a, b) => { return a.buyerPo.localeCompare(b.buyerPo) },
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
      sorter: (a, b) => { return a.style.localeCompare(b.style) },
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
      sorter: (a, b) => { return a.destination.localeCompare(b.destination) },
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Delivery date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      sorter: (a, b) => { return a.deliveryDate.localeCompare(b.deliveryDate) },
      sortDirections: ['descend', 'ascend'],
      render: (v: string) => {
        return v.split(',').map(rec => moment(rec).format('DD-MM-YYYY')+',')
      }
    },

  ]
  return (
    <Card>
      <Input.Search
        placeholder="Search"
        allowClear
        onChange={(e) => { setSearchedText(e.target.value) }}
        onSearch={(value) => { setSearchedText(value) }}
        style={{ width: 200, float: "right" }}
      />
      <Table
        size='small'
        bordered
        scroll={{x: 'max-content'}}
        rowKey={(row) => row.requestId}
        columns={[...columns, ...actionColumns]}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => <FGWhReqLinesTable requestId={record.requestId} />,
        }} />
    </Card>
  )
}
