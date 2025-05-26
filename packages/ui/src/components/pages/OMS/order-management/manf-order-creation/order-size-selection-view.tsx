import { Table, Tag } from "antd";
import { OrderCreationService } from "packages/libs/shared-services/src/oms/order-creation/order-creation.service";
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from "react";
import { AlertMessages } from '../../../../common';
import { SI_ManufacturingOrderInfoModel, SI_MoLineAttributesModel, SI_MoNumberRequest } from "@xpparel/shared-models";
import { IProductFgColorInfo } from "./interfaces";
import ProductColorSizeGrid from "./product-color-size-grid";


interface OrderSizeSelectionViewProps {
    moNumbers: string;
}


const OrderSizeSelectionView = ({ moNumbers: moNumbers }: OrderSizeSelectionViewProps) => {
    const [selectedMoData, setSelectedMoData] = useState<SI_ManufacturingOrderInfoModel[]>([]);
    const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
    const [productColorSizeInfo, setProductColorSizeInfo] = useState<IProductFgColorInfo[]>([]);
    const user = useAppSelector((state) => state.user.user.user);
    const service = new OrderCreationService();

    useEffect(() => {
        const req = new SI_MoNumberRequest(
            user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moNumbers, undefined, false, false, true, true, true, false, false, false, false, true, false
        );
        service.getOrderInfoByManufacturingOrderNo(req).then((res) => {
            if (res.status) {
                const updatedData = res.data.map(mo => {
                    return {
                        ...mo,
                        moLineModel: mo.moLineModel.map(moLine => {
                            return {
                                ...moLine,
                                moLineProducts: moLine.moLineProducts.map(product => {
                                    const subLineMap = new Map<string, any>();

                                    product.subLines.forEach(subLine => {
                                        const key = `${subLine.color}_${subLine.size}`;
                                        if (subLineMap.has(key)) {
                                            subLineMap.get(key).qty += subLine.qty;
                                        } else {
                                            subLineMap.set(key, { ...subLine });
                                        }
                                    });

                                    return {
                                        ...product,
                                        subLines: Array.from(subLineMap.values())
                                    };
                                })
                            };
                        })
                    };
                });
                setSelectedMoData(updatedData);
                transformData(updatedData);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });

    }, []);

    const transformData = (data: SI_ManufacturingOrderInfoModel[]) => {
        const productMap: { [key: string]: IProductFgColorInfo } = {};
        const uniqueSizesSet = new Set<string>();
        // Process each item
        data.forEach(item => {
            item.moLineModel.forEach((line) => {
                line.moLineProducts.forEach((product) => {
                    const { productName, fgColor, moLine, moNumber, subLines } = product;

                    // Collect all delivery dates from the delDates arrays
                    const deliveryDates: string[] = line.moLineAttrs.delDates;

                    // Collect all destinations from the destinations arrays
                    const destinations: string[] = line.moLineAttrs.destinations;


                    const uniqueColors = new Set<string>();
                    subLines.forEach(subLine => {
                        uniqueColors.add(subLine.color);
                    });
                    uniqueColors.forEach(color => {
                        // Prepare the subLineInfo (size to quantity mapping)
                        const subLineInfo: any = {};
                        const particularColorSizeInfo = subLines.filter(e => e.color == color);
                        particularColorSizeInfo.forEach((subLine) => {
                            subLineInfo[subLine.size] = subLine.qty;  // "S": 5000, "M": 5000
                            uniqueSizesSet.add(subLine.size)
                        });

                        // Key for grouping (combination of productName and fgColor)
                        const key = `${productName}-${color}`;

                        // If the product is already in the map, merge it
                        if (productMap[key]) {
                            productMap[key].moLineProducts.push({
                                moLine,
                                moNumber,
                                deliveryDate: deliveryDates,
                                destination: destinations,
                                color: color,
                                ...subLineInfo
                            });
                        } else {
                            // Otherwise, create a new entry for the product
                            productMap[key] = {
                                productName,
                                fgColor: color,
                                moLineProducts: [{
                                    moLine,
                                    moNumber,
                                    deliveryDate: deliveryDates,
                                    destination: destinations,
                                    color: color,
                                    ...subLineInfo
                                }]
                            };
                        }
                    });
                });
            });
        });
        setUniqueSizes(Array.from(uniqueSizesSet.values()));
        // Return the values of the productMap, which will contain grouped products
        setProductColorSizeInfo(Object.values(productMap))
    };

    return (
        <div>
            {productColorSizeInfo.map(e => <ProductColorSizeGrid productColorSizeData={e} uniqueSizes={uniqueSizes} />)}
        </div>
    );
};

export default OrderSizeSelectionView;
