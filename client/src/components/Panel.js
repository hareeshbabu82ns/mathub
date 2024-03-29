import React from 'react';
import { Box, CircularProgress, Paper, Stack, Toolbar, Typography } from '@mui/material';

const Panel = ({
  title,
  toolbarActions,
  children,
  actionsLeft,
  actionsRight,
  loading,
  onRefresh,
}) => {
  const loadingPanel = (
    <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.900' }}>
      <Toolbar sx={{ backgroundColor: 'primary.100', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {' '}
          Loading...{' '}
        </Typography>
      </Toolbar>

      <Paper sx={{ p: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    </Box>
  );

  if (loading) return loadingPanel;

  return (
    <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.900', flex: 1 }}>
      {/* Header */}
      {(title || toolbarActions || onRefresh) && (
        <Toolbar sx={{ backgroundColor: 'primary.100', borderRadius: 1 }}>
          {typeof title === 'string' ? (
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {' '}
              {title}{' '}
            </Typography>
          ) : (
            <Box sx={{ flexGrow: 1 }}>{title}</Box>
          )}
          <Stack direction="row" spacing={1}>
            {toolbarActions}
          </Stack>
        </Toolbar>
      )}

      <Paper sx={{ p: 2 }}>
        {children}

        {(actionsLeft || actionsRight) && (
          <Stack
            sx={{ pt: 1, mt: 2, borderTop: 1, borderColor: 'grey.400' }}
            direction="row"
            spacing={2}
            // justifyContent="flex-end"
          >
            {(actionsLeft || actionsRight) && <Box sx={{ flexGrow: 1 }}>{actionsLeft}</Box>}
            {actionsRight && <Box>{actionsRight}</Box>}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default Panel;
