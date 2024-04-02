import { Control, useController } from 'react-hook-form'
import { Slider } from '../ui/slider'

interface IRangeSliderProps {
  name: string
  control: Control
}

const RangeSlider = ({ name, control, ...rest }: IRangeSliderProps) => {
  const {
    field: { onChange, onBlur, value, ref },
    // fieldState: { error },
    // formState: { touchedFields, dirtyFields },
    formState: { disabled },
  } = useController({
    name,
    control,
    ...rest,
  })

  return (
    <Slider
      onValueChange={onChange}
      min={1}
      step={5}
      onBlur={onBlur}
      value={value}
      ref={ref}
      id={name}
      name={name}
      disabled={disabled}
      {...rest}
    />
  )
}

export default RangeSlider
