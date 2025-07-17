import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

export default function KickoutIcon({ onClick }: any) {
  return (
    <Tooltip title="Click to kickout the user." placement="top" onClick={onClick}>
      <PowerSettingsNewIcon color="secondary"></PowerSettingsNewIcon>
    </Tooltip>
  );
}
