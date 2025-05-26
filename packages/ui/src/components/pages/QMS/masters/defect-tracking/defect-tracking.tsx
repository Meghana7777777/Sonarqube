import { PoViewFilterReq } from "@xpparel/shared-models";
import { PoCreationService, PoCreationServices } from "@xpparel/shared-services";
import { Card, Form, Table } from "antd";
import moment from "moment";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";


export function DefectTrackingView() {
  const services = new PoCreationServices();
  const [pocreation, setPoCreation] = useState<any>([]);
  const [form] = Form.useForm()

  useEffect(() => {
    getPoCreation();
  }, []);

  const getPoCreation = () => {
    const req = new PoViewFilterReq()
    if (form.getFieldValue('poId') != undefined) {
      req.poId = form.getFieldValue('poId')
    }
    if (form.getFieldValue('buyerId') != undefined) {
      req.buyerId = form.getFieldValue('buyerId')
    }
    services.getPoViewInfo(req).then((res) => {
      if (res.status) {
        setPoCreation(res.data);
      } else {
        setPoCreation([]);
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    });
  };

  const staticColumns: any = [
    {
      title: "MO Number",
      dataIndex: "poNumber",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Estimated Closed Date",
      dataIndex: "estimatedClosedDate",
      align: "center",
      render: (value, record) => {
        return <>
          {moment.utc(value).format("YYYY-MM-DD")}
        </>
      }
    },
  ];

  const generateDynamicColumns = (qualityData) => {
    return Object.keys(qualityData).map((key) => ({
      title: key,
      width: 150,
      children: [
        { title: "Pass", dataIndex: [`qualityData`, key, "Pass"], align: "center", width: "150px", },
        { title: "Fail", dataIndex: [`qualityData`, key, "Fail"], align: "center", width: "150px", },
      ],
    }));
  };


  const dynamicColumns = generateDynamicColumns(pocreation[0]?.qualityData || {});

  const columns = [...staticColumns, ...dynamicColumns,];

  return (
    <div>
      <Card title='Defect Tracking' >
        <Table columns={columns} dataSource={pocreation} style={{ borderRadius: "9px" }} className="custom-table" size="small"
          scroll={{ x: true }}
          bordered
        />
      </Card>
    </div>
  );
};

export default DefectTrackingView;
