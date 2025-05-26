import { MrnStatusEnum, PackListMrnStatusEnum, PackMatReqID, PackMatSummaryModel } from '@xpparel/shared-models';
import { PackMaterialReqServices } from '@xpparel/shared-services';
import { Button, Form, FormInstance, Input, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';

interface IReqProps {
  req: PackMatReqID;
  approvePMRNo: (mrnId: number, status: PackListMrnStatusEnum, formRef?: FormInstance<any>) => void;
  status: any;
}

export const PackMAterialSummaryComponent = (props: IReqProps) => {
  const { approvePMRNo, req, status } = props;
  const [sumData, setSumData] = useState<PackMatSummaryModel[]>([]);
  const service = new PackMaterialReqServices();
  const [formRef] = Form.useForm();

  useEffect(() => {
    getPackMaterialSummaryDataById(props.req);
  }, []);

  let timeOutId;
  const getPackMaterialSummaryDataById = (req: PackMatReqID) => {
    clearTimeout(timeOutId)
    timeOutId = setTimeout(() => {
      service.getPackMaterialSummaryDataById(req)
        .then((res) => {
          if (res.status) {
            setSumData(res.data);
          } else {
            setSumData([]);
            AlertMessages.getErrorMessage(res.internalMessage);
          }
        })
        .catch((err) => {
          AlertMessages.getErrorMessage(err.message);
        });
    }, 100)

  };

  const summaryColumns: ColumnProps<PackMatSummaryModel>[] = [
    {
      title: 'Pack Jobs',
      dataIndex: 'packJobs',
      key: 'packJobs',
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <span style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
            maxWidth: '150px'
          }}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      key: 'itemCode',
      width: 200,
    },
    {
      title: 'No Of Cartons',
      dataIndex: 'qty',
      key: 'qty',
      width: 200,
    },
  ];

  if (status === MrnStatusEnum.APPROVED) {
    summaryColumns.push({
      title: 'Issued Qty',
      dataIndex: 'issuedQty',
      width: 120,
      render: (v, r, index) => {
        return <>
          <Form.Item
            name={[index, 'issuedQty']}
            initialValue={r.issuedQty > 0 ? r.issuedQty : r.qty}
          >
            <Input
              min={0}
              type='number'
            >
            </Input>
          </Form.Item>
          <Form.Item
            hidden
            name={[index, 'mapId']}
            initialValue={r.mapId}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            hidden
            name={[index, 'requiredQty']}
            initialValue={r.qty}
          >
            <Input></Input>
          </Form.Item>

        </>
      }
    });
  }

  return (
    <Form form={formRef}>
      <Table
        bordered
        columns={summaryColumns}
        dataSource={sumData}
        size='small'
        scroll={{x: 'max-contnet'}}
        summary={() => {
          return (
            <>
              {status === MrnStatusEnum.APPROVED && (
                <Table.Summary>
                  <Table.Summary.Cell index={1} colSpan={2} />
                  <Table.Summary.Cell index={1} colSpan={3}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => approvePMRNo(req.mrnID, PackListMrnStatusEnum.ISSUED, formRef)}
                    >
                      ISSUE
                    </Button>
                  </Table.Summary.Cell>
                </Table.Summary>
              )}
            </>
          );
        }}
      />
    </Form>
  );
};

export default PackMAterialSummaryComponent;
