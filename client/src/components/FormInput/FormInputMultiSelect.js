import React from "react";
import { Checkbox, FormControl, FormLabel, InputLabel, ListItemText, MenuItem, Select } from "@mui/material";
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function FormInputMultiSelect({
  name,
  control,
  label,
  options,
  ...rest
}) {
  const generateOptions = (value) => {
    return options.map(option => {
      return (
        <MenuItem key={option.value} value={option.value}>
          <Checkbox checked={value.indexOf(option.value) > -1} />
          <ListItemText primary={option.label} />
        </MenuItem>
      );
    });
  };

  return (
    <FormControl sx={{ width: '100%' }}>
      <FormLabel component="legend" id={`${name}-label`} >{label}</FormLabel>
      <Controller
        render={({ field: { onChange, value },
          fieldState: { error }, }) => {
          // console.log(error)
          return (
            <Select
              size="small"
              multiple
              renderValue={s => s.join(', ')}
              labelId={`${name}-label`}
              id={`${name}-multi-select`}
              MenuProps={MenuProps}
              {...rest}
              error={!!error}
              onChange={onChange} value={value}>
              {generateOptions(value)}
            </Select>
          )
        }}
        control={control}
        name={name}
      />
    </FormControl>
  );
}