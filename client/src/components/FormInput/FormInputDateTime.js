import React from "react";
import {
  DateTimePicker,
  LocalizationProvider,
} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterMoment';
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
// import { DATE_FORMAT_DB } from "../../constants";
// const DATE_FORMAT = "dd-MMM-yy";

export function FormInputDateTime({ name, control, label, rules, ...rest }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => (
          <DateTimePicker
            disableFuture
            id={`date-${Math.random()}`}
            label={label}
            onChange={(val) => { onChange(val) }}
            value={value}
            inputFormat="yyyy/MM/DD HH:mm:ss"
            ampm={false}
            mask="____/__/__ __:__:__"
            error={!!error}
            renderInput={(props) => <TextField fullWidth size="small"
              {...rest} {...props} error={!!error} helperText={error?.type} />}
          />
        )}
      />
    </LocalizationProvider>
  );
};