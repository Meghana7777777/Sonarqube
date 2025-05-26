import { CommonRequestAttrs, FgWhReportResponseDto, PKMSWhCodeReqDto, WareHouseResponseDto } from '@xpparel/shared-models';
import { PKMSFgWarehouseService, WareHouseService } from '@xpparel/shared-services'
import React, { useEffect, useState } from 'react'
import { AlertMessages } from '../../../common';
import { useAppSelector } from 'packages/ui/src/common';
import { Button, Col, Form, Input, Row, Select, Table } from 'antd';
import { ColumnsType } from 'rc-table/lib/interface';
import { Excel } from 'antd-table-saveas-excel';
import { IExcelColumn } from 'antd-table-saveas-excel/app';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { ExportOutlined, FilePdfOutlined } from '@ant-design/icons';

const FgLocationReport = () => {
  const pKMSFgWarehouseService = new PKMSFgWarehouseService();
  const wareHouseService = new WareHouseService();
  const user = useAppSelector((state) => state.user.user.user);
  const [whCodeDropDown, setWhCodeDropDown] = useState<WareHouseResponseDto[]>([]);
  const [fgWhReqReportData, setFgWhReqReportData] = useState<FgWhReportResponseDto[]>([]);
  const [searchedText, setSearchedText] = useState("")


  useEffect(() => {
    getWareHouseDropDown();
  }, [])


  const getWareHouseDropDown = () => {
    const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
    wareHouseService.getWareHouseDropDown(req).then(res => {
      if (res.status) {
        setWhCodeDropDown(res.data)
      } else {
        setWhCodeDropDown([])
      }
    }).catch(err => console.log(err.message))
  }


  const getWhReqReport = (whCode: string) => {
    if (whCode) {
      const req = new PKMSWhCodeReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, whCode)
      pKMSFgWarehouseService.getWhReqReport(req).then(res => {
        if (res.status) {
          setFgWhReqReportData(res.data)
        } else {
          setFgWhReqReportData([])
          AlertMessages.getErrorMessage(res.internalMessage)
        }
      }).catch(err => {
        setFgWhReqReportData([])
        console.log(err.message)
      })
    }

  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (v, r) => moment(v).format('YYYY-MM-DD'),
      width: 100
    },
    {
      title: 'Floor',
      dataIndex: 'floor',
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        const aaa = new Set(Object.keys(record).map((key) => {
          return String(record[key]).toLowerCase().includes(value.toLocaleString())
        }))
        if (aaa.size && aaa.has(true))
          return true;
        else
          return false;
      },
    },
    {
      title: 'Buyer',
      dataIndex: 'buyer'
    },
    {
      title: 'Style',
      dataIndex: 'style',
    },
    {
      title: 'PO',
      dataIndex: 'buyerPoNo'
    },
    {
      title: 'Color',
      dataIndex: 'color'
    },
    {
      title: 'PO Quantity',
      dataIndex: 'poQty'
    },
    {
      title: 'Ctn Qty ( In)',
      dataIndex: 'cartonQtyIn'
    },
    {
      title: 'Garments Quantity (In)',
      dataIndex: 'garmentsQtyIn'
    },
    {
      title: 'Ctn Qty ( Out)',
      dataIndex: 'cartonQtyOut'
    },
    {
      title: 'Garments Quantity (Out)',
      dataIndex: 'garmentsQtyOut'
    },
    {
      title: 'Location',
      dataIndex: 'location'
    },
  ];

  const handleExport = (e: any) => {
    e.preventDefault();

    const currentDate = new Date()
      .toISOString()
      .slice(0, 10)
      .split("-")
      .join("/");
    let cloneArr = columns.slice(0);
    cloneArr.splice(0, 1);
    cloneArr.splice(-1);
    const exportingColumns: IExcelColumn[] = cloneArr.map((item) => {
      if (typeof item.title === 'string')
        return { title: item.title, dataIndex: item.dataIndex };
      else
        return { title: item.dataIndex.toLocaleUpperCase(), dataIndex: item.dataIndex };
    });

    const excel = new Excel();
    excel.addSheet("Sheet1");
    excel.addRow();
    excel.addColumns(exportingColumns);
    // excel.addDataSource();
    excel.saveAs(`InspectionSummaryReport-${currentDate}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const tableContent: any[][] = [];
    fgWhReqReportData.forEach((item, index) => {
      const rowData: any[] = Object.values(item);
      tableContent.push(rowData);
    });

    (doc as any).autoTable({
      head: [columns.map(column => column.title)],
      body: tableContent,
    });

    doc.save('report.pdf');
  };


  return <>
    <Form layout='horizontal'>
      <Row>
        <Col span={6}>
          <Form.Item
            label={'Ware House Code'}
          >
            <Select
              onChange={(value) => getWhReqReport(value)}
              placeholder={'Select Ware House'}
              allowClear
              showSearch
              style={{ width: '100%' }}
            >
              {whCodeDropDown.map((rec) => {
                return <Select.Option value={rec.wareHouseCode}>{rec.wareHouseCode + "-" + rec.wareHouseDesc}</Select.Option>
              })}
            </Select>
          </Form.Item>
        </Col>

      </Row>
    </Form>
    {fgWhReqReportData.length !== 0 &&
      <>
        <div style={{ marginBottom: '16px', float: 'right' }}>
          <Input.Search placeholder="Search" allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, marginRight: '10px' }} />,
          <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
            Export as Excel
          </Button>
          <Button style={{ marginLeft: '8px' }} icon={<FilePdfOutlined />} onClick={handleExportPDF}>
            Export as PDF
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={fgWhReqReportData}
          size='small'
          bordered
        >

        </Table>
      </>

    }


  </>
}

export default FgLocationReport