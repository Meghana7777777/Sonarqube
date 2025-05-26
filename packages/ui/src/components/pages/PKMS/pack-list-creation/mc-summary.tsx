import { PackingMethodsEnum, PLSubLineQtyModel } from "@xpparel/shared-models";
import { FormInstance, Table } from "antd";
import { useEffect, useState } from "react";

interface IMCSummary {
    formRef: FormInstance<any>;
    subLineToIdMap: Map<number, Map<String, PLSubLineQtyModel>>
    uniqueSizes: string[];
    packMethod: PackingMethodsEnum
}
export const MCSummary = (props: IMCSummary) => {
    const { packMethod, formRef, subLineToIdMap, uniqueSizes } = props;
    const [refreshKey, setRefreshKey] = useState(1);

    useEffect(() => {
        setRefreshKey(prev => prev + 1)
    }, [subLineToIdMap]);

    return <>
        {packMethod === PackingMethodsEnum.MCSS ? <Table.Summary.Row key={refreshKey}>
            <Table.Summary.Cell index={0}>Items per Polybag</Table.Summary.Cell>
            {
                uniqueSizes.map((size, index) => {
                    let total = 0
                    Array.from(subLineToIdMap.keys()).forEach(rec => {
                        const key = `${rec}$@$${subLineToIdMap.get(rec)?.get(size)?.subLineId}`;
                        const ratio = formRef?.getFieldValue(key) ? Number(formRef?.getFieldValue(key)) : 0;
                        total += ratio
                    })
                    return <Table.Summary.Cell index={index + 1}>{total}</Table.Summary.Cell>
                })

            }
        </Table.Summary.Row> : <Table.Summary.Row>
            <Table.Summary.Cell index={0}>Items per Polybag</Table.Summary.Cell>
            {
                [1].map(rec => {
                    let total = 0
                    uniqueSizes.map((size, index) => {
                        Array.from(subLineToIdMap.keys()).forEach(rec => {
                            const key = `${rec}$@$${subLineToIdMap.get(rec)?.get(size)?.subLineId}`;
                            const ratio = formRef?.getFieldValue(key) ? Number(formRef?.getFieldValue(key)) : 0;
                            total += ratio
                        })
                    })
                    return <Table.Summary.Cell index={1} colSpan={uniqueSizes.length}>{total}</Table.Summary.Cell>
                })
            }
        </Table.Summary.Row>}
    </>;
};

export default MCSummary;
