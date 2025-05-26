 import { Button, Divider, Modal, Space } from 'antd';
import React from 'react';
import Barcode from 'react-barcode';
 

interface BarcodeProps {
  poData: [];
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BundleTagBarcode4X2 = (props: BarcodeProps) => {
  const { isModalOpen, setIsModalOpen } = props;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const printAllBarCodes = () => {
    const afterPage = document.getElementById('printArea');
    if (afterPage) {
      const divContents = afterPage.innerHTML;
      const element = window.open('', '', 'height=700, width=1024');
      if (element) {
        setTimeout(() => {
          element.document.write(divContents);
           element.document.close();
          element.print();
          element.close();
        }, 1000);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <Modal
        title={
          <Space>
            Print Barcodes
            <Button type="primary" onClick={printAllBarCodes}>
              Print
            </Button>
          </Space>
        }
        open={isModalOpen}
        onOk={handleOk}
        footer={''}
        onCancel={handleCancel}
      >
        {/* <div id="printArea" style={{ width: '384px' }}>
          {props?.poData?.pOrderLines.map((docObj) => {
            return (
              <>
                <h4>Carton Pack UPC</h4>
                <Barcode
                  value={docObj.upcBarcode || ''}
                  displayValue={true}
                  font={'12px'}
                  width={1.5}
                  height={30}
                  format="upc"
                />
                <Divider>Size Wise BarCodes</Divider>
                {docObj.pOrderSubLines.map((b) => {
                  return (
                    <div className="label">
                      <table>
                        <tbody>
                          <tr>
                            <td>
                            <h4>{b.size}</h4>
                              <Barcode
                                value={b.upcBarcode || ''}
                                displayValue={true}
                                font={'12px'}
                                width={1.5}
                                height={30}
                                format="upc"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </>
            );
          })}
        </div> */}
        <div id="printArea">
          {/* <PrintLabels /> */}
        </div>
      </Modal>
    </div>
  );
};

export default BundleTagBarcode4X2;
