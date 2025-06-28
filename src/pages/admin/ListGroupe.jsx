/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Grid
} from '@mui/material';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';

const ListGroupe = () => {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupStudents, setGroupStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ nom: '', etudiants: [] });
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    fetchGroups();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupStudents();
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const groupsCollection = collection(db, 'groupes');
      const q = query(groupsCollection, orderBy('dateCreation', 'desc'));
      const groupsSnapshot = await getDocs(q);
      
      const groupsList = groupsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateCreation: doc.data().dateCreation ? 
          doc.data().dateCreation.toDate().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 
          doc.data().createdAt ? 
            new Date(doc.data().createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Date inconnue'
      }));
      
      setGroups(groupsList);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Erreur lors du chargement des groupes');
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const fetchGroupStudents = async () => {
    if (!selectedGroup || !selectedGroup.etudiants) return;
    
    setLoadingStudents(true);
    try {
      const studentsData = [];
      for (const studentId of selectedGroup.etudiants) {
        const studentDoc = await getDoc(doc(db, 'students', studentId));
        if (studentDoc.exists()) {
          studentsData.push({
            id: studentDoc.id,
            ...studentDoc.data()
          });
        }
      }
      setGroupStudents(studentsData);
    } catch (error) {
      console.error('Error fetching group students:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleViewGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleEdit = (index) => {
    const group = groups[index];
    setEditForm({
      nom: group.nom,
      etudiants: group.etudiants || []
    });
    setEditIndex(index);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSave = async () => {
    const group = groups[editIndex];
    if (group && group.id) {
      try {
        await updateDoc(doc(db, 'groupes', group.id), {
          nom: editForm.nom,
          etudiants: editForm.etudiants,
          nombreEtudiants: editForm.etudiants.length,
        });
        setEditIndex(null);
        // Refresh groups list
        fetchGroups();
      } catch (error) {
        console.error('Error updating group:', error);
        setError('Erreur lors de la mise à jour du groupe');
      }
    }
  };

  const handleEditCancel = () => {
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
  };

  const confirmDelete = async () => {
    const group = groups[deleteIndex];
    if (group && group.id) {
      try {
        await deleteDoc(doc(db, 'groupes', group.id));
        setDeleteIndex(null);
        // Refresh groups list
        fetchGroups();
      } catch (error) {
        console.error('Error deleting group:', error);
        setError('Erreur lors de la suppression du groupe');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteIndex(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <GroupIcon sx={{ mr: 2, fontSize: 32, color: '#dc3545' }} />
        <Typography variant="h4" component="h1" sx={{ color: '#1c2526' }}>
          Liste des groupes
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {groups.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                Aucun groupe trouvé
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Créez votre premier groupe pour commencer
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#1c2526' }}>
                      Nom du groupe
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#1c2526' }}>
                      Nombre d'étudiants
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#1c2526' }}>
                      Date de création
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#1c2526', textAlign: 'center' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groups.map((group, index) => (
                    <TableRow key={group.id} hover>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {group.nom}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${group.nombreEtudiants} étudiant${group.nombreEtudiants > 1 ? 's' : ''}`}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {group.dateCreation}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="Voir les détails">
                            <IconButton
                              size="small"
                              onClick={() => handleViewGroup(group)}
                              sx={{ color: '#000000' }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(index)}
                              sx={{ color: '#ffc107' }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(index)}
                              sx={{ color: '#dc3545' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {selectedGroup && (
        <Dialog 
          open={!!selectedGroup} 
          onClose={() => setSelectedGroup(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e9ecef'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupIcon sx={{ mr: 2, color: '#dc3545' }} />
              <Typography variant="h6" sx={{ color: '#1c2526' }}>
                Détails du groupe: {selectedGroup.nom}
              </Typography>
            </Box>
            <IconButton onClick={() => setSelectedGroup(null)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Group Information */}
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1c2526' }}>
                      Informations du groupe
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Nom du groupe:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedGroup.nom}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Nombre d'étudiants:</Typography>
                        <Chip 
                          label={`${selectedGroup.nombreEtudiants} étudiant${selectedGroup.nombreEtudiants > 1 ? 's' : ''}`}
                          color="primary"
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Date de création:</Typography>
                        <Typography variant="body2">
                          {selectedGroup.dateCreation}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Students List */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1c2526' }}>
                      Étudiants du groupe
                    </Typography>
                    
                    {loadingStudents ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : groupStudents.length === 0 ? (
                      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                        Aucun étudiant trouvé dans ce groupe
                      </Typography>
                    ) : (
                      <List sx={{ p: 0 }}>
                        {groupStudents.map((student, index) => (
                          <React.Fragment key={student.id}>
                            <ListItem sx={{ px: 0 }}>
                              <Avatar sx={{ mr: 2, bgcolor: '#dc3545', width: 32, height: 32 }}>
                                <PersonIcon fontSize="small" />
                              </Avatar>
                              <ListItemText
                                primary={`${student.nom} ${student.prenom}`}
                                secondary={student.email}
                                primaryTypographyProps={{ 
                                  variant: 'body2', 
                                  sx: { fontWeight: 500 } 
                                }}
                                secondaryTypographyProps={{ 
                                  variant: 'caption' 
                                }}
                              />
                            </ListItem>
                            {index < groupStudents.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
            <Button 
              onClick={() => setSelectedGroup(null)}
              variant="contained"
              sx={{
                backgroundColor: '#dc3545',
                '&:hover': {
                  backgroundColor: '#c82333'
                }
              }}
            >
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Edit Dialog */}
      <Dialog open={editIndex !== null} onClose={handleEditCancel}>
        <DialogTitle>Éditer le groupe</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom du groupe"
            name="nom"
            value={editForm.nom}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Sélectionner les étudiants</InputLabel>
            <Select
              multiple
              name="etudiants"
              value={editForm.etudiants}
              onChange={handleEditChange}
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
                      />
                    );
                  })}
                </Box>
              )}
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.nom} {student.prenom} - {student.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} color="inherit">Annuler</Button>
          <Button
            onClick={handleEditSave}
            sx={{
              background: 'linear-gradient(90deg, #dc3545 60%, #F7C015 100%)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px 0 rgba(220,53,69,0.10)',
              '&:hover': {
                background: 'linear-gradient(90deg, #F7C015 60%, #dc3545 100%)',
                color: '#fff',
              },
            }}
            variant="contained"
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteIndex !== null} onClose={handleDeleteCancel}>
        <DialogTitle>Supprimer le groupe</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer ce groupe ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">Annuler</Button>
          <Button onClick={confirmDelete} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListGroupe; 
