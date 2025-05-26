import { PKMSPackingDispatchCartonInfoModel } from '@xpparel/shared-models';
import { Card, Checkbox, Row, Tag } from 'antd';
import React from 'react';


interface CartonsSelectionIProps {
    cartons: PKMSPackingDispatchCartonInfoModel[];
    packJobId: number;
    packListLevelCartonsSelection: Map<number, Map<number, Map<number, Map<number, number[]>>>>;
    setPackListLevelCartonsSelection: React.Dispatch<React.SetStateAction<Map<number, Map<number, Map<number, Map<number, number[]>>>>>>
    packListId: number;
    packOrderId: number;
    selectedGroupValues: (cartons: PKMSPackingDispatchCartonInfoModel[], index: any, packJobId: number, packListId: number, packOrderId: number) => void
    setCartonsDataFromDocketTable: React.Dispatch<React.SetStateAction<Map<number, number[]>>>;
    cartonsDataFromDocketTable: Map<number, number[]>

};


const PackingDispatchCartonsSelection = (props: CartonsSelectionIProps) => {
    const { cartonsDataFromDocketTable, cartons, packJobId, packOrderId, packListLevelCartonsSelection, setPackListLevelCartonsSelection, packListId, selectedGroupValues } = props

    const chunkArray = (cartonsData, chunkSize) => {
        let result = [];
        for (let i = 0; i < cartonsData.length; i += chunkSize) {
            result.push(cartonsData.slice(i, i + chunkSize));
        }
        return result
    };

    const chunkedCartons = chunkArray(cartons, 10)
 
    const cartonsCommonHtmlTable = (cartons: PKMSPackingDispatchCartonInfoModel[], index) => {
        const pkListWiseData = packListLevelCartonsSelection?.get(packOrderId)?.get(packListId)?.get(packJobId)?.get(index);
        return <Card style={{ width: '100%', overflowX: 'auto' }}>
            {<Checkbox.Group
                value={pkListWiseData}
            >

                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    justifyContent: "flex-start",
                    padding: "10px",
                }}>
                    {chunkedCartons.map((chunk, index) => (
                        <div key={index} style={{ width: "calc(100% / 7 - 10px)", minWidth: "180px" }}>
                            <table
                                key={index}
                                style={{
                                    borderCollapse: "collapse",
                                    border: "1px solid #d1d5db",
                                    width: "100%",
                                }}
                            >
                                <tbody>
                                    {chunk.map((rec, idx) => (

                                        // <tr
                                        //             style={{
                                        //                 borderBottom: "1px solid #d1d5db",
                                        //                 height: "40px",
                                        //             }}
                                        //         >
                                        //             <th
                                        //                 style={{
                                        //                     border: "1px solid #d1d5db",
                                        //                     backgroundColor: "yellow",
                                        //                     width: "40px"
                                        //                 }}
                                        //             >
                                        //                 {<Checkbox
                                        //                     value={pkListWiseData?.length === cartons?.length ? pkListWiseData[0] : undefined}
                                        //                     onChange={(e) => {
                                        //                         if (e.target.checked) {
                                        //                             selectedGroupValues(cartons, index, packJobId, packListId, packOrderId)
                                        //                         } else {
                                        //                             setPackListLevelCartonsSelection((prev) => {
                                        //                                 const previousValues = new Map(prev);
                                        //                                 previousValues?.get(packOrderId)?.get(packListId)?.get(packJobId)?.delete(index)
                                        //                                 return previousValues
                                        //                             })
                                        //                         }
                                        //                     }}
                                        //                 >
                                        //                 </Checkbox>}
                                        //             </th>
                                        //             <th style={{
                                        //                 border: "1px solid #d1d5db",
                                        //                 backgroundColor: 'yellow',
                                        //                 textAlign: 'center'
                                        //             }}>
                                        //                 CARTON</th>

                                        //         </tr>  

                                        <tr
                                            key={idx}
                                            style={{
                                                borderBottom: "1px solid #d1d5db",
                                                height: "30px",
                                            }}
                                        >

                                            <td style={{
                                                backgroundColor: "#ffffff",
                                                textAlign: "center",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                                width: '14px'
                                            }}>
                                                {cartonsDataFromDocketTable.get(packListId).includes(rec.cartonId) ? (
                                                    <Checkbox disabled={true} />
                                                ) : (
                                                    <Checkbox
                                                        value={rec.cartonId}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                selectedGroupValues([rec], index, packJobId, packListId, Number(packOrderId));
                                                            } else {
                                                                setPackListLevelCartonsSelection((prev) => {
                                                                    const previousValues = new Map(prev);
                                                                    const removingUnselectedValue = previousValues.get(packOrderId)
                                                                        ?.get(packListId)
                                                                        ?.get(packJobId)
                                                                        ?.get(index)
                                                                        ?.filter((v) => v !== rec.cartonId);

                                                                    if (removingUnselectedValue?.length > 0) {
                                                                        previousValues
                                                                            ?.get(packOrderId)
                                                                            ?.get(packListId)
                                                                            ?.get(packJobId)
                                                                            ?.set(index, removingUnselectedValue);
                                                                    } else {
                                                                        previousValues
                                                                            ?.get(packOrderId)
                                                                            ?.get(packListId)
                                                                            ?.delete(packJobId);
                                                                    }
                                                                    return previousValues;
                                                                });
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </td>
                                            <td
                                                style={{ border: "1px solid #d1d5db", textAlign: 'center', width: '52px' }}
                                            >
                                                <Tag color='red'>{rec.barcode}</Tag> - <Tag color='red'>{rec.qty}</Tag>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </Checkbox.Group>}

        </Card>
    }

    return <>
        <Row>
            {cartons?.length > 0 &&
                cartonsCommonHtmlTable(cartons, 0)
            }
        </Row >


    </>
}

export default PackingDispatchCartonsSelection