import React from 'react';
import { Controller } from 'react-hook-form';
import CheckIcon from '@mui/icons-material/Check';
import { Checkbox, FormControl, FormControlLabel, Stack, ToggleButton } from '@mui/material';

export const FormInputChoices = ({ name, control, rules, choices, disabled, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
        <FormControl size={'small'} variant={'filled'}>
          <Stack direction="row" spacing={2}>
            {choices?.map((choice, i) => (
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
            ))}
          </Stack>
        </FormControl>
      )}
    />
  );
};
