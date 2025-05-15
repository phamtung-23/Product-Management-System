import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    // Future implementation for profile page
    handleClose();
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
            {translate('app.title')}
          </RouterLink>
        </Typography>
        
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={RouterLink} to="/">
              {translate('nav.products')}
            </Button>
            <Button color="inherit" component={RouterLink} to="/create-product">
              {translate('nav.addProduct')}
            </Button>
            {/* Add language switcher */}
            <LanguageSwitcher />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user?.username || user?.email}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user?.username ? user.username[0].toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>{translate('nav.profile')}</MenuItem>
                <MenuItem onClick={handleLogout}>{translate('nav.logout')}</MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              {translate('nav.login')}
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              {translate('nav.register')}
            </Button>
            {/* Add language switcher even for non-authenticated users */}
            <LanguageSwitcher />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
