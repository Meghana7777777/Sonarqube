import { PslOpRmModel } from "./psl-operation-rm-model";

export class PslOperationModel {

          
    opForm: string;                  
    opCode: string;                  
    iOpCode: string;               
    eOpCode: string;                 
    opName: string;                  
    processType: string;            
    opSmv: string;                  
    opWkStation: string;             
    pslOpRawMaterials: PslOpRmModel[]; 

    constructor(
      
        opForm: string,
        opCode: string,
        iOpCode: string,
        eOpCode: string,
        opName: string,
        processType: string,
        opSmv: string,
        opWkStation: string,
        pslOpRawMaterials: PslOpRmModel[]
    ) {
       
        this.opForm = opForm;
        this.opCode = opCode;
        this.iOpCode = iOpCode;
        this.eOpCode = eOpCode;
        this.opName = opName;
        this.processType = processType;
        this.opSmv = opSmv;
        this.opWkStation = opWkStation;
        this.pslOpRawMaterials = pslOpRawMaterials;
    }
}
