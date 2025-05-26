import React from 'react';
import { DatePicker, Space } from 'antd';
import type { DatePickerProps } from 'antd/es/date-picker';
import { defaultDateTimeFormat, defaultTimePicker } from '../../../common/data-picker/date-picker';

export const Datepicker = () => {
  const onChange = (value: DatePickerProps['value'], dateString: string) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  const onOk = (value: DatePickerProps['value']) => {
    console.log('onOk: ', value);
  };

  return (
    <div>
      <Space direction="vertical" size={12}>
        <DatePicker
          showTime={{ format: defaultTimePicker }}
          format={defaultDateTimeFormat}
          onChange={onChange}
          onOk={onOk}
        />
      </Space>

    </div>
  )
}

export default Datepicker;