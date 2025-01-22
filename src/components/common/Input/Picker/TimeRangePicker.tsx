import React from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import dayjs from 'dayjs';

interface TimeRangePickerProps {
  value: { from: any; to: any };
  onChange: (newValue: { from: any; to: any }) => void;
  clearable?: boolean;
  name?: string;
}

const TimeRangePicker: React.FC<TimeRangePickerProps> = (props) => {
  const name = props?.name || 'time-picker';

  const handleTimeChange = (time: string, type: string) => {
    if (!time) return;
    let from = props.value?.from ? dayjs(props.value.from, 'h:mm A') : null;
    let to = props.value?.to ? dayjs(props.value.to, 'h:mm A') : null;

    if (type === 'from') {
      from = dayjs(time, 'h:mm A');
    } else {
      to = dayjs(time, 'h:mm A');
    }

    if (from && to && dayjs(from).isAfter(dayjs(to))) {
      [from, to] = [to, from];
    }

    props.onChange({ from, to });
  };

  const handleClear = () => {
    props.onChange({ from: null, to: null });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex items-center gap-2">
        <TimePicker
          name={`${name}-from`}
          timeSteps={{ minutes: 1 }}
          value={props.value?.from ? dayjs(props.value.from, 'h:mm A') : null}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '2px solid var(--background-secondary-color) !important',
              },
            },
          }}
          onChange={(time) => handleTimeChange(time?.format('h:mm A') || '', 'from')}
          format="h:mm A"
        />
        <span className="text-gray-500">to</span>
        <TimePicker
          name={`${name}-to`}
          timeSteps={{ minutes: 1 }}
          value={props.value?.to ? dayjs(props.value.to, 'h:mm A') : null}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '2px solid var(--background-secondary-color) !important',
              },
            },
          }}
          onChange={(time) => handleTimeChange(time?.format('h:mm A') || '', 'to')}
          format="h:mm A"
        />
        {props.clearable && (
          <IconButton onClick={handleClear} aria-label="clear time range">
            <ClearIcon className="text-red-500" />
          </IconButton>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default TimeRangePicker;