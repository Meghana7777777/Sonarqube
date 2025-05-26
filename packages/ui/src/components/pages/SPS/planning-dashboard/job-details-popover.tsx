import { ColorSizeCutPanelInfo, IPS_R_JobModel, IPS_R_LocationJobsModel, ProcessTypeEnum, SequencedIJobOperationModel, SewingIJobNoRequest, TrimStatusEnum, processTypeEnumDisplayValues } from '@xpparel/shared-models';
import { Badge, Button, Card, Descriptions, Modal, Popover, Progress, Tag, Timeline, Tooltip } from 'antd';
import React, { useState } from 'react';
import { IpsDashboardPopup } from '../../WMS/strim-dashboard/ips-dashboard/ips-strim-popup.component';
import DocketSheet from './cut-docket-details';
import { useAppSelector } from 'packages/ui/src/common';
import { SewingJobPlanningService } from '@xpparel/shared-services';
import './sewing-job-tracking.css';

const backgroundColorObj = {
  [TrimStatusEnum.OPEN]: 'gray',
  [TrimStatusEnum.ISSUED]: 'orange',
  [TrimStatusEnum.NR]: 'transparent',
  [TrimStatusEnum.PARTIALLY_ISSUED]: 'orange',
  [TrimStatusEnum.REQUESTED]: 'green',
}
interface JobShapeProps {
  job: IPS_R_LocationJobsModel;
  refreshUI: () => void;
  selectedJobNo: string;
}

const JobShape: React.FC<JobShapeProps> = ({ job, selectedJobNo, refreshUI }) => {
  const redDotStyle: React.CSSProperties = { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'red', position: 'absolute', top: '-2px', right: '-2px' };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState<boolean>(false);
  const [jobNoAndPt, setJobNoAndPt] = useState<{ jobNumber: string; processType: ProcessTypeEnum } | null>(null);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user.user.user);
  const ipsService = new SewingJobPlanningService();
  const [operationsData, setOperationsData] = useState<SequencedIJobOperationModel[]>([]);
  const [operationsModalVisible, setOperationsModalVisible] = useState(false);

  const handleOpenOperationsModal = async () => {
    if (jobNoAndPt?.jobNumber) {
      await getSequencedOperationsByJobId(jobNoAndPt.jobNumber);
      setOperationsModalVisible(true);
    }
  };



  const getSequencedOperationsByJobId = async (jobNumber: string) => {
    try {
      const req = new SewingIJobNoRequest(user.user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber)
      const res = await ipsService.getSequencedOperationsByJobId(req);
      if (res.status) {
        setOperationsData(res.data)
      }
    } catch (err) {
      err.message
    }
  }

  const handleJobClick = (jobNumber: string, processType: ProcessTypeEnum) => {
    setIsModalVisible(true);
    setJobNoAndPt({ jobNumber, processType });

  };


  const handleModalClose = () => {
    setIsModalVisible(false);
    setJobNoAndPt(null);
    if (isChanged) {
      refreshUI();
    }
  };

  const handleModalCloseAndRefresh = () => {
    setIsModalVisible(false);
    refreshUI();
  };

  const renderBox = (dependentJobStatus: TrimStatusEnum, trimStatus: TrimStatusEnum, wipQty: number) => {
    let isDisplayTwoBoxes = true;
    if (dependentJobStatus == TrimStatusEnum.NR || trimStatus == TrimStatusEnum.NR || (dependentJobStatus == TrimStatusEnum.ISSUED && trimStatus == TrimStatusEnum.ISSUED)) {
      isDisplayTwoBoxes = false;
    }
    return isDisplayTwoBoxes ? <><div style={{ position: 'absolute', width: "100%", height: "100%" }}>
      <div className="completion-percentage" style={{ fontSize: '10px', color: 'white', display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}><span>{wipQty}</span></div>
    </div>
      <div style={{ width: "100%", height: "50%", background: backgroundColorObj[dependentJobStatus] }}></div>
      <div style={{ width: "100%", height: "50%", background: backgroundColorObj[trimStatus] }}></div></> : // Or--------------------------------------
      <>
        <div style={{ width: "100%", height: "100%" }}>
          <div className="completion-percentage" style={{ fontSize: '10px', color: 'white', display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}><span>{wipQty}</span></div>
        </div>
      </>
  }
  const generatePopoverContent = (jobD: IPS_R_JobModel) => (
    <>
      <Descriptions
        title={<>Job No: {jobD.jobNumber}</>}
        bordered
        column={3}
        size='small'
        style={{ textAlign: 'start', padding: '0px' }}
      // labelStyle={{ width: '10%' }}
      // contentStyle={{ width: '10%' }}
      >
        <Descriptions.Item label="Status"><Tag color='#deac00'>
          {jobD.status.status}
        </Tag></Descriptions.Item>
        {/* <Descriptions.Item label="PO Serial">{jobD.procSerial}</Descriptions.Item> */}
        <Descriptions.Item label="Product Code">{jobD.productCode}</Descriptions.Item>
        <Descriptions.Item label="Quantity">{jobD.quantity}</Descriptions.Item>
        <Descriptions.Item label="SO Number">{jobD.jobFeatures.soNo[0]}</Descriptions.Item>
        <Descriptions.Item label="Destination">{jobD.jobFeatures.destination[0]}</Descriptions.Item>
        <Descriptions.Item label="Dependent Process Type">{processTypeEnumDisplayValues[jobD.depBomItemStatus?.[0]?.depProcType]}</Descriptions.Item>
        <Descriptions.Item label="Dependent Jobs RM Status">{jobD.depBomItemStatus?.[0]?.requestStatus}</Descriptions.Item>
        <Descriptions.Item label="Trim Status">{jobD.trimsStatus?.requestStatus}</Descriptions.Item>
      </Descriptions>
    </>
  );
  return <>
    {job.jobs.map((jobD, index) => {
      const isRejected = jobD.trackingStatus?.some(status => status.rejQty > 0);
      const wipQty = jobD?.status?.wip;
      const shapeClass = `status-shape ${jobD?.status?.shape || ''}`;

      return (
        <>
          <Popover content={generatePopoverContent(jobD)} key={index} mouseEnterDelay={0} mouseLeaveDelay={0}>
            <div onClick={() => handleJobClick(jobD.jobNumber, jobD.processType)} style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }} job-number={jobD.jobNumber} className="cursor">
              <div
                className={`${shapeClass} ${selectedJobNo === jobD.jobNumber ? 'blink' : ''}`}
                style={{
                  backgroundColor: jobD?.status?.color,
                  // display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {renderBox(jobD.depBomStatus?.requestStatus, jobD.trimsStatus?.requestStatus, wipQty)}

              </div>
              {isRejected && <div style={redDotStyle}></div>}
            </div>
          </Popover>
        </>
      );
    })}
    <Modal
      // title={<span style={{ display: 'flex', justifyContent: 'center' }}>Job Number - {jobNoAndPt?.jobNumber}</span>}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ flex: 1, textAlign: 'center' }}>Job Number - {jobNoAndPt?.jobNumber}</span>
          <Button type='primary' size='small' onClick={handleOpenOperationsModal} style={{ marginRight: '1%' }}>Operations</Button>
        </div>
      }

      open={isModalVisible}
      onCancel={handleModalClose}
      footer={null}
      style={{ top: '0' }}
      width='100%'
    >
      <IpsDashboardPopup jobNumber={jobNoAndPt?.jobNumber} updateChanges={e => setIsChanged(e)} processType={jobNoAndPt?.processType} iNeedActionItems={true} />
      {sheetVisible && <DocketSheet setSheetVisible={setSheetVisible} />}
    </Modal>

    <Modal
      title={`Operations - ${jobNoAndPt?.jobNumber}`}
      open={operationsModalVisible}
      onCancel={() => setOperationsModalVisible(false)}
      footer={null}
      width={1000}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <div style={{ width: '100%', maxWidth: 800 }}>
          <Timeline
            mode="alternate"
            style={{ paddingInline: 10 }}
            items={operationsData.map((op, index) => {
              const goodQty = op.goodQty;
              const isZero = goodQty === 0;
              const color = isZero ? '#d1d5db' : '#22c55e';
              const isLeft = index % 2 === 0;

              return {
                label: (
                  <Tooltip title="Operation Sequence">
                    <Badge count={op.operationSequence} style={{ backgroundColor: '#1890ff', color: '#fff', fontWeight: 600, boxShadow: '0 0 0 1px #fff inset' }} />
                  </Tooltip>
                ),
                color,
                dot: (<div style={{ width: 12, height: 12, borderRadius: '50%', background: color, border: `2px solid ${isZero ? '#e5e7eb' : '#dcfce7'}` }} />),
                children: (
                  <Card style={{ marginLeft: isLeft ? 12 : -30, padding: '4px 8px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ gridTemplateColumns: '1fr 1fr', rowGap: 8, columnGap: 12 }}>
                      <div style={{ gridColumn: '1 / -1', marginBottom: 6, display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <strong style={{ fontSize: 14, fontWeight: 600 }}>Good Qty:</strong>{' '}
                          <Tag color={isZero ? 'default' : 'lime'} style={{ fontSize: 14, fontWeight: 'bold', padding: '3px 6px', backgroundColor: isZero ? '#f3f4f6' : '#d9f99d', border: `2px solid ${isZero ? '#d1d5db' : '#16a34a'}`, marginLeft: 6, borderRadius: 6 }}>
                            {goodQty}
                          </Tag>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <strong style={{ fontSize: 14, fontWeight: 600 }}>Rejection Qty:</strong>{' '}
                          <Tag color="red" style={{ fontSize: 14, fontWeight: 'bold', padding: '3px 6px', backgroundColor: '#fee2e2', border: '2px solid #dc2626', marginLeft: 6, borderRadius: 6 }}>
                            {op.rejectionQty}
                          </Tag>
                        </div>
                      </div>
                      <table style={{ minWidth: 200, width: '100%', margin: 0, padding: '10px 0 0 0', borderCollapse: 'collapse' }}>
                        <tr>
                          <td><strong style={{ fontSize: 10, fontWeight: 500 }}>Operation Code:</strong></td>
                          <td><span style={{ fontSize: 9, padding: '1px 4px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>{op.operationCode}</span></td>
                          <td><strong style={{ fontSize: 10, fontWeight: 500 }}>Operation Group:</strong></td>
                          <td><span style={{ fontSize: 9, padding: '1px 4px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>{op.operationGroup}</span></td>
                        </tr>
                        <tr>
                          <td><strong style={{ fontSize: 10, fontWeight: 500 }}>ProcessType:</strong></td>
                          <td><span style={{ fontSize: 9, padding: '1px 4px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>{op.processType}</span></td>
                          <td><strong style={{ fontSize: 10, fontWeight: 500 }}>Input Qty:</strong></td>
                          <td><span style={{ fontSize: 9, padding: '1px 4px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>{op.inputQty}</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '2px 4px' }}><strong style={{ fontSize: 10, fontWeight: 500 }}>Original Qty:</strong></td>
                          <td style={{ padding: '2px 4px' }}><span style={{ fontSize: 9, padding: '1px 4px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>{op.originalQty}</span></td>
                          <td style={{ padding: '2px 4px' }}><strong style={{ fontSize: 10, fontWeight: 500 }}>Open Rejections:</strong></td>
                          <td style={{ padding: '2px 4px' }}><span style={{ fontSize: 9, padding: '1px 4px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>{op.openRejections}</span></td>
                        </tr>
                      </table>
                    </div>
                  </Card>
                ),
              };
            })}
          />
        </div>
      </div>
    </Modal>
  </>
};

export default JobShape;
