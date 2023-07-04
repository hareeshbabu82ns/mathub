import React, { useEffect } from "react";
import { FormLabel, Slider } from "@mui/material";
import { Controller } from "react-hook-form";

export function FormInputSlider({
  name,
  control,
  setValue,
  label,
  min = 0,
  max = 100,
  step = 1,
  ...rest
}) {

  return (
    <>
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value },
          fieldState: { error },
          formState }) => {
          // console.log(value, error)
          return (
            <Slider
              onChange={onChange}
              valueLabelDisplay="auto"
              min={min}
              max={max}
              step={step}
              {...rest}
              value={value}
              color={error ? 'secondary' : 'primary'}
            />
          )
        }}
      />
    </>
  );
};