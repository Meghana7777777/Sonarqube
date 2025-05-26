import { ProcessTypeEnum } from '@xpparel/shared-models'
import React from 'react'
import { ProcessTypeQtysInfo } from './mos-processtype-qtys-info'



interface Props {
    processType: ProcessTypeEnum
    sizesInfo: {
        size: string
        moPslIds: number[]
    }[]
    lastOpGroup?:string
}
export default function MOSProcessTypesCard(props: Props) {
    const {sizesInfo,processType,lastOpGroup} = props
    return (
        <table style={{ width: 'max-content', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ backgroundColor: '#f0f2f5' }}>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>Size</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>Completed Qty</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>Rejected Qty</th>
                </tr>
            </thead>
            <tbody>
                {sizesInfo.map((v) => (
                    <tr key={v.size}>
                        <td style={{ padding: '4px 8px' }}>{v.size}</td>
                        <ProcessTypeQtysInfo lastOpGroup={lastOpGroup} key={v.moPslIds.toString()} moPslIds={v.moPslIds} processType={processType} />

                    </tr>
                ))}
            </tbody>
            {/* <tfoot>
                                   <tr style={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                       <td style={{ padding: '4px 8px' }}>Total</td>
                                       <td style={{ padding: '4px 8px' }}>
                                           {Object.values(processInfo.sizeData).reduce((sum, q) => sum + (q.completedQty || 0), 0)}
                                       </td>
                                       <td style={{ padding: '4px 8px' }}>
                                           {Object.values(processInfo.sizeData).reduce((sum, q) => sum + (q.rejectedQty || 0), 0)}
                                       </td>
                                   </tr>
                               </tfoot> */}
        </table>
    )
}
