import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../hooks/useProducts";
import { toggleLikeProduct } from "../api/products";
import type { Product, PaginatedResponse } from "../api/products";
import { useNavigate } from "react-router-dom";

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
  const [likeInProgress, setLikeInProgress] = useState<string | null>(null); // Track which product is being liked
  const { user, isAuthenticated } = useAuth();
  const { translate, language } = useLanguage();
  const navigate = useNavigate();

  // React Query for products
  const {
    data: queryData,
    isLoading: queryLoading,
    isError: queryError,
    refetch: refetchProducts,
  } = useProducts(page, limit);

  useEffect(() => {
    if (searchResults) {
      setProducts(searchResults.data);
      setTotalPages(searchResults.totalPages);
      setPage(searchResults.page);
      setLoading(false);
    } else if (queryData) {
      setProducts(queryData.data);
      setTotalPages(queryData.totalPages);
      setLoading(false);
    } else if (queryLoading) {
      setLoading(true);
    } else if (queryError) {
      setError("Failed to load products. Please try again later.");
      setLoading(false);
    }
  }, [searchResults, queryData, queryLoading, queryError]);

  // Refetch products when language changes
  useEffect(() => {
    refetchProducts();
  }, [language, refetchProducts]);

  const fetchProducts = async () => {
    // Use refetch from React Query
    refetchProducts();
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  }; // Add an animation for successful like/unlike
  const [animatingLike, setAnimatingLike] = useState<string | null>(null);

  const handleLikeToggle = async (productId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Find the product to update
    const productToUpdate = products.find(
      (product) => product.id === productId
    );
    if (!productToUpdate) return;

    // Don't allow multiple clicks while processing
    if (likeInProgress === productId) return;

    // Set like in progress state to show loading indicator
    setLikeInProgress(productId);

    // Get the user ID safely
    const userId = user?.id;
    if (!userId) {
      setLikeInProgress(null);
      return;
    }

    // Determine whether we're liking or unliking
    const isCurrentlyLiked = isProductLikedByUser(productToUpdate);
    const likeDelta = isCurrentlyLiked ? -1 : 1;

    // Clone the current product to create an optimistic update
    const optimisticProduct = {
      ...productToUpdate,
      likes: productToUpdate.likes + likeDelta,
      likedBy: isCurrentlyLiked
        ? productToUpdate.likedBy.filter((id) => id !== userId)
        : [...productToUpdate.likedBy, userId],
    };

    // Apply optimistic update immediately
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? optimisticProduct : product
      )
    );

    // Call API in the background
    try {
      const updatedProduct = await toggleLikeProduct(productId);

      // Update with actual server response (in case there's any discrepancy)
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? updatedProduct : product
        )
      );

      // Show animation feedback when successful
      setAnimatingLike(productId);
      setTimeout(() => setAnimatingLike(null), 1000); // Reset after animation completes
    } catch (err) {
      console.error("Error toggling like:", err);

      // Revert optimistic update on error
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? productToUpdate : product
        )
      );

      setError("Failed to update like status. Please try again.");
    } finally {
      // Clear like in progress state
      setLikeInProgress(null);
    }
  };

  const isProductLikedByUser = (product: Product) => {
    if (!user || !user.id) return false;
    return product.likedBy.includes(user.id);
  };

  if (loading && !products.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !products.length) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
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
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.name}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ mb: 1 }}
                >
                  {translate('product.price')}: ${product.price.toFixed(2)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", gap: 1, my: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={translate('product.category') + ': ' + product.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={translate('product.subcategory') + ': ' + product.subcategory}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="caption" color="textSecondary">
                  {translate('product.category')}: {product.category}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  {translate('product.subcategory')}: {product.subcategory}
                </Typography>
              </CardContent>
              <CardActions
                sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
              >
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    animation:
                      animatingLike === product.id
                        ? "bounce 0.5s ease"
                        : "none",
                    "@keyframes bounce": {
                      "0%": { transform: "translateY(0)" },
                      "50%": { transform: "translateY(-5px)" },
                      "100%": { transform: "translateY(0)" },
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight:
                        animatingLike === product.id ? "bold" : "normal",
                    }}
                  >
                    {product.likes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {translate('product.likes')}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleLikeToggle(product.id)}
                  color="error"
                  disabled={loading || likeInProgress === product.id}
                  sx={{
                    transition: "transform 0.2s",
                    transform: isProductLikedByUser(product)
                      ? animatingLike === product.id
                        ? "scale(1.4)"
                        : "scale(1.15)"
                      : "scale(1)",
                    "&:hover": {
                      transform: isProductLikedByUser(product)
                        ? "scale(1.25)"
                        : "scale(1.1)",
                    },
                    animation:
                      likeInProgress === product.id
                        ? "pulse 1s infinite"
                        : animatingLike === product.id
                        ? "pop 0.5s ease"
                        : "none",
                    "@keyframes pulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.6 },
                      "100%": { opacity: 1 },
                    },
                    "@keyframes pop": {
                      "0%": { transform: "scale(1.15)" },
                      "50%": { transform: "scale(1.4)" },
                      "100%": { transform: "scale(1.15)" },
                    },
                  }}
                >
                  {likeInProgress === product.id ? (
                    <CircularProgress size={20} color="error" />
                  ) : isProductLikedByUser(product) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {products && products.length === 0 && !loading && (
          <Grid size={12}>
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography variant="h6">{translate('product.noProductsFound') || 'No products found'}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>{" "}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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
