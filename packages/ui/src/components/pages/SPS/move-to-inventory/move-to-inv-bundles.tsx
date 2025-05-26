import { useEffect, useState } from "react";
import { ProcessTypeEnum, SPS_C_ProdColorBundlesSummaryRequest, SPS_R_MoveToInvAllBundlesModel} from "@xpparel/shared-models";
import { SpsInventoryService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "../../../common";
import { Empty, Tag } from "antd";

interface MovedBundleProps {
  poSerial: number;
  processType: ProcessTypeEnum;
  productName: string;
  fgColor: string;
}

export const MovedBundles: React.FC<MovedBundleProps> = ({ poSerial, processType, productName, fgColor}) => {
  const [bundledData, setBundleData] = useState<SPS_R_MoveToInvAllBundlesModel[]>([]);
  const user = useAppSelector((state) => state.user.user.user);
  const spsInventoryService = new SpsInventoryService();

  const getAllBundles = async () => {
    try {
      const req = new SPS_C_ProdColorBundlesSummaryRequest(user.userName, user.orgData.unitCode, user.orgData.companyCode, user.userId, poSerial, productName, fgColor, processType, true, true, true, true);
      const res = await spsInventoryService.getAllBundlesForPoProdColorProcType(req);
      if (res.status && res.data) {
        setBundleData(res.data);
      } else {
        setBundleData([]);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error);
    }
  };

  useEffect(() => {
    setBundleData([]);
    getAllBundles();
  }, [poSerial, productName, fgColor, processType]);

  return (
    <div style={{padding: '20px'}}>
      {bundledData.length === 0 ? ( <Empty description="No Bundles found." />) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {bundledData.map((bundle, index) => (
            <Tag
              key={index}
              color={!bundle.mToInv ? "red" : "green"}
              style={{
                fontSize: "14px",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
            >
              {bundle.bunBarcode}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovedBundles;
