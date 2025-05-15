import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
  Pagination,
  IconButton,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../context/useAuth';
import { getProducts, toggleLikeProduct } from '../api/products';
import type { Product, PaginatedResponse } from '../api/products';
import { useNavigate } from 'react-router-dom';

interface ProductListingProps {
  onSearch?: (query: string) => void;
  searchResults?: PaginatedResponse<Product>;
}

const ProductListing: React.FC<ProductListingProps> = ({ searchResults }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (searchResults) {
      setProducts(searchResults.data);
      setTotalPages(searchResults.totalPages);
      setPage(searchResults.page);
      setLoading(false);
    } else {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults, page, limit]);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(page, limit);
      console.log('Fetched products:', response);
      if (response && response.data) {
        setProducts(response.data);
        setTotalPages(response.totalPages || 1);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };
  const handleLikeToggle = async (productId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const updatedProduct = await toggleLikeProduct(productId);
      
      // Update the products state with the updated product
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId ? updatedProduct : product
        )
      );
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to update like status. Please try again.');
    }
  };

  const isProductLikedByUser = (product: Product) => {
    if (!user || !user.id) return false;
    return product.likedBy.includes(user.id);
  };

  if (loading && !products.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !products.length) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={fetchProducts} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>      
      <Grid container spacing={3}>
        {(products || []).map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.name}
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                  ${product.price.toFixed(2)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', gap: 1, my: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={product.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip 
                    label={product.subcategory}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Typography variant="body2">
                  {product.likes} {product.likes === 1 ? 'like' : 'likes'}
                </Typography>
                <IconButton 
                  onClick={() => handleLikeToggle(product.id)}
                  color="error"
                  disabled={loading}
                >
                  {isProductLikedByUser(product) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {products && products.length === 0 && !loading && (
          <Grid size={12}>
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6">No products found</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            disabled={loading}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductListing;
