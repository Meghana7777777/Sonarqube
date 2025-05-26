import React from 'react'
import FgTracking from './fg-tracking'
import JobOrderFlow from './operation-mapping/JobOrderFlowChart'
import { jobOrderFlowData } from './operation-mapping/job-order-flow-data'
import ModuleChange from './module-change-alert'
import { moduleFromData, moduleToData } from './module-change-alert-data'
import InventoryInfo from './inventory-info/inventory-info'

const AttendanceCapturing = () => {
  return (
    <>
      {/* <div style={{marginBottom:"20px"}}>AttendanceCapturing</div> */}
      {/* <FgTracking /> */}
      {/* <div style={{ marginBottom: "20px" }}>AttendanceCapturing</div> */}
      {/* <FgTracking /> */}
      {/* <ModuleChange moduleFromData={moduleFromData} moduleToData={moduleToData} /> */}
      <InventoryInfo 
      // manufacturingOrderNumber={'423265_2210'}
      ></InventoryInfo>
    </>
  )
}

export default AttendanceCapturing