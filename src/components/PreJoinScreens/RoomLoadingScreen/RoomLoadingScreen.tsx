import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function RoomLoadingScreen() {
  return (
    <>
      <Grid container justify="center" alignItems="center" direction="column" style={{ height: '100%' }}>
        <div>
          <CircularProgress variant="indeterminate" />
        </div>
        <div>
          <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Validating Room
          </Typography>
        </div>
      </Grid>
    </>
  );
}
