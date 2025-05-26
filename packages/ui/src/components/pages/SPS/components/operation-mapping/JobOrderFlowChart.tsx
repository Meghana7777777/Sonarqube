import ReactFlow, { Node, Edge, Controls, Background, useNodesState, useEdgesState, Handle, Position, BezierEdge, StraightEdge, NodeChange, addEdge, } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { AnimatedSVGEdge } from './animated-circle';
import './job-order-flow.css'
import { Tag } from 'antd';
import fullGarment from '..//..//..//..//../assets/images/OperationTracking/suit-3.png'
import semiGarment from '..//..//..//..//../assets/images/OperationTracking/suit-1.png' //whiteOutline
import garment from '..//..//..//..//../assets/images/OperationTracking/white-garment.png'
import { useCallback, useEffect, useState } from 'react';
import { OpGroupModel, SewGroupModel, SewVersionModel } from '@xpparel/shared-models';



interface JobOrderFlowProps {
  jobOrderFlowData: SewVersionModel
}

const CustomNode = ({ data }: any) => {
  return (
    <div className='node-div' style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', width: "323.5px", }}>
      {data.label}
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };
const edgeTypes = {
  solidEdge: (props) => (
    <BezierEdge  {...props} style={{ stroke: 'white', strokeWidth: 1 }} />
    // <StraightEdge {...props} style={{ stroke: 'white', strokeWidth: 1 }} />
  ),
};


const getIconForNode = (nodeId: string, finalJobOrders: string[], isFinalProduct: boolean, isFirstNode: boolean) => {
  if (isFirstNode) {
    return garment;
  }
  if (isFinalProduct || finalJobOrders?.includes(nodeId)) {
    return fullGarment;
  }
  return semiGarment;
};

const getFirstNodeId = (opGroups: OpGroupModel[]): string | null => {
  console.log(opGroups, 'opGroups')
  const firstNode = opGroups?.find(group => group?.depGroups?.includes(""));
  return firstNode ? firstNode.group : null;
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const JobOrderFlow = ({ jobOrderFlowData }: JobOrderFlowProps) => {
  console.log(jobOrderFlowData, 'jobOrderFlowData')
  // const [layoutedNodes, setlayoutedNodes] = useState([]);
  // const [layoutedEdges, setlayoutedEdges] = useState([]);
  // useEffect(() => {
  //   console.log(jobOrderFlowData,'jobOrderFlowData')
  //   setInitialNodesData()
  // }, [jobOrderFlowData])

  const setInitialNodesData = () => {
    const nodeWidth = 385;
    const nodeHeight = 360;

    const getLayoutedNodesAndEdges = (nodes: Node[], edges: Edge[]) => {
      dagreGraph.setGraph({ rankdir: 'LR' });

      nodes?.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });

      edges?.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      const layoutedNodes = nodes?.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.position = {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        };
        return node;
      });

      return { nodes: layoutedNodes, edges };
    };

    const firstNodeId = getFirstNodeId(jobOrderFlowData?.opGroups);
    console.log("First Node ID:", firstNodeId);

    const finalJobOrders = jobOrderFlowData?.opGroups?.map((group) => group.group)?.filter((groupId) => !jobOrderFlowData?.opGroups?.some((g) => g.depGroups?.includes(groupId)));

    // converted opGroups to nodes
    const initialNodes = jobOrderFlowData?.opGroups?.map((group) => {
      const isFirstNode = group?.group === firstNodeId;
      const icon = isFirstNode ? garment : getIconForNode(group?.group, finalJobOrders, false, false);
      return {
        id: group?.group,
        type: 'custom',
        data: {
          label: (
            <div style={{ position: 'relative' }}>
              <table className='node-box' style={{ width: '' }}>
                <tbody style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <tr className='node-box-text'>
                    <td>Job Group </td>
                    <td>: <strong style={{ fontSize: '28px' }}>{group.group}</strong></td>
                  </tr>
                  <tr className='node-box-text'>
                    <td>Operations </td>
                    <td>: <strong style={{ fontSize: '28px' }}>{group.operations.join(',')}</strong></td>
                  </tr>
                  <tr className='node-box-text'>
                    <td>Process Type </td>
                    <td>: <strong style={{ fontSize: '28px' }}>{group.groupCategory}</strong></td>
                  </tr>
                </tbody>
              </table>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className='node-box-text' style={{ textAlign: 'center' }}> Components: </span>
                <span style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {group?.components?.map((component) => (
                    <Tag color='blue' key={component} style={{ fontSize: '25px', marginTop: '5px', height: '28px' }}>
                      {component}
                    </Tag>
                  ))}
                </span>
              </div>
              <img src={icon} alt='icon' style={{ position: 'absolute', bottom: '-70px', left: '50%', transform: 'translateX(-50%)', width: '50px', height: '50px', marginTop: '8px' }} />
            </div>
          ),
        },
        position: { x: 0, y: 0 },
      };
    });


    const knittingNode = {
      id: 'knitting',
      type: 'custom',
      data: {
        label: (
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <strong className='node-box-text'>Knitting</strong>
            <img src={garment} alt='Knitting Icon' style={{ position: 'absolute', bottom: '-70px', left: '50%', transform: 'translateX(-50%)', width: '50px', height: '50px' }} />
          </div>
        ),
      },
      position: { x: 0, y: 0 },
    };

    initialNodes?.unshift(knittingNode);

    // added a "Final Product node" to show teh final product as a visual ( this is not there in the data, just for showcase. Remove if not necessary!)
    const finalProductNode = {
      id: 'final-product',
      type: 'custom',
      data: {
        label: (
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <strong className='node-box-text'>Final Product</strong>
            <img src={fullGarment} alt="Full Garment" style={{ position: 'absolute', bottom: '-70px', left: '50%', transform: 'translateX(-50%)', width: '50px', height: '50px' }} />
          </div>
        ),
      },
      position: { x: 0, y: 0 },
    };

    initialNodes?.push(finalProductNode);

    // converted depGroups to edges
    const initialEdges = jobOrderFlowData?.opGroups?.flatMap((group) =>
      group?.depGroups?.filter((depGroup) => depGroup)?.map((depGroup) => ({
        id: `${depGroup}-${group.group}`,
        source: depGroup,
        target: group.group,
        type: 'solidEdge',
      }))
    );

    finalJobOrders?.forEach((finalJobOrder) => {
      initialEdges?.push({
        id: `${finalJobOrder}-final-product`,
        source: finalJobOrder,
        target: 'final-product',
        type: 'solidEdge',
      });
    });

    if (firstNodeId) {
      initialEdges?.unshift({
        id: `knitting-${firstNodeId}`,
        source: 'knitting',
        target: firstNodeId,
        type: 'solidEdge',
      });
    }

    // console.log(initialNodes,initialEdges,'initialEdges')
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedNodesAndEdges(initialNodes, initialEdges);

    // setlayoutedNodes(layoutedNodes);
    // setlayoutedEdges(layoutedEdges)
    return { layoutedNodes, layoutedEdges }
  }

  return <Customrenderer {...setInitialNodesData()} />

};

interface CustomNodeProps {
  layoutedNodes: any[];
  layoutedEdges: any[]
}
const Customrenderer = (props: CustomNodeProps) => {
  const { layoutedNodes, layoutedEdges } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges)
  }, [layoutedNodes, layoutedEdges]);


  return (
    <div style={{ height: '550px', width: '100%', background: 'black' }} >
      {/* //change the background color to white here  */}
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
      // onNodesChange={onNodesChangeLoacal}
      >
        <Controls />
        <Background color="black" gap={25} />
      </ReactFlow>
    </div>
  );
}

export default JobOrderFlow;
