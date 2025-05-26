import { GRNPauseReasonsEnum } from '@xpparel/shared-models';
import { FormInstance, Select } from 'antd';
import { ScxColumn, ScxForm, ScxRow } from '../../../../schemax-component-lib';

interface IGrnRemarksProps {
    formRef: FormInstance<any>
}

export const GrnRemarks = (props: IGrnRemarksProps) => {
    const { formRef } = props;

    const Option = Select;
    return (
        <ScxForm form={formRef}>
            <ScxRow justify="center" gutter={[16, 16]}>
                <ScxColumn xs={24} lg={15}>
                    <ScxForm.Item
                        label="Remarks"
                        name="remarks"
                        rules={[{ required: true, message: 'Enter Remarks' }]}>
                        <Select filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '100%' }} placeholder='Please Select'>
                            {Object.keys(GRNPauseReasonsEnum).map(reason => {
                                return <Option value={GRNPauseReasonsEnum[reason]}>{GRNPauseReasonsEnum[reason]}</Option>
                            })}
                        </Select>
                    </ScxForm.Item>
                </ScxColumn>
            </ScxRow>
        </ScxForm>
    )
}