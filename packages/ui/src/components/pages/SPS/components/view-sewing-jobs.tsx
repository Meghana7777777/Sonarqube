
import { ClockCircleOutlined, EyeOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BarcodeDetails, DeleteSewingJobsRequest, JobLine, JobSewSerialReq, PJ_ProcessingSerialRequest, PJ_ProcessingTypesResponseModel, SewingJobBatchDetails, SewSerialRequest } from "@xpparel/shared-models";
import { ProcessingJobsService } from "@xpparel/shared-services";
import { Button, Collapse, Input, Modal, Popconfirm, Table, Tabs, Tag } from "antd";
import { TabsProps } from "antd/lib";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { getCssFromComponent } from "../../WMS";
import { IpsDashboardPopup } from "../../WMS/strim-dashboard/ips-dashboard/ips-strim-popup.component";
import { sewingCreationDisplayName } from "../sewing-job-gen/support";
import Barcode4X2 from "./barcode";
import JobSheet from "./job-sheet";
import "./view-sewing-jobs.css";


// getProcessingJobsInfoForProcessingType
interface ComponentProps {
  poSerial: number;
  onStepChange?: (step: number, po: SewSerialRequest) => void;
  processJobGroupData: PJ_ProcessingTypesResponseModel
}

const { Search } = Input;
const { Panel } = Collapse;

const ViewSewingJobs = (props: ComponentProps) => {

  const [selectedBarcode, setSelectedBarcode] = useState<BarcodeDetails[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobNoData, setJobNoData] = useState("");
  const [sewingJobData, setSewingJobData] = useState<SewingJobBatchDetails[] | null>(null);
  const [groupedSewingJobData, setGroupedSewingJobData] = useState<Record<string, SewingJobBatchDetails[]>>({});
  const [uniqueProcessTypes, setUniqueProcessTypes] = useState<string[]>(null)
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false)
  const [selectedJobs, setSelectedJobs] = useState<string[]>(null)
  const [sizeWiseQtys, setSizeWiseQtys] = useState<any>(null)
  const user = useAppSelector((state) => state.user.user.user);
  const processingJobsService = new ProcessingJobsService();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJobNo, setSelectedJobNo] = useState<string | null>(null);

  useEffect(() => {
    if (!props.poSerial) return;

    fetchSewingJobData();
  }, [props.poSerial]);


  const fetchSewingJobData = async () => {
    try {
      const req = new PJ_ProcessingSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId,
        props.poSerial, props.processJobGroupData.processType);
      const res = await processingJobsService.getProcessingJobsInfoForProcessingType(req);
      if (res.status) {
        setSewingJobData(res.data);
        groupByProcessType(res.data)
      } else {
        setSewingJobData([]);
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  };

  function groupByProcessType(data: SewingJobBatchDetails[]) {
    const groupedData: Record<string, SewingJobBatchDetails[]> = {};
    const uniqueProcessTypes: string[] = [];

    if (data && data.length) {

      data.forEach((job) => {
        const processType = job.processType;

        // Add to the groupedData object
        if (!groupedData[processType]) {
          groupedData[processType] = [];
          uniqueProcessTypes.push(processType); // Collect unique processType
        }

        groupedData[processType].push(job);
      });
      setGroupedSewingJobData(groupedData)
      setUniqueProcessTypes(uniqueProcessTypes)
    }
  }

  const fetchBarcodeDetails = async (jobNo: string) => {
    const barcodeObj = new JobSewSerialReq(user?.userName, user?.user?.userId, user?.orgData?.unitCode, user?.orgData?.companyCode, jobNo, props.poSerial, false)
    try {
      const barcodeRes = await processingJobsService.getBarcodeDetailsByJobNumber(barcodeObj);
      if (barcodeRes.status) {
        setSelectedBarcode(barcodeRes.data);
      } else {
        setSelectedBarcode([]);
        AlertMessages.getErrorMessage(barcodeRes.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  };


  const handleBarcodeClick = (jobLine) => {
    fetchBarcodeDetails(jobLine.jobNo)
    setIsModalOpen(true);
  };

  const filteredData = sewingJobData?.filter((batch) =>
    batch.jobDetails.some((job) => job.jobNo.toLowerCase().includes(jobNoData.toLowerCase()))
  ) || [];


  const collapseHeader = (batch: SewingJobBatchDetails) => {
    const formattedDate = new Date(batch.jobsGeneratedAt).toISOString();

    const handleDeleteClick = async () => {
      try {
        const req = new DeleteSewingJobsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, batch.sewingJobBatchNo);
        const res = await processingJobsService.deleteProcessingJobs(req);
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          fetchSewingJobData();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      } catch (err) {
        AlertMessages.getErrorMessage(err.message);
      }
    };

    const handlePrintClick = () => {
      const sizeWiseQtys = getUniqueSizesWithQuantities(batch.jobDetails)
      setSizeWiseQtys(sizeWiseQtys)
      setShowPrintModal(true)
      setSelectedJobs(batch.jobDetails.map((v) => v.jobNo))
    }

    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span> Batch No: <Tag color="black"> {batch.sewingJobBatchNo}</Tag> </span>
          <span> Jobs Generated At: <Tag color="black">  {`${formattedDate.split('T')[0]}      ${formattedDate.split('T')[1].split('Z'[0])}`}</Tag> </span>
          {(() => {
            let parsedGroupInfo = null;
            try {
              parsedGroupInfo = JSON.parse(batch.groupInfo);
            } catch (error) {
              console.error("Invalid JSON string:", error);
            }
            return parsedGroupInfo && Object.entries(parsedGroupInfo).length > 0 ? (
              Object.entries(parsedGroupInfo).map(([key, value]) => {
                if (key === 'mo_product_sub_line_id') {
                  return <></>
                }
                return (<span key={key} style={{ display: 'inline-block', marginRight: '10px' }}>
                  {sewingCreationDisplayName[key]}: <Tag color="black">{value.toString()}</Tag>
                </span>)
              })
            ) : (
              <></>
            );
          })()}
          <span> Multi-Color: <Tag color="black"> {batch.multiColor ? "Yes" : "No"} </Tag> </span>
          <span> Multi-Size: <Tag color="black"> {batch.multiSize ? "Yes" : "No"} </Tag> </span>
          <span> Qty: <Tag color="black"> {batch.sewingJobQty}</Tag> </span>
          {/* <span> Logical Bundle Qty: <Tag color="black"> {batch.logicalBundleQty}</Tag> </span> */}
          {/* <Progress size="small" status="active" trailColor="#dadada" format={(percent) => <span style={{ color: "white" }}>{percent}%</span>} style={{ width: "100px" }} percent={batch.progress} /> */}
        </div>
        <Button onClick={handlePrintClick} style={{ marginLeft: 10, width: "60px", height: "25px" }} >
          <span style={{ display: "flex", justifyContent: "center", marginTop: "-4px" }}> Print </span>
        </Button>
        <Popconfirm
          title={`Are you sure you want to delete ?`}
          onConfirm={(e) => {
            e.stopPropagation();
            handleDeleteClick();
          }}
          onCancel={(e) => {
            e.stopPropagation();
          }}
          okText="Yes"
          cancelText="No">
          <Button danger onClick={(e) => e.stopPropagation()} style={{ marginLeft: 10, width: "60px", height: "25px" }} >
            <span style={{ display: "flex", justifyContent: "center", marginTop: "-4px" }}> Delete </span>
          </Button>
        </Popconfirm>
      </div>
    );
  };

  const getUniqueSizes = (jobLines: JobLine[]) => {
    const sizes = new Set<string>();

    jobLines?.forEach(jobLine => {
      jobLine?.subLines?.forEach(subLine => {
        sizes.add(subLine?.size);
      });
    });

    return Array.from(sizes);
  };
  const uniqueSizes = getUniqueSizes(filteredData?.flatMap((it) => (it.jobDetails)))

  const generateSizeColumns = (sizes: string[]) => {
    return sizes.map(size => ({
      title: size,
      dataIndex: 'subLines',
      key: size,
      width: 60,
      render: (subLines: any[]) => {
        const sizeWiseQuantities: { [size: string]: number } = {};

        subLines?.forEach((line) => {
          if (line.size === size) {
            if (sizeWiseQuantities[size]) {
              sizeWiseQuantities[size] += line.quantity;
            } else {
              sizeWiseQuantities[size] = line.quantity;
            }
          }
        });

        return sizeWiseQuantities[size] || '-';
      },
    }));
  };

  const jobLineColumns = [
    {
      title: "Routing Job No",
      dataIndex: "jobNo",
      key: "jobNo",
      fixed: "left" as const,
      width: 100,
      render: (jobNo: string) => (
        <a
          onClick={() => {
            setSelectedJobNo(jobNo);
            setIsJobModalOpen(true);
          }}
          style={{ color: '#1890ff', cursor: 'pointer' }}
        >
          {jobNo}
        </a>
      ),
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
      width: 70,
      fixed: "left" as const,
      render: (jobLine, record) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button className="barcode-btn"
            size="small"
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => handleBarcodeClick(record)}
          >
          </Button>
        </div>
      ),
    },
    {
      title: "Total SMV",
      dataIndex: "totalSmv",
      key: "totalSmv",
      width: 90,
      fixed: "left" as const, render: (totalSmv: number) => { return <span><ClockCircleOutlined /> {totalSmv} </span>; },
    },
    {
      title: "Module No",
      dataIndex: "moduleNo",
      key: "moduleNo",
      width: 90,
      fixed: "left" as const, render: (moduleNo: string) => <Tag color="blue">{moduleNo}</Tag>
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      fixed: "left" as const,
    },
    {
      title: "Color",
      key: "fgColor",
      width: 100,
      fixed: "left" as const,
      render: (_, record) => {
        const colors = record.subLines
          ?.map(s => s.fgColor)
          .filter(Boolean);

        const uniqueColors = Array.from(new Set(colors));

        return uniqueColors.length ? uniqueColors.join(', ') : '-';
      }
    },
    ...generateSizeColumns(uniqueSizes)
  ];

  const generateTabItem = (): TabsProps['items'] => {
    if (!uniqueProcessTypes) {
      return []
    }
    return uniqueProcessTypes.map((v) => ({
      key: v,
      label: v + " JOBS",
      children: <Collapse
        accordion
        expandIconPosition="end"
        expandIcon={({ isActive }) => (isActive ? <MinusOutlined /> : <PlusOutlined />)}
      >
        {groupedSewingJobData[v]?.map((batch, index) => (
          <Panel header={collapseHeader(batch)} key={index}>
            <Table
              size="small"
              columns={jobLineColumns}
              dataSource={batch.jobDetails?.map((job, jobIndex) => ({ ...job, key: jobIndex }))}
              pagination={false}
              scroll={{ x: "1200px", y: 400 }}
              bordered
            />
          </Panel>
        ))}
      </Collapse>,
    }))

  }

  const getUniqueSizesWithQuantities = (jobLines: JobLine[]) => {
    const sizeMap: Record<string, number> = {};
    jobLines?.forEach((jobLine) => {
      jobLine?.subLines?.forEach((subLine) => {
        const size = subLine.size;
        const quantity = subLine.quantity;
        if (sizeMap[size]) {
          sizeMap[size] += quantity;
        } else {
          sizeMap[size] = quantity;
        }
      });
    });

    return Object.entries(sizeMap).map(([size, totalQuantity]) => ({
      size,
      totalQuantity,
    }));
  };

  const handlePrintJobSheet = () => {
    const divContents = document.getElementById('jobSheetId').innerHTML;
    const element = window.open('', '', 'height=700, width=1024');
    element.document.write(divContents);
    getCssFromComponent(document, element.document);
    element.document.close();
    setTimeout(() => {
      element.print();
      element.close();
    }, 1000);
  }

  return (
    <div>
      <div style={{ padding: '10px' }}>
        <Tabs items={generateTabItem()} />
      </div>
      {selectedBarcode && (
        <Barcode4X2
          barcodesData={selectedBarcode}
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          printBarCodes={() => console.log("Print Barcodes")}
        />
      )}
      <Modal title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button size="small" type="primary" onClick={handlePrintJobSheet} style={{ marginRight: 20 }}>
            Print
          </Button>
        </div>
      } open={showPrintModal} onCancel={() => setShowPrintModal(false)} closable footer={false} width={'90%'}>
        <JobSheet jobDetails={groupedSewingJobData} />
      </Modal>
      <Modal
        title="Job Details"
        open={isJobModalOpen}
        onCancel={() => setIsJobModalOpen(false)}
        footer={null}
        width='100%'
      >
        {selectedJobNo && <IpsDashboardPopup jobNumber={selectedJobNo} processType={sewingJobData[0].processType} updateChanges={() => { }} iNeedActionItems={false} />}
      </Modal>

    </div>
  );
};

export default ViewSewingJobs;
