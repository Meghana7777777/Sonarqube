import { IPS_R_LocationJobsModel, ProcessTypeEnum, processTypeEnumDisplayValues } from '@xpparel/shared-models';
import { Descriptions, Modal, Popover } from 'antd';
import React, { useState } from 'react';
import WMSStrimDashboardPopup from '../../../WMS/strim-dashboard/wms-dashboard/wms-strim-popup.component';

interface JobShapeProps {
  job: IPS_R_LocationJobsModel;
  refreshUI: () => void;
  selectedJobNo: string;
}
interface TrimsSheetProps {
  jobNo: string;
  setSheetVisible: (visible: boolean) => void;
}

const TrimsJobShape: React.FC<JobShapeProps> = ({ job, selectedJobNo, refreshUI }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jobNoAndPt, setJobNoAndPt] = useState<{ jobNumber: string; processType: ProcessTypeEnum } | null>(null);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const handleJobClick = (jobNumber: string, processType: ProcessTypeEnum) => {
    setIsModalVisible(true);
    setJobNoAndPt({ jobNumber, processType });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setJobNoAndPt(null)
    if (isChanged) {
      refreshUI();
    }
  };

  return <>
    {job.jobs.map((jobD, index) => {
      const generatePopoverContent = (jobD) => (
        <div style={{ width: '100%' }}>
          <Descriptions
            title={<>Job No: {jobD.jobNumber}</>}
            bordered
            column={3}
            style={{ textAlign: 'start', padding: '0px' }}
            // labelStyle={{ width: '10%' }}
            // contentStyle={{ width: '10%' }}
          >
            <Descriptions.Item label="PO Serial">{jobD.procSerial}</Descriptions.Item>
            <Descriptions.Item label="Product Code">{jobD.productCode}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{jobD.quantity}</Descriptions.Item>
            <Descriptions.Item label="SO Number">{jobD.jobFeatures.soNo[0]}</Descriptions.Item>
            <Descriptions.Item label="Destination">{jobD.jobFeatures.destination[0]}</Descriptions.Item>
            <Descriptions.Item label="Dependent Process Type">{processTypeEnumDisplayValues[jobD.depBomItemStatus?.[0]?.depProcType]}</Descriptions.Item>
            <Descriptions.Item label="Dependent Jobs RM Status">{jobD.depBomItemStatus?.[0]?.requestStatus}</Descriptions.Item>
            <Descriptions.Item label="Trim Status">{jobD.trimsStatus?.requestStatus}</Descriptions.Item>
          </Descriptions>
        </div>
      );

      return (
        <>
          <Popover content={generatePopoverContent(jobD)} key={index} mouseEnterDelay={0} mouseLeaveDelay={0}>
            <div onClick={() => handleJobClick(jobD.jobNumber, jobD.processType)} style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="cursor">
              <div className={`status-shape circle ${selectedJobNo === jobD.jobNumber ? 'blink' : ''}`} job-number={jobD.jobNumber} style={{ backgroundColor: jobD.status.status === "OPEN" ? "red" : jobD.status.status === "PARTIALLY_ISSUED" ? "orange" : "gray" }}>
              </div>
            </div>
          </Popover>
          <Modal
            title={<span style={{ display: 'flex', justifyContent: 'center' }}>RM Details (Job Number : {job ? jobNoAndPt?.jobNumber : undefined} )</span>}
            open={isModalVisible}
            onCancel={handleModalClose}
            style={{ top: '0' }}
            width='100%'
          >
            <WMSStrimDashboardPopup jobNumber={jobNoAndPt?.jobNumber} updateChanges={e => setIsChanged(e)} processType={jobNoAndPt?.processType} />
          </Modal>
        </>
      );
    })}
  </>
};

export default TrimsJobShape;
