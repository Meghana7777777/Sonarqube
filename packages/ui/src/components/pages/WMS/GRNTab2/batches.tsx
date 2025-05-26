import { BatchInfoModel, PackingListInfoModel, PackingListSummaryModel, PhBatchLotRollRequest, RollInfoModel } from '@xpparel/shared-models';
import { PackingListService } from '@xpparel/shared-services';
import { Collapse, CollapseProps } from 'antd';
import { ScxCard } from 'packages/ui/src/schemax-component-lib';
import { useEffect, useState } from 'react';
import { useAppSelector } from "../../../../common";
import BatchesGrid from './batches-grid';


const { Panel } = Collapse;
interface IBatchesProps {
    summeryDataRecord: PackingListSummaryModel
}
type ExtraProperties = {
    supplierCode: string;
    phId: number;
    // Add more extra properties as needed
};
export type BatchesTableModel = RollInfoModel & ExtraProperties
export const Batches = (props: IBatchesProps) => {
    const { summeryDataRecord } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [packListData, setPackListData] = useState<PackingListInfoModel>();
    const [activeKeys, setActiveKeys] = useState<string[]>([]);


    const packageService = new PackingListService();

    const getPackListNumber = (req: PhBatchLotRollRequest) => {

        packageService.getPackListInfo(req).then((res) => {
            if (res.status) {
                // setActiveKeys(res.data[0]?.batchInfo.map(rec => rec.batchNumber));
                setPackListData(res.data[0]);
            }
        }).catch((err) => {
            console.log(err.message);
        });
    };


    useEffect(() => {
        const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.id, undefined, undefined, undefined, summeryDataRecord.supplierCode,undefined);
        getPackListNumber(req);
    }, []);

    const processBatchData = (batchInfo, supplierCode: string, phId: number) => {
        const tablesData: BatchesTableModel[] = []
        batchInfo.lotInfo?.forEach((lot) => {
            lot.rollInfo.forEach((roll) => {
                const obj: BatchesTableModel = {
                    ...roll,
                    supplierCode,
                    phId
                }
                obj['qrcodeId'] = JSON.stringify(obj)
                tablesData.push(obj);
            })
        })
        return tablesData;
    };

const getItems = (batches: BatchInfoModel[]) => {
    const items: CollapseProps['items'] = batches.map(batch=> {
        return {
            key: batch.batchNumber,
            label: `Batch No : ${batch.batchNumber}` ,
            children: <BatchesGrid tableData={processBatchData(batch, packListData.supplierCode, packListData.id)} />
          }
    });  
   
      return items;
}
    return (
        <ScxCard className="print-barcodes-table-card">
            {
                packListData?.batchInfo?.length !== 0 &&
                <Collapse bordered={false} defaultActiveKey={activeKeys} size='small' items={getItems(packListData?packListData.batchInfo:[])}>
                    {/* {packListData?.batchInfo.map(rec => {
                        return <Panel
                            header={
                                <ScxRow>
                                    <ScxColumn xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                        Batch No: {rec.batchNumber}
                                    </ScxColumn>
                                </ScxRow>
                            }
                            key={rec.batchNumber}
                            showArrow={true}
                            // collapsible={'header'}
                        >
                            <BatchesGrid tableData={processBatchData(rec, packListData.supplierCode, packListData.id)} />
                        </Panel>
                    })} */}
                </Collapse>
            }
        </ScxCard>
    );
};

export default Batches;
