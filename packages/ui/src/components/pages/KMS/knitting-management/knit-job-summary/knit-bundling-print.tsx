import { PrinterOutlined } from '@ant-design/icons';
import { KMS_C_KnitOrderBundlingConfirmationIdRequest, KMS_R_KnitJobBundlingMapModel, PoKnitBundlingMoveToInvStatusEnum, ProcessTypeEnum } from '@xpparel/shared-models';
import { KnittingReportingService } from '@xpparel/shared-services';
import { Button } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import React, { useEffect, useState } from 'react';

const KnitBundlingDetails = () => {
    const knittingReportingService=new KnittingReportingService();
      const user = useAppSelector((state) => state.user.user.user);
      const [confirmationId,setConfirmationId] =useState<number>(1746196852815);
      const [KnitJobBundlingData, setKnitJobBundlingData] = useState<KMS_R_KnitJobBundlingMapModel[]>([]);
    const infoData = [
        { label: 'Style', value: 'CK001' },
        { label: 'productCode', value: 'Shirt-01' },
        { label: 'productName', value: 'Shirt-01' },
        { label: 'productType', value: 'PantShirt' },
        { label: 'fgColor', value: 'Navy Blue' },
    ];

   const rawData = [
    {
        "bundle": "27-KLSWP-1",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.3",
                "job": "KNIT2-2-15-2",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-2",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.5",
                "job": "KNIT2-2-5-2",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-3",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.5",
                "job": "KNIT2-2-15-2",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-4",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.5",
                "job": "KNIT2-2-5-1",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-5",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.4",
                "job": "KNIT2-2-5-4",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-6",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.2",
                "job": "KNIT1-2-1-4",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-7",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.6",
                "job": "KNIT2-2-15-2",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-8",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.6",
                "job": "KNIT1-2-1-4",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-9",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.5",
                "job": "KNIT2-2-15-1",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-10",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.4",
                "job": "KNIT2-2-5-2",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-11",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.3",
                "job": "KNIT2-2-5-1",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-12",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.4",
                "job": "KNIT2-2-5-2",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-13",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.4",
                "job": "KNIT2-2-5-1",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-14",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.6",
                "job": "KNIT2-2-15-1",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-15",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.5",
                "job": "KNIT1-2-1-4",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-16",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.3",
                "job": "KNIT2-2-5-4",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-17",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.2",
                "job": "KNIT2-2-5-4",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-18",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.4",
                "job": "KNIT2-2-5-4",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-19",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.6",
                "job": "KNIT2-2-5-1",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-20",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.5",
                "job": "KNIT2-2-5-3",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-21",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.3",
                "job": "KNIT1-2-1-4",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-22",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.6",
                "job": "KNIT2-2-5-2",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-23",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.3",
                "job": "KNIT2-2-5-4",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-24",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.4",
                "job": "KNIT2-2-5-1",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-25",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.4",
                "job": "KNIT2-2-5-4",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-26",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.3",
                "job": "KNIT1-2-1-4",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-27",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.3",
                "job": "KNIT2-2-15-2",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-28",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.6",
                "job": "KNIT2-2-15-2",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-29",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.2",
                "job": "KNIT2-2-5-2",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-30",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.6",
                "job": "KNIT1-2-1-4",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-31",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.4",
                "job": "KNIT1-2-1-4",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-32",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.4",
                "job": "KNIT2-2-15-2",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-33",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.4",
                "job": "KNIT1-2-1-4",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-34",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.2",
                "job": "KNIT1-2-1-4",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-35",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.3",
                "job": "KNIT2-2-5-1",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-36",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.6",
                "job": "KNIT2-2-5-4",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-37",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.6",
                "job": "KNIT2-2-15-2",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-38",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.4",
                "job": "KNIT2-2-5-1",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-39",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.6",
                "job": "KNIT1-2-1-4",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-40",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.6",
                "job": "KNIT2-2-5-1",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-41",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.5",
                "job": "KNIT2-2-15-2",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-42",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.2",
                "job": "KNIT2-2-15-1",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-43",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.2",
                "job": "KNIT2-2-5-2",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-44",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.2",
                "job": "KNIT2-2-5-1",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-45",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.4",
                "job": "KNIT1-2-1-4",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-46",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.3",
                "job": "KNIT2-2-5-4",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-47",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.5",
                "job": "KNIT2-2-5-4",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-48",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.3",
                "job": "KNIT2-2-15-1",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-49",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.4",
                "job": "KNIT1-2-1-4",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-50",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.6",
                "job": "KNIT2-2-5-4",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-51",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.4",
                "job": "KNIT2-2-5-4",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-52",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.4",
                "job": "KNIT1-2-1-4",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-53",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.6",
                "job": "KNIT2-2-15-2",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-54",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.5",
                "job": "KNIT2-2-15-2",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-55",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.5",
                "job": "KNIT2-2-15-2",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-56",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.2",
                "job": "KNIT2-2-15-1",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-57",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.3",
                "job": "KNIT2-2-5-3",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-58",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.6",
                "job": "KNIT2-2-5-2",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-59",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.6",
                "job": "KNIT2-2-15-2",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-60",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.2",
                "job": "KNIT2-2-5-1",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-61",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.3",
                "job": "KNIT2-2-15-2",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-62",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.4",
                "job": "KNIT2-2-5-1",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-63",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.2",
                "job": "KNIT2-2-15-2",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-64",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.4",
                "job": "KNIT2-2-5-1",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-65",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.6",
                "job": "KNIT2-2-15-2",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-66",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.2",
                "job": "KNIT2-2-5-1",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-67",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.3",
                "job": "KNIT2-2-15-1",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-68",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.5",
                "job": "KNIT2-2-15-1",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-69",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.6",
                "job": "KNIT2-2-5-1",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-70",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.6",
                "job": "KNIT2-2-15-1",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-71",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.6",
                "job": "KNIT2-2-15-2",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-72",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.4",
                "job": "KNIT2-2-15-2",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-73",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.2",
                "job": "KNIT1-2-1-4",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-74",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.3",
                "job": "KNIT2-2-5-2",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-75",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.2",
                "job": "KNIT2-2-15-1",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-76",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.6",
                "job": "KNIT2-2-5-2",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-77",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.5",
                "job": "KNIT2-2-5-4",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-78",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.2",
                "job": "KNIT2-2-15-2",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-79",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.5",
                "job": "KNIT2-2-15-2",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-80",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.4",
                "job": "KNIT2-2-15-1",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-81",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.2",
                "job": "KNIT2-2-5-3",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-82",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.5",
                "job": "KNIT2-2-15-1",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-83",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.6",
                "job": "KNIT2-2-5-1",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-84",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.5",
                "job": "KNIT2-2-15-2",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-85",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.4",
                "job": "KNIT2-2-5-4",
                "qty": "22"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-86",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.3",
                "job": "KNIT2-2-5-4",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-87",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.2",
                "job": "KNIT2-2-5-2",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-88",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.5",
                "job": "KNIT2-2-5-2",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-89",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.2",
                "job": "KNIT2-2-15-2",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-90",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.5",
                "job": "KNIT2-2-5-1",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-91",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.5",
                "job": "KNIT2-2-15-1",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-92",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.3",
                "job": "KNIT2-2-15-1",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-93",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.2",
                "job": "KNIT2-2-15-2",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-94",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.3",
                "job": "KNIT2-2-5-3",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-95",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.2",
                "job": "KNIT2-2-5-4",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-96",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.3",
                "job": "KNIT2-2-5-2",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-97",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.4",
                "job": "KNIT1-2-1-4",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-98",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.2",
                "job": "KNIT2-2-5-2",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-99",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.2",
                "job": "KNIT2-2-5-4",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-100",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.3",
                "job": "KNIT2-2-15-1",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-101",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.3",
                "job": "KNIT1-2-1-4",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-102",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.4",
                "job": "KNIT1-2-1-4",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-103",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.5",
                "job": "KNIT1-2-1-4",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-104",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.6",
                "job": "KNIT2-2-5-4",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-105",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.2",
                "job": "KNIT2-2-5-1",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-106",
        "depJobs": [
            {
                "subProcName": "CHECKING",
                "location": "1.3",
                "job": "KNIT2-2-5-2",
                "qty": "28"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-107",
        "depJobs": [
            {
                "subProcName": "LAYING",
                "location": "1.4",
                "job": "KNIT1-2-1-4",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-108",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.2",
                "job": "KNIT2-2-5-2",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-109",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.3",
                "job": "KNIT1-2-1-4",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-110",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.2",
                "job": "KNIT2-2-15-1",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-111",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.5",
                "job": "KNIT2-2-5-2",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-112",
        "depJobs": [
            {
                "subProcName": "WASHING",
                "location": "1.6",
                "job": "KNIT2-2-15-1",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-113",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.6",
                "job": "KNIT2-2-15-2",
                "qty": "20"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-114",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.3",
                "job": "KNIT2-2-5-3",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-115",
        "depJobs": [
            {
                "subProcName": "FINISHING",
                "location": "1.4",
                "job": "KNIT2-2-15-1",
                "qty": "40"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-116",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.3",
                "job": "KNIT1-2-1-4",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-117",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.6",
                "job": "KNIT2-2-5-2",
                "qty": "35"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-118",
        "depJobs": [
            {
                "subProcName": "CUTTING",
                "location": "1.6",
                "job": "KNIT2-2-5-2",
                "qty": "18"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-119",
        "depJobs": [
            {
                "subProcName": "PACKING",
                "location": "1.6",
                "job": "KNIT2-2-15-2",
                "qty": "32"
            }
        ],
        "qty": 80
    },
    {
        "bundle": "27-KLSWP-120",
        "depJobs": [
            {
                "subProcName": "SEWING",
                "location": "1.3",
                "job": "KNIT2-2-5-2",
                "qty": "20"
            }
        ],
        "qty": 80
    }
];
    useEffect(()=>{
        getPoBundlingDepMapForCoonfirmationIds()
    },[])

    const getPoBundlingDepMapForCoonfirmationIds = async () => {
       const req=new KMS_C_KnitOrderBundlingConfirmationIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,confirmationId,ProcessTypeEnum.KNIT,PoKnitBundlingMoveToInvStatusEnum.MOVED_TO_INV);
       const res=await knittingReportingService.getPoBundlingDepMapForCoonfirmationIds(req);
       console.log('res',res)
       if(res.status)
       {
        setKnitJobBundlingData(res.data);
       } else {
        AlertMessages.getErrorMessage(res.internalMessage);
        setKnitJobBundlingData([]);
       }
    }; 

    


    // Flatten the data
    const tableData = KnitJobBundlingData.map(item => ({
        bundle: item.bundle,
        job: item.depJobs[0].job,
        location: item.depJobs[0].location,
        subProcName: item.depJobs[0].subProcName,
        quantity: item.depJobs[0].qty
    }));

    console.log('tableData345', tableData)

    // Preprocess for rowSpan (location)
    const sortedData = [...tableData].sort((a, b) => a.location.localeCompare(b.location));
    console.log('sortedData', sortedData);
    const locationRowSpans = {};
    sortedData.forEach((row, index) => {
        if (index === 0 || sortedData[index - 1].location !== row.location) {
            const count = sortedData.slice(index).filter(r => r.location === row.location).length;
            locationRowSpans[index] = count;
        }
    });

    console.log('locationRowSpans', locationRowSpans)
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const handlePrint = () => {
        const content = document.getElementById('printable-area')?.innerHTML;
        if (!content) return;

        const win = window.open('', '', 'width=800,height=600');
        if (!win) return;

        win.document.write(`
      <html>
      <head>
        <title>Print Knit Bundling Details</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: fixed; }
          td, th { border: 1px solid #000; padding: 6px; font-size: 13px; word-wrap: break-word; }
          .header-row { font-weight: bold; text-align: center; background-color: #f2f2f2; }
          .center { text-align: center; }
          .product-image { max-height: 150px; max-width: 150px; border: 1px solid #e8e8e8; margin: 5px; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);

        win.document.close();
        setTimeout(() => {
            win.focus();
            win.print();
            setTimeout(() => win.close(), 500);
        }, 500);
    };


    return (
        <>
        <Button type="primary" icon={<PrinterOutlined />} size="middle" onClick={handlePrint}>
          Print
        </Button>
        <div style={{ padding: '20px', fontFamily: 'Arial' }} id="printable-area">
            <h2 style={{ textAlign: 'center' }}>Knit Bundling Details</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Left: Info Table */}
                <table style={{ borderCollapse: 'collapse', width: '70%' }}>
                    <tbody>
                        {infoData.reduce((rows, item, index) => {
                            if (index % 2 === 0) rows.push([item]);
                            else rows[rows.length - 1].push(item);
                            return rows;
                        }, []).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((item, i) => (
                                    <React.Fragment key={i}>
                                        <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 'bold', width: '15%' }}>
                                            {item.label} 
                                        </td>
                                        <td style={{ border: '1px solid #ccc', padding: '6px', width: '15%' }}>
                                            {item.value}
                                        </td>
                                    </React.Fragment>
                                ))}
                                {row.length === 1 && (
                                    <>
                                        <td style={{ border: '1px solid #ccc', padding: '6px' }}></td>
                                        <td style={{ border: '1px solid #ccc', padding: '6px' }}></td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Right: Date and Time */}
                <table style={{ borderCollapse: 'collapse', width: '25%' }}>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 'bold' }}>Date:</td>
                            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{currentDate}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 'bold' }}>Time:</td>
                            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{currentTime}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Data Table */}
            <table style={{ marginTop: '30px', borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4c542' }}>
                        <th style={headerCell}>Bundles</th>
                        <th style={headerCell}>Job</th>
                        <th style={headerCell}>Location</th>
                        <th style={headerCell}>subProcName</th>
                        <th style={headerCell}>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, index) => (
                        <tr key={index}>
                            <td style={cellStyle}>{row.bundle}</td>
                            <td style={cellStyle}>{row.job}</td>

                            {locationRowSpans[index] ? (
                                <td rowSpan={locationRowSpans[index]} style={cellStyle}>
                                    {row.location}
                                </td>
                            ) : null}

                            <td style={cellStyle}>{row.subProcName}</td>
                            <td style={cellStyle}>{row.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

const headerCell = {
    border: '1px solid #ccc',
    padding: '8px',
    fontWeight: 'bold',
    textAlign: 'center' as 'center'
};

const cellStyle = {
    border: '1px solid #ccc',
    textAlign: 'center' as 'center',
    verticalAlign: 'middle',
    padding: '8px'
};

export default KnitBundlingDetails;
