import React from 'react';
import { Controller } from 'react-hook-form';
import CheckIcon from '@mui/icons-material/Check';
import { Checkbox, FormControl, FormControlLabel, Stack, ToggleButton } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

export const FormInputChoices = ({ name, control, rules, choices, disabled, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
        <FormControl size={'small'} variant={'filled'}>
          <Grid2 container spacing={2}>
            {choices?.map((choice, i) => (
              <Grid2 xs={6} md={3}>
                <ToggleButton
                  key={i}
                  value={choice}
                  disabled={disabled}
                  selected={value === choice}
                  onChange={() => (value === choice ? onChange('') : onChange(choice))}
                  sx={{ minWidth: 100 }}
                >
                  {choice}
                </ToggleButton>
              </Grid2>
            ))}
          </Grid2>
        </FormControl>
      )}
    />
  );
};
