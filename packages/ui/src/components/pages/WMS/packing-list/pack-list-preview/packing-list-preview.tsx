import { BatchInfoModel, PackingListInfoModel, RollInfoModel } from '@xpparel/shared-models';
import { Col, Descriptions, Empty, Input, Row, Table, TreeSelect, Typography } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { SummaryRow } from '../../../../../schemax-component-lib';
import { defaultDateFormat, defaultDateTimeFormat } from '../../../../common/data-picker/date-picker';
import { packListPreviewColumns } from './preview-columns';


const { Text } = Typography;
const { TreeNode } = TreeSelect;
export interface PackingListPreviewProps {
  packListInfoData?: PackingListInfoModel
}
type abc = { lotLevelRemarks: string }
export type RollInfoModelExtends = RollInfoModel & abc;
export const PackingListPreview = (props: PackingListPreviewProps) => {
  const { packListInfoData } = props;
  const [searchedText, setSearchedText] = useState("");
  const [firstColumn, ...restColumns] = packListPreviewColumns;
  const modifiedFirstColumn = {
    ...firstColumn,
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
  };
  const packListPreviewColumnsWithFilter = [modifiedFirstColumn, ...restColumns];
  const [visibleColumns, setVisibleColumns] = useState(
    packListPreviewColumnsWithFilter.filter((column) => column.isDefaultSelect == true).map(column => column.key)
  );
  const dynamicColumns = packListPreviewColumnsWithFilter.filter((column) => visibleColumns.includes(column.key));
  const handleColumnToggle = (checkedValues) => {
    setVisibleColumns(checkedValues);
  };

  const columnChooserOptions = packListPreviewColumnsWithFilter.map((column) => ({
    label: column.title,
    value: column.key,
    isDefaultSelect: column.isDefaultSelect
  }));

  const columnChooser = (
    <>
      <span style={{ marginRight: '8px' }}>Select columns to show:</span>

      <TreeSelect
        showSearch
        treeCheckable
        treeDefaultExpandAll
        style={{ width: '200px' }}
        value={visibleColumns}
        onChange={handleColumnToggle}
        dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
        placeholder="Select Columns"
        tagRender={() => <></>}
      >
        {columnChooserOptions.map((option) => (
          <TreeNode key={option.value} value={option.value} title={option.label} disableCheckbox={option.isDefaultSelect} disabled={option.isDefaultSelect} />
        ))}
      </TreeSelect>
    </>
  );


  const processData = (batchInfo: BatchInfoModel[]) => {
    const data: RollInfoModelExtends[] = [];
    batchInfo?.forEach(batch => {
      batch.lotInfo.forEach(lot => {
        lot.rollInfo.forEach(roll => {
          data.push({ ...roll, lotNumber: lot.lotNumber, lotLevelRemarks: batch.remarks })
        })
      })
    })
    return data.sort((a, b) => a.objectSeqNumber - b.objectSeqNumber);
  }
  console.log(typeof packListInfoData?.deliveryDate)

  const getArrivalDate = (deliveryDate: any) => {
    if (typeof deliveryDate === 'object') {
      return moment(packListInfoData?.deliveryDate).format(defaultDateTimeFormat)
    } else {
      return moment(packListInfoData?.deliveryDate).format(defaultDateTimeFormat)
    }

  }
  return (
    <>
      {packListInfoData ? (
        <>
          <Descriptions bordered>
            {/* <Descriptions.Item label="Supplier Po">{packListInfoData?.supplierCode}</Descriptions.Item> */}
            <Descriptions.Item label="Packing List Code">{packListInfoData?.packListCode}</Descriptions.Item>
            <Descriptions.Item label="Pack List Date">{moment(packListInfoData?.packListDate).format(defaultDateFormat)}</Descriptions.Item>
            <Descriptions.Item label="Packing List Description">{packListInfoData?.description}</Descriptions.Item>

            <Descriptions.Item label="Expected Arrival Date">{getArrivalDate(packListInfoData?.deliveryDate)}</Descriptions.Item>
            {/* <Descriptions.Item label="Confirmed Date">{moment(packListInfoData?.confirmedDate).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item> */}
            <Descriptions.Item label="Remarks">{packListInfoData?.remarks}</Descriptions.Item>
          </Descriptions>
          <br />
          <Row style={{marginBottom: '10px'}} justify='space-between'>
            <Col>
              {columnChooser}
            </Col>
            <Col>
              <Input.Search placeholder="Search" allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, float: "right" }} />
            </Col>
          </Row>
          <Table
            size='small'
            scroll={{ x: 'max-content' }}
            columns={dynamicColumns}
            dataSource={processData(packListInfoData.batchInfo)}
            pagination={false}
            bordered={true}
            summary={(pageData) => <SummaryRow columns={dynamicColumns} pageData={pageData} />}
          />
        </>
      ) : (
        <Empty description='No data available' />
      )
      }
      <br />
    </>
  );
};

export default PackingListPreview;
