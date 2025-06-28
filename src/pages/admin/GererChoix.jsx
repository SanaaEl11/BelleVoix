import React, { useState } from 'react';
import { Paper, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export default function GererChoix() {
  const [choix, setChoix] = useState([]);
  const [input, setInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch choices from Firestore
  React.useEffect(() => {
    const unsub = onSnapshot(collection(db, 'choices'), (snapshot) => {
      setChoix(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      await addDoc(collection(db, 'choices'), { nom: input.trim() });
      setInput('');
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(choix[index].nom);
  };

  const handleEditSave = async () => {
    const choice = choix[editIndex];
    if (choice && choice.id) {
      await updateDoc(doc(db, 'choices', choice.id), { nom: editValue });
    }
    setEditIndex(null);
    setEditValue('');
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
  };

  const confirmDelete = async () => {
    const choice = choix[deleteIndex];
    if (choice && choice.id) {
      await deleteDoc(doc(db, 'choices', choice.id));
    }
    setDeleteIndex(null);
  };

  const paginatedChoix = choix.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={2} sx={{ mt: 3, p: { xs: 1, sm: 2 }, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(220,53,69,0.08)' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#dc3545', mb: 2 }}>Gérer des choix</Typography>
      <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Nouveau choix"
          value={input}
          onChange={e => setInput(e.target.value)}
          variant="standard"
          sx={{
            flex: 1,
            '& label.Mui-focused': { color: '#dc3545' },
            '& .MuiInput-underline:after': { borderBottomColor: '#dc3545' },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: 'linear-gradient(90deg, #dc3545 60%, #F7C015 100%)',
            color: '#111',
            fontWeight: 600,
            boxShadow: '0 2px 8px 0 rgba(220,53,69,0.10)',
            '&:hover': {
              background: 'linear-gradient(90deg, #F7C015 60%, #dc3545 100%)',
              color: '#111',
            },
            minWidth: 120,
          }}
          disabled={!input.trim()}
        >
          Ajouter
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <span className="spinner-border" />
        </Box>
      ) : (
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <TableContainer sx={{ minWidth: 400 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Choix</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedChoix.map((c, i) => (
                <TableRow key={c.id || i}>
                  <TableCell>
                    {editIndex === i + page * rowsPerPage ? (
                      <TextField
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        variant="standard"
                        sx={{
                          '& label.Mui-focused': { color: '#dc3545' },
                          '& .MuiInput-underline:after': { borderBottomColor: '#dc3545' },
                        }}
                      />
                    ) : (
                      c.nom
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {editIndex === i + page * rowsPerPage ? (
                      <>
                        <Button size="small" color="primary" onClick={handleEditSave} sx={{ mr: 1, background: '#111', color: '#fff', '&:hover': { background: '#222' } }}>Enregistrer</Button>
                        <Button size="small" color="inherit" onClick={() => setEditIndex(null)}>Annuler</Button>
                      </>
                    ) : (
                      <>
                        <IconButton sx={{ color: '#F7C015' }} onClick={() => handleEdit(i + page * rowsPerPage)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(i + page * rowsPerPage)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {paginatedChoix.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ color: '#dc3545', fontWeight: 600 }}>
                    Aucun choix trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      )}
      <TablePagination
        component="div"
        count={choix.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Lignes par page"
      />
      {/* Delete confirmation dialog */}
      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Supprimer le choix</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer ce choix ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)} color="inherit">Annuler</Button>
          <Button onClick={confirmDelete} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
} 