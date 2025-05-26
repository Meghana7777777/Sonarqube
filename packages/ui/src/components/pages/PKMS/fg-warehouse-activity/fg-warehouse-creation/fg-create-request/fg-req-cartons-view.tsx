import { PKMSCartonInfoModel } from "@xpparel/shared-models";
import { Card, Checkbox, Row, Tag } from "antd";
import { Dispatch, SetStateAction } from "react";

interface IProps {
    cartons: PKMSCartonInfoModel[];
    selectedCartons: number[];
    setPackListLevelCartonsSelection: Dispatch<SetStateAction<Map<number, Map<number, number[]>>>>;
    packListId: number;
    packJobId: number
}


const FgReqCartonsView = (props: IProps) => {

    const { cartons, selectedCartons, setPackListLevelCartonsSelection, packListId, packJobId } = props

    const chunkArray = (cartonsData, chunkSize) => {
        let result = [];
        for (let i = 0; i < cartonsData.length; i += chunkSize) {
            result.push(cartonsData.slice(i, i + chunkSize));
        }
        return result
    };

    const chunkedCartons: PKMSCartonInfoModel[][] = chunkArray(cartons, 10);
    const cartonsCommonHtmlTable = (cartons: PKMSCartonInfoModel[], index) => {
        // const pkListWiseData = packListLevelCartonsSelection?.get(packOrderId)?.get(packListId)?.get(packJobId)?.get(index);
        return <Card style={{ width: '100%', overflowX: 'auto' }}>
            {<Checkbox.Group
                value={selectedCartons}
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
                                    {chunk.map((rec, idx) => {
                                        return <tr
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
                                                <Checkbox
                                                    value={rec.cartonId}
                                                    disabled={rec.isFgWhCartonId}
                                                    checked={selectedCartons?.includes(rec?.cartonId)}
                                                    onChange={(e) => {
                                                        setPackListLevelCartonsSelection(prev => {
                                                            const previous = new Map(prev);
                                                            if (e.target.checked) {
                                                                const packJobs = new Map();
                                                                packJobs.set(packJobId, [rec.cartonId])
                                                                if (!previous.has(packListId)) {
                                                                    previous.set(packListId, packJobs)
                                                                } else {
                                                                    if (!previous.get(packListId).has(packJobId)) {
                                                                        previous.get(packListId).set(packJobId, [rec.cartonId])
                                                                    } else {
                                                                        previous.get(packListId).get(packJobId).push(rec.cartonId)
                                                                    }
                                                                }
                                                                return previous
                                                            } else {
                                                                const cartons = previous.get(packListId).get(packJobId).filter(old => old !== rec.cartonId);
                                                                if (!cartons.length) {
                                                                    previous.get(packListId).delete(packJobId);
                                                                } else {
                                                                    previous.get(packListId).set(packJobId, cartons)
                                                                }
                                                                if (!previous.get(packListId).size) {
                                                                    previous.delete(packListId)
                                                                }
                                                                return previous
                                                            }
                                                        })

                                                    }}
                                                />

                                            </td>
                                            <td
                                                style={{ border: "1px solid #d1d5db", textAlign: 'center', width: '52px' }}
                                            >
                                                <Tag color='red'>{rec.barcode}</Tag> - <Tag color='red'>{rec.qty}</Tag>
                                            </td>
                                        </tr>
                                    }
                                    )}
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


export default FgReqCartonsView