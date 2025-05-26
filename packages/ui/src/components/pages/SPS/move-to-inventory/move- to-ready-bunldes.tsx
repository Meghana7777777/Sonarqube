import React, { useEffect, useState } from "react";
import { Tag, Button, Checkbox, message, Empty } from "antd";
import { ProcessTypeEnum, SPS_C_ProdColorEligibleBundlesForMoveToInvRequest, SPS_C_ProdColorEligibleBundlesMovingToInvRequest } from "@xpparel/shared-models";
import { SpsInventoryService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "../../../common";

interface BundleModel {
  pslId: number;
  bunBarcode: string;
  orgQty: number;
  opQty: number;
}

interface ReadyToMoveProps {
  poSerial: number;
  processType: ProcessTypeEnum;
  productName: string;
  fgColor: string;
}

const ReadyToMoveBundles: React.FC<ReadyToMoveProps> = ({ poSerial, processType, productName, fgColor }) => {
  const user = useAppSelector((state) => state.user.user.user);
  const spsInventoryService = new SpsInventoryService();

  const [bundledData, setBundledData] = useState<BundleModel[]>([]);
  const [selectedBarcodes, setSelectedBarcodes] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const fetchBundles = async () => {
    try {
      const req = new SPS_C_ProdColorEligibleBundlesForMoveToInvRequest(user.userName, user.orgData.unitCode, user.orgData.companyCode, user.userId, poSerial, productName, fgColor, processType);
      const res = await spsInventoryService.getEligibleBundlesToMoveToInventoryForPoProdColorProcType(req);
      if (res.status) {
        setBundledData(res.data);
        setSelectedBarcodes([]);
        setSelectAll(false);
      } else {
        setBundledData([]);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedBarcodes(checked ? bundledData.map((b) => b.bunBarcode) : []);
  };

  const toggleSelect = (barcode: string) => {
    setSelectedBarcodes((prev) => {
      const updated = prev.includes(barcode)
        ? prev.filter((b) => b !== barcode)
        : [...prev, barcode];
      setSelectAll(updated.length === bundledData.length);
      return updated;
    });
  };

  const moveBundles = async (barcodes: string[]) => {
    const bundlesToMove = bundledData.filter((b) => barcodes.includes(b.bunBarcode));
    if (bundlesToMove.length === 0) return;
    try {
      const req = new SPS_C_ProdColorEligibleBundlesMovingToInvRequest(user.userName, user.orgData.unitCode, user.orgData.companyCode, user.userId, poSerial, productName, fgColor, processType, bundlesToMove);
      const res = await spsInventoryService.moveOutputCompletedProcTypeBundlesToInventory(req);
      if (res.status) {
        fetchBundles();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error)
    }
  };

 useEffect(() => {
  setBundledData([]);
  setSelectedBarcodes([]);
  setSelectAll(false);
  fetchBundles();
}, [poSerial, processType, productName, fgColor]);


  return (
    <div style={{ padding: "20px" }}>
      {bundledData.length === 0 ? (
       <Empty description="No eligible bundles found." />
      ) : (
        <>
          <Checkbox
            checked={selectAll}
            onChange={(e) => handleSelectAll(e.target.checked)}
            style={{ marginBottom: "20px" }}
          >
            Select All
          </Checkbox>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {bundledData.map((bundle) => (
              <Tag
                key={bundle.bunBarcode}
                color={"red"}
                style={{
                  fontSize: 14,
                  padding: "6px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  border: selectedBarcodes.includes(bundle.bunBarcode)
                    ? "2px solid #000000"
                    : "1px solid #d9d9d9",
                }}
                onClick={() => toggleSelect(bundle.bunBarcode)}
                onDoubleClick={() => moveBundles([bundle.bunBarcode])}
              >
                {bundle.bunBarcode}
              </Tag>
            ))}
          </div>

          {selectedBarcodes.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <Button className="btn-green" onClick={() => moveBundles(selectedBarcodes)}>
                Move To Inventory
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReadyToMoveBundles;
