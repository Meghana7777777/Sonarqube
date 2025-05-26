import { PoCreationService } from "@xpparel/shared-services";
import { Card, Col, Form, Row, message } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";

export interface TopDefectProps {
    fromDate: any;
    toDate: any;

}
export const DefectWise = (props: TopDefectProps) => {
    const [customer, setCustomer] = useState<any[]>([])
    const poCreationService = new PoCreationService();

    useEffect(() => {
        getAllBuyerWiseDefect(props.fromDate, props.toDate);
    }, [props.fromDate, props.toDate]);

    const getAllBuyerWiseDefect = (fromDate?, toDate?) => {
        poCreationService.getAllBuyerWiseDefect({ fromDate, toDate })
            .then((res) => {
                if (res.status) {
                    setCustomer(res.data);
                } else {
                    if (res) {
                        setCustomer([]);
                    } else {
                        message.error("Data not found");
                    }
                }
            })
            .catch((err) => {
                message.error("Data not found");
                setCustomer([]);
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
            text: 'Buyer-wise Defect Rate'
        },
        xAxis: {
            categories: customer.map(item => item.first_name),
        },
        yAxis: {
            title: {
                text: 'Defect Rate (%)'
            }
        },
        series: [{
            name: 'Defect Rate',
            data: customer.map(item => item.defectRate ?? 0).filter(rate => rate !== null && rate !== undefined).map(Number),
        }],
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        navigation: {
            buttonOptions: {
                enabled: true
            }
        },
        rangeSelector: {
            buttons: [{
                type: 'day',
                count: 1,
                text: 'Today'
            }, {
                type: 'week',
                count: 1,
                text: 'This Week'
            }, {
                type: 'month',
                count: 1,
                text: 'This Month'
            }],
            selected: 0
        }

    }
    return (

        <div>
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
        </div>
    );
}