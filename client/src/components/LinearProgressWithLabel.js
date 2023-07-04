import { Box, LinearProgress, Typography } from "@mui/material";

export default function LinearProgressWithLabel({ valueLimit, valueLeft, formatter, ...rest }) {
  const MIN = 0
  const MAX = valueLimit
  const normalise = (value) => ((value - MIN) * 100) / (MAX - MIN);

  const format = (value) => {
    return formatter ? formatter(value)
      : `${Math.round(value)}`
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={normalise(valueLimit - valueLeft)} {...rest} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {format(valueLeft)}</Typography>
      </Box>
    </Box>
  );
}