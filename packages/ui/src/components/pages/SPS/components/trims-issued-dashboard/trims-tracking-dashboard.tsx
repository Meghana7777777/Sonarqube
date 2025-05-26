import { GBSectionRequest, GetAllSectionsResDto, ProcessTypeEnum, processTypeEnumDisplayValues } from '@xpparel/shared-models';
import { GbConfigHelperService } from '@xpparel/shared-services';
import { AutoComplete, Card, Col, Form, Input, Row, Select, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useEffect, useState } from 'react';
import TrimsSectionCard from './trims-section';

const excludeProcessTypes = [ProcessTypeEnum.CUT, ProcessTypeEnum.KNIT, ProcessTypeEnum.LAY, ProcessTypeEnum.PACK];
const TrimsTrackingDaskBoard = () => {
  const { Option } = Select;
  const user = useAppSelector((state) => state.user.user.user);
  const [selectedJobNo, setSelectedJobNo] = useState<string | null>(null);
  const gbcService = new GbConfigHelperService();
  const [sectionData, setSectionData] = useState<GetAllSectionsResDto[]>();
  const [processTypes, setProcessTypes] = useState<ProcessTypeEnum[]>([]);
  const [selectedProcessType, setSelectedProcessType] = useState<ProcessTypeEnum>(undefined);
  const [options, setOptions] = useState([]);
  const [allJobNumbers, setAllJobNumbers] = useState([]);
  const [formRef] = useForm();
  useEffect(() => {
    const processTypesP = Object.values(ProcessTypeEnum).filter(processType => !excludeProcessTypes.includes(processType));
    setProcessTypes(processTypesP);
  }, [])

  const getAllSectionsByDepartmentsFromGbC = (processType: ProcessTypeEnum) => {
    setSelectedProcessType(processType);
    setOptions([]);
    setAllJobNumbers([]);
    setSelectedJobNo(undefined);
    formRef.setFieldValue('jobNumber', '')
    if (!processType) {
      setSectionData([]);
      return;
    }
    const request = new GBSectionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, [processType])
    try {
      gbcService.getAllSectionsByDepartmentsFromGbC(request).then(res => {
        if (res.status) {
          setSectionData(res.data);
        } else {
          setSectionData([]);
        }
      })
    } catch (err) {
      setSectionData([]);
      AlertMessages.getErrorMessage(err.message);
    }
  }

  const changeJobNumber = (val: string) => {
    if (!val) {
      setSelectedJobNo(undefined)
    }
  }
  const selectJobNumber = (val: string) => {
    setSelectedJobNo(val)
    const targetElement = document.querySelector(`[job-number="${val}"]`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  const getJobsFromUi = () => {
    // Get all divs with the custom attribute job-number
    const divs = document.querySelectorAll('div[job-number]');
    const jobNumbers = Array.from(divs).map(div => div.getAttribute('job-number'));
    setAllJobNumbers(jobNumbers);
    return jobNumbers;
  }

  const handleSearch = (value) => {
    const data = allJobNumbers.length > 0 ? allJobNumbers : getJobsFromUi();
    const filtered = data
      .filter(job => job.toLowerCase().includes(value.toLowerCase()))
      .map(job => ({ value: job }));
    setOptions(filtered);
  };

  return (
    <div>
      <Card size='small' className="custom-main-card" headStyle={{ backgroundColor: '#01576f' }} title={<span style={{ display: 'flex', justifyContent: 'center', color: 'white' }}>Issuance Dashboard</span>} style={{ minHeight: '100vh' }}>
      <Form layout="horizontal" form={formRef} style={{ margin: '10px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={9} lg={7} xl={6}>
          <Form.Item label="Section Type" style={{ margin: '0px', padding: '0px' }}>
            <Select
              placeholder="Select Section Type"
              onChange={(value) => getAllSectionsByDepartmentsFromGbC(value)}
              allowClear
            >
              {processTypes.map((key) => (
								<Option key={key} value={key}>
									{processTypeEnumDisplayValues[key]}
								</Option>
							))}
            </Select>
          </Form.Item>
          </Col>
           <Col xs={24} sm={24} md={9} lg={7} xl={6}>
          <Form.Item label="Job Number" name='jobNumber' style={{ margin: '0px', padding: '0px' }}>
            <AutoComplete
              options={options}
              onSearch={handleSearch}
              placeholder="Type job number"
              allowClear
              onClear={() => setSelectedJobNo(undefined)}
              onChange={changeJobNumber}
              onSelect={selectJobNumber}
            >
              <Input />
            </AutoComplete>
          </Form.Item>
          </Col>
          </Row>
        </Form>
        <div className="planning-legend" style={{ marginTop: '5px' }}>
          <div className="legend-item">
            <Tag style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} >
              <span style={{ width: '13px', height: '13px', backgroundColor: 'gray', borderRadius: '50%', display: 'inline-block' }}></span>Open RM Requests</Tag>
            <Tag style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <span style={{ width: '13px', height: '13px', backgroundColor: 'orange', borderRadius: '50%', display: 'inline-block', }}></span>Partially Issued RM Requests</Tag>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {sectionData?.map(secObj =>
            <TrimsSectionCard
              sectionObj={secObj}
              selectedJobNo={selectedJobNo}
            />
          )}
        </Row>
      </Card>
    </div>
  );
};

export default TrimsTrackingDaskBoard;
