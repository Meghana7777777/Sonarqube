import { PhBatchLotRollRequest, RollInfoModel } from '@xpparel/shared-models';
import { CustomColumn, ScxButton, ScxTable } from '../../../../schemax-component-lib';
import { useAppSelector } from "../../../../common";
import { DownloadOutlined, PrinterTwoTone, SyncOutlined } from '@ant-design/icons';
import { PrintTableModel } from './print-barcodes';
import { Tooltip } from 'antd';

interface IProps {
  handleRelease: (req: PhBatchLotRollRequest) => void;
  handlePrint: (tablesData: RollInfoModel[], req: PhBatchLotRollRequest) => void;
  tableData: RollInfoModel[];
}

export const PrintBarCodesTable = (props: IProps) => {
  const { tableData, handleRelease, handlePrint } = props;
  const user = useAppSelector((state) => state.user.user.user);
  const columns: CustomColumn<PrintTableModel>[] = [
    {
      title: 'Lot No',
      dataIndex: 'lotNumber',
      align: 'center',
      key: 'lotNumber',
    },
    {
      title: 'Material Item Code',
      dataIndex: 'materialItemCode',
      align: 'center',
      key: 'materialItemCode',
    },
    {
      title: 'Object Type',
      dataIndex: 'objectType',
      align: 'center',
      key: 'objectType',
    },
    {
      title: 'Object No',
      dataIndex: 'externalRollNumber',
      align: 'center',
      key: 'externalRollNumber',
    },
    {
      title: 'Object Barcode',
      dataIndex: 'barcode',
      align: 'center',
      key: 'barcode',
    },
    {
      title: 'Object Qty',
      dataIndex: 'supplierLength',
      align: 'center',
      key: 'supplierLength',
    },
    // {
    //   title: 'PL Length',
    //   dataIndex: 'inputLength',
    //   align: 'center',
    //   key: 'inputLength',
    //   render: (text, record) => { return text + '('+ record.inputLengthUom+')'}
    // },
    {
      title: 'Object Width',
      dataIndex: 'supplierWidth',
      align: 'center',
      key: 'supplierWidth',
    },
    // {
    //     title: 'PL Width',
    //     dataIndex: 'inputWidth',
    //     align: 'center',
    //     key: 'inputWidth',
    //     render: (text, record) => { return text + '('+ record.inputWidthUom+')' }
    // },
    {
      title: 'Shade',
      dataIndex: 'shade',
      align: 'center',
      key: 'shade',
    },
    {
      title: 'Actions',
      align: 'center',
      dataIndex: 'id',
      key: 'id', render: (value, rowData) => (
        <div>
          <Tooltip title='Release'>
            <ScxButton
              type="primary"
              size='small'
              icon={<SyncOutlined />}
              onClick={() => handleRelease(new PhBatchLotRollRequest(user.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user.userId, rowData.phId, rowData.batchNumber, rowData.lotNumber, `${rowData.rollNumber}`, rowData.supplierCode, undefined))}
            >
            </ScxButton></Tooltip>
          <span style={{ margin: '0 8px' }}></span>
          <Tooltip title='Print'><ScxButton icon={<PrinterTwoTone />} size='small' disabled={rowData.printStatus} onClick={() => handlePrint([rowData], new PhBatchLotRollRequest(user.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user.userId, rowData.phId, rowData.batchNumber, rowData.lotNumber, `${rowData.externalRollNumber}`, rowData.supplierCode, undefined))}>
          </ScxButton></Tooltip>
        </div>
      ),
    },
  ];

  return (
    <ScxTable columns={columns} dataSource={tableData} size='small' scroll={{ x: 'max-content' }} pagination={false} />
  )
}

export default PrintBarCodesTable