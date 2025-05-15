import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/products';
import type { MultilingualProduct } from '../api/products';
import Navbar from '../components/Navbar';

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name_en: '',
    name_vi: '',
    price: '',
    category_en: '',
    category_vi: '',
    subcategory_en: '',
    subcategory_vi: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Reset subcategory if category changes (for both languages)
    if (name === 'category_en' || name === 'category_vi') {
      setFormData(prev => ({ ...prev, subcategory_en: '', subcategory_vi: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name_en.trim()) {
      newErrors.name_en = 'Product name (EN) is required';
    }
    
    if (!formData.name_vi.trim()) {
      newErrors.name_vi = 'Product name (VI) is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.category_en) {
      newErrors.category_en = 'Category (EN) is required';
    }
    
    if (!formData.category_vi) {
      newErrors.category_vi = 'Category (VI) is required';
    }
    
    if (!formData.subcategory_en && formData.category_en) {
      newErrors.subcategory_en = 'Subcategory (EN) is required';
    }
    
    if (!formData.subcategory_vi && formData.category_vi) {
      newErrors.subcategory_vi = 'Subcategory (VI) is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const multilingualProduct: Omit<MultilingualProduct, '_id' | 'likes' | 'likedBy'> = {
        name: { en: formData.name_en, vi: formData.name_vi },
        price: Number(formData.price),
        category: { en: formData.category_en, vi: formData.category_vi },
        subcategory: { en: formData.subcategory_en, vi: formData.subcategory_vi }
      };
      
      await createProduct(multilingualProduct);
      
      setSuccessMessage('Product created successfully!');
      
      // Reset form after successful submission
      setFormData({
        name_en: '',
        name_vi: '',
        price: '',
        category_en: '',
        category_vi: '',
        subcategory_en: '',
        subcategory_vi: ''
      });
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating product:', error);
      setErrors({
        submit: 'Failed to create product. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 4, 
            mb: 4, 
            borderRadius: 2 
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Product
          </Typography>
          
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  label="Product Name (EN)"
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.name_en}
                  helperText={errors.name_en}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Product Name (VI)"
                  name="name_vi"
                  value={formData.name_vi}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.name_vi}
                  helperText={errors.name_vi}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid size={12}>
                <TextField
                  label="Price ($)"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  fullWidth
                  required
                  error={!!errors.price}
                  helperText={errors.price}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Category (EN)"
                  name="category_en"
                  value={formData.category_en}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.category_en}
                  helperText={errors.category_en}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Category (VI)"
                  name="category_vi"
                  value={formData.category_vi}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.category_vi}
                  helperText={errors.category_vi}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Subcategory (EN)"
                  name="subcategory_en"
                  value={formData.subcategory_en}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.subcategory_en}
                  helperText={errors.subcategory_en}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Subcategory (VI)"
                  name="subcategory_vi"
                  value={formData.subcategory_vi}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.subcategory_vi}
                  helperText={errors.subcategory_vi}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid size={12} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={2000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateProduct;
