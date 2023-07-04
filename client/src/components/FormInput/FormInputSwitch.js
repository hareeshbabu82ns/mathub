import React from "react";
import { Switch } from "@mui/material";
import { Controller } from "react-hook-form";


export function FormInputSwitch({
  name,
  control,
  label,
  ...rest
}) {
  return (
    <Controller
      render={({ field: { onChange, value } }) => (
        <Switch
          // size="small"
          {...rest}
          onChange={onChange}
          checked={value}>
        </Switch>
      )}
      control={control}
      name={name}
    />
  );
}