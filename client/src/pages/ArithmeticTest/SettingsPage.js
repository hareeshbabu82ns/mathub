import React, { useEffect, useState } from 'react';
import { Button, Grid, IconButton, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation, gql } from '@apollo/client';

import {
  ARITHMETIC_OPERATION,
  ARITHMETIC_OPERATIONS_ALL,
  ARITHMETIC_OPERATIONS_DEFAULT,
} from '../../utils/gen_arithmetic_qa';
import { FormInputCheckbox } from '../../components/FormInput/FormInputCheckbox';
import { FormInputSlider } from '../../components/FormInput/FormInputSlider';
import Panel from '../../components/Panel';

import { FormInputMultiSelect } from '../../components/FormInput/FormInputMultiSelect';
import _ from 'lodash';

const FETCH_TEST_SETTINGS = gql`
  query {
    testsettings(where: { type: ARITHMETIC }) {
      id
      settings
    }
  }
`;

const CREATE_TEST_SETTINGS = gql`
  mutation ($settings: Json) {
    createTestsetting(data: { type: ARITHMETIC, settings: $settings }) {
      id
    }
  }
`;

const UPDATE_TEST_SETTINGS = gql`
  mutation ($id: ID!, $settings: Json) {
    updateTestsetting(where: { id: $id }, data: { type: ARITHMETIC, settings: $settings }) {
      id
    }
  }
`;

const SettingsPage = () => {
  const navigate = useNavigate();

  const [count, setCount] = useState(0);
  const [settings, setSettings] = useState({ ...defaultSettings });

  const { loading, error, data, refetch } = useQuery(FETCH_TEST_SETTINGS);
  const [createTestSetting] = useMutation(CREATE_TEST_SETTINGS);
  const [updateTestSetting] = useMutation(UPDATE_TEST_SETTINGS);

  const onSubmit = async (formData) => {
    // console.log(formData)
    if (!_.isEmpty(settings.id)) {
      // update settings
      await updateTestSetting({ variables: { id: settings.id, settings: formData } });
    } else {
      await createTestSetting({ variables: { settings: formData } });
    }
    navigate('new', {
      state: {
        qSettings: {
          ...formData,
          max: Math.pow(10, parseInt(formData.maxDigits)),
          count: formData.totalQuestions,
          includingOperations: formData.includingOperations.map(
            (op) => ARITHMETIC_OPERATION[op].sign,
          ),
        },
        replace: true,
      },
    });
  };

  useEffect(() => {
    if (data?.testsettings?.length >= 1) {
      const settingData = data.testsettings[0];
      // console.log(settingData)
      setSettings({ ...settingData?.settings, id: settingData.id });
    }
  }, [data]);

  return (
    <SettingsView
      key={(settings.id || 'testSettings') + count}
      onSubmit={onSubmit}
      onRefetch={async () => {
        await refetch();
        setCount(count + 1);
      }}
      loading={loading}
      defaultValues={settings}
    />
  );
};

export const defaultSettings = {
  totalQuestions: 10,
  maxDigits: 1,
  nonNegative: true, // subtraction with +ves
  nonReminder: true, // division with whole numbers
  timeLimit: 30, //in min
  timeLimitPerQuestion: 30, // in sec
  includingOperations: ARITHMETIC_OPERATIONS_DEFAULT,
};

const settingsFormSchema = yup.object().shape({
  totalQuestions: yup.number().min(10).max(50).required(),
  maxDigits: yup.number().min(1).max(5).required(),
  nonNegative: yup.bool(),
  nonReminder: yup.bool(),
  timeLimit: yup.number().min(0).required(),
  timeLimitPerQuestion: yup.number().min(0).required(),
  includingOperations: yup.array(yup.string()).min(1),
});

const ARITHMETIC_OPERATION_OPTIONS = ARITHMETIC_OPERATIONS_ALL.map((o) => ({ label: o, value: o }));

const SettingsView = ({ onSubmit, defaultValues, loading, onRefetch }) => {
  const form = useForm({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(settingsFormSchema),
  });
  const { handleSubmit, reset } = form;

  const handleSubmitAPI = async (data) => {
    await onSubmit(data)
      .then(() => form.reset(data))
      .catch((err) => console.error(err));
  };

  const actionsRight = (
    <Stack direction="row" spacing={2}>
      <Button variant={'contained'} onClick={handleSubmit(handleSubmitAPI)}>
        Start Test
      </Button>
      <Button onClick={() => reset()} variant={'outlined'}>
        Reset
      </Button>
    </Stack>
  );

  const toolbarActions = (
    <React.Fragment>
      <IconButton disabled={loading} onClick={onRefetch}>
        <RefreshIcon />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Panel
      title="Settings"
      toolbarActions={toolbarActions}
      actionsRight={actionsRight}
      loading={loading}
    >
      <SettingsFormView form={form} onSubmit={handleSubmitAPI} />
    </Panel>
  );
};

const SettingsFormView = ({ form, onSubmit }) => {
  const { formState, control, handleSubmit, setValue } = form;
  const { errors, isSubmitting } = formState;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormInputSlider
            name="totalQuestions"
            label="Total Questions"
            control={control}
            setValue={setValue}
            min={10}
            max={50}
            step={5}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputSlider
            name="maxDigits"
            label="Operand Digits"
            control={control}
            setValue={setValue}
            min={1}
            max={5}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputCheckbox name="nonNegative" label="No -VEs" control={control} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputCheckbox name="nonReminder" label="No Reminder Division" control={control} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputSlider
            name="timeLimit"
            label="Time for Test (in Min)"
            control={control}
            setValue={setValue}
            min={0}
            max={300}
            step={15}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputSlider
            name="timeLimitPerQuestion"
            label="Time Per Question (in Sec)"
            control={control}
            setValue={setValue}
            min={0}
            max={300}
            step={15}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputMultiSelect
            name="includingOperations"
            label="Arithmetic Operations"
            control={control}
            options={ARITHMETIC_OPERATION_OPTIONS}
          />
        </Grid>
      </Grid>
    </form>
  );
};
export default SettingsPage;
