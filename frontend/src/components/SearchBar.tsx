import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSearch}
      sx={{ 
        width: '100%', 
        maxWidth: { xs: '100%', sm: '400px' }, 
        mb: 3,
        mt: 2
      }}
    >
      <TextField
        fullWidth
        placeholder="Search products..."
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{ 
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
      />
    </Box>
  );
};

export default SearchBar;
