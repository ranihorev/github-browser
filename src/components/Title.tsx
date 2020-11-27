import React from 'react';
import InfoIcon from '@material-ui/icons/Info';
import { Tooltip } from '@material-ui/core';

export const Title: React.FC<{ tooltip?: string }> = ({ children, tooltip }) => {
  return (
    <div className="text-lg capitalize font-semibold mb-6 flex flex-row items-center">
      {children}
      {tooltip && (
        <Tooltip title="Repos are sort by: 2 * #_forks + #_stars. More robust sorting coming soon">
          <InfoIcon fontSize="small" className="ml-2" />
        </Tooltip>
      )}
    </div>
  );
};
