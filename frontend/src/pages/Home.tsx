import React from 'react';
import Navbar from '../components/Navbar';
import { Box, Typography } from '@mui/material';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Product Management App
        </Typography>
        <Typography variant="body1">
          This is the protected Home page. Use the navigation bar to explore products, add new products, or manage your account.
        </Typography>
      </Box>
    </>
  );
};

export default Home;
