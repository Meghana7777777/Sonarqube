import React from 'react';
import './job-sheet.css';
import { SewingJobBatchDetails } from '@xpparel/shared-models';

interface Props {
    jobDetails: Record<string, SewingJobBatchDetails[]>;
}
interface GroupInfo {
    destination?: string;
    [key: string]: any;
}

export default function JobSheet(props: Props) {
    const { jobDetails } = props;
    function extractAllUniqueSizes(jobDetails: Record<string, any[]>): string[] {
        const allSizesSet = new Set<string>();

        Object.values(jobDetails).forEach(jobs => {
            jobs.forEach(job => {
                job.jobDetails.forEach(jobDetail => {
                    jobDetail.subLines.forEach(subLine => {
                        if (subLine?.size) {
                            allSizesSet.add(subLine.size);
                        }
                    });
                });
            });
        });

        return Array.from(allSizesSet).sort();
    }

    const allSizes = extractAllUniqueSizes(jobDetails);
    return (
        <div id="jobSheetId">
            <div style={{ display: 'flex', justifyContent: 'center', fontWeight: '600', fontSize: '18px' }}>
                Job Sheet
            </div>

            {Object.entries(jobDetails).map(([key, jobs], index) => {
                const firstJob = jobs[0];
                const firstJobDetail = firstJob?.jobDetails?.[0];
                const firstSubLine = firstJobDetail?.subLines?.[0];

                return (
                    <div key={index}>
                        <table className="ta-b" style={{ width: '40%', marginTop: '20px' }}>
                            <tbody>
                                <tr className="ta-b">
                                    <td className="ta-b">MO Number</td>
                                    <td className="ta-b">:</td>
                                    <td className="ta-b">{firstJob?.sewingJobBatchNo ?? '-'}</td>
                                </tr>
                                <tr className="ta-b">
                                    <td className="ta-b">MO Liner</td>
                                    <td className="ta-b">:</td>
                                    <td className="ta-b">{firstJobDetail?.jobHeaderNo ?? '-'}</td>
                                </tr>
                                <tr className="ta-b">
                                    <td className="ta-b">Style</td>
                                    <td className="ta-b">:</td>
                                    <td className="ta-b">{firstSubLine?.productName ?? '-'}</td>
                                </tr>
                                <tr className="ta-b">
                                    <td className="ta-b">Color</td>
                                    <td className="ta-b">:</td>
                                    <td className="ta-b">{firstSubLine?.fgColor ?? '-'}</td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="ta-b" style={{ marginTop: '40px', width: '100%' }}>
                            <thead>
                                <tr className="ta-b">
                                    <th className="ta-b">Style</th>
                                    <th className="ta-b">MO</th>
                                    <th className="ta-b">MO Line</th>
                                    <th className="ta-b">Destination</th>
                                    <th className="ta-b">Color</th>
                                    <th className="ta-b">Job</th>
                                    {allSizes.map(size => (
                                        <th key={size} className="ta-b">{size}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job, jobIndex) =>
                                    job.jobDetails.map((jobDetail, jobDetailIndex) => {
                                        const groupInfoObj: GroupInfo = (() => {
                                            try {
                                                return jobDetail.groupInfo ? JSON.parse(jobDetail.groupInfo) : {};
                                            } catch {
                                                return {};
                                            }
                                        })();

                                        const destination = groupInfoObj.destination ?? '-';
                                        const firstSubLine = jobDetail.subLines[0];
                                        const sizeDisplayMap: Record<string, string[]> = {};
                                        jobDetail.subLines.forEach(subLine => {
                                            const label = `${subLine.quantity ?? 0}`;
                                            if (!sizeDisplayMap[subLine.size]) {
                                                sizeDisplayMap[subLine.size] = [label];
                                            } else {
                                                sizeDisplayMap[subLine.size].push(label);
                                            }
                                        });
                                        return (
                                            <tr key={`${job.sewingJobBatchNo}-${jobDetail.jobHeaderNo}`}>
                                                <td className="ta-b">{firstSubLine?.productName ?? '-'}</td>
                                                <td className="ta-b">{job.sewingJobBatchNo}</td>
                                                <td className="ta-b">{jobDetail.jobHeaderNo}</td>
                                                <td className="ta-b">{destination}</td>
                                                <td className="ta-b">{firstSubLine?.fgColor ?? '-'}</td>
                                                <td className="ta-b">{jobDetail.jobNo ?? '-'}</td>
                                                {allSizes.map(size => (
                                                    <td key={size} className="ta-b">
                                                        {sizeDisplayMap[size]}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}
