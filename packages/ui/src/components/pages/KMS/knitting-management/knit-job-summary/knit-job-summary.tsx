import { EyeOutlined, QrcodeOutlined } from '@ant-design/icons';
import { KC_KnitJobBarcodeModel, KC_KnitJobIdRequest, KC_KnitOrderJobsModel, ProcessingOrderSerialRequest, ProcessingSerialProdCodeRequest, ProcessTypeEnum, StyleProductCodeFgColor } from '@xpparel/shared-models';
import { KnitOrderService, KnittingJobsService } from '@xpparel/shared-services';
import { Button, Card, Col, Empty, Form, Modal, Row, Select, Table } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useEffect, useState } from 'react';
import KnitJobBarcodes from './knit-job-barcodes';
import { getCssFromComponent } from '../../../WMS';
import { KnitJobSheet } from '../../knit-job-sheet';
const { Option } = Select

interface IKnitJobDetails {
  serialNo: number; // Assuming index is a number
  knitGroup: string;
  component: string;
  item: string;
  knitJobNumber: string;
  size: string;
  qty: number;
  color: string;
  barcodeInfo: KC_KnitJobBarcodeModel[]
}
interface KnitJobSummaryProps {
  processingSerial: number;
  styleCode: string;
}
export default function KnitJobSummary(props: KnitJobSummaryProps) {
  const { processingSerial, styleCode } = props
  const [form] = Form.useForm()
  const [knitJobs, setKnitJobs] = useState<KC_KnitOrderJobsModel[]>([]);
  const [productInfo, setProductInfo] = useState<StyleProductCodeFgColor[]>()
  const [selectedProduct, setSelectedProduct] = useState<StyleProductCodeFgColor>()
  const [showBarcodeModal, setShowBarcodeModal] = useState<boolean>(false);
  const [tblData, setTblData] = useState<IKnitJobDetails[]>([]);
  const [barcodeData, setBarcodeData] = useState<KC_KnitJobBarcodeModel[]>([]);
  const [errorText, setErrorText] = useState<string>("No data")
  const user = useAppSelector((state) => state.user.user.user);
  const [selectedJobNumber, setSelectedJobNumber] = useState<string | null>(null);
  const [isJobSheetModalVisible, setIsJobSheetModalModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  const knitJobsService = new KnittingJobsService()
  const knitOrderService = new KnitOrderService();

  useEffect(() => {
    getProductInfoForGivenStyle()
  }, [])

  // need to get product for style and processing serial
  const getProductInfoForGivenStyle = () => {
    const styleCodeRequest = new ProcessingOrderSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [processingSerial], ProcessTypeEnum.KNIT)
    knitOrderService.getStyleProductCodeFgColorForPo(styleCodeRequest).then((res) => {
      if (res.status) {
        setProductInfo(res.data)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
        setProductInfo([])
      }
    }).catch((err) => {
      AlertMessages.getErrorMessage(err.message)
      setProductInfo([])
    })
  }

  const getKnitJobsByPoAndProductCode = () => {
    const processingSerialProdCodeRequest = new ProcessingSerialProdCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, ProcessTypeEnum.KNIT, selectedProduct.productCode, selectedProduct.fgColor, false, true, false, false);
    knitJobsService.getKnitJobsByPoAndProductCode(processingSerialProdCodeRequest).then((res) => {
      if (res.status) {
        setKnitJobs(res.data);
        setErrorText(res.data.length ? res.internalMessage : "No data found")
        constructTableData(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
        setErrorText(res.internalMessage)
        setKnitJobs([])
      }
    }).catch((err) => {
      AlertMessages.getErrorMessage(err.message)
      setErrorText(err.message)
      setKnitJobs([])
    })
  }


  const getKnitJobDetailsForKnitJobId = (rec: IKnitJobDetails) => {
    const req = new KC_KnitJobIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, 0, rec.knitJobNumber, false, false, true, false)
    knitJobsService.getKnitJobDetailsForKnitJobId(req).then((res) => {
      if (res.status) {
        // setknitJobBarcodeData(res.data);
        setBarcodeData(res.data[0].knitJobs[0].barcodeInfo)
        setShowBarcodeModal(true)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    })
  }


  function onViewBArcodeData(rec: IKnitJobDetails) {
    getKnitJobDetailsForKnitJobId(rec)
  }

  const handleView = (jobNumber: string) => {
    setSelectedJobNumber(jobNumber);
    setIsJobSheetModalModalVisible(true);
  };

  const closeJobSheetModal = () => {
    setSelectedJobNumber(null);
    setIsJobSheetModalModalVisible(false);
  }

  const printJobSheet = () => {
    const divContents = document.getElementById('printArea').innerHTML;
    const element = window.open('', '', 'height=700, width=1024');
    element.document.write(divContents);
    getCssFromComponent(document, element.document);
    element.document.close();
    // Loading image lazy
    setTimeout(() => {
      element.print();
      element.close();
    }, 1000);
  }

  const columns = [
    {
      title: 'Sno',
      dataIndex: 'serialNo',

    },
    {
      title: 'Knit Group',
      dataIndex: 'knitGroup',
    },
    {
      title: 'Component',
      dataIndex: 'component',
    },
    {
      title: 'Item',
      dataIndex: 'item',
    },
    {
      title: 'Knit Job Number',
      dataIndex: 'knitJobNumber',
      key: 'knitJobNumber',
    },
    {
      title: 'Color',
      dataIndex: 'color',
    },
    {
      title: 'Size',
      dataIndex: 'size',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
    },
    {
      title: 'Barcodes',
      dataIndex: 'barcodes',
      key: 'barcodes',
      render: (text, record) => (
        <Button icon={<QrcodeOutlined />} type="link" onClick={() => onViewBArcodeData(record)}> Barcodes</Button>
      ),
    },
    {
      title: 'Job Sheet', dataIndex: 'jobSheet', key: 'jobSheet', render: (_: any, record: any) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleView(record.knitJobNumber)}
        />
      ),
    },
  ];

  function onProductChange(v, e) {
    const val = new StyleProductCodeFgColor()
    val.fgColor = e.fgColor
    val.productCode = e.productCode
    val.styleCode = e.styleCode
    val.productName = e.productName
    val.productType = e.productType
    setSelectedProduct(val)
    // getKnitJobsByPoAndProductCode()
  }

  function onSubmit() {
    getKnitJobsByPoAndProductCode()
  }

  function constructTableData(knitOrderJobs: KC_KnitOrderJobsModel[]) {
    const tableData: IKnitJobDetails[] = [];
    let sno = 1;
    knitOrderJobs.forEach((orderJob) => {
      orderJob.knitJobs.forEach((job) => {
        job.colorSizeInfo?.forEach(colorSizes => {
          colorSizes.sizeQtys?.forEach(({ size, qty }, index: number) => {
            const tblRow: IKnitJobDetails = {
              serialNo: sno,
              knitGroup: orderJob.knitGroup || "-",
              component: Array.from(
                new Set(
                  job.jobRm?.flatMap(rm => rm.componentNames || [])
                )
              ).join(", ") || "-",
              item: job.jobRm?.map((rm) => rm.itemCode).join(", ") || "-",
              knitJobNumber: job.jobNumber || "-",
              size: size || "-",
              qty: qty || 0,
              color: colorSizes.fgColor || '',
              barcodeInfo: job.barcodeInfo

            };
            sno++;
            tableData.push(tblRow);
          });
        });
      });
    });

    setTblData(tableData);
  }

  function renderTable() {
    return (
      <Table
        bordered
        size='small'
        rowKey={(record) => record.knitJobNumber}
        dataSource={tblData}
        columns={columns}
        scroll={{ x: 'max-content' }}
        style={{ minWidth: '100%' }}
        pagination={{
          pageSize: pageSize,
          onChange(current, pageSize) {
            setPage(current);
            setPageSize(pageSize);
          },
        }} />
    );
  }


  return (
    <Card>
      <Form form={form}>
        <Row gutter={[24, 12]}>
          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item label="Product/Color" name={"product"}>
              <Select onChange={onProductChange} showSearch placeholder='Select product name'
                filterOption={(input, option) => (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())}
              >
                {productInfo && productInfo.length &&
                  productInfo.map((p) => <Option {...p} value={p.productCode + p.fgColor} key={p.productCode + p.fgColor}>{p.productName + "/" + p.fgColor}</Option>)
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button onClick={onSubmit} type='primary'>Submit</Button>
          </Col>
        </Row>
      </Form>
      {
        knitJobs && knitJobs.length ? renderTable() : <Empty description={errorText} />
      }

      <KnitJobBarcodes barcodesData={barcodeData} onClose={() => setShowBarcodeModal(false)} isModalOpen={showBarcodeModal} printBarCodes={() => { }} />
      <Modal
        title={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Job Sheet Details</span>
          <Button style={{ marginRight: '20px' }} type='primary' size='small' onClick={printJobSheet}>Print</Button>
        </div>}
        open={isJobSheetModalVisible}
        onCancel={() => setIsJobSheetModalModalVisible(false)}
        footer={null}
        width={'100%'}
        style={{ top: '0' }}
        destroyOnClose
        maskClosable={false}>
        <KnitJobSheet jobNumber={selectedJobNumber} />
      </Modal>
    </Card>
  )
}
