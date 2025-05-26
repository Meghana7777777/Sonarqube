export const jobOrderFlowData = [
    {
        "id": 8,
        "version": "Dev2",
        "description": "dev test desc",
        "operations": [
            {
                "opCategory": "KNIT",
                "eOpCode": "200",
                "opForm": "PF",
                "opCode": "200",
                "opName": "Knitting In",
                "opSeq": 1,
                "group": "1",
                "smv": 0
            },
            {
                "opCategory": "KNIT",
                "eOpCode": "202",
                "opForm": "PF",
                "opCode": "202",
                "opName": "Knit Out",
                "opSeq": 2,
                "group": "2",
                "smv": 0
            },
            {
                "opCategory": "LINK",
                "eOpCode": "204",
                "opForm": "SGF",
                "opCode": "204",
                "opName": "Linking In",
                "opSeq": 3,
                "group": "3",
                "smv": 0
            }
        ],
        "opGroups": [
            {
                "group": "1",
                "depGroups": [""],
                "operations": ["200"],
                "components": ["Back", "Front", "Right Sleeve","Left Sleeve"],
                "groupCategory": "KNIT",
                "jobtype": "SEWING",
                "warehouse": null,
                "extProcessing": null
            },
            {
                "group": "2",
                "depGroups": ["1"],
                "operations": ["202"],
                "components": ["Right Sleeve"],
                "groupCategory": "KNIT",
                "jobtype": "SEWING",
                "warehouse": null,
                "extProcessing": null
            },
            {
                "group": "3",
                "depGroups": ["1"],
                "operations": ["204"],
                "components": ["Front", "Left Sleeve"],
                "groupCategory": "LINK",
                "jobtype": "SEWING",
                "warehouse": null,
                "extProcessing": null
            },
            {
                "group": "4",
                "depGroups": ["1","3"],
                "operations": ["204"],
                "components": ["Front", "Left Sleeve"],
                "groupCategory": "LINK",
                "jobtype": "SEWING",
                "warehouse": null,
                "extProcessing": null
            },
            {
                "group": "5",
                "depGroups": ["2","4"],
                "operations": ["204"],
                "components": ["Front", "Left Sleeve"],
                "groupCategory": "LINK",
                "jobtype": "SEWING",
                "warehouse": null,
                "extProcessing": null
            },
            {
                "group": "6",
                "depGroups": ["2","5"],
                "operations": ["204"],
                "components": ["Front", "Left Sleeve"],
                "groupCategory": "LINK",
                "jobtype": "SEWING",
                "warehouse": null,
                "extProcessing": null
            },
            {
                "group": "7",
                "depGroups": ["2","6"],
                "operations": ["204"],
                "components": ["Front", "Left Sleeve"],
                "groupCategory": "LINK",
                "jobtype": "SEWING",
                "warehouse": null,
                "extProcessing": null
            }
        ],
        "productName": "BBAW-Pack 2",
        "poSerial": 2
    }
]

















// export const jobOrderFlowData = [
//     {
//       "id": 1,
//       "version": "Dev1",
//       "description": "Initial version test",
//       "operations": [
//         {
//           "opCategory": "KNIT",
//           "eOpCode": "100",
//           "opForm": "PF",
//           "opCode": "100",
//           "opName": "Knitting Start",
//           "opSeq": 1,
//           "group": "1",
//           "smv": 0.5
//         },
//         {
//           "opCategory": "KNIT",
//           "eOpCode": "102",
//           "opForm": "PF",
//           "opCode": "102",
//           "opName": "Knitting End",
//           "opSeq": 2,
//           "group": "2",
//           "smv": 0.3
//         },
//         {
//           "opCategory": "LINK",
//           "eOpCode": "104",
//           "opForm": "SGF",
//           "opCode": "104",
//           "opName": "Linking Process",
//           "opSeq": 3,
//           "group": "3",
//           "smv": 0.2
//         }
//       ],
//       "opGroups": [
//         {
//           "group": "1",
//           "sequence": 1,
//           "depGroups": [""],
//           "operations": ["100"],
//           "components": ["Back", "Front", "Neck Binding"],
//           "groupCategory": "KNIT",
//           "jobtype": "SEWING"
//         },
//         {
//           "group": "2",
//           "sequence": 2,
//           "depGroups": ["1"],
//           "operations": ["102"],
//           "components": ["Right Sleeve", "Left Sleeve", "Popper Tab Up Top"],
//           "groupCategory": "KNIT",
//           "jobtype": "SEWING"
//         },
//         {
//           "group": "3",
//           "sequence": 3,
//           "depGroups": ["1", "2"],
//           "operations": ["104"],
//           "components": ["Front", "Left Front", "Popper Backing Top"],
//           "groupCategory": "LINK",
//           "jobtype": "SEWING"
//         }
//       ],
//       "productName": "BBAW-Pack 1",
//       "poSerial": 101
//     },
//     {
//       "id": 2,
//       "version": "Dev2",
//       "description": "Sample run for version 2",
//       "operations": [
//         {
//           "opCategory": "CUT",
//           "eOpCode": "110",
//           "opForm": "GF",
//           "opCode": "110",
//           "opName": "Cutting Fabric",
//           "opSeq": 1,
//           "group": "1",
//           "smv": 1.0
//         },
//         {
//           "opCategory": "CUT",
//           "eOpCode": "112",
//           "opForm": "GF",
//           "opCode": "112",
//           "opName": "Trimming Edges",
//           "opSeq": 2,
//           "group": "2",
//           "smv": 0.7
//         }
//       ],
//       "opGroups": [
//         {
//           "group": "1",
//           "sequence": 1,
//           "depGroups": [""],
//           "operations": ["110"],
//           "components": ["Back", "Neck Binding", "Popper Fusing Top"],
//           "groupCategory": "CUT",
//           "jobtype": "CUTTING"
//         },
//         {
//           "group": "2",
//           "sequence": 2,
//           "depGroups": ["1"],
//           "operations": ["112"],
//           "components": ["Front", "Left Sleeve", "Gusset"],
//           "groupCategory": "CUT",
//           "jobtype": "CUTTING"
//         }
//       ],
//       "productName": "BBAW-Pack 2",
//       "poSerial": 102
//     },
//     {
//       "id": 3,
//       "version": "Dev3",
//       "description": "Cut and Sew test version",
//       "operations": [
//         {
//           "opCategory": "SEW",
//           "eOpCode": "150",
//           "opForm": "PF",
//           "opCode": "150",
//           "opName": "Sewing Pieces",
//           "opSeq": 1,
//           "group": "1",
//           "smv": 1.2
//         },
//         {
//           "opCategory": "SEW",
//           "eOpCode": "152",
//           "opForm": "PF",
//           "opCode": "152",
//           "opName": "Joining Seams",
//           "opSeq": 2,
//           "group": "2",
//           "smv": 0.8
//         }
//       ],
//       "opGroups": [
//         {
//           "group": "1",
//           "sequence": 1,
//           "depGroups": [""],
//           "operations": ["150"],
//           "components": ["Back", "Right Sleeve", "Popper Backing Bottom"],
//           "groupCategory": "SEW",
//           "jobtype": "SEWING"
//         },
//         {
//           "group": "2",
//           "sequence": 2,
//           "depGroups": ["1"],
//           "operations": ["152"],
//           "components": ["Left Top Foot", "Popper Fusing Bottom"],
//           "groupCategory": "SEW",
//           "jobtype": "SEWING"
//         }
//       ],
//       "productName": "BBSEW-Pack 3",
//       "poSerial": 103
//     },
//     {
//       "id": 4,
//       "version": "Dev4",
//       "description": "Sewing with linkage test",
//       "operations": [
//         {
//           "opCategory": "SEW",
//           "eOpCode": "200",
//           "opForm": "PF",
//           "opCode": "200",
//           "opName": "Sewing Start",
//           "opSeq": 1,
//           "group": "1",
//           "smv": 0.9
//         },
//         {
//           "opCategory": "LINK",
//           "eOpCode": "204",
//           "opForm": "SGF",
//           "opCode": "204",
//           "opName": "Linking Start",
//           "opSeq": 2,
//           "group": "2",
//           "smv": 0.6
//         }
//       ],
//       "opGroups": [
//         {
//           "group": "1",
//           "sequence": 1,
//           "depGroups": [""],
//           "operations": ["200"],
//           "components": ["Front", "Neck Band", "Popper Tab Down Top"],
//           "groupCategory": "SEW",
//           "jobtype": "SEWING"
//         },
//         {
//           "group": "2",
//           "sequence": 2,
//           "depGroups": ["1"],
//           "operations": ["204"],
//           "components": ["Right Top Foot", "Back Shoulder Fusing"],
//           "groupCategory": "LINK",
//           "jobtype": "SEWING"
//         }
//       ],
//       "productName": "BBSEW-Link 4",
//       "poSerial": 104
//     },
//     {
//       "id": 5,
//       "version": "Dev5",
//       "description": "Final product version",
//       "operations": [
//         {
//           "opCategory": "PACK",
//           "eOpCode": "300",
//           "opForm": "PACKF",
//           "opCode": "300",
//           "opName": "Packing Items",
//           "opSeq": 1,
//           "group": "1",
//           "smv": 0.5
//         },
//         {
//           "opCategory": "PACK",
//           "eOpCode": "302",
//           "opForm": "PACKF",
//           "opCode": "302",
//           "opName": "Sealing Packages",
//           "opSeq": 2,
//           "group": "2",
//           "smv": 0.3
//         }
//       ],
//       "opGroups": [
//         {
//           "group": "1",
//           "sequence": 1,
//           "depGroups": [""],
//           "operations": ["300"],
//           "components": ["Back", "Popper Tab Down Bottom", "Waist Band"],
//           "groupCategory": "PACK",
//           "jobtype": "PACKING"
//         },
//         {
//           "group": "2",
//           "sequence": 2,
//           "depGroups": ["1"],
//           "operations": ["302"],
//           "components": ["Neck Tape Binding", "Sleeve Binding"],
//           "groupCategory": "PACK",
//           "jobtype": "PACKING"
//         }
//       ],
//       "productName": "BBAW-Pack 5",
//       "poSerial": 105
//     }
//   ]
