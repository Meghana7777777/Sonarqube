import { DownCircleFilled, UpCircleFilled } from "@ant-design/icons";
import {
  LayingStatusEnumDisplayValues,
  MrnIdStatusRequest,
  MrnRequestModel,
  MrnStatusEnum,
  cutStatusEnumDisplayValues,
  mrnStatusEnumDiplayValues,
} from "@xpparel/shared-models";
import { Button, Table } from "antd";
import { useState } from "react";
import { MrnRequestsSubTable } from "./mrn-requests-sub-table";
import { ExtendedMrnStatusEnum } from "./mrn-request";
import { ColumnProps } from "antd/es/table";
import { MrnService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "../../../common";
interface IMrnRequestTableProps {
  mrnRequestData: MrnRequestModel[];
  activeTab: ExtendedMrnStatusEnum;
  getMrnRequestsByMrnStatus: (tabKey: ExtendedMrnStatusEnum) => void;
}
export const MrnRequestTable = (props: IMrnRequestTableProps) => {
  const { mrnRequestData, getMrnRequestsByMrnStatus, activeTab } = props;
  const [expandedIndex, setExpandedIndex] = useState([]);

  const user = useAppSelector((state) => state.user.user.user);

  const mrnService = new MrnService();
  const changeMrnRequestStatus = (req: MrnIdStatusRequest) => {
    mrnService
      .changeMrnRequestStatus(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getMrnRequestsByMrnStatus(activeTab);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((error) => {
        AlertMessages.getErrorMessage(error.message);
      });
  };
  const renderApproveButton = (
    status: MrnStatusEnum,
    record: MrnRequestModel,
    index: number
  ) => {
    if (status === MrnStatusEnum.OPEN) {
      return (
        <>
          <Button
            size="small"
            className="btn-green"
            onClick={() =>
              changeMrnRequestStatus(
                new MrnIdStatusRequest(
                  user?.userName,
                  user?.orgData?.unitCode,
                  user?.orgData?.companyCode,
                  user?.userId,
                  record.mrnReqId,
                  record.mrnReqNo,
                  MrnStatusEnum.APPROVED,
                  ""
                )
              )
            }
          >
            Approve
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            onClick={() =>
              changeMrnRequestStatus(
                new MrnIdStatusRequest(
                  user?.userName,
                  user?.orgData?.unitCode,
                  user?.orgData?.companyCode,
                  user?.userId,
                  record.mrnReqId,
                  record.mrnReqNo,
                  MrnStatusEnum.REJECTED,
                  ""
                )
              )
            }
          >
            Reject
          </Button>
        </>
      );
    }
    if (status === MrnStatusEnum.APPROVED) {
      return (
        <Button
          type="primary"
          size="small"
          onClick={() =>
            changeMrnRequestStatus(
              new MrnIdStatusRequest(
                user?.userName,
                user?.orgData?.unitCode,
                user?.orgData?.companyCode,
                user?.userId,
                record.mrnReqId,
                record.mrnReqNo,
                MrnStatusEnum.ISSUED,
                ""
              )
            )
          }
        >
          Issue
        </Button>
      );
    }
    return <div>{status}</div>;
  };
  const mrnRequestTableColumns: ColumnProps<MrnRequestModel>[] = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      render: (text, record, index) => index + 1,
    },
    {
      title: "MRN Req no",
      dataIndex: "mrnReqNo",
      key: "mrnReqNo",
    },
    {
      title: "Docket",
      dataIndex: "docketNumber",
      key: "docketNumber",
    },
    {
      title: "Requested Qty",
      dataIndex: "totalMrnReqQty",
      key: "totalMrnReqQty",
    },
    {
      title: "Status",
      dataIndex: "mrnStatus",
      key: "mrnStatus",
      render: renderApproveButton,
    },
    {
      title: "Laying Status",
      dataIndex: "layStatus",
      key: "layStatus",
      render(value, record, index) {
        return LayingStatusEnumDisplayValues[value];
      },
    },
    {
      title: "Cut Status",
      dataIndex: "cutStatus",
      key: "cutStatus",
      render(value, record, index) {
        return cutStatusEnumDisplayValues[value];
      },
    },
    {
      title: "Print",
      dataIndex: "print",
      key: "print",
    },
  ];
  const setIndex = (expanded, record: MrnRequestModel) => {
    const expandedRows = new Set(expandedIndex);
    if (expanded) {
      expandedRows.add(record?.mrnReqId);
      setExpandedIndex(Array.from(expandedRows));
    } else {
      expandedRows.delete(record?.mrnReqId);
      setExpandedIndex(Array.from(expandedRows));
    }
  };
  const renderItems = (record: MrnRequestModel, index, indent, expanded) => {
    return <MrnRequestsSubTable record={record} />;
  };
  return (
    <Table
      rowKey={(rec) => rec.mrnReqId}
      columns={mrnRequestTableColumns}
      dataSource={mrnRequestData}
      expandable={{
        expandedRowRender: renderItems,
        expandedRowKeys: expandedIndex,
        onExpand: setIndex,
      }}
      expandIcon={({ expanded, onExpand, record }) =>
        expanded ? (
          <UpCircleFilled onClick={(e) => onExpand(record, e)}>
            Collapse
          </UpCircleFilled>
        ) : (
          <DownCircleFilled onClick={(e) => onExpand(record, e)}>
            Expand
          </DownCircleFilled>
        )
      }
      pagination={false}
      size='small'
    />
  );
};

export default MrnRequestTable;
