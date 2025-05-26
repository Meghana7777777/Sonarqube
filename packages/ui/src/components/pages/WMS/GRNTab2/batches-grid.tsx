import { CustomColumn, ScxTable } from '../../../../schemax-component-lib';
import { BatchesTableModel } from './batches';


interface IBatchesGridProps {
  tableData: BatchesTableModel[];
}
export const BatchesGrid = (props: IBatchesGridProps) => {
  const { tableData } = props;


  const columns: CustomColumn<BatchesTableModel>[] = [

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
      title: 'Roll Type',
      dataIndex: 'objectType',
      align: 'center',
      key: 'objectType',
    },
    {
      title: 'Roll No',
      dataIndex: 'externalRollNumber',
      align: 'center',
      key: 'externalRollNumber',
    },
    {
      title: 'Roll Barcode',
      dataIndex: 'barcode',
      align: 'center',
      key: 'barcode',
    },
    {
      title: 'Length(Meters)',
      dataIndex: 'supplierLength',
      align: 'center',
      key: 'supplierLength',
    },
    {
      title: 'PL Length',
      dataIndex: 'inputLength',
      align: 'center',
      key: 'inputLength',
      render: (text, record) => { return text + '(' + record.inputLengthUom + ')' }
    },
    {
      title: 'Width (CM)',
      dataIndex: 'supplierWidth',
      align: 'center',
      key: 'supplierWidth',
    },
    {
      title: 'PL Width',
      dataIndex: 'inputWidth',
      align: 'center',
      key: 'inputWidth',
      render: (text, record) => { return text + '(' + record.inputWidthUom + ')' }
    },
    {
      title: 'Shade',
      dataIndex: 'shade',
      align: 'center',
      key: 'shade',
    },
  ];


  return <>

    <ScxTable columns={columns} bordered size='small' dataSource={tableData} scroll={{ x: 'max-content' }} pagination={false} />
  </>


};

export default BatchesGrid;
