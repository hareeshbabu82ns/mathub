import React, { useEffect, useState } from 'react';
import { Button, Grid, IconButton, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation, gql } from '@apollo/client';

import { ABACUS_SETTINGS_DEFAULT } from '../../utils/abacus_utils';
import { FormInputCheckbox } from '../../components/FormInput/FormInputCheckbox';
import { FormInputSlider } from '../../components/FormInput/FormInputSlider';
import Panel from '../../components/Panel';

const FETCH_TEST_SETTINGS = gql`
  query {
    testsettings(where: { type: ABACUS }) {
      id
      settings
    }
  }
`;

const CREATE_TEST_SETTINGS = gql`
  mutation ($settings: Json) {
    createTestsetting(data: { type: ABACUS, settings: $settings }) {
      id
    }
  }
`;

const UPDATE_TEST_SETTINGS = gql`
  mutation ($id: ID!, $settings: Json) {
    updateTestsetting(where: { id: $id }, data: { type: ABACUS, settings: $settings }) {
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
    if (settings?.id) {
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
  ...ABACUS_SETTINGS_DEFAULT,
  timeLimit: 8, //in min
  timeLimitPerQuestion: 30, // in sec
};

const settingsFormSchema = yup.object().shape({
  totalQuestions: yup.number().min(10).max(50).required(),
  minCount: yup.number().min(2).max(10).lessThan(yup.ref('maxCount')).required(),
  maxCount: yup.number().min(2).max(10).moreThan(yup.ref('minCount')).required(),
  minLengthOfDigits: yup.number().min(1).max(5).required(),
  maxLengthOfDigits: yup.number().min(1).max(5).required(),
  minSum: yup.number().min(0).max(100).lessThan(yup.ref('maxSum')).required(),
  maxSum: yup.number().min(0).max(100).moreThan(yup.ref('minSum')).required(),
  maxNumber: yup.number().min(1).max(100).required(),
  isNegativeAllowed: yup.bool(),
  timeLimit: yup.number().min(0).required(),
  timeLimitPerQuestion: yup.number().min(0).required(),
});

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
  // console.log(settingsFormSchema.fields.totalQuestions);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormInputSlider
            name="totalQuestions"
            label="Total Questions (10-50)"
            control={control}
            setValue={setValue}
            min={10}
            max={50}
            step={5}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputSlider
            name="maxNumber"
            label="Max Number (1-100)"
            control={control}
            setValue={setValue}
            min={1}
            max={100}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputSlider
            name="minLengthOfDigits"
            label="Min Digits (1-5)"
            control={control}
            setValue={setValue}
            min={1}
            max={5}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputSlider
            name="maxLengthOfDigits"
            label="Max Digits (1-5)"
            control={control}
            setValue={setValue}
            min={1}
            max={5}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputCheckbox name="isNegativeAllowed" label="Include -VEs" control={control} />
        </Grid>

        <Grid item xs={12} sm={6}></Grid>

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
      </Grid>
    </form>
  );
};
export default SettingsPage;
