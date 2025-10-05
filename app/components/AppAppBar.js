'use client';

import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from './ColorModeIconDropdown';
import { useThemeMode } from './AppTheme';
 import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
import { withBasePath } from '../../lib/path';
import Link from 'next/link';

const StyledToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'isHydrated',
})(({ theme, isHydrated }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: isHydrated ? 'blur(24px)' : 'none',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: isHydrated 
    ? (theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4))
    : theme.palette.background.default,
  boxShadow: isHydrated ? theme.shadows[1] : 'none',
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const { user, logout, isAdmin } = useAuth();

  // Handle hydration to prevent SSR/client mismatch
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToFooter = () => {
    const footerElement = document.getElementById('footer-github');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
    setOpen(false); // Close mobile drawer after clicking
  };

  const scrollToSearch = () => {
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
    setOpen(false); // Close mobile drawer after clicking
  };

  return (
    <div suppressHydrationWarning>
      <AppBar
        position="fixed"
        enableColorOnDark={isHydrated}
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: isHydrated ? 'calc(var(--template-frame-height, 0px) + 28px)' : '28px',
        }}
      >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters isHydrated={isHydrated}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <img 
              src={withBasePath('/favicon.ico')}
              alt="Site Logo" 
              width={40} 
              height={40}
              style={{ marginRight: '8px' }}
            />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                component={Link}
                href="/#booking"
                onClick={scrollToSearch}
              >
                Book Cruise
              </Button>
              <Button 
                variant="text" 
                color="info" 
                size="small" 
                sx={{ minWidth: 0 }}
                onClick={scrollToFooter}
              >
                About
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {user ? (
              <>
                {isAdmin() ? (
                  <Button 
                    color="primary" 
                    variant="text" 
                    size="small"
                    component={Link}
                    href="/admin"
                  >
                    Admin Dashboard
                  </Button>
                ) : (
                  <Button 
                    color="primary" 
                    variant="text" 
                    size="small"
                    component={Link}
                    href="/profile"
                  >
                    My Profile
                  </Button>
                )}
                <Button 
                  color="primary" 
                  variant="text" 
                  size="small"
                  onClick={logout}
                >
                  Logout
                </Button>
                <Button 
                  color="primary" 
                  variant="contained" 
                  size="small"
                  component={Link}
                  href="/#booking"
                  onClick={scrollToSearch}
                >
                  Book Now
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="primary" 
                  variant="text" 
                  size="small"
                  component={Link}
                  href="/login"
                >
                  Log In
                </Button>
                <Button 
                  color="primary" 
                  variant="contained" 
                  size="small"
                  component={Link}
                  href="/#booking"
                  onClick={scrollToSearch}
                >
                  Book Now
                </Button>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem 
                  component={Link}
                  href="/#booking"
                  onClick={(e) => {
                    toggleDrawer(false)();
                    scrollToSearch();
                  }}
                >
                  Book Cruise
                </MenuItem>
                <MenuItem onClick={scrollToFooter}>About</MenuItem>
                <MenuItem>Contact</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button 
                    color="primary" 
                    variant="contained" 
                    fullWidth
                    component={Link}
                    href="/#booking"
                    onClick={(e) => {
                      toggleDrawer(false)();
                      scrollToSearch();
                    }}
                  >
                    Book Now
                  </Button>
                </MenuItem>
                {user ? (
                  <>
                    <MenuItem>
                      <Button 
                        color="primary" 
                        variant="outlined" 
                        fullWidth
                        component={Link}
                        href={isAdmin() ? "/admin" : "/profile"}
                      >
                        {isAdmin() ? 'Admin Dashboard' : 'My Profile'}
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button 
                        color="primary" 
                        variant="outlined" 
                        fullWidth
                        onClick={logout}
                      >
                        Logout
                      </Button>
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem>
                    <Button 
                      color="primary" 
                      variant="outlined" 
                      fullWidth
                      component={Link}
                      href="/login"
                    >
                      Log In
                    </Button>
                  </MenuItem>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
    </div>
  );
}
