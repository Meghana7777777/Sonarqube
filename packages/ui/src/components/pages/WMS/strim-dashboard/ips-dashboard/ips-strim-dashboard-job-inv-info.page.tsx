import { ReloadOutlined } from "@ant-design/icons";
import { INV_C_AvlBundlesForPslModel, INV_C_AvlBundlesForPslRequest, INV_C_InvCheckBundleModel, INV_C_InvCheckForProcTypeAndBundlesModel, INV_C_InvCheckForProcTypeAndBundlesRequest, INV_R_ArrangedAvlBundlesForPslModel, SPS_C_ACT_RequestedBundles, SPS_C_JobRequestedTrimItemsModel, SPS_C_JobTrimRequest, SPS_C_ProcJobNumberRequest, SPS_R_ProcJobInfoModel } from "@xpparel/shared-models";
import { InvCreationService, InvIssuanceService, ProcessingJobsService } from "@xpparel/shared-services";
import { Button, Card, Col, DatePicker, Form, Row, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../../common";
interface Props {
  jobNumber: string;
  refreshKey: number;
  updateChanges:(isChange: boolean) => void;
  handleRefresh : () => void;
  iNeedActionItems: boolean;
}
interface IJobReqQty {
  totalReqQty: number;
  totalAvaQty: number;
  isActualBundle: boolean;
  isDiff: boolean;
}


const IPSStrimDashboardInventoryRequestPage: React.FC<Props> = ({ jobNumber, refreshKey, updateChanges,handleRefresh, iNeedActionItems }) => {
  const [jobData, setJobData] = useState<SPS_R_ProcJobInfoModel | null>(null);
  const [availableQtyMap, setAvailableQtyMap] = useState<Record<string, Record<string, number>>>({});
  const user = useAppSelector((state) => state.user.user.user);
  const processService = new ProcessingJobsService();
  const inventoryService = new InvIssuanceService();
  const inventoryCreationService = new InvCreationService();
  const [expectedFulfillmentDate, setExpectedFulfillmentDate] = useState<string | null>(null);
  const [reqQty, setReqQty] = useState<IJobReqQty>({ isActualBundle: false, isDiff: false, totalAvaQty: 0, totalReqQty: 0 });
  const [availableBundlesData, setAvailableBundlesData] = useState<INV_R_ArrangedAvlBundlesForPslModel[]>([]);

  useEffect(() => {
    if (jobNumber) fetchJobData(jobNumber);
  }, [jobNumber, refreshKey]);

  const fetchJobData = async (jobNumber: string) => {
    const request = new SPS_C_ProcJobNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber, true, true, true, false, true, true);
    try {
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

  const fetchAvailableQuantity = async (_jobData: SPS_R_ProcJobInfoModel) => {
    if (!_jobData) return;
    if (_jobData.requiresActualBundles) {
      setReqQty(pre=>({...pre, isActualBundle: true}))
      getActualBundlesInfo(_jobData);
      return;
    }
    try {
      const bundleMap: Record<number, INV_C_InvCheckBundleModel[]> = {};
      _jobData.bundlesInfo.forEach(bundle => {
        if (!bundleMap[bundle.pslId]) bundleMap[bundle.pslId] = [];
        const bundleModel = new INV_C_InvCheckBundleModel();
        bundleModel.bunBarcode = bundle.bunBrcd;
        bundleModel.rQty = bundle.qty;
        bundleMap[bundle.pslId].push(bundleModel);
      });

      const pslToColorSizeMap = new Map<number, { color: string; size: string }>();
      _jobData.colorSizeQty.forEach(entry => {
        entry.pslIds.forEach(pslId => {
          pslToColorSizeMap.set(pslId, { color: entry.color, size: entry.size });
        });
      });

      const procTypeBundles: INV_C_InvCheckForProcTypeAndBundlesModel[] = [];
      Object.entries(bundleMap).map(([pslIdStr, bundles]) => {
        const pslId = Number(pslIdStr);
        const colorSizeMatch = _jobData.colorSizeQty.find(cs => cs.pslIds.includes(pslId));
        if (colorSizeMatch) {
          const skuInfo = _jobData.jobDepSkuInfo.forEach(sku => {
            if (sku.color === colorSizeMatch.color && sku.size === colorSizeMatch.size) {
              procTypeBundles.push({ processType: sku.depProcType, itemSku: sku.itemSku, bundles: bundles });
            }
          })
        }
      });

      const request = new INV_C_InvCheckForProcTypeAndBundlesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, procTypeBundles, true);
      const response = await inventoryService.getInventoryForGivenBundlesAndProcessTypes(request);

      const tempMap: Record<string, Record<string, number>> = {};
      response.data?.forEach(procTypeData => {
        procTypeData.bundles.forEach(bundle => {
          const colorSize = pslToColorSizeMap.get(bundle.pslId);
          if (colorSize) {
            const { color, size } = colorSize;
            if (!tempMap[color]) tempMap[color] = {};
            tempMap[color][size] = (tempMap[color][size] || 0) + bundle.avlQty;
          }
        });
      });
      setAvailableQtyMap(tempMap);
    } catch (error) {
      AlertMessages.getErrorMessage(error.message);
    }
  };
  const getActualBundlesInfo = (_jobData: SPS_R_ProcJobInfoModel) => {
    const { jobPslQtys, jobDepSkuInfo, colorSizeQty, procSerial, procType } = _jobData;
    let totalRequiredQty = 0;
    const itemSku = jobDepSkuInfo[0]?.itemSku;
    const depProcType = jobDepSkuInfo[0]?.depProcType;
    const requestQtys: INV_C_AvlBundlesForPslModel[] = jobPslQtys.map(jobPslQ => {
      totalRequiredQty += jobPslQ.jobReGenQty;
      return new INV_C_AvlBundlesForPslModel(jobPslQ.pslId, jobPslQ.orgQty, itemSku, true);
    })
    const req = new INV_C_AvlBundlesForPslRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, procSerial, depProcType, requestQtys)
    inventoryCreationService.getAvailableBundlesInvForPslIds(req).then(res => {
      if (res.status) {
        let totalAvailableQty = 0;
        const pslToColorSizeMap = new Map<number, { color: string; size: string }>();
        colorSizeQty.forEach(entry => {
          entry.pslIds.forEach(pslId => {
            pslToColorSizeMap.set(pslId, { color: entry.color, size: entry.size });
          });
        });
        setAvailableBundlesData(res.data);
        const tempMap: Record<string, Record<string, number>> = {};
        res.data?.forEach(actualBundles => {
          const colorSize = pslToColorSizeMap.get(actualBundles.pslId);
          if (colorSize) {
            const { color, size } = colorSize;
            actualBundles.avlBundles.forEach(bundle => {
              if (!tempMap[color]) {
                tempMap[color] = {};
              }
              tempMap[color][size] = (tempMap[color][size] || 0) + bundle.aQty;
              totalAvailableQty += bundle.aQty;
            });
          }
        });
        setReqQty({ isActualBundle: true, isDiff: totalRequiredQty > totalAvailableQty, totalAvaQty: totalAvailableQty, totalReqQty: totalRequiredQty });
        setAvailableQtyMap(tempMap);

      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message);
    })
  }
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

      items.forEach((item, index) => {
        dataSource.push({
          key: `available-${color}-${item}`,
          category: (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              Available quantity
              <ReloadOutlined
                style={{ marginLeft: 8, cursor: "pointer" }}
                onClick={() => fetchAvailableQuantity(jobData)}
              />
            </div>
          ),
          item,
          rowSpan: index === 0 ? items.length : 0,
          ...sizes.reduce((acc, size) => {
            const qty = availableQtyMap[color]?.[size] || 0;
            return {
              ...acc,
              [size]: (
                <div style={{ textAlign: "center" }}>
                  <Tag color={qty > 0 ? "green" : "red"}>{qty}</Tag>
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

  const handleInventoryRequest = async () => {
    try {
      const date = new Date();
      if (!jobData?.jobNumber || !jobData?.jobDepSkuInfo) {
        AlertMessages.getErrorMessage('Missing job data');
        return;
      }
      const items = jobData.jobDepSkuInfo.map((item: any) => {
        return new SPS_C_JobRequestedTrimItemsModel(item.itemSku, parseFloat(item.requestedQty));
      });

      const availableBundles:SPS_C_ACT_RequestedBundles[] = [];
      availableBundlesData.forEach(bunObj=> {
        bunObj.avlBundles.forEach(barcode=>{
          availableBundles.push(new SPS_C_ACT_RequestedBundles(bunObj.pslId,barcode.bundleBarcode, barcode.aQty ));
        })
      });
      const req = new SPS_C_JobTrimRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobData.jobNumber, user?.userName, date.toISOString(), date, items, availableBundles);
      const res = await processService.saveBankReqForSewingJob(req);

      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        fetchJobData(jobNumber);
        updateChanges(true);
        handleRefresh();
        setExpectedFulfillmentDate(null);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage || 'Request failed');
      }
    } catch (err: any) {
      AlertMessages.getErrorMessage(err.message || 'Unexpected error occurred');
    }
  };

  const hasAvailableQty = (map: Record<string, Record<string, number>>): boolean => {
    return Object.values(map).some(sizeMap =>
      Object.values(sizeMap).some(qty => qty > 0)
    );
  };

  return (<>
    {colorWiseTables.length > 0 && (
      <Card size='small' title={<span style={{ display: 'flex', justifyContent: 'center' }}>Inventory Request Info</span>} bordered>
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
        <Row gutter={16} justify="end" style={{ marginTop: 16 }}>
          <Col>
            <Form>
              <Form.Item label='Expected Fulfillment Date' name='expectedFulFillMentDate' rules={[{ required: true }]}>
                <DatePicker onChange={(_, dateString) => setExpectedFulfillmentDate(dateString || null)} />
              </Form.Item>
            </Form>
          </Col>
          {(expectedFulfillmentDate && hasAvailableQty(availableQtyMap)) && iNeedActionItems && (
            <Col>
              <Button
                type="primary"
                size="small"
                style={{
                  backgroundColor: "#003049",
                  borderColor: "#003049",
                  fontWeight: 600,
                  width: 140,
                  height: 35,
                  lineHeight: "24px",
                  padding: "0 12px"
                }}
                onClick={handleInventoryRequest}
                disabled={!iNeedActionItems}
              >
                Request Inventory
              </Button>
            </Col>
          )}
        </Row>
      </Card>
    )}
  </>

  );
};

export default IPSStrimDashboardInventoryRequestPage;
