import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

export default function AjouterOrder() {
  return (
    <Box sx={{ maxWidth: { xs: '100%', sm: 600 }, mx: 'auto', mt: { xs: 2, sm: 4 }, p: { xs: 1, sm: 3, md: 4 }, background: '#fff', borderRadius: 2, boxShadow: 2, width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Ajouter Order
      </Typography>
      <form>
        <TextField label="Order Name" fullWidth margin="normal" />
        <TextField label="Description" fullWidth margin="normal" multiline rows={3} />
        <TextField label="Amount" type="number" fullWidth margin="normal" />
        <Button variant="contained" color="primary" sx={{ mt: 2, width: { xs: '100%', sm: 'auto' } }} fullWidth={true}>
          Ajouter
        </Button>
      </form>
    </Box>
  );
} 