import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
// components/common/RowActions.tsx
import React, { useState } from 'react';

import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

interface RowActionsProps {
  actions: ActionItem[];
}

const RowActions: React.FC<RowActionsProps> = ({ actions }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (callback: () => void) => {
    handleClose();
    callback();
  };

  return (
    <>
      <IconButton
        aria-label="actions"
        aria-controls={open ? "row-actions-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
        data-testid='btn-row-actions'
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="row-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {actions.map((action, index) => (
          <MenuItem 
            key={index} 
            onClick={() => handleAction(action.onClick)}
          >
            {action.icon && (
              <ListItemIcon sx={{ color: action.color || 'inherit' }}>
                {action.icon}
              </ListItemIcon>
            )}
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default RowActions;