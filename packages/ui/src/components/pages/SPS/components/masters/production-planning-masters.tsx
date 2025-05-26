import { Button, Card, Space } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext';
import React, { useState } from 'react'
import CreateSection from './masters-section';
import CreateModule from './masters-module';
import CreateWorkStation from './masters-workstation';
import CreateOperationMapping from './masters-operation-mappings';
import { ModuleModel, SectionModel, WorkstationModel, WorkstationOperationModel } from '@xpparel/shared-models';
interface uniqueidentifier {
  sectioncolumns?: any;
}
const mastersArray = {
  section: 'section',
  module: 'module',
  workstation: 'workstation',
  workstatiooperationmapping: 'workstatiooperationmapping'
}

const ProductionPlanningMasters = (props: uniqueidentifier) => {
  const { sectioncolumns } = props;
  const [size, setSize] = useState<SizeType>('middle'); // default is 'middle'
  console.log(props.sectioncolumns);
  const [selectedMaster, setSelectedMaster] = useState<string>("");
  const showMaster = (s) => {
    setSelectedMaster(s);
  }
  return (
    <>
      <Card size='small'>
        <Space wrap>
          <Button type="primary" style={{ minWidth: '100px' }} className={mastersArray.section == selectedMaster ? 'orange-button-masters' : ''} size={size} onClick={() => showMaster(mastersArray.section)}> Section</Button>
          <Button type="primary" style={{ minWidth: '100px' }} className={mastersArray.module == selectedMaster ? 'orange-button-masters' : ''} size={size} onClick={() => showMaster(mastersArray.module)}> Module</Button>
          <Button type="primary" style={{ minWidth: '100px' }} className={mastersArray.workstation == selectedMaster ? 'orange-button-masters' : ''} size={size} onClick={() => showMaster(mastersArray.workstation)}> Work Station</Button>
          <Button type="primary" style={{ minWidth: '100px' }} className={mastersArray.workstatiooperationmapping == selectedMaster ? 'orange-button-masters' : ''} size={size} onClick={() => showMaster(mastersArray.workstatiooperationmapping)}>Work Station Operation Mapping</Button>
        </Space>
      </Card>
      {mastersArray.section == selectedMaster && <CreateSection newWindow={false} updateDetails={function (sectiondata: SectionModel): void {
        throw new Error('Function not implemented.');
      } } />}
      {mastersArray.module == selectedMaster && <CreateModule newWindow={false} updateDetails={function (moduledata: ModuleModel): void {
        throw new Error('Function not implemented.');
      } } />}
      {mastersArray.workstation == selectedMaster && <CreateWorkStation newWindow={false} updateDetails={function (workdata: WorkstationModel): void {
        throw new Error('Function not implemented.');
      } }  />}
      {mastersArray.workstatiooperationmapping == selectedMaster && <CreateOperationMapping newWindow={false} updateDetails={function (workdata: WorkstationOperationModel): void {
        throw new Error('Function not implemented.');
      } } getWorkstationOperation={function (): void {
        throw new Error('Function not implemented.');
      } } />}




    </>
  )
}

export default ProductionPlanningMasters