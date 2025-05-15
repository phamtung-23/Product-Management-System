import React, { useState } from 'react';
import { 
  Button,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage, type Language } from '../context/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, translate } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    handleMenuClose();
  };

  return (
    <>
      <Button
        color="inherit"
        startIcon={<LanguageIcon />}
        onClick={handleMenuOpen}
        aria-controls="language-menu"
        aria-haspopup="true"
      >
        {language.toUpperCase()}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          selected={language === 'en'} 
          onClick={() => handleLanguageChange('en')}
        >
          <ListItemIcon>
            {language === 'en' && <span>✓</span>}
          </ListItemIcon>
          <ListItemText primary={translate ? translate('nav.language') + ' (English)' : 'English'} />
        </MenuItem>
        <MenuItem 
          selected={language === 'vi'} 
          onClick={() => handleLanguageChange('vi')}
        >
          <ListItemIcon>
            {language === 'vi' && <span>✓</span>}
          </ListItemIcon>
          <ListItemText primary={translate ? translate('nav.language') + ' (Tiếng Việt)' : 'Tiếng Việt'} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
