// // Dummy data file
// export const componentsData = [
//   { id: 1, name: "Component A" },
//   { id: 2, name: "Component B" },
//   { id: 3, name: "Component C" },
// ];
// export const sewingOrders = [
//   "Sewing Order 1",
//   "Sewing Order 2",
//   "Sewing Order 3",
// ];
// Main Interfaces


export interface SewingOrders {
    sewingOrderId: number,
    components: Components[]
}

export interface Components {
    componentId: Number,
    componentName: String

}

export enum operationTypeEnums {
    SEWING = "sewing",
    IRONING = "ironing"
}

export const jobOrders = ["Job Order 1"];

export const SewingOrders: SewingOrders[] = [

    {
        sewingOrderId: 1,
        components: [
            {
                componentName: "collar",
                componentId: 1
            },
            {
                componentName: "back",
                componentId: 2
            },
            {
                componentName: "front",
                componentId: 3
            },
            {
                componentName: "sleeves",
                componentId: 4
            }
        ]
    },
    {
        sewingOrderId: 2,
        components: [
            {
                componentName: "collar1",
                componentId: 1
            },
            {
                componentName: "back1",
                componentId: 2
            },
            {
                componentName: "front1",
                componentId: 3
            },
            {
                componentName: "sleeves1",
                componentId: 4
            }
        ]
    },
    {
        sewingOrderId: 3,
        components: [
            {
                componentName: "collar2",
                componentId: 1
            },
            {
                componentName: "back2",
                componentId: 2
            },
            {
                componentName: "front2",
                componentId: 3
            },
            {
                componentName: "sleeves2",
                componentId: 4
            }
        ]
    },
    {
        sewingOrderId: 4,
        components: [
            {
                componentName: "front shirt",
                componentId: 1
            },
            {
                componentName: "back shirt",
                componentId: 2
            },
            {
                componentName: "front sleeves",
                componentId: 3
            },
            {
                componentName: "back sleeves",
                componentId: 4
            }
        ]
    },
    {
        sewingOrderId: 5,
        components: [
            {
                componentName: "left top foot",
                componentId: 1
            },
            {
                componentName: "bottom top foot",
                componentId: 2
            },
            {
                componentName: "pannel",
                componentId: 3
            },
            {
                componentName: "gusset",
                componentId: 4
            }
        ]
    },
]

















// dummy for barcode scanner




export const dummyData = {
    usernames: ['john_doe', 'jane_smith', 'sewing_master'],
    operationCodes: ['OP001', 'OP002', 'OP003'],
};



export const barCodeTableData = [
    {
        sessionId: 'session-1',
        barcodeDetails: [
            {
                barcode: 'B123456789',
                operationCode: 'OP001',
                quantity: 10,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456789',
                operationCode: 'OP002',
                quantity: 15,
                transactionType: 'Rejected',
                status: 'OPEN',
                barcodeType: 'Knit Job',
                transaction: 'Automatic',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP003',
                quantity: 10,
                transactionType: 'Good',
                status: 'FAILED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP004',
                quantity: 10,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456789',
                operationCode: 'OP005',
                quantity: 15,
                transactionType: 'Rejected',
                status: 'OPEN',
                barcodeType: 'Sewing Job',
                transaction: 'Automatic',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP006',
                quantity: 10,
                transactionType: 'Good',
                status: 'FAILED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP007',
                quantity: 10,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456789',
                operationCode: 'OP008',
                quantity: 15,
                transactionType: 'Rejected',
                status: 'OPEN',
                barcodeType: 'Sewing Job',
                transaction: 'Automatic',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP009',
                quantity: 10,
                transactionType: 'Good',
                status: 'FAILED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP010',
                quantity: 10,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP011',
                quantity: 10,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456789',
                operationCode: 'OP012',
                quantity: 15,
                transactionType: 'Rejected',
                status: 'OPEN',
                barcodeType: 'Sewing Job',
                transaction: 'Automatic',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP013',
                quantity: 10,
                transactionType: 'Good',
                status: 'FAILED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP014',
                quantity: 10,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456789',
                operationCode: 'OP015',
                quantity: 15,
                transactionType: 'Rejected',
                status: 'OPEN',
                barcodeType: 'Sewing Job',
                transaction: 'Automatic',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP016',
                quantity: 10,
                transactionType: 'Good',
                status: 'FAILED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP017',
                quantity: 10,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456789',
                operationCode: 'OP018',
                quantity: 15,
                transactionType: 'Rejected',
                status: 'OPEN',
                barcodeType: 'Sewing Job',
                transaction: 'Automatic',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP019',
                quantity: 10,
                transactionType: 'Good',
                status: 'FAILED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP020',
                quantity: 10,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456789',
                operationCode: 'OP021',
                quantity: 15,
                transactionType: 'Rejected',
                status: 'OPEN',
                barcodeType: 'Sewing Job',
                transaction: 'Automatic',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP022',
                quantity: 10,
                transactionType: 'Good',
                status: 'FAILED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP023',
                quantity: 10,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456789',
                operationCode: 'OP024',
                quantity: 15,
                transactionType: 'Rejected',
                status: 'FAILED',
                barcodeType: 'Sewing Job',
                transaction: 'Automatic',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP025',
                quantity: 10,
                transactionType: 'Good',
                status: 'FAILED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP026',
                quantity: 10,
                transactionType: 'Good',
                status: 'FAILED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456789',
                operationCode: 'OP027',
                quantity: 15,
                transactionType: 'Rejected',
                status: 'FAILED',
                barcodeType: 'Sewing Job',
                transaction: 'Automatic',
            },
            {
                barcode: 'B123456789',
                operationCode: 'OP028',
                quantity: 10,
                transactionType: 'Good',
                status: 'FAILED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
        ],
    },
    {
        sessionId: 'session-2',
        barcodeDetails: [
            {
                barcode: 'B987654321',
                operationCode: 'OP0023',
                quantity: 5,
                transactionType: 'Rejected',
                status: 'IN PROGRESS',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
        ],
    },
];


export const sewingJobsData = [
    {
        barcodeNo: "B123456789",
        sewingJob: "B123456789",
        operationCodes: ["OP123", "OP124", "OP125"],
        barcodeDetails: [
            {
                barcode: 'B123456789',
                operationCode: 'OP00166',
                quantity: 108,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            // {
            //     barcode: 'B223456789',
            //     operationCode: 'OP00112',
            //     quantity: 156,
            //     transactionType: 'Rejected',
            //     status: 'OPEN',
            //     barcodeType: 'Knit Job',
            //     transaction: 'Automatic',
            // },
        ],
    },
    {
        barcodeNo: "B223456789",
        sewingJob: "Attaching Zippers",
        operationCodes: ["OP126", "OP127"],
        barcodeDetails: [
            {
                barcode: 'B123456790',
                operationCode: 'OP00221',
                quantity: 1022,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456791',
                operationCode: 'OP00552',
                quantity: 1515,
                transactionType: 'Rejected',
                status: 'OPEN',
                barcodeType: 'Knit Job',
                transaction: 'Automatic',
            },
        ],
    },
    {
        barcodeNo: "B987654321",
        sewingJob: "Hemming Pants",
        operationCodes: ["OP128", "OP129", "OP130"],
        barcodeDetails: [
            {
                barcode: 'B123456792',
                operationCode: 'OP00188',
                quantity: 910,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456793',
                operationCode: 'OP0026',
                quantity: 1535,
                transactionType: 'Rejected',
                status: 'OPEN',
                barcodeType: 'Knit Job',
                transaction: 'Automatic',
            },
        ],
    },
    {
        barcodeNo: "B987654322",
        sewingJob: "Stitching Jacket Linings",
        operationCodes: ["OP131", "OP132"],
        barcodeDetails: [
            {
                barcode: 'B123456794',
                operationCode: 'OP00221',
                quantity: 1066,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456795',
                operationCode: 'OP00112',
                quantity: 135,
                transactionType: 'Rejected',
                status: 'OPEN',
                barcodeType: 'Knit Job',
                transaction: 'Automatic',
            },
        ],
    },
    {
        barcodeNo: "B987654323",
        sewingJob: "Embroidery on Shirts",
        operationCodes: ["OP133", "OP134"],
        barcodeDetails: [
            {
                barcode: 'B123456796',
                operationCode: 'OP0013',
                quantity: 110,
                transactionType: 'Good',
                status: 'COMPLETED',
                barcodeType: 'Bundle',
                transaction: 'Manual',
            },
            {
                barcode: 'B223456797',
                operationCode: 'OP0022',
                quantity: 125,
                transactionType: 'Rejected',
                status: 'OPEN',
                barcodeType: 'Knit Job',
                transaction: 'Automatic',
            },
        ],
    }
];


// export const barcodePopoverData = [
//     {
//         barcodeNo: "B123456789",
//         barcodeDetails: {
//             style: "Casual T-shirt",
//             sewingOrderNumber: "MO123456",
//             productName: "Men's Casual T-shirt",
//             deliveryDate: "2024-12-25",
//             plannedProductionDate: "2024-12-15",
//             colorAndSizeDetails: [
//                 {
//                     color: "Red",
//                     sizesDetails: {
//                         s: 10,
//                         m: 15,
//                         l: 20,
//                         xl: 8,
//                         xxl: 5
//                     }
//                 },
//                 {
//                     color: "Blue",
//                     sizesDetails: {
//                         s: 12,
//                         m: 18,
//                         l: 25,
//                         xl: 10,
//                         xxl: 6
//                     }
//                 },
//                 {
//                     color: "Black",
//                     sizesDetails: {
//                         s: 5,
//                         m: 7,
//                         l: 15,
//                         xl: 20,
//                         xxl: 10
//                     }
//                 }
//             ]
//         },

//     },
//     {
//         barcodeNo: "B223456789",
//         barcodeDetails: {
//             style: "Casual T-shirt",
//             sewingOrderNumber: "MO123456",
//             productName: "Men's Casual T-shirt",
//             deliveryDate: "2024-12-25",
//             plannedProductionDate: "2024-12-15",
//             colorAndSizeDetails: [
//                 {
//                     color: "Red",
//                     sizesDetails: {
//                         s: 10,
//                         m: 15,
//                         l: 20,
//                         xl: 8,
//                         xxl: 5
//                     }
//                 },
//                 {
//                     color: "Blue",
//                     sizesDetails: {
//                         s: 12,
//                         m: 18,
//                         l: 25,
//                         xl: 10,
//                         xxl: 6
//                     }
//                 },
//                 {
//                     color: "Black",
//                     sizesDetails: {
//                         s: 5,
//                         m: 7,
//                         l: 15,
//                         xl: 20,
//                         xxl: 10
//                     }
//                 }
//             ]
//         },

//     },
//     {
//         barcodeNo: "B987654321",
//         barcodeDetails: {
//             style: "Casual T-shirt",
//             sewingOrderNumber: "MO123456",
//             productName: "Men's Casual T-shirt",
//             deliveryDate: "2024-12-25",
//             plannedProductionDate: "2024-12-15",
//             colorAndSizeDetails: [
//                 {
//                     color: "Red",
//                     sizesDetails: {
//                         s: 10,
//                         m: 15,
//                         l: 20,
//                         xl: 8,
//                         xxl: 5
//                     }
//                 },
//                 {
//                     color: "Blue",
//                     sizesDetails: {
//                         s: 12,
//                         m: 18,
//                         l: 25,
//                         xl: 10,
//                         xxl: 6
//                     }
//                 },
//                 {
//                     color: "Black",
//                     sizesDetails: {
//                         s: 5,
//                         m: 7,
//                         l: 15,
//                         xl: 20,
//                         xxl: 10
//                     }
//                 }
//             ]
//         },

//     },
//     {
//         barcodeNo: "B987654322",
//         barcodeDetails: {
//             style: "Casual T-shirt",
//             sewingOrderNumber: "MO123456",
//             productName: "Men's Casual T-shirt",
//             deliveryDate: "2024-12-25",
//             plannedProductionDate: "2024-12-15",
//             colorAndSizeDetails: [
//                 {
//                     color: "Red",
//                     sizesDetails: {
//                         s: 10,
//                         m: 15,
//                         l: 20,
//                         xl: 8,
//                         xxl: 5
//                     }
//                 },
//                 {
//                     color: "Blue",
//                     sizesDetails: {
//                         s: 12,
//                         m: 18,
//                         l: 25,
//                         xl: 10,
//                         xxl: 6
//                     }
//                 },
//                 {
//                     color: "Black",
//                     sizesDetails: {
//                         s: 5,
//                         m: 7,
//                         l: 15,
//                         xl: 20,
//                         xxl: 10
//                     }
//                 }
//             ]
//         },

//     },
//     {
//         barcodeNo: "B987654323",
//         barcodeDetails: {
//             style: "Casual T-shirt",
//             sewingOrderNumber: "MO123456",
//             productName: "Men's Casual T-shirt",
//             deliveryDate: "2024-12-25",
//             plannedProductionDate: "2024-12-15",
//             colorAndSizeDetails: [
//                 {
//                     color: "Red",
//                     sizesDetails: {
//                         s: 10,
//                         m: 15,
//                         l: 20,
//                         xl: 8,
//                         xxl: 5
//                     }
//                 },
//                 {
//                     color: "Blue",
//                     sizesDetails: {
//                         s: 12,
//                         m: 18,
//                         l: 25,
//                         xl: 10,
//                         xxl: 6
//                     }
//                 },
//                 {
//                     color: "Black",
//                     sizesDetails: {
//                         s: 5,
//                         m: 7,
//                         l: 15,
//                         xl: 20,
//                         xxl: 10
//                     }
//                 }
//             ]
//         },

//     },
// ]





export const barcodePopoverData = [
    {
        barcodeNo: "B123456789",
        barcodeDetails: {
            style: "Casual T-shirt",
            sewingOrderNumber: "MO123456",
            productName: "Men's Casual T-shirt",
            deliveryDate: "2024-12-25",
            plannedProductionDate: "2024-12-15",
            colorAndSizeDetails: [
                {
                    color: "Red",
                    sizesDetails: [
                        { size: "s", quantity: 10 },
                        { size: "m", quantity: 15 },
                        { size: "l", quantity: 20 },
                        { size: "xl", quantity: 8 },
                        { size: "xxl", quantity: 5 },
                        //   { size: "xxxl", quantity: 5 }
                    ]
                },
                {
                    color: "Blue",
                    sizesDetails: [
                        { size: "s", quantity: 12 },
                        { size: "m", quantity: 18 },
                        { size: "l", quantity: 25 },
                        { size: "xl", quantity: 10 },
                        //   { size: "xxl", quantity: 6 }
                    ]
                },
                {
                    color: "Black",
                    sizesDetails: [
                        { size: "s", quantity: 5 },
                        { size: "m", quantity: 7 },
                        { size: "l", quantity: 15 },
                        //   { size: "xl", quantity: 20 },
                        //   { size: "xxl", quantity: 10 }
                    ]
                }
            ]
        }
    },
    {
        barcodeNo: "B223456789",
        barcodeDetails: {
            style: "Casual T-shirt",
            sewingOrderNumber: "MO123456",
            productName: "Men's Casual T-shirt",
            deliveryDate: "2024-12-25",
            plannedProductionDate: "2024-12-15",
            colorAndSizeDetails: [
                {
                    color: "Red",
                    sizesDetails: [
                        { size: "s", quantity: 10 },
                        //   { size: "m", quantity: 15 },
                        //   { size: "l", quantity: 20 },
                        //   { size: "xl", quantity: 8 },
                        { size: "xxl", quantity: 5 }
                    ]
                },
                {
                    color: "Blue",
                    sizesDetails: [
                        { size: "s", quantity: 12 },
                        //   { size: "m", quantity: 18 },
                        //   { size: "l", quantity: 25 },
                        { size: "xl", quantity: 10 },
                        { size: "xxl", quantity: 6 }
                    ]
                },
                {
                    color: "Black",
                    sizesDetails: [
                        { size: "s", quantity: 5 },
                        { size: "m", quantity: 7 },
                        { size: "l", quantity: 15 },
                        { size: "xl", quantity: 20 },
                        { size: "xxl", quantity: 10 }
                    ]
                }
            ]
        }
    },
    {
        barcodeNo: "B987654321",
        barcodeDetails: {
            style: "Casual T-shirt",
            sewingOrderNumber: "MO123456",
            productName: "Men's Casual T-shirt",
            deliveryDate: "2024-12-25",
            plannedProductionDate: "2024-12-15",
            colorAndSizeDetails: [
                {
                    color: "Red",
                    sizesDetails: [
                        { size: "s", quantity: 10 },
                        { size: "m", quantity: 15 },
                        { size: "l", quantity: 20 },
                        { size: "xl", quantity: 8 },
                        { size: "xxl", quantity: 5 }
                    ]
                },
                {
                    color: "Blue",
                    sizesDetails: [
                        { size: "s", quantity: 12 },
                        { size: "m", quantity: 18 },
                        { size: "l", quantity: 25 },
                        { size: "xl", quantity: 10 },
                        { size: "xxl", quantity: 6 }
                    ]
                },
                {
                    color: "Black",
                    sizesDetails: [
                        { size: "s", quantity: 5 },
                        { size: "m", quantity: 7 },
                        { size: "l", quantity: 15 },
                        { size: "xl", quantity: 20 },
                        { size: "xxl", quantity: 10 }
                    ]
                }
            ]
        }
    },
    {
        barcodeNo: "B987654322",
        barcodeDetails: {
            style: "Casual T-shirt",
            sewingOrderNumber: "MO123456",
            productName: "Men's Casual T-shirt",
            deliveryDate: "2024-12-25",
            plannedProductionDate: "2024-12-15",
            colorAndSizeDetails: [
                {
                    color: "Red",
                    sizesDetails: [
                        { size: "s", quantity: 10 },
                        { size: "m", quantity: 15 },
                        { size: "l", quantity: 20 },
                        { size: "xl", quantity: 8 },
                        { size: "xxl", quantity: 5 }
                    ]
                },
                {
                    color: "Blue",
                    sizesDetails: [
                        { size: "s", quantity: 12 },
                        { size: "m", quantity: 18 },
                        { size: "l", quantity: 25 },
                        { size: "xl", quantity: 10 },
                        { size: "xxl", quantity: 6 }
                    ]
                },
                {
                    color: "Black",
                    sizesDetails: [
                        { size: "s", quantity: 5 },
                        { size: "m", quantity: 7 },
                        { size: "l", quantity: 15 },
                        { size: "xl", quantity: 20 },
                        { size: "xxl", quantity: 10 }
                    ]
                }
            ]
        }
    },
    {
        barcodeNo: "B987654323",
        barcodeDetails: {
            style: "Casual T-shirt",
            sewingOrderNumber: "MO123456",
            productName: "Men's Casual T-shirt",
            deliveryDate: "2024-12-25",
            plannedProductionDate: "2024-12-15",
            colorAndSizeDetails: [
                {
                    color: "Red",
                    sizesDetails: [
                        { size: "s", quantity: 10 },
                        { size: "m", quantity: 15 },
                        { size: "l", quantity: 20 },
                        { size: "xl", quantity: 8 },
                        { size: "xxl", quantity: 5 }
                    ]
                },
                {
                    color: "Blue",
                    sizesDetails: [
                        { size: "s", quantity: 12 },
                        { size: "m", quantity: 18 },
                        { size: "l", quantity: 25 },
                        { size: "xl", quantity: 10 },
                        { size: "xxl", quantity: 6 }
                    ]
                },
                {
                    color: "Black",
                    sizesDetails: [
                        { size: "s", quantity: 5 },
                        { size: "m", quantity: 7 },
                        { size: "l", quantity: 15 },
                        { size: "xl", quantity: 20 },
                        { size: "xxl", quantity: 10 }
                    ]
                }
            ]
        }
    }
];








export const usernameData = {
    usernames: ['john_doe', 'jane_smith', 'sewing_master'],
};



export const sewingJobsDataa = [
    { sewingJobId: "SW1-OP1", operationCode: "OP1" },
    { sewingJobId: "SW2-OP2", operationCode: "OP2" },
    { sewingJobId: "SW3-OP3", operationCode: "OP3" },
];












// viewSewingJobs Data...............










export const sewJobInfoResponseData = [
    {
        sewSerial: 1,
        jobHeaderNo: 1001,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J001",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt A",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 2,
        jobHeaderNo: 1002,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J002",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Pink",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Yellow",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Grey",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Purple",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 3,
        jobHeaderNo: 1003,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J003",
                jobType: "Type C",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt E",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Orange",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt F",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Wheat",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J004",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants C",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants D",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 4,
        jobHeaderNo: 1004,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J002",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 5,
        jobHeaderNo: 1005,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J005",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 6,
        jobHeaderNo: 1006,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J006",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 7,
        jobHeaderNo: 1007,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J007",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 8,
        jobHeaderNo: 1008,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J001",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt A",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 9,
        jobHeaderNo: 1009,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J002",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 10,
        jobHeaderNo: 1010,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J003",
                jobType: "Type C",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt E",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt F",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J004",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants C",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants D",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 11,
        jobHeaderNo: 1011,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J002",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 12,
        jobHeaderNo: 1012,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J005",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 13,
        jobHeaderNo: 1013,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J006",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 14,
        jobHeaderNo: 1014,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J007",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 15,
        jobHeaderNo: 1015,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J001",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt A",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 16,
        jobHeaderNo: 1016,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J002",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 17,
        jobHeaderNo: 1017,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J003",
                jobType: "Type C",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt E",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt F",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J004",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants C",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants D",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 18,
        jobHeaderNo: 1018,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J002",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 19,
        jobHeaderNo: 1019,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J005",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 20,
        jobHeaderNo: 1020,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J006",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
    {
        sewSerial: 21,
        jobHeaderNo: 10021,
        multiColor: true,
        multiSize: false,
        groupInfo: "Group A",
        jobLines: [
            {
                jobNo: "J007",
                jobType: "Type A",
                totalSmv: 10.5,
                isPlanned: true,
                moduleNo: "M01",
                quantity: 150,
                subLines: [
                    {
                        productName: "Shirt C",
                        productType: "Shirt",
                        size: "M",
                        fgColor: "Red",
                        quantity: 75,
                    },
                    {
                        productName: "Shirt B",
                        productType: "Shirt",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 75,
                    },
                ],
            },
            {
                jobNo: "J002",
                jobType: "Type B",
                totalSmv: 15.2,
                isPlanned: false,
                moduleNo: "M02",
                quantity: 200,
                subLines: [
                    {
                        productName: "Pants A",
                        productType: "Pants",
                        size: "32",
                        fgColor: "Green",
                        quantity: 100,
                    },
                    {
                        productName: "Pants B",
                        productType: "Pants",
                        size: "34",
                        fgColor: "Black",
                        quantity: 100,
                    },
                ],
            },
        ],
    },
];


// export const jobLineDummyData = [
//     {
//         barcode:["B123456", "B123457", "B123458", "B123459", "B123460"],
//         jobNo: "J001",
//         jobHeaderNo: 1001,
//         jobType: "Type A",
//         totalSmv: 12.5,
//         isPlanned: true,
//         moduleNo: "M01",
//         quantity: 500,
//         multiColor: true,
//         multiSize: false,
//         groupInfo: "Group 1",
//         subLines: [
//             {
//                 productName: "Shirt",
//                 productType: "Casual",
//                 size: "L",
//                 fgColor: "blue",
//                 quantity: 100,
//             },
//             {
//                 productName: "Shirt",
//                 productType: "Casual",
//                 size: "M",
//                 fgColor: "red",
//                 quantity: 50,
//             },
//             {
//                 productName: "Shirt",
//                 productType: "Casual",
//                 size: "S",
//                 fgColor: "blue",
//                 quantity: 100,
//             },
//             {
//                 productName: "Shirt",
//                 productType: "Casual",
//                 size: "XS",
//                 fgColor: "red",
//                 quantity: 50,
//             },
//             {
//                 productName: "Shirt",
//                 productType: "Casual",
//                 size: "XL",
//                 fgColor: "red",
//                 quantity: 200,
//             },
//         ],
//     },
//     {
//         barcode:["B223456", "B223457"],
//         jobNo: "J002",
//         jobHeaderNo: 1002,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M02",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 2",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         barcode:["B323456", "B323457", "B323458", "B323459"],
//         jobNo: "J003",
//         jobHeaderNo: 1003,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M03",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 3",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 50,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 70,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XS",
//                 fgColor: "black",
//                 quantity: 50,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "M",
//                 fgColor: "gray",
//                 quantity: 30,
//             },
//         ],
//     },
//     {
//         jobNo: "J004",
//         jobHeaderNo: 1004,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M04",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 4",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J005",
//         jobHeaderNo: 1005,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M05",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 5",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J006",
//         jobHeaderNo: 1006,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M06",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 6",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J007",
//         jobHeaderNo: 1007,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M07",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 7",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J008",
//         jobHeaderNo: 1008,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M08",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 8",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J009",
//         jobHeaderNo: 1009,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M09",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 9",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J010",
//         jobHeaderNo: 1010,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M010",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 10",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J0011",
//         jobHeaderNo: 10011,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M011",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 11",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J0012",
//         jobHeaderNo: 10012,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M012",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 12",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J0013",
//         jobHeaderNo: 10013,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M013",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 13",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J0014",
//         jobHeaderNo: 10014,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M014",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 14",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J0015",
//         jobHeaderNo: 10015,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M015",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 15",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J0016",
//         jobHeaderNo: 10016,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M016",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 16",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J0017",
//         jobHeaderNo: 10017,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M017",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 17",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
//     {
//         jobNo: "J0018",
//         jobHeaderNo: 10018,
//         jobType: "Type B",
//         totalSmv: 10.0,
//         isPlanned: false,
//         moduleNo: "M018",
//         quantity: 300,
//         multiColor: false,
//         multiSize: true,
//         groupInfo: "Group 18",
//         subLines: [
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "XL",
//                 fgColor: "black",
//                 quantity: 200,
//             },
//             {
//                 productName: "Pants",
//                 productType: "Formal",
//                 size: "L",
//                 fgColor: "gray",
//                 quantity: 100,
//             },
//         ],
//     },
// ];





// export const sewingJobBatchDetailsData = [
//     {
//       sewingJobBatchNo: 101,
//       jobsGeneratedAt: "10/12/2024, 08:00:00",
//       groupInfo: "Group A ",
//       multiColor: true,
//       multiSize: true,
//       sewingJobQty: 800,
//       logicalBundleQty: 80,
//       progress: 45,
//       jobDetails: [
//         {
//           barcode: ["ABC123", "DEF456"],
//           jobNo: "JOB-001",
//           jobHeaderNo: 101,
//           jobType: "Sewing",
//           totalSmv: 2.5,
//           isPlanned: true,
//           moduleNo: "M01",
//           quantity: 100,
//           multiColor: true,
//           multiSize: true,
//           groupInfo: "Shirts",
//           subLines: [
//             {
//               productName: "Shirt",
//               productType: "Casual",
//               size: "M",
//               fgColor: "Blue",
//               quantity: 50,
//             },
//             {
//               productName: "Shirt",
//               productType: "Casual",
//               size: "L",
//               fgColor: "Blue",
//               quantity: 50,
//             },
//           ],
//         },
//         {
//           barcode: ["XYZ789"],
//           jobNo: "JOB-002",
//           jobHeaderNo: 101,
//           jobType: "Sewing",
//           totalSmv: 3.0,
//           isPlanned: false,
//           moduleNo: "M02",
//           quantity: 150,
//           multiColor: false,
//           multiSize: true,
//           groupInfo: "Shirts",
//           subLines: [
//             {
//               productName: "Shirt",
//               productType: "Casual",
//               size: "S",
//               fgColor: "Red",
//               quantity: 75,
//             },
//             {
//               productName: "Shirt",
//               productType: "Casual",
//               size: "M",
//               fgColor: "Red",
//               quantity: 75,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       sewingJobBatchNo: 102,
//       jobsGeneratedAt: "10/12/2024, 09:00:00",
//       groupInfo: "Group B",
//       multiColor: false,
//       multiSize: true,
//       sewingJobQty: 600,
//       logicalBundleQty: 60,
//       progress: 70,
//       jobDetails: [
//         {
//           barcode: ["LMN321", "OPQ654"],
//           jobNo: "JOB-003",
//           jobHeaderNo: 102,
//           jobType: "Sewing",
//           totalSmv: 4.0,
//           isPlanned: true,
//           moduleNo: "M01",
//           quantity: 200,
//           multiColor: false,
//           multiSize: true,
//           groupInfo: "T-Shirts",
//           subLines: [
//             {
//               productName: "T-Shirt",
//               productType: "Sports",
//               size: "M",
//               fgColor: "Black",
//               quantity: 100,
//             },
//             {
//               productName: "T-Shirt",
//               productType: "Sports",
//               size: "L",
//               fgColor: "Black",
//               quantity: 100,
//             },
//           ],
//         },
//         {
//           barcode: ["RST987"],
//           jobNo: "JOB-004",
//           jobHeaderNo: 102,
//           jobType: "Sewing",
//           totalSmv: 3.5,
//           isPlanned: true,
//           moduleNo: "M02",
//           quantity: 100,
//           multiColor: false,
//           multiSize: true,
//           groupInfo: "T-Shirts",
//           subLines: [
//             {
//               productName: "T-Shirt",
//               productType: "Sports",
//               size: "S",
//               fgColor: "Grey",
//               quantity: 50,
//             },
//             {
//               productName: "T-Shirt",
//               productType: "Sports",
//               size: "M",
//               fgColor: "Grey",
//               quantity: 50,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       sewingJobBatchNo: 103,
//       jobsGeneratedAt: "10/12/2024, 10:00:00",
//       groupInfo: "Group C ",
//       multiColor: true,
//       multiSize: true,
//       sewingJobQty: 1200,
//       logicalBundleQty: 120,
//       progress: 80,
//       jobDetails: [
//         {
//           barcode: ["UVW333", "XYZ654"],
//           jobNo: "JOB-005",
//           jobHeaderNo: 103,
//           jobType: "Sewing",
//           totalSmv: 5.0,
//           isPlanned: true,
//           moduleNo: "M01",
//           quantity: 250,
//           multiColor: true,
//           multiSize: true,
//           groupInfo: "Jackets",
//           subLines: [
//             {
//               productName: "Jacket",
//               productType: "Outerwear",
//               size: "L",
//               fgColor: "Green",
//               quantity: 100,
//             },
//             {
//               productName: "Jacket",
//               productType: "Outerwear",
//               size: "XL",
//               fgColor: "Green",
//               quantity: 100,
//             },
//             {
//               productName: "Jacket",
//               productType: "Outerwear",
//               size: "M",
//               fgColor: "Green",
//               quantity: 50,
//             },
//           ],
//         },
//         {
//           barcode: ["GHI222"],
//           jobNo: "JOB-006",
//           jobHeaderNo: 103,
//           jobType: "Sewing",
//           totalSmv: 6.0,
//           isPlanned: false,
//           moduleNo: "M02",
//           quantity: 300,
//           multiColor: true,
//           multiSize: false,
//           groupInfo: "Coats",
//           subLines: [
//             {
//               productName: "Coat",
//               productType: "Outerwear",
//               size: "L",
//               fgColor: "Blue",
//               quantity: 150,
//             },
//             {
//               productName: "Coat",
//               productType: "Outerwear",
//               size: "XL",
//               fgColor: "Blue",
//               quantity: 150,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       sewingJobBatchNo: 104,
//       jobsGeneratedAt: "10/12/2024, 11:00:00",
//       groupInfo: "Group D",
//       multiColor: false,
//       multiSize: false,
//       sewingJobQty: 400,
//       logicalBundleQty: 40,
//       progress: 55,
//       jobDetails: [
//         {
//           barcode: ["AAA111"],
//           jobNo: "JOB-007",
//           jobHeaderNo: 104,
//           jobType: "Sewing",
//           totalSmv: 4.5,
//           isPlanned: true,
//           moduleNo: "M01",
//           quantity: 100,
//           multiColor: false,
//           multiSize: false,
//           groupInfo: "Pants",
//           subLines: [
//             {
//               productName: "Pant",
//               productType: "Workwear",
//               size: "M",
//               fgColor: "Grey",
//               quantity: 50,
//             },
//             {
//               productName: "Pant",
//               productType: "Workwear",
//               size: "L",
//               fgColor: "Grey",
//               quantity: 50,
//             },
//           ],
//         },
//         {
//           barcode: ["BBB222"],
//           jobNo: "JOB-008",
//           jobHeaderNo: 104,
//           jobType: "Sewing",
//           totalSmv: 3.0,
//           isPlanned: true,
//           moduleNo: "M02",
//           quantity: 150,
//           multiColor: false,
//           multiSize: false,
//           groupInfo: "Pants",
//           subLines: [
//             {
//               productName: "Pant",
//               productType: "Workwear",
//               size: "S",
//               fgColor: "Black",
//               quantity: 75,
//             },
//             {
//               productName: "Pant",
//               productType: "Workwear",
//               size: "M",
//               fgColor: "Black",
//               quantity: 75,
//             },
//           ],
//         },
//       ],
//     },
//   ];





// export const sewingJobBatchDetailsData  = [
//     {
//       sewingJobBatchNo: 1001,
//       jobsGeneratedAt: "10/12/2024, 13:30:00",
//       groupInfo: "Batch A",
//       multiColor: true,
//       multiSize: false,
//       sewingJobQty: 300,
//       logicalBundleQty: 15,
//       progress: 50,
//       jobDetails: [
//         {
//           barcode: [
//             {
//               style: "STYLE001",
//               plantStyleRef: "PSR-1001",
//               cutNo: 101,
//               bundleNo: 2001,
//               color: "Red",
//               size: "M",
//               qty: 50,
//               shade: "Bright Red",
//               component: "Fabric",
//               vendor: "VendorA",
//               moNo: "MO-001",
//               moLines: [1, 2, 3],
//               opCode: 1001,
//               garmentPO: "PO123456",
//               item: "T-Shirt",
//               barcode: "123456789012"
//             },{
//                 style: "STYLE001",
//                 plantStyleRef: "PSR-1001",
//                 cutNo: 101,
//                 bundleNo: 2001,
//                 color: "Red",
//                 size: "M",
//                 qty: 50,
//                 shade: "Bright Red",
//                 component: "Fabric",
//                 vendor: "VendorA",
//                 moNo: "MO-001",
//                 moLines: [1, 2, 3],
//                 opCode: 1001,
//                 garmentPO: "PO123456",
//                 item: "T-Shirt",
//                 barcode: "123456789013"
//               },
//               {
//                 style: "STYLE001",
//                 plantStyleRef: "PSR-1001",
//                 cutNo: 101,
//                 bundleNo: 2001,
//                 color: "Red",
//                 size: "M",
//                 qty: 50,
//                 shade: "Bright Red",
//                 component: "Fabric",
//                 vendor: "VendorA",
//                 moNo: "MO-001",
//                 moLines: [1, 2, 3],
//                 opCode: 1001,
//                 garmentPO: "PO123456",
//                 item: "T-Shirt",
//                 barcode: "123456789014"
//               }
//           ],
//           jobNo: "JOB001",
//           jobHeaderNo: 100,
//           jobType: "Sewing",
//           totalSmv: 180,
//           isPlanned: true,
//           moduleNo: "Module01",
//           quantity: 50,
//           multiColor: true,
//           multiSize: false,
//           groupInfo: "Batch A - T-Shirts",
//           subLines: [
//             {
//               productName: "Fabric",
//               productType: "Cotton",
//               size: "M",
//               fgColor: "Red",
//               quantity: 50
//             }
//           ]
//         },
//         {
//           barcode: [
//             {
//               style: "STYLE002",
//               plantStyleRef: "PSR-1002",
//               cutNo: 102,
//               bundleNo: 2002,
//               color: "Blue",
//               size: "L",
//               qty: 60,
//               shade: "Sky Blue",
//               component: "Fabric",
//               vendor: "VendorB",
//               moNo: "MO-002",
//               moLines: [4, 5],
//               opCode: 1002,
//               garmentPO: "PO123457",
//               item: "Jacket",
//               barcode: "223456789012"
//             }
//           ],
//           jobNo: "JOB002",
//           jobHeaderNo: 101,
//           jobType: "Sewing",
//           totalSmv: 200,
//           isPlanned: true,
//           moduleNo: "Module02",
//           quantity: 60,
//           multiColor: true,
//           multiSize: false,
//           groupInfo: "Batch A - Jackets",
//           subLines: [
//             {
//               productName: "Fabric",
//               productType: "Polyester",
//               size: "L",
//               fgColor: "Blue",
//               quantity: 60
//             }
//           ]
//         }
//       ]
//     },
//     {
//       sewingJobBatchNo: 1002,
//       jobsGeneratedAt: "11/12/2024, 14:00:00",
//       groupInfo: "Batch B",
//       multiColor: false,
//       multiSize: true,
//       sewingJobQty: 400,
//       logicalBundleQty: 20,
//       progress: 75,
//       jobDetails: [
//         {
//           barcode: [
//             {
//               style: "STYLE003",
//               plantStyleRef: "PSR-1003",
//               cutNo: 103,
//               bundleNo: 2003,
//               color: "Black",
//               size: "32",
//               qty: 50,
//               shade: "Jet Black",
//               component: "Denim",
//               vendor: "VendorC",
//               moNo: "MO-003",
//               moLines: [6],
//               opCode: 1003,
//               garmentPO: "PO123458",
//               item: "Jeans",
//               barcode: "323456789012"
//             }
//           ],
//           jobNo: "JOB003",
//           jobHeaderNo: 102,
//           jobType: "Sewing",
//           totalSmv: 220,
//           isPlanned: false,
//           moduleNo: "Module03",
//           quantity: 50,
//           multiColor: false,
//           multiSize: true,
//           groupInfo: "Batch B - Black Jeans",
//           subLines: [
//             {
//               productName: "Denim",
//               productType: "Cotton",
//               size: "32",
//               fgColor: "Black",
//               quantity: 50
//             }
//           ]
//         },
//         {
//           barcode: [
//             {
//               style: "STYLE004",
//               plantStyleRef: "PSR-1004",
//               cutNo: 104,
//               bundleNo: 2004,
//               color: "Blue",
//               size: "34",
//               qty: 80,
//               shade: "Dark Blue",
//               component: "Denim",
//               vendor: "VendorD",
//               moNo: "MO-004",
//               moLines: [7],
//               opCode: 1004,
//               garmentPO: "PO123459",
//               item: "Jeans",
//               barcode: "423456789012"
//             }
//           ],
//           jobNo: "JOB004",
//           jobHeaderNo: 103,
//           jobType: "Sewing",
//           totalSmv: 210,
//           isPlanned: true,
//           moduleNo: "Module04",
//           quantity: 80,
//           multiColor: false,
//           multiSize: true,
//           groupInfo: "Batch B - Blue Jeans",
//           subLines: [
//             {
//               productName: "Denim",
//               productType: "Cotton",
//               size: "34",
//               fgColor: "Blue",
//               quantity: 80
//             }
//           ]
//         }
//       ]
//     }
//   ];








export const sewingJobBatchDetailsData = [
    {
        sewingJobBatchNo: 1001,
        jobsGeneratedAt: "10/12/2024, 13:30:00",
        groupInfo: "Batch A",
        multiColor: true,
        multiSize: false,
        sewingJobQty: 300,
        logicalBundleQty: 15,
        progress: 50,
        jobDetails: [
            {
                barcode: [
                    {
                        style: "STYLE001",
                        plantStyleRef: "PSR-1001",
                        cutNo: 101,
                        bundleNo: 2001,
                        color: "Red",
                        size: "M",
                        qty: 50,
                        shade: "Bright Red",
                        component: "Fabric",
                        vendor: "VendorA",
                        soNo: "SO-001",
                        soLines: [1, 2, 3],
                        opCode: 1001,
                        garmentPO: "PO123456",
                        item: "T-Shirt",
                        barcode: "123456789012"
                    }, {
                        style: "STYLE001",
                        plantStyleRef: "PSR-1001",
                        cutNo: 101,
                        bundleNo: 2001,
                        color: "Red",
                        size: "M",
                        qty: 50,
                        shade: "Bright Red",
                        component: "Fabric",
                        vendor: "VendorA",
                        soNo: "SO-001",
                        soLines: [1, 2, 3],
                        opCode: 1001,
                        garmentPO: "PO123456",
                        item: "T-Shirt",
                        barcode: "123456789013"
                    },
                    {
                        style: "STYLE001",
                        plantStyleRef: "PSR-1001",
                        cutNo: 101,
                        bundleNo: 2001,
                        color: "Red",
                        size: "M",
                        qty: 50,
                        shade: "Bright Red",
                        component: "Fabric",
                        vendor: "VendorA",
                        soNo: "SO-001",
                        soLines: [1, 2, 3],
                        opCode: 1001,
                        garmentPO: "PO123456",
                        item: "T-Shirt",
                        barcode: "123456789014"
                    }
                ],
                jobNo: "JOB001",
                jobHeaderNo: 100,
                jobType: "Sewing",
                totalSmv: 180,
                isPlanned: true,
                moduleNo: "Module01",
                quantity: 50,
                multiColor: true,
                multiSize: false,
                groupInfo: "Batch A - T-Shirts",
                subLines: [
                    {
                        productName: "Fabric",
                        productType: "Cotton",
                        size: "M",
                        fgColor: "Red",
                        quantity: 50
                    }
                ]
            },
            {
                barcode: [
                    {
                        style: "STYLE002",
                        plantStyleRef: "PSR-1002",
                        cutNo: 102,
                        bundleNo: 2002,
                        color: "Blue",
                        size: "L",
                        qty: 60,
                        shade: "Sky Blue",
                        component: "Fabric",
                        vendor: "VendorB",
                        soNo: "SO-002",
                        soLines: [4, 5],
                        opCode: 1002,
                        garmentPO: "PO123457",
                        item: "Jacket",
                        barcode: "223456789012"
                    }
                ],
                jobNo: "JOB002",
                jobHeaderNo: 101,
                jobType: "Sewing",
                totalSmv: 200,
                isPlanned: true,
                moduleNo: "Module02",
                quantity: 60,
                multiColor: true,
                multiSize: false,
                groupInfo: "Batch A - Jackets",
                subLines: [
                    {
                        productName: "Fabric",
                        productType: "Polyester",
                        size: "L",
                        fgColor: "Blue",
                        quantity: 60
                    }
                ]
            }
        ]
    },
    {
        sewingJobBatchNo: 1002,
        jobsGeneratedAt: "11/12/2024, 14:00:00",
        groupInfo: "Batch B",
        multiColor: false,
        multiSize: true,
        sewingJobQty: 400,
        logicalBundleQty: 20,
        progress: 75,
        jobDetails: [
            {
                barcode: [
                    {
                        style: "STYLE003",
                        plantStyleRef: "PSR-1003",
                        cutNo: 103,
                        bundleNo: 2003,
                        color: "Black",
                        size: "32",
                        qty: 50,
                        shade: "Jet Black",
                        component: "Denim",
                        vendor: "VendorC",
                        soNo: "SO-003",
                        soLines: [6],
                        opCode: 1003,
                        garmentPO: "PO123458",
                        item: "Jeans",
                        barcode: "323456789012"
                    }
                ],
                jobNo: "JOB003",
                jobHeaderNo: 102,
                jobType: "Sewing",
                totalSmv: 220,
                isPlanned: false,
                moduleNo: "Module03",
                quantity: 50,
                multiColor: false,
                multiSize: true,
                groupInfo: "Batch B - Black Jeans",
                subLines: [
                    {
                        productName: "Denim",
                        productType: "Cotton",
                        size: "32",
                        fgColor: "Black",
                        quantity: 50
                    }
                ]
            },
            {
                barcode: [
                    {
                        style: "STYLE004",
                        plantStyleRef: "PSR-1004",
                        cutNo: 104,
                        bundleNo: 2004,
                        color: "Blue",
                        size: "34",
                        qty: 80,
                        shade: "Dark Blue",
                        component: "Denim",
                        vendor: "VendorD",
                        soNo: "SO-004",
                        soLines: [7],
                        opCode: 1004,
                        garmentPO: "PO123459",
                        item: "Jeans",
                        barcode: "423456789012"
                    }
                ],
                jobNo: "JOB004",
                jobHeaderNo: 103,
                jobType: "Sewing",
                totalSmv: 210,
                isPlanned: true,
                moduleNo: "Module04",
                quantity: 80,
                multiColor: false,
                multiSize: true,
                groupInfo: "Batch B - Blue Jeans",
                subLines: [
                    {
                        productName: "Denim",
                        productType: "Cotton",
                        size: "34",
                        fgColor: "Blue",
                        quantity: 80
                    }
                ]
            }
        ]
    }
];















export enum SoConfigStatusEnum {
    OPEN = 'OP',
    IN_PROGRESS = 'INP'
}

export enum ProcessTypeEnum {
    LAY = 'LAY',
    CUT = 'CUT',
    EMB = 'EMB',
    SEW = 'SEW',
    WASH = 'WASH',
    FIN = 'FIN',
    INS = 'INS',
    IRON = 'IRON',
    DYE = 'DYE',
    FOLD = 'FOLD',
    PACK = 'PACK',
    KNIT = 'KNIT',
    LINK = 'LINK',
    EMBR = 'EMBR'
}




export const siSaleOrderInfoMockData = [{
    soNumber: "SO123456",
    soPk: 1001,
    confirmed: true,
    configStatus: SoConfigStatusEnum.IN_PROGRESS,
    style: "Casual T-Shirt",
    uploadedDate: "2025-03-23",
    soLineModel: [
        {
            soLineNo: "SO123456-01",
            soLinePk: 2001,
            configStatus: SoConfigStatusEnum.IN_PROGRESS,
            soLineProducts: [
                {
                    soLine: "SO123456-01",
                    soNumber: "SO123456",
                    productName: "Casual T-Shirt",
                    fgColor: "Red",
                    subLines: [
                        {
                            color: "Red",
                            size: "M",
                            qty: 100,
                            soProdSubLineAttrs: {
                                destination: "Warehouse A",
                                delDate: "2025-04-01",
                                vpo: "VPO123",
                                prodName: "Casual T-Shirt",
                                co: "Company A",
                                style: "Casual T-Shirt",
                                color: "Red",
                                size: "M",
                                qty: 100,
                                refNo: "REF12345"
                            },
                            pk: 3001
                        },
                        {
                            color: "Red",
                            size: "L",
                            qty: 150,
                            soProdSubLineAttrs: {
                                destination: "Warehouse B",
                                delDate: "2025-04-05",
                                vpo: "VPO124",
                                prodName: "Casual T-Shirt",
                                co: "Company A",
                                style: "Casual T-Shirt",
                                color: "Red",
                                size: "L",
                                qty: 150,
                                refNo: "REF12346"
                            },
                            pk: 3002
                        }
                    ],
                    rmInfo: [
                        {
                            itemCode: "RM001",
                            itemDesc: "Cotton Fabric",
                            avgCons: 2.5,
                            itemColor: "Red",
                            seq: 1,
                        },
                        {
                            itemCode: "RM002",
                            itemDesc: "Thread",
                            avgCons: 0.1,
                            itemColor: "Red",
                            seq: 2,
                        }
                    ],
                    opInfo: [
                        {
                            opCode: "OP001",
                            processType: ProcessTypeEnum.LAY,
                            opName: "Fabric Layering",
                            smv: 10
                        },
                        {
                            opCode: "OP002",
                            processType: ProcessTypeEnum.SEW,
                            opName: "Sewing",
                            smv: 20
                        }
                    ],
                    opRmInfo: [
                        {
                            opCode: "OP001",
                            processType: ProcessTypeEnum.LAY,
                            bomInfo: {
                                itemCode: "RM001",
                                itemDesc: "Cotton Fabric",
                                avgCons: 2.5,
                                itemColor: "Red",
                                seq: 1,
                            }
                        }
                    ],
                    soLineProdcutAttrs: {
                        delDates: ["2025-04-01", "2025-04-05"],
                        destinations: ["Warehouse A", "Warehouse B"],
                        styles: ["Casual T-Shirt"],
                        products: ["Casual T-Shirt"],
                        co: ["Company A"],
                        vpo: ["VPO123", "VPO124"]
                    }
                }
            ],



            // soLineProducts: [
            //     {
            //         "soLine": "SO123456-01",
            //         "soNumber": "SO123456",
            //         "productName": "Casual T-Shirt",
            //         "fgColor": "Red",
            //         "subLines": [
            //             {
            //                 "color": "Red",
            //                 "size": "M",
            //                 "qty": 100,
            //                 "soProdSubLineAttrs": {
            //                     "destination": "Warehouse A",
            //                     "delDate": "2025-04-01",
            //                     "vpo": "VPO123",
            //                     "prodName": "Casual T-Shirt",
            //                     "co": "Company A",
            //                     "style": "Casual T-Shirt",
            //                     "color": "Red",
            //                     "size": "M",
            //                     "qty": 100,
            //                     "refNo": "REF12345"
            //                 },
            //                 "pk": 3001
            //             },
            //             {
            //                 "color": "Red",
            //                 "size": "L",
            //                 "qty": 150,
            //                 "soProdSubLineAttrs": {
            //                     "destination": "Warehouse B",
            //                     "delDate": "2025-04-05",
            //                     "vpo": "VPO124",
            //                     "prodName": "Casual T-Shirt",
            //                     "co": "Company A",
            //                     "style": "Casual T-Shirt",
            //                     "color": "Red",
            //                     "size": "L",
            //                     "qty": 150,
            //                     "refNo": "REF12346"
            //                 },
            //                 "pk": 3002
            //             }
            //         ],
            //         "rmInfo": [
            //             {
            //                 "itemCode": "RM001",
            //                 "itemDesc": "Cotton Fabric",
            //                 "avgCons": 2.5,
            //                 "itemColor": "Red",
            //                 "seq": 1
            //             },
            //             {
            //                 "itemCode": "RM002",
            //                 "itemDesc": "Thread",
            //                 "avgCons": 0.1,
            //                 "itemColor": "Red",
            //                 "seq": 2
            //             }
            //         ],
            //         "opInfo": [
            //             {
            //                 "opCode": "OP001",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "opName": "Fabric Layering",
            //                 "smv": 10
            //             },
            //             {
            //                 "opCode": "OP002",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "opName": "Sewing",
            //                 "smv": 20
            //             }
            //         ],
            //         "opRmInfo": [
            //             {
            //                 "opCode": "OP001",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "bomInfo": {
            //                     "itemCode": "RM001",
            //                     "itemDesc": "Cotton Fabric",
            //                     "avgCons": 2.5,
            //                     "itemColor": "Red",
            //                     "seq": 1
            //                 }
            //             }
            //         ],
            //         "soLineProdcutAttrs": {
            //             "delDates": ["2025-04-01", "2025-04-05"],
            //             "destinations": ["Warehouse A", "Warehouse B"],
            //             "styles": ["Casual T-Shirt"],
            //             "products": ["Casual T-Shirt"],
            //             "co": ["Company A"],
            //             "vpo": ["VPO123", "VPO124"]
            //         }
            //     },
            //     {
            //         "soLine": "SO123457-01",
            //         "soNumber": "SO123457",
            //         "productName": "Formal Shirt",
            //         "fgColor": "Blue",
            //         "subLines": [
            //             {
            //                 "color": "Blue",
            //                 "size": "M",
            //                 "qty": 120,
            //                 "soProdSubLineAttrs": {
            //                     "destination": "Warehouse C",
            //                     "delDate": "2025-05-01",
            //                     "vpo": "VPO125",
            //                     "prodName": "Formal Shirt",
            //                     "co": "Company B",
            //                     "style": "Formal Shirt",
            //                     "color": "Blue",
            //                     "size": "M",
            //                     "qty": 120,
            //                     "refNo": "REF12347"
            //                 },
            //                 "pk": 3003
            //             },
            //             {
            //                 "color": "Blue",
            //                 "size": "L",
            //                 "qty": 200,
            //                 "soProdSubLineAttrs": {
            //                     "destination": "Warehouse D",
            //                     "delDate": "2025-05-10",
            //                     "vpo": "VPO126",
            //                     "prodName": "Formal Shirt",
            //                     "co": "Company B",
            //                     "style": "Formal Shirt",
            //                     "color": "Blue",
            //                     "size": "L",
            //                     "qty": 200,
            //                     "refNo": "REF12348"
            //                 },
            //                 "pk": 3004
            //             }
            //         ],
            //         "rmInfo": [
            //             {
            //                 "itemCode": "RM003",
            //                 "itemDesc": "Cotton Fabric",
            //                 "avgCons": 3.0,
            //                 "itemColor": "Blue",
            //                 "seq": 1
            //             },
            //             {
            //                 "itemCode": "RM004",
            //                 "itemDesc": "Thread",
            //                 "avgCons": 0.15,
            //                 "itemColor": "Blue",
            //                 "seq": 2
            //             }
            //         ],
            //         "opInfo": [
            //             {
            //                 "opCode": "OP003",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "opName": "Fabric Layering",
            //                 "smv": 12
            //             },
            //             {
            //                 "opCode": "OP004",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "opName": "Sewing",
            //                 "smv": 25
            //             }
            //         ],
            //         "opRmInfo": [
            //             {
            //                 "opCode": "OP003",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "bomInfo": {
            //                     "itemCode": "RM003",
            //                     "itemDesc": "Cotton Fabric",
            //                     "avgCons": 3.0,
            //                     "itemColor": "Blue",
            //                     "seq": 1
            //                 }
            //             }
            //         ],
            //         "soLineProdcutAttrs": {
            //             "delDates": ["2025-05-01", "2025-05-10"],
            //             "destinations": ["Warehouse C", "Warehouse D"],
            //             "styles": ["Formal Shirt"],
            //             "products": ["Formal Shirt"],
            //             "co": ["Company B"],
            //             "vpo": ["VPO125", "VPO126"]
            //         }
            //     },
            //     {
            //         "soLine": "SO123458-01",
            //         "soNumber": "SO123458",
            //         "productName": "Sports Jacket",
            //         "fgColor": "Black",
            //         "subLines": [
            //             {
            //                 "color": "Black",
            //                 "size": "M",
            //                 "qty": 80,
            //                 "soProdSubLineAttrs": {
            //                     "destination": "Warehouse E",
            //                     "delDate": "2025-06-01",
            //                     "vpo": "VPO127",
            //                     "prodName": "Sports Jacket",
            //                     "co": "Company C",
            //                     "style": "Sports Jacket",
            //                     "color": "Black",
            //                     "size": "M",
            //                     "qty": 80,
            //                     "refNo": "REF12349"
            //                 },
            //                 "pk": 3005
            //             },
            //             {
            //                 "color": "Black",
            //                 "size": "L",
            //                 "qty": 120,
            //                 "soProdSubLineAttrs": {
            //                     "destination": "Warehouse F",
            //                     "delDate": "2025-06-05",
            //                     "vpo": "VPO128",
            //                     "prodName": "Sports Jacket",
            //                     "co": "Company C",
            //                     "style": "Sports Jacket",
            //                     "color": "Black",
            //                     "size": "L",
            //                     "qty": 120,
            //                     "refNo": "REF12350"
            //                 },
            //                 "pk": 3006
            //             }
            //         ],
            //         "rmInfo": [
            //             {
            //                 "itemCode": "RM005",
            //                 "itemDesc": "Polyester Fabric",
            //                 "avgCons": 2.0,
            //                 "itemColor": "Black",
            //                 "seq": 1
            //             },
            //             {
            //                 "itemCode": "RM006",
            //                 "itemDesc": "Thread",
            //                 "avgCons": 0.12,
            //                 "itemColor": "Black",
            //                 "seq": 2
            //             }
            //         ],
            //         "opInfo": [
            //             {
            //                 "opCode": "OP005",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "opName": "Fabric Layering",
            //                 "smv": 15
            //             },
            //             {
            //                 "opCode": "OP006",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "opName": "Sewing",
            //                 "smv": 30
            //             }
            //         ],
            //         "opRmInfo": [
            //             {
            //                 "opCode": "OP005",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "bomInfo": {
            //                     "itemCode": "RM005",
            //                     "itemDesc": "Polyester Fabric",
            //                     "avgCons": 2.0,
            //                     "itemColor": "Black",
            //                     "seq": 1
            //                 }
            //             }
            //         ],
            //         "soLineProdcutAttrs": {
            //             "delDates": ["2025-06-01", "2025-06-05"],
            //             "destinations": ["Warehouse E", "Warehouse F"],
            //             "styles": ["Sports Jacket"],
            //             "products": ["Sports Jacket"],
            //             "co": ["Company C"],
            //             "vpo": ["VPO127", "VPO128"]
            //         }
            //     },
            //     {
            //         "soLine": "SO123459-01",
            //         "soNumber": "SO123459",
            //         "productName": "Winter Coat",
            //         "fgColor": "Green",
            //         "subLines": [
            //             {
            //                 "color": "Green",
            //                 "size": "M",
            //                 "qty": 90,
            //                 "soProdSubLineAttrs": {
            //                     "destination": "Warehouse G",
            //                     "delDate": "2025-07-01",
            //                     "vpo": "VPO129",
            //                     "prodName": "Winter Coat",
            //                     "co": "Company D",
            //                     "style": "Winter Coat",
            //                     "color": "Green",
            //                     "size": "M",
            //                     "qty": 90,
            //                     "refNo": "REF12351"
            //                 },
            //                 "pk": 3007
            //             },
            //             {
            //                 "color": "Green",
            //                 "size": "L",
            //                 "qty": 140,
            //                 "soProdSubLineAttrs": {
            //                     "destination": "Warehouse H",
            //                     "delDate": "2025-07-10",
            //                     "vpo": "VPO130",
            //                     "prodName": "Winter Coat",
            //                     "co": "Company D",
            //                     "style": "Winter Coat",
            //                     "color": "Green",
            //                     "size": "L",
            //                     "qty": 140,
            //                     "refNo": "REF12352"
            //                 },
            //                 "pk": 3008
            //             }
            //         ],
            //         "rmInfo": [
            //             {
            //                 "itemCode": "RM007",
            //                 "itemDesc": "Wool Fabric",
            //                 "avgCons": 4.0,
            //                 "itemColor": "Green",
            //                 "seq": 1
            //             },
            //             {
            //                 "itemCode": "RM008",
            //                 "itemDesc": "Thread",
            //                 "avgCons": 0.2,
            //                 "itemColor": "Green",
            //                 "seq": 2
            //             }
            //         ],
            //         "opInfo": [
            //             {
            //                 "opCode": "OP007",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "opName": "Fabric Layering",
            //                 "smv": 18
            //             },
            //             {
            //                 "opCode": "OP008",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "opName": "Sewing",
            //                 "smv": 35
            //             }
            //         ],
            //         "opRmInfo": [
            //             {
            //                 "opCode": "OP007",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "bomInfo": {
            //                     "itemCode": "RM007",
            //                     "itemDesc": "Wool Fabric",
            //                     "avgCons": 4.0,
            //                     "itemColor": "Green",
            //                     "seq": 1
            //                 }
            //             }
            //         ],
            //         "soLineProdcutAttrs": {
            //             "delDates": ["2025-07-01", "2025-07-10"],
            //             "destinations": ["Warehouse G", "Warehouse H"],
            //             "styles": ["Winter Coat"],
            //             "products": ["Winter Coat"],
            //             "co": ["Company D"],
            //             "vpo": ["VPO129", "VPO130"]
            //         }
            //     },
            //     {
            //         "soLine": "SO123460-01",
            //         "soNumber": "SO123460",
            //         "productName": "Leather Jacket",
            //         "fgColor": "Brown",
            //         "subLines": [
            //             {
            //                 "color": "Brown",
            //                 "size": "M",
            //                 "qty": 75,
            //                 "soProdSubLineAttrs": {
            //                     "destination": "Warehouse I",
            //                     "delDate": "2025-08-01",
            //                     "vpo": "VPO131",
            //                     "prodName": "Leather Jacket",
            //                     "co": "Company E",
            //                     "style": "Leather Jacket",
            //                     "color": "Brown",
            //                     "size": "M",
            //                     "qty": 75,
            //                     "refNo": "REF12353"
            //                 },
            //                 "pk": 3009
            //             },
            //             {
            //                 "color": "Brown",
            //                 "size": "L",
            //                 "qty": 130,
            //                 "soProdSubLineAttrs": {
            //                     "destination": "Warehouse J",
            //                     "delDate": "2025-08-10",
            //                     "vpo": "VPO132",
            //                     "prodName": "Leather Jacket",
            //                     "co": "Company E",
            //                     "style": "Leather Jacket",
            //                     "color": "Brown",
            //                     "size": "L",
            //                     "qty": 130,
            //                     "refNo": "REF12354"
            //                 },
            //                 "pk": 3010
            //             }
            //         ],
            //         "rmInfo": [
            //             {
            //                 "itemCode": "RM009",
            //                 "itemDesc": "Leather Fabric",
            //                 "avgCons": 5.0,
            //                 "itemColor": "Brown",
            //                 "seq": 1
            //             },
            //             {
            //                 "itemCode": "RM010",
            //                 "itemDesc": "Thread",
            //                 "avgCons": 0.25,
            //                 "itemColor": "Brown",
            //                 "seq": 2
            //             }
            //         ],
            //         "opInfo": [
            //             {
            //                 "opCode": "OP009",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "opName": "Leather Layering",
            //                 "smv": 20
            //             },
            //             {
            //                 "opCode": "OP010",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "opName": "Sewing",
            //                 "smv": 40
            //             }
            //         ],
            //         "opRmInfo": [
            //             {
            //                 "opCode": "OP009",
            //                 "processType": ProcessTypeEnum.LAY,
            //                 "bomInfo": {
            //                     "itemCode": "RM009",
            //                     "itemDesc": "Leather Fabric",
            //                     "avgCons": 5.0,
            //                     "itemColor": "Brown",
            //                     "seq": 1
            //                 }
            //             }
            //         ],
            //         "soLineProdcutAttrs": {
            //             "delDates": ["2025-08-01", "2025-08-10"],
            //             "destinations": ["Warehouse I", "Warehouse J"],
            //             "styles": ["Leather Jacket"],
            //             "products": ["Leather Jacket"],
            //             "co": ["Company E"],
            //             "vpo": ["VPO131", "VPO132"]
            //         }
            //     }
            // ],

















            soLineAttrs: {
                delDates: ["2025-04-01", "2025-04-05"],
                destinations: ["Warehouse A", "Warehouse B"],
                styles: ["Casual T-Shirt"],
                products: ["Casual T-Shirt"],
                co: ["Company A"],
                vpo: ["VPO123", "VPO124"]
            }
        }
    ],
    soAtrs: {
        delDates: ["2025-04-01", "2025-04-05"],
        destinations: ["Warehouse A", "Warehouse B"],
        styles: ["Casual T-Shirt"],
        products: ["Casual T-Shirt"],
        co: ["Company A"],
        vpo: ["VPO123", "VPO124"]
    },
    soRm: [
        {
            itemCode: "RM001",
            itemDesc: "Cotton Fabric",
            avgCons: 2.5,
            itemColor: "Red",
            seq: 1,
            processType: ProcessTypeEnum.LAY
        },
        {
            itemCode: "RM002",
            itemDesc: "Thread",
            avgCons: 0.1,
            itemColor: "Red",
            seq: 2,
            processType: ProcessTypeEnum.SEW
        }
    ]
}];
























// so-line-table dummy data 



export enum OrderTypeEnum {
    ORIGINAL = 'OR',
    EXTRA_SHIPMENT = 'ES',
    SAMPLE = 'SA',
    EXCESS = 'EX',
    CUT_WASTAGE = 'CW'
}

export const soLineTableData = [{
    soPk: 1,
    soNumber: "SO-12345",
    soLineRevisions: [
        {
            soLineNumber: "line 1",
            soLinePk: 101,
            soNumber: "SO-123456",
            productLevelRevisions: [
                {
                    styleCode: "ST-001",
                    productCode: "P-001",
                    fgColor: "red",
                    oqTypeQtys: [
                        {
                            oqType: OrderTypeEnum.ORIGINAL,
                            sizeQtys: [
                                { subLineId: 1001, size: "SMALL", qty: 120 },
                                { subLineId: 1002, size: "MEDIUM", qty: 120 },
                                { subLineId: 1003, size: "LARGE", qty: 150 }
                            ]
                        },

                    ]
                }
            ]
        },
        {
            soLineNumber: "line 2",
            soLinePk: 102,
            soNumber: "SO-12345",
            productLevelRevisions: [
                {
                    styleCode: "ST-002",
                    productCode: "P-002",
                    fgColor: "red",
                    oqTypeQtys: [
                        {
                            oqType: OrderTypeEnum.ORIGINAL,
                            sizeQtys: [
                                { subLineId: 1004, size: "SMALL", qty: 120 },
                                { subLineId: 1005, size: "MEDIUM", qty: 120 },
                                { subLineId: 1006, size: "LARGE", qty: 150 }
                            ]
                        },

                    ]
                }
            ]
        }
    ]
},
]












export const styleInfoData = [
    {
        styleCode: 'STY123',
        styleName: 'Casual Shirt',
        styleDescription: 'A comfortable and stylish casual shirt for everyday wear.'
    },
    {
        styleCode: 'STY456',
        styleName: 'Formal Blazer',
        styleDescription: 'A sleek and elegant formal blazer for business and events.'
    },
    {
        styleCode: 'STY789',
        styleName: 'Sports Jacket',
        styleDescription: 'A durable sports jacket for active wear and outdoor activities.'
    }
];

export const productInfoData = [
    {
        productCode: 'PDT001',
        productType: 'Apparel',
        productName: 'Casual Shirt',
        fgColor: 'Red'
    },
    {
        productCode: 'PDT002',
        productType: 'Apparel',
        productName: 'Formal Blazer',
        fgColor: 'Blue'
    },
    {
        productCode: 'PDT003',
        productType: 'Apparel',
        productName: 'Sports Jacket',
        fgColor: 'Green'
    }
];


export const processingOrderInfoData = [
    {
        processingSerial: 1,
        prcOrdDescription: 'Initial order for casual shirts.',
        styleCode: 'STY123',
        processType: 'Cutting', // Assuming 'Cutting' is a valid value in ProcessTypeEnum
        prcOrdSoInfo: [
            {
                orderNumber: 'ORD123',
                customerName: 'John Doe',
                quantity: 100
            },
            {
                orderNumber: 'ORD456',
                customerName: 'Jane Smith',
                quantity: 200
            }
        ],
        prcOrdFeatures: [
            { featureCode: 'FEAT001', featureDescription: 'Pocket on the left chest' },
            { featureCode: 'FEAT002', featureDescription: 'Short sleeves' }
        ]
    },
    {
        processingSerial: 2,
        prcOrdDescription: 'Formal Blazer production order.',
        styleCode: 'STY456',
        processType: 'Sewing', // Assuming 'Sewing' is a valid value in ProcessTypeEnum
        prcOrdSoInfo: [
            {
                orderNumber: 'ORD789',
                customerName: 'Alice Johnson',
                quantity: 150
            }
        ],
        prcOrdFeatures: [
            { featureCode: 'FEAT003', featureDescription: 'Slim fit tailoring' },
            { featureCode: 'FEAT004', featureDescription: 'Two-button closure' }
        ]
    }
];



export const knitGroupQtySummaryData = [
    {
        knitGroup: "KnitGroup1",
        itemCodes: ["Item001", "Item002", "Item003"],
        components: ["ComponentA", "ComponentB", "ComponentC"],
        sizeWiseKnitGroupInfo: [
            { size: "S", knitRatioQty: 100 },
            { size: "M", knitRatioQty: 150 },
            { size: "L", knitRatioQty: 120 },
            { size: "XL", knitRatioQty: 80 }
        ]
    },
    {
        knitGroup: "KnitGroup2",
        itemCodes: ["Item004", "Item005", "Item006"],
        components: ["ComponentD", "ComponentE", "ComponentF"],
        sizeWiseKnitGroupInfo: [
            { size: "S", knitRatioQty: 200 },
            { size: "M", knitRatioQty: 250 },
            { size: "L", knitRatioQty: 180 },
            { size: "XL", knitRatioQty: 150 }
        ]
    },
    {
        knitGroup: "KnitGroup3",
        itemCodes: ["Item007", "Item008", "Item009"],
        components: ["ComponentG", "ComponentH", "ComponentI"],
        sizeWiseKnitGroupInfo: [
            { size: "S", knitRatioQty: 50 },
            { size: "M", knitRatioQty: 100 },
            { size: "L", knitRatioQty: 75 },
            { size: "XL", knitRatioQty: 40 }
        ]
    }
];




// export const  knitGroupMaterialRequirement = {
//     knitGroup: "KnitGroup1",
//     itemWiseMaterialRequirement: [
//         {
//             itemCode: "Item001",
//             itemName: "Knitted Fabric",
//             itemDescription: "High-quality knitted fabric for shirts",
//             itemColor: "Red",
//             totalRequiredQty: 500,
//             objectWiseDetail: [
//                 {
//                     objectType: "roll",
//                     objectCode: "Roll001",
//                     locationCode: "Loc001",
//                     supplierCode: "SupplierA",
//                     VPO: "VPO123",
//                     issuedQuantity: 0,
//                     alreadyAllocatedQuantity: 0,
//                     allocatingQuantity: 200
//                 },
//                 {
//                     objectType: "cone",
//                     objectCode: "Cone002",
//                     locationCode: "Loc002",
//                     supplierCode: "SupplierB",
//                     VPO: "VPO456",
//                     issuedQuantity: 0,
//                     alreadyAllocatedQuantity: 0,
//                     allocatingQuantity: 300
//                 },
//                 {
//                     objectType: "bale",
//                     objectCode: "Bale003",
//                     locationCode: "Loc003",
//                     supplierCode: "SupplierC",
//                     VPO: "VPO457",
//                     issuedQuantity: 0,
//                     alreadyAllocatedQuantity: 0,
//                     allocatingQuantity: 700
//                 }
//             ]
//         },
//         {
//             itemCode: "Item002",
//             itemName: "Elastic Band",
//             itemDescription: "Elastic band for waistbands",
//             itemColor: "Black",
//             totalRequiredQty: 100,
//             objectWiseDetail: [
//                 {
//                     objectType: "bile",
//                     objectCode: "Bile007",
//                     locationCode: "Loc008",
//                     supplierCode: "SupplierD",
//                     VPO: "VPO789",
//                     issuedQuantity: 0,
//                     alreadyAllocatedQuantity: 0,
//                     allocatingQuantity: 100
//                 },
//                 {
//                     objectType: "cone",
//                     objectCode: "Cone005",
//                     locationCode: "Loc005",
//                     supplierCode: "SupplierE",
//                     VPO: "VPO456",
//                     issuedQuantity: 0,
//                     alreadyAllocatedQuantity: 0,
//                     allocatingQuantity: 300
//                 }
//             ]
//         }
//     ]
// };




export const knitGroupMaterialRequirement = {
    knitGroup: "KnitGroup2",
    itemWiseMaterialRequirement: [
        {
            itemCode: "Item001",
            itemName: "Knitted Fabric",
            itemDescription: "High-quality knitted fabric for shirts",
            itemColor: "Red",
            totalRequiredQty: 500,
            pendingQty: 150,  // Assuming no pending quantity here
            objectWiseDetail: [
                {
                    objectType: "roll",
                    objectCode: "Roll001",
                    locationCode: "Loc001",
                    supplierCode: "SupplierA",
                    VPO: "VPO123",
                    issuedQuantity: 450,
                    alreadyAllocatedQuantity: 250,
                    availableQuantity: 500, // Added availableQuantity
                    allocatingQuantity: 200
                },
                {
                    objectType: "cone",
                    objectCode: "Cone002",
                    locationCode: "Loc002",
                    supplierCode: "SupplierB",
                    VPO: "VPO456",
                    issuedQuantity: 1110,
                    alreadyAllocatedQuantity: 240,
                    availableQuantity: 300, // Added availableQuantity
                    allocatingQuantity: 300
                },
                {
                    objectType: "bale",
                    objectCode: "Bale003",
                    locationCode: "Loc003",
                    supplierCode: "SupplierC",
                    VPO: "VPO457",
                    issuedQuantity: 700,
                    alreadyAllocatedQuantity: 700,
                    availableQuantity: 700, // Added availableQuantity
                    allocatingQuantity: 700
                }
            ]
        },
        {
            itemCode: "Item002",
            itemName: "Elastic Band",
            itemDescription: "Elastic band for waistbands",
            itemColor: "Black",
            totalRequiredQty: 100,
            pendingQty: 300,  // Assuming no pending quantity here
            objectWiseDetail: [
                {
                    objectType: "bile", // I noticed this should probably be "bale", not "bile"
                    objectCode: "Bile007",
                    locationCode: "Loc008",
                    supplierCode: "SupplierD",
                    VPO: "VPO789",
                    issuedQuantity: 500,
                    alreadyAllocatedQuantity: 100,
                    availableQuantity: 100, // Added availableQuantity
                    allocatingQuantity: 100
                },
                {
                    objectType: "cone",
                    objectCode: "Cone005",
                    locationCode: "Loc005",
                    supplierCode: "SupplierE",
                    VPO: "VPO456",
                    issuedQuantity: 100,
                    alreadyAllocatedQuantity: 70,
                    availableQuantity: 300, // Added availableQuantity
                    allocatingQuantity: 300
                }
            ]
        }
    ]
};














export const knitGroupDataaaa = [
    {
        knitGroup: "KnitGroup1",
        knitJobs: [
            {
                knitGroup: "KnitGroup1",
                jobNumber: "KNIT-001",
                jobQty: 100,
                productSpecs: {
                    sku: "SK12345",
                    productName: "Knit Sweater",
                    productDescription: "A comfortable knit sweater for winter",
                    material: "Wool",
                },
                processingSerial: 6789,
                colorSizeInfo: {
                    fgColor: "Red",
                    sizeQtys: [
                        { size: "S", qty: 100 },
                        { size: "M", qty: 50 },
                        { size: "L", qty: 30 },
                    ],
                },
                barcodeInfo: [
                    { barcode: "1234567890", itemCode: "BC-001", printed: true },
                    { barcode: "9876543210", itemCode: "BC-002", printed: false },
                ],
                jobFeatures: {
                    style: "Style-1",
                    co: ["CO-1", "CO-2"],
                    vpo: ["VPO-001", "VPO-002"],
                    moLines: ["ML001", "ML002"],
                    mo: ["M001", "M002"]
                },
                barcodePrinted: false,
                materialStatus: "Pending", // KJ_MaterialStatusEnum
                jobRm: [
                    {
                        itemCode: "RM-001",
                        itemName: "Wool Yarn",
                        itemDesc: "Soft wool yarn for knitting",
                        itemType: "RawMaterial", // RmItemTypeEnum
                        componentNames: ["Spool", "Thread"],
                    },
                    {
                        itemCode: "RM-002",
                        itemName: "Buttons",
                        itemDesc: "Small plastic buttons",
                        itemType: "Accessory",
                        componentNames: ["Button", "Thread"],
                    },
                ],
            },
        ],
    },
    {
        knitGroup: "KnitGroup2",
        knitJobs: [
            {
                knitGroup: "KnitGroup2",
                jobNumber: "KNIT-002",
                jobQty: 150,
                productSpecs: {
                    sku: "SK12346",
                    productName: "Knit Hat",
                    productDescription: "A cozy knit hat for cold weather",
                    material: "Cotton",
                },
                processingSerial: 6790,
                colorSizeInfo: {
                    fgColor: "Blue",
                    sizeQtys: [
                        { size: "M", qty: 70 },
                        { size: "L", qty: 80 },
                    ],
                },
                barcodeInfo: [
                    { barcode: "5432167890", itemCode: "BC-003", printed: true },
                    { barcode: "1122334455", itemCode: "BC-004", printed: false },
                ],
                jobFeatures: {
                    style: "Style-2",
                    co: ["CO-3", "CO-4"],
                    vpo: ["VPO-003", "VPO-004"],
                    moLines: ["ML003", "ML004"],
                    mo: ["M003", "M004"]
                },
                barcodePrinted: true,
                materialStatus: "Completed",
                jobRm: [
                    {
                        itemCode: "RM-003",
                        itemName: "Cotton Yarn",
                        itemDesc: "Cotton yarn for knitting",
                        itemType: "RawMaterial",
                        componentNames: ["Spool", "Thread"],
                    },
                ],
            },
        ],
    },
];

