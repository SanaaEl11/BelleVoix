/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Alert, CircularProgress } from '@mui/material';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

export default function AddPayment({ onCancel }) {
  const [form, setForm] = useState({ student: '', month: '', amount: '', status: 'Payé' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // Fetch students from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'students'), (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingStudents(false);
    });
    return () => unsub();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.student || !form.month || !form.amount || !form.status) {
      setError('Tous les champs sont requis.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'payments'), {
        studentId: form.student,
        month: form.month,
        amount: form.amount,
        status: form.status,
        date_payment: form.status === 'Payé' ? new Date().toISOString().slice(0, 10) : ''
      });
      setSuccess('Paiement ajouté avec succès !');
      setForm({ student: '', month: '', amount: '', status: 'Payé' });
    } catch (err) {
      setError("Erreur lors de l'ajout du paiement.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '70vh',
      mt: { xs: 2, sm: 4 },
      px: { xs: 0.5, sm: 2, md: 4 },
      width: '100%',
    }}>
      <Paper elevation={4} sx={{
        p: { xs: 1.5, sm: 3, md: 4 },
        minWidth: { xs: '100%', sm: 340, md: 480 },
        maxWidth: { xs: '100%', sm: 600, md: 600 },
        width: { xs: '100%', sm: '90%', md: '100%' },
        borderRadius: 3,
        background: '#fff',
        boxShadow: '0 2px 16px 0 rgba(220,53,69,0.07)',
        border: '2px solid #f0f0f0',
        mx: { xs: 0, sm: 'auto' },
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 700,
          mb: 2,
          background: 'linear-gradient(90deg, #dc3545 60%, #F7C015 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Ajouter un paiement
        </Typography>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal" variant="standard" sx={{
            '& label.Mui-focused': { color: '#dc3545' },
            '& .MuiInput-underline:after': { borderBottomColor: '#dc3545' },
          }}>
            <InputLabel id="student-label">Étudiant</InputLabel>
            <Select
              labelId="student-label"
              name="student"
              value={form.student}
              onChange={handleChange}
              label="Étudiant"
              variant="standard"
              disabled={loadingStudents}
            >
              <MenuItem value=""><em>Sélectionnez un étudiant</em></MenuItem>
              {students.map(s => (
                <MenuItem key={s.id} value={s.id}>{s.prenom} {s.nom}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Mois"
            name="month"
            type="month"
            value={form.month}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
            sx={{
              '& label.Mui-focused': { color: '#dc3545' },
              '& .MuiInput-underline:after': { borderBottomColor: '#dc3545' },
            }}
          />
          <TextField
            label="Montant"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
            sx={{
              '& label.Mui-focused': { color: '#dc3545' },
              '& .MuiInput-underline:after': { borderBottomColor: '#dc3545' },
            }}
          />
          <FormControl fullWidth margin="normal" variant="standard" sx={{
            '& label.Mui-focused': { color: '#dc3545' },
            '& .MuiInput-underline:after': { borderBottomColor: '#dc3545' },
          }}>
            <InputLabel id="status-label">Statut</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={form.status}
              onChange={handleChange}
              label="Statut"
              variant="standard"
            >
              <MenuItem value="Payé">Payé</MenuItem>
              <MenuItem value="Non payé">Non payé</MenuItem>
            </Select>
          </FormControl>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #dc3545 60%, #F7C015 100%)',
                color: '#fff',
                fontWeight: 600,
                boxShadow: '0 2px 8px 0 rgba(220,53,69,0.10)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #F7C015 60%, #dc3545 100%)',
                  color: '#fff',
                },
                minWidth: 120,
                width: { xs: '100%', sm: 'auto' },
              }}
              disabled={loading}
              startIcon={loading && <CircularProgress size={18} sx={{ color: '#fff' }} />}
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={{
                background: '#111',
                color: '#fff',
                fontWeight: 600,
                minWidth: 120,
                boxShadow: 'none',
                '&:hover': {
                  background: '#222',
                  color: '#fff',
                },
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={onCancel}
            >
              Annuler
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
} 
