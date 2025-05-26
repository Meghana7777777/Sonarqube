import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, InfoCircleOutlined, LoadingOutlined, PlusOutlined, ScanOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { processTypeEnumDisplayValues, QMS_BarcodeInfoModel, QMS_BarcodeReq, QMS_QualityCheckStatus, QMS_ReasonQtysModel, QualityCheckCreationRequest } from '@xpparel/shared-models'
import { QualityChecksService } from '@xpparel/shared-services'
import { Button, Col, Descriptions, Form, Input, InputNumber, Radio, Row, Select, Space, Statistic, Table, Tag, Tooltip, Typography } from 'antd'
import { DescriptionsProps } from 'antd/lib'
import { useAppSelector } from 'packages/ui/src/common'
import { AlertMessages } from 'packages/ui/src/components/common'
import { ScxCard } from 'packages/ui/src/schemax-component-lib'
import { useState } from 'react'
import './quality-checks-reporting.css'
const { Text } = Typography;

const { Option } = Select;
const { Item } = Form;
interface IQualityTypesDropdown {
  qualityTypeId: number,
  qualityType: string
}
interface IProcessTypeDropdown {
  qualityConfigId: number;
  processType: string;
  qualityType: string;
  qualityTypeId: number;
}
export default function QualityChecksReporting() {
  const [barcodeVal, setBarcodeVal] = useState<string>();
  const [barcodeInfo, setBarcodeInfo] = useState<QMS_BarcodeInfoModel>();
  const user = useAppSelector((state) => state.user.user.user);
  const [form] = Form.useForm();
  const [headerForm] = Form.useForm();
  const [barcodeStatus, setBarcodeStatus] = useState<'idle' | 'verifying' | 'verified' | 'notFound' | 'Error'>('idle');
  const [qualitytypes, setQualityTypes] = useState<IQualityTypesDropdown[]>([])
  const [processTypes, setProcessTypes] = useState<IProcessTypeDropdown[]>([])
  const qualityChecksService = new QualityChecksService()
  const [selectedQualityConfig, setSelectedQualityConfig] = useState<IProcessTypeDropdown>(null)
  const [reasonQtys, setReasonQtys] = useState<QMS_ReasonQtysModel[]>([])

  function getBarcodeDetails(barcode) {
    if (barcode.trim() === "") {
      setBarcodeInfo(undefined);
      setBarcodeStatus('idle');

      return
    }
    setBarcodeStatus('verifying');

    const req = new QMS_BarcodeReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, barcode, true, true)
    qualityChecksService.getBarCodeInfoForBarcode(req).then((res) => {
      if (res.status) {
        setBarcodeInfo(res.data)
        setBarcodeStatus('verified');
        setBarcodeVal(res.data.barcode);
        const distinctQualityTypes = getDistinctQualityTypes(res.data);
        setQualityTypes(distinctQualityTypes);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
        setBarcodeInfo(null);
        setBarcodeStatus('notFound');
      }
    })
      .catch((err) => {
        setBarcodeInfo(null);
        setBarcodeStatus('Error');
        AlertMessages.getErrorMessage(err.message);

      }).finally(() => {
        onReset()
      });
  }

  function getDistinctQualityTypes(data: QMS_BarcodeInfoModel): IQualityTypesDropdown[] {
    const map = new Map<number, string>();
    const { qualityConfigurationInfo } = data
    qualityConfigurationInfo.forEach(item => {
      if (!map.has(item.qualityTypeId)) {
        map.set(item.qualityTypeId, item.qualityType);
      }
    });
    return Array.from(map.entries()).map(([qualityTypeId, qualityType]) => ({
      qualityTypeId,
      qualityType
    }));
  }

  function getProcessTypesByQualityTypeId(
    selectedQualityTypeId: number
  ): IProcessTypeDropdown[] {
    const seen = new Set<string>();
    const { qualityConfigurationInfo } = barcodeInfo
    return qualityConfigurationInfo
      .filter(item => item.qualityTypeId === selectedQualityTypeId)
      .filter(item => {
        const key = `${item.processType}-${item.qualityConfigId}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(item => ({
        qualityConfigId: item.qualityConfigId,
        processType: item.processType,
        qualityType: item.qualityType,
        qualityTypeId: item.qualityTypeId,
      }));
  }

  function onQualityTypeChange(qualityTypeId: number) {
    console.log(qualityTypeId)
    const distinctProcessTypes = getProcessTypesByQualityTypeId(qualityTypeId)
    setProcessTypes(distinctProcessTypes)
  }

  const manualBarcodeSearch = (val: string) => {
    getBarcodeDetails(val.trim());
  }

  const barcodeInfoDescItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Style',
      children: barcodeInfo?.barcodeAttributes.style,
    },
    {
      key: '2',
      label: 'FG Color',
      children: barcodeInfo?.barcodeAttributes.fgColor,
    },
    {
      key: '3',
      label: 'Size',
      children: barcodeInfo?.barcodeAttributes.size,
    },
    {
      key: '4',
      label: 'MO number',
      children: barcodeInfo?.barcodeAttributes.moNumber,
    },
    {
      key: '5', // Changed from duplicate key '4'
      label: 'MO Line',
      children: barcodeInfo?.barcodeAttributes.moLineNo,
    },
  ]

  const reportQualityCheck = (values) => {
    if(reasonQtys.length === 0){
      AlertMessages.getErrorMessage('Please add at least one reason and quantity');
      return
    }
    const qualityCheckCreationRequest = new QualityCheckCreationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, barcodeVal, selectedQualityConfig.qualityTypeId, user?.userName, "", values.qualityStatus, selectedQualityConfig.qualityConfigId, reasonQtys)
    qualityChecksService.createQualityCheck(qualityCheckCreationRequest).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        form.resetFields();
        setBarcodeVal(null);
        setBarcodeInfo(null);
        setBarcodeStatus('idle');
        headerForm.resetFields();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  }

  function onProcessTypeChange(v: string, options: IProcessTypeDropdown) {
    const obj = {
      qualityType: options.qualityType,
      qualityTypeId: options.qualityTypeId,
      processType: options.processType,
      qualityConfigId: options.qualityConfigId
    }
    setSelectedQualityConfig(obj)

  }

  function onReset() {
    form.resetFields();
    setReasonQtys([])
  }


  function addReasonQtys() {
    const { reason, reportedQuantity } = form.getFieldsValue()
    console.log(reason, reportedQuantity)
    if (!reason || !reportedQuantity) {
      AlertMessages.getErrorMessage('Please fill all the fields');
      return

    }
    const reasonQtyObj: QMS_ReasonQtysModel = {
      quantity: reportedQuantity,
      reason
    }
    setReasonQtys(prev => [...prev, reasonQtyObj])
    form.resetFields(['reason', 'reportedQuantity'])
  }

  function deleteReasonQtys(index: number) {
    setReasonQtys(prev => prev.filter((item, i) => i !== index))
  }

  const columns: any = [
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Action',
      align: 'center',
      render: (v, r, i) => <Tooltip title={'Delete'}>
        <DeleteOutlined style={{ color: 'red' }} color='red' onClick={() => deleteReasonQtys(i)} />
      </Tooltip>
    }

  ]

  return (
    <>
      <ScxCard size='small'>
        <Form form={headerForm} name='barcode-form'  >
          <Row gutter={[24, 12]} >
            <Col xs={24} sm={24} md={12} lg={12} xl={8}>
              <Form.Item name="rollBarcode" label="Scan  Barcode" rules={[{ required: false }]}>
                <Input placeholder="Scan Barcode" value={barcodeVal} autoFocus onChange={(e) => getBarcodeDetails(e.target.value)} prefix={<ScanOutlined />} />

              </Form.Item>
            </Col>
            <Col>
              {barcodeStatus === 'verifying' && (
                <Text type="secondary" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <LoadingOutlined /> Verifying barcode...
                </Text>
              )}
              {barcodeStatus === 'verified' && (
                <Text type="success" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <CheckCircleOutlined /> Barcode verified
                </Text>
              )}
              {barcodeStatus === 'notFound' && (
                <Text type="danger" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <CloseCircleOutlined /> Barcode not found
                </Text>
              )}
              {barcodeStatus === 'Error' && (
                <Text type="danger" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <CloseCircleOutlined /> Error while verifying barcode
                </Text>
              )}
            </Col>
          </Row>
        </Form>
      </ScxCard >
      <br />
      {barcodeStatus === 'verified' ? <Row gutter={[24, 6]}>

        <Col xs={24} md={16}>
          <ProCard size='small' headerBordered bordered boxShadow title={'Quality Reporting'}>
            <Form form={form} name='quality-reporting-form' layout='vertical' onFinish={reportQualityCheck}>
              <Row justify={'start'} gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name={'qualityType'} label={'Quality type'} rules={[{ required: true, message: 'Enter Quality type' }]}>
                    <Select placeholder="Select quality type" onChange={(value) => onQualityTypeChange(value)}>
                      {
                        qualitytypes.map((v) => (
                          <Select.Option value={v.qualityTypeId} key={v.qualityTypeId}>{v.qualityType}</Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Item name={'processType'} label="Process Type" required rules={[{ required: true, message: "Please selct process type" }]} >
                    <Select allowClear onChange={onProcessTypeChange} showSearch placeholder="Select process type" filterOption={(input, option) =>
                      option?.toString().toLowerCase().includes(input.toLowerCase())
                    }
                    >
                      {
                        processTypes.map((v) => {
                          return <Option processType={v.processType} qualityType={v.qualityType} qualityConfigId={v.qualityConfigId} qualityTypeId={v.qualityTypeId} value={v.processType} key={v.processType}>{processTypeEnumDisplayValues[v.processType]}</Option>
                        })
                      }
                    </Select>
                  </Item>
                </Col>

                <Form.Item label="Status" name={'qualityStatus'} initialValue={QMS_QualityCheckStatus.FAIL} hidden>
                  <Radio.Group defaultValue={QMS_QualityCheckStatus.FAIL} buttonStyle="solid">
                    <Radio.Button value={QMS_QualityCheckStatus.PASS}>{QMS_QualityCheckStatus.PASS}</Radio.Button>
                    <Radio.Button value={QMS_QualityCheckStatus.FAIL}>{QMS_QualityCheckStatus.FAIL}</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Form.Item name={'reportedQuantity'} label={'Quantity'}
                  //  rules={[{ required: true, message: 'Enter Quantity' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} placeholder='Enter quantity' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name={'reason'} label={'Reason'}
                  // rules={[{ required: true, message: 'Enter Reason' }]}
                  >
                    <Input.TextArea rows={2} minLength={0} maxLength={240} />
                  </Form.Item>
                </Col><Col xs={24} sm={12} md={3} lg={3} style={{ paddingTop: '30px' }}>
                  <Button onClick={addReasonQtys} type='primary' icon={<PlusOutlined />}>Add</Button>
                </Col>
              </Row>
              <Row gutter={[16, 16]} justify={'space-around'}>
                <Col xs={24} sm={12} md={6} lg={4} >
                  <Statistic title={'Total defects'} value={reasonQtys.length} />
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Statistic title={'Total Qunatity'} value={reasonQtys.reduce((acc, curr) => acc + curr.quantity, 0)} />
                </Col>
              </Row>
              <br />
              <Row gutter={[16, 16]}>
                <Col xs={24} md={24}>
                  <Table size='small' columns={columns} dataSource={reasonQtys} pagination={false} />
                </Col>
              </Row>
              <br />
              <Row justify={'end'} gutter={[16, 16]}>
                <Col xs={24} sm={12} md={3} lg={3}>
                  <Form.Item>
                    <Button htmlType='reset' danger onClick={onReset}>Reset</Button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={3} lg={3}>
                  <Form.Item>
                    <Button type='primary' htmlType='submit'>Report</Button>
                  </Form.Item>
                </Col>
              </Row>


            </Form>
          </ProCard>
        </Col>
        <Col xs={24} md={8}>
          <ProCard
            size='small'
            headerBordered
            bordered
            boxShadow
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Barcode info
                <InfoCircleOutlined style={{ color: '#1890ff' }} />
              </span>
            }
            style={{
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Descriptions
              column={1}
              labelStyle={{
                width: '30%',
                fontWeight: 500,
                padding: '8px 16px',
                borderRight: '1px solid #f0f0f0',
              }}
              contentStyle={{
                padding: '8px 16px',
              }}
              style={{
                borderRadius: 8,
                overflow: 'hidden'
              }}
              items={[
                {
                  key: '6',
                  label: <span className="description-label current-operation">Current operation</span>,
                  children: <span className="description-content current-operation">{processTypeEnumDisplayValues[barcodeInfo?.opGroups[barcodeInfo?.opGroups.length - 1]?.processType]}</span>,
                },
                {
                  key: '1',
                  label: <span className="description-label">OP Groups</span>,
                  children: <span className="description-content">{barcodeInfo?.opGroups?.map((v) => <Space><Tag>{v.opGroup}</Tag></Space>)}</span>,
                },
                {
                  key: '1',
                  label: <span className="description-label">Style</span>,
                  children: <span className="description-content">{barcodeInfo?.barcodeAttributes.style}</span>,
                },

                {
                  key: '2',
                  label: <span className="description-label">FG Color</span>,
                  children: <span className="description-content">{barcodeInfo?.barcodeAttributes.fgColor}</span>,
                },
                {
                  key: '3',
                  label: <span className="description-label">Size</span>,
                  children: <span className="description-content">{barcodeInfo?.barcodeAttributes.size}</span>,
                },
                {
                  key: '4',
                  label: <span className="description-label">MO Number</span>,
                  children: <span className="description-content">{barcodeInfo?.barcodeAttributes.moNumber}</span>,
                },
                {
                  key: '5',
                  label: <span className="description-label">MO Line</span>,
                  children: <span className="description-content">{barcodeInfo?.barcodeAttributes.moLineNo}</span>,
                },
              ].map(item => ({
                ...item,
                style: {
                  borderBottom: '1px solid #f0f0f0',
                  alignItems: 'center'
                }
              }))}
            />
          </ProCard>
        </Col>

      </Row> : <></>}




    </>
  )
}
