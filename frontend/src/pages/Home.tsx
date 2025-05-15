import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ProductListing from '../components/ProductListing';
import SearchBar from '../components/SearchBar';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { searchProducts } from '../api/products';
import type { PaginatedResponse, Product } from '../api/products';

const Home: React.FC = () => {
  const [searchResults, setSearchResults] = useState<PaginatedResponse<Product> | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await searchProducts(query);
        if (results) {
          setSearchResults(results);
        } else {
          setSearchResults(null);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults(null);
      }
    } else {
      setSearchResults(null);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            mb: 2 
          }}>
            <Typography variant="h4" component="h1" sx={{ mb: { xs: 2, sm: 0 } }}>
              {searchQuery ? 'Search Results' : 'Product Listing'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/create-product')}
            >
              Add Product
            </Button>
          </Box>

          <SearchBar onSearch={handleSearch} />
          
          {searchResults ? (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing results for "{searchQuery}"
              </Typography>
              <ProductListing searchResults={searchResults} />
            </Box>
          ) : (
            <ProductListing />
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;
