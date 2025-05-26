import { useEffect, useState } from 'react';
import { DatePicker, Button, Table, Row, Col, Layout, Modal, Form, Tag, Input, Tooltip, Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { DowntimeSharedService } from '@xpparel/shared-services';
import {  DowntimeData, DowntimeUpdateRequest, WsDowntimeStatusEnum } from '@xpparel/shared-models';
import { useAppSelector } from './../../../../../common';
import moment from 'moment';
import './capturing.css';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import { AlertMessages } from 'packages/ui/src/components/common';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const DowntimeMonitoringComponent = () => {
  const user = useAppSelector((state) => state.user.user.user);
  const service = new DowntimeSharedService();

  const [filteredData, setFilteredData] = useState<DowntimeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DowntimeData | null>(null);
  const [form] = Form.useForm();

  const [moduleCodes, setModuleCodes] = useState<string[]>([]);
  const [wsCodes, setWsCodes] = useState<string[]>([]);
  const [dReasons, setDReasons] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    moduleCode: [],
    wsCode: [],
    dReason: [],
    status: []
  });

  useEffect(() => {
    getDowntimesForLastOneWeek();
  }, []);

  useEffect(() => {
    if (filteredData.length > 0) {
      setModuleCodes([...new Set(filteredData.map(item => item.moduleCode))]);
      setWsCodes([...new Set(filteredData.map(item => item.wsCode))]);
      setDReasons([...new Set(filteredData.map(item => item.dReason))]);
    }
  }, [filteredData]);

  const columns = [
    {
      title: 'Module Code',
      dataIndex: 'moduleCode',
      key: 'moduleCode',
      filters: moduleCodes.map(code => ({ text: code, value: code })),
      filteredValue: filters.moduleCode,
      onFilter: (value: string, record: DowntimeData) => record.moduleCode === value,
    },
    {
      title: 'Workstation Code',
      dataIndex: 'wsCode',
      key: 'wsCode',
      filters: wsCodes.map(code => ({ text: code, value: code })),
      filteredValue: filters.wsCode,
      onFilter: (value: string, record: DowntimeData) => record.wsCode === value,
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: (a: DowntimeData, b: DowntimeData) => moment(a.startTime).unix() - moment(b.startTime).unix(),
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      sorter: (a: DowntimeData, b: DowntimeData) => {
        if (!a.endTime) return 1;
        if (!b.endTime) return -1;
        return moment(a.endTime).unix() - moment(b.endTime).unix();
      },
      render: (text: string) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '---',
    },
    {
      title: 'Downtime Reason',
      dataIndex: 'dReason',
      key: 'dReason',
      filters: dReasons.map(reason => ({ text: reason, value: reason })),
      filteredValue: filters.dReason,
      onFilter: (value: string, record: DowntimeData) => record.dReason === value,
      // render: (dReason, record) => (
      //   <Tooltip
      //     title={
      //       <Card
      //         title="Downtime Details"
      //         bordered={false}
      //         style={{ width: 300 }}
      //       >
      //         <p><strong>Reason:</strong> {record.dReason}</p>
      //         <p><strong>Remarks:</strong> {record.remarks}</p>
      //         <p><strong>Duration:</strong> {record.duration}</p>
      //       </Card>
      //     }
      //     overlayStyle={{ maxWidth: '320px', wordBreak: 'break-word' }}
      //   >
      //     <span style={{ cursor: 'pointer', color: '#1890ff' }}>
      //       {dReason}
      //     </span>
      //   </Tooltip>
      // ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: WsDowntimeStatusEnum.ACTIVE },
        { text: 'Inactive', value: WsDowntimeStatusEnum.IN_ACTIVE }
      ],
      filteredValue: filters.status,
      onFilter: (value: string, record: DowntimeData) => record.status === value,
      render: (status) => (
        <Tag color={status === WsDowntimeStatusEnum.ACTIVE ? 'red' : 'green'}>
          {status === WsDowntimeStatusEnum.ACTIVE ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      sorter: (a: DowntimeData, b: DowntimeData) => {
        const getDuration = (record: DowntimeData) => {
          if (!record.endTime) return 0;
          return moment(record.endTime).diff(moment(record.startTime));
        };
        return getDuration(a) - getDuration(b);
      },
      render: (_: any, record: DowntimeData) => {
        if (!record.endTime) {
          return <Text style={{ color: '#bfbfbf' }}>-</Text>;
        }

        const startTime = moment(record.startTime);
        const endTime = moment(record.endTime);
        const duration = moment.duration(endTime.diff(startTime));
        let durationString = '';

        if (duration.asHours() < 24) {
          const hours = Math.floor(duration.asHours());
          const minutes = Math.floor(duration.minutes());
          durationString = `${hours} hr ${minutes} min`;
        } else {
          const days = Math.floor(duration.asDays());
          const hours = Math.floor(duration.hours());
          const minutes = Math.floor(duration.minutes());
          durationString = `${days} day ${hours} hr ${minutes} min`;
        }

        return (
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#1890ff',
              backgroundColor: '#f0f7ff',
              borderRadius: '8px',
              padding: '5px 10px',
              display: 'inline-block',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {durationString}
          </Text>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: DowntimeData) => (
        <Button
          type="primary"
          onClick={() => handleEdit(record)}
          icon={<EditOutlined />}
          disabled={record.status===WsDowntimeStatusEnum.IN_ACTIVE}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleFilter = (dates: any) => {
    if (!dates || !dates[0] || !dates[1]) {
      AlertMessages.getErrorMessage("Please select a valid date range.");
      return;
    }

    const [startDate, endDate] = dates;
    const formattedStartDate = `${startDate.format('YYYY-MM-DD')}T00:00:00.000Z`;
    const formattedEndDate = `${endDate.format('YYYY-MM-DD')}T23:59:59.000Z`;
    // const reqObj = new DateRangeRequest(
    //   user?.userName,
    //   user?.orgData?.unitCode,
    //   user?.orgData?.companyCode,
    //   user?.userId,
    //   formattedStartDate,
    //   formattedEndDate
    // );

    setLoading(true);
    // todo:getDownTimeByDateRange

    // service.getDownTimeByDateRange(reqObj)
    //   .then((response) => {
    //     const data = response?.data || [];
    //     if (data.length > 0) {
    //       // Sort data by start time in ascending order
    //       const sortedData = [...data].sort((a, b) => 
    //         moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
    //       );
    //       setFilteredData(sortedData);
    //     } else {
    //      AlertMessages.getErrorMessage('No downtime data found for the selected range.');
    //       setFilteredData([]);
    //     }
    //   })
    //   .catch((error) => {
    //     AlertMessages.getErrorMessage('Failed to fetch downtime data.');
    //     setFilteredData([]);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  const handleEdit = (record: DowntimeData) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      endTime: record.endTime ? moment(record.endTime) : null,
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = new DowntimeUpdateRequest(
          user?.userName,
          user?.orgData?.unitCode,
          user?.orgData?.companyCode,
          user?.userId,
          selectedRecord?.id,
          values.endTime?.toISOString(),
          values.description
        );

        service.updateDowntime(payload)
          .then(() => {
            AlertMessages.getSuccessMessage('Downtime record updated successfully!');
            setIsModalVisible(false);
            getDowntimesForLastOneWeek();
          })
          .catch((error) => {
            AlertMessages.getErrorMessage('Failed to update downtime record.');
            console.error(error);
          });
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const disableFutureDate = (current: dayjs.Dayjs) => {
    return current && current > dayjs();
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setFilters(filters);
  };

  const getDowntimesForLastOneWeek = () => {
    const endDate = moment();
    const startDate = moment().subtract(7, 'days');

    const formattedStartDate = startDate.format('YYYY-MM-DD') + 'T00:00:00.000Z';
    const formattedEndDate = endDate.format('YYYY-MM-DD') + 'T23:59:59.000Z';
    // todo:

    // const reqObj = new DateRangeRequest(
    //   user?.userName,
    //   user?.orgData?.unitCode,
    //   user?.orgData?.companyCode,
    //   user?.userId,
    //   formattedStartDate,
    //   formattedEndDate
    // );

    setLoading(true);
    // todo:getDownTimeByDateRange

    // service.getDownTimeByDateRange(reqObj)
    //   .then((response) => {
    //     const data = response?.data || [];
    //     if (data.length > 0) {
    //       const sortedData = [...data].sort((a, b) => 
    //         moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
    //       );
    //       setFilteredData(sortedData);
    //     } else {
    //       AlertMessages.getInfoMessage('No downtime data found for the last week.');
    //       setFilteredData([]);
    //     }
    //   })
    //   .catch((error) => {
    //    AlertMessages.getErrorMessage('Failed to fetch downtime data.');
    //     console.error(error);
    //     setFilteredData([]);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  const resetAllFilters = () => {
    setFilters({
      moduleCode: [],
      wsCode: [],
      dReason: [],
      status: []
    });
    getDowntimesForLastOneWeek();
  };

  return (
    <Layout style={{ padding: '20px' }}>
      <Row gutter={16}>
        <Col span={6}>
          <RangePicker
            format="YYYY-MM-DD"
            onChange={handleFilter}
            allowClear
            className="custom-datepicker"
          />
        </Col>
        <Col span={1}></Col>
        <Col span={5}>
          <Button
            type="primary"
            onClick={resetAllFilters}
            style={{ marginBottom: '20px' }}
          >
            Reset Filters
          </Button>
        </Col>
      </Row>

      <Table
        size='small'
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
        onChange={handleTableChange}
      />

      <Modal
        title="Edit Downtime Record"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            endTime: null,
            dReason: null
          }}
        >
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[
              { required: true, message: 'Please select an end time!' },
              {
                validator: (_, value) => {
                  if (value && selectedRecord?.startTime) {
                    const startTime = moment(selectedRecord.startTime);
                    if (value.isBefore(startTime)) {
                      return Promise.reject('End time must be later than start time!');
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={disableFutureDate}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Enter a description (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default DowntimeMonitoringComponent;