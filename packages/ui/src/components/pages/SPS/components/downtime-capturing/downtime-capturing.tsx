import { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Button, Row, Col, Input } from 'antd';
import { DowntimeSharedService, ModuleSharedService, ReasonsService, SectionSharedService, WorkStationService } from "@xpparel/shared-services";
import { CommonRequestAttrs, DowntimeRequest, ModuleModel, ModuleSectionRequest, ReasonModel, SectionModel, WorkstationModel, WorkstationModuleRequest, WsDowntimeStatusEnum } from '@xpparel/shared-models';
import { AlertMessages } from './../../../../../components/common';
import { useAppSelector } from './../../../../../common';
import './capturing.css'
import dayjs from 'dayjs';

const { Option } = Select;

const DowntimeCaptureComponent = () => {
  const [form] = Form.useForm();
  const [sections, setSections] = useState<SectionModel[]>([]);
  const [modules, setModules] = useState<ModuleModel[]>([]);
  const [workstations, setWorkstations] = useState<WorkstationModel[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [reasonData, setReasonData] = useState<ReasonModel[]>([]);
  const service = new DowntimeSharedService()
  const reasonService = new ReasonsService();

  const user = useAppSelector((state) => state.user.user.user);

  const sectionService = new SectionSharedService()
  const moduleService = new ModuleSharedService()
  const workstationService = new WorkStationService()

  // Date validation functions
  const disableFutureDate = (current: dayjs.Dayjs) => {
    return current && current > dayjs();
  };

  const getAllReasons = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    reasonService.getAllReasons(obj).then(res => {
      if (res.status) {
        setReasonData(res.data);
      }
    }).catch(err => {
      console.log(err.message)
    })
  }

  useEffect(() => {
    const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
    sectionService.getAllSections(reqObj).then((response) => {
      setSections(response.data);
    }).catch((error) => {
      return error;
    })

    getAllReasons()
  }, []);

  useEffect(() => {
    if (selectedSection) {
      const reqobj2 = new ModuleSectionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, selectedSection)
      moduleService.getModulesBySectionCode(reqobj2).then((response) => {
        setModules(response.data);
      }).catch((error) => {
        return error;
      })
    } else {
      setModules([]);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedModule) {
      const reqobj3 = new WorkstationModuleRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, selectedModule)
      workstationService.getWorkstationsByModuleCode(reqobj3).then((response) => {
        setWorkstations(response.data);
      }).catch((error) => {
        return error;
      })
    } else {
      setWorkstations([]);
    }
  }, [selectedModule]);

  const handleSectionChange = (sectionCode: string) => {
    setSelectedSection(sectionCode);
    setSelectedModule(null);
    form.resetFields(['moduleCode', 'workstationCode']);
  };

  const handleModuleChange = (moduleCode: string) => {
    setSelectedModule(moduleCode);
    form.resetFields(['workstationCode']);
  };

  const onFinish = async (values: any) => {
    const { startTime, endTime, reason, remarks, workstationCode } = values;

    const selectedWorkstation = workstations.find(ws => ws.wsCode === workstationCode);
    const workstationId = selectedWorkstation ? selectedWorkstation.id : null;

    const status = endTime ? WsDowntimeStatusEnum.ACTIVE : WsDowntimeStatusEnum.IN_ACTIVE;

    const req = new DowntimeRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.user?.userId,
      String(workstationId),
      workstationCode,
      selectedModule,
      reason,
      startTime?.toISOString(),
      endTime ? endTime.toISOString() : null,
      null,
      status,
      remarks || ''
    );

    service.createDownTime(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage('Downtime Created Successfully');
          form.resetFields();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };

  return (
    <div style={{ marginLeft: 'calc(10% + 50px)' }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16} style={{ gap: '27px' }}>
          <Col span={6}>
            <Form.Item
              name="sectionCode"
              label="Section"
              rules={[{ required: true, message: 'Please select a section' }]}
            >
              <Select placeholder="Select Section" onChange={handleSectionChange} allowClear>
                {sections?.map((section) => (
                  <Option key={section.secCode} value={section.secCode}>
                    {section.secName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="moduleCode"
              label="Module"
              rules={[{ required: true, message: 'Please select a module' }]}
            >
              <Select placeholder="Select Module" onChange={handleModuleChange} disabled={!selectedSection} allowClear>
                {modules?.map((module) => (
                  <Option key={module.moduleCode} value={module.moduleCode}>
                    {module.moduleName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="workstationCode"
              label="Workstation"
              rules={[{ required: true, message: 'Please select a workstation' }]}
            >
              <Select placeholder="Select Workstation" disabled={!selectedModule}>
                {workstations?.map((workstation) => (
                  <Option key={workstation.id} value={workstation.wsCode}>
                    {workstation.wsName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ gap: '27px' }}>
          <Col span={6}>
            <Form.Item
              name="reason"
              label="Downtime Reason"
              rules={[{ required: true, message: 'Please select downtime reason' }]}
            >
              <Select placeholder="Select Reason" allowClear>
                {reasonData.map((key) => (
                  <Option key={key.id} value={`${key.reasonCode} - ${key.reasonName}`}>
                    {`${key.reasonCode}-${key.reasonName}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="startTime"
              label="Start Time"
              rules={[{ required: true, message: 'Please select start time' }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD   HH:mm:ss"
                placeholder="Select Start Time"
                className="custom-datepicker"
                disabledDate={disableFutureDate}
                style={{
                  width: '100%',
                  fontSize: '16px',
                  fontWeight: '500',
                  borderRadius: '4px',
                }}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="endTime"
              label="End Time"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startTime = getFieldValue('startTime');
                    if (value && startTime && value.isBefore(startTime)) {
                      return Promise.reject('End Time must be later than Start Time');
                    }
                    if (value && value.isAfter(dayjs())) {
                      return Promise.reject('End Time cannot be in the future');
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD   HH:mm:ss"
                placeholder="Select End Time"
                className="custom-datepicker"
                disabledDate={disableFutureDate}
                style={{
                  width: '100%',
                  fontSize: '16px',
                  fontWeight: '500',
                  borderRadius: '4px',
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={19}>
            <Form.Item
              name="remarks"
              label="Remarks"
              rules={[{ required: false, message: 'Please add any remarks if necessary' }]}
            >
              <Input.TextArea placeholder="Enter remarks" rows={4} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginLeft: 'calc(20% + 50px)' }}>
          <Button type="primary" htmlType="submit">
            Record Downtime
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DowntimeCaptureComponent;