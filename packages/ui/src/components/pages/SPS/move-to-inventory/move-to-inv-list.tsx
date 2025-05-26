import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Modal, Space, QRCode, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ProcessTypeEnum, SPS_C_BundleInvConfirmationIdRequest, SPS_C_ProdColorInvConfirmationsRetrievalRequest, SPS_R_MoveToInvConfirmationModel, SPS_R_MoveToInvConfirmedBundleModel } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from '../../../common';
import dayjs from 'dayjs';
import { SpsInventoryService } from '@xpparel/shared-services';
import printJS from 'print-js';
import Barcode from 'react-barcode';

interface MoveToInvRequest {
  key: React.Key;
  createdOn: string;
  createdBy: string;
  totalBundles: number;
  totalQty: number;
  productName: string;
  color: string;
  confirmationId: string;
  movedToInv: number;
}

interface MoveToInvListProps {
  poSerial: number;
  processType: ProcessTypeEnum;
  productName: string;
  fgColor: string;
}

export const MoveToInvList: React.FC<MoveToInvListProps> = ({ poSerial, processType, productName, fgColor }) => {
  const [data, setData] = useState<MoveToInvRequest[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedConfirmationId, setSelectedConfirmationId] = useState<string | null>(null);
  const [bundleData, setBundleData] = useState<SPS_R_MoveToInvConfirmedBundleModel[]>([]);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state) => state.user.user.user);
  const spsInventoryService = new SpsInventoryService();

  useEffect(() => {
    const fetchInventoryConfirmations = async () => {
      setData([]);
      try {
        const reqModel = new SPS_C_ProdColorInvConfirmationsRetrievalRequest(user.userName, user.orgData.unitCode, user.orgData.companyCode, user.userId, poSerial, productName, fgColor, processType, false);
        const response = await spsInventoryService.getInventoryConfirmationsForPoProdColorProcType(reqModel);
        if (response.status && response.data.length > 0) {
          const formattedData: MoveToInvRequest[] = response.data.map((item) => ({
            key: item.id,
            createdOn: item.createdOn,
            createdBy: item.createdBy,
            totalBundles: item.totalBundles,
            totalQty: item.totalQty,
            productName: item.productName,
            color: item.fgColor,
            confirmationId: item.confirmationId,
            movedToInv: item.movedToInv,
          }));
          setData(formattedData);
        } else {
          setData([]);
        }
      } catch (error) {
        AlertMessages.getErrorMessage(error);
        setData([]);
      }
    };
    fetchInventoryConfirmations();
  }, [poSerial, processType, fgColor, productName]);

  const handleViewClick = async (record: MoveToInvRequest) => {
    try {
      const req = new SPS_C_BundleInvConfirmationIdRequest(user.userName, user.orgData.unitCode, user.orgData.companyCode, user.userId, Number(record.confirmationId), processType, undefined, true);
      const res = await spsInventoryService.getInventoryConfirmedBundlesForConfirmationId(req);
      if (res.status) {
        const confirmations = res.data as SPS_R_MoveToInvConfirmationModel[];
        const formattedData: SPS_R_MoveToInvConfirmedBundleModel[] = [];
        confirmations.forEach((item) => {
          item.movedBundles?.forEach((bundle) => {
            formattedData.push({
              pslId: bundle.pslId,
              bunBarcode: bundle.bunBarcode,
              orgQty: bundle.orgQty,
              opQty: bundle.opQty,
            });
          });
        });
        setBundleData(formattedData);
        setSelectedConfirmationId(record.confirmationId);
        setIsModalVisible(true);
      } else {
        setBundleData([]);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setBundleData([]);
    setSelectedConfirmationId(null);
  };

  const printAllBarCodes = () => {
    const pageContent = printAreaRef.current;
    if (pageContent) {
      printJS({
        printable: pageContent,
        type: 'html',
        showModal: true,
        modalMessage: 'Preparing to print...',
        targetStyles: ['*'],
        style: `
          @page { size: 384px 192px; margin: 0mm; }
          body { margin: 0; padding: 0; }
          #printArea { width: 384px; height: auto; overflow: hidden; }
          #printArea > div { width: 100%; height: 100%; padding: 0; margin: 0; }
          .ant-modal-body { padding: 0 !important; }
        `,
      });
      setIsModalVisible(false);
    } else {
      AlertMessages.getErrorMessage('Print area element not found.');
    }
  };

  const columns: ColumnsType<MoveToInvRequest> = [
    {
      title: 'Confirmation ID',
      dataIndex: 'confirmationId',
      key: 'confirmationId',
      align: 'center',
      render: (text: string) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      align: 'center',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy', align: 'center' },
    { title: 'Total Bundles', dataIndex: 'totalBundles', key: 'totalBundles', align: 'center' },
    { title: 'Total Qty', dataIndex: 'totalQty', key: 'totalQty', align: 'center' },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button
          size="small"
          onClick={() => handleViewClick(record)}
          disabled={record.movedToInv === 0}
          style={{
            backgroundColor: record.movedToInv === 0 ? '#d9d9d9' : '#ffbe0b',
            borderColor: record.movedToInv === 0 ? '#d9d9d9' : '#ffbe0b',
            color: record.movedToInv === 0 ? '#999' : '#000',
          }}
        >
          View Bundles
        </Button>
      ),
    }
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} pagination={false} size="small" bordered scroll={{ x: 'max-content' }} />
      <Modal
        title={
          <Space>
            Print Bundles
            <Button type="primary" onClick={printAllBarCodes}>
              Print
            </Button>
          </Space>
        }
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width={415}
        style={{ top: 20 }}
      >
        <div id="printArea" ref={printAreaRef} style={{ width: '384px' }}>
          {bundleData.map((bundle, index) => (
            <div key={index} className="label" style={{ padding: '10px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                {/* QR Code */}
                <div style={{ flex: '0 0 120px', maxWidth: '120px', minWidth: '120px' }}>
                  <QRCode value={bundle.bunBarcode} size={100} style={{ width: '100%', height: 'auto' }} />
                </div>
                <div style={{ flex: '0 0 60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px' }}>
                  <p style={{ margin: '2px' }}><strong>Product Name:</strong> {productName}</p>
                  <p style={{ margin: '2px' }}><strong>Color:</strong> {fgColor}</p>
                  <p style={{ margin: '2px' }}><strong>Process Type:</strong> {processType}</p>
                  <p style={{ margin: '2px' }}><strong>Confirm ID:</strong> {selectedConfirmationId}</p>
                  <p style={{ margin: '2px' }}><strong>Destination:</strong> {bundle.orgQty}</p>
                  <p style={{ margin: '2px' }}><strong>Org Qty:</strong> {bundle.orgQty}</p>
                  <p style={{ margin: '2px' }}><strong>Op Qty:</strong> {bundle.opQty}</p>
                </div>
              </div>
              <div style={{ marginTop: '6px' }}>
                <Barcode value={bundle.bunBarcode} format="CODE128" width={1} height={30} />
              </div>
              <hr style={{ marginTop: '10px', marginBottom: '10px' }} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default MoveToInvList