export interface Section {
    sectionCode: string;
    sectionName: string; 
  }


export interface Module{
  moduleCode:string;
  moduleName:string;
}


export interface Workstation{
  workstationId:string;
  workstationCode: string;
  workstationName: string;
}


export const sampleSections: Section[] = [
  { sectionCode: 'S001', sectionName: 'Section 1' },
  { sectionCode: 'S002', sectionName: 'Section 2' },
  { sectionCode: 'S003', sectionName: 'Section 3' }
];

export const sampleModules: Module[] = [
  { moduleCode: 'M001', moduleName: 'Module 1' },
  { moduleCode: 'M002', moduleName: 'Module 2' },
  { moduleCode: 'M003', moduleName: 'Module 3' }
];

export const sampleWorkstations: Workstation[] = [
  {
    workstationCode: 'W001', workstationName: 'Workstation 1',
    workstationId: ""
  },
  {
    workstationCode: 'W002', workstationName: 'Workstation 2',
    workstationId: ""
  },
  {
    workstationCode: 'W003', workstationName: 'Workstation 3',
    workstationId: ""
  }
];
  
  // export interface Module {
  //   id: string;
  //   name: string;
  //   workstations: Workstation[];
  // }
  
  // export interface Workstation {
  //   id: string;
  //   name: string;
  //   currentStatus: 'normal' | 'warning' | 'critical';
  // }
  
  // export interface DowntimeEntry {
  //   id: string;
  //   sectionId: string;
  //   moduleId: string;
  //   workstationId?: string;
  //   startTime: Date;
  //   endTime?: Date;
  //   reason: string;
  //   description: string;
  //   severity: 'low' | 'medium' | 'high';
  // }