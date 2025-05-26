import { PoCreationService } from "@xpparel/shared-services";
import { Card, Col, Form, Row, message } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";

export interface TopDefectPoProps {
  fromDate: any;
  toDate: any;

}
export const POWise = (props: TopDefectPoProps) => {
  const [po, setPo] = useState<any[]>([])
  const poCreationService = new PoCreationService();

  useEffect(() => {
    getAllPOWiseDefect(props.fromDate, props.toDate);
  }, [props.fromDate, props.toDate]);

  const getAllPOWiseDefect = (fromDate?, toDate?) => {
    poCreationService.getAllPOWiseDefect({ fromDate, toDate })
      .then((res) => {
        if (res.status) {
          setPo(res.data);
        } else {
          if (res) {
            setPo([]);
          } else {
            message.error("Data not found");
          }
        }
      })
      .catch((err) => {
        message.error("Data not found");
        setPo([]);
      });
  };

  const config = {
    colors: ['#058DC7', '#50B432', '#FFC000', '#7798BF', '#aaeeee', '#188bb7',
      '#eeaaee', '#55BF3B', '#67adc9', '#7798BF', '#aaeeee'
    ],
    chart: {
      type: 'column'
    },
    title: {
      text: 'PO-wise Defect Rate'
    },
    xAxis: {
      categories: po.map(item => item.po_number),
    },
    yAxis: {
      title: {
        text: 'Defect Rate (%)'
      }
    },
    series: [{
      name: 'Defect Rate',
      data: po.map(item => item.defectRate ?? 0).filter(rate => rate !== null && rate !== undefined).map(Number)
    }]
  }
  return (

    <div>
      {/* <Card
        bordered={true}
        style={{
          width: "100%",
          marginBottom: 16,
          borderRadius: 8,
          backgroundColor:'#CCCCFF'
        }}
      > */}
      <Card>
        <Form layout="vertical" name="control-hooks">
          <Row gutter={24}>
            <Col span={24}>
              <div>
                <HighchartsReact highcharts={Highcharts} options={config} />
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
      {/* </Card> */}
    </div>
  );
}