

import { SewingJobSizeWiseSummaryModel, SewSerialRequest } from "@xpparel/shared-models";
import { Space, Tag, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { SewingJobGenMOService } from "@xpparel/shared-services";
import { AlertMessages } from "packages/ui/src/components/common";

const totalKey = "Total";

interface SizeQty {
  originalQty: number;
  inputReportedQty: number;
  completionPercent?: number;
}

interface ProductData {
  color: string;
  productType: string;
  productName: string;
  [size: string]: SizeQty | string;
}

const ProductWiseSummary = () => {
  const user = useAppSelector((state) => state.user.user.user);
  const [sewCutTableData, setSewCutTableData] = useState<ProductData[]>([]);
  const sewingJobGenMOService = new SewingJobGenMOService();

  useEffect(() => {
    getSewingJobSizeWiseSummaryData();
  }, []);

  useEffect(() => {
    setDummyData();
  }, []);

  const setDummyData = () => {
    const dummyData: ProductData[] = [
      {
        color: "Red",
        productType: "Bra",
        productName: "423265_A",
        "S(36/38)": { originalQty: 40, inputReportedQty: 10 },
        "M(40/42)": { originalQty: 80, inputReportedQty: 80 },
        "L(44/46)": { originalQty: 80, inputReportedQty: 80 },
        "XL(48/50)": { originalQty: 40, inputReportedQty: 40 },
        [totalKey]: { originalQty: 240, inputReportedQty: 240 },
      },
      {
        color: "Blue",
        productType: "Shirt",
        productName: "423265_A",
        "S(36/38)": { originalQty: 40, inputReportedQty: 10 },
        "M(40/42)": { originalQty: 80, inputReportedQty: 80 },
        "L(44/46)": { originalQty: 80, inputReportedQty: 80 },
        "XL(48/50)": { originalQty: 40, inputReportedQty: 40 },
        [totalKey]: { originalQty: 240, inputReportedQty: 240 },
      },
      {
        color: "Green",
        productType: "Tuxedo",
        productName: "423265_A",
        "S(36/38)": { originalQty: 40, inputReportedQty: 10 },
        "M(40/42)": { originalQty: 80, inputReportedQty: 80 },
        "L(44/46)": { originalQty: 80, inputReportedQty: 80 },
        "XL(48/50)": { originalQty: 40, inputReportedQty: 40 },
        [totalKey]: { originalQty: 240, inputReportedQty: 240 },
      },
    ];

    // dummyData.forEach((product) => {
    //   Object.keys(product).forEach((key) => {
    //     if (key !== "color" && key !== "productType" && key !== "productName" && key !== totalKey) {
    //       const sizeQty = product[key] as SizeQty;
    //       if (sizeQty.originalQty && sizeQty.inputReportedQty) {
    //         sizeQty.completionPercent = Math.round((sizeQty.inputReportedQty / sizeQty.originalQty) * 100);
    //       }
    //     }
    //   });
    // });


    dummyData.forEach((product) => {
      Object.keys(product).forEach((key) => {
        if (key !== "color" && key !== "productType" && key !== "productName") {
          const sizeQty = product[key] as SizeQty;
          if (sizeQty.originalQty && sizeQty.inputReportedQty) {
            sizeQty.completionPercent = Math.round((sizeQty.inputReportedQty / sizeQty.originalQty) * 100);
          }
        }
      });
    });

    setSewCutTableData(dummyData);
  };

  const getSewingJobSizeWiseSummaryData = () => {
    const req = new SewSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, 545, 545, true, true);

    sewingJobGenMOService.getSewingJobSizeWiseSummaryData(req)
      .then((res) => {
        if (res.status) {
          processData(res.data);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((error) => {
        AlertMessages.getErrorMessage(error.message);
      });
  };

  const processData = (sewSizeWiseSummaryData: SewingJobSizeWiseSummaryModel[]) => {
    const tblData: ProductData[] = [];
    sewSizeWiseSummaryData.forEach((sewingOrder) => {
      sewingOrder.sewingOrderLineInfo.forEach((item) => {
        const { productType, productName, sizeQtyDetails } = item;
        let product = tblData.find(
          (product) => product.productType === productType && product.productName === productName
        );

        if (!product) {
          product = { color: "", productType, productName, };
          tblData.push(product);
        }

        sizeQtyDetails.forEach((sizeDetail) => {
          const { size, originalQty, inputReportedQty } = sizeDetail;

          if (!product[size]) {
            product[size] = { originalQty: 0, inputReportedQty: 0, completionPercent: 0, };
          }

          const sizeObj = product[size] as SizeQty;
          sizeObj.originalQty += originalQty;
          sizeObj.inputReportedQty += inputReportedQty;
          sizeObj.completionPercent = Math.round((sizeObj.inputReportedQty / sizeObj.originalQty) * 100);
        });
      });
    });

    setSewCutTableData(tblData);
  };

  return (
    <>
      <div style={{ height: "450px",background: "#dadada", borderRadius: "15px", padding: "10px" }} >
        <div style={{ display: 'flex', justifyContent: 'center', margin: "0px 0px 10px" }} >
          <Space direction="horizontal" size="small">
            <Tooltip title="Order Quantity"> <Tag color="#257d82">Order Qty</Tag> </Tooltip>
            <Tooltip title="Input Reported Quantity"> <Tag color="#001d24">Input Reported Qty</Tag> </Tooltip>
            <Tooltip title="Completion Percentage"> <Tag color="#4fc000">Completion %</Tag> </Tooltip>
          </Space>
        </div>

        <div  style={{ height: "400px", overflow: "scroll", scrollbarWidth: "none", }}>
          {sewCutTableData.map((product, index) => (
            <div
              key={index}
              style={{
                //  background: "#dadada",
                background: "#f3f3f3", borderRadius: "23px", padding: "16px", margin: "0 auto", width: "69%", marginBottom: "15px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", gap: "50px", marginBottom: "15px" }} >
                {/* <div style={{ display: "flex", justifyContent: "start", gap: "10px" }} >
                  <p> Product Name: <strong> {product.productName} </strong></p>
                  <p> Product Type: <strong> {product.productType} </strong></p>
                  <p> Color: <Tag color={product.color}> {product.color} </Tag></p>
                </div> */}


                <div style={{ display: "flex", justifyContent: "start", gap: "10px", }} >
                  <div style={{ display: "flex", background: "#dadada", borderRadius: "12px", gap: "5px", padding: "5px 10px" }} > Product Name: <strong> {product.productName} </strong></div>
                  <div style={{ display: "flex", background: "#dadada", borderRadius: "12px", gap: "5px", padding: "5px 10px" }} > Product Type: <strong> {product.productType} </strong></div>
                  <div style={{ display: "flex", background: "#dadada", borderRadius: "12px", gap: "5px", padding: "5px 10px" }} > Color: <Tag color={product.color}> {product.color} </Tag></div>
                </div>

                {/* <Space direction="horizontal" size="small">
                <Tooltip title="Order Quantity"> <Tag color="#257d82">Order Qty</Tag> </Tooltip>
                <Tooltip title="Input Reported Quantity"> <Tag color="#001d24">Input Reported Qty</Tag> </Tooltip>
                <Tooltip title="Completion Percentage"> <Tag color="#4fc000">Completion %</Tag> </Tooltip>
              </Space> */}
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                {Object.keys(product)
                  .filter((key) => key !== "color" && key !== "productType" && key !== "productName")
                  .map((size, idx) => {
                    const sizeQty = product[size] as SizeQty;
                    return (
                      <div
                        key={idx}
                        style={{
                          // background: "#f3f3f3",
                          backgroundColor: "#dadada", borderRadius: "15px", padding: "10px", minWidth: "120px", textAlign: "center",
                        }}
                      >
                        <p style={{
                          //  backgroundColor: "#dadada", 
                          backgroundColor: "#f3f3f3", margin: 0, fontWeight: "bold", borderRadius: "13px", padding: "2px", marginBottom: "9px"
                        }}>{size}</p>
                        {sizeQty ? (
                          <Space direction="horizontal" size={4}>
                            <Tooltip title="Order Qty">
                              <Tag color="#257d82">{sizeQty.originalQty}</Tag>
                            </Tooltip>
                            <Tooltip title="Input Reported Qty">
                              <Tag color="#001d24">{sizeQty.inputReportedQty}</Tag>
                            </Tooltip>
                            <Tooltip title="Completion Percent">
                              <Tag color="#4fc000">{sizeQty.completionPercent}%</Tag>
                            </Tooltip>
                          </Space>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default ProductWiseSummary;
