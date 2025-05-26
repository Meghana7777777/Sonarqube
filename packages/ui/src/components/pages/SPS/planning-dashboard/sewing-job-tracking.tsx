import { GBSectionRequest, GetAllSectionsResDto, ProcessTypeEnum, processTypeEnumDisplayValues } from '@xpparel/shared-models';
import { GbConfigHelperService } from '@xpparel/shared-services';
import { AutoComplete, Button, Card, Col, Form, Input, Row, Select, Tag } from 'antd';

import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import SectionCard from './section-card';
import './sewing-job-tracking.css';

import { AlertMessages } from '../../../common';
import { useForm } from 'antd/es/form/Form';

const excludeProcessTypes = [ProcessTypeEnum.CUT, ProcessTypeEnum.KNIT, ProcessTypeEnum.LAY, ProcessTypeEnum.PACK];
const SewingJobTracking = () => {


	const { Option } = Select;
	const [selectedProcessType, setSelectedProcessType] = useState<ProcessTypeEnum>(undefined);
	const [selectedJobNo, setSelectedJobNo] = useState<string | null>(null);
	const user = useAppSelector((state) => state.user.user.user);
	const gbcService = new GbConfigHelperService();
	const [sectionData, setSectionData] = useState<GetAllSectionsResDto[]>([]);
	const [processTypes, setProcessTypes] = useState<ProcessTypeEnum[]>([]);

	const [options, setOptions] = useState([]);
	const [allJobNumbers, setAllJobNumbers] = useState([]);
	const [formRef] = useForm();
	useEffect(() => {
		const processTypesP = Object.values(ProcessTypeEnum).filter(processType => !excludeProcessTypes.includes(processType));
		setProcessTypes(processTypesP);
	}, [])

	const getAllSectionsByDepartmentsFromGbC = (processType: ProcessTypeEnum) => {
		setSelectedProcessType(processType);
		setOptions([]);
		setAllJobNumbers([]);
		setSelectedJobNo(undefined);
		formRef.setFieldValue('jobNumber', '')
		if (!processType) {
			setSectionData([]);
			return;
		}
		const request = new GBSectionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, [processType])
		try {
			gbcService.getAllSectionsByDepartmentsFromGbC(request).then(res => {
				if (res.status) {
					setSectionData(res.data);
				} else {
					setSectionData([]);
				}
			})
		} catch (err) {
			setSectionData([]);
			AlertMessages.getErrorMessage(err.message);
		}
	}


	const changeJobNumber = (val: string) => {
		if (!val) {
			setSelectedJobNo(undefined)
		}
	}
	const selectJobNumber = (val: string) => {
		setSelectedJobNo(val)
		const targetElement = document.querySelector(`[job-number="${val}"]`);
		if (targetElement) {
			targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	const getJobsFromUi = () => {
		// Get all divs with the custom attribute job-number
		const divs = document.querySelectorAll('div[job-number]');
		const jobNumbers = Array.from(divs).map(div => div.getAttribute('job-number'));
		setAllJobNumbers(jobNumbers);
		return jobNumbers;
	}

	const handleSearch = (value) => {
		const data = allJobNumbers.length > 0 ? allJobNumbers : getJobsFromUi();
		const filtered = data
			.filter(job => job.toLowerCase().includes(value.toLowerCase()))
			.map(job => ({ value: job }));
		setOptions(filtered);
	};

	return (
		<div>
			<Card size='small' title={<span style={{ display: 'flex', justifyContent: 'center', color: 'white' }}> Job Tracking Dashboard</span>} headStyle={{ backgroundColor: '#01576f' }} bodyStyle={{ background: '#f1f1f1' }} className="custom-main-card" >
				<Form layout="horizontal" form={formRef} style={{margin: '10px'}}>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={24} md={9} lg={7} xl={6}>
							<Form.Item label="Section Type" style={{ margin: '0px', padding: '0px' }}>
								<Select
									placeholder="Select Section Type"
									onChange={(value) => getAllSectionsByDepartmentsFromGbC(value)}
									allowClear
									showSearch
								>
									{processTypes.map((key) => (
										<Option key={key} value={key}>
											{processTypeEnumDisplayValues[key]}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={9} lg={7} xl={6}>
						<Form.Item label="Job Number" name='jobNumber' style={{ margin: '0px', padding: '0px' }}>
							<AutoComplete
								options={options}
								onSearch={handleSearch}
								placeholder="Type job number"
								allowClear
								onClear={() => setSelectedJobNo(undefined)}
								onChange={changeJobNumber}
								onSelect={selectJobNumber}
							>
								<Input />
							</AutoComplete>
						</Form.Item>
						</Col>
					</Row>
				</Form>
				<div className="planning-legend-row">
					<Tag className="legend-item">
						<span className="legend-shape circle" style={{ backgroundColor: 'gray' }}></span>
						<span style={{ color: '#333' }}>RM Not Requested</span>
					</Tag>

					<Tag className="legend-item">
						<span className="legend-shape circle" style={{ backgroundColor: 'green' }}></span>
						<span style={{ color: '#333' }}>RM Requested & Waiting For RM</span>
					</Tag>

					<Tag className="legend-item">
						<span className="legend-shape circle" style={{ backgroundColor: 'orange' }}></span>
						<span style={{ color: '#333' }}>RM Partially Issued</span>
					</Tag>
					<Tag className="legend-item">
						<span className="legend-shape square" style={{ backgroundColor: 'orange' }}></span>
						<span style={{ color: '#333' }}>Partially Eligible To Give Input To Line</span>
					</Tag>

					<Tag className="legend-item">
						<span className="legend-shape square" style={{ backgroundColor: 'green' }}></span>
						<span style={{ color: '#333' }}>Fully Eligible To Give Input To Line</span>
					</Tag>

					<Tag className="legend-item">
						<span className="legend-shape square" style={{ backgroundColor: 'gray' }}></span>
						<span style={{ color: '#333' }}>No Eligible Qty To Give Input To Line</span>
					</Tag>

					<Tag className="legend-item">
						<span className="legend-shape square" style={{ backgroundColor: 'green' }}></span>
						<span style={{ color: '#333' }}>Input Fully Reported AND WIP</span>
					</Tag>

				</div>
				<Row gutter={[16, 16]}>
					{sectionData.map(secObj =>
						<SectionCard
							sectionObj={secObj}
							selectedJobNo={selectedJobNo}
						/>
					)}
				</Row>
				<br />
			</Card>

		</div>
	);
};

export default SewingJobTracking;
