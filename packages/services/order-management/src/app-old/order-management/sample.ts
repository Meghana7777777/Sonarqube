import { ManufacturingOrderDumpRequest } from "@xpparel/shared-models";

const sampleData = {
    "username": "testUser",
    "unitCode": "UNIT001",
    "companyCode": "COMP123",
    "userId": 1,
    "saleOrderDumpData": [
      {
        "soNumber": "SO12345",
        "style": "STYLE001",
        "plantStyleRef": "PLANTSTYLE001",
        "coNumber": "CO98765",
        "customerName": "ABC Garments",
        "soRefNumber": "SOREF001",
        "customerLocation": "New York",
        "quantity": 1000,
        "packMethod": "Box",
        "isConfirmed": 0,
        "customerCode": "CUST001",
        "profitCenterCode": "PC001",
        "profitCenterName": "Profit Center 1",
        "styleName": "Casual Shirt",
        "styleCode": "SHRT001",
        "styleDescription": "Cotton Casual Shirt",
        "soProgressStatus": 1,
        "businessHead": "John Doe",
        "soItem": "Item001",
        "customerStylesDesignNo": "CSDN123",
        "soCreationDate": "2025-03-10T10:00:00.000Z",
        "soClosedDate": null,
        "exFactoryDate": "2025-04-20T10:00:00.000Z",
        "soLines": [
          {
            "soLineNumber": "SOL001",
            "soLineProducts": [
              {
                  "productCode": "PRD001",
                  "productName": "Denim Jeans",
                  "productType": "Type1",
                  sequence: 0,
                  "soProductSubLines": [
                      {
                          "fgColor": "string",
                          "size": "string",
                          "quantity": 100,
                          "extRefNumber1": "string",
                          "extRefNumber2": "string",
                          "destination": "string",
                          "deliveryDate": "string",
                          "schedule": "string",
                          "zFeature": "string",
                          "planProdDate": "string",
                          "planCutDate": "string",
                          "pslOperations": [
                              {
                                  "opForm": "Cutting",
                                  "opCode": "OP001",
                                  "iOpCode": "IOP001",
                                  "eOpCode": "EOP001",
                                  "opName": "Fabric Cutting",
                                  "processType": "Manual",
                                  "opSmv": "1.5",
                                  "opWkStation": "Station1",
                                  "pslOpRawMaterials": [
                                      {
                                          "itemCode": "FAB001",
                                          "opCode": "OP001"
                                      }
                                  ]
                              }
                          ],
                      }
                  ],
                 
              }
            ]
          }
        ],
        "rawMaterials": [
                      {
                        "itemCode": "FAB001",
                        "itemName": "Cotton Fabric",
                        "itemDesc": "Blue Cotton Fabric",
                        "sequence": 1,
                        "consumption": 2,
                        "wastage": 0.1,
                        "itemType": "Fabric",
                        "itemSubType": "Cotton",
                        "itemColor": "Blue",
                        "itemUom": "Meters"
                      }
                    ]
      }
    ]
  }
  

const  data ={
    "username": "testUser",
    "unitCode": "UNIT001",
    "companyCode": "COMP123",
    "userId": 1,
    "saleOrderDumpData": [
      {
        "soNumber": "SO12345",
        "style": "STYLE001",
        "plantStyleRef": "PLANTSTYLE001",
        "coNumber": "CO98765",
        "customerName": "ABC Garments",
        "soRefNumber": "SOREF001",
        "customerLocation": "New York",
        "quantity": 1000,
        "packMethod": "Box",
        "isConfirmed": 0,
        "customerCode": "CUST001",
        "profitCenterCode": "PC001",
        "profitCenterName": "Profit Center 1",
        "styleName": "Casual Shirt",
        "styleCode": "SHRT001",
        "styleDescription": "Cotton Casual Shirt",
        "soProgressStatus": 1,
        "businessHead": "John Doe",
        "soItem": "Item001",
        "customerStylesDesignNo": "CSDN123",
        "soCreationDate": "2025-03-10T10:00:00.000Z",
        "soClosedDate": null,
        "exFactoryDate": "2025-04-20T10:00:00.000Z",
        "soLines": [
          {
            "soLineNumber": "SOL001",
            "soLineProducts": [
              {
                "productCode": "PRD001",
                "productName": "Denim Jeans",
                "productType": "Type1",
                "sequence": 0,
                "soProductSubLines": [
                  {
                    "fgColor": "string",
                    "size": "string",
                    "quantity": 100,
                    "extRefNumber1": "string",
                    "extRefNumber2": "string",
                    "destination": "string",
                    "deliveryDate": "string",
                    "schedule": "string",
                    "zFeature": "string",
                    "planProdDate": "string",
                    "planCutDate": "string",
                    "pslOperations": [
                      {
                        "opForm": "Cutting",
                        "opCode": "OP001",
                        "iOpCode": "IOP001",
                        "eOpCode": "EOP001",
                        "opName": "Fabric Cutting",
                        "processType": "Manual",
                        "opSmv": "1.5",
                        "opWkStation": "Station1",
                        "pslOpRawMaterials": [
                          {
                            "itemCode": "FAB001",
                            "opCode": "OP001"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "rawMaterials": [
          {
            "itemCode": "FAB001",
            "itemName": "Cotton Fabric",
            "itemDesc": "Blue Cotton Fabric",
            "sequence": 1,
            "consumption": 2,
            "wastage": 0.1,
            "itemType": "Fabric",
            "itemSubType": "Cotton",
            "itemColor": "Blue",
            "itemUom": "Meters"
          }
        ]
      }
    ]
  }
  