import React, { useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, Controls, Background, Handle, Position, BezierEdge } from 'reactflow';
import dagre from 'dagre';
import { Button, Tag } from 'antd';
import 'reactflow/dist/style.css';
// import './operation-rounting.css';
import { IProcessDetails, IProcessTypeData } from './op-routing-interface';

interface ProcessData {
    subProcess: string;
    selectedComponents: string[];
    selectedOperations: string[];
    selectedDependentSubProcess: string[];
}

const CustomNode = ({ data }) => {
    return (
        <div className='node-div' style={{ padding: '10px', borderRadius: '22px', background: '#fff', width: "100%", maxWidth: '350px' }}>
            {data.label}
            <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
            <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
        </div>
    );
};

const nodeTypes = { custom: CustomNode };
const edgeTypes = {
    solidEdge: (props) => (
        <BezierEdge {...props} style={{ stroke: 'white', strokeWidth: 1 }} />
    ),
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedNodesAndEdges = (nodes, edges) => {
    const nodeWidth = 315;
    const nodeHeight = 250;

    dagreGraph.setGraph({ rankdir: 'LR' });

    nodes.forEach(node => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach(edge => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return {
        nodes: nodes.map((node, index) => {
            const nodeWithPosition = dagreGraph.node(node.id);           
            return {
                ...node,
                // position: {
                //     x: nodeWithPosition?.x - nodeWidth / 2 || index * 350,
                //     y: nodeWithPosition?.y - nodeHeight / 2 || index * 200,
                // },
            };
        }),
        edges,
    };
};
interface IProps {
    processData: IProcessTypeData
}

const OperatingRoutingFlow: React.FC<IProps> = ({ processData }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        if (!processData) return () => { };

        const allProcesses: IProcessDetails[] = Object.values(processData).flat(); // Flatten all subprocesses
        const allSubProcess = allProcesses.flatMap(e => e.tblData); // Flatten all subprocesses


        const timeout = setTimeout(() => {
            const initialNodes = [];
            let x = 0;

            Object.keys(processData).forEach((processKey, mainIndex) => {
                let y = 0;
                let noOfParallelSubProcess = 1;
                processData[processKey].tblData.forEach((item, subIndex, tblData) => {
                    if (subIndex) {
                        const previousSubProcessObj = tblData[subIndex - 1];
                        if (previousSubProcessObj) {
                            if (item.selectedDependentSubProcess.includes(previousSubProcessObj.subProcess)) {
                                x += 400;
                                if (noOfParallelSubProcess > 1) {
                                    y = y / noOfParallelSubProcess;
                                }
                                noOfParallelSubProcess = 0;
                            } else {
                                noOfParallelSubProcess += 1;
                                y += 150;
                            }
                        } else {

                        }

                    } else {
                        if (mainIndex != 0) {
                            x += 400;
                        }
                    }
                    const abc = {
                        id: item.subProcess,
                        type: 'custom',
                        data: {
                            label:
                                <div style={{ position: 'relative' }}>
                                    <table className='node-box'>
                                        <tbody>
                                            <tr className='node-text'>
                                                <td>Sub Process </td>
                                                <td>: <Tag color="#2c8bb1">{item.subProcess}</Tag></td>
                                            </tr>
                                            <tr className='node-text'>
                                                <td>Components </td>
                                                <td>: {item.selectedComponents.map(component => (
                                                    <Tag color="#2c8bb1" key={component}>{component}</Tag>
                                                ))}</td>
                                            </tr>
                                            <tr className='node-text'>
                                                <td>Operations </td>
                                                <td>: {item.selectedOperations.map(operation => (
                                                    <Tag color="#2c8bb1" key={operation}>{operation}</Tag>
                                                ))}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                        },

                        position: { x: x, y: y },
                    }

                    initialNodes.push(abc);
                })
            })
            // const initialNodes1 = allSubProcess.map((item, subIndex) => {
            //     if (subIndex) {
            //         // if (subIndex + 1 <= allSubProcess.length) {
            //         const previousSubProcessObj = allSubProcess[subIndex - 1];
            //         console.log(item.subProcess, previousSubProcessObj);
            //         if (previousSubProcessObj) {
            //             if (item.selectedDependentSubProcess.includes(previousSubProcessObj.subProcess)) {
            //                 console.log(item.subProcess, "yessssssssssssssssssss")
            //                 x += 400;
            //                 if (noOfParallelSubProcess > 1) {
            //                     y = y / noOfParallelSubProcess;
            //                 }
            //                 noOfParallelSubProcess = 0;
            //             } else {
            //                 noOfParallelSubProcess += 1;
            //                 y += 150;
            //             }
            //         } else {

            //         }
            //         // }
            //     }
            //     const abc = {
            //         id: item.subProcess,
            //         type: 'custom',
            //         data: {
            //             label:
            //                 <div style={{ position: 'relative' }}>
            //                     <table className='node-box'>
            //                         <tbody>
            //                             <tr className='node-text'>
            //                                 <td>Sub Process </td>
            //                                 <td>: <Tag color="#2c8bb1">{item.subProcess}</Tag></td>
            //                             </tr>
            //                             <tr className='node-text'>
            //                                 <td>Components </td>
            //                                 <td>: {item.selectedComponents.map(component => (
            //                                     <Tag color="#2c8bb1" key={component}>{component}</Tag>
            //                                 ))}</td>
            //                             </tr>
            //                             <tr className='node-text'>
            //                                 <td>Operations </td>
            //                                 <td>: {item.selectedOperations.map(operation => (
            //                                     <Tag color="#2c8bb1" key={operation}>{operation}</Tag>
            //                                 ))}</td>
            //                             </tr>
            //                         </tbody>
            //                     </table>
            //                 </div>
            //         },

            //         position: { x: x, y: y },
            //     }

            //     return abc;
            // })

            const initialEdges = [];

            allSubProcess.forEach(item => {
                if (item.selectedDependentSubProcess && Array.isArray(item.selectedDependentSubProcess)) {
                    item.selectedDependentSubProcess.forEach(dep => {
                        if (dep !== "N/A") {
                            initialEdges.push({
                                id: `${dep}-${item.subProcess}`,
                                source: dep,
                                target: item.subProcess,
                                type: 'solidEdge',
                                animated: true,
                            });
                        }
                    });
                }
            });
         
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedNodesAndEdges(initialNodes, initialEdges);
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        }, 100);
        return () => clearTimeout(timeout);
    }, [processData]);

    return (
        <div style={{ position: 'relative' }}>
            <Button
                type="primary"
                onClick={() => setIsFullScreen(!isFullScreen)}
                style={{
                    position: 'absolute',
                    zIndex: 1000,
                    ...(isFullScreen ? { bottom: 531, right: 1 } : { top: 10, right: 10 })
                }}
            >
                {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            </Button>
            <div
                style={{
                    height: isFullScreen ? '100vh' : '550px',
                    width: isFullScreen ? '100vw' : '100%',
                    background: '#e1e1e1',
                    borderRadius: "10px",
                    position: isFullScreen ? 'fixed' : 'relative',
                    top: isFullScreen ? 0 : 'auto',
                    left: isFullScreen ? 0 : 'auto',
                    zIndex: isFullScreen ? 999 : 'auto',
                }}
            >
                <ReactFlow
                    fitView
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    edgeTypes={edgeTypes}
                    nodeTypes={nodeTypes}
                    nodesDraggable={true}
                >
                    <Controls />
                    <Background color="#e1e1e1" gap={25} />
                </ReactFlow>
            </div>
        </div>
    );
};

export default OperatingRoutingFlow;
