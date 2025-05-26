import { SPS_C_ProcJobNumberRequest, SPS_R_ProcJobInfoModel } from "@xpparel/shared-models";
import { ProcessingJobsService } from "@xpparel/shared-services";
import { Card, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../../common";

interface Props {
  jobNumber: string;
  refreshKey: number;
  updateChanges: (isChange: boolean) => void;
}

const WMSStrimDashboardInventoryRequestPage: React.FC<Props> = ({ jobNumber, refreshKey, updateChanges }) => {
  const [jobData, setJobData] = useState<SPS_R_ProcJobInfoModel | null>(null);
  const user = useAppSelector((state) => state.user.user.user);
  const processService = new ProcessingJobsService();

  useEffect(() => {
    if (jobNumber) fetchJobData(jobNumber);
  }, [jobNumber, refreshKey]);

  const fetchJobData = async (jobNumber: string) => {
    try {
      const request = new SPS_C_ProcJobNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber, true, false, false, false, false, false);
      const response = await processService.getJobInfoByJobNumber(request);
      if (response.data?.length > 0) {
        setJobData(response.data[0]);
      } else {
        AlertMessages.getErrorMessage(response.internalMessage);
      }
    } catch (err: any) {
      AlertMessages.getErrorMessage(err.internalMessage);
    }
  };

  const processTableData = (jobData: SPS_R_ProcJobInfoModel) => {
    const sizes = [...new Set(jobData.colorSizeQty.map(item => item.size))];
    const colors = [...new Set(jobData.colorSizeQty.map(item => item.color))];
    const items = [...new Set(jobData.jobDepSkuInfo.map(item => item.itemSku))];

    const inventoryMap: Record<string, Record<string, number>> = {};
    const itemMap: Record<string, { requested: Record<string, number>, issued: Record<string, number> }> = {};

    jobData.colorSizeQty.forEach(item => {
      if (!inventoryMap[item.color]) inventoryMap[item.color] = {};
      inventoryMap[item.color][item.size] = (inventoryMap[item.color][item.size] || 0) + item.quantity;
    });

    jobData.jobDepSkuInfo.forEach(({ itemSku, size, requestedQty, issuedQty }) => {
      const reqQty = Number(requestedQty);
      const issQty = Number(issuedQty);
      if (!itemMap[itemSku]) {
        itemMap[itemSku] = { requested: {}, issued: {} };
      }
      itemMap[itemSku].requested[size] = (itemMap[itemSku].requested[size] || 0) + reqQty;
      itemMap[itemSku].issued[size] = (itemMap[itemSku].issued[size] || 0) + issQty;
    });

    const colorWiseTables = colors.map(color => {
      const columns: ColumnsType<any> = [
        {
          title: "",
          dataIndex: "category",
          key: "category",
          width: 120,
          align: "center",
          render: (text, record) => {
            if (record.rowSpan > 0)
              return { children: <strong>{text}</strong>, props: { rowSpan: record.rowSpan } };
            if (record.colSpan)
              return { children: <strong>{text}</strong>, props: { colSpan: 2 } };
            return { children: null, props: { rowSpan: 0 } };
          }
        },
        {
          title: "",
          dataIndex: "item",
          key: "item",
          width: 120,
          align: "center",
          render: (text, record) => record.colSpan ? { children: text, props: { colSpan: 0 } } : text
        },
        ...sizes.map(size => ({
          title: size,
          dataIndex: size,
          key: size,
          width: 70,
          align: "center" as const
        }))
      ];

      const dataSource: any[] = [
        {
          key: `color-${color}`,
          category: (
            <span>
              <label style={{ marginRight: 8 }}>Color:</label>
              <Tag color="#f50">{color}</Tag>
            </span>
          ),
          item: '',
          align: "center" as const,
          colSpan: true,
          ...sizes.reduce((acc, size) => ({
            ...acc,
            [size]: (
              <div style={{ textAlign: "center" }}>
                <strong>{inventoryMap[color]?.[size] ?? 0}</strong>
              </div>
            )
          }), {})
        }
      ];

      items.forEach((item, index) => {
        dataSource.push({
          key: `req-${color}-${item}`,
          category: index === 0 ? "Request quantity" : "",
          item,
          rowSpan: index === 0 ? items.length : 0,
          ...sizes.reduce((acc, size) => {
            const qty = itemMap[item]?.requested[size] || 0;
            return {
              ...acc,
              [size]: (
                <div style={{ textAlign: "center" }}>
                  <Tag color="blue">{qty}</Tag>
                </div>
              )
            };
          }, {})
        });
      });

      items.forEach((item, index) => {
        dataSource.push({
          key: `iss-${color}-${item}`,
          category: index === 0 ? "Issued quantity" : "",
          item,
          rowSpan: index === 0 ? items.length : 0,
          ...sizes.reduce((acc, size) => {
            const qty = itemMap[item]?.issued[size] || 0;
            return {
              ...acc,
              [size]: (
                <div style={{ textAlign: "center" }}>
                  <Tag color="gold">{qty}</Tag>
                </div>
              )
            };
          }, {})
        });
      });

      return { color, columns, dataSource };
    });

    return { colorWiseTables };
  };

  const { colorWiseTables } = jobData ? processTableData(jobData) : { colorWiseTables: [] };

  return (<>
    {colorWiseTables.length > 0 && (
      <Card size="small" title={<span style={{ display: 'flex', justifyContent: 'center' }}>Inventory Request Info</span>} bordered>
        {colorWiseTables.map(({ color, columns, dataSource }) => (
          <div key={color} style={{ marginBottom: 20 }}>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              size="small"
              rowKey="key"
              scroll={{ x: 'max-content' }}
              rowClassName={(record) => {
                if (record.key.includes("color")) return "color-row";
                if (record.isGroup) return "group-header-row";
                return "data-row";
              }}
            />
          </div>
        ))}
      </Card>
    )}
  </>
  );
};

export default WMSStrimDashboardInventoryRequestPage;
