import { Button, Card, Space } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import React, { useState } from 'react';
import CreateBins from './bins-create';
import CreateMovers from './movers-create';
import CreateRacks from './racks.create';
// import CreateReasons from './reasons-create';
import CreateTray from './tray-create';
import CreateTrolly from './trolly-create';
// import CreateRollAttributes from './roll-attributes-create';
// import CreateApprovalHierarchy from './approval-hierarchy';
import CreateMarkers from '../../OMS/OES/masters/marker-type/marker-type.grid';
import CreateOperations from '../../OMS/OES/masters/operations.grid';
import CreateComponents from '../../OMS/order-management/component';
import { CreateProductType } from '../../OMS/order-management/product-type';
// import CreateCutTables from '../../PPS/masters/cut-planning/cut-tables.grid';
import CreateDownTimeReasons from '../../ums/downtime reasons/reasons.grid';
import CreateShift from '../../ums/shift/shift.grid';
import CreateSize from '../../ums/sizes/sizes.grid';
import CreateCompany from '../../ums/masters/company.masters';
import CreateUnits from '../../ums/masters/units.masters';
import CreateWarehouse from '../../ums/masters/warehouse.masters';
import CreateWarehouseUnitmapping from '../../ums/masters/warehouse-unitmapping.masters';
import { CreateUsersGroup } from './users-group-create';
import { CreateVendors } from '../../ums/vendor/vendor.grid';
import CreatePallets from './pallets-create';
import CreateSuppliers from './supplier-create';
import DepartmentManagement from './department-create';
import CreateSection from '../../ums/global-config/section-form';
import CreateLocation from '../../ums/global-config/location-form';
import CreateCutTables from '../../PPS/masters/cut-planning/cut-tables.grid';
// import CreateSuppliers from './supplier-create';
interface ISecurityDetailsUpdate {
  rackcolumns?: any;
}
const mastersArray = {
  racks: 'racks',
  bins: 'bins',
  pallets: 'pallets',
  trolly: 'trolly',
  tray: 'tray',
  movers: 'movers',
  // reasons: 'reasons',
  rollattributes: 'rollattributes',
  approval: 'approval',
  usersgroup: 'usersgroup',
  selectedCategory: 'selectedCategory',
  productType: 'productType',
  component: 'component',
  operations: 'operations',
  markers: 'markers',
  cuttables: 'cuttables',
  downtimeReasons: 'downtimeReasons',
  shifts: 'shifts',
  vendors: 'vendors',
  sizes: 'sizes',
  company: 'company',
  units: 'units',
  warehouse: 'warehouse',
  warehouseUnitmapping: 'warehouseUnitmapping',
  departmentManagement:'departmentManagement',
  section:'section',
  location:'location',
};
export const Masters: React.FC = (props: ISecurityDetailsUpdate) => {
  const { rackcolumns } = props;
  const [size, setSize] = useState<SizeType>('middle'); // default is 'middle'
  console.log(props.rackcolumns);
  const [selectedMaster, setSelectedMaster] = useState<string>("");
  const showMaster = (s) => {
    setSelectedMaster(s);
  }

  return (
    <>
      <Card size='small'>
        <Space wrap>
          {/* <Button type="primary" style={{ minWidth: '100px' }} className={mastersArray.racks == selectedMaster ? 'orange-button-masters' : ''} size={size} onClick={() => showMaster(mastersArray.racks)}> Rack</Button> */}
          {/* <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.bins == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.bins)}> Bin</Button> */}
          {/* <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.pallets == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.pallets)}> Pallet</Button> */}
          {/* <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.trolly == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.trolly)}> Trolly</Button> */}
          {/* <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.tray == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.tray)}> Tray</Button> */}
          {/* <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.movers == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.movers)}> Mover</Button> */}
          {/* <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.reasons == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.reasons)}> Inspection Reasons</Button> */}
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.productType == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.productType)}> Product Type</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.component == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.component)}> Components</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.operations == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.operations)}> Operations</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.markers == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.markers)}> Markers</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.cuttables == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.cuttables)}> Cut Tables</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.downtimeReasons == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.downtimeReasons)}> Downtime Reasons</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.shifts == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.shifts)}> Shifts</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.vendors == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.vendors)}> Vendors</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.sizes == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.sizes)}> Sizes</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.company == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.company)}> Company</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.units == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.units)}> Units</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.warehouse == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.warehouse)}> Warehouse</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.warehouseUnitmapping == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.warehouseUnitmapping)}> Warehouse Unitmapping</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.departmentManagement == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.departmentManagement)}> Department</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.section == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.section)}> Section</Button>
          <Button type="primary" style={{ minWidth: '100px' }} size={size} className={mastersArray.location == selectedMaster ? 'orange-button-masters' : ''} onClick={() => showMaster(mastersArray.location)}> Location</Button>


        </Space>
      </Card>
      <br />
      {mastersArray.racks == selectedMaster && <CreateRacks newWindow={false} />}
      {mastersArray.bins == selectedMaster && <CreateBins newWindow={false} />}
      {mastersArray.pallets == selectedMaster && < CreatePallets newWindow={false} />}
      {mastersArray.trolly == selectedMaster && <CreateTrolly />}
      {mastersArray.tray == selectedMaster && <CreateTray />}
      {mastersArray.movers == selectedMaster && <CreateMovers />}
      {/* {mastersArray.reasons == selectedMaster && <CreateReasons />} */}
      {mastersArray.productType == selectedMaster && <CreateProductType />}
      {mastersArray.component == selectedMaster && <CreateComponents />}
      {mastersArray.operations == selectedMaster && <CreateOperations />}
      {mastersArray.usersgroup == selectedMaster && <CreateUsersGroup />}
      {mastersArray.markers == selectedMaster && <CreateMarkers />}
      {/* TODO:CUT */}
      {mastersArray.cuttables == selectedMaster && <CreateCutTables />}
      {mastersArray.downtimeReasons == selectedMaster && <CreateDownTimeReasons />}
      {mastersArray.shifts == selectedMaster && <CreateShift />}
      {mastersArray.vendors == selectedMaster && <CreateVendors />}
      {mastersArray.sizes == selectedMaster && <CreateSize />}
      {mastersArray.company == selectedMaster && <CreateCompany/>}
      {mastersArray.units == selectedMaster && <CreateUnits/>}
      {mastersArray.warehouse == selectedMaster && <CreateWarehouse/>}
      {mastersArray.warehouseUnitmapping == selectedMaster && <CreateWarehouseUnitmapping/>}
      {mastersArray.departmentManagement == selectedMaster && <DepartmentManagement/>}
      {mastersArray.section == selectedMaster && <CreateSection/>}
      {mastersArray.location == selectedMaster && <CreateLocation/>}





    </>
  );
};

export default Masters;