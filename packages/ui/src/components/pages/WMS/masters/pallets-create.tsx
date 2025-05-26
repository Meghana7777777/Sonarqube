import Icon, { EditOutlined, PrinterTwoTone } from "@ant-design/icons";
import {
  CommonRequestAttrs,
  CurrentPalletLocationEnum,
  CurrentPalletStateEnum,
  PalletBehaviourEnum,
  PalletsActivateRequest,
  PalletsCreateRequest
} from "@xpparel/shared-models";
import { PalletsServices } from "@xpparel/shared-services";
import { Button, Card, Divider, Form, Modal, Popconfirm, QRCode, Space, Switch, Table, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { ScxButton } from "packages/ui/src/schemax-component-lib";
import printJS from "print-js";
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { AlertMessages } from "../../../common";
import { getCssFromComponent } from "../print-barcodes";
import PalletsCreateForm from "./pallets-create-form";
import { ColumnsType } from "antd/es/table";

export interface ICreatePalletsProps {
  barcodeWidth?: number;
  newWindow?: boolean;
};

export const CreatePallets = (props: ICreatePalletsProps) => {
  const { barcodeWidth, newWindow } = props;
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const service = new PalletsServices();

  // State management
  const [palletsData, setPalletsData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  // External window for printing
  const [externalWindow, setExternalWindow] = useState<Window | null>(null);

  // Initialize external window if needed
  useEffect(() => {
    if (newWindow && !externalWindow) {
      const win = window.open('', '', 'width=600,height=700,left=200,top=50');
      if (win) {
        const containerEl = win.document.createElement('div');
        win.document.body.appendChild(containerEl);
        win.document.title = 'Barcodes';
        getCssFromComponent(document, win.document);
        setExternalWindow(win);
      }
    }
  }, [newWindow]);

  // Fetch pallets data
  const fetchPallets = async () => {
    try {
      const obj = new CommonRequestAttrs(
        user?.userName,
        user?.orgData?.unitCode,
        user?.orgData?.companyCode,
        user?.userId
      );

      const res = await service.getAllPalletsData(obj);

      if (res.status) {
        setPalletsData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);
      } else {
        // AlertMessages.getErrorMessage(res.internalMessage);
      }
    } catch (err) {
      console.error(err.message);
      // AlertMessages.getErrorMessage("Failed to fetch pallets data");
    }
  };

  useEffect(() => {
    fetchPallets();
  }, []);

  // Reset all states
  const resetStates = () => {
    console.log('sssss')
    setCurrentRecord(null);
    setIsModalOpen(false);
    setModalMode('create');
    formRef.resetFields();
  };

  // Handle create/update pallet
  const handleSubmit = async () => {
    try {
      await formRef.validateFields();
      const values = formRef.getFieldsValue();

      const req = new PalletsCreateRequest(
        user?.userName,
        user?.orgData?.unitCode,
        user?.orgData?.companyCode,
        user?.userId,
        values.id,
        values.name,
        values.code,
        0, '', '', '', '0',
        CurrentPalletStateEnum.FREE,
        CurrentPalletLocationEnum.NONE,
        PalletBehaviourEnum.GENERAL,
        '',
        values.isActive,
        values.maxItems,
        ''
      );

      const res = await service.createPallets(req);

      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        resetStates();
        await fetchPallets();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    } catch (err) {
      console.error(err);
      AlertMessages.getErrorMessage("Please fill all required fields correctly");
    }
  };

  // Handle activate/deactivate
  const handleToggleActive = async (record: any) => {
    try {
      const req = new PalletsActivateRequest(
        user?.userName,
        user?.orgData?.unitCode,
        user?.orgData?.companyCode,
        user?.userId,
        record.id
      );

      const res = await service.ActivateDeactivatePallets(req);
      AlertMessages.getSuccessMessage(res.internalMessage);
      await fetchPallets();
    } catch (err) {
      console.error(err);
      AlertMessages.getErrorMessage("Failed to update pallet status");
    }
  };

  // Print handling
  const handlePrintAll = () => {
    setShowBarcodeModal(true);
  };

  const printBarcodes = () => {
    const pageContent = document.getElementById("printArea");
    if (!pageContent) {
      AlertMessages.getErrorMessage("Print content not found");
      return;
    }

    printJS({
      printable: pageContent,
      type: "html",
      showModal: true,
      modalMessage: "Preparing print...",
      targetStyles: ['*'],
      style: `
        @page { 
          size: 370px 220px; 
          margin: 0mm; 
        } 
        .label { 
          page-break-after: always !important;
        } 
        body { 
          margin: 0;
        }
      `
    });
  };

  // Table columns
  const palletsColumns: ColumnsType<any> =[
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Current State',
      dataIndex: 'currentPalletState',
      key: 'currentPalletState',
    },
    {
      title: 'Current Location',
      dataIndex: 'currentPalletLocation',
      key: 'currentPalletLocation',
    },
    {
      title: 'Behavior',
      dataIndex: 'palletBeahvior',
      key: 'palletBeahvior',
    },
    {
      title: 'Max Items',
      dataIndex: 'maxItems',
      key: 'maxItems',
    },
    {
      title: 'Barcode',
      dataIndex: 'barcodeId',
      key: 'barcodeId',
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <EditOutlined
              onClick={() => {
                setCurrentRecord(record);
                if (record.isActive) {
                  setModalMode('edit');
                  setIsModalOpen(true);
                } else {
                  AlertMessages.getErrorMessage("You Cannot Edit Deactivated  Pallets");
                }
              }}
            />
          </Tooltip>

          <Divider type="vertical" />

          <Popconfirm
            title={`Are you sure to ${record.isActive ? "deactivate" : "activate"} this pallet?`}
            onConfirm={() => handleToggleActive(record)}
            okText="Yes"
            cancelText="No"
          >
            <Switch
              size="default"
              className={record.isActive ? 'toggle-activated' : 'toggle-deactivated'}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              checked={record.isActive}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Pallets Management"
        extra={
          <Space>
            <Tooltip title="Print all barcodes">
              <ScxButton
                onClick={handlePrintAll}
                icon={<PrinterTwoTone />}
                disabled={palletsData.length === 0}
              >
                Print All Barcodes
              </ScxButton>
            </Tooltip>

            <Button
              type="primary"
              onClick={() => {
                setModalMode('create');
                setIsModalOpen(true);
              }}
            >
              Create New Pallet
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={palletsData}
          columns={palletsColumns}
          rowKey="id"
          size='small'
          bordered
          loading={palletsData.length === 0}
          scroll={{x: 'max-content'}}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={modalMode === 'create' ? 'Create New Pallet' : 'Edit Pallet'}
        width={800}
        open={isModalOpen}
        onOk={handleSubmit}
        okText={modalMode === 'create' ? 'Create' : 'Update'}
        cancelText="Cancel"
        onCancel={resetStates}
        destroyOnClose
      >
        <Divider />
        <PalletsCreateForm
          formRef={formRef}
          initialvalues={modalMode === 'edit' ? currentRecord : null}
        />
      </Modal>

      {/* Barcode Print Modal */}
      <Modal
        title={
          <Space>
            <span>Print Barcodes</span>
            <Button type="primary" onClick={printBarcodes}>
              Print
            </Button>
          </Space>
        }
        width={barcodeWidth ? barcodeWidth + 48 : 432}
        open={showBarcodeModal}
        onCancel={() => setShowBarcodeModal(false)}
        footer={null}
        destroyOnClose
      >
        <div id="printArea" style={{ width: '384px' }}>
          {palletsData.map((pallet, index) => (
            <div
              key={`pallet-${index}`}
              className="label"
              style={{
                display: 'flex',
                alignItems: "center",
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}
            >
              <QRCode value={pallet?.barcodeId || ''} size={120} />

              <div style={{ marginLeft: '20px' }}>
                <div style={{
                  padding: '5px',
                  fontSize: '18px',
                  fontWeight: 500,
                  textAlign: 'center'
                }}>
                  Pallet
                </div>

                <div style={{
                  padding: '5px',
                  fontSize: '15px',
                  fontWeight: 500
                }}>
                  Name: {pallet?.code}
                </div>

                <Barcode
                  value={pallet?.barcodeId || ''}
                  displayValue={true}
                  fontSize={14}
                  width={1}
                  height={30}
                  format="CODE128"
                />
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default CreatePallets;