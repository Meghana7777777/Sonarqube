import Icon, { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, LoadingOutlined, ScanOutlined } from '@ant-design/icons'
import { QualityChecksService } from '@xpparel/shared-services'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Divider, Form, Input, message, Modal, Popconfirm, Row, Switch, Table, Typography } from 'antd';
import { QualityChecksInfoReq } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { ScxCard } from 'packages/ui/src/schemax-component-lib';
import { ColumnType } from 'antd/es/table';
const { Text } = Typography;

export default function QualityChecksTracker() {
  const qualityChecksService = new QualityChecksService()
  const [qcData, setQCkData] = useState<any>([])
  const [barcodeStatus, setBarcodeStatus] = useState<'idle' | 'verifying' | 'verified' | 'No data found' | 'Error'>('idle');
  const [barcodeVal, setBarcodeVal] = useState<string>();

  const user = useAppSelector((state) => state.user.user.user);



  const columns: ColumnType<any>[] = [
    {
      title: "Style Code",
      align: 'center',
      dataIndex: "styleCode",
    },
    {
      title: "Process Type",
      align: 'center',
      dataIndex: "processType",
    },
    {
      title: "Quality Type",
      align: 'center',
      dataIndex: "qualityType",
    },
    {
      title: "Bar Code",
      align: 'center',
      dataIndex: "barcode",
    },
    {
      title: "Job Number",
      align: 'center',
      dataIndex: "jobNo",
    },
    {
      title: "Reported By",
      align: 'center',
      dataIndex: "reportedBy",
    },
    {
      title: "Reported On",
      align: 'center',
      dataIndex: "reportedOn",
    },
    {
      title: "Reported Quantity",
      align: 'center',
      dataIndex: "reportedQuantity",
    },
    {
      title: "Reason",
      align: 'center',
      dataIndex: "reason",
    },
    {
      title: "Quality Status",
      align: 'center',
      dataIndex: "qualityStatus",
    },
  ]


  const getQualityChecksInfo = (barcode) => {

    try {
      if (barcode.trim() === "") {
        setBarcodeStatus('idle');
        return
      }
      setBarcodeStatus('verifying');
      const req = new QualityChecksInfoReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, true, true, barcode)
      qualityChecksService.getQualityChecksInfo(req).then((res) => {
        if (res.status) {
          setQCkData(res.data)
          setBarcodeStatus('verified');
        } else {
          setQCkData([])
          setBarcodeStatus('No data found');

        }
      })
    } catch (err) {
      setBarcodeStatus('Error');

      console.log(err);
    }
  }

  return (
    <Card size='small' title='Quality Checks'>
      <br />
      <ScxCard size='small'>
        <Form name='barcode-form'  >
          <Row gutter={[24, 12]} >
            <Col xs={24} sm={24} md={12} lg={12} xl={8}>
              <Form.Item name="rollBarcode" label="Scan  Barcode" rules={[{ required: false }]}>
                <Input placeholder="Scan Barcode" value={barcodeVal} autoFocus onChange={(e) => getQualityChecksInfo(e.target.value)} prefix={<ScanOutlined />} />

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
              {barcodeStatus === 'No data found' && (
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
      <Table bordered columns={columns} dataSource={qcData} className='custom-table' size='small' sticky={true} scroll={{ x: 'max-content' }} />
    </Card>
  )
}
