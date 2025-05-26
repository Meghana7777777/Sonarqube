import { PackingListInfoModel, PackingListSummaryModel, PhBatchLotRollRequest } from '@xpparel/shared-models';
import { PackingListService } from '@xpparel/shared-services';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../common';
import PackingListPreview from './packing-list-preview';


interface IPackListPreviewParentProps {
  summeryDataRecord: PackingListSummaryModel
}
export const PackListPreviewParent = (props: IPackListPreviewParentProps) => {
  const user = useAppSelector((state) => state.user.user.user);
  const [packListInfoData, setPackListInfoData] = useState<PackingListInfoModel>();
  const { summeryDataRecord } = props;
  const service = new PackingListService();

  useEffect(() => {
    const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.id, undefined, undefined, undefined, summeryDataRecord.supplierPoCode,undefined)
    getPackListInfo(req)
  }, [])


  const getPackListInfo = (req: PhBatchLotRollRequest) => {
    service
      .getPackListInfo(req)
      .then((res) => {
        if (res.status) {
          setPackListInfoData(res.data[0]);
        } else {
          setPackListInfoData(undefined);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  return (
    <Card title="Packing list View" className='packing-list-view'>
      <PackingListPreview packListInfoData={packListInfoData} />
    </Card>
  )
}

export default PackListPreviewParent