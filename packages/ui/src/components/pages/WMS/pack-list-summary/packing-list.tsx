import Icon, { DeliveredProcedureOutlined, EyeOutlined, FileDoneOutlined, FolderOpenOutlined, PrinterTwoTone } from '@ant-design/icons';
import { CheckListStatus, CommonRequestAttrs, PackListLoadingStatus, PackingListSummaryModel, PackingListSummaryRequest, PackingSecurityMenuEnum, SecurityCheckRequest, SummaryTabsEnum } from '@xpparel/shared-models';
import { GrnServices, PackingListService } from '@xpparel/shared-services';
import { Button, Card, Col, Form, Input, Modal, Row, Table, Tabs, Tooltip, TreeSelect } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import { ReactComponent as TruckIcon } from './icons/truck.svg';
import SecurityCheckUpdateForm from './security-check-update-form';
import { summaryColumns } from './summery-columns';
import { SecurityCheckVehicleOut } from './security-check-vehicle-out';

interface IPackListSummeryProps {
  packingSecurityMenuEnum: PackingSecurityMenuEnum;
  onStepChange?: (step: number, selectedRecord: PackingListSummaryModel) => void;
}
const { TreeNode } = TreeSelect;
export const PackListSummaryPage = (props: IPackListSummeryProps) => {
  const { packingSecurityMenuEnum, onStepChange } = props;
  const user = useAppSelector((state) => state.user.user.user);
  const [packListSummery, setPackListSummery] = useState<PackingListSummaryModel[]>([]);
  const [searchedText, setSearchedText] = useState("");
  const [firstColumn, ...restColumns] = summaryColumns;
  const commonReqAttrs: CommonRequestAttrs = { userId: user?.userId, username: user?.userName, companyCode: user?.orgData?.companyCode, unitCode: user?.orgData?.unitCode };

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
  const packingListService = new PackingListService();
  const grnServices = new GrnServices();
  const [selectedRecord, setSelectedRecord] = useState<PackingListSummaryModel>();
  const [activeTab, setActiveTab] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  useEffect(() => {
    onChangeTab(packingSecurityMenuEnum === PackingSecurityMenuEnum.SECURITY ? SummaryTabsEnum.PENDING_ARRIVALS : SummaryTabsEnum.VEHICLE_ARRIVED)
  }, [packingSecurityMenuEnum])




  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeModalAndRefreshTab = () => {
    setIsModalOpen(false);
    onChangeTab(activeTab);
  };

  const onChangeTab = (tabKey) => {
    const statusArray: PackListLoadingStatus[] = [];
    if (tabKey == SummaryTabsEnum.PENDING_ARRIVALS) {
      // statusArray.push(PackingListStatusEnum.OPEN)
    }
    if (tabKey == SummaryTabsEnum.VEHICLE_ARRIVED) {
      statusArray.push(...[PackListLoadingStatus.IN, PackListLoadingStatus.UN_LOADING_PAUSED, PackListLoadingStatus.UN_LOADING_START]);
    }
    if (tabKey == SummaryTabsEnum.UNLOADING_COMPLETED) {
      statusArray.push(PackListLoadingStatus.UN_LOADING_COMPLETED);
    }
    if (tabKey == SummaryTabsEnum.VEHICLE_OUT) {
      statusArray.push(PackListLoadingStatus.OUT);
      //TODO: We are not showing once GRN confirmed and Material Allocated PackLists
      //  PackingListStatusEnum.GRN_CONFIRMED, PackingListStatusEnum.MATERIAL_ALLOCATED
    }
    const req = new PackingListSummaryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, undefined, undefined, undefined, undefined, statusArray);
    setPackListSummery([]);
    getPackListSummery(req);
    setActiveTab(tabKey);
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
        size='small'
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

  const getPackListSummery = (req: PackingListSummaryRequest) => {
    packingListService
      .getPackListSummery(req)
      .then((res) => {
        if (res.status) {
          setPackListSummery(res.data);
        } else {
          setPackListSummery([]);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  }

  const actionButtonHandler = (): any => {
    if (packingSecurityMenuEnum === PackingSecurityMenuEnum.SECURITY) {
      if (activeTab == SummaryTabsEnum.PENDING_ARRIVALS || activeTab == SummaryTabsEnum.UNLOADING_COMPLETED) {
        return [{
          title: '',
          key: 'actions',
          align: 'center',
          fixed: 'right',
          width: 80,
          render: (text, record) => (
            <>
              <Tooltip title='Update Truck Details'>
                <Icon component={TruckIcon} style={{ fontSize: '32px' }} onClick={() => showModal(record)} />
              </Tooltip>

            </>
          )
        }]
      } else {
        return []
      }
    } else {
      if ((activeTab !== SummaryTabsEnum.PENDING_ARRIVALS) && [SummaryTabsEnum.UNLOADING_COMPLETED, SummaryTabsEnum.VEHICLE_ARRIVED].includes(activeTab)) {
        return [
          {
            title: "View",
            dataIndex: "View",
            align: 'center',
            key: "View",
            render: (value, record) => {
              return <>
                <Tooltip title='View'>
                  <EyeOutlined className={'editSamplTypeIcon'} type="edit"
                    onClick={() => {
                      onStepChange(1, record);
                    }}
                    style={{ color: '#1890ff', fontSize: '20px' }}
                  />
                </Tooltip>
              </>
            }
          },
          {
            title: "Print Barcodes",
            dataIndex: "barCodePrint",
            align: 'center',
            key: "barCodePrint",
            render: (value, record) => {
              return <>
                <Button size='middle' type='dashed' icon={<PrinterTwoTone twoToneColor="#eb2f96" />} onClick={() => { onStepChange(3, record); }}>{"Print BarCodes"}</Button >
              </>
            }
          },
          {
            title: "Inspection Details",
            dataIndex: "InspectionDetails",
            align: 'center',
            key: "InspectionDetails",
            render: (value, record) => {
              return <>
                <Button size='middle' type='primary' onClick={() => { onStepChange(2, record); }}>{"Update Inspection Preference"}</Button>
              </>
            }
          },
        ]
      } else {
        return [
          {
            title: "View",
            dataIndex: "View",
            align: 'center',
            key: "View",
            render: (value, record) => {
              return <>
                <Tooltip title='View'>
                  <EyeOutlined className={'editSamplTypeIcon'} type="edit"
                    onClick={() => {
                      onStepChange(1, record);
                    }}
                    style={{ color: '#1890ff', fontSize: '20px' }}
                  />
                </Tooltip>
              </>
            }
          }
        ]
      }
    }

  }

  return (
    <Card title="Packing list Summary" className='packing-list-sum' size='small' bodyStyle={{ paddingTop: '0px' }}>
      <Tabs
        activeKey={activeTab}
        onChange={onChangeTab}
        centered
        items={[
          {
            label: <><FolderOpenOutlined />Pending Arrivals</>,
            key: SummaryTabsEnum.PENDING_ARRIVALS,
            children: <><Row justify='space-between'>
              <Col>
                {columnChooser}
              </Col>
              <Col>
                <Input.Search placeholder="Search" size='small' allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, float: "right" }} />
              </Col>
            </Row>
              <br />
              <Table dataSource={packListSummery} size='small' columns={[...dynamicColumns, ...actionButtonHandler()]} bordered scroll={{ x: 'max-content' }} /></>,
          },
          {
            label: <><DeliveredProcedureOutlined />Vehicle Arrived</>,
            key: SummaryTabsEnum.VEHICLE_ARRIVED,
            children: <><Row justify='space-between'>
              <Col>
                {columnChooser}
              </Col>
              <Col>
                <Input.Search placeholder="Search" size='small' allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, float: "right" }} />
              </Col>
            </Row>
              <br />
              <Table dataSource={packListSummery} size='small' columns={[...dynamicColumns, ...actionButtonHandler()]} bordered scroll={{ x: 'max-content' }} /></>,
          },
          {
            label: <><DeliveredProcedureOutlined />Unloading Completed</>,
            key: SummaryTabsEnum.UNLOADING_COMPLETED,
            children: <><Row justify='space-between'>
              <Col>
                {columnChooser}
              </Col>
              <Col>
                <Input.Search placeholder="Search" size='small' allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, float: "right" }} />
              </Col>
            </Row>
              <br />
              <Table dataSource={packListSummery} size='small' columns={[...dynamicColumns, ...actionButtonHandler()]} bordered scroll={{ x: 'max-content' }} /></>,
          },
          {
            label: <><FileDoneOutlined />Vehicle Out</>,
            key: SummaryTabsEnum.VEHICLE_OUT,
            children: <>
              <Row justify='space-between'>
                <Col>
                  {columnChooser}
                </Col>
                <Col>
                  <Input.Search placeholder="Search" size='small' allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, float: "right" }} />
                </Col>
              </Row>
              <br />
              <Table dataSource={packListSummery} size='small' columns={[...dynamicColumns, ...actionButtonHandler()]} bordered scroll={{ x: 'max-content' }} />
            </>,
          }
        ]}

      />
      <Modal
        title="Vehicle Details"
        open={isModalOpen}
        onCancel={closeModal}
        okText="Submit"
        cancelText="Close"
        key={Date.now()}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width="100vw"
        style={{
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
          maxWidth: "100vw",
          height: "100vh",
        }}
        bodyStyle={{
          height: "calc(100vh - 55px)", // Adjusting for title height
          overflowY: "auto",
        }}
      >
        {selectedRecord?.securityCheckInAt ? <SecurityCheckVehicleOut selectedRecord={selectedRecord} commonReqAttributes={commonReqAttrs} closeModalAndRefreshTab={closeModalAndRefreshTab} /> : <SecurityCheckUpdateForm selectedRecord={selectedRecord} commonReqAttributes={commonReqAttrs} closeModalAndRefreshTab={closeModalAndRefreshTab} />}
      </Modal>
    </Card>
  )
}

export default PackListSummaryPage