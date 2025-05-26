import { DocMaterialAllocationModel, DocRollsRequest, DocketBasicInfoModel, MaterialRequestNoRequest, MrnStatusEnum, PoDocketNumberRequest, PoSummaryModel, WhMatReqLineStatusEnum } from '@xpparel/shared-models';
import { DocketMaterialServices } from '@xpparel/shared-services';
import { Button, Popconfirm, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import { IDocMaterialAllocationColumns, docketMaterialColumns } from './material-allocation-columns';
import { DeleteFilled } from '@ant-design/icons';

interface IAllocatedRollsProps {
    isDeleteNeeded: boolean;
    docMaterialAllocatedDetails: DocMaterialAllocationModel[],
    handleDeleteRequest: (reqNumber: string) => void;
    isMrn: boolean;
}
export const AllocatedRolls = (props: IAllocatedRollsProps) => {
    const { isDeleteNeeded, handleDeleteRequest } = props;
    const { docMaterialAllocatedDetails } = props;
    const [allocatedRollsData, setAllocatedRollsData] = useState([]);

    const user = useAppSelector((state) => state.user.user.user);
    const docketMaterialServices = new DocketMaterialServices();


    useEffect(() => {
        constructData(docMaterialAllocatedDetails);
    }, [docMaterialAllocatedDetails]);


    const constructData = (data: DocMaterialAllocationModel[]) => {
        const requestWiseMap = new Map<string, IDocMaterialAllocationColumns[]>();
        const rowSpanMap = new Map<string, number>();
        data?.forEach(docketDat => {
            docketDat.rollsInfo.forEach((rollData, i) => {
                const req = rollData.mrnReqNumber ? rollData.mrnReqNumber : docketDat.requestNumber;
                if(!rowSpanMap.has(req)) {
                    rowSpanMap.set(req, 0);
                }
                let preNum = rowSpanMap.get(req);
                rowSpanMap.set(req, ++preNum);
                // CORRECT
                const dataObj: IDocMaterialAllocationColumns = {
                    docketGroup: docketDat.docketGroup,
                    requestNumber: req,
                    rollId: rollData.rollId,
                    rollBarcode: rollData.rollBarcode,
                    rollQty: rollData.rollQty,
                    allocatedQuantity: rollData.allocatedQuantity,
                    rollLocked: rollData.rollLocked,
                    shade: rollData.shade,
                    shrinkageGroup: rollData.shrinkageGroup,
                    lotNo: rollData.lotNo,
                    itemDesc: rollData.itemDesc,
                    batch: rollData.batch,
                    mWidth: rollData.mWidth,
                    aWidth: rollData.aWidth,
                    status: rollData.mrnReqStatus ? rollData.mrnReqStatus  : docketDat.requestStatus,
                    rowSpan: i == 0 ? rowSpanMap.get(req) : 0,
                    mrnId : rollData.mrnId,
                    allocatedDate: rollData.allocatedDate,
                    externalRollNumber: rollData.externalRollNumber,
                    iWidth: rollData.iWidth
                }
                if (!requestWiseMap.has(req)) {
                    requestWiseMap.set(req, [dataObj]);
                } else {
                    const [first, ...rest] = requestWiseMap.get(req);
                    first.rowSpan = rest.length + 2;
                    const dataObs = [first, ...rest];
                    dataObs.push(dataObj);
                    requestWiseMap.set(req, dataObs);
                }
            })
        });
        setAllocatedRollsData(Array.from(requestWiseMap.values()).flat(Infinity));
    }




    const handleDeleteRoll = (record: IDocMaterialAllocationColumns) => {
        // const req: MaterialRequestNoRequest = new MaterialRequestNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedDocketRecord.docketNumber, record.requestNumber, [new DocRollsRequest(record.rollId, record.rollBarcode, record.allocatedQuantity)]);
        // docketMaterialServices.deleteRollInDocketMaterialRequest(req).then((res => {
        //     if (res.status) {
        //         getDocketMaterialRequests();
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // })).catch(error => {
        //     AlertMessages.getErrorMessage(error.message)
        // });
    };

    const getDeleteButton = () => {
        if (isDeleteNeeded) {
            return [{
                title: 'Delete Request',
                dataIndex: 'requestNumber',
                key: 'requestNumber',
                onCell: (record, index,) => {
                    return  { rowSpan: record.rowSpan ? record.rowSpan : 0 }
                },
                render: (text, record) => {
                    if (props.isMrn) {
                        if (!record.mrnId) {
                            return <></>
                        }
                    } else {
                        if (record.mrnId) {
                            return <></>
                        }
                    }
                    if (!record.mrnId && record.status != WhMatReqLineStatusEnum.OPEN ) {
                        return <>NA</>
                    }
                    if (record.mrnId && record.status != MrnStatusEnum.OPEN ) {
                        return <>NA</>
                    }
                    return (
                        <Popconfirm title="Sure to delete Request?" onConfirm={() => handleDeleteRequest(record.mrnId ? record.mrnId : text)}>
                            <Tooltip title='Delete'>
                                <DeleteFilled disabled type='delete' style={{ color: 'red', fontSize: '20px' }} /></Tooltip>
                        </Popconfirm>
                    )
                }
            }
                // {
                //     title: 'Delete Roll',
                //     dataIndex: 'deleteRoll',
                //     key: 'deleteRoll',
                //     render: (text, record) => (
                //         <Popconfirm title="Sure to delete Roll?" onConfirm={() => handleDeleteRoll(record)}>
                //             <Tooltip title='Delete'>
                //                 <DeleteFilled type='delete' style={{ color: 'red', fontSize: '20px' }} /></Tooltip>
                //         </Popconfirm>
                //     )
                // }
            ];
        } else {
            return [];
        }
    }

    return (
        <Table columns={[...docketMaterialColumns,
        ...getDeleteButton()
        ]}
            size='small'
            bordered
            scroll={{ x: true }}
            pagination={false} dataSource={allocatedRollsData} />
    );
}

export default AllocatedRolls;