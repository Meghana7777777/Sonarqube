



export class InventoryConsumingRequest {
    requestNumber: string;
    priority: string; // percentage 1% to 100%
    status : string; // OPEN // APPROVED // completed 
    requestedDate: string; // date format: YYYY-MM-DD
    MoNumber: string; //100 to 999
    moLine: string; //10
    coNumber: string; 
    destination: string; // mome rand locations 
    buyer: string; 
    deliveryDate: string;
    requestedQty: number;
    noOfBundles: number;
    bundlesInfo: BundlesInfoForInventoryConsuming[];
}

export class BundlesInfoForInventoryConsuming {
    jobNumber: string;
    bundleNumber: string;
    color: string;
    size: string;
    actualQty: number;
    location : string;
    status : string;
    alreadyIssuedQty: number;
    requestedFreezedQty: number;
    issuedQty: number;
    issueIngQty:number;
}

export const mockData1 : InventoryConsumingRequest[]=[{
    requestNumber: 'REQ001',
    priority: '75',
    status: 'OPEN',
    requestedDate: '2025-01-01',
    MoNumber: '100',
    moLine: '10',
    coNumber: 'CO12345',
    destination: 'Warehouse A',
    buyer: 'John Doe',
    deliveryDate: '2025-01-15',
    requestedQty: 500,
    noOfBundles: 10,
    bundlesInfo: [
        {
            jobNumber: 'JOB001',
            bundleNumber: 'BND001',
            color: 'Red',
            size: 'M',
            actualQty: 50,
            location: 'A1',
            status: 'momething',
            alreadyIssuedQty: 20,
            requestedFreezedQty: 30,
            issuedQty: 20,
            issueIngQty: 10
        },
        {
            jobNumber: 'JOB002',
            bundleNumber: 'BND002',
            color: 'Blue',
            size: 'L',
            actualQty: 40,
            location: 'A2',
            status: 'momething',
            alreadyIssuedQty: 10,
            requestedFreezedQty: 20,
            issuedQty: 10,
            issueIngQty: 5
        },
        {
            jobNumber: 'JOB003',
            bundleNumber: 'BND003',
            color: 'Green',
            size: 'S',
            actualQty: 60,
            location: 'B1',
            status: 'momething',
            alreadyIssuedQty: 5,
            requestedFreezedQty: 50,
            issuedQty: 5,
            issueIngQty: 10
        }
    ]
},

{
    requestNumber: 'REQ001',
    priority: '75',
    status: 'OPEN',
    requestedDate: '2025-01-01',
    MoNumber: '100',
    moLine: '10',
    coNumber: 'CO12345',
    destination: 'Warehouse A',
    buyer: 'John Doe',
    deliveryDate: '2025-01-15',
    requestedQty: 500,
    noOfBundles: 10,
    bundlesInfo: [
        {
            jobNumber: 'JOB001',
            bundleNumber: 'BND001',
            color: 'Red',
            size: 'M',
            actualQty: 50,
            location: 'A1',
            status: 'momething',
            alreadyIssuedQty: 20,
            requestedFreezedQty: 30,
            issuedQty: 20,
            issueIngQty: 10
        },
        {
            jobNumber: 'JOB002',
            bundleNumber: 'BND002',
            color: 'Blue',
            size: 'L',
            actualQty: 40,
            location: 'A2',
            status: 'momething',
            alreadyIssuedQty: 10,
            requestedFreezedQty: 20,
            issuedQty: 10,
            issueIngQty: 5
        },
        {
            jobNumber: 'JOB003',
            bundleNumber: 'BND003',
            color: 'Green',
            size: 'S',
            actualQty: 60,
            location: 'B1',
            status: 'momething',
            alreadyIssuedQty: 5,
            requestedFreezedQty: 50,
            issuedQty: 5,
            issueIngQty: 10
        }
    ]
},
{
    requestNumber: 'REQ004',
    priority: '50',
    status: 'OPEN',
    requestedDate: '2025-01-06',
    MoNumber: '103',
    moLine: '15',
    coNumber: 'CO12348',
    destination: 'Warehouse D',
    buyer: 'Laura Harris',
    deliveryDate: '2025-02-01',
    requestedQty: 400,
    noOfBundles: 18,
    bundlesInfo: [
        {
            jobNumber: 'JOB013',
            bundleNumber: 'BND013',
            color: 'Pink',
            size: 'M',
            actualQty: 20,
            location: 'G1',
            status: 'momething',
            alreadyIssuedQty: 5,
            requestedFreezedQty: 10,
            issuedQty: 5,
            issueIngQty: 5
        },
        {
            jobNumber: 'JOB014',
            bundleNumber: 'BND014',
            color: 'Red',
            size: 'L',
            actualQty: 60,
            location: 'G2',
            status: 'momething',
            alreadyIssuedQty: 10,
            requestedFreezedQty: 40,
            issuedQty: 10,
            issueIngQty: 15
        },
        {
            jobNumber: 'JOB015',
            bundleNumber: 'BND015',
            color: 'Blue',
            size: 'XL',
            actualQty: 80,
            location: 'H1',
            status: 'momething',
            alreadyIssuedQty: 5,
            requestedFreezedQty: 60,
            issuedQty: 5,
            issueIngQty: 20
        },
        {
            jobNumber: 'JOB016',
            bundleNumber: 'BND016',
            color: 'Green',
            size: 'S',
            actualQty: 50,
            location: 'H2',
            status: 'momething',
            alreadyIssuedQty: 15,
            requestedFreezedQty: 30,
            issuedQty: 15,
            issueIngQty: 10
        },
        {
            jobNumber: 'JOB017',
            bundleNumber: 'BND017',
            color: 'Yellow',
            size: 'M',
            actualQty: 30,
            location: 'H3',
            status: 'momething',
            alreadyIssuedQty: 5,
            requestedFreezedQty: 20,
            issuedQty: 5,
            issueIngQty: 10
        }
    ]
},
{
    requestNumber: 'REQ005',
    priority: '80',
    status: 'OPEN',
    requestedDate: '2025-01-08',
    MoNumber: '104',
    moLine: '18',
    coNumber: 'CO12349',
    destination: 'Warehouse E',
    buyer: 'Emma Walker',
    deliveryDate: '2025-02-05',
    requestedQty: 650,
    noOfBundles: 25,
    bundlesInfo: [
        {
            jobNumber: 'JOB018',
            bundleNumber: 'BND018',
            color: 'Black',
            size: 'S',
            actualQty: 30,
            location: 'I1',
            status: 'momething',
            alreadyIssuedQty: 10,
            requestedFreezedQty: 15,
            issuedQty: 10,
            issueIngQty: 5
        },
        {
            jobNumber: 'JOB019',
            bundleNumber: 'BND019',
            color: 'Pink',
            size: 'L',
            actualQty: 70,
            location: 'I2',
            status: 'momething',
            alreadyIssuedQty: 15,
            requestedFreezedQty: 40,
            issuedQty: 15,
            issueIngQty: 10
        },
        {
            jobNumber: 'JOB020',
            bundleNumber: 'BND020',
            color: 'White',
            size: 'M',
            actualQty: 60,
            location: 'I3',
            status: 'momething',
            alreadyIssuedQty: 25,
            requestedFreezedQty: 20,
            issuedQty: 25,
            issueIngQty: 10
        },
        {
            jobNumber: 'JOB021',
            bundleNumber: 'BND021',
            color: 'Yellow',
            size: 'XL',
            actualQty: 40,
            location: 'I4',
            status: 'momething',
            alreadyIssuedQty: 5,
            requestedFreezedQty: 30,
            issuedQty: 5,
            issueIngQty: 5
        },
        {
            jobNumber: 'JOB022',
            bundleNumber: 'BND022',
            color: 'Red',
            size: 'M',
            actualQty: 50,
            location: 'J1',
            status: 'momething',
            alreadyIssuedQty: 10,
            requestedFreezedQty: 30,
            issuedQty: 10,
            issueIngQty: 10
        }
    ]
},
{
    requestNumber: 'REQ008',
    priority: '65',
    status: 'OPEN',
    requestedDate: '2025-01-12',
    MoNumber: '107',
    moLine: '24',
    coNumber: 'CO12352',
    destination: 'Warehouse H',
    buyer: 'Mophia Clark',
    deliveryDate: '2025-02-15',
    requestedQty: 800,
    noOfBundles: 30,
    bundlesInfo: [
        {
            jobNumber: 'JOB033',
            bundleNumber: 'BND033',
            color: 'Orange',
            size: 'S',
            actualQty: 50,
            location: 'O1',
            status: 'momething',
            alreadyIssuedQty: 10,
            requestedFreezedQty: 30,
            issuedQty: 10,
            issueIngQty: 10
        },
        {
            jobNumber: 'JOB034',
            bundleNumber: 'BND034',
            color: 'Purple',
            size: 'M',
            actualQty: 90,
            location: 'O2',
            status: 'momething',
            alreadyIssuedQty: 20,
            requestedFreezedQty: 50,
            issuedQty: 20,
            issueIngQty: 20
        },
        {
            jobNumber: 'JOB035',
            bundleNumber: 'BND035',
            color: 'Pink',
            size: 'L',
            actualQty: 70,
            location: 'O3',
            status: 'momething',
            alreadyIssuedQty: 30,
            requestedFreezedQty: 20,
            issuedQty: 30,
            issueIngQty: 15
        },
        {
            jobNumber: 'JOB036',
            bundleNumber: 'BND036',
            color: 'Green',
            size: 'XL',
            actualQty: 80,
            location: 'O4',
            status: 'momething',
            alreadyIssuedQty: 20,
            requestedFreezedQty: 50,
            issuedQty: 20,
            issueIngQty: 25
        },
        {
            jobNumber: 'JOB037',
            bundleNumber: 'BND037',
            color: 'Blue',
            size: 'S',
            actualQty: 110,
            location: 'P1',
            status: 'momething',
            alreadyIssuedQty: 40,
            requestedFreezedQty: 40,
            issuedQty: 40,
            issueIngQty: 30
        }
    ]
}]

export const mockData2 : InventoryConsumingRequest[]=[

    {
        requestNumber: 'REQ002',
        priority: '90',
        status: 'APPROVED',
        requestedDate: '2025-01-02',
        MoNumber: '101',
        moLine: '12',
        coNumber: 'CO12346',
        destination: 'Warehouse B',
        buyer: 'Jane Smith',
        deliveryDate: '2025-01-20',
        requestedQty: 800,
        noOfBundles: 20,
        bundlesInfo: [
            {
                jobNumber: 'JOB004',
                bundleNumber: 'BND004',
                color: 'Black',
                size: 'L',
                actualQty: 100,
                location: 'C1',
                status: 'momething',
                alreadyIssuedQty: 30,
                requestedFreezedQty: 50,
                issuedQty: 30,
                issueIngQty: 15
            },
            {
                jobNumber: 'JOB005',
                bundleNumber: 'BND005',
                color: 'White',
                size: 'XL',
                actualQty: 70,
                location: 'C2',
                status: 'momething',
                alreadyIssuedQty: 20,
                requestedFreezedQty: 40,
                issuedQty: 20,
                issueIngQty: 10
            },
            {
                jobNumber: 'JOB006',
                bundleNumber: 'BND006',
                color: 'Yellow',
                size: 'M',
                actualQty: 50,
                location: 'C3',
                status: 'momething',
                alreadyIssuedQty: 5,
                requestedFreezedQty: 30,
                issuedQty: 5,
                issueIngQty: 10
            },
            {
                jobNumber: 'JOB007',
                bundleNumber: 'BND007',
                color: 'Pink',
                size: 'M',
                actualQty: 80,
                location: 'D1',
                status: 'momething',
                alreadyIssuedQty: 10,
                requestedFreezedQty: 60,
                issuedQty: 10,
                issueIngQty: 20
            }
        ]
    },
    {
        requestNumber: 'REQ006',
        priority: '95',
        status: 'APPROVED',
        requestedDate: '2025-01-09',
        MoNumber: '105',
        moLine: '20',
        coNumber: 'CO12350',
        destination: 'Warehouse F',
        buyer: 'Alice Green',
        deliveryDate: '2025-02-10',
        requestedQty: 1200,
        noOfBundles: 40,
        bundlesInfo: [
            {
                jobNumber: 'JOB023',
                bundleNumber: 'BND023',
                color: 'Grey',
                size: 'L',
                actualQty: 100,
                location: 'K1',
                status: 'momething',
                alreadyIssuedQty: 50,
                requestedFreezedQty: 30,
                issuedQty: 50,
                issueIngQty: 20
            },
            {
                jobNumber: 'JOB024',
                bundleNumber: 'BND024',
                color: 'Blue',
                size: 'M',
                actualQty: 120,
                location: 'K2',
                status: 'momething',
                alreadyIssuedQty: 40,
                requestedFreezedQty: 60,
                issuedQty: 40,
                issueIngQty: 25
            },
            {
                jobNumber: 'JOB025',
                bundleNumber: 'BND025',
                color: 'Green',
                size: 'XL',
                actualQty: 150,
                location: 'K3',
                status: 'momething',
                alreadyIssuedQty: 25,
                requestedFreezedQty: 80,
                issuedQty: 25,
                issueIngQty: 50
            },
            {
                jobNumber: 'JOB026',
                bundleNumber: 'BND026',
                color: 'Orange',
                size: 'S',
                actualQty: 100,
                location: 'L1',
                status: 'momething',
                alreadyIssuedQty: 10,
                requestedFreezedQty: 70,
                issuedQty: 10,
                issueIngQty: 30
            },
            {
                jobNumber: 'JOB027',
                bundleNumber: 'BND027',
                color: 'Pink',
                size: 'M',
                actualQty: 90,
                location: 'L2',
                status: 'momething',
                alreadyIssuedQty: 15,
                requestedFreezedQty: 60,
                issuedQty: 15,
                issueIngQty: 35
            }
        ]
    },
]


export const mockData3: InventoryConsumingRequest[] = [

  
    {
        requestNumber: 'REQ003',
        priority: '60',
        status: 'COMPLETED',
        requestedDate: '2025-01-05',
        MoNumber: '102',
        moLine: '14',
        coNumber: 'CO12347',
        destination: 'Warehouse C',
        buyer: 'Michael Lee',
        deliveryDate: '2025-01-25',
        requestedQty: 300,
        noOfBundles: 15,
        bundlesInfo: [
            {
                jobNumber: 'JOB008',
                bundleNumber: 'BND008',
                color: 'Purple',
                size: 'L',
                actualQty: 40,
                location: 'E1',
                status: 'momething',
                alreadyIssuedQty: 20,
                requestedFreezedQty: 15,
                issuedQty: 20,
                issueIngQty: 5
            },
            {
                jobNumber: 'JOB009',
                bundleNumber: 'BND009',
                color: 'Orange',
                size: 'S',
                actualQty: 35,
                location: 'E2',
                status: 'momething',
                alreadyIssuedQty: 35,
                requestedFreezedQty: 0,
                issuedQty: 35,
                issueIngQty: 0
            },
            {
                jobNumber: 'JOB010',
                bundleNumber: 'BND010',
                color: 'Brown',
                size: 'M',
                actualQty: 45,
                location: 'E3',
                status: 'momething',
                alreadyIssuedQty: 10,
                requestedFreezedQty: 25,
                issuedQty: 10,
                issueIngQty: 10
            },
            {
                jobNumber: 'JOB011',
                bundleNumber: 'BND011',
                color: 'Grey',
                size: 'L',
                actualQty: 50,
                location: 'F1',
                status: 'momething',
                alreadyIssuedQty: 50,
                requestedFreezedQty: 0,
                issuedQty: 50,
                issueIngQty: 0
            },
            {
                jobNumber: 'JOB012',
                bundleNumber: 'BND012',
                color: 'Beige',
                size: 'S',
                actualQty: 30,
                location: 'F2',
                status: 'momething',
                alreadyIssuedQty: 5,
                requestedFreezedQty: 10,
                issuedQty: 5,
                issueIngQty: 5
            }
        ]
    },
  

    {
        requestNumber: 'REQ007',
        priority: '70',
        status: 'COMPLETED',
        requestedDate: '2025-01-10',
        MoNumber: '106',
        moLine: '22',
        coNumber: 'CO12351',
        destination: 'Warehouse G',
        buyer: 'David Johnmon',
        deliveryDate: '2025-02-12',
        requestedQty: 950,
        noOfBundles: 35,
        bundlesInfo: [
            {
                jobNumber: 'JOB028',
                bundleNumber: 'BND028',
                color: 'Red',
                size: 'L',
                actualQty: 110,
                location: 'M1',
                status: 'momething',
                alreadyIssuedQty: 110,
                requestedFreezedQty: 0,
                issuedQty: 110,
                issueIngQty: 0
            },
            {
                jobNumber: 'JOB029',
                bundleNumber: 'BND029',
                color: 'Blue',
                size: 'S',
                actualQty: 80,
                location: 'M2',
                status: 'momething',
                alreadyIssuedQty: 40,
                requestedFreezedQty: 30,
                issuedQty: 40,
                issueIngQty: 20
            },
            {
                jobNumber: 'JOB030',
                bundleNumber: 'BND030',
                color: 'Yellow',
                size: 'XL',
                actualQty: 100,
                location: 'M3',
                status: 'momething',
                alreadyIssuedQty: 50,
                requestedFreezedQty: 40,
                issuedQty: 50,
                issueIngQty: 30
            },
            {
                jobNumber: 'JOB031',
                bundleNumber: 'BND031',
                color: 'Black',
                size: 'M',
                actualQty: 120,
                location: 'M4',
                status: 'momething',
                alreadyIssuedQty: 120,
                requestedFreezedQty: 0,
                issuedQty: 120,
                issueIngQty: 0
            },
            {
                jobNumber: 'JOB032',
                bundleNumber: 'BND032',
                color: 'Pink',
                size: 'L',
                actualQty: 150,
                location: 'N1',
                status: 'momething',
                alreadyIssuedQty: 30,
                requestedFreezedQty: 90,
                issuedQty: 30,
                issueIngQty: 40
            }
        ]
    },
   
    ]

    interface SizeData {
        productName:string;
        itemCode: string;
        size: string;
        consumption?:string;
    }
      
    export const data:SizeData[]=
    // [
    //     
    //   ]


    //   export const data: SizeData[] =
     [
        { itemCode: "A123", productName: "P1", size: "M", consumption: "10" },
        { itemCode: "A123", productName: "p1", size: "L", consumption: "10" },
        { itemCode: "A123", productName: "p1", size: "S" },
        { itemCode: "A123", productName: "p1", size: "XL" },
        { itemCode: "A123", productName: "p1", size: "XXL" },
        { "itemCode": "A123", "productName": "p1", "size": "XXM", "consumption": "10" },
        { "itemCode": "A123", "productName": "p1", "size": "Lx", "consumption": "10" },
        { "itemCode": "A123", "productName": "p1", "size": "Sx", "consumption": "10" },
        { "itemCode": "A123", "productName": "p1", "size": "XLx", "consumption": "10" },
        { "itemCode": "A123", "productName": "p1", "size": "XXLx", "consumption": "10" }
      ];

    //   [
    //   { "itemCode": "A123", "productName": "p1", "size": "M"},
    //   { "itemCode": "A123", "productName": "p1", "size": "L"},
    //   { "itemCode": "A123", "productName": "p1", "size": "S"},
    //   { "itemCode": "A123", "productName": "p1", "size": "XL" },
    //   { "itemCode": "A123", "productName": "p1", "size": "XXL" }
    // ]
