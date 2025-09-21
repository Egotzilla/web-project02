import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AppTheme from './components/AppTheme';
import AppAppBar from './components/AppAppBar';
import MainContent from './components/MainContent';
import Latest from './components/Latest';
import Footer from './components/Footer';
import Link from 'next/link';

export default function CruiseNavigator(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <MainContent />
        {/* <Latest /> */}
        
        {/* Admin Access */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4,
            pt: 4,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Link href="/admin" passHref>
            <Button 
              variant="outlined" 
              color="secondary"
              size="large"
              sx={{ 
                textTransform: 'none',
                px: 4,
                py: 1.5
              }}
            >
              Admin Dashboard
            </Button>
          </Link>
        </Box>
      </Container>
      <Footer />
    </AppTheme>
  );
}
