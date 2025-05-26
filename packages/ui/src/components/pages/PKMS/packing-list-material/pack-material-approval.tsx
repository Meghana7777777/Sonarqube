import { DownCircleFilled, UpCircleFilled } from '@ant-design/icons';
import { PackListMrnStatusEnum, PackMAterialRequest, PackMatReqID } from '@xpparel/shared-models';
import { PackMaterialReqServices } from '@xpparel/shared-services';
import { Button, FormInstance, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import moment from 'moment';
import { PackMAterialsForPackLists } from 'packages/libs/shared-models/src/pkms/packing-material-request/pack-mat-req-response.model';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import PackMAterialSummaryComponent from './pack-material-grid';

interface MrStatusProps {
  mrnData: PackMAterialsForPackLists[];
  statusTab: any;
  getPAckMaterialsByPackListID: (req: PackMAterialRequest) => void;
  selectedPackList: number
}

export const PackMaterialApproval = (props: MrStatusProps) => {
  const { mrnData, statusTab, selectedPackList, getPAckMaterialsByPackListID } = props;
  const user = useAppSelector((state) => state.user.user.user);
  const [expandedIndex, setExpandedIndex] = useState([]);
  const mrService = new PackMaterialReqServices();

  useEffect(() => {
    getPAckMaterialsByPackListID(new PackMAterialRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      selectedPackList,
      [statusTab]))
  }, [statusTab]);



  const approvePMRNo = (mrnId: number, status: PackListMrnStatusEnum, formRef?: FormInstance<any>) => {
    const issuedQty: {
      issuedQty: number;
      mapId: number;
      requiredQty: number;
    }[] = [];
    if (formRef) {
      formRef.validateFields().then(values => {
        Object.values(values).forEach((value: any, index: number) => {
          issuedQty.push({ issuedQty: Number(value.issuedQty), mapId: Number(value.mapId), requiredQty: Number(value.requiredQty) })
        })

      }).catch(err => console.log(err.message))
    }
    const req = new PackMatReqID(user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId, mrnId, status,
      issuedQty
    );
    mrService.approvePMRNo(req).then(res => {
      if (res.status) {
        getPAckMaterialsByPackListID(
          new PackMAterialRequest(
            user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId,
            selectedPackList,
            [statusTab],

          )
        )
        AlertMessages.getSuccessMessage(res.internalMessage);

      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => console.log(err.message))
  };



  const getStatusWiseMrnData = (status: PackListMrnStatusEnum, record: PackMAterialsForPackLists, index: number) => {
    if (statusTab === PackListMrnStatusEnum.OPEN) {
      return (
        <>
          <Button
            size="small"
            className="btn-green"
            // style={{
            //   backgroundColor: '#2dd81a',
            //   borderColor: '#2dd81a',
            //   marginRight: 3
            // }}
            onClick={() => approvePMRNo(record.mrnID, PackListMrnStatusEnum.APPROVED)}
          >
            Approve
          </Button>
          <Button 
            danger
            type="primary"
            size="small"
            onClick={() => approvePMRNo(record.mrnID, PackListMrnStatusEnum.REJECTED)}
          >
            Reject
          </Button>
        </>
      );
    }
    return status;
  };

  const materialReqColumns: ColumnProps<PackMAterialsForPackLists>[] = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Pack Material requestNo',
      dataIndex: 'requestNo',
      key: 'requestNo',
    },
    {
      title: 'Req Date',
      dataIndex: 'matReqOn',
      key: 'matReqOn',
      render: (text: string) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: 'Req By',
      dataIndex: 'matReqBy',
      key: 'matReqBy',
    },
    {
      title: 'Req Full Fill DateTime',
      dataIndex: 'matFulfillmentDateTime',
      key: 'matFulfillmentDateTime',
    },
    {
      title: 'Action',
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      render: getStatusWiseMrnData,
    },
  ];

  const summaryPreview = (expand, record: PackMAterialsForPackLists) => {
    const expandRows = new Set(expandedIndex);
    if (expand) {
      expandRows.add(record?.mrnID);
      setExpandedIndex(Array.from(expandRows));
    } else {
      expandRows.delete(record?.mrnID);
      setExpandedIndex(Array.from(expandRows));
    }
  };

  const summaryTable = (record: PackMAterialsForPackLists) => {
    const req = new PackMatReqID(user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      record.mrnID);

    return <PackMAterialSummaryComponent req={req} approvePMRNo={approvePMRNo} status={statusTab} />;
  };

  return (
    <Table
      columns={materialReqColumns}
      dataSource={mrnData}
      expandable={{
        expandedRowRender: summaryTable,
        expandedRowKeys: expandedIndex,
        onExpand: summaryPreview,
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <UpCircleFilled onClick={(e) => onExpand(record, e)} />
          ) : (
            <DownCircleFilled onClick={(e) => onExpand(record, e)} />
          ),
      }}
      pagination={false}
      size='small'
      bordered
      rowKey={(rec) => rec.mrnID}
    />
  );
};

export default PackMaterialApproval;
