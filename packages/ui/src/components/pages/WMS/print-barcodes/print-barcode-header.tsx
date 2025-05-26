
import { useState, useEffect } from 'react';
import { FormInstance, Select } from 'antd';
import { useAppSelector } from "../../../../common";
import { ScxButton, ScxColumn, ScxForm, ScxRow } from '../../../../schemax-component-lib';
import { PackingListSummaryModel, PhBatchLotRollRequest } from '@xpparel/shared-models';

interface IPrintBarcodeHeader {
  headerFormRef: FormInstance<any>;
  disablePrintButton: boolean;
  getPackListNumber: (req: PhBatchLotRollRequest, showErrorMsg?: boolean) => void;
  printAllBarcode: (req: PhBatchLotRollRequest) => void;
  summeryDataRecord: PackingListSummaryModel;
  lotsDropdownSet: Set<string>;
  rollsDropDownMap: Map<number, string>
  packListData: any;
}

const { Option } = Select;

export const PrintBarcodeHeader = (props: IPrintBarcodeHeader) => {
  const user = useAppSelector((state) => state.user.user.user);
  const { headerFormRef, disablePrintButton, getPackListNumber, printAllBarcode, summeryDataRecord, packListData } = props;

  // State for lot and roll options
  const [lotOptions, setLotOptions] = useState<string[]>([]);
  const [rollOptions, setRollOptions] = useState<{key:number, value:string}[]>([]);
  const [inistialPackListData, setIniPackListData] = useState<any>([]);

  // State for selected lot
  // const [selectedLot, setSelectedLot] = useState<string | undefined>(undefined);

  // Load lot and roll options from packListData
  useEffect(() => {
    // console.log(packListData);    
    if (packListData) {      
      const batchInfo = packListData.batchInfo;
      const newLotOptions: string[] = [];
      const newRollOptions: {key:number, value:string}[] = [];
      for (const batchId in batchInfo) {
        const lotInfo = batchInfo[batchId].lotInfo;
        for (const lotId in lotInfo) {
          const lotNumber = lotInfo[lotId].lotNumber;
          newLotOptions.push(lotNumber);
          const rollInfo = lotInfo[lotId].rollInfo;
          for (const rollId in rollInfo) {
          //  externalRollNumber.set(rollInfo[rollId].id, rollInfo[rollId].externalRollNumber);
            const externalRollNumber = {key:rollInfo[rollId].id, value:rollInfo[rollId].externalRollNumber};
            newRollOptions.push(externalRollNumber);
          }
        }
      } 

      if(lotOptions.length==0){
        setIniPackListData(packListData);
        setLotOptions(newLotOptions);
      }        
    }
  }, [packListData]);

  // Load initial pack list number
  useEffect(() => {
    const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      summeryDataRecord.id,
      undefined,
      undefined,
      undefined,
      summeryDataRecord.supplierCode,
      undefined
    );
    getPackListNumber(req);
  }, []);

  // Handle lot selection change
  const handleLotChange = (selectedLotNumber: string) => {
    // setSelectedLot(selectedLotNumber);
    const rollsForSelectedLot: {key:number, value:string}[] = [];
    if (selectedLotNumber) {
      const batchInfo = inistialPackListData.batchInfo;
      for (const batchId in batchInfo) {
        const lotInfo = batchInfo[batchId].lotInfo;
        for (const lotId in lotInfo) {
          const lotNumber = lotInfo[lotId].lotNumber;
          if (lotNumber === selectedLotNumber) {
            const rollInfo = lotInfo[lotId].rollInfo;
            for (const rollId in rollInfo) {
              const rollNumber =  {key:rollInfo[rollId].id, value:rollInfo[rollId].externalRollNumber};
              rollsForSelectedLot.push(rollNumber);
            }
          }
        }
      }
    }
    headerFormRef.setFieldValue('rollNumber',undefined);
    setRollOptions(rollsForSelectedLot);
  };

  // Handle form submission
  const submitButtonHandler = () => {
    headerFormRef.validateFields().then(formValues => {
      const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(
        user?.userName,
        user?.orgData?.unitCode,
        user?.orgData?.companyCode,
        user?.userId,
        summeryDataRecord.id,
        formValues.batchNumber,
        formValues.lotNumber,
        formValues.rollNumber,
        summeryDataRecord.supplierCode,
        undefined
      );
      getPackListNumber(req, true);
      
      // Reset the selected lot after submission
      // setSelectedLot(undefined);
    }).catch(err => {
      console.log(err);
    });
  };

  // Handle printing
  const printButtonHandler = () => {
    headerFormRef.validateFields().then(formValues => {
      const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(
        user?.userName,
        user?.orgData?.unitCode,
        user?.orgData?.companyCode,
        user?.userId,
        summeryDataRecord.id,
        formValues.batchNumber,
        formValues.lotNumber,
        formValues.rollNumber,
        summeryDataRecord.supplierCode,
        undefined
      );
      printAllBarcode(req);
    }).catch(err => {
      console.log(err.message);
    });
  };

  return (
    <ScxForm form={headerFormRef} autoComplete='off'>
      <ScxRow gutter={16}>
        <ScxColumn xs={24} sm={9} md={9} lg={9} xl={9} xxl={9}>
          <ScxForm.Item
            label="Lot Number"
            name="lotNumber"
            rules={[{ required: false, message: 'Enter Lot Number' }]}
          >
            <Select
              filterOption={(input, option) => (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())}
              allowClear
              showSearch
              style={{ width: '100%' }}
              placeholder='Please Select'
              onChange={handleLotChange}
            >
              {lotOptions.map(lotNumber => (
                <Option key={lotNumber} value={lotNumber}>
                  {lotNumber}
                </Option>
              ))}
            </Select>
          </ScxForm.Item>
        </ScxColumn>

        <ScxColumn xs={24} sm={9} md={9} lg={9} xl={9} xxl={9}>
          <ScxForm.Item
            label="Object Number"
            name="rollNumber"
            rules={[{ required: false, message: 'Enter Object Number' }]}
          >
            <Select
              filterOption={(input, option) => (option!.children as unknown as  string).toLowerCase().includes(input.toLowerCase())}
              allowClear
              showSearch
              style={{ width: '100%' }}
              placeholder='Please Select'
            >
              {rollOptions.map((rollNumber) => (
                <Option key={rollNumber.key} value={rollNumber.key}>
                  {rollNumber.value}
                </Option>
              ))}
            </Select>
          </ScxForm.Item>
        </ScxColumn>

        <ScxColumn xs={24} sm={2} md={2} lg={2} xl={2} xxl={2}>
          <ScxForm.Item>
            <ScxButton type="primary" size='middle' onClick={submitButtonHandler} style={{ marginTop: '1.9rem' }}>
              Submit
            </ScxButton>
          </ScxForm.Item>
        </ScxColumn>

        {/* Print button */}
        {/* <ScxColumn xs={24} sm={2} md={2} lg={2} xl={2} xxl={2}>
          <ScxForm.Item>
            <ScxButton onClick={printButtonHandler} icon={<PrinterTwoTone />} disabled={disablePrintButton} style={{ marginTop: '1.4rem' }}>
              Print
            </ScxButton>
          </ScxForm.Item>
        </ScxColumn> */}
      </ScxRow>
    </ScxForm>
  );
}

export default PrintBarcodeHeader;
