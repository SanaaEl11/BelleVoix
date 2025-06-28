import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreerGroupe = ({ onCancel }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsCollection = collection(db, 'students');
      const studentsSnapshot = await getDocs(studentsCollection);
      const studentsList = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsList);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Erreur lors du chargement des étudiants');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError('Le nom du groupe est requis');
      return;
    }

    if (selectedStudents.length === 0) {
      setError('Veuillez sélectionner au moins un étudiant');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const groupData = {
        nom: groupName.trim(),
        etudiants: selectedStudents,
        nombreEtudiants: selectedStudents.length,
        dateCreation: serverTimestamp(),
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'groupes'), groupData);
      setSuccess(true);
      setGroupName('');
      setSelectedStudents([]);
      
      setTimeout(() => {
        setSuccess(false);
        if (onCancel) onCancel();
      }, 2000);
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Erreur lors de la création du groupe');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (event) => {
    const value = event.target.value;
    setSelectedStudents(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onCancel}
          sx={{ mr: 2 }}
        >
          Retour
        </Button>
        <Typography variant="h4" component="h1" sx={{ color: '#1c2526' }}>
          Créer un nouveau groupe
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom du groupe"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Sélectionner les étudiants</InputLabel>
                  <Select
                    multiple
                    value={selectedStudents}
                    onChange={handleStudentChange}
                    input={<OutlinedInput label="Sélectionner les étudiants" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((studentId) => {
                          const student = students.find(s => s.id === studentId);
                          return (
                            <Chip 
                              key={studentId} 
                              label={student ? `${student.nom} ${student.prenom}` : studentId} 
                              size="small"
                              onDelete={() => {
                                setSelectedStudents(selectedStudents.filter(id => id !== studentId));
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                    helperText="Vous pouvez sélectionner plusieurs étudiants"
                  >
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.nom} {student.prenom} - {student.email}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    💡 Cliquez sur plusieurs étudiants pour les ajouter au groupe. Vous pouvez supprimer un étudiant en cliquant sur le X de son chip.
                  </Typography>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: '#dc3545',
                      '&:hover': {
                        backgroundColor: '#c82333'
                      }
                    }}
                  >
                    {loading ? 'Création...' : 'Créer le groupe'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Groupe créé avec succès!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreerGroupe; 