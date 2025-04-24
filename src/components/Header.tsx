import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  title: string;
  onNewCardClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onNewCardClick }) => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        
        {user && (
          <>
            {onNewCardClick && (
              <Button 
                color="inherit" 
                onClick={onNewCardClick}
                sx={{ mr: 2 }}
              >
                Nova Solicitação
              </Button>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                {user.name}
              </Typography>
              <Button color="inherit" onClick={logout}>
                Sair
              </Button>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
