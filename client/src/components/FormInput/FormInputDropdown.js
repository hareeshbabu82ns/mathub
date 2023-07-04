import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";

// const options = [
//   {
//     label: "Dropdown Option 1",
//     value: "1",
//   },
//   {
//     label: "Dropdown Option 2",
//     value: "2",
//   },
// ];

export function FormInputDropdown({
  name,
  control,
  label,
  options,
  ...rest
}) {
  const generateSingleOptions = () => {
    return options.map(option => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      );
    });
  };

  return (
    <FormControl sx={{ width: '100%' }}>
      <InputLabel>{label}</InputLabel>
      <Controller
        render={({ field: { onChange, value } }) => (
          <Select
            size="small"
            {...rest}
            onChange={onChange} value={value}>
            {generateSingleOptions()}
          </Select>
        )}
        control={control}
        name={name}
      />
    </FormControl>
  );
}