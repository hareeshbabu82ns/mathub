import {
  Checkbox,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { Controller } from "react-hook-form";

export function FormInputCheckbox({
  name,
  control,
  setValue,
  label,
  ...rest
}) {
  return (
    <FormControl size={"small"} variant={"outlined"}>
      <Controller
        render={({ field: { onChange, value } }) => (
          <FormControlLabel
            // value="start"
            label={label || ''}
            labelPlacement="start"
            control={
              <Checkbox
                {...rest}
                checked={value}
                onChange={onChange}
              />}
          />
        )}
        control={control}
        name={name}
      />
    </FormControl>
  );
};