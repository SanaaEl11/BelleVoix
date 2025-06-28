import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
// import { toast } from 'sonner'; // Uncomment if sonner is installed

export default function AddStudentForm({ onCancel }) {
  const [form, setForm] = useState({ prenom: '', nom: '', cin: '', email: '', choix: '' });
  const [courses, setCourses] = useState([]);
  const [loadingChoices, setLoadingChoices] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'choices'), (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingChoices(false);
    });
    return () => unsub();
  }, []);

  const validate = () => {
    if (!form.prenom || !form.nom || !form.cin || !form.email || !form.choix) return 'Tous les champs sont requis';
    if (!/^[a-zA-Z0-9]+$/.test(form.cin)) return 'CIN invalide';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'Email invalide';
    return '';
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validation = validate();
    if (validation) {
      setError(validation);
      // toast.error(validation);
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'students'), {
        prenom: form.prenom,
        nom: form.nom,
        cin: form.cin,
        email: form.email,
        choix: form.choix,
        status: 'Actif',
        date_inscription: new Date().toISOString().slice(0, 10)
      });
      setSuccess('Étudiant ajouté avec succès !');
      setForm({ prenom: '', nom: '', cin: '', email: '', choix: '' });
    } catch (err) {
      setError("Erreur lors de l'ajout de l'étudiant.");
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
          Ajouter un étudiant
        </Typography>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            label="Prénom"
            name="prenom"
            value={form.prenom}
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
            label="Nom"
            name="nom"
            value={form.nom}
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
            label="CIN"
            name="cin"
            value={form.cin}
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
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
            type="email"
            sx={{
              '& label.Mui-focused': { color: '#dc3545' },
              '& .MuiInput-underline:after': { borderBottomColor: '#dc3545' },
            }}
          />
          <FormControl fullWidth margin="normal" variant="standard" sx={{
            '& label.Mui-focused': { color: '#dc3545' },
            '& .MuiInput-underline:after': { borderBottomColor: '#dc3545' },
          }}>
            <InputLabel id="choix-label">Choix du cours</InputLabel>
            <Select
              labelId="choix-label"
              label="Choix du cours"
              name="choix"
              value={form.choix}
              onChange={handleChange}
              variant="standard"
              disabled={loadingChoices}
            >
              <MenuItem value=""><em>Sélectionnez un cours</em></MenuItem>
              {courses.map((c) => (
                <MenuItem key={c.id} value={c.nom}>{c.nom}</MenuItem>
              ))}
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
              {loading ? 'Inscription...' : 'Inscrire'}
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
                  background: '#333',
                  color: '#fff',
                },
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={() => onCancel ? onCancel() : navigate('/admin')}
              disabled={loading}
            >
              Annuler
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
} 