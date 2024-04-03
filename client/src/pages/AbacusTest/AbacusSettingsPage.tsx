import {
  RotateCcw as RefetchIcon,
  Undo2 as ResetIcon,
  PlaySquare as StartIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
// import { z } from 'zod'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { IAbacusSettingsData, INIT_ABACUS_SETTINGS } from '@/lib/abacus_types'
import { useForm, useFormContext } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import {
  CREATE_TEST_SETTINGS,
  FETCH_TEST_SETTINGS,
  UPDATE_TEST_SETTINGS,
} from '@/lib/gql_queries'
import WithLoaderErrorOverlay from '@/components/WithLoaderErrorOverlay'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// const formSchema = z.object({
//   username: z
//     .string()
//     .min(2, { message: 'Username must be at least 2 characters.' }),
// })

const AbacusSettingsPage = () => {
  const navigate = useNavigate()

  const [refreshCount, setRefreshCount] = useState(0)

  const { loading, error, data, refetch } = useQuery(FETCH_TEST_SETTINGS, {
    variables: { type: 'ABACUS' },
  })
  const [createTestSetting, { error: createErrors }] =
    useMutation(CREATE_TEST_SETTINGS)
  const [updateTestSetting, { error: updateErrors }] =
    useMutation(UPDATE_TEST_SETTINGS)

  const handleSubmit = async (formSettings: Partial<IAbacusSettingsData>) => {
    const settings = {
      ...INIT_ABACUS_SETTINGS,
      ...formSettings,
    } satisfies IAbacusSettingsData

    console.log(settings)
    let settingsId = data.testsettings[0]?.id

    if (settingsId) {
      const { errors } = await updateTestSetting({
        variables: {
          id: settingsId,
          type: 'ABACUS',
          settings,
        },
      })
      if (errors) {
        console.error(errors)
        return
      }
    } else {
      const { data, errors } = await createTestSetting({
        variables: {
          type: 'ABACUS',
          settings,
        },
      })
      if (errors) {
        console.error(errors)
        return
      } else if (data) {
        console.log(data)
        settingsId = data.createTestsetting.id
      }
    }
    handleRefresh()
    navigate('new', {
      state: {
        replace: true,
      },
    })
  }

  const handleRefresh = () => {
    setRefreshCount((count) => count + 1)
    refetch()
  }

  return (
    <WithLoaderErrorOverlay
      loading={loading}
      error={error || createErrors || updateErrors}
    >
      <SettingsForm
        key={`settings-form-${refreshCount}`}
        onRefetch={handleRefresh}
        onSubmit={handleSubmit}
        initSettings={{
          ...INIT_ABACUS_SETTINGS,
          ...data?.testsettings[0]?.settings,
        }}
      />
    </WithLoaderErrorOverlay>
  )
}

export default AbacusSettingsPage

interface IFormProps {
  numberRange: [number, number]
  digitRange: [number, number]
  totalQuestions: [number]
  isNegativeAllowed: boolean
  timeLimit: [number]
  timeLimitPerQuestion: [number]
}

const SettingsForm = ({
  onSubmit,
  onRefetch,
  initSettings,
}: {
  onSubmit: (settings: Partial<IAbacusSettingsData>) => void
  onRefetch: () => void
  initSettings: IAbacusSettingsData
}) => {
  const onSubmitForm = (formData: IFormProps) => {
    const res = {
      ...formData,
      minNumber: formData.numberRange[0],
      maxNumber: formData.numberRange[1],
      minLengthOfDigits: formData.digitRange[0],
      maxLengthOfDigits: formData.digitRange[1],
      totalQuestions: formData.totalQuestions[0],
      timeLimit: formData.timeLimit[0],
      timeLimitPerQuestion: formData.timeLimitPerQuestion[0],
    } satisfies Partial<IAbacusSettingsData>
    console.log(res)
    onSubmit(res)
  }

  const formData = useForm<IFormProps>({
    defaultValues: {
      isNegativeAllowed: initSettings.isNegativeAllowed,
      timeLimit: [initSettings.timeLimit],
      timeLimitPerQuestion: [initSettings.timeLimitPerQuestion],
      numberRange: [initSettings.minNumber, initSettings.maxNumber],
      digitRange: [
        initSettings.minLengthOfDigits,
        initSettings.maxLengthOfDigits,
      ],
      totalQuestions: [initSettings.totalQuestions],
    },
    // resolver: zodResolver(formSchema),
  })
  const { handleSubmit, reset } = formData

  return (
    <Form {...formData}>
      <form
        className="grid w-full items-start overflow-auto"
        onSubmit={handleSubmit(onSubmitForm)}
      >
        <div className="rounded-sm border">
          <div className="flex items-center justify-between border-b-2 p-2 px-4">
            <h1 className="text-lg font-extrabold">Settings</h1>
            <div>
              <Button
                variant="ghost"
                type="button"
                onClick={onRefetch}
                disabled={!onRefetch}
              >
                <RefetchIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <SettingsFields />
          <div className="flex flex-row-reverse gap-2 border-t px-4 py-2">
            <Button variant="outline" type="button" onClick={() => reset()}>
              <ResetIcon className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button className="bg-primary">
              <StartIcon className="mr-2 h-4 w-4" /> Start Test
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
const SettingsFields = () => {
  const { control } = useFormContext()
  return (
    <div className="grid gap-6 p-4 py-8 md:grid-cols-2 lg:px-8">
      {/* totalQuestions */}
      <div className="grid gap-3">
        <FormField
          control={control}
          name="totalQuestions"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Total Questions ({field.value})</FormLabel>
              <FormControl>
                <Slider
                  {...field}
                  min={10}
                  step={5}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Total Number of Questions in the Test.
              </FormDescription>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />
      </div>
      {/* numberRange */}
      <div className="grid gap-3">
        <FormField
          control={control}
          name="numberRange"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Number Range {`[${field.value}]`}</FormLabel>
              <FormControl>
                <Slider
                  {...field}
                  min={1}
                  step={5}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Min and Max range of each generated numbers. If -ve allowed then
                Min value goes -Min.
              </FormDescription>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />
      </div>
      {/* digitRange */}
      <div className="grid gap-3">
        <FormField
          control={control}
          name="digitRange"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Digits Range {`[${field.value}]`}</FormLabel>
              <FormControl>
                <Slider
                  {...field}
                  min={1}
                  max={5}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Min and Max Digits of each generated number. If -ve allowed then
                Min value goes -Min.
              </FormDescription>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />
      </div>
      {/* isNegativeAllowed */}
      <div className="grid gap-3">
        <FormField
          control={control}
          name="isNegativeAllowed"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormControl>
                <Switch
                  {...field}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Generate -ve Numbers.</FormDescription>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />
      </div>
      {/* timeLimit */}
      <div className="grid gap-3">
        <FormField
          control={control}
          name="timeLimit"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Test Duration ({field.value} min)</FormLabel>
              <FormControl>
                <Slider
                  {...field}
                  min={8}
                  step={8}
                  max={80}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                8min for 100 questions is the base (4.8 sec per question).
              </FormDescription>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />
      </div>
      {/* timeLimitPerQuestion */}
      <div className="grid gap-3">
        <FormField
          control={control}
          name="timeLimitPerQuestion"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Question Duration ({field.value} sec)</FormLabel>
              <FormControl>
                <Slider
                  {...field}
                  min={5}
                  step={5}
                  max={50}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>4.8 sec per question</FormDescription>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
