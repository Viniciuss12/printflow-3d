// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const drawerWidth = 240;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header 
        open={open} 
        drawerWidth={drawerWidth} 
        toggleDrawer={toggleDrawer} 
      />
      
      {/* Sidebar */}
      <Sidebar 
        open={open} 
        drawerWidth={drawerWidth} 
        toggleDrawer={toggleDrawer} 
      />
      
      {/* Área de Conteúdo */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
