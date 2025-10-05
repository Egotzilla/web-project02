'use client';

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useThemeMode } from './AppTheme';

export default function ColorModeIconDropdown({ size = 'small' }) {
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    handleClose();
  };

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <Brightness4Icon />;
      case 'dark':
        return <Brightness7Icon />;
      default:
        return <SettingsBrightnessIcon />;
    }
  };

  return (
    <>
      <IconButton
        size={size}
        onClick={handleClick}
        aria-label="Color mode settings"
        aria-controls={open ? 'color-mode-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          color: theme.palette.mode === 'light' ? 'black' : 'white',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.04)' 
              : 'rgba(255, 255, 255, 0.04)',
          },
        }}
      >
        {getIcon()}
      </IconButton>
      <Menu
        id="color-mode-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          onClick={() => handleModeChange('light')}
          selected={mode === 'light'}
        >
          <Brightness7Icon sx={{ mr: 1 }} />
          Light
        </MenuItem>
        <MenuItem 
          onClick={() => handleModeChange('dark')}
          selected={mode === 'dark'}
        >
          <Brightness4Icon sx={{ mr: 1 }} />
          Dark
        </MenuItem>
        <MenuItem 
          onClick={() => handleModeChange('system')}
          selected={mode === 'system'}
        >
          <SettingsBrightnessIcon sx={{ mr: 1 }} />
          System
        </MenuItem>
      </Menu>
    </>
  );
}